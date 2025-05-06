// utils/ssh.ts
export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const { generateKeyPair } = await import('crypto');
    return new Promise((resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        },
        (err, publicKey, privateKey) => {
          if (err) return reject(err);
          resolve({ publicKey, privateKey });
        }
      );
    });
  }
  