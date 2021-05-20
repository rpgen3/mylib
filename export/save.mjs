const _front = location.href.split('?')[0] + '|';
export const makeSaveKey = key => typeof key === "string" && key.length ? _front + key : '';
export const getSaveKeys = () => Object.keys(localStorage).filter(v=>v.includes(_front));
export const removeSaveData = key => localStorage.removeItem(makeSaveKey(key));
export const save = (key, val) => localStorage.setItem(makeSaveKey(key), val);
export const load = key => localStorage.getItem(makeSaveKey(key));
