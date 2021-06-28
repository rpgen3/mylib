const _f = max => max * Math.random() | 0;
export const randInt = (min, max) => _f(Math.abs(max - min + 1)) + min;
export const randArr = arr => arr[_f(arr.length)];
export const shuffle = arr => {
    let m = arr.length;
    while (m) {
        const i = _f(m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};
