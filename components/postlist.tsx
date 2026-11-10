import { SvcIcon } from './icons';
import { Crumb, DTile, Pill, Source, Share, Faq, JsonLd, faqLd, holidayListLd } from './ui';
import { CENTRAL, LAST_CHECKED } from '@/lib/data';
import { dow, fmtLong } from '@/lib/date';

export function PostYear({ year, today }: { year: 2026 | 2027; today: string }) {
  const y = CENTRAL[String(year) as '2026' | '2027'];
  const comp = y.holidays.filter((h) => h.c);
  const weekday = comp.filter((h) => dow(h.d) !== 0);
  const faq = [
    { q: `How many post office holidays are there in ${year}?`, a: `${comp.length} compulsory central government holidays apply in every state (${weekday.length} of them on a weekday other than Sunday). Each state adds 3 more chosen from 12 optional festivals, and post offices are closed on Sundays.` },
    { q: 'Are post offices closed on 2nd and 4th Saturday?', a: 'The 2nd/4th Saturday closure is a banking rule. Post offices usually work on Saturdays; hours vary, so check with your local office.' },
    { q: 'Why is my post office open on a bank holiday?', a: 'Many bank holidays are state festivals. Post offices follow the central government list, so they often stay open when banks are closed.' },
  ];
  const path = `/post-office-holidays-${year}`;
  return (
    <>
      <JsonLd data={[faqLd(faq), holidayListLd(`Post office holidays ${year} (central government)`, path, comp)]} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { label: `Post office holidays ${year}` }]} />
          <div className="phero"><SvcIcon s="post" size="lg" /><div><div className="e">Post office · All India</div><h1>Post office holidays {year}</h1></div></div>
          <p className="lead">Post offices are central government offices. These {comp.length} holidays are compulsory everywhere in India; Delhi also closes on the 3 days DoPT picked (marked “Delhi”). Other states add 3 days of their own — confirm with your local office.</p>
          <Source tag="DoPT" checked={LAST_CHECKED}><a href={year === 2027 ? CENTRAL['2027'].pdf : CENTRAL.source} rel="noopener">{y.om}</a></Source>
          <Share text={`Post office holidays ${year}`} path={path} ics={{ href: `/ics/post-office-${year}.ics` }} />
          <div className="card list">
            {y.holidays.map((h) => (
              <div className={`row${h.d < today ? ' past' : ''}`} key={h.d + h.n}>
                <DTile iso={h.d} no={h.c && h.d >= today} />
                <div className="nm">{h.n}<small className="t">{fmtLong(h.d)}{dow(h.d) === 0 ? ' · Sunday' : dow(h.d) === 6 ? ' · Saturday' : ''}{h.moon ? ' · date may shift with moon sighting' : ''}</small></div>
                <Pill v={!h.c ? 'neu' : h.d < today ? 'neu' : 'no'} size="xs">{!h.c ? 'Delhi' : h.d < today ? 'Past' : 'All India'}</Pill>
              </div>
            ))}
          </div>
          <p className="footsrc">“Delhi” = one of the 3 optional holidays DoPT chose for Delhi/New Delhi offices. Other states choose their own 3 from: an extra day for Dussehra, Holi, Janmashtami, Ram Navami, Maha Shivratri, Ganesh Chaturthi, Makar Sankranti, Rath Yatra, Onam, Pongal, Basant Panchami, and Vishu/Vaisakhi/Bihu/Ugadi/Gudi Padwa/Chhath and similar. Post offices are also closed on Sundays.</p>
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
        </div>
        <aside className="side"><div className="card panel"><div className="top"><h2>Other years</h2></div>
          <div className="prow"><a href="/post-office-holidays-2026">2026</a></div><div className="prow"><a href="/post-office-holidays-2027">2027</a><Pill v="yes" size="xs">Published</Pill></div>
          <div className="prow"><a href="/mumbai/post-office">Is the post office open today?</a></div>
        </div></aside>
      </div>
    </>
  );
}
