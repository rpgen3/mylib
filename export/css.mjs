export const addCSS = href => $('<link>').appendTo('head').prop({href, rel: 'stylesheet'});
export const getCSS = elm => { // elmのCSSの値を取得する
    const e = $(elm || document.body).get(0);
    return e.currentStyle || document.defaultView.getComputedStyle(e, '');
};
export const getFontSize = elm => Number(getCSS(elm).fontSize.slice(0,-2)) + 1; // elmのフォントサイズを取得する
export const getRGBA = color => { // color文字列を0~255のRGBAの配列にして返す。
    const elm = $("<div>").appendTo("body").css("color",color),
          m = getCSS(elm).color?.match(/[0-9.]+/g).map(Number);
    elm.remove();
    if(!m || (m.length !== 3 && m.length !== 4)) return null;
    else if(m.length === 3) m.push(255);
    else m[3] = Math.round(m[3] * 255);
    return m;
};
let _cover;
export const setBgImg = (url, { color="white", opacity=0.8 }={}) => { // 背景画像を設定する。
    if(!_cover) _cover = $("<div>").appendTo("body");
    const colors = getRGB(color);
    _cover.css({
        zIndex: -114514,
        background: colors ? "rgba(" + colors.join(',') + "," + opacity + ")" : color,
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    });
    if(!url) return;
    $("body").css({
        "background-image": 'url("' + url + '")',
        "background-attachment": "fixed", // コンテンツの高さが画像の高さより大きい時、動かないように固定
        "background-position": "center center",// 画像を常に天地左右の中央に配置
        "background-size": "cover", // 表示するコンテナの大きさに基づいて、背景画像を調整
        "background-repeat": "no-repeat", // 画像をタイル状に繰り返し表示しない
    });
};
