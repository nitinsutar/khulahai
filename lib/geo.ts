import { CITIES } from './places';
const ALIAS: Record<string, string> = { bangalore: 'bengaluru', 'new delhi': 'delhi', gurgaon: 'delhi', gurugram: 'delhi', noida: 'delhi', 'greater noida': 'delhi', ghaziabad: 'delhi', faridabad: 'delhi', bombay: 'mumbai', calcutta: 'kolkata', madras: 'chennai', trivandrum: 'thiruvananthapuram', cochin: 'kochi', ernakulam: 'kochi', vizag: 'visakhapatnam', panjim: 'panaji', goa: 'panaji', secunderabad: 'hyderabad', 'navi mumbai': 'navi-mumbai', mohali: 'chandigarh', panchkula: 'chandigarh' };
export function cityFromHeader(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let v = raw;
  try { v = decodeURIComponent(raw); } catch {}
  const k = v.trim().toLowerCase();
  if (ALIAS[k]) return ALIAS[k];
  const c = CITIES.find((c) => c.name.toLowerCase() === k || c.slug === k.replace(/\s+/g, '-'));
  return c?.slug ?? null;
}
