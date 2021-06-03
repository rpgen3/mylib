import {save, load} from 'https://rpgen3.github.io/mylib/export/save.mjs';
const undef = void 0;
const _makeId = () => 'label-' + Math.random().toString(36).slice(2);
const _input = (elm, p, {get, set}) => {
    if(p.value !== undef) set(p.value);
    if(p.save === true) p.save = p.label;
    if(p.save !== undef) {
        const v = load(p.save);
        if(v) set(v);
        elm.on('change', () => save(p.save, get()));
    }
    return Object.assign((...a) => a.length ? set(a[0]) : get(), {
        elm, valueOf: get,
        toString: (...a) => get().toString(...a)
    });
};
export const addInputStr = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const input = $(`<${p.textarea ? 'textarea' : 'input'}>`).prop('id', id).appendTo($('<dd>').appendTo(dl));
    return _input(input, p, {
        get: () => input.val(),
        set: v => input.val(v)
    });
};
export const addInputNum = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const dd = $('<dd>').appendTo(dl),
          {min, max, step} = p;
    const input = $('<input>').appendTo(dd).prop({
        id, min, max, step,
        type: 'range'
    });
    const span = $('<span>').appendTo(dd),
          f = () => span.text(input.val());
    input.on('input', f);
    const func = _input(input, p, {
        get: () => Number(input.val()),
        set: v => (input.val(v),f())
    });
    f();
    return func;
};
export const addInputBool = (dl, p) => {
    const input = $('<input>').prop({
        type: 'checkbox'
    }).prependTo($('<label>').appendTo($('<dd>').appendTo(dl)).text(p.label));
    return _input(input, p, {
        get: () => input.prop('checked'),
        set: v => input.prop('checked', Boolean(v))
    });
};
export const addSelect = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const select = $('<select>').appendTo($('<dd>').appendTo(dl)).prop('id', id);
    let list;
    const update = newList => {
        list = Array.isArray(newList) ? Object.fromEntries(newList.map(v=>[v,v])) : newList;
        const v = select.val();
        select.empty();
        for(const k in list) $('<option>').appendTo(select).text(k).val(k);
        if(list[v] !== undef) select.val(v);
    };
    update(p.list);
    return Object.assign(_input(select, p, {
        get: () => list[select.val()],
        set: v => select.val(v)
    }),{update});
};
