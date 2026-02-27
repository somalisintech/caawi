'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { resend } from '@/lib/email';
import { MenteeNudgeEmail } from '@/lib/emails/mentee-nudge';
import { createClient } from '@/utils/supabase/server';

const NUDGE_COOLDOWN_DAYS = 7;

export async function browseNudgeAction(menteeProfileId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      return { success: false, message: 'Unauthorised' };
    }

    if (!menteeProfileId) {
      return { success: false, message: 'menteeProfileId is required' };
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

    const menteeProfile = await prisma.profile.findUnique({
      where: { id: menteeProfileId },
      select: {
        userType: true,
        onboardingCompleted: true,
        user: { select: { email: true } }
      }
    });

    if (!menteeProfile || menteeProfile.userType !== 'MENTEE' || !menteeProfile.onboardingCompleted) {
      return { success: false, message: 'Mentee not found' };
    }

    const existingNudge = await prisma.menteeNudge.findUnique({
      where: {
        mentorProfileId_menteeProfileId: {
          mentorProfileId: mentorUser.profile.id,
          menteeProfileId
        }
      }
    });

    if (existingNudge) {
      const daysSinceNudge = (Date.now() - existingNudge.lastNudgedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceNudge < NUDGE_COOLDOWN_DAYS) {
        return {
          success: false,
          message: `Nudge cooldown active (${Math.ceil(NUDGE_COOLDOWN_DAYS - daysSinceNudge)} days remaining)`
        };
      }
    }

    const mentorName = [mentorUser.firstName, mentorUser.lastName].filter(Boolean).join(' ') || 'A mentor';
    const menteeEmail = menteeProfile.user.email;

    if (menteeEmail) {
      await resend.emails.send({
        from: 'Caawi <notifications@caawi.com>',
        to: menteeEmail,
        subject: `${mentorName} wants to connect with you on Caawi`,
        react: MenteeNudgeEmail({ mentorName, mentorProfileId: mentorUser.profile.id })
      });
    }

    await prisma.menteeNudge.upsert({
      where: {
        mentorProfileId_menteeProfileId: {
          mentorProfileId: mentorUser.profile.id,
          menteeProfileId
        }
      },
      update: { lastNudgedAt: new Date() },
      create: {
        mentorProfileId: mentorUser.profile.id,
        menteeProfileId
      }
    });

    revalidatePath('/dashboard/browse-mentees');
    return { success: true, message: 'Nudge sent!' };
  } catch (error) {
    console.error('Failed to nudge mentee:', error);
    return { success: false, message: 'Something went wrong' };
  }
}
