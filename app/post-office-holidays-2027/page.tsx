import { Page } from '@/components/page';
import { PostYear } from '@/components/postlist';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
export const revalidate = 3600;
export const metadata = meta({
  title: 'Post Office Holidays 2027: Central Govt List (DoPT)',
  description: 'India Post circle lists for 2027 are not out yet. See the 14 compulsory central government holidays for 2027 from DoPT’s 16 July 2026 order.',
  path: '/post-office-holidays-2027',
  og: { t: 'Post office holidays 2027', s: 'DoPT list, published July 2026' },
});
export default function P() { return <Page><PostYear year={2027} today={todayIST()} /></Page>; }
