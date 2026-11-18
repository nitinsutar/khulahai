import { Page } from '@/components/page';
import { ChequeView, type ChequeQuery } from '@/components/cheque';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd } from '@/components/ui';

export const revalidate = 300;
export const metadata = meta({
  title: 'Cheque clearing date in India: when will my cheque be credited?',
  description: 'Estimate the credit date for a cheque deposited in your city. Uses RBI continuous clearing rules and official RBI holiday lists. Confirm with your branch.',
  path: '/cheque-clearing-date',
  en: '/cheque-clearing-date',
  hi: '/hi/cheque-clearing-date',
  og: { t: 'Cheque clearing date', s: 'RBI continuous clearing · official holiday lists' },
});

export default async function ChequePage({ searchParams }: { searchParams: Promise<ChequeQuery> }) {
  const q = await searchParams;
  return (
    <Page alt="/hi/cheque-clearing-date">
      <JsonLd data={faqLd([
        { q: 'Do I need to name the banks?', a: 'No. CTS rules are the same for scheduled banks. The date changes only with the city, the deposit date, the branch cut-off assumption, and whether the cheque is on the same bank.' },
        { q: 'Do NEFT and RTGS work on a bank holiday?', a: 'Yes. RBI has made both NEFT and RTGS available on all days of the year, including holidays, around the clock.' },
      ])} />
      <ChequeView query={q} />
    </Page>
  );
}
