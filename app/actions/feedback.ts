'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

const BLIND_WINDOW_DAYS = 5;

const submitFeedbackSchema = z.object({
  sessionId: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

export async function submitSessionFeedbackAction(data: { sessionId: string; stars: number; comment?: string }) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (!authData.user || error) {
    return { success: false, message: 'Unauthorised' };
  }

  const parsed = submitFeedbackSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { sessionId, stars, comment } = parsed.data;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      mentorProfile: { select: { userId: true } },
      menteeProfile: { select: { userId: true } }
    }
  });

  if (!session) {
    return { success: false, message: 'Session not found' };
  }

  if (session.status === 'CANCELED') {
    return { success: false, message: 'Cannot rate a canceled session' };
  }

  if (new Date(session.endTime) > new Date()) {
    return { success: false, message: 'Session has not ended yet' };
  }

  const isMentor = session.mentorProfile.userId === authData.user.id;
  const isMentee = session.menteeProfile.userId === authData.user.id;

  if (!isMentor && !isMentee) {
    return { success: false, message: 'You are not a participant of this session' };
  }

  const role = isMentor ? 'MENTOR' : 'MENTEE';
  const windowClosesAt = new Date(session.endTime);
  windowClosesAt.setDate(windowClosesAt.getDate() + BLIND_WINDOW_DAYS);

  try {
    await prisma.sessionFeedback.create({
      data: { sessionId, authorId: authData.user.id, role, stars, comment, windowClosesAt }
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: 'You have already submitted feedback for this session' };
    }
    logger.error('Failed to submit feedback', { userId: authData.user.id, sessionId, err });
    return { success: false, message: 'Could not submit feedback. Please try again.' };
  }

  logger.info('Session feedback submitted', { userId: authData.user.id, sessionId, role, stars });

  revalidatePath('/dashboard/sessions');
  revalidatePath('/dashboard');
  return { success: true, message: 'Feedback submitted' };
}

const sessionFeedbackSchema = z.object({
  sessionId: z.string().uuid()
});

export async function getSessionFeedbackAction(sessionId: string) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (!authData.user || error) {
    return { success: false, message: 'Unauthorised', data: null };
  }

  const parsed = sessionFeedbackSchema.safeParse({ sessionId });
  if (!parsed.success) {
    return { success: false, message: 'Invalid session ID', data: null };
  }

  const { sessionId: validSessionId } = parsed.data;

  const session = await prisma.session.findUnique({
    where: { id: validSessionId },
    include: {
      mentorProfile: { select: { userId: true } },
      menteeProfile: { select: { userId: true } },
      feedback: true
    }
  });

  if (!session) {
    return { success: false, message: 'Session not found', data: null };
  }

  const isMentor = session.mentorProfile.userId === authData.user.id;
  const isMentee = session.menteeProfile.userId === authData.user.id;

  if (!isMentor && !isMentee) {
    return { success: false, message: 'You are not a participant of this session', data: null };
  }

  const myFeedback = session.feedback.find((f) => f.authorId === authData.user!.id) ?? null;
  const otherFeedback = session.feedback.find((f) => f.authorId !== authData.user!.id) ?? null;

  // Blind window: only reveal other party's feedback after window closes
  const windowClosed = otherFeedback ? new Date() >= new Date(otherFeedback.windowClosesAt) : false;

  return {
    success: true,
    message: 'OK',
    data: {
      myFeedback: myFeedback
        ? { stars: myFeedback.stars, comment: myFeedback.comment, submittedAt: myFeedback.submittedAt.toISOString() }
        : null,
      otherFeedback:
        otherFeedback && windowClosed
          ? {
              stars: otherFeedback.stars,
              comment: otherFeedback.comment,
              submittedAt: otherFeedback.submittedAt.toISOString()
            }
          : null,
      windowClosesAt: otherFeedback?.windowClosesAt.toISOString() ?? null,
      hasOtherSubmitted: !!otherFeedback
    }
  };
}
