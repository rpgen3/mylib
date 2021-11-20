export const isIterable = x => Symbol.iterator in x; // イテラブルか判定
export const getType = x => Object.prototype.toString.call(x).replace(/\[object |\]/g,''); // 型名を返す
export const getTime = date => { // xx:yy:zz の形式で現在時刻の文字列を返す
    let d = date ? new Date(date) : Date.now();
    if(Number.isNaN(Number(d))) throw new Error("argument 1 needs to be a date");
    d /= 1000;
    const s = d % 60;
    d /= 60;
    const m = d % 60;
    d /= 60;
    return [d, m, s].map(v=>('0' + v | 0).slice(-2)).join(':');
};
export const copy = str => { // 文字列をクリップボードにコピー
    const e = document.createElement("textarea");
    e.textContent = str;
    document.body.appendChild(e);
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
};
