(async()=>{
    const rpgen3 = await Promise.all([
        'save',
        'util'
    ].map(v=>import(`https://rpgen3.github.io/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    const addInputText = (parentNode, {
        value = '',
        save = '',
        readonly = false,
        textarea = false
    }={}) => {
        const elm = $(`<${ textarea ? 'textarea' : 'input'}>`);
        elm.val(value);
        if(readonly) {
            elm.addClass('readonly').attr("readonly", true).on("click",()=>{
                rpgen3.copy(elm.val());
                elm.select();
            });
            return;
        }
        if(save) {
            const v = rpgen3.load(save);
            if(v !== null) elm.val(v);
        }
        elm.on('change', () => {
            $(elm).val();
            if(save) rpgen3.save(save);
        });
        elm.on('change', () => rpgen3.save(save, elm.val()));
    };
})();
