import assert from 'node:assert/strict';
import { chequeClearing } from '../lib/clearing';
import { planForOffice, weekendPlan } from '../lib/weekends';
import { cityHolidays } from '../lib/data';
import { cityBySlug } from '../lib/places';
import { parseIndianMobile, validateSignup } from '../lib/alerts';

let failed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e) {
    failed++;
    console.error('FAIL', name, (e as Error).message);
  }
}

// ---- Cheque clearing ----
check('open weekday before cutoff, Mumbai, other bank: same day', () => {
  const r = chequeClearing({ depositDate: '2026-11-18', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-18');
});

check('open weekday after cutoff moves to next clearing day', () => {
  const r = chequeClearing({ depositDate: '2026-11-18', cutoff: 'after', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-19');
});

check('2nd Saturday 14 Nov after Friday cutoff: skip Sat+Sun to Monday 16', () => {
  const r = chequeClearing({ depositDate: '2026-11-13', cutoff: 'after', citySlug: 'pune', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') {
    assert.equal(r.creditDate, '2026-11-16');
    assert.deepEqual(r.skipped.map((s) => s.date), ['2026-11-14', '2026-11-15']);
    assert.equal(r.skipped[0].reason.kind, 'saturday2');
    assert.equal(r.skipped[1].reason.kind, 'sunday');
  }
});

check('deposit on 2nd Saturday itself, even before cutoff, waits till Monday', () => {
  const r = chequeClearing({ depositDate: '2026-11-14', cutoff: 'before', citySlug: 'delhi', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-16');
});

check('deposit on Sunday waits till Monday', () => {
  const r = chequeClearing({ depositDate: '2026-11-15', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-16');
});

check('4th Saturday 28 Nov: closed nationwide', () => {
  const r = chequeClearing({ depositDate: '2026-11-28', cutoff: 'before', citySlug: 'bengaluru', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-30'); // Sun 29, Mon 30
});

check('Guru Nanak Jayanti 24 Nov: Mumbai closed, credit 25 Nov', () => {
  const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') {
    assert.equal(r.creditDate, '2026-11-25');
    assert.equal(r.skipped[0].reason.kind, 'holiday');
  }
});

check('Guru Nanak Jayanti 24 Nov: Pune follows Mumbai, also closed', () => {
  const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'before', citySlug: 'pune', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-25');
});

check('Guru Nanak Jayanti 24 Nov: Bengaluru open, same-day credit', () => {
  const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'before', citySlug: 'bengaluru', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') {
    assert.equal(r.creditDate, '2026-11-24');
    assert.equal(r.skipped.length, 0);
  }
});

check('Guru Nanak Jayanti 24 Nov: Ahmedabad/Surat open, same-day credit', () => {
  for (const city of ['ahmedabad', 'surat', 'patna', 'chennai'] as const) {
    const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'before', citySlug: city, sameBank: false });
    assert.equal(r.kind, 'ok', city);
    if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-24', city);
  }
});

check('Guru Nanak after cutoff in open city moves to 25 Nov', () => {
  const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'after', citySlug: 'bengaluru', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-11-25');
});

check('Christmas 25 Dec closed everywhere; after 24 Dec cutoff in Mumbai -> 28 Dec', () => {
  const r = chequeClearing({ depositDate: '2026-12-24', cutoff: 'after', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') {
    assert.equal(r.creditDate, '2026-12-28');
    assert.deepEqual(r.skipped.map((s) => s.date), ['2026-12-25', '2026-12-26', '2026-12-27']);
    assert.equal(r.skipped[0].reason.kind, 'holiday');
    assert.equal(r.skipped[1].reason.kind, 'saturday4');
    assert.equal(r.skipped[2].reason.kind, 'sunday');
  }
});

check('Christmas Eve in Aizawl 24 Dec: next clearing 28 Dec', () => {
  const r = chequeClearing({ depositDate: '2026-12-23', cutoff: 'after', citySlug: 'aizawl', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-12-28');
});

check('Mumbai 31 Dec 2026 before cutoff: open, same day (2027 not needed)', () => {
  const r = chequeClearing({ depositDate: '2026-12-31', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') assert.equal(r.creditDate, '2026-12-31');
});

check('Mumbai 31 Dec 2026 after cutoff: needs 2027 list, refuse', () => {
  const r = chequeClearing({ depositDate: '2026-12-31', cutoff: 'after', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'pending');
  if (r.kind === 'pending') assert.equal(r.why, 'no-2027');
});

check('Aizawl 31 Dec is New Year Eve; even before cutoff needs 2027', () => {
  const r = chequeClearing({ depositDate: '2026-12-31', cutoff: 'before', citySlug: 'aizawl', sameBank: false });
  assert.equal(r.kind, 'pending');
  if (r.kind === 'pending') assert.equal(r.why, 'no-2027');
});

check('2027 deposit date is refused', () => {
  const r = chequeClearing({ depositDate: '2027-01-04', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'pending');
  if (r.kind === 'pending') assert.equal(r.why, 'no-2027');
});

check('2025 deposit date is refused', () => {
  const r = chequeClearing({ depositDate: '2025-12-31', cutoff: 'before', citySlug: 'mumbai', sameBank: false });
  assert.equal(r.kind, 'pending');
  if (r.kind === 'pending') assert.equal(r.why, 'outside-year');
});

check('same-bank uses the same working-day calendar', () => {
  const r = chequeClearing({ depositDate: '2026-11-14', cutoff: 'before', citySlug: 'mumbai', sameBank: true });
  assert.equal(r.kind, 'ok');
  if (r.kind === 'ok') {
    assert.equal(r.sameBank, true);
    assert.equal(r.creditDate, '2026-11-16');
  }
});

check('invalid city and date', () => {
  assert.equal(chequeClearing({ depositDate: '2026-13-40', cutoff: 'before', citySlug: 'mumbai', sameBank: false }).kind, 'invalid');
  assert.equal(chequeClearing({ depositDate: '2026-11-18', cutoff: 'before', citySlug: 'not-a-city', sameBank: false }).kind, 'invalid');
});

// ---- Long weekends ----
check('Mumbai Christmas week is a 3-day natural break 25-27 Dec', () => {
  const p = planForOffice('mumbai', '2026-11-18');
  const xmas = p.natural.find((s) => s.start === '2026-12-25' && s.end === '2026-12-27');
  assert.ok(xmas, 'missing xmas stretch');
  assert.equal(xmas!.days, 3);
});

check('Mumbai take 24 Dec leave yields 4 days 24-27', () => {
  const p = planForOffice('mumbai', '2026-11-18');
  const b = p.bridges.find((s) => s.leaveDate === '2026-12-24');
  assert.ok(b, 'missing 24 Dec bridge');
  assert.equal(b!.start, '2026-12-24');
  assert.equal(b!.end, '2026-12-27');
  assert.equal(b!.days, 4);
});

check('Mumbai take 28 Dec leave yields 4 days 25-28', () => {
  const p = planForOffice('mumbai', '2026-11-18');
  const b = p.bridges.find((s) => s.leaveDate === '2026-12-28');
  assert.ok(b);
  assert.equal(b!.days, 4);
  assert.equal(b!.start, '2026-12-25');
  assert.equal(b!.end, '2026-12-28');
});

check('Aizawl already has a 4-day natural break 24-27 Dec', () => {
  const p = planForOffice('aizawl', '2026-11-18');
  const n = p.natural.find((s) => s.start === '2026-12-24' && s.end === '2026-12-27');
  assert.ok(n);
  assert.equal(n!.days, 4);
});

check('Guru Nanak Tuesday in Mumbai is not a 3-day natural break', () => {
  const p = planForOffice('mumbai', '2026-11-18');
  const g = p.natural.filter((s) => s.dates.includes('2026-11-24'));
  assert.equal(g.length, 0);
});

check('Bengaluru has no Guru Nanak closure, so no GNJ stretch', () => {
  const p = planForOffice('bengaluru', '2026-11-18');
  assert.equal(p.natural.filter((s) => s.dates.includes('2026-11-24')).length, 0);
  const r = chequeClearing({ depositDate: '2026-11-24', cutoff: 'before', citySlug: 'bengaluru', sameBank: false });
  assert.equal(r.kind, 'ok');
});

check('Aizawl 31 Dec pending year-end note, no invented 2027 long weekend', () => {
  const p = planForOffice('aizawl', '2026-11-18');
  assert.ok(p.pendingYearEnd.some((x) => x.date === '2026-12-31'));
  assert.equal(p.natural.some((s) => s.dates.includes('2027-01-01') && !s.uncertainEnd && s.days >= 3), false);
  assert.equal(p.bridges.some((s) => s.leaveDate && s.leaveDate.startsWith('2027')), false);
});

check('working 3rd Saturday breaks a stretch (take Friday 20 Nov is not 4 days)', () => {
  const p = planForOffice('mumbai', '2026-11-18');
  const b = p.bridges.find((s) => s.leaveDate === '2026-11-20');
  assert.equal(b, undefined);
});

check('city holidays helper matches office for derived Pune', () => {
  const pune = cityBySlug('pune')!;
  const plan = weekendPlan(cityHolidays(pune), '2026-11-18');
  const mum = planForOffice('mumbai', '2026-11-18');
  assert.equal(plan.natural.length, mum.natural.length);
});


check('indian mobile parsing', () => {
  assert.equal(parseIndianMobile('9876543210'), '+919876543210');
  assert.equal(parseIndianMobile('+91 98765 43210'), '+919876543210');
  assert.equal(parseIndianMobile('09876543210'), '+919876543210');
  assert.equal(parseIndianMobile('12345'), null);
  assert.equal(parseIndianMobile('0876543210'), null);
});

check('signup validation requires consent, city and phone', () => {
  const bad = validateSignup({ city: 'mumbai', phone: '9876543210', consent: false });
  assert.equal(bad.ok, false);
  const ok = validateSignup({ city: 'pune', phone: '9876543210', email: 'a@b.co', consent: true });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.phone, '+919876543210');
    assert.equal(ok.city.office, 'mumbai');
  }
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall tests passed');
