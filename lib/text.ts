import type { Reason } from './data';
import { shortName } from './names';
import type { Lang } from './lang';
import { t } from './copy';
type L = Lang;

export function bankReason(r: Reason, l: L, where: string): string {
  if (l === 'hi') {
    switch (r.kind) {
      case 'holiday': return `${where} में आरबीआई अवकाश: ${shortName(r.rbi!, 'hi')}।`;
      case 'sunday': return 'रविवार — बैंकों का साप्ताहिक अवकाश।';
      case 'saturday2': return 'महीने का दूसरा शनिवार — सभी बैंक दूसरे और चौथे शनिवार को बंद रहते हैं।';
      case 'saturday4': return 'महीने का चौथा शनिवार — सभी बैंक दूसरे और चौथे शनिवार को बंद रहते हैं।';
      case 'saturdayOpen': return 'यह दूसरा या चौथा शनिवार नहीं है, इसलिए बैंक खुले हैं।';
      case 'nodata': return 'आरबीआई ने इस वर्ष की सूची अभी जारी नहीं की है; केवल रविवार और शनिवार नियम लागू।';
      default: return `नियमित कार्य दिवस। आज ${where} के लिए कोई आरबीआई अवकाश नहीं है।`;
    }
  }
  if (l !== 'en') {
    switch (r.kind) {
      case 'holiday': return `${t(l, 'rbiList')}: ${shortName(r.rbi!, l)}.`;
      case 'sunday': return l === 'mr' ? 'रविवार. बँकांची साप्ताहिक सुट्टी.' : l === 'gu' ? 'રવિવાર. બેંકની સાપ્તાહિક રજા.' : 'রবিবার। ব্যাংকের সাপ্তাহিক ছুটি।';
      case 'saturday2': return l === 'mr' ? 'महिन्याचा दुसरा शनिवार. सर्व बँका दुसऱ्या आणि चौथ्या शनिवारी बंद असतात.' : l === 'gu' ? 'મહિનાનો બીજો શનિવાર. બધી બેંક બીજા અને ચોથા શનિવારે બંધ રહે છે.' : 'মাসের দ্বিতীয় শনিবার। সব ব্যাংক দ্বিতীয় ও চতুর্থ শনিবার বন্ধ থাকে।';
      case 'saturday4': return l === 'mr' ? 'महिन्याचा चौथा शनिवार. सर्व बँका दुसऱ्या आणि चौथ्या शनिवारी बंद असतात.' : l === 'gu' ? 'મહિનાનો ચોથો શનિવાર. બધી બેંક બીજા અને ચોથા શનિવારે બંધ રહે છે.' : 'মাসের চতুর্থ শনিবার। সব ব্যাংক দ্বিতীয় ও চতুর্থ শনিবার বন্ধ থাকে।';
      case 'saturdayOpen': return l === 'mr' ? 'हा दुसरा किंवा चौथा शनिवार नाही, म्हणून बँका चालू आहेत.' : l === 'gu' ? 'આ બીજો કે ચોથો શનિવાર નથી, તેથી બેંક ખુલ્લી છે.' : 'এটি দ্বিতীয় বা চতুর্থ শনিবার নয়, তাই ব্যাংক খোলা।';
      case 'nodata': return l === 'mr' ? 'आरबीआईने या वर्षाची यादी अद्याप प्रसिद्ध केलेली नाही; फक्त रविवार आणि शनिवार नियम लागू.' : l === 'gu' ? 'આરબીઆઈએ આ વર્ષની યાદી હજુ પ્રગટ કરી નથી; માત્ર રવિવાર અને શનિવારનો નિયમ લાગુ.' : 'আরবিআই এই বছরের তালিকা এখনও প্রকাশ করেনি; শুধু রবিবার ও শনিবারের নিয়ম প্রযোজ্য।';
      default: return t(l, 'noRbiHoliday');
    }
  }
  switch (r.kind) {
    case 'holiday': return `RBI holiday in ${where}: ${shortName(r.rbi!)}.`;
    case 'sunday': return 'Sunday — weekly holiday for banks.';
    case 'saturday2': return 'Second Saturday of the month — all banks close on the 2nd and 4th Saturday.';
    case 'saturday4': return 'Fourth Saturday of the month — all banks close on the 2nd and 4th Saturday.';
    case 'saturdayOpen': return 'Not a 2nd or 4th Saturday, so banks are working.';
    case 'nodata': return 'RBI has not published this year’s list yet; only the Sunday and Saturday rules are applied.';
    default: return `Regular working day. RBI lists no holiday for ${where} today.`;
  }
}
export function bankShort(r: Reason, l: L): string {
  if (r.kind === 'holiday') return shortName(r.rbi!, l);
  if (l === 'hi') {
    switch (r.kind) {
      case 'sunday': return 'रविवार';
      case 'saturday2': return 'दूसरा शनिवार';
      case 'saturday4': return 'चौथा शनिवार';
      case 'saturdayOpen': return 'शनिवार, खुला';
      default: return 'कार्य दिवस';
    }
  }
  if (l === 'mr') {
    switch (r.kind) {
      case 'sunday': return 'रविवार';
      case 'saturday2': return 'दुसरा शनिवार';
      case 'saturday4': return 'चौथा शनिवार';
      case 'saturdayOpen': return 'शनिवार, चालू';
      default: return 'कार्य दिवस';
    }
  }
  if (l === 'gu') {
    switch (r.kind) {
      case 'sunday': return 'રવિવાર';
      case 'saturday2': return 'બીજો શનિવાર';
      case 'saturday4': return 'ચોથો શનિવાર';
      case 'saturdayOpen': return 'શનિવાર, ખુલ્લી';
      default: return 'કાર્ય દિવસ';
    }
  }
  if (l === 'bn') {
    switch (r.kind) {
      case 'sunday': return 'রবিবার';
      case 'saturday2': return 'দ্বিতীয় শনিবার';
      case 'saturday4': return 'চতুর্থ শনিবার';
      case 'saturdayOpen': return 'শনিবার, খোলা';
      default: return 'কর্মদিবস';
    }
  }
  switch (r.kind) {
    case 'sunday': return 'Sunday';
    case 'saturday2': return '2nd Saturday';
    case 'saturday4': return '4th Saturday';
    case 'saturdayOpen': return 'Working Saturday';
    default: return 'Working day';
  }
}
export const T = {
  open: (l: L) => (l === 'hi' ? 'आज खुला है' : l === 'mr' ? 'आज चालू आहे' : l === 'gu' ? 'આજે ખુલ્લી છે' : l === 'bn' ? 'আজকে খোলা' : 'Open today'),
  closed: (l: L) => (l === 'hi' ? 'आज बंद है' : l === 'mr' ? 'आज बंद आहे' : l === 'gu' ? 'આજે બંધ છે' : l === 'bn' ? 'আজকে বন্ধ' : 'Closed today'),
  o: (l: L) => t(l, 'open'),
  c: (l: L) => t(l, 'closed'),
};
