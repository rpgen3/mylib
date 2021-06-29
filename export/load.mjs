export const importAll = arr => Promise.all(arr.map(v => import(v))).then(v => Object.assign({},...v));
export const getScript = url => new Promise((resolve,reject) => $.getScript(url).done(resolve).fail(reject));
