import { City, stateBySlug } from '@/lib/places';
import { bankDay, cityHolidays, circleList, circleOf, INDIAPOST, postDay, RBI, secondOrFourthSat, type Hol } from '@/lib/data';
import { addDays, dayNum, dow, fmtDM, fmtLong, monthName, monthNum } from '@/lib/date';
import { shortName } from '@/lib/names';
import { GNJ_2026 } from '@/lib/titles';
import { Pill } from './ui';

const NTH_EN = ['first', 'second', 'third', 'fourth', 'fifth'] as const;
const NTH_HI = ['पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ'] as const;

function nthOf(iso: string, lang: 'en' | 'hi') {
  const n = Math.ceil(dayNum(iso) / 7);
  return lang === 'hi' ? NTH_HI[n - 1] : NTH_EN[n - 1];
}

function thisSaturday(today: string) {
  return addDays(today, (6 - dow(today) + 7) % 7);
}

function nextBankSatOff(today: string) {
  for (let i = 0; i < 60; i++) {
    const d = addDays(today, i);
    if (secondOrFourthSat(d) && d >= today) return d;
  }
  return null;
}

function remainingRbi(hols: Hol[], today: string) {
  return hols.filter((h) => h.d >= today && h.d.startsWith('2026')).sort((a, b) => a.d.localeCompare(b.d));
}

function remainingPost2026(state: string, today: string) {
  const all = new Set((INDIAPOST.circles['All India'] ?? []).map((h) => h.d));
  return circleList(state)
    .filter((h) => h.d >= today && h.d.startsWith('2026'))
    .map((h) => ({ ...h, allIndia: all.has(h.d) }));
}

function festivalDiffs(city: City, today: string, days = 50) {
  const hols = cityHolidays(city);
  const out: { d: string; bankClosed: boolean; postClosed: boolean; bankName?: string; postName?: string }[] = [];
  for (let i = 0; i <= days; i++) {
    const d = addDays(today, i);
    if (!d.startsWith('2026')) break;
    if (d === GNJ_2026) continue; // covered in the Guru Nanak Jayanti note
    const b = bankDay(hols, d);
    const p = postDay(city.state, d, hols);
    const bankClosed = !b.open && b.reason.kind === 'holiday';
    const postClosed = p.state === 'closed' && p.kind === 'holiday';
    if (bankClosed !== postClosed) {
      out.push({ d, bankClosed, postClosed, bankName: b.reason.name, postName: p.name });
    }
  }
  return out;
}

