// All dates are ISO strings "YYYY-MM-DD" interpreted as calendar days in India (IST).
export const TZ = 'Asia/Kolkata';

export function todayIST(now: Date = new Date()): string {
  // en-CA gives YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function nowISTMinutes(now: Date = new Date()): number {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const h = Number(p.find((x) => x.type === 'hour')!.value);
  const m = Number(p.find((x) => x.type === 'minute')!.value);
  return h * 60 + m;
}
const toUTC = (iso: string) => new Date(iso + 'T00:00:00Z');
export const addDays = (iso: string, n: number) => {
  const d = toUTC(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const dow = (iso: string) => toUTC(iso).getUTCDay(); // 0 Sun..6 Sat
export const dayNum = (iso: string) => Number(iso.slice(8, 10));
export const monthNum = (iso: string) => Number(iso.slice(5, 7));
export const yearNum = (iso: string) => Number(iso.slice(0, 4));

type L = 'en' | 'hi';
const loc = (l: L) => (l === 'hi' ? 'hi-IN' : 'en-IN');
const f = (iso: string, l: L, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(loc(l), { timeZone: 'UTC', ...o }).format(toUTC(iso));
export const fmtLong = (iso: string, l: L = 'en') => f(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fmtMed = (iso: string, l: L = 'en') => f(iso, l, { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtDM = (iso: string, l: L = 'en') => f(iso, l, { day: 'numeric', month: 'long' });
export const fmtDMs = (iso: string, l: L = 'en') => f(iso, l, { day: 'numeric', month: 'short' });
export const fmtDow = (iso: string, l: L = 'en') => f(iso, l, { weekday: 'short' });
export const fmtDowLong = (iso: string, l: L = 'en') => f(iso, l, { weekday: 'long' });
export const monthName = (m: number, l: L = 'en') => f(`2026-${String(m).padStart(2, '0')}-01`, l, { month: 'long' });

export const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
