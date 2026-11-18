import { bankDay, cityHolidays, type Hol, type Reason, RBI } from './data';
import { addDays, yearNum } from './date';
import { cityBySlug, type City } from './places';

export const CTS_CIRCULARS = {
  phase1: {
    id: 'RBI/2025-26/73',
    ref: 'CO.DPSS.RLPD.No.S536/04-07-001/2025-2026',
    date: '2025-08-13',
    title: 'Introduction of Continuous Clearing and Settlement on Realisation in Cheque Truncation System',
    href: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12891',
  },
  phase2postponed: {
    id: 'RBI/2025-26/156',
    ref: 'CO.DPSS.RLPD.No.S1039/04-07-001/2025-2026',
    date: '2025-12-24',
    title: 'Continuous Clearing and Settlement on Realisation in Cheque Truncation System: Phase 2',
    href: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13232',
  },
  neft: {
    id: 'RBI/2019-20/111',
    ref: 'DPSS (CO) RPPD No.1097/04.03.01/2019-20',
    date: '2019-12-06',
    title: 'Availability of National Electronic Funds Transfer (NEFT) System on 24x7 basis',
    href: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11750',
  },
  rtgs: {
    id: 'RBI/2020-21/70',
    ref: 'DPSS (CO) RTGS No.750/04.04.016/2020-21',
    date: '2020-12-04',
    title: '24x7 Availability of Real Time Gross Settlement (RTGS) System',
    href: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11998',
  },
} as const;

export const CTS_PRESENTATION = '09:00 to 15:00 IST';
export const CTS_CONFIRMATION = '09:00 to 19:00 IST';
export const DATA_YEAR = 2026;

export type Cutoff = 'before' | 'after';
export type Skip = { date: string; reason: Reason };

export type ClearingOk = {
  kind: 'ok';
  depositDate: string;
  cutoff: Cutoff;
  sameBank: boolean;
  city: City;
  creditDate: string;
  processDate: string;
  skipped: Skip[];
};

export type ClearingPending = {
  kind: 'pending';
  depositDate: string;
  cutoff: Cutoff;
  sameBank: boolean;
  city?: City;
  why: 'no-2027' | 'outside-year';
};

export type ClearingInvalid = { kind: 'invalid'; why: 'bad-date' | 'bad-city' };
export type ClearingResult = ClearingOk | ClearingPending | ClearingInvalid;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(s: string | undefined): string | null {
  if (!s || !ISO.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return s;
}

export function holidaysForCity(city: City): Hol[] {
  return cityHolidays(city);
}

/** A known closed/open working day, or pending when 2027 holiday data is required. */
export function knownBankDay(hols: Hol[], iso: string): { kind: 'known'; status: ReturnType<typeof bankDay> } | { kind: 'pending' } {
  const year = yearNum(iso);
  if (year === DATA_YEAR) return { kind: 'known', status: bankDay(hols, iso) };
  // Sundays and 2nd/4th Saturdays are closed in every year without a holiday list.
  const weekly = bankDay([], iso);
  if (!weekly.open && (weekly.reason.kind === 'sunday' || weekly.reason.kind === 'saturday2' || weekly.reason.kind === 'saturday4')) {
    return { kind: 'known', status: weekly };
  }
  return { kind: 'pending' };
}

function nextProcessDay(hols: Hol[], start: string, inclusive: boolean): { kind: 'ok'; date: string; skipped: Skip[] } | { kind: 'pending' } {
  const skipped: Skip[] = [];
  let iso = inclusive ? start : addDays(start, 1);
  for (let i = 0; i < 40; i++) {
    const d = knownBankDay(hols, iso);
    if (d.kind === 'pending') return { kind: 'pending' };
    if (d.status.open) return { kind: 'ok', date: iso, skipped };
    skipped.push({ date: iso, reason: d.status.reason });
    iso = addDays(iso, 1);
  }
  return { kind: 'pending' };
}

export function chequeClearing(opts: {
  depositDate: string;
  cutoff: Cutoff;
  citySlug: string;
  sameBank: boolean;
}): ClearingResult {
  const depositDate = parseIsoDate(opts.depositDate);
  if (!depositDate) return { kind: 'invalid', why: 'bad-date' };
  const city = cityBySlug(opts.citySlug);
  if (!city) return { kind: 'invalid', why: 'bad-city' };
  const year = yearNum(depositDate);
  if (year !== DATA_YEAR) {
    return { kind: 'pending', depositDate, cutoff: opts.cutoff, sameBank: opts.sameBank, city, why: year > DATA_YEAR ? 'no-2027' : 'outside-year' };
  }
  const hols = holidaysForCity(city);
  const day = knownBankDay(hols, depositDate);
  if (day.kind === 'pending') return { kind: 'pending', depositDate, cutoff: opts.cutoff, sameBank: opts.sameBank, city, why: 'no-2027' };

  const canProcessToday = day.status.open && opts.cutoff === 'before';
  const found = canProcessToday
    ? { kind: 'ok' as const, date: depositDate, skipped: [] as Skip[] }
    : nextProcessDay(hols, depositDate, day.status.open ? false : true);

  if (found.kind === 'pending') {
    return { kind: 'pending', depositDate, cutoff: opts.cutoff, sameBank: opts.sameBank, city, why: 'no-2027' };
  }

  // When the deposit day itself is closed, include it in skipped (nextProcessDay with inclusive true already does).
  // When the deposit day is open but after cut-off, it is not a holiday skip.
  return {
    kind: 'ok',
    depositDate,
    cutoff: opts.cutoff,
    sameBank: opts.sameBank,
    city,
    creditDate: found.date,
    processDate: found.date,
    skipped: found.skipped,
  };
}

export function officeLabel(city: City): { officeSlug: string; officeName: string } {
  return { officeSlug: city.office, officeName: RBI.offices[city.office].name };
}
