import CryptoJS from "crypto-js";

function decryptStrict(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, import.meta.env.VITE_CRYPTED_STRICT);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, import.meta.env.VITE_CRYPTED);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function encryptStrict(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, import.meta.env.VITE_CRYPTED_STRICT).toString();
}

function encrypt(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, import.meta.env.VITE_CRYPTED).toString();
}

export { decryptStrict, decrypt, encryptStrict, encrypt };