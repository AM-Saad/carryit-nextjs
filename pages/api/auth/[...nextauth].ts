

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import GoogleProvider from "next-auth/providers/google"
import prisma from '@/lib/prisma';
import { redirect } from 'next/dist/server/api-utils';


export default NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    // add your providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  events: {
    // session: async ({ session, user }: any) => {
    // },
    // signIn(message) {
    // },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(url, baseUrl)
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
  // other configuration options
});

