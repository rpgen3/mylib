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
