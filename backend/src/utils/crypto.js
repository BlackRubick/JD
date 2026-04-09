import crypto from 'crypto';

const RAW_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'psybioneer-default-encryption-key';
const IV_LENGTH = 16; // AES block size

function resolveEncryptionKey(rawKey) {
  const utf8Key = Buffer.from(String(rawKey), 'utf8');

  // AES-256 requires exactly 32 bytes.
  if (utf8Key.length === 32) {
    return utf8Key;
  }

  // If the provided key is not 32 bytes, derive a stable 32-byte key.
  return crypto.createHash('sha256').update(String(rawKey), 'utf8').digest();
}

const ENCRYPTION_KEY = resolveEncryptionKey(RAW_ENCRYPTION_KEY);

export function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

export function decrypt(text) {
  if (!text) return text;
  const [ivStr, encrypted] = text.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
