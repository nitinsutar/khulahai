import { Page } from '@/components/page';
import { AlertsView } from '@/components/alertsForm';
import { alertsStoreConfigured } from '@/lib/alertsStore';
import { meta } from '@/lib/meta';

export const dynamic = 'force-dynamic';
export const metadata = meta({
  title: 'Bank holiday alerts on WhatsApp for your city | Khula Hai',
  description: 'Sign up for a WhatsApp reminder the evening before a bank holiday in your city. Official RBI lists. No marketing messages.',
  path: '/alerts',
  en: '/alerts',
  hi: '/hi/alerts',
  og: { t: 'Bank holiday alerts', s: 'WhatsApp reminder the evening before' },
});

type Q = { city?: string; status?: string; error?: string };

export default async function AlertsPage({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const status = q.status === 'created' || q.status === 'updated' || q.status === 'unavailable' || q.status === 'error' ? q.status : undefined;
  return (
    <Page alt="/hi/alerts">
      <AlertsView citySlug={q.city} status={status} error={q.error} storeReady={alertsStoreConfigured()} />
    </Page>
  );
}
