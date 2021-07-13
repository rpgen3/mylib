export const importAll = arr => Promise.all(arr.map(v => import(v))).then(v => Object.assign({},...v));
export const importAllSettled = arr => Promise.allSettled(arr.map(v => import(v))).then(v => Object.assign({},...v.flatMap(({value}) => value ? value : {})));
export const getScript = url => new Promise((resolve, reject)=>{
    const e = document.createElement('script');
    e.onload = () => {
        resolve();
        e.remove();
    };
    e.onerror = reject;
    e.src = url;
    document.head.append(e);
});
export const getCSS = url => new Promise((resolve, reject)=>{
    const e = document.createElement('link');
    e.rel = 'stylesheet';
    e.onload = resolve;
    e.onerror = reject;
    e.href = url;
    document.head.append(e);
});
