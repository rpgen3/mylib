export const findURL = str => {  // URLを探し、配列で返す
    const m = str.match(/(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g);
    return m ? m : [];
};
export const getDomain = url => (url || location.href).replace(/^.+?\/\/|\/.*$/g,'').split('.');  // URLのドメインを配列で返す
export const getParam = url => { // URLのクエリパラメータを連想配列形式に
    const p = {},
          q = (url || location.href).split('?');
    q[1].split('&').forEach(v=>{
        const a = v.split('=');
        if(a.length === 2) p[a[0]] = a[1];
    });
    return p;
};
export const toParam = json => Object.keys(json).map(v=>v + '=' + json[v]).join('&'); // 連想配列をクエリパラメータ形式に
export const toSafe = str => str.replace(/[^A-Za-z0-9\-_]/g, ''); // 特殊な文字によるURLの意図しない動作を防ぐ
