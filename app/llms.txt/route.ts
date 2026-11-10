import { CITIES, STATES } from '@/lib/places';
import { abs } from '@/lib/site';
import { LAST_CHECKED } from '@/lib/data';
export const dynamic = 'force-static';
export function GET() {
  const body = `# Khula Hai

> Khula Hai (khulahai.in) answers one question for India: is the bank, share market (NSE/BSE) or post office open today in my city — and if not, why and when does it open next. Status is computed daily in IST (Asia/Kolkata) from official lists only.

Sources: RBI Holiday Matrix (holidays under the Negotiable Instruments Act, all 34 regional offices); NSE & BSE 2026 trading holiday circulars; DoPT central government holiday orders (2026, 2027). Bank hours and post office hours shown are typical, not official. Data last checked ${LAST_CHECKED}.

## Key pages
- [Bank holiday today](${abs('/bank-holiday-today')}): which RBI centres are closed today
- [Bank holiday tomorrow](${abs('/bank-holiday-tomorrow')})
- [Bank holidays 2026, state-wise](${abs('/bank-holidays-2026')})
- [Saturday bank holiday rule](${abs('/saturday-bank-holiday')}): banks close on the 2nd and 4th Saturday
- [Share market today](${abs('/share-market')}) and [NSE & BSE holidays 2026](${abs('/nse-bse-holidays-2026')})
- [Post office holidays 2026](${abs('/post-office-holidays-2026')}) and [2027](${abs('/post-office-holidays-2027')})
- [Hindi: aaj bank khula hai?](${abs('/hi')})
- [Sources & method](${abs('/about')})

## State lists
${STATES.map((s) => `- [${s.name}](${abs(`/bank-holidays-2026/${s.slug}`)})`).join('\n')}

## City pages (is the bank open today?)
${CITIES.map((c) => `- [${c.name}](${abs(`/${c.slug}/bank`)})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
