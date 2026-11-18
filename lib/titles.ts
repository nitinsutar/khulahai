// Search titles and descriptions that lead with the day's answer, computed from site holiday data.
import { fmtDM, fmtDMs } from './date';
import { bankDay, officesClosedOn, type DayStatus, type PostStatus } from './data';
import { bankShort } from './text';
import type { City } from './places';

export const GNJ_2026 = '2026-11-24';

export const dEn = (iso: string) => fmtDMs(iso, 'en');
export const dHi = (iso: string) => fmtDM(iso, 'hi');

export function clip(s: string, n = 155): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const sentences = t.match(/[^.!?।]+[.!?।]/g);
  if (!sentences) return t.slice(0, n).replace(/\s+\S*$/, '').replace(/[,;:]+$/, '');
  let out = '';
  for (const sent of sentences) {
    const next = `${out} ${sent.trim()}`.trim();
    if (next.length <= n) out = next;
    else break;
  }
  return out || t.slice(0, n);
}

function satLabel(kind: DayStatus['reason']['kind'], lang: 'en' | 'hi'): string | null {
  if (kind === 'saturday2') return lang === 'hi' ? 'दूसरा शनिवार' : '2nd Saturday';
  if (kind === 'saturday4') return lang === 'hi' ? 'चौथा शनिवार' : '4th Saturday';
  if (kind === 'sunday') return lang === 'hi' ? 'रविवार' : 'Sunday';
  if (kind === 'saturdayOpen') return lang === 'hi' ? 'कार्य शनिवार' : 'working Saturday';
  return null;
}

export function gnjBankClosedCount() {
  return officesClosedOn(GNJ_2026).length;
}

export function gnjUpcoming(today: string, lang: 'en' | 'hi'): string | null {
  if (today > GNJ_2026) return null;
  const n = gnjBankClosedCount();
  if (today === GNJ_2026) {
    return lang === 'hi'
      ? `आज गुरु नानक जयंती है: 34 में से ${n} केंद्रों में बैंक बंद।`
      : `Today is Guru Nanak Jayanti: closed at ${n} of 34 centres.`;
  }
  return lang === 'hi'
    ? `24 नवंबर, गुरु नानक जयंती: 34 में से ${n} केंद्र बंद।`
    : `24 Nov, Guru Nanak Jayanti: closed at ${n} of 34 centres.`;
}

export function gnjCityBankLine(city: City, today: string, gnj: DayStatus, lang: 'en' | 'hi'): string | null {
  if (today > GNJ_2026) return null;
  const name = lang === 'hi' ? city.hi : city.name;
  if (lang === 'hi') {
    return gnj.open
      ? `${name} में बैंक खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है।`
      : `${name} में बैंक बंद हैं, आरबीआई सूची के अनुसार।`;
  }
  return gnj.open
    ? `banks in ${name} stay open; RBI lists no holiday for this centre.`
    : `banks in ${name} are closed, from the RBI holiday matrix.`;
}

export function gnjCityBankMeta(city: City, today: string, gnj: DayStatus, lang: 'en' | 'hi'): string | null {
  if (today > GNJ_2026) return null;
  if (lang === 'hi') {
    return gnj.open ? '24 नवंबर, गुरु नानक जयंती: बैंक खुले रहेंगे।' : '24 नवंबर, गुरु नानक जयंती: बैंक बंद।';
  }
  return gnj.open ? '24 Nov, Guru Nanak Jayanti: banks stay open.' : '24 Nov, Guru Nanak Jayanti: banks are closed.';
}

