import { City, stateBySlug } from '@/lib/places';
import { bankDay, cityHolidays, nextBankOpen, upcomingBankClosures, RBI, LAST_CHECKED, nextPostHoliday, nextPostOpen, postDay, PostStatus, upcomingPostHolidays, circleOf, circleShort, INDIAPOST, officesClosedOn } from '@/lib/data';
import { addDays, fmtDM, fmtLong, fmtMed, monthName, monthNum } from '@/lib/date';
import { bankShort, T } from '@/lib/text';
import { bankCityH1, bankNationalH1, postCityH1 } from '@/lib/titles';
import { shortName } from '@/lib/names';
import type { Lang } from '@/lib/lang';
import { cityName, cityIn, stateName, prefix, TODAY_PATH, cityAlts, todayAlts, citiesForLang } from '@/lib/lang';
import { t } from '@/lib/copy';
import { SvcIcon } from './icons';
import { BankCityLead, bankCityFaqs, PostCityLead, postCityFaqs } from './cityLead';
import { CitySwitcher, Crumb, DTile, Faq, LangLinks, Pill, Share, Source } from './ui';
import { ChequeCta } from './tools';

const RBI_URL = 'https://rbi.org.in/Scripts/HolidayMatrixDisplay.aspx';

export function RegionalBankAnswer({ city, s, nextOpen, lang, when = 'today' }: { city: City; s: { open: boolean; date: string; reason: { kind: string; rbi?: string } }; nextOpen: string; lang: Lang; when?: 'today' | 'tomorrow' }) {
  const loc = cityIn(city, lang);
  const d = fmtLong(s.date, lang);
  const src = <a href={RBI_URL} rel="noopener">{t(lang, 'rbiList')}</a>;
  const centre = RBI.offices[city.office].name;
  const derived = city.derived
    ? (lang === 'mr' ? ` ही यादी आरबीआई ${centre} केंद्राची आहे, कारण ${cityName(city, lang)}चे स्वतःचे कार्यालय नाही.` : lang === 'gu' ? ` આ યાદી આરબીઆઈ ${centre} કેન્દ્રની છે, કારણ કે ${cityName(city, lang)}નું પોતાનું કાર્યાલય નથી.` : ` এই তালিকা আরবিআই ${centre} কেন্দ্রের, কারণ ${cityName(city, lang)}-এর নিজস্ব কার্যালয় নেই।`)
    : '';
  const tw = t(lang, when === 'today' ? 'today' : 'tomorrow');
  if (s.open) {
    const head = lang === 'mr' ? `हो, ${loc} बँक शाखा ${tw}, ${d}, चालू आहेत.` : lang === 'gu' ? `હા, ${loc} બેંક શાખા ${tw}, ${d}, ખુલ્લી છે.` : `হ্যাঁ, ${loc} ব্যাংক শাখা ${tw}, ${d}, খোলা থাকবে।`;
    return <p className="answer"><b>{head}</b> {t(lang, 'noRbiHoliday')}{derived} ({src}) {t(lang, 'upiNote')}</p>;
  }
  let why: string;
  if (s.reason.kind === 'holiday') why = lang === 'mr' ? `${shortName(s.reason.rbi!, lang)} मुळे` : lang === 'gu' ? `${shortName(s.reason.rbi!, lang)}ને કારણે` : `${shortName(s.reason.rbi!, lang)}-এর জন্য`;
  else if (s.reason.kind === 'sunday') why = lang === 'mr' ? 'रविवारमुळे' : lang === 'gu' ? 'રવિવારને કારણે' : 'রবিবারের জন্য';
  else why = lang === 'mr' ? `महिन्याच्या ${s.reason.kind === 'saturday2' ? 'दुसऱ्या' : 'चौथ्या'} शनिवारमुळे (भारतभर)` : lang === 'gu' ? `મહિનાના ${s.reason.kind === 'saturday2' ? 'બીજા' : 'ચોથા'} શનિવારને કારણે (આખા ભારતમાં)` : `মাসের ${s.reason.kind === 'saturday2' ? 'দ্বিতীয়' : 'চতুর্থ'} শনিবারের জন্য (সারা ভারতে)`;
  const head = lang === 'mr' ? `नाही, ${loc} बँक शाखा ${tw}, ${d}, बंद आहेत` : lang === 'gu' ? `ના, ${loc} બેંક શાખા ${tw}, ${d}, બંધ છે` : `না, ${loc} ব্যাংক শাখা ${tw}, ${d}, বন্ধ থাকবে`;
  return <p className="answer"><b>{head}</b> {why}.{derived} ({src}) {t(lang, 'upiNote')} {t(lang, 'chequeResume')} {fmtMed(nextOpen, lang)}.</p>;
}

