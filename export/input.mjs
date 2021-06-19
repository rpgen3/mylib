(async()=>{
    await Promise.all([
        'https://rpgen3.github.io/lib/lib/jquery-3.5.1.min.js',
        'https://yaju1919.github.io/lib/lib/diffColor.js'
    ].map(v=>import(v)));
    $.getScript('https://rpgen3.github.io/lib/lib/MedianCut.js');
    const rpgen3 = await Promise.all([
        'baseN',
        'css',
        'hankaku',
        'input',
        'random',
        'save',
        'url',
        'util',
        'strToImg'
    ].map(v=>import(`https://rpgen3.github.io/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    const h = $('body').css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text('ドット絵を綺麗にする');
    const hMsg = $("<div>").appendTo(h);
    const msg = (str, isError) => $("<span>").appendTo(hMsg.empty()).text(str).css({
        color: isError ? 'red' : 'blue',
        backgroundColor: isError ? 'pink' : 'lightblue'
    });
    $('<button>').appendTo(h).text('処理').on('click', ()=>main());
    const inputNoise = rpgen3.addSelect(h,{
        label: 'ノイズ除去度',
        value: 3,
        list: [2, 3, 4]
    });
    const inputDiff = rpgen3.addInputNum(h,{
        label: '単位ピクセルの補正値',
        save: true,
        value: 3
    });
    const inputColors = rpgen3.addSelect(h,{
        label: '色数',
        save: true,
        value: '16色',
        list: {
            '2色': 2,
            '3色': 3,
            '4色': 4,
            '5色': 5,
            '6色': 6,
            '7色': 7,
            '8色': 8,
            '16色': 16,
            '32色': 32,
            '64色': 64,
            '128色': 128,
            '256色': 256,
        }
    });
    $('<input>').appendTo(h).prop({
        type: "file"
    }).on('change',e => {
        imgElm.prop('src', URL.createObjectURL(e.target.files[0]));
    });
    const inputImg = rpgen3.addInputStr(h,{
        label: '画像URL入力',
        value: 'https://i.imgur.com/MrOrXaY.png'
    });
    inputImg.elm.on('change', () => {
        rpgen3.findURL(inputImg.toString()).forEach(v => imgElm.prop('src', v));
    });
    const imgElm = $('<img>').appendTo(h).prop({
        crossOrigin: "anonymous"
    });
    inputImg.elm.trigger('change');
    const output = $('<div>').appendTo(h);
    const sleep = ms => new Promise(resolve=>setTimeout(resolve, ms));
    const dialog = async str => {
        msg(str);
        await sleep(30);
    };
    const main = async () => {
        const img = imgElm.get(0),
              {width, height} = img,
              cv = $('<canvas>').prop({width, height}),
              ctx = cv.get(0).getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height),
              {data} = imgData;
        await dialog('エッジ検出します');
        const bin = laplacian(data, width, height);
        await dialog('エッジ検出完了。ノイズを取り除きます');
        cleanBin(bin, width, height);
        await dialog('ノイズを取り除きました。単位を求めます');
        const unit = calcUnit(bin, width, height);
        await dialog(`単位を求めました。${inputColors}色に減色します`);
        new window.TMedianCut(imgData, window.getColorInfo(imgData)).run(inputColors, true);
        await dialog('減色しました。ドット絵を描きます');
        const [dd, ww, hh] = await draw(data, width, height, unit, window.getColorInfo(imgData).map(({r,g,b})=>[r,g,b]));
        await dialog('完成☆');
        toCv(dd, ww, hh);
    };
    const luminance = ([r,g,b]) => r * 0.298912 + g * 0.586611 + b * 0.114478 | 0;
    const laplacian = (data, w, h) => {
        const index = (x,y) => x + y * w,
              d = new Uint8ClampedArray(data.length >> 2),
              kernel = [
                  0, 0, 1, 0, 0,
                  0, 1, 2, 1, 0,
                  1, 2, -16, 2, 1,
                  0, 1, 2, 1, 0,
                  0, 0, 1, 0, 0,
              ],
              size = Math.sqrt(kernel.length),
              p = size >> 1;
        for(let i = 0; i < data.length; i += 4){
            const x = (i >> 2) % w,
                  y = (i >> 2) / w | 0;
            if(x < p || y < p || x >= w - p || y >= h - p) continue;
            const rgb = data.slice(i, i + 3);
            let sum = 0;
            for (const [i,v] of kernel.entries()) {
                const xx = i % size,
                      yy = i / size | 0,
                      j = index(x + xx - p, y + yy - p) << 2;
                sum += v * luminance(data.slice(j, j + 3));
            }
            if(0x80 < sum) d[index(x,y)] = 1;
        }
        return d;
    };
    const cleanBin = (bin, w, h) => {
        const index = (x,y) => x + y * w,
              p = 1,
              noise = inputNoise();
        for(const [i,v] of bin.entries()){
            if(!v) continue;
            const x = i % w,
                  y = i / w | 0;
            if(x < p || y < p || x >= w - p || y >= h - p) continue;
            const j = index(x - 1, y - 1),
                  k = index(x - 1, y),
                  l = index(x - 1, y + 1),
                  sum = [
                      ...bin.slice(j, j + 3),
                      bin[k],
                      bin[k + 2],
                      ...bin.slice(l, l + 3)
                  ].reduce((p,x) => p + x);
            if(sum < noise) bin[index(x, y)] = 0;
        }
    };
    const calcUnit = (bin, w, h) => {
        const index = (x,y) => x + y * w,
              ar = [];
        for(const bool of [0, 1]){
            for(let y = 0; y < h; y++){
                let min = Infinity,
                    flag = true,
                    last = 0;
                for(let x = 0; x < w; x++){
                    if(!bin[bool ? index(x, y) : index(y, x)]) continue;
                    if(flag) {
                        flag = false;
                        const v = x - last - 1;
                        if(v < min && v > 1) min = v;
                    }
                    else {
                        flag = true;
                        last = y;
                    }
                }
                ar.push(min);
            }
        }
        const max = Math.min(w, h);
        return mode(ar.filter(v => v < max)) + inputDiff;
    };
    const count = arr => {
        const map = new Map;
        for(const v of arr) map.set(v, map.has(v) ? map.get(v) + 1 : 1);
        return map;
    };
    const mode = arr => [...count(arr)].reduce((acc, v) => acc[1] < v[1] ? v : acc, [0,0])[0]; // 最頻値
    const draw = async (data, w, h, unit, colors) => {
        const ww = w / unit | 0,
              hh = h / unit | 0,
              index = (x,y) => x + y * w,
              d = new Uint8ClampedArray(ww * hh << 2),
              sign = '#';
        for(let i = 0; i < d.length; i += 4){
            const x = (i >> 2) % ww,
                  y = (i >> 2) / ww | 0,
                  ar = [];
            for(let ii = 0, max = unit * unit; ii < max; ii++){
                const xx = ii % unit,
                      yy = ii / unit | 0,
                      j = index(unit * x + xx, unit * y + yy) << 2;
                ar.push(nearest(colors, data.slice(j, j + 3)).join(sign));
            }
            const [r, g, b] = mode(ar).split(sign);
            d[i] = r;
            d[i + 1] = g;
            d[i + 2] = b;
            d[i + 3] = 255;
            x || await dialog(`描画中…(${y}/${ww})`);
        }
        return [d, ww, hh];
    };
    const nearest = (arr, value) => { // 最も近い色
        const map = new Map;
        for(const v of arr) map.set(window.diffColor(v, value), v);
        return map.get(Math.min(...map.keys()));
    };
    const toCv = (data, width, height) => {
        const cv = $('<canvas>').prop({width, height}),
              ctx = cv.get(0).getContext('2d');
        ctx.putImageData(new ImageData(data, width, height), 0, 0);
        return cv.appendTo(output.empty());
    };
})();
