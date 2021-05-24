const _front = location.href.split('?')[0] + '|';
export const makeSaveKey = key => !key ? null : _front + key;
export const getSaveKeys = () => Object.keys(localStorage).filter(v=>v.includes(_front));
export const removeSaveData = key => !key ? null : localStorage.removeItem(makeSaveKey(key));
export const save = (key, val) => !key ? null : localStorage.setItem(makeSaveKey(key), val);
export const load = key => !key ? null : localStorage.getItem(makeSaveKey(key));