export function regionalBankFaq(city: City, lang: Lang) {
  const centre = RBI.offices[city.office].name;
  if (lang === 'mr') return [
    { q: 'आज ATM आणि UPI चालतील का?', a: 'हो. ही माहिती फक्त शाखांसाठी आहे. सुट्टीच्या दिवशीही ATM, UPI आणि नेट बँकिंग चालू राहतात.' },
    { q: 'खाजगी बँकाही बंद असतील का?', a: 'हो. ही आरबीआई सुट्टी अनुसूचित बँकांना लागू होते, जसे SBI, HDFC, ICICI. सहकारी बँका वेगळ्या असू शकतात.' },
    { q: 'बँका कोणत्या शनिवारी बंद असतात?', a: 'प्रत्येक महिन्याच्या दुसऱ्या आणि चौथ्या शनिवारी सर्व बँका बंद असतात. पहिल्या, तिसऱ्या आणि पाचव्या शनिवारी बँका चालू असतात.' },
    { q: 'ही माहिती कुठून येते?', a: `आरबीआई सुट्टी यादीतून (${centre} कार्यालय). हे पान दररोज भारतीय वेळेनुसार अद्ययावत होते.` },
  ];
  if (lang === 'gu') return [
    { q: 'આજે ATM અને UPI ચાલશે?', a: 'હા. આ માહિતી ફક્ત શાખા માટે છે. રજાના દિવસે પણ ATM, UPI અને નેટ બેંકિંગ ચાલુ રહે છે.' },
    { q: 'ખાનગી બેંક પણ બંધ રહેશે?', a: 'હા. આ આરબીઆઈ રજા અનુસૂચિત બેંકને લાગુ પડે છે, જેમ કે SBI, HDFC, ICICI. સહકારી બેંક અલગ હોઈ શકે.' },
    { q: 'બેંક કયા શનિવારે બંધ રહે છે?', a: 'દર મહિનાના બીજા અને ચોથા શનિવારે બધી બેંક બંધ રહે છે. પહેલા, ત્રીજા અને પાંચમા શનિવારે બેંક ખુલ્લી છે.' },
    { q: 'આ માહિતી ક્યાંથી આવે છે?', a: `આરબીઆઈ રજા યાદીમાંથી (${centre} કાર્યાલય). આ પાનું દરરોજ ભારતીય સમય મુજબ અદ્યતન થાય છે.` },
  ];
  return [
    { q: 'আজকে ATM ও UPI চালু থাকবে?', a: 'হ্যাঁ। এই তথ্য শুধু শাখার জন্য। ছুটির দিনেও ATM, UPI ও নেট ব্যাংকিং চালু থাকে।' },
    { q: 'বেসরকারি ব্যাংকও বন্ধ থাকবে?', a: 'হ্যাঁ। এই আরবিআই ছুটি তফসিলি ব্যাংকে প্রযোজ্য, যেমন SBI, HDFC, ICICI। সমবায় ব্যাংক আলাদা হতে পারে।' },
    { q: 'কোন শনিবার ব্যাংক বন্ধ থাকে?', a: 'প্রতি মাসের দ্বিতীয় ও চতুর্থ শনিবার সব ব্যাংক বন্ধ থাকে। প্রথম, তৃতীয় ও পঞ্চম শনিবার ব্যাংক খোলা থাকে।' },
    { q: 'এই তথ্য কোথা থেকে আসে?', a: `আরবিআই ছুটির তালিকা থেকে (${centre} কার্যালয়)। এই পাতা প্রতিদিন ভারতীয় সময় অনুসারে আপডেট হয়।` },
  ];
}

