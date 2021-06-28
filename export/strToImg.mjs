export const arrToImg = arr => {
    const d = new Uint8Array(arr),
          width = Math.sqrt(d.length / 3) + 1 | 0,
          area = width ** 2,
          dd = new Uint8ClampedArray(area * 4);
    for(let i = 0; i < area; i++){
        let j = i * 4,
            k = i * 3;
        dd[j] = d[k]
        dd[j + 1] = d[k + 1];
        dd[j + 2] = d[k + 2];
        dd[j + 3] = 255;
    }
    const cv = document.createElement('canvas');
    cv.width = width;
    cv.height = width;
    const ctx = cv.getContext('2d');
    ctx.putImageData(new ImageData(dd, width, width), 0, 0);
    return cv.toDataURL();
};
export const imgToArr = img => {
    const {width, height} = img,
          cv = document.createElement('canvas');
    cv.width = width;
    cv.height = height;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const {data} = ctx.getImageData(0, 0, width, height),
          area = data.length / 4,
          d = new Uint8Array(area * 3);
    for(let i = 0; i < area; i++){
        let j = i * 3,
            k = i * 4;
        d[j] = data[k]
        d[j + 1] = data[k + 1];
        d[j + 2] = data[k + 2];
    }
    return d;
};
export const bufToImg = buf => arrToImg(buf);
export const imgToBuf = img => imgToArr(img).buffer;
export const imgToAudio = async img => {
    const ctx = new AudioContext,
          buf = await ctx.decodeAudioData(imgToBuf(img)),
          src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    return src;
};
export const strToImg = str => {
    const arr = [];
    for(const c of str.split('')){
        const n = c.charCodeAt();
        arr.push(n >> 8);
        arr.push(n & 0xff);
    }
    return arrToImg(arr);
};
export const imgToStr = img => {
    let str = '';
    const arr = imgToArr(img),
          len = arr.length >> 1;
    for(let i = 0; i < len; i++){
        const j = i << 1;
        str += String.fromCharCode((arr[j] << 8) + arr[j + 1]);
    }
    return str.replace(/\0+$/,'');
};
