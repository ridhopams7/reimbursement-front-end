/**
 * @author: dwi.setiyadi@gmail.com
*/

export const ucFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const findJsonInString = (string: any) => {
  let toObj = string.toString().match(/\{(?:[^{}]|(\?R))*\}/g);

  if (toObj === null) return string;

  toObj = JSON.parse(toObj[0]);
  return toObj;
};
