// Search titles and descriptions that lead with the day's answer, computed from site holiday data.
import { fmtDM, fmtDMs } from './date';
import { bankDay, officesClosedOn, type DayStatus, type PostStatus } from './data';
import { bankShort } from './text';
import type { City } from './places';
import { shortName } from './names';
import type { Lang } from './lang';
import { cityIn, cityName } from './lang';
import { t } from './copy';

export const GNJ_2026 = '2026-11-24';

export const dEn = (iso: string) => fmtDMs(iso, 'en');
export const dHi = (iso: string) => fmtDM(iso, 'hi');
export const dLoc = (iso: string, lang: Lang) => (lang === 'en' ? fmtDMs(iso, 'en') : fmtDM(iso, lang));

export function clip(s: string, n = 155): string {
  const t0 = s.replace(/\s+/g, ' ').trim();
  if (t0.length <= n) return t0;
  const sentences = t0.match(/[^.!?।]+[.!?।]/g);
  if (!sentences) return t0.slice(0, n).replace(/\s+\S*$/, '').replace(/[,;:]+$/, '');
  let out = '';
  for (const sent of sentences) {
    const next = `${out} ${sent.trim()}`.trim();
    if (next.length <= n) out = next;
    else break;
  }
  return out || t0.slice(0, n);
}

function satLabel(kind: DayStatus['reason']['kind'], lang: Lang): string | null {
  if (kind === 'saturday2') return bankShort({ kind: 'saturday2' } as DayStatus['reason'], lang);
  if (kind === 'saturday4') return bankShort({ kind: 'saturday4' } as DayStatus['reason'], lang);
  if (kind === 'sunday') return t(lang, 'sunday');
  if (kind === 'saturdayOpen') return lang === 'hi' ? 'कार्य शनिवार' : lang === 'en' ? 'working Saturday' : bankShort({ kind: 'saturdayOpen' } as DayStatus['reason'], lang);
  return null;
}

export function gnjBankClosedCount() {
  return officesClosedOn(GNJ_2026).length;
}

export function gnjUpcoming(today: string, lang: Lang): string | null {
  if (today > GNJ_2026) return null;
  const n = gnjBankClosedCount();
  if (today === GNJ_2026) {
    if (lang === 'hi') return `आज गुरु नानक जयंती है: 34 में से ${n} केंद्रों में बैंक बंद।`;
    if (lang === 'mr') return `आज गुरु नानक जयंती आहे: 34 पैकी ${n} केंद्रे बंद.`;
    if (lang === 'gu') return `આજે ગુરુ નાનક જયંતી છે: 34માંથી ${n} કેન્દ્ર બંધ.`;
    if (lang === 'bn') return `আজকে গুরু নানক জয়ন্তী: 34টির মধ্যে ${n}টি কেন্দ্র বন্ধ।`;
    return `Today is Guru Nanak Jayanti: closed at ${n} of 34 centres.`;
  }
  if (lang === 'hi') return `24 नवंबर, गुरु नानक जयंती: 34 में से ${n} केंद्र बंद।`;
  if (lang === 'mr') return `24 नोव्हेंबर, गुरु नानक जयंती: 34 पैकी ${n} केंद्रे बंद.`;
  if (lang === 'gu') return `24 નવેમ્બર, ગુરુ નાનક જયંતી: 34માંથી ${n} કેન્દ્ર બંધ.`;
  if (lang === 'bn') return `24 নভেম্বর, গুরু নানক জয়ন্তী: 34টির মধ্যে ${n}টি কেন্দ্র বন্ধ।`;
  return `24 Nov, Guru Nanak Jayanti: closed at ${n} of 34 centres.`;
}

