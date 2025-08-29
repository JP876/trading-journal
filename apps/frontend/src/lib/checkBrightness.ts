// color format hsl
// return true -> white, false -> black
const checkBrightness = (color?: string): boolean => {
  if (!color) return false;
  const brightness = color.split(',')[2].trim().slice(0, 2);
  return +brightness < 60;
};

export default checkBrightness;
