import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY ?? '';

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', SIGNING_KEY);
  hmac.update(payload, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: Request) {
  console.log('[webhook] ⚡ POST /api/calendly/webhook hit');

  const body = await req.text();
  const signature = req.headers.get('calendly-webhook-signature');

  console.log('[webhook] Signature header:', signature);
  console.log('[webhook] Body length:', body.length);

  // Parse Calendly's composite signature header: t=<timestamp>,v1=<sig>
  let sig = signature ?? '';
  if (sig.includes('v1=')) {
    sig = sig.split('v1=')[1] ?? '';
  }

  if (!sig || !verifySignature(body, sig)) {
    console.error('[webhook] ❌ Invalid signature');
    logger.error('[webhook] Invalid signature', { signature });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  console.log('[webhook] ✅ Signature verified');

  const event = JSON.parse(body);
  const eventType = event.event as string;
  const payload = event.payload;

  console.log('[webhook] Event type:', eventType);
  console.log('[webhook] Payload:', JSON.stringify(payload, null, 2));

  logger.info(`[webhook] Received ${eventType}`, {
    eventUri: payload?.uri,
    eventType,
    inviteeEmail: payload?.email
  });

  try {
    if (eventType === 'invitee.created') {
      await handleInviteeCreated(payload);
    } else if (eventType === 'invitee.canceled') {
      await handleInviteeCanceled(payload);
    } else {
      console.warn('[webhook] Unknown event type:', eventType);
    }
  } catch (err) {
    console.error('[webhook] ❌ Error processing event:', err);
    logger.error('[webhook] Error processing event', {
      eventType,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}

async function handleInviteeCreated(payload: Record<string, unknown>) {
  const scheduledEvent = payload.scheduled_event as Record<string, unknown>;
  const calendlyEventUri = scheduledEvent.uri as string;
  const eventName = scheduledEvent.name as string | undefined;
  const startTime = scheduledEvent.start_time as string;
  const endTime = scheduledEvent.end_time as string;
  const inviteeEmail = payload.email as string;

  // Extract event memberships to find the mentor (host)
  const memberships = scheduledEvent.event_memberships as Array<{ user: string }>;
  const hostUserUri = memberships?.[0]?.user;

  console.log('[webhook:created] Event URI:', calendlyEventUri);
  console.log('[webhook:created] Invitee email:', inviteeEmail);
  console.log('[webhook:created] Host URI:', hostUserUri);
  console.log('[webhook:created] Time:', startTime, '→', endTime);

  if (!hostUserUri) {
    console.error('[webhook:created] ❌ No host user URI in event');
    return;
  }

  // Look up mentor via CalendlyUser URI → profileId
  const calendlyUser = await prisma.calendlyUser.findUnique({
    where: { uri: hostUserUri },
    select: { profileId: true }
  });

  console.log('[webhook:created] CalendlyUser lookup:', calendlyUser);

  if (!calendlyUser) {
    console.warn('[webhook:created] ❌ No CalendlyUser for host:', hostUserUri);
    return;
  }

  // Look up mentee via email → User → Profile
  const menteeUser = await prisma.user.findUnique({
    where: { email: inviteeEmail },
    select: { profile: { select: { id: true } } }
  });

  console.log('[webhook:created] Mentee lookup:', menteeUser);

  if (!menteeUser?.profile) {
    console.log('[webhook:created] ⏭️ No platform user for', inviteeEmail, '— skipping');
    return;
  }

  // Upsert session (idempotent on calendlyEventUri)
  const session = await prisma.session.upsert({
    where: { calendlyEventUri },
    create: {
      calendlyEventUri,
      eventName: eventName ?? null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      mentorProfileId: calendlyUser.profileId,
      menteeProfileId: menteeUser.profile.id
    },
    update: {
      eventName: eventName ?? null,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    }
  });

  console.log('[webhook:created] ✅ Session upserted:', session.id);
}

async function handleInviteeCanceled(payload: Record<string, unknown>) {
  const scheduledEvent = payload.scheduled_event as Record<string, unknown>;
  const calendlyEventUri = scheduledEvent.uri as string;

  console.log('[webhook:canceled] Event URI:', calendlyEventUri);

  const session = await prisma.session.findUnique({
    where: { calendlyEventUri }
  });

  if (!session) {
    console.warn('[webhook:canceled] ❌ No session found for event');
    return;
  }

  await prisma.session.update({
    where: { calendlyEventUri },
    data: {
      status: 'CANCELED',
      canceledAt: new Date()
    }
  });

  console.log('[webhook:canceled] ✅ Session canceled:', session.id);
}
