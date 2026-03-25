// color format hsl
// return true -> white, false -> black
const checkBrightness = (color?: string, returnColor?: boolean): boolean | string => {
  if (!color) return false;
  const brightness = color.split(',')[2].trim().slice(0, 2);
  const finalValue = +brightness < 60;
  return returnColor ? (finalValue ? 'white' : 'black') : finalValue;
};

export default checkBrightness;
