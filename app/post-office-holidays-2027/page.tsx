import { Page } from '@/components/page';
import { PostYear } from '@/components/postlist';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
export const revalidate = 3600;
export const metadata = meta({
  title: 'Post office holidays 2027: central government holiday list',
  description: 'Post office and central government holidays 2027, from the DoPT order of 16 July 2026 — compulsory holidays, Delhi’s optional picks, and an add-to-calendar file.',
  path: '/post-office-holidays-2027',
  og: { t: 'Post office holidays 2027', s: 'DoPT list, published July 2026' },
});
export default function P() { return <Page><PostYear year={2027} today={todayIST()} /></Page>; }
