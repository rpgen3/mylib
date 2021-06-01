(async()=>{
    const {
        getType,
        save,
        load
    } = await Promise.all([
        'save',
        'util'
    ].map(v=>import(`https://rpgen3.github.io/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    const _makeDd = (dl, p) => {
        if(p.title) $('<dt>').appendTo(dl).text(p.title);
        const dd = $('<dd>').appendTo(dl);
        return dd;
    };
    const _input = (elm, p, {get, set}) => {
        if(p.id) elm.prop('id', p.id);
        if(p.class) elm.addClass(p.class);
        if(p.value) set(p.value);
        if(p.save) {
            const v = load(p.save);
            if(v) set(v);
            elm.on('change', () => save(p.save, get()));
        }
        get.valueOf = get;
        get.get = get;
        get.set = set;
        get.elm = elm;
        return Object.assign(get,{
            valueOf: get, get, set, elm
        });
    };
    const addInputStr = (dl, p) => {
        const dd = _makeDd(dl, p).prop({
            contenteditable: true
        });
        return _input(dd, p, {
            get: () => dd.val(),
            set: v => dd.val(v)
        });
    };
    const addInputNum = (dl, p) => {
        const dd = _makeDd(dl, p),
              div = $('<div>').appendTo(dd),
              input = $('<input>').prop({
                  type: 'range',
                  min: p.min,
                  max: p.max,
                  step: p.step
              }).appendTo(dd);
        input.on('input', () => div.text(input.val()));
        return _input(input, p, {
            get: () => Number(input.val()),
            set: v => input.val(v)
        });
    };
    const addInputBool = (dl, p) => {
        const dd = _makeDd(dl, p),
              input = $('<input>').prop({
                  type: 'checkbox'
              }).appendTo(dd);
        return _input(input, p, {
            get: () => input.prop('checked'),
            set: v => input.prop('checked', Boolean(v))
        });
    };
    const addSelect = (dl, p) => {
        const dd = _makeDd(dl, p),
              select = $('<select>').appendTo(dd);
        const update = () => {
            const v = select.val();
            select.empty();
            for(const k in p.list) $('<option>').text(k).val(p.list[k]).appendTo(select);
            select.val(v);
        };
        update();
        return Object.assign(_input(dd, p, {
            get: () => dd.val(),
            set: v => dd.val(v)
        }),{update});
    };
    const addCopyBox = (dl, p) => {
    };
    const addTab = () => {};
})();
