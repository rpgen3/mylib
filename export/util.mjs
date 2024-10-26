export const isIterable = x => Symbol.iterator in x; // イテラブルか判定
export const getType = x => Object.prototype.toString.call(x).replace(/\[object |\]/g,''); // 型名を返す
export const getTime = (date = null, offsetHours = null) => { // HH:MM:SS
    let d = date && date !== 0 ? new Date(date) : Date.now();
    if(Number.isNaN(Number(d))) throw new Error('argument 1 needs to be a date');
    d /= 1000;
    const s = (d | 0) % 60;
    d /= 60;
    const m = (d | 0) % 60;
    d /= 60;
    const h = ((d | 0) + offsetHours) % 24;
    return [h, m, s].map(v=>v.toString().padStart(2,'0')).join(':');
};
export const copy = str => { // 文字列をクリップボードにコピー
    const e = document.createElement('textarea');
    e.textContent = str;
    document.body.appendChild(e);
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
};
export const loadSrc = (tagName, url) => new Promise((resolve, reject) => Object.assign(
    document.createElement(tagName), {
        onload: ({target}) => resolve(target),
        onloadedmetadata: ({target}) => resolve(target),
        onerror: reject,
        crossOrigin: 'anonymous',
        src: url
    }
));
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const addBtn = (html, ttl, func) => $('<button>').text(ttl).appendTo(html).on('click', func);
export const addA = (html, url, ttl = url) => $('<a>').prop({
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer'
}).text(ttl).appendTo(html);
export const makeCanvas = (width, height) => {
    const cv = document.createElement('canvas');
    Object.assign(cv, {width, height});
    const ctx = cv.getContext('2d');
    return {cv, ctx};
};
export const toI = (w, x, y) => x + y * w;
export const toXY = (w, i) => {
    const x = i % w,
          y = i / w | 0;
    return [x, y];
};
export const download = (url, ttl) => Object.assign(
    document.createElement('a'), {
        href: url,
        download: ttl
    }
).click();
