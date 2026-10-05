import CryptoJS from "crypto-js";

export function decryptStrict(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTED_STRICT);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTED);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptStrict(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, process.env.CRYPTED_STRICT).toString();
}

export function encrypt(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, process.env.CRYPTED).toString();
}

export function encryptAddress(address) {
  return Object.fromEntries(
    Object.entries(address).map(([key, value]) => [
      key,
      key === "id" ? value : encrypt(JSON.stringify(value)),
    ]),
  );
}

export function decryptAddress(address) {
  return Object.fromEntries(
    Object.entries(address).map(([key, value]) => {
      if (key === "id" || typeof value !== "string") return [key, value];

      try {
        const decrypted = decrypt(value);
        return [key, JSON.parse(decrypted)];
      } catch {
        return [key, value];
      }
    }),
  );
}

export default {
  decryptStrict,
  decrypt,
  encryptStrict,
  encrypt,
  encryptAddress,
  decryptAddress,
};
