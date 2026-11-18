import { Page } from '@/components/page';
import { ChequeView, type ChequeQuery } from '@/components/cheque';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export const metadata = meta({
  title: 'चेक क्लीयरिंग की तारीख: जमा करने पर पैसा कब आएगा?',
  description: 'अपने शहर में जमा चेक की अनुमानित क्रेडिट तारीख देखें। आरबीआई के सतत क्लीयरिंग नियम और आधिकारिक अवकाश सूची से। शाखा से पुष्टि करें।',
  path: '/hi/cheque-clearing-date',
  en: '/cheque-clearing-date',
  hi: '/hi/cheque-clearing-date',
  og: { t: 'चेक क्लीयरिंग की तारीख', s: 'आरबीआई नियम · आधिकारिक अवकाश सूची' },
});

export default async function HiChequePage({ searchParams }: { searchParams: Promise<ChequeQuery> }) {
  const q = await searchParams;
  return <Page lang="hi" alt="/cheque-clearing-date"><ChequeView lang="hi" query={q} /></Page>;
}
