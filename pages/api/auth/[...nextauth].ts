// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.id = token.id
        session.provider = token.provider
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.email
        token.provider = account.provider
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',  // Optional custom UI
  },
})