export function gnjCityBankLine(city: City, today: string, gnj: DayStatus, lang: Lang): string | null {
  if (today > GNJ_2026) return null;
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  if (lang === 'hi') {
    return gnj.open
      ? `${name} में बैंक खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है।`
      : `${name} में बैंक बंद हैं, आरबीआई सूची के अनुसार।`;
  }
  if (lang === 'mr') {
    return gnj.open ? `${loc} बँक चालू राहील; या केंद्रावर आरबीआई सुट्टी नाही.` : `${loc} बँक बंद आहे, आरबीआई यादीप्रमाणे.`;
  }
  if (lang === 'gu') {
    return gnj.open ? `${loc} બેંક ખુલ્લી રહેશે; આ કેન્દ્ર પર આરબીઆઈ રજા નથી.` : `${loc} બેંક બંધ છે, આરબીઆઈ યાદી પ્રમાણે.`;
  }
  if (lang === 'bn') {
    return gnj.open ? `${loc} ব্যাংক খোলা থাকবে; এই কেন্দ্রে আরবিআই ছুটি নেই।` : `${loc} ব্যাংক বন্ধ, আরবিআই তালিকা অনুসারে।`;
  }
  return gnj.open
    ? `banks in ${name} stay open; RBI lists no holiday for this centre.`
    : `banks in ${name} are closed, from the RBI holiday matrix.`;
}

export function gnjCityBankMeta(city: City, today: string, gnj: DayStatus, lang: Lang): string | null {
  if (today > GNJ_2026) return null;
  if (lang === 'hi') return gnj.open ? '24 नवंबर, गुरु नानक जयंती: बैंक खुले रहेंगे।' : '24 नवंबर, गुरु नानक जयंती: बैंक बंद।';
  if (lang === 'mr') return gnj.open ? '24 नोव्हेंबर, गुरु नानक जयंती: बँक चालू राहील.' : '24 नोव्हेंबर, गुरु नानक जयंती: बँक बंद.';
  if (lang === 'gu') return gnj.open ? '24 નવેમ્બર, ગુરુ નાનક જયંતી: બેંક ખુલ્લી રહેશે.' : '24 નવેમ્બર, ગુરુ નાનક જયંતી: બેંક બંધ.';
  if (lang === 'bn') return gnj.open ? '24 নভেম্বর, গুরু নানক জয়ন্তী: ব্যাংক খোলা থাকবে।' : '24 নভেম্বর, গুরু নানক জয়ন্তী: ব্যাংক বন্ধ।';
  return gnj.open ? '24 Nov, Guru Nanak Jayanti: banks stay open.' : '24 Nov, Guru Nanak Jayanti: banks are closed.';
}

