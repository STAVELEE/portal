// pages/login.tsx
import { getProviders, signIn } from 'next-auth/react';

export default function Login({ providers }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">🔐 로그인</h1>
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name} className="mb-4">
          <button
            onClick={() => signIn(provider.id)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {provider.name}로 로그인
          </button>
        </div>
      ))}
    </div>
  );
}

Login.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};
