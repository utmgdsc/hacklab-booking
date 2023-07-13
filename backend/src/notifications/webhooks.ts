import fetch from 'node-fetch';

export const sendWebhook = async (url: string, data: any) => {
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};
