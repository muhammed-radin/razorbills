import CryptoJS from "crypto-js";

function decryptStrict(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    import.meta.env.VITE_CRYPTED_STRICT,
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, import.meta.env.VITE_CRYPTED);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function encryptStrict(plaintext) {
  return CryptoJS.AES.encrypt(
    plaintext,
    import.meta.env.VITE_CRYPTED_STRICT,
  ).toString();
}

function encrypt(plaintext) {
  return CryptoJS.AES.encrypt(
    plaintext,
    import.meta.env.VITE_CRYPTED,
  ).toString();
}

/**
 *
 * @param {Object} obj - The object to decrypt.
 * @param {boolean} strict - Whether to use strict decryption.
 * @param {Array} strict - Include keys to strictly decrypt, if strict is true. If false, all keys will be decrypted except those in excludeKeys.
 * @param {Array} excludeKeys - Keys to exclude from decryption.
 * @returns {Object} The decrypted object.
 * @description This function decrypts an object using AES encryption and returns the decrypted object. deeply nested objects are not supported. If strict is true, only the keys specified in the strict array will be decrypted. If strict is false, all keys will be decrypted except those specified in the excludeKeys array.
 */
function decryptObj(obj, strict = false, excludeKeys = []) {
  const decryptedObj = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      decryptedObj[key] = decryptObj(value, strict, excludeKeys);
    } else {
      if (strict) {
        if (strict.includes(key)) {
          decryptedObj[key] = decryptStrict(obj[key]);
        } else {
          decryptedObj[key] = obj[key];
        }
      } else {
        if (!excludeKeys.includes(key)) {
          decryptedObj[key] = decrypt(obj[key]);
        } else {
          decryptedObj[key] = obj[key];
        }
      }
    }
  }
  return decryptedObj;
}

export { decryptStrict, decrypt, encryptStrict, encrypt, decryptObj };
