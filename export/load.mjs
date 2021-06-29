export const importAll = arr => Promise.all(arr.map(v => import(v))).then(v => Object.assign({},...v));
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