export function bankNationalMeta(date: string, lang: 'en' | 'hi', when: 'today' | 'tomorrow' = 'today') {
  const s = bankDay([], date);
  const n = officesClosedOn(date).length;
  const de = dEn(date);
  const dh = dHi(date);
  const sat = satLabel(s.reason.kind, lang);
  const holiday = s.reason.kind === 'holiday' ? s.reason.name : date === GNJ_2026 ? 'Guru Nanak Jayanti' : null;

  let title: string;
  if (lang === 'hi') {
    const w = when === 'today' ? 'आज' : 'कल';
    if (!s.open) title = `नहीं, ${w} बैंक बंद है, ${dh}${sat ? `, ${sat}` : ''}`;
    else if (n) title = `${w} बैंक खुला है, ${dh}, ${n} केंद्र बंद`;
    else title = `हाँ, ${w} बैंक खुला है, ${dh}`;
  } else {
    const w = when;
    if (!s.open) title = `No, banks closed ${w}, ${de}${sat ? ` (${sat})` : ''}`;
    else if (n) title = `Banks open ${w}, ${de}, except ${n} RBI centres`;
    else title = `Yes, banks open ${w}, ${de}, across India`;
  }

  const bits: string[] = [];
  if (lang === 'hi') {
    const w = when === 'today' ? 'आज' : 'कल';
    if (!s.open) bits.push(`नहीं, ${w}, ${dh}, पूरे भारत में बैंक बंद हैं${sat ? ` (${sat})` : ''}${holiday && !sat ? ` (${holiday})` : ''}।`);
    else if (n) bits.push(`${w}, ${dh}, ज़्यादातर भारत में बैंक खुले हैं, लेकिन ${n} आरबीआई केंद्रों में बंद हैं।`);
    else bits.push(`हाँ, ${w}, ${dh}, पूरे भारत में बैंक खुले हैं।`);
    bits.push('स्रोत: आरबीआई अवकाश तालिका।');
    const g = gnjUpcoming(when === 'today' ? date : date, lang);
    // For tomorrow pages, date is tomorrow; still mention GNJ if that day or later is GNJ.
    if (g && !(date === GNJ_2026 && !s.open && n === 0) && date <= GNJ_2026) bits.push(g);
  } else {
    const w = when;
    if (!s.open) bits.push(`No, banks are closed across India ${w}, ${de}${sat ? ` (${sat})` : holiday ? ` (${holiday})` : ''}.`);
    else if (n) bits.push(`Banks are open in most of India ${w}, ${de}, but closed at ${n} RBI centres.`);
    else bits.push(`Yes, banks are open across India ${w}, ${de}.`);
    bits.push('Source: RBI holiday matrix.');
    const g = gnjUpcoming(date, lang);
    if (g && date <= GNJ_2026) bits.push(g);
  }

  return {
    title,
    description: clip(bits.join(' ')),
    ogV: (!s.open ? 'no' : n ? 'neu' : 'yes') as 'yes' | 'no' | 'neu',
  };
}

export function bankCityMeta(city: City, date: string, s: DayStatus, lang: 'en' | 'hi', gnj?: DayStatus) {
  const name = lang === 'hi' ? city.hi : city.name;
  const de = dEn(date);
  const dh = dHi(date);
  const why = bankShort(s.reason, lang).replace(/^Working day$/, 'working day');
  const unsure = s.reason.kind === 'nodata';

  let title: string;
  if (lang === 'hi') {
    if (unsure) title = `आज ${name} में बैंक, ${dh}: 2027 सूची अभी नहीं`;
    else title = s.open ? `हाँ, आज ${name} में बैंक खुला है, ${dh}` : `नहीं, आज ${name} में बैंक बंद है, ${dh}`;
  } else if (unsure) {
    title = `Bank today in ${name}, ${de}: 2027 list not out yet`;
  } else {
    title = s.open ? `Yes, bank open today in ${name}, ${de}` : `No, bank closed today in ${name}, ${de}`;
  }

  const bits: string[] = [];
  if (lang === 'hi') {
    if (unsure) bits.push(`${name} में आज, ${dh}, बैंक की स्थिति: रविवार और दूसरे/चौथे शनिवार का नियम लागू है; आरबीआई की इस वर्ष की सूची अभी नहीं आई है।`);
    else bits.push(`${s.open ? 'हाँ' : 'नहीं'}, ${name} में आज, ${dh}, बैंक ${s.open ? 'खुले हैं' : 'बंद हैं'} (${why})।`);
    bits.push('स्रोत: आरबीआई अवकाश तालिका।');
    const g = gnj ? gnjCityBankMeta(city, date, gnj, lang) : null;
    if (g) bits.push(g);
  } else {
    if (unsure) bits.push(`Banks in ${name} today, ${de}: only Sunday and 2nd/4th Saturday rules apply; RBI has not published this year's list yet.`);
    else bits.push(`${s.open ? 'Yes' : 'No'}, banks in ${name} are ${s.open ? 'open' : 'closed'} today, ${de} (${why}).`);
    bits.push('Source: RBI holiday matrix.');
    const g = gnj ? gnjCityBankMeta(city, date, gnj, lang) : null;
    if (g) bits.push(g);
  }

  return {
    title,
    description: clip(bits.join(' ')),
    ogV: (unsure ? 'neu' : s.open ? 'yes' : 'no') as 'yes' | 'no' | 'neu',
  };
}

