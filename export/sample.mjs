const _count = arr => { // 値：出現数のMapオブジェクトを返す
    const m = new Map;
    for(const v of arr) m.set(v, m.has(v) ? m.get(v) + 1 : 1);
    return m;
};
export const mode = arr => [..._count(arr)].reduce((acc, v) => acc[1] < v[1] ? v : acc, [0,0])[0]; // 最頻値
export const median = arr => { // 中央値
    const len = arr.length;
    return (len <= 11 ? _median9 : len >= 37 ? _medianq : _median)(arr, len, len >> 1);
};
// http://midarekazu.g2.xrea.com/quicksort.html
const _kyori = 10,
      _swap = (a, b, c) => ([a[b], a[c]] = [a[c], a[b]]),
      _compSwap = (a, b, c) => c < b && _swap(a, b, c),
      _sort3 = (a, b, c, d) => {
          _compSwap(a, b, c);
          _compSwap(a, b, d);
          _compSwap(a, c, d);
      };
const _median = (a, len, mid) => {
    let i, j, imax;
    for (i = 0; i <= mid - 1; i++) _compSwap(a, i, i + mid + 1);
    for (i = 1; i <= mid; i++) _compSwap(a, i, i + mid);
    imax = mid;
    for (j = mid - 1; j >= 0; j--) if (a[j] > a[imax]) imax = j;
    for (;i < len; i++){
        if (a[i] < a[imax]) {
            a[imax] = a[i];
            imax = mid;
            for (j = mid - 1; j >= 0; j--) if (a[j] > a[imax]) imax = j;
        }
    }
    return a[imax];
};
const _median9 = (a, len, mid) => {
    let i, j, imax = 0;
    for (i = 1; i <= mid; i++) if (a[i] > a[imax]) imax = i;
    for (; i < len; i++){
        if (a[i] < a[imax]) {
            a[imax] = a[i];
            imax = mid;
            for (j = mid - 1; j >= 0; j--) if (a[j] > a[imax]) imax = j;
        }
    }
    return a[imax];
};
const _medianq = (a, len, mid) => {
    let begin = 0, end = len - 1;
    while (1){
        let middle = (begin + end) >> 1;
        _sort3(a, middle, begin, end);
        let i = begin, j = end;
        while(1){
            do i++; while(a[i] < a[begin]);
            do j--; while(a[j] > a[begin]);
            if(i>=j) break;
            _swap(a, i, j);
        }
        if (i >= mid + 2){
            a[begin] = a[i-1];
            end = i - 2;
            if (end <= mid + _kyori){
                let i, j, imax = mid;
                for (j = mid - 1; j >= begin; j--) if (a[j] > a[imax]) imax = j;
                for (i = end; i >= mid + 1; i--){
                    if (a[i] < a[imax]) {
                        a[imax] = a[i];
                        imax = mid;
                        for (j = mid - 1; j >= begin; j--) if (a[j] > a[imax]) imax = j;
                    }
                }
                return a[imax];
            }
        }
        else if (j <= mid - 1){
            begin = j + 1;
            if (begin >= mid - _kyori){
                let i,j,imin=mid;
                for (j = mid + 1; j <= end; j++) if (a[j] < a[imin]) imin = j;
                for (i = begin; i <= mid - 1; i++){
                    if (a[i] > a[imin]) {
                        a[imin] = a[i];
                        imin = mid;
                        for (j = mid + 1; j <= end; j++) if (a[j] < a[imin]) imin = j;
                    }
                }
                return a[imin];
            }
        }
        else return a[begin];
    }
};
