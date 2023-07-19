import fetch from 'node-fetch';

export const sendWebhook = async (url: string, text: string) => {
  if (url.includes('discord.com')) {
    if (url.endsWith('/')) {
      url = `${url}slack`;
    } else {
      url = `${url}/slack`;
    }
  }
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
};
