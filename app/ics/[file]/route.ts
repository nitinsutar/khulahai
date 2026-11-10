import { STATES, stateBySlug } from '@/lib/places';
import { stateHolidays, NSE, CENTRAL, INDIAPOST } from '@/lib/data';
import { addDays } from '@/lib/date';
import { shortName } from '@/lib/names';

export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() {
  return [...STATES.map((s) => ({ file: `bank-${s.slug}-2026.ics` })), { file: 'nse-bse-2026.ics' }, { file: 'post-office-2026.ics' }, { file: 'post-office-2027.ics' }];
}
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function fold(line: string) {
  const out: string[] = [];
  let l = line;
  while (Buffer.byteLength(l) > 74) { let i = 74; while (Buffer.byteLength(l.slice(0, i)) > 74) i--; out.push(l.slice(0, i)); l = ' ' + l.slice(i); }
  out.push(l);
  return out.join('\r\n');
}
function ics(name: string, events: { d: string; title: string; desc: string; uid: string }[]) {
  const stamp = '20261111T000000Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Khula Hai//khulahai.in//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${esc(name)}`, 'X-WR-TIMEZONE:Asia/Kolkata'];
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}@khulahai.in`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${e.d.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(e.d, 1).replace(/-/g, '')}`, `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.desc)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const f = (await params).file;
  let body = '';
  let m: RegExpMatchArray | null;
  if ((m = f.match(/^bank-(.+)-2026\.ics$/)) && stateBySlug(m[1])) {
    const st = stateBySlug(m[1])!;
    body = ics(`Bank holidays 2026 · ${st.name}`, stateHolidays(st.slug).map((h) => ({ d: h.d, uid: `bank-${st.slug}-${h.d}`, title: `Bank holiday: ${shortName(h.n)}`, desc: `RBI holiday (${h.offices.join(', ')}): ${h.n}. Source: RBI Holiday Matrix. khulahai.in` })));
  } else if (f === 'nse-bse-2026.ics') {
    body = ics('NSE & BSE trading holidays 2026', NSE.holidays.filter((h) => !h.weekend).map((h) => ({ d: h.d, uid: `nse-${h.d}`, title: `Market holiday: ${h.n}`, desc: 'NSE & BSE equity trading holiday. Source: NSE/BSE circulars. khulahai.in' })));
  } else if (f === 'post-office-2026.ics' || f === 'post-office-2027.ics') {
    const y = f.includes('2027') ? '2027' : '2026';
    if (y === '2026') body = ics('Post office holidays 2026 (All India)', INDIAPOST.circles['All India'].map((h) => ({ d: h.d, uid: `po-${h.d}-${h.n.replace(/\W+/g, '')}`, title: `Post office holiday: ${h.n}`, desc: `India Post All-India holiday. Your circle may add more. Source: ${INDIAPOST.source}. khulahai.in` })));
    else body = ics(`Post office holidays ${y}`, CENTRAL[y].holidays.filter((h) => h.c).map((h) => ({ d: h.d, uid: `po-${h.d}-${h.n.replace(/\W+/g, '')}`, title: `Post office holiday: ${h.n}`, desc: `Compulsory central government holiday. Source: ${CENTRAL[y].om}. khulahai.in` })));
  } else return new Response('Not found', { status: 404 });
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${f}"`, 'Cache-Control': 'public, max-age=86400' } });
}
