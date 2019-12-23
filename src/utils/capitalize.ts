/**
 * Capitalize the first character of a string, and convert all other characters to lower case.
 *
 * @param {string} - The string to capitalize
 */
export default function capitalize([char, ...string]: string): string {
  return `${char.toUpperCase()}${string.join('').toLowerCase()}`;
}
