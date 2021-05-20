export const strToImg = str => { // 文字列をbase64のdataURLに変換
    const ar = [];
    str.split('').forEach(c=>{
        const n = c.charCodeAt();
        if(n < 128) ar.push(n);
        else {
            ar.push(128);
            ar.push((0xff00 & n) >> 8);
            ar.push((0xff & n));
        }
    });
    const width = Math.ceil(Math.sqrt(ar.length / 3)),
          cv = document.createElement("canvas");
    cv.width = width;
    cv.height = width;
    const ctx = cv.getContext("2d"),
          imgData = ctx.getImageData(0, 0, width, width);
    let cnt = 0;
    for(let i = 0; i < ar.length; i++){
        const i4 = i * 4;
        for(let o = 0; o < 3; o++) imgData.data[i4 + o] = ar[cnt++] || 0;
        imgData.data[i4 + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
    }
    ctx.putImageData(imgData, 0, 0);
    return cv.toDataURL("image/png");
};
export const imgToStr = img => { // <img>要素を文字列に変換
    const { width, height } = img,
          cv = document.createElement("canvas");
    cv.width = width;
    cv.height = height;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img,0,0);
    const data = ctx.getImageData(0, 0, width, height).data,
          ar = [];
    for(let i = 0; i < data.length; i++){
        const i4 = i * 4;
        for(let o = 0; o < 3; o++) ar.push(data[i4 + o]);
    }
    let str = '';
    for(let p = 0; p < ar.length; p++){
        const n = ar[p];
        if(n < 128) str += String.fromCharCode(n);
        else if(n === 128){
            str += String.fromCharCode((ar[p + 1] << 8) + ar[p + 2]);
            p += 2;
        }
    }
    return str.replace(/\0+$/,'');
};
