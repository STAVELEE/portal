// utils/cryptoUtils.ts
export async function generateKeyPair(): Promise<{ publicKeyPem: string, privateKeyPem: string }> {
    const keyPair = await window.crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt']
    );
  
    const exportKey = async (key: CryptoKey, type: 'pkcs8' | 'spki') => {
      const exported = await window.crypto.subtle.exportKey(type, key);
      const pem = Buffer.from(exported).toString('base64').match(/.{1,64}/g)?.join('\n');
      const header = type === 'pkcs8' ? 'PRIVATE KEY' : 'PUBLIC KEY';
      return `-----BEGIN ${header}-----\n${pem}\n-----END ${header}-----`;
    };
  
    const privateKeyPem = await exportKey(keyPair.privateKey, 'pkcs8');
    const publicKeyPem = await exportKey(keyPair.publicKey, 'spki');
  
    return { publicKeyPem, privateKeyPem };
  }
  