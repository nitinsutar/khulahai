import { Page } from '@/components/page';
import { PostYear } from '@/components/postlist';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
export const revalidate = 3600;
export const metadata = meta({
  title: 'Post Office Holidays 2026 in India: India Post Circle List',
  description: 'Post office holidays 2026 from India Post: the 14-day All-India list plus extra days for every postal circle. Not the same list as banks. CSV and calendar download.',
  path: '/post-office-holidays-2026',
  og: { t: 'Post office holidays 2026', s: 'Central government list' },
});
export default function P() { return <Page><PostYear year={2026} today={todayIST()} /></Page>; }
