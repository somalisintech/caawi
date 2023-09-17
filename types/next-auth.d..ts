import { type DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    firstName: string | null;
    lastName: string | null;
  }
}
