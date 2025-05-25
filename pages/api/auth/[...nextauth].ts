import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

interface ExtendedSession extends Session {
  id?: string;
  provider?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : '', // 예외 방지
    }),
  }),
  callbacks: {
    async session({ session, token }) {
      const extendedSession: ExtendedSession = session;

      if (token) {
        extendedSession.id = token.sub ?? undefined;
        extendedSession.provider = (token as any)?.provider ?? 'unknown';
      }

      return extendedSession;
    },
  },
  pages: {
    error: '/auth/error', // 커스텀 에러 페이지 설정 (선택사항)
  },
  debug: process.env.NODE_ENV === 'development', // 개발 중이면 디버깅 활성화
};

export default NextAuth(authOptions);