export function RegionalBankView({ city, today, lang }: { city: City; today: string; lang: Lang }) {
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const b = bankDay(hols, today);
  const tm = bankDay(hols, addDays(today, 1));
  const y = bankDay(hols, addDays(today, -1));
  const nb = nextBankOpen(hols, today);
  const up = upcomingBankClosures(hols, addDays(today, 1), 40);
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  const where = stateName(city.state, lang);
  const faq = [...bankCityFaqs(city, today, lang), ...regionalBankFaq(city, lang)];
  const pre = prefix(lang);
  const shareText = lang === 'mr' ? `${loc} आज बँक ${b.open ? 'चालू आहे' : 'बंद आहे'} (${fmtMed(today, lang)})` : lang === 'gu' ? `${loc} આજે બેંક ${b.open ? 'ખુલ્લી છે' : 'બંધ છે'} (${fmtMed(today, lang)})` : `${loc} আজকে ব্যাংক ${b.open ? 'খোলা' : 'বন্ধ'} (${fmtMed(today, lang)})`;
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: TODAY_PATH[lang], label: t(lang, 'home') }, { label: name }, { label: t(lang, 'banks') }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="bank" size="lg" />
          <h1 className="qh">{bankCityH1(city, today, b, lang)}</h1>
          <p className="big" id="ans">{lang === 'mr' ? `आज ${loc} बँक चालू आहे का?` : lang === 'gu' ? `આજે ${loc} બેંક ખુલ્લી છે?` : `আজকে ${loc} কি ব্যাংক খোলা থাকবে?`}</p>
          <div className="statusrow"><Pill v={b.open ? 'yes' : 'no'} size="lg">{b.open ? T.open(lang) : T.closed(lang)}</Pill><span className="dt t">{fmtLong(today, lang)}</span></div>
          <RegionalBankAnswer city={city} s={b} nextOpen={nb} lang={lang} />
          {b.open && y.reason.kind === 'holiday' && <p className="reason">{lang === 'mr' ? `काल (${fmtMed(y.date, lang)}) बँक ${shortName(y.reason.rbi!, lang)} मुळे बंद होत्या.` : lang === 'gu' ? `ગઈકાલે (${fmtMed(y.date, lang)}) બેંક ${shortName(y.reason.rbi!, lang)}ને કારણે બંધ હતી.` : `গতকাল (${fmtMed(y.date, lang)}) ব্যাংক ${shortName(y.reason.rbi!, lang)}-এর জন্য বন্ধ ছিল।`}</p>}
          {b.reason.kind === 'holiday' && <p className="reason"><small>RBI: {b.reason.rbi}</small></p>}
          <div className="hrs">
            <div><div className="k">{lang === 'mr' ? 'पुढचा कार्य दिवस' : lang === 'gu' ? 'આગામી કાર્ય દિવસ' : 'পরের কর্মদিবস'}</div><div className="v t">{fmtMed(nb, lang)}</div></div>
          </div>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{t(lang, 'today')}</div><Pill v={b.open ? 'yes' : 'no'} size="xs">{b.open ? T.o(lang) : T.c(lang)}</Pill><div className="v t">{fmtDM(today, lang)}</div><div className="s">{bankShort(b.reason, lang)}</div></div>
          <div className="card mini"><div className="k">{t(lang, 'tomorrow')}</div><Pill v={tm.open ? 'yes' : 'no'} size="xs">{tm.open ? T.o(lang) : T.c(lang)}</Pill><div className="v t">{fmtDM(addDays(today, 1), lang)}</div><div className="s">{bankShort(tm.reason, lang)}</div></div>
        </div>
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}>
          <a href={RBI.source} rel="noopener">{t(lang, 'rbiList')}</a>, {RBI.offices[city.office].name}{city.derived ? ` (${where})` : ''}
        </Source>
        <Share text={shareText} path={`${pre}/${city.slug}/bank`} lang={lang} ics={{ href: `/ics/bank-${city.state}-2026.ics`, label: t(lang, 'addCal') }} />
        <ChequeCta city={city} />
        <BankCityLead city={city} today={today} lang={lang} />
        <p className="note">{t(lang, 'scheduledNote')}</p>
        <div className="sech"><h2>{lang === 'mr' ? 'देशभर बँक शनिवार' : lang === 'gu' ? 'દેશભરમાં બેંક શનિવાર' : 'সারা দেশে ব্যাংক শনিবার'}</h2><span>{lang === 'mr' ? 'पुढचे 40 दिवस' : lang === 'gu' ? 'આગામી 40 દિવસ' : 'পরের 40 দিন'}</span></div>
        <div className="card list">
          {up.filter((u) => u.reason.kind === 'saturday2' || u.reason.kind === 'saturday4').map((u) => (
            <div className="row" key={u.date}>
              <DTile iso={u.date} lang={lang} />
              <div className="nm">{bankShort(u.reason, lang)}<small className="t">{fmtLong(u.date, lang)}</small></div>
              <Pill v="no" size="xs">{T.c(lang)}</Pill>
            </div>
          ))}
        </div>
        <p className="footsrc">
          <a href={`/bank-holidays-2026/${city.state}`}>{lang === 'mr' ? `${where} ची 2026 ची यादी` : lang === 'gu' ? `${where}ની 2026ની યાદી` : `${where}-এর 2026-এর তালিকা`}</a>
          {' · '}<a href={`${pre}/${city.slug}/post-office`}>{t(lang, 'postToday')}</a>
          {' · '}<LangLinks lang={lang} alts={cityAlts(city.slug, 'bank')} />
        </p>
        <div className="sech"><h2>{t(lang, 'about')}</h2></div>
        <Faq items={faq} />
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>{t(lang, 'changeCity')}</h2></div>
          <CitySwitcher current={city.slug} lang={lang} base="bank" />
        </div>
        <div className="card panel">
          <div className="top"><h2>{monthName(monthNum(today), lang)}</h2></div>
          {hols.filter((h) => h.d.slice(0, 7) === today.slice(0, 7)).map((h) => (
            <div className="prow" key={h.d}><span className="t">{fmtMed(h.d, lang)}<small>{shortName(h.n, lang)}</small></span><Pill v={h.d < today ? 'neu' : 'no'} size="xs">{h.d < today ? (lang === 'mr' ? 'उलटून गेले' : lang === 'gu' ? 'વીતી ગયું' : 'পেরিয়ে গেছে') : T.c(lang)}</Pill></div>
          ))}
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}

