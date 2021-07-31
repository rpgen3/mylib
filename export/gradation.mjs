export const gradation = (value, cycle) => {
    const rate = value % cycle / cycle,
          unit = cycle / 6,
          rate2 = value % unit / unit;
    let [r, g, b] = [255, 255, 255];
    if(rate <= 1/6){
        g *= rate2;
        b = 0;
    }
    else if(rate <= 2/6){
        r = 255 - rate2 * r;
        b = 0;
    }
    else if(rate <= 3/6){
        r = 0;
        b *= rate2;
    }
    else if(rate <= 4/6){
        r = 0;
        g = 255 - rate2 * g;
    }
    else if(rate <= 5/6){
        g = 0;
        r *= rate2;
    }
    else {
        g = 0;
        b = 255 - rate2 * b;
    }
    return [r, g, b].map(Math.floor);
};
