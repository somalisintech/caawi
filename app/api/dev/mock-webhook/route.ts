import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * DEV-ONLY: Simulates Calendly webhook events without signature verification.
 * Creates or cancels sessions directly in the database.
 *
 * POST /api/dev/mock-webhook
 * Body: { action: 'book' | 'cancel', mentorProfileId, menteeProfileId, eventName?, startTime?, endTime? }
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const body = await req.json();
  const { action, mentorProfileId, menteeProfileId, eventName, startTime, endTime } = body;

  if (!mentorProfileId || !menteeProfileId) {
    return NextResponse.json({ error: 'mentorProfileId and menteeProfileId are required' }, { status: 400 });
  }

  if (action === 'book') {
    const now = new Date();
    const start = startTime ? new Date(startTime) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + 30 * 60 * 1000);
    const mockUri = `mock://calendly/event/${crypto.randomUUID()}`;

    const session = await prisma.session.create({
      data: {
        calendlyEventUri: mockUri,
        eventName: eventName || 'Mock Mentoring Session',
        startTime: start,
        endTime: end,
        mentorProfileId,
        menteeProfileId
      }
    });

    return NextResponse.json({ ok: true, session });
  }

  if (action === 'cancel') {
    const { sessionId } = body;
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required for cancel' }, { status: 400 });
    }

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'CANCELED', canceledAt: new Date() }
    });

    return NextResponse.json({ ok: true, session });
  }

  return NextResponse.json({ error: 'action must be "book" or "cancel"' }, { status: 400 });
}

/**
 * GET /api/dev/mock-webhook
 * Returns mentors and mentees for the mock booking form.
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const [mentors, mentees, sessions] = await Promise.all([
    prisma.profile.findMany({
      where: {
        userType: 'MENTOR',
        user: {
          OR: [
            { firstName: { contains: 'mohamed', mode: 'insensitive' } },
            { lastName: { contains: 'mohamed', mode: 'insensitive' } }
          ]
        }
      },
      select: {
        id: true,
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      take: 50
    }),
    prisma.profile.findMany({
      where: {
        userType: 'MENTEE',
        user: {
          OR: [
            { firstName: { contains: 'mohamed', mode: 'insensitive' } },
            { lastName: { contains: 'mohamed', mode: 'insensitive' } }
          ]
        }
      },
      select: {
        id: true,
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      take: 50
    }),
    prisma.session.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { startTime: 'desc' },
      take: 10,
      select: {
        id: true,
        eventName: true,
        startTime: true,
        status: true,
        mentorProfile: {
          select: { user: { select: { firstName: true, lastName: true } } }
        },
        menteeProfile: {
          select: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    })
  ]);

  return NextResponse.json({ mentors, mentees, sessions });
}
