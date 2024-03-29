import {save, load} from 'https://rpgen3.github.io/mylib/export/save.mjs';
import {isIterable, copy} from 'https://rpgen3.github.io/mylib/export/util.mjs';
const _undef = void 0;
const _makeId = () => 'label-' + Math.random().toString(36).slice(2);
const _input = (elm, p, {get, get2, set}) => {
    if(p.value !== _undef) set(p.value);
    if(p.save === true) p.save = [p.prefix, p.label].map(v => v?.replace(/\|/g, '')).join('|');
    if(p.save !== _undef) {
        const v = load(p.save);
        if(v) set(v);
        elm.on('change', () => save(p.save, (get2||get)()));
    }
    return Object.assign((...a) => a.length ? set(a[0]) : get(), {
        elm, valueOf: get,
        toString: (...a) => get()?.toString(...a)
    });
};
export const addInputStr = (dl, p = {}) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const input = $(`<${p.textarea ? 'textarea' : 'input'}>`).prop('id', id).appendTo($('<dd>').appendTo(dl));
    if(p.copy) input.prop({
        readonly: true
    }).on('click', () => {
        copy(input.val());
        input.select();
    }).css({
        backgroundColor: '#e9e9e9',
        tabIndex: -1,
        cursor: 'pointer'
    });
    return _input(input, p, {
        get: () => input.val(),
        set: v => input.val(v)
    });
};
export const addInputNum = (dl, p = {}) => {
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
export const addInputBool = (dl, p = {}) => {
    const input = $('<input>').prop({
        type: 'checkbox'
    }).prependTo($('<label>').appendTo($('<dd>').appendTo(dl)).text(p.label));
    return _input(input, p, {
        get: () => input.prop('checked'),
        set: v => input.prop('checked', Boolean(v) && v !== 'false')
    });
};
export const addSelect = (dl, p = {}) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const select = $('<select>').appendTo($('<dd>').appendTo(dl)).prop('id', id);
    let m;
    const update = (list, value = select.val()) => {
        m = new Map;
        if(isIterable(list)) {
            if(Array.isArray(list[0])) for(const [k,v] of list) m.set(String(k), v);
            else for(const v of list) m.set(String(v), v);
        }
        else for(const k in list) m.set(k, list[k]);
        select.empty();
        for(const [k,v] of m) $('<option>').appendTo(select).text(k).val(k);
        if(m.has(value)) select.val(value);
    };
    if(p.list) update(p.list);
    return Object.assign(_input(select, p, {
        get: () => m.get(select.val()),
        get2: () => select.val(),
        set: v => select.val(v)
    }),{update});
};
export const addGroupedSelect = (dl, p = {}) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.label));
    const select = $('<select>').appendTo($('<dd>').appendTo(dl)).prop('id', id);
    let m;
    const update = (list, value = select.val()) => {
        m = new Map;
        select.empty();
        for(const arr of list) {
            const optgroup = $('<optgroup>').appendTo(select).prop('label', arr[0]);
            for (const v of arr[1]) {
                m.set(v[0], v[1]);
                $('<option>').appendTo(optgroup).text(v[0]).val(v[0]);
            }
        }
        if(m.has(value)) select.val(value);
    };
    if(p.list) update(p.list);
    return Object.assign(_input(select, p, {
        get: () => m.get(select.val()),
        get2: () => select.val(),
        set: v => select.val(v)
    }),{update});
};
