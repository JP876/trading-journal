export const getRandomInt = (min: number = 0, max: number = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItem = <T>(arr: T[]): T | null => {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomFloat = (min: number = 0, max: number = 1) => {
  return Math.random() * (max - min) + min;
};

export const getRandomNumArray = (length: number, min?: number, max?: number) => {
  return Array.from({ length }).map(() => getRandomFloat(min ?? 0, max || 1));
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const slope = (outMax - outMin) / (inMax - inMin);
  return (value - inMin) * slope + outMin;
};
