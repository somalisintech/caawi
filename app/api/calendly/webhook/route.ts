import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY ?? '';

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', SIGNING_KEY);
  hmac.update(payload, 'utf8');
  const digest = hmac.digest('hex');
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: Request) {
  if (!SIGNING_KEY) {
    logger.error('[webhook] Missing CALENDLY_WEBHOOK_SIGNING_KEY');
    return NextResponse.json({ error: 'Webhook signing key not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('calendly-webhook-signature');

  // Parse Calendly's composite signature header: t=<timestamp>,v1=<sig>
  let sig = signature ?? '';
  const tMatch = sig.match(/(?:^|,)t=([^,]+)/);
  const v1Match = sig.match(/(?:^|,)v1=([^,]+)/);

  const timestamp = tMatch?.[1] ?? '';
  sig = v1Match?.[1] ?? '';

  // Reject stale webhooks (> 5 minutes)
  const tsSeconds = Number(timestamp);
  if (!tsSeconds || Math.abs(Date.now() / 1000 - tsSeconds) > 300) {
    return NextResponse.json({ error: 'Invalid or stale signature' }, { status: 401 });
  }

  const signedPayload = `${timestamp}.${body}`;
  if (!sig || !verifySignature(signedPayload, sig)) {
    logger.error('[webhook] Invalid signature', { signature });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    logger.error('[webhook] Failed to parse request body');
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const eventType = event.event as string;
  const payload = event.payload;

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
    }
  } catch (err) {
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

  if (!hostUserUri) {
    logger.error('[webhook:created] No host user URI in event', { calendlyEventUri });
    return;
  }

  // Look up mentor via CalendlyUser URI → profileId
  const calendlyUser = await prisma.calendlyUser.findUnique({
    where: { uri: hostUserUri },
    select: { profileId: true }
  });

  if (!calendlyUser) {
    logger.warn('[webhook:created] No CalendlyUser for host', { hostUserUri });
    return;
  }

  // Look up mentee via email → User → Profile
  const menteeUser = await prisma.user.findUnique({
    where: { email: inviteeEmail },
    select: { profile: { select: { id: true } } }
  });

  if (!menteeUser?.profile) {
    // Invitee is not a platform user — skip
    return;
  }

  // Upsert session (idempotent on calendlyEventUri)
  await prisma.session.upsert({
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
}

async function handleInviteeCanceled(payload: Record<string, unknown>) {
  const scheduledEvent = payload.scheduled_event as Record<string, unknown>;
  const calendlyEventUri = scheduledEvent.uri as string;

  const session = await prisma.session.findUnique({
    where: { calendlyEventUri }
  });

  if (!session) {
    return;
  }

  await prisma.session.update({
    where: { calendlyEventUri },
    data: {
      status: 'CANCELED',
      canceledAt: new Date()
    }
  });
}
