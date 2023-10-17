import isObj from './isObj.js';

export default function areEqualShallow(obj0, obj1) {
  if (!isObj(obj0) || !isObj(obj1)) {
    return false;
  }

  const obj0Keys = Object.keys(obj0);
  const obj1Keys = Object.keys(obj1);

  if (obj0Keys.length !== obj1Keys.length) {
    return false;
  }

  for (let i = 0; i < obj0Keys.length; i += 1) {
    if (obj0[obj0Keys[i]] !== obj1[obj0Keys[i]]) {
      return false;
    }
  }

  for (let i = 0; i < obj1Keys.length; i += 1) {
    if (obj0[obj1Keys[i]] !== obj1[obj1Keys[i]]) {
      return false;
    }
  }

  return true;
}
