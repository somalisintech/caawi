'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { resend } from '@/lib/email';
import { NudgeEmail } from '@/lib/emails/nudge';
import { createClient } from '@/utils/supabase/server';

const NUDGE_COOLDOWN_DAYS = 7;

export async function nudgeMenteeAction(requestId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      return { success: false, message: 'Unauthorised' };
    }

    const mentorUser = await prisma.user.findUnique({
      where: { email: data.user.email },
      select: {
        firstName: true,
        lastName: true,
        profile: { select: { id: true, userType: true } }
      }
    });

    if (!mentorUser?.profile || mentorUser.profile.userType !== 'MENTOR') {
      return { success: false, message: 'Only mentors can nudge mentees' };
    }

    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        menteeProfile: {
          include: { user: { select: { email: true } } }
        }
      }
    });

    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.mentorProfileId !== mentorUser.profile.id) {
      return { success: false, message: 'Forbidden' };
    }

    if (request.status !== 'ACCEPTED') {
      return { success: false, message: 'Can only nudge accepted mentees' };
    }

    if (request.lastNudgedAt) {
      const daysSinceNudge = (Date.now() - request.lastNudgedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceNudge < NUDGE_COOLDOWN_DAYS) {
        return {
          success: false,
          message: `Nudge cooldown active (${Math.ceil(NUDGE_COOLDOWN_DAYS - daysSinceNudge)} days remaining)`
        };
      }
    }

    const mentorName = [mentorUser.firstName, mentorUser.lastName].filter(Boolean).join(' ') || 'Your mentor';
    const menteeEmail = request.menteeProfile.user.email;

    if (menteeEmail) {
      await resend.emails.send({
        from: 'Caawi <notifications@caawi.com>',
        to: menteeEmail,
        subject: `${mentorName} wants to hear from you`,
        react: NudgeEmail({ mentorName, mentorProfileId: request.mentorProfileId })
      });
    }

    await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { lastNudgedAt: new Date() }
    });

    revalidatePath('/dashboard/requests');
    return { success: true, message: 'Nudge sent!' };
  } catch (error) {
    console.error('Failed to nudge mentee:', error);
    return { success: false, message: 'Something went wrong' };
  }
}
