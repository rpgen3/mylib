(async()=>{
    await import('https://rpgen3.github.io/lib/lib/jquery-3.5.1.min.js');
    const rpgen3 = await Promise.all([
        'baseN',
        'css',
        'hankaku',
        'random',
        'save',
        'url',
        'useful'
    ].map(v=>import(`https://rpgen3.github.io/lib/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    window.rpgen4 = rpgen3;
    const h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text("ES2020 dynamic importでライブラリを作る");
    $("<button>").appendTo(h).text("randInt").on("click",()=>{
        msg(rpgen3.randInt(0,100));
    });
    const hMsg = $("<div>").appendTo(h);
    function msg(str, isError){
        $("<span>").appendTo(hMsg.empty()).text(str).css({
            color: isError ? 'red' : 'blue',
            backgroundColor: isError ? 'pink' : 'lightblue'
        })
    }
})();
