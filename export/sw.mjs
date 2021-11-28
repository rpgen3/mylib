const def = 'default';
export const sw = x => p => {
    for(const k in p) if(k !== def && x == k) return p[k](x);
    return p.default(x);
};
