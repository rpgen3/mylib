export const mean = arr => { // 平均値
    let sum = 0;
    for(const v of arr) sum += v;
    return sum / arr.length;
};
export const meanTrim = (arr, trim = 1 / 4, isWinsorized) => { // 刈り込み平均
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
// https://algorithm.joho.info/programming/python/opencv-otsu-thresholding-py/
export const binarizeOtsu = lums => { // 大津の手法（判別分析法）
    const hist = [...Array(256).fill(0)],
          _hist = hist.slice();
    for(const lum of lums) hist[lum]++;
    let sum = 0;
    for(const [i, v] of hist.entries()) sum += (_hist[i] = i * v);
    let n1 = 0,
        n2 = lums.length,
        _1 = 0,
        _2 = sum;
    const s_max = [0, -10];
    for(const [th, v] of hist.entries()) {
        n1 += v; // クラス1とクラス2の画素数を計算
        n2 -= v;
        const _v = _hist[th]; // クラス1とクラス2の画素値の平均を計算
        _1 += _v;
        _2 -= _v;
        const mu1 = n1 ? _1 / n1 : 0,
              mu2 = n2 ? _2 / n2 : 0,
              s = n1 * n2 * (mu1 - mu2) ** 2; // クラス間分散の分子を計算
        if(s > s_max[1]) { // クラス間分散の分子が最大のとき、クラス間分散の分子と閾値を記録
            s_max[0] = th;
            s_max[1] = s;
        }
    }
    return s_max[0]; // クラス間分散が最大のときの閾値を取得
};
