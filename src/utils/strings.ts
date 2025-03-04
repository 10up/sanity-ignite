export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const upperCaseWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
