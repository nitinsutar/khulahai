import { Page } from '@/components/page';
import { AlertsView } from '@/components/alertsForm';
import { alertsStoreConfigured } from '@/lib/alertsStore';
import { meta } from '@/lib/meta';

export const dynamic = 'force-dynamic';
export const metadata = meta({
  title: 'व्हाट्सऐप पर बैंक छुट्टी की सूचना | खुला है',
  description: 'अपने शहर में बैंक छुट्टी से एक शाम पहले व्हाट्सऐप याद दिलाने के लिए जुड़ें। आधिकारिक आरबीआई सूची। कोई विज्ञापन संदेश नहीं।',
  path: '/hi/alerts',
  en: '/alerts',
  hi: '/hi/alerts',
  og: { t: 'बैंक छुट्टी की सूचना', s: 'एक शाम पहले व्हाट्सऐप पर' },
});

type Q = { city?: string; status?: string; error?: string };

export default async function HiAlertsPage({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const status = q.status === 'created' || q.status === 'updated' || q.status === 'unavailable' || q.status === 'error' ? q.status : undefined;
  return (
    <Page lang="hi" alt="/alerts">
      <AlertsView lang="hi" citySlug={q.city} status={status} error={q.error} storeReady={alertsStoreConfigured()} />
    </Page>
  );
}
