import { revalidatePath } from 'next/cache';
// Called by Vercel Cron just after midnight IST so every "today" page is regenerated for the new day.
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  const ua = req.headers.get('user-agent') || '';
  if (secret ? auth !== `Bearer ${secret}` : !ua.startsWith('vercel-cron')) return new Response('Unauthorized', { status: 401 });
  revalidatePath('/', 'layout');
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
