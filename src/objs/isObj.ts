const isObj = (it: any) => typeof it === 'object' && !Array.isArray(it) && it !== null;

export default isObj;
