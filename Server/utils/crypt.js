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

export default {
  decryptStrict,
  decrypt,
  encryptStrict,
  encrypt,
};
