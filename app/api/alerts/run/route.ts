import { todayIST } from '@/lib/date';
import { citiesClosedTomorrow } from '@/lib/alerts';
import { alertsStoreConfigured, countForCity } from '@/lib/alertsStore';
import { bankShort } from '@/lib/text';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  const ua = req.headers.get('user-agent') || '';
  if (secret ? auth !== `Bearer ${secret}` : !ua.startsWith('vercel-cron')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const enabled = process.env.ALERTS_SEND_ENABLED === 'true';
  const { date, list } = citiesClosedTomorrow(todayIST());
  const store = alertsStoreConfigured();
  const closures: { city: string; reason: string; signups: number | null }[] = [];
  let wouldNotify = 0;
  if (store) {
    for (const row of list) {
      const n = await countForCity(row.city.slug);
      closures.push({ city: row.city.slug, reason: bankShort(row.status.reason, 'en'), signups: n });
      if (typeof n === 'number') wouldNotify += n;
    }
  } else {
    for (const row of list) closures.push({ city: row.city.slug, reason: bankShort(row.status.reason, 'en'), signups: null });
  }

  // Sending is never performed. Even if ALERTS_SEND_ENABLED is set, no provider is wired.
  return Response.json({
    dryRun: true,
    enabled,
    send: 'refused',
    reason: 'No WhatsApp provider is connected. Sending is not implemented.',
    store,
    tomorrow: date,
    closureCount: list.length,
    wouldNotify: store ? wouldNotify : null,
    sent: 0,
    closures,
    at: new Date().toISOString(),
  });
}
