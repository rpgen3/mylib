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
        if(p.name) $('<dt>').appendTo(dl).text(p.name);
        return $('<dd>').appendTo(dl);
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
        return Object.assign(set,{
            elm, valueOf: get
        });
    };
    export const addInputStr = (dl, p) => {
        const dd = _makeDd(dl, p).prop({
            contenteditable: true
        });
        return _input(dd, p, {
            get: () => dd.val(),
            set: v => dd.val(v)
        });
    };
    export const addInputNum = (dl, p) => {
        const dd = _makeDd(dl, p),
              div = $('<div>').appendTo(dd),
              {min, max, step} = p,
              input = $('<input>').prop({
                  type: 'range',
                  min, max, step
              }).appendTo(dd);
        input.on('input', () => div.text(input.val()));
        return _input(input, p, {
            get: () => Number(input.val()),
            set: v => input.val(v)
        });
    };
    export const addInputBool = (dl, p) => {
        const input = $('<input>').prop({
            type: 'checkbox'
        }).appendTo(_makeDd(dl, p));
        return _input(input, p, {
            get: () => input.prop('checked'),
            set: v => input.prop('checked', Boolean(v))
        });
    };
    export const addSelect = (dl, p) => {
        const select = $('<select>').appendTo(_makeDd(dl, p)),
              {list} = p,
              update = () => {
                  const v = select.val();
                  select.empty();
                  for(const k in list) $('<option>').appendTo(select).text(k).val(list[k]);
                  select.val(v);
              };
        update();
        return Object.assign(_input(select, p, {
            get: () => select.val(),
            set: v => select.val(v)
        }),{list, update});
    };
})();