export function postCityMeta(city: City, date: string, p: PostStatus, lang: 'en' | 'hi') {
  const name = lang === 'hi' ? city.hi : city.name;
  const de = dEn(date);
  const dh = dHi(date);
  const definite = p.state === 'open' || p.state === 'closed';

  let title: string;
  if (lang === 'hi') {
    if (p.state === 'closed') title = `नहीं, आज ${name} में डाकघर बंद है, ${dh}`;
    else if (p.state === 'open') title = `हाँ, आज ${name} में डाकघर खुला है, ${dh}`;
    else if (p.kind === 'saturday') title = `आज ${name} में डाकघर, ${dh}: शनिवार का समय जाँचें`;
    else title = `आज ${name} में डाकघर, ${dh}: स्थानीय रूप से जाँचें`;
  } else if (p.state === 'closed') {
    title = `No, post office closed today in ${name}, ${de}`;
  } else if (p.state === 'open') {
    title = `Yes, post office open today in ${name}, ${de}`;
  } else if (p.kind === 'saturday') {
    title = `Post office today in ${name}, ${de}: hours vary`;
  } else {
    title = `Post office today in ${name}, ${de}: check locally`;
  }

  const bits: string[] = [];
  if (lang === 'hi') {
    if (p.state === 'closed') bits.push(`नहीं, ${name} में आज, ${dh}, डाकघर बंद हैं${p.name ? ` (${p.hi || p.name})` : ''}।`);
    else if (p.state === 'open') bits.push(`हाँ, ${name} में आज, ${dh}, डाकघर खुले हैं।`);
    else if (p.kind === 'saturday') bits.push(`${name} में आज, ${dh}, शनिवार है और भारत डाक की अवकाश सूची में नहीं है। समय कार्यालय के अनुसार अलग होता है, अपने डाकघर से पुष्टि करें।`);
    else bits.push(`${name} में आज, ${dh}, डाक अवकाश सूची अधूरी है; अपने डाकघर से पुष्टि करें।`);
    bits.push('स्रोत: भारत डाक अवकाश सूची।');
    if (date <= GNJ_2026) bits.push('24 नवंबर, गुरु नानक जयंती: अखिल भारतीय डाक अवकाश।');
  } else {
    if (p.state === 'closed') bits.push(`No, post offices in ${name} are closed today, ${de}${p.name ? ` (${p.name})` : ''}.`);
    else if (p.state === 'open') bits.push(`Yes, post offices in ${name} are open today, ${de}.`);
    else if (p.kind === 'saturday') bits.push(`Today, ${de}, is a Saturday and not on the India Post holiday list in ${name}. Saturday hours vary by office, so check locally.`);
    else bits.push(`Post office status in ${name} today, ${de}, should be confirmed locally; the circle list for this year is not fully published.`);
    bits.push('Source: India Post holidays list.');
    if (date <= GNJ_2026) bits.push("24 Nov, Guru Nanak's Birthday: All-India postal holiday.");
  }

  return {
    title,
    description: clip(bits.join(' ')),
    ogV: (p.state === 'closed' ? 'no' : definite ? 'yes' : 'neu') as 'yes' | 'no' | 'neu',
  };
}

