export const getStringAfterAt = (string: string, at: string): string => {
  if (!string) {
    return '';
  }

  const indexOfAt = string.lastIndexOf(at) + at.length;
  const lastPart = string.slice(indexOfAt, string.length);
  return lastPart;
};
