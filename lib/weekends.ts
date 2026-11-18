import { bankDay, cityHolidays, officeHolidays, type Hol, type Reason } from './data';
import { addDays, yearNum } from './date';
import { knownBankDay, DATA_YEAR } from './clearing';
import { RBI_STATES, STATES, stateBySlug, type State } from './places';
import { RBI } from './data';

export type Stretch = {
  start: string;
  end: string;
  days: number;
  dates: string[];
  holidays: { date: string; name: string }[];
  weeklyOffs: { date: string; kind: Reason['kind'] }[];
  leaveDate?: string;
  uncertainEnd: boolean;
};

export type WeekendPlan = {
  from: string;
  until: string;
  natural: Stretch[];
  bridges: Stretch[];
  pendingYearEnd: { date: string; name?: string; kind: Reason['kind'] }[];
};

function dayInfo(hols: Hol[], iso: string): { kind: 'open' } | { kind: 'closed'; reason: Reason } | { kind: 'pending' } {
  const d = knownBankDay(hols, iso);
  if (d.kind === 'pending') return { kind: 'pending' };
  if (d.status.open) return { kind: 'open' };
  return { kind: 'closed', reason: d.status.reason };
}

function collect(dates: string[], hols: Hol[], leaveDate?: string, uncertainEnd = false): Stretch {
  const holidays: Stretch['holidays'] = [];
  const weeklyOffs: Stretch['weeklyOffs'] = [];
  for (const date of dates) {
    if (leaveDate && date === leaveDate) continue;
    const d = knownBankDay(hols, date);
    if (d.kind !== 'known' || d.status.open) continue;
    if (d.status.reason.kind === 'holiday' && d.status.reason.name) holidays.push({ date, name: d.status.reason.name });
    else weeklyOffs.push({ date, kind: d.status.reason.kind });
  }
  return {
    start: dates[0],
    end: dates[dates.length - 1],
    days: dates.length,
    dates,
    holidays,
    weeklyOffs,
    leaveDate,
    uncertainEnd,
  };
}

/** Walk a closed (or leave-day) stretch starting at `start`, not inventing 2027 holidays. */
function walkStretch(hols: Hol[], start: string, isInStretch: (iso: string) => boolean, untilHard: string): { dates: string[]; uncertainEnd: boolean } | null {
  const dates: string[] = [];
  let iso = start;
  let uncertainEnd = false;
  // walk backward to the beginning of the stretch, but not before a reasonable bound
  for (let i = 0; i < 20; i++) {
    const prev = addDays(iso, -1);
    const info = dayInfo(hols, prev);
    if (info.kind === 'pending') break;
    if (info.kind === 'closed' || isInStretch(prev)) iso = prev;
    else break;
  }
  const startIso = iso;
  iso = startIso;
  for (let i = 0; i < 20; i++) {
    if (iso > untilHard && yearNum(iso) === DATA_YEAR + 1) {
      // into unpublished year: only continue through known weekly offs
      const info = dayInfo(hols, iso);
      if (info.kind === 'pending') {
        uncertainEnd = true;
        break;
      }
      if (info.kind === 'closed' || isInStretch(iso)) {
        dates.push(iso);
        iso = addDays(iso, 1);
        continue;
      }
      break;
    }
    const info = dayInfo(hols, iso);
    if (info.kind === 'pending') {
      uncertainEnd = true;
      break;
    }
    if (info.kind === 'closed' || isInStretch(iso)) {
      dates.push(iso);
      iso = addDays(iso, 1);
      continue;
    }
    break;
  }
  if (!dates.length) return null;
  return { dates, uncertainEnd };
}

export function weekendPlan(hols: Hol[], from: string, until = `${DATA_YEAR}-12-31`): WeekendPlan {
  const natural: Stretch[] = [];
  const bridges: Stretch[] = [];
  const pendingYearEnd: WeekendPlan['pendingYearEnd'] = [];

  let iso = from;
  // Include a stretch that started before `from` but still overlaps remaining days.
  const lookback = addDays(from, -7);
  while (iso <= until) {
    const info = dayInfo(hols, iso);
    if (info.kind === 'closed') {
      const walked = walkStretch(hols, iso, () => false, until);
      if (walked && walked.dates[walked.dates.length - 1] >= from) {
        const stretch = collect(walked.dates, hols, undefined, walked.uncertainEnd);
        if (stretch.days >= 3 && stretch.start >= lookback) {
          if (!natural.some((s) => s.start === stretch.start && s.end === stretch.end)) natural.push(stretch);
        }
        iso = addDays(walked.dates[walked.dates.length - 1], 1);
        continue;
      }
    }
    iso = addDays(iso, 1);
  }

  iso = from;
  while (iso <= until) {
    const info = dayInfo(hols, iso);
    if (info.kind === 'open') {
      const walked = walkStretch(hols, iso, (d) => d === iso, until);
      if (walked) {
        const stretch = collect(walked.dates, hols, iso, walked.uncertainEnd);
        // Only show "take 1 leave, get 4+ days" when the leave is in 2026 and the stretch is 4+ days
        // and at least two of those days fall on or after `from`.
        if (stretch.days >= 4 && yearNum(iso) === DATA_YEAR && stretch.end >= from && !stretch.uncertainEnd) {
          bridges.push(stretch);
        }
      }
    }
    iso = addDays(iso, 1);
  }

  // Closures at the end of 2026 that might extend into unpublished 2027 lists.
  for (let d = `${DATA_YEAR}-12-28`; d <= `${DATA_YEAR}-12-31`; d = addDays(d, 1)) {
    const info = dayInfo(hols, d);
    if (info.kind !== 'closed') continue;
    const next = addDays(d, 1);
    if (yearNum(next) !== DATA_YEAR + 1) continue;
    const n = dayInfo(hols, next);
    if (n.kind === 'pending' || n.kind === 'closed') {
      pendingYearEnd.push({ date: d, name: info.reason.kind === 'holiday' ? info.reason.name : undefined, kind: info.reason.kind });
    }
  }

  return { from, until, natural, bridges, pendingYearEnd };
}

export function planForOffice(officeSlug: string, from: string): WeekendPlan {
  return weekendPlan(officeHolidays(officeSlug), from);
}

export function planForState(stateSlug: string, from: string): { state: State; offices: { slug: string; name: string; plan: WeekendPlan }[] } | null {
  const st = stateBySlug(stateSlug);
  if (!st) return null;
  const offices = st.offices.map((slug) => ({
    slug,
    name: RBI.offices[slug].name,
    plan: planForOffice(slug, from),
  }));
  return { state: st, offices };
}

export function plansIdentical(a: WeekendPlan, b: WeekendPlan): boolean {
  const key = (p: WeekendPlan) =>
    JSON.stringify({
      n: p.natural.map((s) => [s.start, s.end, s.days]),
      b: p.bridges.map((s) => [s.leaveDate, s.start, s.end, s.days]),
      p: p.pendingYearEnd,
    });
  return key(a) === key(b);
}

export { cityHolidays, RBI_STATES, STATES };
