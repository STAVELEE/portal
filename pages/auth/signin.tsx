import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">🔐 로그인</h1>
      <button onClick={() => signIn('google')} className="btn">Google로 로그인</button>
      <button onClick={() => signIn('github')} className="btn">GitHub로 로그인</button>
    </div>
  )
}
