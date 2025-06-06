
// Simplified crypto utilities for DID generation
export const generateRandomBytes = (length: number): Uint8Array => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

export const generateKeypair = () => {
  // Generate a simple keypair (in production, use proper Ed25519)
  const privateKey = generateRandomBytes(32);
  const publicKey = generateRandomBytes(32);
  return { privateKey, publicKey };
};

export const createDIDFromPublicKey = (publicKey: Uint8Array): string => {
  const publicKeyHex = Array.from(publicKey)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `did:key:z${publicKeyHex.substring(0, 20)}`;
};

export const formatDID = (did: string): string => {
  if (did.length <= 20) return did;
  return `${did.substring(0, 15)}...${did.substring(did.length - 8)}`;
};
