const _f = (s, r, v) => s.replace(r, c => String.fromCharCode(c.charCodeAt(0) + v));
export const toHan = str => _f(str, /[Ａ-Ｚａ-ｚ０-９！-～]/g, - 0xFEE0); // 全角→半角
export const toZen = str => _f(str, /[A-Za-z0-9!-~]/g, + 0xFEE0); // 半角→全角
export const toHira = str => _f(str, /[\u30a1-\u30f6]/g, - 0x60); // カナ→ひら
export const toKana = str => _f(str, /[\u3041-\u3096]/g, + 0x60); // ひら→カナ