export function regionalPostLabel(p: PostStatus, l: Lang, long = false) {
  if (p.state === 'closed') return long ? T.closed(l) : T.c(l);
  if (p.state === 'check') return p.kind === 'saturday' ? (l === 'mr' ? 'सुट्टी नाही' : l === 'gu' ? 'રજા નથી' : 'ছুটি নয়') : t(l, 'hoursVary').split('.')[0];
  return long ? (l === 'mr' ? 'काउंटर आज चालू आहेत' : l === 'gu' ? 'કાઉન્ટર આજે ખુલ્લા છે' : 'কাউন্টার আজকে খোলা') : T.o(l);
}

export function regionalPostReason(p: PostStatus, l: Lang, circle: string) {
  switch (p.kind) {
    case 'holiday':
      return l === 'mr' ? `इंडिया पोस्ट ${circle} यादीत सुट्टी: ${shortName(p.name || p.hi || '', l)}${p.allIndia ? ' (अखिल भारतीय सुट्टी)' : ''}.` : l === 'gu' ? `ઇન્ડિયા પોસ્ટ ${circle} યાદીમાં રજા: ${shortName(p.name || p.hi || '', l)}${p.allIndia ? ' (અખિલ ભારતીય રજા)' : ''}.` : `ইন্ডিয়া পোস্ট ${circle} তালিকায় ছুটি: ${shortName(p.name || p.hi || '', l)}${p.allIndia ? ' (সারা ভারতে ডাক ছুটি)' : ''}।`;
    case 'sunday':
      return l === 'mr' ? 'रविवार. पोस्ट ऑफिस बंद असतात.' : l === 'gu' ? 'રવિવાર. પોસ્ટ ઑફિસ બંધ રહે છે.' : 'রবিবার। পোস্ট অফিস বন্ধ থাকে।';
    case 'saturday':
      return t(l, 'postSatCheck');
    case 'localFestival':
      return l === 'mr' ? `बँक आज ${shortName(p.bankHoliday!, l)} मुळे बंद आहे, पण ही ${circle} पोस्ट सुट्टी यादीत नाही, म्हणून पोस्ट ऑफिस चालू असावे.` : l === 'gu' ? `બેંક આજે ${shortName(p.bankHoliday!, l)}ને કારણે બંધ છે, પણ આ ${circle} પોસ્ટ રજા યાદીમાં નથી, તેથી પોસ્ટ ઑફિસ ખુલ્લું હોવું જોઈએ.` : `ব্যাংক আজকে ${shortName(p.bankHoliday!, l)}-এর জন্য বন্ধ, কিন্তু এটি ${circle} ডাক ছুটির তালিকায় নেই, তাই পোস্ট অফিস খোলা থাকার কথা।`;
    case 'nodata':
      return l === 'mr' ? 'इंडिया पोस्टने या वर्षाची सर्कल यादी अद्याप प्रसिद्ध केलेली नाही.' : l === 'gu' ? 'ઇન્ડિયા પોસ્ટે આ વર્ષની સર્કલ યાદી હજુ પ્રગટ કરી નથી.' : 'ইন্ডিয়া পোস্ট এই বছরের সার্কেল তালিকা এখনও প্রকাশ করেনি।';
    default:
      return t(l, 'noPostHoliday');
  }
}

