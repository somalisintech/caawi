import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const adapter = PrismaAdapter(prisma);

adapter.createUser = async (data) =>
  prisma.user.create({
    data: {
      ...data,
      profile: {
        create: {}
      }
    }
  }) as any;

export const authOptions = {
  adapter,
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
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // check to see if email and password is there
        if (!credentials?.email || !credentials.password) {
          throw new Error('Please enter an email and password');
        }

        // check to see if user exists
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        // if no user was found
        if (!user || !user?.hashedPassword) {
          throw new Error('No user found');
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        // if password does not match
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return user;
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
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
} as NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
