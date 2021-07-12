export class BaseN {
    constructor(base){
        if(typeof base !== 'string') throw new Error('argument 1 needs to be a string');
        else if(typeof base.length < 2) throw new Error('argument 1 needs to be more than 2 length');
        this.base = base;
        this.length = base.length;
    }
    encode(num){ // 10進数をN進数に変換
        const {base, length} = this;
        let s = '', v = num;
        if(!v) return base[0];
        while(v){
            v = Math.floor(v);
            s = base[v % length] + s;
            v /= length;
        }
        return s.slice(1);
    }
    decode(str){ // N進数を10進数に変換
        const {base, length} = this;
        return String(str).split('').reverse().map((v,i)=>base.indexOf(v)*Math.pow(length, i)).reduce((acc,v)=>acc+v);
    }
}
/*
0~9 a~z A~V → 無変換、左端にWを追加する
58進数の一桁、左端にXを追加する
58進数の二桁、左端にYを追加する
58進数の三桁、左端にZを追加する
*/
const _to58 = new BaseN([ // 58進数
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUV',
].join(''));
const _sign = 'WXYZ';
export const encode = str => str.split('').map(v=>{
    if(_to58.base.indexOf(v) !== -1) return _sign[0] + v + _sign[0];
    else {
        const s = _to58.encode(v.charCodeAt(0)),
              {length} = s;
        if(length > 3) return ''; // 58**3以上のユニコードは空文字
        return _sign[length] + ('0'.repeat(length) + s).slice(-length) + _sign[length];
    }
}).join('').replace(/(W|X|Y|Z)\1/g,'').replace(/(W|X|Y|Z)(?=(W|X|Y|Z))/g,'').slice(0,-1).replace(/^W/,'');
export const decode = str => str.replace(/(W|X|Y|Z)[^WXYZ]*/g, v=>{
    const s = v.slice(1),
          idx = _sign.indexOf(v[0]);
    if(!idx) return s;
    return s.replace(new RegExp('.{'+idx+'}','g'), n=>String.fromCharCode(_to58.decode(n)));
});