export function regionalPostFaq(city: City, l: Lang) {
  if (l === 'mr') return [
    { q: 'आज स्पीड पोस्ट येईल का?', a: 'ही माहिती काउंटरसाठी आहे, डिलिव्हरीची हमी नाही. सुट्टीच्या दिवशी डिलिव्हरी सहसा थांबते.' },
    { q: 'शनिवारी पोस्ट ऑफिस चालू असते का?', a: 'इंडिया पोस्ट सुट्टी यादीत शनिवार अवकाश म्हणून नाही. शनिवारी वेळ कार्याल्यानुसार बदलते, स्थानिक कार्यालयात विचारून घ्या.' },
    { q: 'पोस्ट ऑफिसच्या सुट्ट्या कोण ठरवते?', a: 'इंडिया पोस्ट दरवर्षी अखिल भारतीय यादी आणि प्रत्येक डाक सर्कलची यादी प्रसिद्ध करते.' },
  ];
  if (l === 'gu') return [
    { q: 'આજે સ્પીડ પોસ્ટ આવશે?', a: 'આ માહિતી કાઉન્ટર માટે છે, ડિલિવરીની ગેરંટી નથી. રજાના દિવસે ડિલિવરી સામાન્ય રીતે અટકે છે.' },
    { q: 'શનિવારે પોસ્ટ ઑફિસ ખુલ્લું છે?', a: 'ઇન્ડિયા પોસ્ટ રજા યાદીમાં શનિવાર રજા તરીકે નથી. શનિવારે સમય ઑફિસ પ્રમાણે બદલાય છે, સ્થાનિક ઑફિસમાં પૂછો.' },
    { q: 'પોસ્ટ ઑફિસની રજા કોણ નક્કી કરે છે?', a: 'ઇન્ડિયા પોસ્ટ દર વર્ષે અખિલ ભારતીય યાદી અને દરેક ડાક સર્કલની યાદી પ્રગટ કરે છે.' },
  ];
  return [
    { q: 'আজকে স্পিড পোস্ট আসবে?', a: 'এই তথ্য কাউন্টারের জন্য, ডেলিভারির নিশ্চয়তা নয়। ছুটির দিনে ডেলিভারি সাধারণত থেমে যায়।' },
    { q: 'শনিবার পোস্ট অফিস খোলা থাকে?', a: 'ইন্ডিয়া পোস্ট ছুটির তালিকায় শনিবার ছুটি হিসেবে নেই। শনিবারের সময় অফিসভেদে আলাদা, স্থানীয় অফিসে জানুন।' },
    { q: 'পোস্ট অফিসের ছুটি কে নির্ধারণ করে?', a: 'ইন্ডিয়া পোস্ট প্রতি বছর সারা ভারতের তালিকা এবং প্রতিটি ডাক সার্কেলের তালিকা প্রকাশ করে।' },
  ];
}

