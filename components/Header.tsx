import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-end p-4">
      {session ? (
        <div className="flex items-center gap-4">
          <span>{session.user?.email}</span>
          <button onClick={() => signOut()} className="text-red-500">로그아웃</button>
        </div>
      ) : (
        <button onClick={() => signIn()} className="text-blue-600">로그인</button>
      )}
    </header>
  );
}
