import { revalidatePath } from 'next/cache';
import { pingIndexNow, sitemapUrls } from '@/lib/indexnow';
// Called by Vercel Cron just after midnight IST so every "today" page is regenerated for the new day,
// then tells IndexNow engines that the sitemap URLs have fresh content.
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  const ua = req.headers.get('user-agent') || '';
  if (secret ? auth !== `Bearer ${secret}` : !ua.startsWith('vercel-cron')) return new Response('Unauthorized', { status: 401 });
  revalidatePath('/', 'layout');
  let indexnow: number | string = 'skipped';
  if (process.env.VERCEL_ENV === 'production') {
    try { indexnow = await pingIndexNow(await sitemapUrls()); } catch (e) { indexnow = `error: ${(e as Error).message}`; }
  }
  return Response.json({ revalidated: true, indexnow, at: new Date().toISOString() });
}