export function RegionalPostView({ city, today, lang }: { city: City; today: string; lang: Lang }) {
  const hols = cityHolidays(city);
  const p = postDay(city.state, today, hols);
  const tm = postDay(city.state, addDays(today, 1), hols);
  const nx = nextPostHoliday(city.state, today);
  const circ = circleOf(city.state);
  const circle = circleShort(circ.name);
  const no = nextPostOpen(city.state, today);
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  const pre = prefix(lang);
  const year = today.slice(0, 4) === '2027' ? '2027' : '2026';
  const shareText = lang === 'mr' ? `${loc} आज पोस्ट ऑफिस ${p.state === 'closed' ? 'बंद आहे' : 'चालू आहे'} (${fmtMed(today, lang)})` : lang === 'gu' ? `${loc} આજે પોસ્ટ ઑફિસ ${p.state === 'closed' ? 'બંધ છે' : 'ખુલ્લું છે'} (${fmtMed(today, lang)})` : `${loc} আজকে পোস্ট অফিস ${p.state === 'closed' ? 'বন্ধ' : 'খোলা'} (${fmtMed(today, lang)})`;
  const pillOf = (x: PostStatus): 'yes' | 'no' | 'neu' => (x.state === 'closed' ? 'no' : x.state === 'check' ? 'neu' : 'yes');
  const head = p.state === 'closed'
    ? (lang === 'mr' ? `नाही, ${loc} पोस्ट ऑफिस आज, ${fmtLong(today, lang)}, बंद आहे.` : lang === 'gu' ? `ના, ${loc} પોસ્ટ ઑફિસ આજે, ${fmtLong(today, lang)}, બંધ છે.` : `না, ${loc} পোস্ট অফিস আজকে, ${fmtLong(today, lang)}, বন্ধ থাকবে।`)
    : p.state === 'open'
      ? (lang === 'mr' ? `हो, ${loc} पोस्ट ऑफिस आज, ${fmtLong(today, lang)}, चालू आहे.` : lang === 'gu' ? `હા, ${loc} પોસ્ટ ઑફિસ આજે, ${fmtLong(today, lang)}, ખુલ્લું છે.` : `হ্যাঁ, ${loc} পোস্ট অফিস আজকে, ${fmtLong(today, lang)}, খোলা থাকবে।`)
      : (lang === 'mr' ? `आज, ${fmtLong(today, lang)}, ${loc} पोस्ट सुट्टी नाही.` : lang === 'gu' ? `આજે, ${fmtLong(today, lang)}, ${loc} પોસ્ટ રજા નથી.` : `আজকে, ${fmtLong(today, lang)}, ${loc} ডাক ছুটি নেই।`);
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: TODAY_PATH[lang], label: t(lang, 'home') }, { label: name }, { label: t(lang, 'postOffice') }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="post" size="lg" />
          <h1 className="qh">{postCityH1(city, today, p, lang)}</h1>
          <p className="big" id="ans">{lang === 'mr' ? `आज ${loc} पोस्ट ऑफिस चालू आहे का?` : lang === 'gu' ? `આજે ${loc} પોસ્ટ ઑફિસ ખુલ્લું છે?` : `আজকে ${loc} কি পোস্ট অফিস খোলা থাকবে?`}</p>
          <div className="statusrow"><Pill v={pillOf(p)} size="lg">{regionalPostLabel(p, lang, true)}</Pill><span className="dt t">{fmtLong(today, lang)}</span></div>
          <p className="answer"><b>{head}</b> {regionalPostReason(p, lang, circle)} (<a href={INDIAPOST.source} rel="noopener">{t(lang, 'postList')}</a>)</p>
          <div className="hrs">
            <div><div className="k">{p.state === 'closed' ? (lang === 'mr' ? 'पुन्हा चालू' : lang === 'gu' ? 'ફરી ખુલશે' : 'আবার খুলবে') : t(lang, 'nextHol')}</div><div className="v t">{p.state === 'closed' ? fmtMed(no, lang) : nx ? fmtMed(nx.d, lang) : '—'}{p.state !== 'closed' && nx && <small>{shortName(nx.n, lang)}</small>}</div></div>
          </div>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{t(lang, 'today')}</div><Pill v={pillOf(p)} size="xs">{regionalPostLabel(p, lang)}</Pill><div className="v t">{fmtDM(today, lang)}</div></div>
          <div className="card mini"><div className="k">{t(lang, 'tomorrow')}</div><Pill v={pillOf(tm)} size="xs">{regionalPostLabel(tm, lang)}</Pill><div className="v t">{fmtDM(addDays(today, 1), lang)}</div></div>
        </div>
        <Source tag="India Post" checked={LAST_CHECKED} lang={lang}>
          <a href={INDIAPOST.source} rel="noopener">{t(lang, 'postList')} {year}</a>, {circ.name}
        </Source>
        <Share text={shareText} path={`${pre}/${city.slug}/post-office`} lang={lang} ics={{ href: `/ics/post-office-${year}.ics`, label: t(lang, 'addCal') }} />
        <PostCityLead city={city} today={today} lang={lang} />
        <p className="footsrc">
          {lang === 'mr' ? `ही माहिती इंडिया पोस्ट ${circ.name} यादीतील आहे.` : lang === 'gu' ? `આ માહિતી ઇન્ડિયા પોસ્ટ ${circ.name} યાદીની છે.` : `এই তথ্য ইন্ডিয়া পোস্ট ${circ.name} তালিকার।`}{' '}
          <a href={`${pre}/${city.slug}/bank`}>{t(lang, 'bankToday')}</a>
          {' · '}<LangLinks lang={lang} alts={cityAlts(city.slug, 'post-office')} />
          {' · '}<a href="/post-office-holidays-2026">2026</a>
        </p>
        <div className="sech"><h2>{t(lang, 'about')}</h2></div>
        <Faq items={[...postCityFaqs(city, today, lang), ...regionalPostFaq(city, lang)]} />
      </div>
      <aside className="side">
        <div className="card panel"><div className="top"><h2>{t(lang, 'changeCity')}</h2></div><CitySwitcher current={city.slug} lang={lang} base="post-office" /></div>
        <div className="card panel">
          <div className="top"><h2>{t(lang, 'nextHol')}</h2></div>
          {upcomingPostHolidays(city.state, addDays(today, -1)).slice(0, 5).map((h) => (
            <div className="prow" key={h.d + h.n}><span className="t">{fmtMed(h.d, lang)}<small>{shortName(h.n, lang)}</small></span><Pill v="no" size="xs">{T.c(lang)}</Pill></div>
          ))}
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}

