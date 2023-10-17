export default function extendEnum(enumObj, extension) {
  const baseIndex = Math.max(...Object.values(enumObj)) + 1;

  const newObj = { ...enumObj, ...extension };
  Object.keys(extension).forEach((key) => {
    newObj[key] = extension[key] + baseIndex;
  });

  return newObj;
}
