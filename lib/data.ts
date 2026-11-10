import rbi from '@/data/rbi-2026.json';
import nse from '@/data/nse-2026.json';
import central from '@/data/central.json';
import { addDays, dow, dayNum } from './date';
import { CITIES, STATES, City, cityBySlug, stateBySlug } from './places';

export type Hol = { d: string; n: string; t: string };
export const RBI = rbi as { source: string; title: string; checked: string; offices: Record<string, { name: string; state: string; holidays: Hol[] }> };
export const NSE = nse as { source: string; bseSource: string; bseSource2: string; checked: string; session: { preOpen: string; open: string; close: string }; muhurat: string; holidays: { d: string; n: string; weekend: boolean }[] };
type CH = { d: string; n: string; hi: string; c: boolean; moon?: boolean };
export const CENTRAL = central as unknown as { source: string; checked: string; '2026': { om: string; holidays: CH[] }; '2027': { om: string; pdf: string; holidays: CH[] } };
export const LAST_CHECKED = '2026-11-11';
export const DATA_YEAR = 2026;

const LOCAL_ONLY = /election|local holiday|municipal|jurisdiction/i;

export function officeHolidays(office: string): Hol[] {
  return RBI.offices[office]?.holidays ?? [];
}
export function cityHolidays(c: City): Hol[] {
  const h = officeHolidays(c.office);
  // A city without its own RBI office uses its state's list, minus holidays RBI limits to one district/municipality.
  return c.derived ? h.filter((x) => !LOCAL_ONLY.test(x.n) || /sankranti|pongal/i.test(x.n)) : h;
}

// ---------- Banks ----------
export type Reason = { kind: 'holiday' | 'sunday' | 'saturday2' | 'saturday4' | 'open' | 'saturdayOpen' | 'nodata'; name?: string; rbi?: string };
export type DayStatus = { date: string; open: boolean; reason: Reason };

export const secondOrFourthSat = (iso: string) => {
  if (dow(iso) !== 6) return 0;
  const n = Math.ceil(dayNum(iso) / 7);
  return n === 2 || n === 4 ? n : 0;
};

export function bankDay(hols: Hol[], iso: string): DayStatus {
  if (!iso.startsWith(String(DATA_YEAR))) {
    if (dow(iso) === 0) return { date: iso, open: false, reason: { kind: 'sunday' } };
    const s = secondOrFourthSat(iso);
    if (s) return { date: iso, open: false, reason: { kind: s === 2 ? 'saturday2' : 'saturday4' } };
    return { date: iso, open: true, reason: { kind: 'nodata' } };
  }
  const h = hols.find((x) => x.d === iso);
  if (h) return { date: iso, open: false, reason: { kind: 'holiday', rbi: h.n, name: h.n } };
  if (dow(iso) === 0) return { date: iso, open: false, reason: { kind: 'sunday' } };
  const s = secondOrFourthSat(iso);
  if (s) return { date: iso, open: false, reason: { kind: s === 2 ? 'saturday2' : 'saturday4' } };
  if (dow(iso) === 6) return { date: iso, open: true, reason: { kind: 'saturdayOpen' } };
  return { date: iso, open: true, reason: { kind: 'open' } };
}
export function nextBankOpen(hols: Hol[], iso: string) {
  for (let i = 1; i < 30; i++) {
    const d = addDays(iso, i);
    if (bankDay(hols, d).open) return d;
  }
  return addDays(iso, 1);
}
export function upcomingBankClosures(hols: Hol[], from: string, days = 45) {
  const out: DayStatus[] = [];
  for (let i = 0; i <= days; i++) {
    const d = addDays(from, i);
    const s = bankDay(hols, d);
    if (!s.open && s.reason.kind !== 'sunday') out.push(s);
  }
  return out;
}
export function nextFestivalHoliday(hols: Hol[], from: string) {
  return hols.find((h) => h.d > from);
}
export function citiesClosedOn(iso: string) {
  return CITIES.filter((c) => !c.derived)
    .map((c) => ({ c, s: bankDay(cityHolidays(c), iso) }))
    .filter((x) => !x.s.open && x.s.reason.kind === 'holiday');
}
export function officesClosedOn(iso: string) {
  return Object.entries(RBI.offices)
    .filter(([, o]) => o.holidays.some((h) => h.d === iso))
    .map(([slug, o]) => ({ slug, name: o.name, state: stateBySlug(o.state)!, h: o.holidays.find((h) => h.d === iso)! }));
}
// state list: union of the state's RBI offices
export function stateHolidays(stateSlug: string) {
  const st = stateBySlug(stateSlug)!;
  const map = new Map<string, { d: string; n: string; t: string; offices: string[] }>();
  for (const o of st.offices) {
    for (const h of officeHolidays(o)) {
      const k = h.d;
      const e = map.get(k);
      if (e) e.offices.push(RBI.offices[o].name);
      else map.set(k, { ...h, offices: [RBI.offices[o].name] });
    }
  }
  return [...map.values()].sort((a, b) => a.d.localeCompare(b.d)).map((x) => ({ ...x, all: x.offices.length === st.offices.length }));
}
export function saturdaysOff(year = DATA_YEAR) {
  const out: string[] = [];
  for (let d = `${year}-01-01`; d.startsWith(String(year)); d = addDays(d, 1)) if (secondOrFourthSat(d)) out.push(d);
  return out;
}

