import { Page } from '@/components/page';
import { WeekendsIndex } from '@/components/weekends';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export const metadata = meta({
  title: '2026 के लंबे सप्ताहांत: आधिकारिक आरबीआई बैंक छुट्टियाँ',
  description: 'हर राज्य में आने वाले 3 दिन के बैंक अवकाश, और जहाँ एक दिन की छुट्टी लेकर चार दिन मिलते हैं, 2026 की आधिकारिक आरबीआई सूची से। 2027 की सूची अभी नहीं आई है।',
  path: '/hi/long-weekends',
  en: '/long-weekends',
  hi: '/hi/long-weekends',
  og: { t: '2026 के लंबे सप्ताहांत', s: 'आधिकारिक आरबीआई सूची' },
});

export default function HiLongWeekendsPage() {
  return <Page lang="hi" alt="/long-weekends"><WeekendsIndex lang="hi" /></Page>;
}
