import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    firstName: string | null;
    lastName: string | null;
  }
  interface Session {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
  }
}
