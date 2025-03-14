export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const upperCaseWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const wordCount = (str: string) => {
  return str.split(/\s+/).filter(Boolean).length;
};

export const readTime = (str: string) => {
  const wordsPerMinute = 180;
  const words = wordCount(str);
  return Math.ceil(words / wordsPerMinute);
};
