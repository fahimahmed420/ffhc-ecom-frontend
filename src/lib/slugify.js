export const slugify = (text) =>
  text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");