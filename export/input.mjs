import {save, load} from 'https://rpgen3.github.io/mylib/export/save.mjs';
import {getType} from 'https://rpgen3.github.io/mylib/export/util.mjs';
let cnt = 0;
const _makeId = () => 'label' + cnt++,
      _input = (elm, p, {get, set}) => {
          if(p.value) set(p.value);
          if(p.save === true) p.save = p.name;
          if(p.save) {
              const v = load(p.save);
              if(v) set(v);
              elm.on('change', () => save(p.save, get()));
          }
          return Object.assign((...a) => a.length ? set(a[0]) : get(), {
              elm, valueOf: get
          });
      };
export const addInputStr = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.name));
    const input = $(`<${p.textarea ? 'textarea' : 'input'}>`).prop('id', id).appendTo($('<dd>').appendTo(dl));
    return _input(input, p, {
        get: () => input.val(),
        set: v => input.val(v)
    });
};
export const addInputNum = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.name));
    const dd = $('<dd>').appendTo(dl),
          {min, max, step} = p,
          input = $('<input>').appendTo(dd).prop({
              id, min, max, step,
              type: 'range'
          });
    const div = $('<div>').appendTo(dd),
          f = () => div.text(input.val());
    input.on('input', f);
    return _input(input, p, {
        get: () => Number(input.val()),
        set: v => (input.val(v),f())
    });
};
export const addInputBool = (dl, p) => {
    const input = $('<input>').prop({
        type: 'checkbox'
    }).prependTo($('<label>').appendTo($('<dd>').appendTo(dl)).text(p.name));
    return _input(input, p, {
        get: () => input.prop('checked'),
        set: v => input.prop('checked', Boolean(v))
    });
};
export const addSelect = (dl, p) => {
    const id = _makeId();
    $('<dt>').appendTo(dl).append($('<label>').prop('for', id).text(p.name));
    const select = $('<select>').appendTo($('<dd>').appendTo(dl)).prop('id', id),
          update = list => {
              if(Array.isArray(list)) {
                  const obj = {};
                  for(const v of list) obj[v] = v;
                  list = obj;
              }
              const v = select.val();
              select.empty();
              for(const k in list) $('<option>').appendTo(select).text(k).val(list[k]);
              select.val(v);
              if(select.val() === null) select.prop('selectedIndex', 0);
          };
    update(p.list);
    return Object.assign(_input(select, p, {
        get: () => select.val(),
        set: v => select.val(v)
    }),{update});
};
