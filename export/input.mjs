import {save, load} from 'https://rpgen3.github.io/mylib/export/save.mjs';
import {getType} from 'https://rpgen3.github.io/mylib/export/util.mjs';
const _label = (parentNode, p) => $('<label>').appendTo(parentNode).text(p.name);
const _input = (elm, p, {get, set}) => {
    if(p.id) elm.prop('id', p.id);
    if(p.class) elm.addClass(p.class);
    if(p.value) set(p.value);
    if(p.save === true) p.save = p.name;
    if(p.save) {
        const v = load(p.save);
        if(v) set(v);
        elm.on('change', () => save(p.save, get()));
    }
    return Object.assign(set,{
        elm, valueOf: get
    });
};
export const addInputStr = (parentNode, p) => {
    const input = $('<input>').appendTo(_label(parentNode, p));
    return _input(input, p, {
        get: () => input.val(),
        set: v => input.val(v)
    });
};
export const addInputNum = (parentNode, p) => {
    const label = _label(parentNode, p),
          div = $('<div>').appendTo(label),
          {min, max, step} = p,
          input = $('<input>').prop({
              type: 'range',
              min, max, step
          }).appendTo(label);
    input.on('input', () => div.text(input.val()));
    return _input(input, p, {
        get: () => Number(input.val()),
        set: v => input.val(v)
    });
};
export const addInputBool = (parentNode, p) => {
    const input = $('<input>').prop({
        type: 'checkbox'
    }).appendTo(_label(parentNode, p));
    return _input(input, p, {
        get: () => input.prop('checked'),
        set: v => input.prop('checked', Boolean(v))
    });
};
export const addSelect = (parentNode, p) => {
    const select = $('<select>').appendTo(_label(parentNode, p));
    let {list} = p;
    if(getType(list) === getType([])) {
        const obj = {};
        for(const v of list) obj[v] = v;
        list = obj;
    }
    const update = () => {
        const v = select.val();
        select.empty();
        for(const k in list) $('<option>').appendTo(select).text(k).val(list[k]);
        select.val(v);
    };
    update();
    select.prop('selectedIndex', 0);
    return Object.assign(_input(select, p, {
        get: () => select.val(),
        set: v => select.val(v)
    }),{list, update});
};
