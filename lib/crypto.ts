import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64, decodeUTF8, encodeUTF8 } from 'tweetnacl-util';

// PBKDF2 configuration
const ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits

/**
 * Derives a cryptographic key from a password and salt using PBKDF2.
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LEN * 8
  );

  return new Uint8Array(derivedBits);
}

/**
 * Generates a new X25519 keypair for E2E encryption.
 */
export function generateKeyPair() {
  const pair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(pair.publicKey),
    privateKey: encodeBase64(pair.secretKey),
  };
}

/**
 * Encrypts the user's private key using their password.
 */
export async function encryptPrivateKey(privateKeyBase64: string, password: string): Promise<string> {
  const salt = nacl.randomBytes(16);
  const key = await deriveKey(password, salt);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const privateKeyUint8 = decodeBase64(privateKeyBase64);
  
  const encrypted = nacl.secretbox(privateKeyUint8, nonce, key);
  
  const result = new Uint8Array(salt.length + nonce.length + encrypted.length);
  result.set(salt, 0);
  result.set(nonce, salt.length);
  result.set(encrypted, salt.length + nonce.length);
  
  return encodeBase64(result);
}

/**
 * Decrypts the user's private key using their password.
 */
export async function decryptPrivateKey(encryptedBase64: string, password: string): Promise<string | null> {
  try {
    const data = decodeBase64(encryptedBase64);
    const salt = data.slice(0, 16);
    const nonce = data.slice(16, 16 + nacl.secretbox.nonceLength);
    const encrypted = data.slice(16 + nacl.secretbox.nonceLength);
    
    const key = await deriveKey(password, salt);
    const decrypted = nacl.secretbox.open(encrypted, nonce, key);
    
    if (!decrypted) return null;
    return encodeBase64(decrypted);
  } catch (e) {
    return null;
  }
}

/**
 * Encrypts a message for a recipient.
 */
export function encryptMessage(
  message: string, 
  recipientPublicKeyBase64: string, 
  senderPrivateKeyBase64: string
): { ciphertext: string; nonce: string } {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(message);
  const recipientPub = decodeBase64(recipientPublicKeyBase64);
  const senderPriv = decodeBase64(senderPrivateKeyBase64);
  
  const encrypted = nacl.box(messageUint8, nonce, recipientPub, senderPriv);
  
  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

/**
 * Decrypts a message from a sender.
 */
export function decryptMessage(
  ciphertextBase64: string,
  nonceBase64: string,
  senderPublicKeyBase64: string,
  recipientPrivateKeyBase64: string
): string | null {
  try {
    const ciphertext = decodeBase64(ciphertextBase64);
    const nonce = decodeBase64(nonceBase64);
    const senderPub = decodeBase64(senderPublicKeyBase64);
    const recipientPriv = decodeBase64(recipientPrivateKeyBase64);
    
    const decrypted = nacl.box.open(ciphertext, nonce, senderPub, recipientPriv);
    
    if (!decrypted) return null;
    return encodeUTF8(decrypted);
  } catch (e) {
    return null;
  }
}

/**
 * Utility to generate a shared secret for symmetric encryption (if needed).
 */
export function getSharedSecret(publicKeyBase64: string, privateKeyBase64: string): Uint8Array {
  return nacl.box.before(decodeBase64(publicKeyBase64), decodeBase64(privateKeyBase64));
}
