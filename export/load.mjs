export const importAll = arr => Promise.all(arr.map(v => import(v))).then(v => Object.assign({},...v));
export const getScript = async url => eval(await(await fetch(url)).text());
