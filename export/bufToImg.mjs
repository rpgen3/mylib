export const bufToImg = buf => {
    const d = new Uint8Array(buf),
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
export const imgToBuf = img => {
    const {width, height} = img,
          cv = document.createElement('canvas');
    cv.width = width;
    cv.height = height;
    const ctx = cv.getContext('2d'),
          {data} = ctx.getImageData(0, 0, width, height),
          area = data.length / 4,
          d = [...new Array(area * 3)];
    for(let i = 0; i < area; i++){
        let j = i * 3,
            k = i * 4;
        d[j] = data[k]
        d[j + 1] = data[k + 1];
        d[j + 2] = data[k + 2];
    }
    return new Uint8Array(d).buffer;
};
