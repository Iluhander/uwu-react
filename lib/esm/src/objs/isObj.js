const isObj = (it) => typeof it === 'object' && !Array.isArray(it) && it !== null;
export default isObj;
