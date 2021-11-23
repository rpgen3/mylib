export const isIterable = x => Symbol.iterator in x; // イテラブルか判定
export const getType = x => Object.prototype.toString.call(x).replace(/\[object |\]/g,''); // 型名を返す
export const getTime = date => { // xx:yy:zz の形式で現在時刻の文字列を返す
    let d = date ? new Date(date) : Date.now();
    if(Number.isNaN(Number(d))) throw new Error('argument 1 needs to be a date');
    d /= 1000;
    const s = d % 60;
    d /= 60;
    const m = d % 60;
    d /= 60;
    return [d, m, s].map(v=>('0' + (v | 0)).slice(-2)).join(':');
};
export const copy = str => { // 文字列をクリップボードにコピー
    const e = document.createElement('textarea');
    e.textContent = str;
    document.body.appendChild(e);
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
};
export const makeLoader = ctor => url => new Promise((resolve, reject) => Object.assign(new ctor, {
    onload: ({target}) => resolve(target),
    onloadedmetadata: ({target}) => resolve(target),
    onerror: reject,
    crossOrigin: 'anonymous',
    src: url
}));
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const addBtn = (h, ttl, func) => $('<button>').appendTo(h).text(ttl).on('click', func);
export const makeCanvas = (width, height) => {
    const cv = document.createElement('canvas');
    Object.assign(cv, {width, height});
    const ctx = cv.getContext('2d');
    return [cv, ctx];
};
export const toI = (w, x, y) => x + y * w;
export const toXY = (w, i) => {
    const x = i % w,
          y = i / w | 0;
    return [x, y];
};
