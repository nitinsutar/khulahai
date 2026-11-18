import { stateBySlug } from '@/lib/places';
import { LAST_CHECKED, RBI } from '@/lib/data';
import { fmtDM, fmtLong, todayIST } from '@/lib/date';
import { planForState, plansIdentical, type Stretch, type WeekendPlan } from '@/lib/weekends';
import { toolPath } from '@/lib/toolPaths';
import { bankShort } from '@/lib/text';
import { Crumb, Faq, Source } from './ui';
import { StateGrid as States } from './lists';
import { ToolNav, CopyShare } from './tools';
import type { Lang } from '@/lib/lang';

function dayBits(s: Stretch, lang: Lang) {
  const bits: string[] = [];
  for (const h of s.holidays) bits.push(lang === 'hi' ? h.name : h.name);
  for (const w of s.weeklyOffs) bits.push(bankShort({ kind: w.kind }, lang));
  return bits.join(', ');
}

function StretchList({ items, kind, lang }: { items: Stretch[]; kind: 'natural' | 'bridge'; lang: Lang }) {
  const hi = lang === 'hi';
  if (!items.length) {
    return <p className="empty">{kind === 'natural' ? (hi ? '2026 में इस तारीख के बाद कोई 3 दिन या उससे लंबा आधिकारिक अवकाश खंड नहीं बचा है।' : 'No official 3-day or longer break remains in 2026 after this date.') : (hi ? '2026 में एक दिन की छुट्टी लेकर चार दिन मिलने का कोई मौका नहीं बचा है।' : 'No remaining 2026 chance to take one leave day and get four days off.')}</p>;
  }
  return (
    <div className="card list">
      {items.map((s) => (
        <div className="row" key={`${s.start}-${s.end}-${s.leaveDate ?? ''}`}>
          <div className="nm">
            <b className="t">{fmtDM(s.start, lang)} {lang === 'hi' ? 'से' : 'to'} {fmtDM(s.end, lang)}</b>
            <small>
              {hi ? `${s.days} दिन` : `${s.days} days`}
              {s.leaveDate ? (hi ? ` · ${fmtDM(s.leaveDate, 'hi')} को एक दिन की छुट्टी` : ` · take ${fmtDM(s.leaveDate)} off`) : ''}
              {dayBits(s, lang) ? ` · ${dayBits(s, lang)}` : ''}
              {s.uncertainEnd ? (hi ? ' · 2027 की सूची आने पर यह अवधि बढ़ सकती है' : ' · this may run longer once the 2027 list is out') : ''}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}

function OfficePlan({ name, plan, lang }: { name: string; plan: WeekendPlan; lang: Lang }) {
  const hi = lang === 'hi';
  return (
    <div className="officeplan">
      <div className="sech"><h2>{hi ? `${name} केंद्र` : `${name} centre`}</h2><span>{hi ? 'आधिकारिक आरबीआई सूची' : 'Official RBI list'}</span></div>
      <h3 className="subh">{hi ? 'आने वाले 3 दिन या अधिक के अवकाश' : 'Upcoming 3-day or longer breaks'}</h3>
      <StretchList items={plan.natural} kind="natural" lang={lang} />
      <h3 className="subh">{hi ? 'एक दिन की छुट्टी लेकर चार दिन' : 'Take 1 leave, get 4 days'}</h3>
      <StretchList items={plan.bridges} kind="bridge" lang={lang} />
      {plan.pendingYearEnd.length > 0 && (
        <p className="note">
          {hi
            ? `${plan.pendingYearEnd.map((x) => fmtDM(x.date, 'hi')).join(', ')} को बैंक बंद हैं। क्या यह लंबी छुट्टी बनेगी, यह 2027 की आधिकारिक सूची पर निर्भर है, जो अभी प्रकाशित नहीं हुई है।`
            : `${plan.pendingYearEnd.map((x) => fmtDM(x.date)).join(', ')} ${plan.pendingYearEnd.length === 1 ? 'is' : 'are'} a bank closure. Whether this becomes a longer break depends on the official 2027 list, which has not been published yet.`}
        </p>
      )}
    </div>
  );
}

export function WeekendsIndex({ lang = 'en' }: { lang?: Lang }) {
  const hi = lang === 'hi';
  const today = todayIST();
  const faq = hi
    ? [
        { q: 'ये तारीखें कहाँ से आती हैं?', a: 'प्रत्येक आरबीआई केंद्र की 2026 की आधिकारिक अवकाश तालिका से, साथ में हर रविवार और महीने के दूसरे व चौथे शनिवार। 2027 की सूची अभी प्रकाशित नहीं हुई है, इसलिए हम 2027 की छुट्टियाँ नहीं जोड़ते।' },
        { q: 'एक दिन की छुट्टी लेकर चार दिन का क्या मतलब है?', a: 'एक ऐसा कार्य दिवस जिसे छुट्टी मानने पर लगातार चार या अधिक दिन बैंक बंद रहते हैं, जैसे गुरुवार की छुट्टी हो तो शुक्रवार की छुट्टी लेने पर गुरुवार से रविवार तक चार दिन मिलते हैं।' },
      ]
    : [
        { q: 'Where do these dates come from?', a: 'From each RBI centre’s official 2026 holiday list, plus every Sunday and the 2nd and 4th Saturday of the month. The 2027 list has not been published yet, so we do not add 2027 holidays.' },
        { q: 'What does take 1 leave, get 4 days mean?', a: 'A working day that, if you take it off, sits inside a stretch of four or more consecutive bank-closed days. For example, if Thursday is a holiday, taking Friday off gives Thursday to Sunday.' },
      ];
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { label: hi ? 'लंबे सप्ताहांत' : 'Long weekends' }]} />
        <div className="phero"><div><div className="e">{hi ? 'साधन' : 'Tools'}</div><h1>{hi ? '2026 के लंबे सप्ताहांत' : 'Long weekends in 2026'}</h1></div></div>
        <ToolNav lang={lang} current="weekends" />
        <p className="lead">
          {hi
            ? 'अपने राज्य को चुनें। हम उस राज्य के हर आरबीआई केंद्र की आधिकारिक सूची से, आज के बाद के 3 दिन या उससे लंबे अवकाश और एक दिन की छुट्टी लेकर चार दिन वाले मौके दिखाते हैं। 2027 की आधिकारिक सूची अभी नहीं आई है।'
            : 'Pick your state. From each RBI centre’s official list we show every remaining 3-day or longer break, and every chance to take one leave day and get four days off. The official 2027 list has not been published yet.'}
        </p>
        <States hrefFor={(s) => toolPath(lang, 'weekends', s)} />
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}><a href={RBI.source} rel="noopener">{hi ? 'अवकाश तालिका' : 'Holiday Matrix'}</a></Source>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={faq} />
      </div>
    </div>
  );
}

