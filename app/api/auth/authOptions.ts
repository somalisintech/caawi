import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { NextAuthOptions } from 'next-auth';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture
        };
      }
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      version: '2.0'
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: { scope: 'openid profile email' }
      },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      // pass in user id, first name, and last name to the token
      if (user) {
        return {
          ...token,
          id: user.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          image: profile?.image
        };
      }

      return token;
    },
    async session({ token, session }) {
      // pass in user id, first name, and last name to the session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName
        }
      };
    }
  },
  events: {
    async linkAccount({ user, profile }) {
      if (!user.image && profile.image) {
        return prisma.user.update({
          where: { id: user.id },
          data: { image: profile.image }
        });
      }
    }
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth'
  },
  debug: process.env.NODE_ENV === 'development'
} as NextAuthOptions;
