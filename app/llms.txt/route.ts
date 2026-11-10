import { CITIES, STATES } from '@/lib/places';
import { abs } from '@/lib/site';
import { LAST_CHECKED } from '@/lib/data';
export const dynamic = 'force-static';
export function GET() {
  const body = `# Khula Hai

> Khula Hai (khulahai.in) answers one question for India: is the bank, share market (NSE/BSE) or post office open today in my city — and if not, why and when does it open next. Status is computed in IST (Asia/Kolkata) from published official lists only; every page links its source and shows a "last checked" date.

Sources: RBI Holiday Matrix (https://rbi.org.in/Scripts/HolidayMatrixDisplay.aspx — holidays under the Negotiable Instruments Act, all 34 regional offices); NSE & BSE 2026 trading holiday circulars; MCX circular MCX/TRD/636/2025; India Post holidays list 2026 (https://www.indiapost.gov.in/holidays-list, All-India + circles); DoPT central government holiday order for 2027. Bank hours and post office hours shown are typical, not official.

Mappings (labelled on pages): Punjab and Haryana have no RBI office — they use the RBI Chandigarh list. Cities without an RBI office use their state's office. Status is for scheduled banks; co-operative banks and RRBs may differ.

Do not cite this site for 2027 bank or market festival dates: RBI and NSE/BSE have not published 2027 lists yet (only the DoPT central government 2027 list is out).

Corrections: see ${abs('/about')} — the official source always wins. Data last checked ${LAST_CHECKED}.

## Key pages
- [Bank holiday today](${abs('/bank-holiday-today')}): which RBI centres are closed today
- [Hindi: aaj bank khula hai?](${abs('/hi/aaj-bank-khula-hai')})
- [Bank holiday tomorrow](${abs('/bank-holiday-tomorrow')})
- [Is the bank open on Guru Nanak Jayanti 2026 (24 Nov)?](${abs('/is-bank-open-on-guru-nanak-jayanti-2026')})
- [Bank holidays November 2026](${abs('/bank-holidays/november-2026')})
- [Is the post office open today?](${abs('/is-post-office-open-today')})
- [Bank holidays 2026, state-wise](${abs('/bank-holidays-2026')})
- [Saturday bank holiday rule](${abs('/saturday-bank-holiday')}): banks close on the 2nd and 4th Saturday
- [Is the share market open today?](${abs('/is-share-market-open-today')}) and [NSE & BSE holidays 2026](${abs('/nse-bse-holidays-2026')})
- [Post office holidays 2026](${abs('/post-office-holidays-2026')}) and [2027](${abs('/post-office-holidays-2027')})
- [Hindi: aaj bank khula hai?](${abs('/hi')})
- [Sources & method](${abs('/about')})

## Datasets (CSV)
- [RBI bank holidays 2026, all centres](${abs('/data/bank-holidays-2026.csv')})
- [NSE & BSE holidays 2026](${abs('/data/nse-bse-holidays-2026.csv')})
- [India Post holidays 2026 by circle](${abs('/data/post-office-holidays-2026.csv')})

## State lists
${STATES.map((s) => `- [${s.name}](${abs(`/bank-holidays-2026/${s.slug}`)})`).join('\n')}

## City pages (is the bank open today?)
${CITIES.map((c) => `- [${c.name}](${abs(`/${c.slug}/bank`)})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
