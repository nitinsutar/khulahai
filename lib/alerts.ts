import { cityBySlug, CITIES, type City } from './places';
import { addDays } from './date';
import { cityHolidays, bankDay, type DayStatus } from './data';

export const CONSENT_VERSION = '2026-11-18';
export const CONSENT_EN =
  'I agree that Khula Hai may store my WhatsApp number (and email, if I give one) to send me a message the evening before a bank holiday in the city I chose. I can ask to be removed at any time. Khula Hai will not send marketing messages.';
export const CONSENT_HI =
  'मैं सहमत हूँ कि खुला है मेरे व्हाट्सऐप नंबर (और ईमेल, अगर मैं दूँ) को इस लिए रख सकता है कि मेरे चुने शहर में बैंक छुट्टी से एक शाम पहले मुझे संदेश भेजे। मैं कभी भी हटाने को कह सकता हूँ। खुला है कोई विज्ञापन संदेश नहीं भेजेगा।';

export function parseIndianMobile(input: string): string | null {
  const d = (input || '').replace(/[^\d]/g, '');
  let n = d;
  if (n.startsWith('91') && n.length === 12) n = n.slice(2);
  if (n.startsWith('0') && n.length === 11) n = n.slice(1);
  if (/^[6-9]\d{9}$/.test(n)) return `+91${n}`;
  return null;
}

export function parseEmail(input: string | undefined): string | null | 'invalid' {
  const s = (input || '').trim();
  if (!s) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || s.length > 200) return 'invalid';
  return s.toLowerCase();
}

export type SignupInput = { city: string; phone: string; email?: string; consent: boolean };
export type SignupError = 'city' | 'phone' | 'email' | 'consent';

export function validateSignup(input: SignupInput): { ok: true; city: City; phone: string; email: string | null } | { ok: false; error: SignupError } {
  const city = cityBySlug((input.city || '').trim());
  if (!city) return { ok: false, error: 'city' };
  const phone = parseIndianMobile(input.phone || '');
  if (!phone) return { ok: false, error: 'phone' };
  const email = parseEmail(input.email);
  if (email === 'invalid') return { ok: false, error: 'email' };
  if (!input.consent) return { ok: false, error: 'consent' };
  return { ok: true, city, phone, email };
}

export function citiesClosedOn(iso: string): { city: City; status: DayStatus }[] {
  return CITIES.map((city) => ({ city, status: bankDay(cityHolidays(city), iso) })).filter((x) => !x.status.open);
}

export function citiesClosedTomorrow(from: string) {
  const date = addDays(from, 1);
  return { date, list: citiesClosedOn(date) };
}

export function cityClosedOn(city: City, iso: string) {
  const s = bankDay(cityHolidays(city), iso);
  return { closed: !s.open, status: s };
}
