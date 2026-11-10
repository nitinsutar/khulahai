import { City, stateBySlug } from '@/lib/places';
import { DayStatus, RBI } from '@/lib/data';
import { fmtLong, fmtMed } from '@/lib/date';
import { shortName } from '@/lib/names';

const RBI_URL = 'https://rbi.org.in/Scripts/HolidayMatrixDisplay.aspx';
export function BankAnswer({ city, s, nextOpen, lang = 'en', when = 'today' }: { city: City; s: DayStatus; nextOpen: string; lang?: 'en' | 'hi'; when?: 'today' | 'tomorrow' }) {
  const hi = lang === 'hi';
  const centre = RBI.offices[city.office].name;
  const st = stateBySlug(city.state)!;
  const d = fmtLong(s.date, lang);
  const src = <a href={RBI_URL} rel="noopener">{hi ? 'आरबीआई अवकाश तालिका' : 'RBI holiday matrix'}</a>;
  const derived = city.derived ? (hi ? ` (${city.hi} के लिए ${st.hi} का आरबीआई ${centre} केंद्र)` : ` (${city.name} uses RBI’s ${centre} centre for ${st.name})`) : '';
  if (hi) {
    const centre = city.derived ? RBI.offices[city.office].name : city.hi;
    const tw = when === 'today' ? 'आज' : 'कल';
    if (s.open) return <p className="answer"><b>हाँ, {city.hi} में बैंक शाखाएँ {tw}, {d}, खुली {when === 'today' ? 'हैं' : 'रहेंगी'}।</b> आरबीआई ने {centre} केंद्र के लिए इस दिन कोई अवकाश नहीं दिया है{derived} ({src})। UPI, ATM और नेट बैंकिंग हमेशा की तरह चलते हैं।</p>;
    const why = s.reason.kind === 'holiday' ? `${shortName(s.reason.rbi!, 'hi')} के कारण, जो परक्राम्य लिखत अधिनियम के तहत आरबीआई ${centre} केंद्र का अवकाश है` : s.reason.kind === 'sunday' ? 'रविवार के कारण' : `महीने के ${s.reason.kind === 'saturday2' ? 'दूसरे' : 'चौथे'} शनिवार के कारण (पूरे भारत में)`;
    return <p className="answer"><b>नहीं, {city.hi} में बैंक शाखाएँ {tw}, {d}, बंद {when === 'today' ? 'हैं' : 'रहेंगी'}</b> — {why}{derived} ({src})। UPI, ATM और नेट बैंकिंग चलते रहेंगे; चेक क्लियरिंग और शाखा का काम {fmtMed(nextOpen, 'hi')} को फिर शुरू होगा।</p>;
  }
  const tw = when;
  if (s.open) return <p className="answer"><b>Yes, bank branches in {city.name} are open {tw}, {d}.</b> RBI lists no holiday for its {centre} centre on this day{derived} ({src}). UPI, ATMs and net banking work as usual.</p>;
  const why = s.reason.kind === 'holiday' ? <>for {shortName(s.reason.rbi!)}, a holiday listed for the RBI {centre} centre under the Negotiable Instruments Act</> : s.reason.kind === 'sunday' ? <>because it is a Sunday</> : <>because it is the {s.reason.kind === 'saturday2' ? 'second' : 'fourth'} Saturday of the month (all of India)</>;
  return <p className="answer"><b>No, bank branches in {city.name} are closed {tw}, {d},</b> {why}{derived} ({src}). UPI, ATMs and net banking still work; cheque clearing and branch work resume on {fmtMed(nextOpen)}.</p>;
}
export function bankAnswerText(city: City, s: DayStatus, nextOpen: string): string {
  const centre = RBI.offices[city.office].name;
  const d = fmtLong(s.date);
  if (s.open) return `Yes, bank branches in ${city.name} are open on ${d}. RBI lists no holiday for its ${centre} centre that day. UPI, ATMs and net banking work as usual.`;
  const why = s.reason.kind === 'holiday' ? `for ${shortName(s.reason.rbi!)} (RBI ${centre} centre, Negotiable Instruments Act holiday)` : s.reason.kind === 'sunday' ? 'because it is a Sunday' : `because it is the ${s.reason.kind === 'saturday2' ? 'second' : 'fourth'} Saturday`;
  return `No, bank branches in ${city.name} are closed on ${d}, ${why}. UPI, ATMs and net banking still work; branch work resumes on ${fmtMed(nextOpen)}.`;
}
