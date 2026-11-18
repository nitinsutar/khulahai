import { Page } from '@/components/page';
import { WeekendsIndex } from '@/components/weekends';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export const metadata = meta({
  title: 'Long weekends 2026 in India: official RBI bank holidays',
  description: 'Upcoming 3-day bank holiday breaks in every state, and days where taking one leave gives you four off, from official RBI 2026 lists. The 2027 list is not out yet.',
  path: '/long-weekends',
  en: '/long-weekends',
  hi: '/hi/long-weekends',
  og: { t: 'Long weekends 2026', s: 'Official RBI lists · take 1 leave, get 4 days' },
});

export default function LongWeekendsPage() {
  return <Page alt="/hi/long-weekends"><WeekendsIndex /></Page>;
}
