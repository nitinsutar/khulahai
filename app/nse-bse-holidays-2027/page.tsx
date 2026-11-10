import { Page } from '@/components/page';
import { Soon } from '@/components/soon';
import { meta } from '@/lib/meta';
export const metadata = meta({ title: 'NSE holiday list 2027: BSE & NSE trading holidays coming soon', description: 'The NSE and BSE trading holiday list for 2027 is not out yet. The exchanges usually publish it in December. See the 2026 list meanwhile.', path: '/nse-bse-holidays-2027', og: { t: 'NSE & BSE holidays 2027', s: 'Coming soon' } });
export default function P() {
  return <Page><Soon title="NSE & BSE holidays 2027" s="mkt" what="NSE and BSE trading holiday list for 2027" when="The exchanges usually issue next year’s trading holiday circular in December." links={[{ href: '/nse-bse-holidays-2026', label: 'NSE & BSE holidays 2026' }, { href: '/is-share-market-open-today', label: 'Is the share market open today?' }]} /></Page>;
}