export function regionalTodayAllAnswer(day: string, label: 'today' | 'tomorrow', lang: Lang) {
  const closed = officesClosedOn(day);
  const base = bankDay([], day);
  const w = t(lang, label);
  const d = fmtLong(day, lang);
  const names = [...new Set(closed.map((o) => shortName(o.h.n, lang)))].slice(0, 2).join(' / ');
  const places = closed.map((o) => o.name).join(', ');
  if (!base.open) {
    const why = base.reason.kind === 'sunday' ? t(lang, 'sunday') : (lang === 'mr' ? `महिन्याचा ${base.reason.kind === 'saturday2' ? 'दुसरा' : 'चौथा'} शनिवार` : lang === 'gu' ? `મહિનાનો ${base.reason.kind === 'saturday2' ? 'બીજો' : 'ચોથો'} શનિવાર` : `মাসের ${base.reason.kind === 'saturday2' ? 'দ্বিতীয়' : 'চতুর্থ'} শনিবার`);
    return lang === 'mr'
      ? { b: `नाही, ${w}, ${d}, भारतभर बँक शाखा बंद आहेत`, r: `कारण: ${why}. ${t(lang, 'upiNote')}` }
      : lang === 'gu'
        ? { b: `ના, ${w}, ${d}, આખા ભારતમાં બેંક શાખા બંધ છે`, r: `કારણ: ${why}. ${t(lang, 'upiNote')}` }
        : { b: `না, ${w}, ${d}, সারা ভারতে ব্যাংক শাখা বন্ধ থাকবে`, r: `কারণ: ${why}। ${t(lang, 'upiNote')}` };
  }
  if (closed.length) {
    return lang === 'mr'
      ? { b: `${w}, ${d}, बहुतेक भारतात बँका चालू आहेत, पण ${closed.length} आरबीआई केंद्रे बंद आहेत`, r: `(${names}): ${places}. ${t(lang, 'upiNote')}` }
      : lang === 'gu'
        ? { b: `${w}, ${d}, મોટા ભાગના ભારતમાં બેંક ખુલ્લી છે, પણ ${closed.length} આરબીઆઈ કેન્દ્ર બંધ છે`, r: `(${names}): ${places}. ${t(lang, 'upiNote')}` }
        : { b: `${w}, ${d}, বেশিরভাগ ভারতে ব্যাংক খোলা থাকবে, কিন্তু ${closed.length}টি আরবিআই কেন্দ্র বন্ধ`, r: `(${names}): ${places}। ${t(lang, 'upiNote')}` };
  }
  return lang === 'mr'
    ? { b: `हो, ${w}, ${d}, भारतभर बँका चालू आहेत.`, r: t(lang, 'noRbiHoliday') }
    : lang === 'gu'
      ? { b: `હા, ${w}, ${d}, આખા ભારતમાં બેંક ખુલ્લી છે.`, r: t(lang, 'noRbiHoliday') }
      : { b: `হ্যাঁ, ${w}, ${d}, সারা ভারতে ব্যাংক খোলা থাকবে।`, r: t(lang, 'noRbiHoliday') };
}

