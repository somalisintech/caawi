'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

const createNoteSchema = z.object({
  sessionId: z.string().uuid(),
  type: z.enum(['PRE_SESSION', 'POST_SESSION']),
  content: z.string().min(1).max(5000)
});

const updateNoteSchema = z.object({
  noteId: z.string().uuid(),
  content: z.string().min(1).max(5000)
});

const deleteNoteSchema = z.object({
  noteId: z.string().uuid()
});

async function getAuthUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) return null;
  return data.user;
}

async function verifySessionParticipant(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      mentorProfile: { select: { userId: true } },
      menteeProfile: { select: { userId: true } }
    }
  });

  if (!session) return null;

  const isMentor = session.mentorProfile.userId === userId;
  const isMentee = session.menteeProfile.userId === userId;

  if (!isMentor && !isMentee) return null;

  return { session, isMentor, isMentee };
}

export async function createSessionNoteAction(data: { sessionId: string; type: string; content: string }) {
  const user = await getAuthUser();
  if (!user) return { success: false, message: 'Unauthorised' };

  const parsed = createNoteSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Invalid data' };

  const { sessionId, type, content } = parsed.data;

  const participant = await verifySessionParticipant(sessionId, user.id);
  if (!participant) return { success: false, message: 'Session not found or not a participant' };

  // Pre-session notes: only mentee can create
  if (type === 'PRE_SESSION' && !participant.isMentee) {
    return { success: false, message: 'Only mentees can create pre-session agendas' };
  }

  // Server-side timing guards — client flags are bypassable
  const now = new Date();
  const sessionEnded = new Date(participant.session.endTime) < now;

  if (type === 'PRE_SESSION' && sessionEnded) {
    return { success: false, message: 'Session has already ended' };
  }
  if (type === 'POST_SESSION' && !sessionEnded) {
    return { success: false, message: 'Session has not ended yet' };
  }

  if (type === 'PRE_SESSION') {
    const existing = await prisma.sessionNote.findFirst({
      where: { sessionId, authorId: user.id, type: 'PRE_SESSION' }
    });
    if (existing) return { success: false, message: 'An agenda already exists for this session' };
  }

  try {
    const note = await prisma.sessionNote.create({
      data: { sessionId, authorId: user.id, type, content }
    });
    logger.info('Session note created', { userId: user.id, sessionId, type, noteId: note.id });
    revalidatePath('/dashboard/sessions');
    return { success: true, message: 'Note saved', data: { id: note.id } };
  } catch (err) {
    logger.error('Failed to create session note', { userId: user.id, sessionId, err });
    return { success: false, message: 'Could not save note. Please try again.' };
  }
}

export async function updateSessionNoteAction(data: { noteId: string; content: string }) {
  const user = await getAuthUser();
  if (!user) return { success: false, message: 'Unauthorised' };

  const parsed = updateNoteSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Invalid data' };

  const { noteId, content } = parsed.data;

  const note = await prisma.sessionNote.findUnique({ where: { id: noteId } });
  if (!note) return { success: false, message: 'Note not found' };
  if (note.authorId !== user.id) return { success: false, message: 'You can only edit your own notes' };

  try {
    await prisma.sessionNote.update({ where: { id: noteId }, data: { content } });
    logger.info('Session note updated', { userId: user.id, noteId });
    revalidatePath('/dashboard/sessions');
    return { success: true, message: 'Note updated' };
  } catch (err) {
    logger.error('Failed to update session note', { userId: user.id, noteId, err });
    return { success: false, message: 'Could not update note. Please try again.' };
  }
}

export async function deleteSessionNoteAction(data: { noteId: string }) {
  const user = await getAuthUser();
  if (!user) return { success: false, message: 'Unauthorised' };

  const parsed = deleteNoteSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Invalid data' };

  const { noteId } = parsed.data;

  const note = await prisma.sessionNote.findUnique({ where: { id: noteId } });
  if (!note) return { success: false, message: 'Note not found' };
  if (note.authorId !== user.id) return { success: false, message: 'You can only delete your own notes' };

  try {
    await prisma.sessionNote.delete({ where: { id: noteId } });
    logger.info('Session note deleted', { userId: user.id, noteId });
    revalidatePath('/dashboard/sessions');
    return { success: true, message: 'Note deleted' };
  } catch (err) {
    logger.error('Failed to delete session note', { userId: user.id, noteId, err });
    return { success: false, message: 'Could not delete note. Please try again.' };
  }
}

export async function getSessionNotesAction(sessionId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, message: 'Unauthorised', data: null };

  const participant = await verifySessionParticipant(sessionId, user.id);
  if (!participant) return { success: false, message: 'Session not found or not a participant', data: null };

  const notes = await prisma.sessionNote.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' }
  });

  return {
    success: true,
    message: 'OK',
    data: {
      notes: notes.map((n) => ({
        id: n.id,
        authorId: n.authorId,
        type: n.type,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
        isOwn: n.authorId === user.id
      })),
      isMentor: participant.isMentor,
      isMentee: participant.isMentee,
      sessionEnded: new Date(participant.session.endTime) < new Date()
    }
  };
}
