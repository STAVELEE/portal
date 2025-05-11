import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from '@auth/firebase-adapter'
import { cert } from 'firebase-admin/app'

interface ExtendedSession extends Session {
  id?: string
  provider?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  }),
  callbacks: {
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession
      if (token) {
        extendedSession.id = token.sub
        extendedSession.provider = token.provider as string
      }
      return extendedSession
    },
  },
}

export default NextAuth(authOptions)