export function RegionalTodayAll({ day, label, today, lang }: { day: string; label: 'today' | 'tomorrow'; today: string; lang: Lang }) {
  const closed = officesClosedOn(day);
  const base = bankDay([], day);
  const ans = regionalTodayAllAnswer(day, label, lang);
  const cities = citiesForLang(lang);
  const pre = prefix(lang);
  const tc = cities.map((c) => ({ c, s: bankDay(cityHolidays(c), day) }));
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: TODAY_PATH[lang], label: t(lang, 'home') }, { label: t(lang, 'todayBankQ') }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="bank" size="lg" />
          <h1 className="qh">{bankNationalH1(day, lang, label)}</h1>
          <p className="big" id="ans">{t(lang, 'todayBankQ')}</p>
          <div className="statusrow">
            {!base.open ? <Pill v="no" size="lg">{t(lang, 'closedAcross')}</Pill> : closed.length ? <Pill v="no" size="lg">{lang === 'mr' ? `34 पैकी ${closed.length} केंद्रे बंद` : lang === 'gu' ? `34માંથી ${closed.length} કેન્દ્ર બંધ` : `34টির মধ্যে ${closed.length}টি কেন্দ্র বন্ধ`}</Pill> : <Pill v="yes" size="lg">{t(lang, 'openAcross')}</Pill>}
            <span className="dt t">{fmtLong(day, lang)}</span>
          </div>
          <p className="answer"><b>{ans.b}</b> {ans.r} (<a href={RBI.source} rel="noopener">{t(lang, 'rbiList')}</a>)</p>
        </section>
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}><a href={RBI.source} rel="noopener">Holiday Matrix</a>, {t(lang, 'rbiOffices')}</Source>
        {closed.length > 0 && (
          <>
            <div className="sech"><h2>{t(lang, 'banksClosedHere')}</h2><span>{closed.length} {t(lang, 'centres')}</span></div>
            <div className="card list">
              {closed.map((o) => (
                <div className="row" key={o.slug}>
                  <div className="nm"><a href={`/bank-holidays-2026/${o.state.slug}`}><b>{o.name}</b></a> · {o.state.name}<small>{shortName(o.h.n, lang)}{o.h.n !== shortName(o.h.n) ? ` · RBI: ${o.h.n}` : ''}</small></div>
                  <Pill v="no" size="xs">{t(lang, 'closed')}</Pill>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="sech"><h2>{t(lang, 'majorCities')}</h2><span className="t">{fmtMed(day, lang)}</span></div>
        <div className="card else">
          <div className="chips">
            {tc.map(({ c, s }) => <a key={c.slug} className={s.open ? 'y' : 'n'} href={`${pre}/${c.slug}/bank`}><i aria-hidden="true" />{cityName(c, lang)} <em>{s.open ? t(lang, 'open') : t(lang, 'closed')}</em></a>)}
          </div>
        </div>
        <p className="note">{t(lang, 'scheduledNote')}</p>
        <Share lang={lang} text={`${t(lang, 'todayBankQ')} (${fmtMed(day, lang)})`} path={TODAY_PATH[lang]} />
        <p className="footsrc"><LangLinks lang={lang} alts={todayAlts()} />{' · '}<a href="/is-post-office-open-today">{t(lang, 'postToday')}</a></p>
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>{t(lang, 'next7')}</h2></div>
          {Array.from({ length: 7 }, (_, i) => addDays(today, i + 1)).map((d) => {
            const b = bankDay([], d);
            const n = officesClosedOn(d).length;
            return <div className="prow" key={d}><span className="t">{fmtMed(d, lang)}<small>{!b.open ? (b.reason.kind === 'sunday' ? t(lang, 'sunday') : t(lang, 'bankSat')) : n ? (lang === 'mr' ? `${n} केंद्रे बंद` : lang === 'gu' ? `${n} કેન્દ્ર બંધ` : `${n}টি কেন্দ্র বন্ধ`) : t(lang, 'openEverywhere')}</small></span><Pill v={!b.open ? 'no' : n ? 'neu' : 'yes'} size="xs">{!b.open ? t(lang, 'allClosed') : n ? t(lang, 'someClosed') : t(lang, 'open')}</Pill></div>;
          })}
        </div>
      </aside>
    </div>
  );
}