export function BankCityLead({ city, today, lang = 'en' }: { city: City; today: string; lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const centre = RBI.offices[city.office].name;
  const cname = hi ? city.hi : city.name;
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const satS = bankDay(hols, sat);
  const nextSat = nextBankSatOff(today);
  const gnj = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const where = hi ? st.hi : st.name;

  return (
    <div className="citylead">
      {city.derived && (
        <p className="note">
          {hi
            ? <><b>{cname} का अपना आरबीआई कार्यालय नहीं है।</b> यहाँ बैंक छुट्टियाँ {where} के लिए आरबीआई {centre} केंद्र की सूची से ली जाती हैं।</>
            : <><b>{city.name} has no RBI office of its own.</b> Bank holidays here follow the RBI {centre} centre list for {st.name}.</>}
        </p>
      )}
      <div className="sech"><h2>{hi ? `${cname} में आगे की आरबीआई छुट्टियाँ` : `RBI holidays still ahead in ${city.name}`}</h2><span>2026</span></div>
      <p className="note">
        {next
          ? (hi
            ? <>{next.d === today ? 'आज' : 'अगली'} आरबीआई छुट्टी {cname} के बैंकों के लिए <b>{fmtLong(next.d, 'hi')}</b> है: {shortName(next.n, 'hi')} (आरबीआई {centre} केंद्र)।</>
            : <>The {next.d === today ? 'RBI holiday today' : 'next RBI holiday'} for banks in {city.name} is <b>{fmtLong(next.d)}</b>: {shortName(next.n)} (RBI {centre} centre).</>)
          : (hi
            ? <>2026 की आरबीआई {centre} सूची में {cname} के लिए कोई और त्योहार अवकाश नहीं बचा है। 2027 की तालिका अभी प्रकाशित नहीं हुई है।</>
            : <>The 2026 RBI {centre} list has no further festival holiday for banks in {city.name}. The 2027 matrix is not published yet.</>)}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d}>
              <div className="nm"><b>{shortName(h.n, lang)}</b><small className="t">{fmtLong(h.d, lang)}{h.n !== shortName(h.n) ? ` · RBI: ${h.n}` : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? (hi ? 'आज' : 'Today') : Tclosed(hi)}</Pill>
            </div>
          ))}
        </div>
      )}

      <div className="sech"><h2>{hi ? `${cname} में इस शनिवार` : `This Saturday in ${city.name}`}</h2></div>
      <p className="note">
        {hi
          ? <>इस शनिवार, <b>{fmtDM(sat, 'hi')}</b>, {monthName(monthNum(sat), 'hi')} का {nthOf(sat, 'hi')} शनिवार है, इसलिए {cname} में बैंक {satS.open ? 'खुले रहेंगे' : 'बंद रहेंगे'}। सभी बैंक केवल दूसरे और चौथे शनिवार को बंद रहते हैं।{nextSat ? <> अगली ऐसी छुट्टी {fmtDM(nextSat, 'hi')} है।</> : null}</>
          : <>This Saturday, <b>{fmtDM(sat)}</b>, is the {nthOf(sat, 'en')} Saturday of {monthName(monthNum(sat))}, so banks in {city.name} are {satS.open ? 'open' : 'closed'}. Banks close only on the second and fourth Saturday.{nextSat ? <> The next such day off is {fmtDM(nextSat)}.</> : null}</>}
      </p>

      {gnj && (
        <p className="note">
          <b>{hi ? '24 नवंबर, गुरु नानक जयंती:' : '24 Nov, Guru Nanak Jayanti:'}</b>{' '}
          {gnj.open
            ? (hi
              ? `${cname} में बैंक खुले रहेंगे; आरबीआई ${centre} केंद्र पर इस दिन अवकाश नहीं है। ${cname} में डाकघर बंद हैं, क्योंकि गुरु नानक जयंती भारत डाक की अखिल भारतीय सूची में है।`
              : `banks in ${city.name} stay open; the RBI ${centre} list has no holiday that day. Post offices in ${city.name} are closed, because Guru Nanak's Birthday is on India Post's All-India list.`)
            : (hi
              ? `${cname} में बैंक बंद हैं (आरबीआई ${centre} सूची)। ${cname} में डाकघर भी बंद हैं; यह अखिल भारतीय डाक अवकाश है।`
              : `banks in ${city.name} are closed (RBI ${centre} list). Post offices in ${city.name} are also closed; it is an All-India postal holiday.`)}
          {' '}<a href={hi ? '/hi/guru-nanak-jayanti-2026-bank-khula-hai' : '/is-bank-open-on-guru-nanak-jayanti-2026'}>{hi ? 'शहरवार सूची' : 'City-wise list'}</a>
          {' · '}<a href={`${hi ? '/hi' : ''}/${city.slug}/post-office`}>{hi ? 'डाकघर आज' : 'Post office today'}</a>.
        </p>
      )}

      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{hi ? 'जब बैंक और डाकघर अलग हैं' : `When banks and post offices differ in ${city.name}`}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>{u.bankClosed ? (hi ? `बैंक बंद: ${shortName(u.bankName!, 'hi')}` : `Banks closed: ${shortName(u.bankName!)}`) : (hi ? 'बैंक खुले' : 'Banks open')}
                    {' · '}
                    {u.postClosed ? (hi ? `डाकघर बंद${u.postName ? `: ${u.postName}` : ''}` : `Post office closed${u.postName ? `: ${u.postName}` : ''}`) : (hi ? 'डाकघर अवकाश सूची में नहीं' : 'Not on the postal holiday list')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Tclosed(hi: boolean) {
  return hi ? 'बंद' : 'Closed';
}

export function PostCityLead({ city, today, lang = 'en' }: { city: City; today: string; lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  const hols = cityHolidays(city);
  const circ = circleOf(city.state);
  const cname = hi ? city.hi : city.name;
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const gnjBank = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const nextSat = nextBankSatOff(today);

  return (
    <div className="citylead">
      {circ.note && (
        <p className="note">
          {hi
            ? <><b>{cname}</b> भारत डाक के {circ.name} की सूची से आता है।</>
            : <><b>{city.name}</b> is covered by India Post’s {circ.name}. {circ.note}.</>}
        </p>
      )}
      <div className="sech"><h2>{hi ? `${cname} में आगे की डाक छुट्टियाँ` : `India Post holidays still ahead in ${city.name}`}</h2><span>{circ.name}</span></div>
      <p className="note">
        {next
          ? (hi
            ? <>{cname} के डाकघरों की {next.d === today ? 'आज की' : 'अगली'} छुट्टी <b>{fmtLong(next.d, 'hi')}</b> है: {next.n}{next.allIndia ? ' (अखिल भारतीय अवकाश)' : ''}। स्रोत: भारत डाक, {circ.name}।</>
            : <>The {next.d === today ? 'postal holiday today' : 'next postal holiday'} for {city.name} is <b>{fmtLong(next.d)}</b>: {next.n}{next.allIndia ? ' (an All-India postal holiday)' : ''}. Source: India Post, {circ.name}.</>)
          : (hi
            ? <>2026 की {circ.name} सूची में {cname} के लिए कोई और डाक अवकाश नहीं बचा है। सर्कल की 2027 सूची अभी प्रकाशित नहीं हुई है।</>
            : <>The 2026 {circ.name} list has no further postal holiday for {city.name}. The 2027 circle list is not published yet.</>)}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d + h.n}>
              <div className="nm"><b>{h.n}</b><small className="t">{fmtLong(h.d, lang)}{h.allIndia ? (hi ? ' · अखिल भारतीय' : ' · All-India') : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? (hi ? 'आज' : 'Today') : Tclosed(hi)}</Pill>
            </div>
          ))}
        </div>
      )}

      <div className="sech"><h2>{hi ? `${cname} में इस शनिवार` : `This Saturday in ${city.name}`}</h2></div>
      <p className="note">
        {hi
          ? <>इस शनिवार, <b>{fmtDM(sat, 'hi')}</b>, {circ.name} की अवकाश सूची में नहीं है। बैंकों का दूसरे/चौथे शनिवार का नियम डाकघरों पर लागू नहीं होता, और शनिवार का समय {cname} में कार्यालय के अनुसार अलग होता है।{nextSat ? <> उस दिन बैंक बंद रहेंगे ({fmtDM(nextSat, 'hi')} अगला बैंक-शनिवार अवकाश है)।</> : null}</>
          : <>This Saturday, <b>{fmtDM(sat)}</b>, is not on the {circ.name} holiday list. The banks’ 2nd and 4th Saturday rule does not apply to post offices, and Saturday hours in {city.name} vary by office.{nextSat ? <> Banks will be closed on the next 2nd or 4th Saturday, {fmtDM(nextSat)}.</> : null}</>}
      </p>

      {gnjBank && (
        <p className="note">
          <b>{hi ? '24 नवंबर, गुरु नानक जयंती:' : "24 Nov, Guru Nanak's Birthday:"}</b>{' '}
          {hi
            ? `पूरे भारत में डाकघर बंद हैं (भारत डाक की अखिल भारतीय सूची)। ${cname} में बैंक उस दिन ${gnjBank.open ? 'खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है' : 'भी बंद हैं, आरबीआई सूची के अनुसार'}।`
            : `post offices across India are closed (India Post All-India list). Banks in ${city.name} ${gnjBank.open ? 'stay open that day; RBI lists no holiday for this centre' : 'are also closed, from the RBI holiday matrix'}.`}
          {' '}<a href={`${hi ? '/hi' : ''}/${city.slug}/bank`}>{hi ? 'बैंक आज' : 'Bank today'}</a>.
        </p>
      )}

      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{hi ? `${cname} में बैंकों से अलग दिन` : `Days in ${city.name} when this differs from banks`}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>{u.postClosed ? (hi ? `डाकघर बंद${u.postName ? `: ${u.postName}` : ''}` : `Post office closed${u.postName ? `: ${u.postName}` : ''}`) : (hi ? 'डाक अवकाश सूची में नहीं' : 'Not on the postal holiday list')}
                    {' · '}
                    {u.bankClosed ? (hi ? `बैंक बंद: ${shortName(u.bankName!, 'hi')}` : `Banks closed: ${shortName(u.bankName!)}`) : (hi ? 'बैंक खुले' : 'Banks open')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function bankCityFaqs(city: City, today: string, lang: 'en' | 'hi') {
  const hols = cityHolidays(city);
  const st = stateBySlug(city.state)!;
  const centre = RBI.offices[city.office].name;
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const nextSat = nextBankSatOff(today);
  const derived = city.derived
    ? (lang === 'hi' ? ` (${city.hi} का अपना कार्यालय नहीं है, इसलिए ${centre} केंद्र की सूची)` : ` (${city.name} has no RBI office of its own, so this uses the ${centre} list)`)
    : '';
  if (lang === 'hi') {
    return [
      {
        q: `${city.hi} में अगली बैंक छुट्टी कब है?`,
        a: next
          ? `${fmtLong(next.d, 'hi')} को ${shortName(next.n, 'hi')}, आरबीआई ${centre} केंद्र की सूची से।${derived} दूसरे और चौथे शनिवार भी पूरे देश में बैंक अवकाश हैं${nextSat ? `; अगला ${fmtLong(nextSat, 'hi')} है` : ''}।`
          : `2026 की आरबीआई ${centre} सूची में ${city.hi} के लिए कोई और त्योहार अवकाश नहीं बचा है। 2027 की तालिका अभी नहीं आई है। बैंक फिर भी दूसरे और चौथे शनिवार को बंद रहते हैं${nextSat ? `; अगला ${fmtLong(nextSat, 'hi')} है` : ''}।`,
      },
    ];
  }
  return [
    {
      q: `When is the next bank holiday in ${city.name}?`,
      a: next
        ? `${fmtLong(next.d)} is ${shortName(next.n)}, from the RBI ${centre} list for ${st.name}.${derived} The 2nd and 4th Saturdays are also bank holidays nationwide${nextSat ? `; the next one is ${fmtLong(nextSat)}` : ''}.`
        : `The 2026 RBI ${centre} list has no further festival holiday for ${city.name}. The 2027 matrix is not published yet. Banks still close on the 2nd and 4th Saturdays${nextSat ? `; the next one is ${fmtLong(nextSat)}` : ''}.`,
    },
  ];
}

export function postCityFaqs(city: City, today: string, lang: 'en' | 'hi') {
  const circ = circleOf(city.state);
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const gnjOpen = today <= GNJ_2026 ? bankDay(cityHolidays(city), GNJ_2026).open : null;
  if (lang === 'hi') {
    return [
      {
        q: `${city.hi} में अगली डाक छुट्टी कब है?`,
        a: next
          ? `${fmtLong(next.d, 'hi')} को ${next.n}${next.allIndia ? ' (अखिल भारतीय अवकाश)' : ''}, भारत डाक के ${circ.name} से।`
          : `2026 की ${circ.name} सूची में ${city.hi} के लिए कोई और डाक अवकाश नहीं बचा है।`,
      },
      ...(gnjOpen === null ? [] : [{
        q: `24 नवंबर को ${city.hi} में बैंक और डाकघर एक जैसे बंद हैं?`,
        a: gnjOpen
          ? `नहीं। डाकघर बंद हैं (गुरु नानक जयंती, अखिल भारतीय डाक अवकाश), लेकिन ${city.hi} में बैंक खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है।`
          : `हाँ। ${city.hi} में बैंक और डाकघर दोनों 24 नवंबर को बंद हैं: बैंक आरबीआई सूची से, डाकघर भारत डाक की अखिल भारतीय सूची से।`,
      }]),
    ];
  }
  return [
    {
      q: `When is the next post office holiday in ${city.name}?`,
      a: next
        ? `${fmtLong(next.d)} is ${next.n}${next.allIndia ? ' (an All-India postal holiday)' : ''}, from India Post’s ${circ.name}.`
        : `The 2026 ${circ.name} list has no further postal holiday for ${city.name}.`,
    },
    ...(gnjOpen === null ? [] : [{
      q: `Are banks and post offices both closed in ${city.name} on 24 Nov?`,
      a: gnjOpen
        ? `No. Post offices are closed for Guru Nanak's Birthday (All-India postal holiday), but banks in ${city.name} stay open; RBI lists no holiday for this centre.`
        : `Yes. Banks and post offices in ${city.name} are both closed on 24 Nov: banks from the RBI list, post offices from India Post's All-India list.`,
    }]),
  ];
}
