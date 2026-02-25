import type { CalendlyUser, Location, Occupation, Profile, Skill, User } from '@/generated/prisma/browser';

export interface UserProfile extends Profile {
  location: Location | null;
  occupation: Occupation | null;
  calendlyUser: CalendlyUser | null;
  skills: Skill[] | null;
}

export interface UserWithProfile extends Partial<User> {
  profile: Partial<UserProfile> | null;
}
