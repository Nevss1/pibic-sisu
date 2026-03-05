const LOWERCASE_WORDS = new Set(["e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "a", "o", "as", "os", "para", "por", "com"]);

export function toTitleCase(str: string) {
  return str.toLowerCase().split(" ").map((w, i) =>
    i === 0 || !LOWERCASE_WORDS.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w
  ).join(" ");
}
