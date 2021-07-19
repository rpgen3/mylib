export const importAll = arr => Promise.all(arr.map(v => import(v))).then(v => Object.assign({},...v));
export const importAllSettled = arr => Promise.allSettled(arr.map(v => import(v))).then(v => Object.assign({},...v.flatMap(({value}) => value ? value : {})));
export const getScript = url => new Promise((resolve, reject)=>{
    const e = document.createElement('script');
    document.head.append(e);
    e.onload = () => {
        resolve(e);
        e.remove();
    };
    e.onerror = reject;
    e.src = url;
});
export const getCSS = url => new Promise((resolve, reject)=>{
    const e = document.createElement('link');
    document.head.append(e);
    e.rel = 'stylesheet';
    e.onload = () => resolve(e);
    e.onerror = reject;
    e.href = url;
});
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const promiseSerial = (arr, ms = 0) => arr.reduce((p,x,i,a) => p.then(x).then(i !== a.length - 1 && ms ? () => sleep(ms) : null), Promise.resolve());
