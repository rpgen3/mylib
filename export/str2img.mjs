export const arr2img = arr => {
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
export const img2arr = img => {
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
export const buf2img = buf => arr2img(buf);
export const img2buf = img => img2arr(img).buffer;
export const str2img = str => {
    const arr = [];
    for(const c of str.split('')){
        const n = c.charCodeAt();
        arr.push(n >> 8);
        arr.push(n & 0xff);
    }
    return arr2img(arr);
};
export const img2str = img => {
    let str = '';
    const arr = img2arr(img),
          len = arr.length >> 1;
    for(let i = 0; i < len; i++){
        const j = i << 1;
        str += String.fromCharCode((arr[j] << 8) + arr[j + 1]);
    }
    return str.replace(/\0+$/,'');
};
