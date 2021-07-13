import {randArr} from 'https://rpgen3.github.io/mylib/export/random.mjs';
export const imgur = {};
imgur.load = id => new Promise((resolve, reject) => {
    const img = new Image;
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.crossOrigin = 'anonymous';
    img.src = `https://i.imgur.com/${id}.png`;
});
imgur.upload = async base64 => {
    const token = randArr(imgur.tokens);
    return {
        ...(await(await fetch('https://api.imgur.com/3/upload.json',{
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64.replace(/^[^,]+;base64,/, ''),
                type: 'base64'
            })
        })).json()).data, token
    };
};
imgur.delete = async ({deletehash, token}) => {
    return await fetch(`https://api.imgur.com/3/image/${deletehash}`,{
        method: 'DELETE',
        headers: {
            Authorization: `Client-ID ${token}`
        }
    });
};
imgur.tokens = [
    'ed3688de8608b9d',
    '8b35a3e16a802a6',
    '9f6cbdf697dab0b'
];
