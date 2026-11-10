import type { Reason } from './data';
import { shortName } from './names';
type L = 'en' | 'hi';

export function bankReason(r: Reason, l: L, where: string): string {
  const hi = l === 'hi';
  switch (r.kind) {
    case 'holiday': return hi ? `${where} में आरबीआई अवकाश: ${shortName(r.rbi!, 'hi')}।` : `RBI holiday in ${where}: ${shortName(r.rbi!)}.`;
    case 'sunday': return hi ? 'रविवार — बैंकों का साप्ताहिक अवकाश।' : 'Sunday — weekly holiday for banks.';
    case 'saturday2': return hi ? 'महीने का दूसरा शनिवार — सभी बैंक दूसरे और चौथे शनिवार को बंद रहते हैं।' : 'Second Saturday of the month — all banks close on the 2nd and 4th Saturday.';
    case 'saturday4': return hi ? 'महीने का चौथा शनिवार — सभी बैंक दूसरे और चौथे शनिवार को बंद रहते हैं।' : 'Fourth Saturday of the month — all banks close on the 2nd and 4th Saturday.';
    case 'saturdayOpen': return hi ? 'यह दूसरा या चौथा शनिवार नहीं है, इसलिए बैंक खुले हैं।' : 'Not a 2nd or 4th Saturday, so banks are working.';
    case 'nodata': return hi ? 'आरबीआई ने इस वर्ष की सूची अभी जारी नहीं की है; केवल रविवार और शनिवार नियम लागू।' : 'RBI has not published this year’s list yet; only the Sunday and Saturday rules are applied.';
    default: return hi ? `नियमित कार्य दिवस। आज ${where} के लिए कोई आरबीआई अवकाश नहीं है।` : `Regular working day. RBI lists no holiday for ${where} today.`;
  }
}
export function bankShort(r: Reason, l: L): string {
  const hi = l === 'hi';
  switch (r.kind) {
    case 'holiday': return shortName(r.rbi!, l);
    case 'sunday': return hi ? 'रविवार' : 'Sunday';
    case 'saturday2': return hi ? 'दूसरा शनिवार' : '2nd Saturday';
    case 'saturday4': return hi ? 'चौथा शनिवार' : '4th Saturday';
    case 'saturdayOpen': return hi ? 'शनिवार, खुला' : 'Working Saturday';
    default: return hi ? 'कार्य दिवस' : 'Working day';
  }
}
export const T = {
  open: (l: L) => (l === 'hi' ? 'आज खुला है' : 'Open today'),
  closed: (l: L) => (l === 'hi' ? 'आज बंद है' : 'Closed today'),
  o: (l: L) => (l === 'hi' ? 'खुला' : 'Open'),
  c: (l: L) => (l === 'hi' ? 'बंद' : 'Closed'),
};
