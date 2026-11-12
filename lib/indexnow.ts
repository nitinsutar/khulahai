// IndexNow: tells Bing, Yandex and other engines which URLs changed. Key file lives at /public/<key>.txt.
export const INDEXNOW_KEY = '3ec38abd9dff3a0de6dc8477d6ce4b5c';
export const INDEXNOW_HOST = 'khulahai.in';

export async function pingIndexNow(urlList: string[]): Promise<number | string> {
  const urls = [...new Set(urlList)].filter((u) => u.startsWith(`https://${INDEXNOW_HOST}/`) || u === `https://${INDEXNOW_HOST}`);
  if (!urls.length) return 'no-urls';
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`, urlList: urls.slice(0, 10000) }),
    });
    return r.status;
  } catch (e) {
    return `error: ${(e as Error).message}`;
  }
}

export async function sitemapUrls(): Promise<string[]> {
  const r = await fetch(`https://${INDEXNOW_HOST}/sitemap.xml`, { cache: 'no-store' });
  const xml = await r.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
