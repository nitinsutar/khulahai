import { Page } from '@/components/page';
import { PostYear } from '@/components/postlist';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
export const revalidate = 3600;
export const metadata = meta({
  title: 'Post office holidays 2026: India Post holiday list (official)',
  description: 'Post office holidays 2026 in India — the 14 compulsory central government holidays from the DoPT list, Delhi’s extra 3, Saturday and Sunday rules, with an add-to-calendar file.',
  path: '/post-office-holidays-2026',
  og: { t: 'Post office holidays 2026', s: 'Central government list' },
});
export default function P() { return <Page><PostYear year={2026} today={todayIST()} /></Page>; }