export function postNationalMeta(date: string, summary: string, closedCount: number, allIndiaName?: string, isSaturday?: boolean, isSunday?: boolean) {
  const de = dEn(date);
  let title: string;
  if (isSunday || allIndiaName) title = `No, post offices closed today, ${de}, across India`;
  else if (isSaturday) title = `Post office today, ${de}: Saturday hours vary`;
  else if (closedCount) title = `Post offices open today, ${de}, except some circles`;
  else if (!date.startsWith('2026')) title = `Post office today, ${de}: ${date.slice(0, 4)} list not out yet`;
  else title = `Yes, post offices open today, ${de}, across India`;

  const first = (summary.split(/(?<=\.)\s/)[0] || summary).replace(/, [A-Za-z]+, \d+ [A-Za-z]+ \d{4}/, `, ${de}`);
  const extra = date <= GNJ_2026 && date !== GNJ_2026
    ? " 24 Nov, Guru Nanak's Birthday: All-India postal holiday."
    : '';
  return {
    title,
    description: clip(`${first} Source: India Post holidays list.${extra}`),
    ogV: (isSunday || allIndiaName ? 'no' : isSaturday || !date.startsWith('2026') ? 'neu' : closedCount ? 'neu' : 'yes') as 'yes' | 'no' | 'neu',
  };
}

export function bankCityH1(city: City, date: string, s: DayStatus, lang: 'en' | 'hi') {
  const name = lang === 'hi' ? city.hi : city.name;
  if (s.reason.kind === 'nodata') {
    return lang === 'hi' ? `आज ${name} में बैंक, ${dHi(date)}` : `Banks in ${name} today, ${dEn(date)}`;
  }
  if (lang === 'hi') return `${s.open ? 'हाँ' : 'नहीं'}, आज ${name} में बैंक ${s.open ? 'खुला है' : 'बंद है'}, ${dHi(date)}`;
  return `${s.open ? 'Yes' : 'No'}, bank ${s.open ? 'open' : 'closed'} today in ${name}, ${dEn(date)}`;
}

export function postCityH1(city: City, date: string, p: PostStatus, lang: 'en' | 'hi') {
  const name = lang === 'hi' ? city.hi : city.name;
  if (lang === 'hi') {
    if (p.state === 'closed') return `नहीं, आज ${name} में डाकघर बंद है, ${dHi(date)}`;
    if (p.state === 'open') return `हाँ, आज ${name} में डाकघर खुला है, ${dHi(date)}`;
    return `आज ${name} में डाकघर, ${dHi(date)}`;
  }
  if (p.state === 'closed') return `No, post office closed today in ${name}, ${dEn(date)}`;
  if (p.state === 'open') return `Yes, post office open today in ${name}, ${dEn(date)}`;
  return `Post office today in ${name}, ${dEn(date)}`;
}

export function bankNationalH1(date: string, lang: 'en' | 'hi', when: 'today' | 'tomorrow' = 'today') {
  const s = bankDay([], date);
  const n = officesClosedOn(date).length;
  if (lang === 'hi') {
    const w = when === 'today' ? 'आज' : 'कल';
    if (!s.open) return `नहीं, ${w} पूरे भारत में बैंक बंद है, ${dHi(date)}`;
    if (n) return `${w} बैंक खुला है, ${dHi(date)}, ${n} केंद्र बंद`;
    return `हाँ, ${w} पूरे भारत में बैंक खुला है, ${dHi(date)}`;
  }
  const w = when;
  if (!s.open) return `No, banks closed ${w} across India, ${dEn(date)}`;
  if (n) return `Banks open ${w}, ${dEn(date)}, except ${n} RBI centres`;
  return `Yes, banks open ${w} across India, ${dEn(date)}`;
}
