const CryptoJS = require("crypto-js");

function decryptStrict(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTED_STRICT);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTED);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function encryptStrict(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, process.env.CRYPTED_STRICT).toString();
}

function encrypt(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, process.env.CRYPTED).toString();
}

module.exports = {
  decryptStrict,
  decrypt,
  encryptStrict,
  encrypt,
};
