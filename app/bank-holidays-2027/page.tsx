import { Page } from '@/components/page';
import { Soon } from '@/components/soon';
import { meta } from '@/lib/meta';
export const metadata = meta({ title: 'Bank holidays 2027: RBI list coming soon', description: 'The RBI bank holiday list for 2027 is not out yet. RBI usually publishes it in December. See the 2026 list and the 2027 central government holidays meanwhile.', path: '/bank-holidays-2027', og: { t: 'Bank holidays 2027', s: 'RBI list coming soon' } });
export default function P() {
  return <Page><Soon title="Bank holidays 2027" s="bank" what="RBI bank holiday list for 2027" when="RBI usually publishes the next year’s holiday matrix in December." links={[{ href: '/bank-holidays-2026', label: 'Bank holidays 2026 (state-wise)' }, { href: '/post-office-holidays-2027', label: 'Central government holidays 2027 (published)' }, { href: '/saturday-bank-holiday', label: '2nd & 4th Saturday rule' }]} /></Page>;
}
