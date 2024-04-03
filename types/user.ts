import { CalendlyUser, Location, Occupation, Profile, User } from '@prisma/client';

export interface UserProfile extends Profile {
  location: Location | null;
  occupation: Occupation | null;
  calendlyUser: CalendlyUser | null;
}

export interface UserWithProfile extends Partial<User> {
  profile: Partial<UserProfile> | null;
}