export function WeekendsState({ slug, lang = 'en' }: { slug: string; lang?: Lang }) {
  const hi = lang === 'hi';
  const today = todayIST();
  const pack = planForState(slug, today)!;
  const st = pack.state;
  const name = hi ? st.hi : st.name;
  const same = pack.offices.length === 1 || pack.offices.every((o) => plansIdentical(o.plan, pack.offices[0].plan));
  const path = toolPath(lang, 'weekends', slug);
  const next = pack.offices[0].plan.natural[0];
  const share = next
    ? (hi
      ? `${name} में अगला लंबा सप्ताहांत: ${fmtDM(next.start, 'hi')} से ${fmtDM(next.end, 'hi')} (${next.days} दिन), आधिकारिक आरबीआई सूची से।`
      : `Next long weekend in ${name}: ${fmtDM(next.start)} to ${fmtDM(next.end)} (${next.days} days), from the official RBI list.`)
    : (hi ? `${name} में 2026 के बाकी लंबे सप्ताहांत, आधिकारिक आरबीआई सूची से।` : `Remaining 2026 long weekends in ${name}, from the official RBI list.`);
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { href: toolPath(lang, 'weekends'), label: hi ? 'लंबे सप्ताहांत' : 'Long weekends' }, { label: name }]} />
        <div className="phero"><div><div className="e">{hi ? 'साधन · 2026' : 'Tools · 2026'}</div><h1>{hi ? `${name} के लंबे सप्ताहांत` : `Long weekends in ${name}`}</h1></div></div>
        <ToolNav lang={lang} current="weekends" />
        <p className="lead">
          {hi
            ? `${name} के आरबीआई केंद्र की 2026 की आधिकारिक सूची, हर रविवार और दूसरे व चौथे शनिवार के साथ। 2027 की सूची अभी प्रकाशित नहीं हुई है, इसलिए जनवरी के बाद की छुट्टियाँ नहीं जोड़ी गई हैं।`
            : `From the official 2026 RBI list for ${name}, plus every Sunday and the 2nd and 4th Saturday. The 2027 list has not been published yet, so we do not add holidays after December.`}
        </p>
        {st.mappedFrom && (
          <p className="note">
            {hi
              ? `${name} का अपना आरबीआई कार्यालय नहीं है। हम ${st.mappedFrom} केंद्र की सूची दिखाते हैं, जो इस क्षेत्र को कवर करती है।`
              : `${name} has no RBI office of its own. We show the ${st.mappedFrom} centre’s list, which covers this region.`}
          </p>
        )}
        <CopyShare text={share} path={path} lang={lang} />
        {same ? (
          <OfficePlan name={pack.offices.map((o) => o.name).join(', ')} plan={pack.offices[0].plan} lang={lang} />
        ) : (
          pack.offices.map((o) => <OfficePlan key={o.slug} name={o.name} plan={o.plan} lang={lang} />)
        )}
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}>
          <a href={RBI.source} rel="noopener">{hi ? 'अवकाश तालिका' : 'Holiday Matrix'}</a>
          {' · '}
          {pack.offices.map((o) => o.name).join(', ')}
        </Source>
        <p className="footsrc"><a href={toolPath(lang, 'weekends')}>{hi ? 'सभी राज्य' : 'All states'}</a></p>
      </div>
    </div>
  );
}

export function WeekendsStateOrNull({ slug, lang = 'en' }: { slug: string; lang?: Lang }) {
  if (!stateBySlug(slug) || !planForState(slug, todayIST())) return null;
  return <WeekendsState slug={slug} lang={lang} />;
}
