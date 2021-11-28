const def = 'default';
export const sw = x => p => {
    for(const k in p) {
        if(k === def) continue;
        else if(x == k) return p[k](x);
    }
    return p.default(x);
};
