import { RBI, NSE, INDIAPOST, LAST_CHECKED } from '@/lib/data';
import { STATES } from '@/lib/places';

export const dynamic = 'force-static';
export const dynamicParams = false;
const FILES = ['bank-holidays-2026.csv', 'nse-bse-holidays-2026.csv', 'post-office-holidays-2026.csv'];
export const generateStaticParams = () => FILES.map((file) => ({ file }));

const q = (v: string | number | boolean) => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = (rows: (string | number | boolean)[][]) => rows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n';

function build(file: string): string | null {
  if (file === 'bank-holidays-2026.csv') {
    const rows: (string | number | boolean)[][] = [['date', 'rbi_office', 'rbi_office_slug', 'states_using_this_list', 'holiday_name_rbi', 'type', 'source', 'last_checked']];
    for (const [slug, o] of Object.entries(RBI.offices)) {
      const states = STATES.filter((s) => s.offices.includes(slug)).map((s) => s.name + (s.mappedFrom ? ' (mapped)' : '')).join('; ');
      for (const h of o.holidays) rows.push([h.d, o.name, slug, states, h.n, h.t === 'accounts' ? 'closure of accounts' : 'NI Act holiday', RBI.source, LAST_CHECKED]);
    }
    rows.splice(1, rows.length - 1, ...rows.slice(1).sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1]))));
    return csv(rows);
  }
  if (file === 'nse-bse-holidays-2026.csv') {
    return csv([['date', 'holiday', 'falls_on_weekend', 'segment', 'source', 'last_checked'], ...NSE.holidays.map((h) => [h.d, h.n, h.weekend, 'Equity & equity derivatives (NSE, BSE)', NSE.source, LAST_CHECKED])]);
  }
  if (file === 'post-office-holidays-2026.csv') {
    const rows: (string | number | boolean)[][] = [['date', 'circle', 'holiday', 'source', 'last_checked']];
    for (const [c, list] of Object.entries(INDIAPOST.circles)) for (const h of list) rows.push([h.d, c, h.n, INDIAPOST.source, LAST_CHECKED]);
    return csv(rows);
  }
  return null;
}
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const body = build(file);
  if (!body) return new Response('Not found', { status: 404 });
  return new Response(body, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${file}"`, 'cache-control': 'public, max-age=3600' } });
}
