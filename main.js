(async()=>{
    await import('https://rpgen3.github.io/lib/lib/jquery-3.5.1.min.js');
    const rpgen3 = await Promise.all([
        'baseN',
        'css',
        'hankaku',
        'input',
        'random',
        'save',
        'url',
        'util',
        'strToImg',
        'imgur'
    ].map(v=>import(`https://rpgen3.github.io/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    const h = $('body').css({
        'text-align': 'center',
        padding: '1em'
    });
    $('<h1>').appendTo(h).text('ES2020 dynamic importでライブラリを作る');
    const hMsg = $('<div>').appendTo(h);
    function msg(str, isError){
        $('<span>').appendTo(hMsg.empty()).text(str).css({
            color: isError ? 'red' : 'blue',
            backgroundColor: isError ? 'pink' : 'lightblue'
        })
    }
    const dl = $('<dl>').appendTo(h);
    const a = rpgen3.addInputStr(dl,{
        label: '文字列入力欄',
        textarea: true,
        save: true
    });
    const b = rpgen3.addInputNum(dl,{
        label: '数値入力欄',
        save: true
    });
    const c = rpgen3.addInputBool(dl,{
        label: '真偽値入力欄',
        save: true
    });
    const d = rpgen3.addSelect(dl,{
        label: '選択',
        list: {
            '選択A': 'A',
            '選択B': 'B',
            '選択C': 'C',
            '選択1': 1,
            '選択2': 2,
            '選択3': 3
        },
        value: '選択3',
        save: true
    });
    window.rpgen3 = rpgen3;
    window.a = {a,b,c,d};
    $('<input>').appendTo(h).attr({
        type: 'file'
    }).on('change', ({target}) => {
        const fr = new FileReader;
        fr.onload = () => load(fr.result);
        fr.readAsArrayBuffer(target.files[0]);
    });
    const output = $('<div>').appendTo(h);
    const load = async buf => {
        const id = await rpgen3.imgur.upload(rpgen3.bufToImg(buf));
        rpgen3.addInputStr(output.empty(),{
            label: 'output',
            copy: true,
            value: id
        });
        output.append(await rpgen3.imgur.load(id));
    };
})();