// ---------- Share market ----------
export function marketDay(iso: string) {
  const h = NSE.holidays.find((x) => x.d === iso);
  if (dow(iso) === 0 || dow(iso) === 6) return { date: iso, open: false, kind: 'weekend' as const, name: h?.n };
  if (!iso.startsWith(String(DATA_YEAR))) return { date: iso, open: true, kind: 'nodata' as const };
  if (h) return { date: iso, open: false, kind: 'holiday' as const, name: h.n };
  return { date: iso, open: true, kind: 'open' as const };
}
export const nextMarketOpen = (iso: string) => {
  for (let i = 1; i < 30; i++) {
    const d = addDays(iso, i);
    if (marketDay(d).open) return d;
  }
  return addDays(iso, 1);
};
export const nextMarketHoliday = (iso: string) => NSE.holidays.find((h) => !h.weekend && h.d > iso);
export const lastMarketHoliday = (iso: string) => [...NSE.holidays].reverse().find((h) => !h.weekend && h.d < iso);

// ---------- Post office ----------
// Post offices are central government offices. Compulsory DoPT holidays apply everywhere; Delhi also gets DoPT's 3 picks.
export type PostStatus = { date: string; state: 'open' | 'closed' | 'check'; kind: 'holiday' | 'sunday' | 'saturday' | 'open' | 'localFestival' | 'nodata'; name?: string; hi?: string; moon?: boolean; bankHoliday?: string };
export function centralList(year: 2026 | 2027) {
  return CENTRAL[String(year) as '2026' | '2027'].holidays;
}
export function postDay(stateSlug: string, iso: string, bankHols?: Hol[]): PostStatus {
  const y = iso.slice(0, 4);
  const list = y === '2026' || y === '2027' ? centralList(Number(y) as 2026 | 2027) : [];
  const isDelhi = stateSlug === 'delhi';
  const h = list.find((x) => x.d === iso && (x.c || isDelhi));
  if (h) return { date: iso, state: 'closed', kind: 'holiday', name: h.n, hi: h.hi, moon: h.moon };
  if (dow(iso) === 0) return { date: iso, state: 'closed', kind: 'sunday' };
  if (!isDelhi) {
    const opt = list.find((x) => x.d === iso && !x.c);
    if (opt) return { date: iso, state: 'check', kind: 'localFestival', name: opt.n, hi: opt.hi };
  }
  const bh = bankHols?.find((x) => x.d === iso && x.t === 'ni');
  if (bh && iso.startsWith('2026')) return { date: iso, state: 'open', kind: 'localFestival', bankHoliday: bh.n };
  if (dow(iso) === 6) return { date: iso, state: 'open', kind: 'saturday' };
  return { date: iso, state: 'open', kind: 'open' };
}
export function nextPostHoliday(stateSlug: string, iso: string) {
  const isDelhi = stateSlug === 'delhi';
  return [...centralList(2026), ...centralList(2027)].find((x) => x.d > iso && (x.c || isDelhi) && dow(x.d) !== 0);
}
export function nextPostOpen(stateSlug: string, iso: string) {
  for (let i = 1; i < 30; i++) {
    const d = addDays(iso, i);
    if (postDay(stateSlug, d).state !== 'closed') return d;
  }
  return addDays(iso, 1);
}

export { CITIES, STATES, cityBySlug, stateBySlug };
