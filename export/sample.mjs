export const mean = arr => { // 平均値
    let sum = 0;
    for(const v of arr) sum += v;
    return sum / arr.length;
};
export const meanTrim = (arr, trim = 0.1, isWinsorized = false) => { // 刈り込み平均 trim < 0.5
    const n = arr.length * trim | 0,
          max = arr.length - n;
    arr.sort((a, b) => a - b);
    let sum = 0;
    for(let i = n; i < max; i++) sum += arr[i];
    if(isWinsorized) {
        sum += n * (arr[n] + arr[max - 1]);
        return sum / arr.length;
    }
    else return sum / (max - n);
};
export const midrange = arr => { // 最大値と最小値の平均
    let min = Infinity,
        max = -Infinity;
    for(const v of arr) {
        if(min > v) min = v;
        else if(max < v) max = v;
    }
    return (max - min) / 2;
};
export const mode = arr => { // 最頻値
    const hist = new Map;
    for(const v of arr) hist.set(v, hist.has(v) ? hist.get(v) + 1 : 1);
    let max = -Infinity,
        _v = -1;
    for(const [v, n] of hist) {
        if(max < n) {
            max = n;
            _v = v;
        }
    }
    return _v;
};
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
