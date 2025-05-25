import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/'); // Or a different default authenticated page like '/dashboard'
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>; // Or a more sophisticated loading component
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">🔐 로그인</h1>
      <button onClick={() => signIn('google')} className="btn">Google로 로그인</button>
      <button onClick={() => signIn('github')} className="btn">GitHub로 로그인</button>
    </div>
  );
}
