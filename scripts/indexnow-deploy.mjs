// Runs after a production build on Vercel: pings IndexNow with the full sitemap of the live site.
// Waits briefly so the new deployment is usually serving before engines are told. Never fails the build.
if (process.env.VERCEL_ENV !== 'production') process.exit(0);
const KEY = '3ec38abd9dff3a0de6dc8477d6ce4b5c', HOST = 'khulahai.in';
try {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(`https://${HOST}`));
  const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }) });
  console.log(`IndexNow: ${urlList.length} URLs, status ${r.status}`);
} catch (e) { console.log('IndexNow ping skipped:', e.message); }