export function bankNationalMeta(date: string, lang: Lang, when: 'today' | 'tomorrow' = 'today') {
  const s = bankDay([], date);
  const n = officesClosedOn(date).length;
  const de = dEn(date);
  const dh = dHi(date);
  const d = dLoc(date, lang);
  const sat = satLabel(s.reason.kind, lang);
  const holiday = s.reason.kind === 'holiday' ? s.reason.name : date === GNJ_2026 ? 'Guru Nanak Jayanti' : null;

  let title: string;
  if (lang === 'hi') {
    const w = when === 'today' ? 'आज' : 'कल';
    if (!s.open) title = `नहीं, ${w} बैंक बंद है, ${dh}${sat ? `, ${sat}` : ''}`;
    else if (n) title = `${w} बैंक खुला है, ${dh}, ${n} केंद्र बंद`;
    else title = `हाँ, ${w} बैंक खुला है, ${dh}`;
  } else if (lang === 'mr') {
    const w = when === 'today' ? 'आज' : 'उद्या';
    if (!s.open) title = `नाही, ${w} बँक बंद आहे, ${d}${sat ? `, ${sat}` : ''}`;
    else if (n) title = `${w} बँक चालू आहे, ${d}, ${n} केंद्रे बंद`;
    else title = `हो, ${w} बँक चालू आहे, ${d}`;
  } else if (lang === 'gu') {
    const w = when === 'today' ? 'આજે' : 'કાલે';
    if (!s.open) title = `ના, ${w} બેંક બંધ છે, ${d}${sat ? `, ${sat}` : ''}`;
    else if (n) title = `${w} બેંક ખુલ્લી છે, ${d}, ${n} કેન્દ્ર બંધ`;
    else title = `હા, ${w} બેંક ખુલ્લી છે, ${d}`;
  } else if (lang === 'bn') {
    const w = when === 'today' ? 'আজকে' : 'আগামীকাল';
    if (!s.open) title = `না, ${w} ব্যাংক বন্ধ থাকবে, ${d}${sat ? `, ${sat}` : ''}`;
    else if (n) title = `${w} ব্যাংক খোলা থাকবে, ${d}, ${n}টি কেন্দ্র বন্ধ`;
    else title = `হ্যাঁ, ${w} ব্যাংক খোলা থাকবে, ${d}`;
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
    const g = gnjUpcoming(date, lang);
    if (g && !(date === GNJ_2026 && !s.open && n === 0) && date <= GNJ_2026) bits.push(g);
  } else if (lang === 'mr' || lang === 'gu' || lang === 'bn') {
    const src = t(lang, 'rbiList');
    if (lang === 'mr') {
      const w = when === 'today' ? 'आज' : 'उद्या';
      if (!s.open) bits.push(`नाही, ${w}, ${d}, भारतभर बँका बंद आहेत${sat ? ` (${sat})` : ''}.`);
      else if (n) bits.push(`${w}, ${d}, बहुतेक भारतात बँका चालू आहेत, पण ${n} आरबीआई केंद्रे बंद आहेत.`);
      else bits.push(`हो, ${w}, ${d}, भारतभर बँका चालू आहेत.`);
      bits.push(`स्रोत: ${src}.`);
    } else if (lang === 'gu') {
      const w = when === 'today' ? 'આજે' : 'કાલે';
      if (!s.open) bits.push(`ના, ${w}, ${d}, આખા ભારતમાં બેંક બંધ છે${sat ? ` (${sat})` : ''}.`);
      else if (n) bits.push(`${w}, ${d}, મોટા ભાગના ભારતમાં બેંક ખુલ્લી છે, પણ ${n} આરબીઆઈ કેન્દ્ર બંધ છે.`);
      else bits.push(`હા, ${w}, ${d}, આખા ભારતમાં બેંક ખુલ્લી છે.`);
      bits.push(`સ્રોત: ${src}.`);
    } else {
      const w = when === 'today' ? 'আজকে' : 'আগামীকাল';
      if (!s.open) bits.push(`না, ${w}, ${d}, সারা ভারতে ব্যাংক বন্ধ থাকবে${sat ? ` (${sat})` : ''}।`);
      else if (n) bits.push(`${w}, ${d}, বেশিরভাগ ভারতে ব্যাংক খোলা থাকবে, কিন্তু ${n}টি আরবিআই কেন্দ্র বন্ধ।`);
      else bits.push(`হ্যাঁ, ${w}, ${d}, সারা ভারতে ব্যাংক খোলা থাকবে।`);
      bits.push(`সূত্র: ${src}।`);
    }
    const g = gnjUpcoming(date, lang);
    if (g && date <= GNJ_2026) bits.push(g);
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

export function bankCityMeta(city: City, date: string, s: DayStatus, lang: Lang, gnj?: DayStatus) {
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  const de = dEn(date);
  const dh = dHi(date);
  const d = dLoc(date, lang);
  const why = bankShort(s.reason, lang).replace(/^Working day$/, 'working day');
  const unsure = s.reason.kind === 'nodata';

  let title: string;
  if (lang === 'hi') {
    if (unsure) title = `आज ${name} में बैंक, ${dh}: 2027 सूची अभी नहीं`;
    else title = s.open ? `हाँ, आज ${name} में बैंक खुला है, ${dh}` : `नहीं, आज ${name} में बैंक बंद है, ${dh}`;
  } else if (lang === 'mr') {
    if (unsure) title = `आज ${loc} बँक, ${d}: 2027 यादी नाही`;
    else title = s.open ? `हो, आज ${loc} बँक चालू आहे, ${d}` : `नाही, आज ${loc} बँक बंद आहे, ${d}`;
  } else if (lang === 'gu') {
    if (unsure) title = `આજે ${loc} બેંક, ${d}: 2027 યાદી નથી`;
    else title = s.open ? `હા, આજે ${loc} બેંક ખુલ્લી છે, ${d}` : `ના, આજે ${loc} બેંક બંધ છે, ${d}`;
  } else if (lang === 'bn') {
    if (unsure) title = `আজকে ${loc} ব্যাংক, ${d}: 2027-এর তালিকা নেই`;
    else title = s.open ? `হ্যাঁ, আজকে ${loc} ব্যাংক খোলা থাকবে, ${d}` : `না, আজকে ${loc} ব্যাংক বন্ধ থাকবে, ${d}`;
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
  } else if (lang === 'mr') {
    if (unsure) bits.push(`${loc} आज, ${d}, फक्त रविवार आणि दुसरा/चौथा शनिवार नियम लागू; या वर्षाची आरबीआई यादी अद्याप नाही.`);
    else bits.push(`${s.open ? 'हो' : 'नाही'}, आज, ${d}, ${loc} बँक ${s.open ? 'चालू आहे' : 'बंद आहे'} (${why}).`);
    bits.push('स्रोत: आरबीआई सुट्टी यादी.');
    const g = gnj ? gnjCityBankMeta(city, date, gnj, lang) : null;
    if (g) bits.push(g);
  } else if (lang === 'gu') {
    if (unsure) bits.push(`${loc} આજે, ${d}, માત્ર રવિવાર અને બીજો/ચોથો શનિવાર નિયમ લાગુ; આ વર્ષની આરબીઆઈ યાદી હજુ નથી.`);
    else bits.push(`${s.open ? 'હા' : 'ના'}, આજે, ${d}, ${loc} બેંક ${s.open ? 'ખુલ્લી છે' : 'બંધ છે'} (${why}).`);
    bits.push('સ્રોત: આરબીઆઈ રજા યાદી.');
    const g = gnj ? gnjCityBankMeta(city, date, gnj, lang) : null;
    if (g) bits.push(g);
  } else if (lang === 'bn') {
    if (unsure) bits.push(`${loc} আজকে, ${d}, শুধু রবিবার ও দ্বিতীয়/চতুর্থ শনিবারের নিয়ম প্রযোজ্য; এই বছরের আরবিআই তালিকা এখনও নেই।`);
    else bits.push(`${s.open ? 'হ্যাঁ' : 'না'}, আজকে, ${d}, ${loc} ব্যাংক ${s.open ? 'খোলা থাকবে' : 'বন্ধ থাকবে'} (${why})।`);
    bits.push('সূত্র: আরবিআই ছুটির তালিকা।');
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

export function postCityMeta(city: City, date: string, p: PostStatus, lang: Lang) {
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  const de = dEn(date);
  const dh = dHi(date);
  const d = dLoc(date, lang);
  const definite = p.state === 'open' || p.state === 'closed';
  const holiday = p.name ? shortName(p.name, lang) : '';

  let title: string;
  if (lang === 'hi') {
    if (p.state === 'closed') title = `नहीं, आज ${name} में डाकघर बंद है, ${dh}`;
    else if (p.state === 'open') title = `हाँ, आज ${name} में डाकघर खुला है, ${dh}`;
    else if (p.kind === 'saturday') title = `आज ${name} में डाकघर, ${dh}: शनिवार का समय जाँचें`;
    else title = `आज ${name} में डाकघर, ${dh}: स्थानीय रूप से जाँचें`;
  } else if (lang === 'mr') {
    if (p.state === 'closed') title = `नाही, आज ${loc} पोस्ट ऑफिस बंद आहे, ${d}`;
    else if (p.state === 'open') title = `हो, आज ${loc} पोस्ट ऑफिस चालू आहे, ${d}`;
    else if (p.kind === 'saturday') title = `आज ${loc} पोस्ट ऑफिस, ${d}: शनिवारी वेळ विचारा`;
    else title = `आज ${loc} पोस्ट ऑफिस, ${d}: स्थानिक कार्यालयात विचारा`;
  } else if (lang === 'gu') {
    if (p.state === 'closed') title = `ના, આજે ${loc} પોસ્ટ ઑફિસ બંધ છે, ${d}`;
    else if (p.state === 'open') title = `હા, આજે ${loc} પોસ્ટ ઑફિસ ખુલ્લું છે, ${d}`;
    else if (p.kind === 'saturday') title = `આજે ${loc} પોસ્ટ ઑફિસ, ${d}: શનિવારે સમય પૂછો`;
    else title = `આજે ${loc} પોસ્ટ ઑફિસ, ${d}: સ્થાનિક ઑફિસમાં પૂછો`;
  } else if (lang === 'bn') {
    if (p.state === 'closed') title = `না, আজকে ${loc} পোস্ট অফিস বন্ধ থাকবে, ${d}`;
    else if (p.state === 'open') title = `হ্যাঁ, আজকে ${loc} পোস্ট অফিস খোলা থাকবে, ${d}`;
    else if (p.kind === 'saturday') title = `আজকে ${loc} পোস্ট অফিস, ${d}: শনিবারের সময় জানুন`;
    else title = `আজকে ${loc} পোস্ট অফিস, ${d}: স্থানীয় অফিসে জানুন`;
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
  } else if (lang === 'mr') {
    if (p.state === 'closed') bits.push(`नाही, आज, ${d}, ${loc} पोस्ट ऑफिस बंद आहे${holiday ? ` (${holiday})` : ''}.`);
    else if (p.state === 'open') bits.push(`हो, आज, ${d}, ${loc} पोस्ट ऑफिस चालू आहे.`);
    else if (p.kind === 'saturday') bits.push(`आज, ${d}, शनिवार आहे आणि इंडिया पोस्ट सुट्टी यादीत नाही. वेळ कार्याल्यानुसार बदलते, स्थानिक कार्यालयात विचारून घ्या.`);
    else bits.push(`आज, ${d}, ${loc} पोस्ट ऑफिसची स्थिती स्थानिक कार्यालयात विचारून घ्या.`);
    bits.push('स्रोत: इंडिया पोस्ट सुट्टी यादी.');
    if (date <= GNJ_2026) bits.push('24 नोव्हेंबर, गुरु नानक जयंती: अखिल भारतीय पोस्ट सुट्टी.');
  } else if (lang === 'gu') {
    if (p.state === 'closed') bits.push(`ના, આજે, ${d}, ${loc} પોસ્ટ ઑફિસ બંધ છે${holiday ? ` (${holiday})` : ''}.`);
    else if (p.state === 'open') bits.push(`હા, આજે, ${d}, ${loc} પોસ્ટ ઑફિસ ખુલ્લું છે.`);
    else if (p.kind === 'saturday') bits.push(`આજે, ${d}, શનિવાર છે અને ઇન્ડિયા પોસ્ટ રજા યાદીમાં નથી. સમય ઑફિસ પ્રમાણે બદલાય છે, સ્થાનિક ઑફિસમાં પૂછો.`);
    else bits.push(`આજે, ${d}, ${loc} પોસ્ટ ઑફિસની સ્થિતિ સ્થાનિક ઑફિસમાં પૂછો.`);
    bits.push('સ્રોત: ઇન્ડિયા પોસ્ટ રજા યાદી.');
    if (date <= GNJ_2026) bits.push('24 નવેમ્બર, ગુરુ નાનક જયંતી: અખિલ ભારતીય પોસ્ટ રજા.');
  } else if (lang === 'bn') {
    if (p.state === 'closed') bits.push(`না, আজকে, ${d}, ${loc} পোস্ট অফিস বন্ধ থাকবে${holiday ? ` (${holiday})` : ''}।`);
    else if (p.state === 'open') bits.push(`হ্যাঁ, আজকে, ${d}, ${loc} পোস্ট অফিস খোলা থাকবে।`);
    else if (p.kind === 'saturday') bits.push(`আজকে, ${d}, শনিবার এবং ইন্ডিয়া পোস্ট ছুটির তালিকায় নেই। সময় অফিসভেদে আলাদা, স্থানীয় অফিসে জানুন।`);
    else bits.push(`আজকে, ${d}, ${loc} পোস্ট অফিসের অবস্থা স্থানীয় অফিসে জানুন।`);
    bits.push('সূত্র: ইন্ডিয়া পোস্ট ছুটির তালিকা।');
    if (date <= GNJ_2026) bits.push('24 নভেম্বর, গুরু নানক জয়ন্তী: সারা ভারতে ডাক ছুটি।');
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

export function bankCityH1(city: City, date: string, s: DayStatus, lang: Lang) {
  return bankCityMeta(city, date, s, lang).title.replace(/: 2027.*$/, '').trim();
}

export function postCityH1(city: City, date: string, p: PostStatus, lang: Lang) {
  const title = postCityMeta(city, date, p, lang).title;
  return title.replace(/: .+$/, '').trim();
}

export function bankNationalH1(date: string, lang: Lang, when: 'today' | 'tomorrow' = 'today') {
  const s = bankDay([], date);
  const n = officesClosedOn(date).length;
  const d = dLoc(date, lang);
  if (lang === 'hi') {
    const w = when === 'today' ? 'आज' : 'कल';
    if (!s.open) return `नहीं, ${w} पूरे भारत में बैंक बंद है, ${dHi(date)}`;
    if (n) return `${w} बैंक खुला है, ${dHi(date)}, ${n} केंद्र बंद`;
    return `हाँ, ${w} पूरे भारत में बैंक खुला है, ${dHi(date)}`;
  }
  if (lang === 'mr') {
    const w = when === 'today' ? 'आज' : 'उद्या';
    if (!s.open) return `नाही, ${w} भारतभर बँक बंद आहे, ${d}`;
    if (n) return `${w} बँक चालू आहे, ${d}, ${n} केंद्रे बंद`;
    return `हो, ${w} भारतभर बँक चालू आहे, ${d}`;
  }
  if (lang === 'gu') {
    const w = when === 'today' ? 'આજે' : 'કાલે';
    if (!s.open) return `ના, ${w} આખા ભારતમાં બેંક બંધ છે, ${d}`;
    if (n) return `${w} બેંક ખુલ્લી છે, ${d}, ${n} કેન્દ્ર બંધ`;
    return `હા, ${w} આખા ભારતમાં બેંક ખુલ્લી છે, ${d}`;
  }
  if (lang === 'bn') {
    const w = when === 'today' ? 'আজকে' : 'আগামীকাল';
    if (!s.open) return `না, ${w} সারা ভারতে ব্যাংক বন্ধ থাকবে, ${d}`;
    if (n) return `${w} ব্যাংক খোলা থাকবে, ${d}, ${n}টি কেন্দ্র বন্ধ`;
    return `হ্যাঁ, ${w} সারা ভারতে ব্যাংক খোলা থাকবে, ${d}`;
  }
  const w = when;
  if (!s.open) return `No, banks closed ${w} across India, ${dEn(date)}`;
  if (n) return `Banks open ${w}, ${dEn(date)}, except ${n} RBI centres`;
  return `Yes, banks open ${w} across India, ${dEn(date)}`;
}
