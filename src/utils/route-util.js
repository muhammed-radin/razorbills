/**
 * Generates a full URL using the current origin and a provided hash.
 * @param {string} hash - The hash string (e.g., 'sfd' or '#sfd').
 * @returns {string} The complete URL.
 */
const generateHashLink = (hash) => {
  // Ensure the hash starts with a '#' symbol
  const formattedHash = hash.startsWith("#") ? hash : `#${hash}`;

  // Combine the browser's current origin with the formatted hash
  return `${window.location.origin}/${formattedHash}`;
};

export { generateHashLink };
