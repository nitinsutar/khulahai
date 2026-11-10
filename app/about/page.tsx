import { Page } from '@/components/page';
import { Crumb } from '@/components/ui';
import { RBI, NSE, CENTRAL, LAST_CHECKED, INDIAPOST, MCX } from '@/lib/data';
import { meta } from '@/lib/meta';
export const metadata = meta({ title: 'About Khula Hai & our sources', description: 'How Khula Hai works: RBI, NSE, BSE, MCX, India Post and DoPT holiday sources, how today’s status is calculated in Indian time, and what we do not cover.', path: '/about' });
export default function P() {
  return (
    <Page>
      <div className="layout narrow"><div>
        <Crumb items={[{ href: '/', label: 'Home' }, { label: 'About & sources' }]} />
        <div className="phero"><div><div className="e">About</div><h1>Sources &amp; how it works</h1></div></div>
        <div className="card prose">
          <h2>What Khula Hai does</h2>
          <p>One quick answer: is the bank, share market or post office open today where you are — and if not, why, and when it opens next. Every page recalculates “today” in Indian Standard Time (Asia/Kolkata), refreshing every few minutes, so it never shows an old date.</p>
          <h2>Our sources</h2>
          <ul>
            <li><b>Banks:</b> <a href={RBI.source} rel="noopener">{RBI.title}</a>, all 34 regional offices. Cities without their own RBI office use the list of their state’s RBI office, and we say so on the page. Plus RBI’s rule that all banks close on the 2nd and 4th Saturday, and Sundays.</li>
            <li><b>Share market:</b> <a href={NSE.source} rel="noopener">NSE trading holidays</a> and BSE notices <a href={NSE.bseSource} rel="noopener">20251212-8</a> and <a href={NSE.bseSource2} rel="noopener">20260112-8</a> (equity segment). Session 9:15–15:30 IST.</li>
            <li><b>Commodities:</b> <a href={MCX.source} rel="noopener">MCX trading holidays</a>, circular {MCX.circular} (morning and evening sessions).</li>
            <li><b>Post offices:</b> <a href={INDIAPOST.source} rel="noopener">India Post holidays list</a> — the All-India list and each postal circle’s list for 2026. For 2027, only the central government list is out: <a href={CENTRAL['2027'].pdf} rel="noopener">{CENTRAL['2027'].om}</a>.</li>
          </ul>
          <h2>Mappings we make (and label)</h2>
          <ul>
            <li>Punjab and Haryana have no RBI regional office of their own; we show the RBI <b>Chandigarh</b> list for them and label it as a mapping.</li>
            <li>Cities without an RBI office (e.g. Pune, Surat, Indore) use their state’s RBI office list.</li>
            <li>Chandigarh post offices use the Punjab Circle list; Goa uses the Maharashtra Circle list (India Post groups them that way).</li>
            <li>Co-operative banks and regional rural banks (RRBs) may follow a different state list. Our status is for scheduled commercial banks.</li>
          </ul>
          <h2>What we label as “typical”</h2>
          <p>Bank branch hours (10:00–16:00) and post office counter hours (10:00–17:00) are typical, not official — they vary by branch. India Post does not list Saturdays as holidays and Saturday hours vary, so we say “not a holiday — check hours locally” rather than claim a post office is open or closed.</p>
          <h2>Last checked</h2>
          <p className="t">All lists were last checked against the official sources on {LAST_CHECKED}. Spotted a mistake? Holidays can change at short notice (for example by a state notification); the official source always wins. Corrections: tell us the page and the official notification, and we will re-check and update the page and its “last checked” date.</p>
        </div>
      </div></div>
    </Page>
  );
}
