import type { Lang } from '@/lib/lang';
import type { City } from '@/lib/places';
import { toolPath, toolsHome } from '@/lib/toolPaths';
import { abs } from '@/lib/site';
import { IArrow, IWa } from './icons';

export function ToolNav({ lang = 'en', current }: { lang?: Lang; current?: 'cheque' | 'weekends' | 'alerts' }) {
  const hi = lang === 'hi';
  const items: { id: 'cheque' | 'weekends' | 'alerts'; href: string; label: string }[] = [
    { id: 'cheque', href: toolPath(lang, 'cheque'), label: hi ? 'चेक क्लीयरिंग' : 'Cheque clearing' },
    { id: 'weekends', href: toolPath(lang, 'weekends'), label: hi ? 'लंबे सप्ताहांत' : 'Long weekends' },
    { id: 'alerts', href: toolPath(lang, 'alerts'), label: hi ? 'छुट्टी सूचना' : 'Holiday alerts' },
  ];
  return (
    <nav className="toolnav" aria-label={hi ? 'साधन' : 'Tools'}>
      {items.map((it) => (
        it.id === current
          ? <span key={it.id} aria-current="page">{it.label}</span>
          : <a key={it.id} href={it.href}>{it.label}</a>
      ))}
    </nav>
  );
}

export function ToolsHome({ lang = 'en', city }: { lang?: Lang; city: City }) {
  const hi = lang === 'hi';
  const cards = [
    {
      href: `${toolPath(lang, 'cheque')}?city=${city.slug}`,
      k: hi ? 'चेक' : 'Cheque',
      t: hi ? 'चेक क्लीयरिंग की तारीख' : 'Cheque clearing date',
      s: hi ? `${city.hi} में जमा करने पर पैसा कब आएगा, आरबीआई के वर्तमान नियमों से।` : `When a cheque deposited in ${city.name} should be credited, from current RBI rules.`,
    },
    {
      href: toolPath(lang, 'weekends', city.state),
      k: hi ? 'छुट्टी' : 'Leave',
      t: hi ? 'लंबे सप्ताहांत 2026' : 'Long weekends 2026',
      s: hi ? 'तीन दिन या उससे अधिक की छुट्टी, और एक दिन की छुट्टी लेकर चार दिन कहाँ मिलते हैं।' : 'Every 3-day break, and where taking one leave day gives you four.',
    },
    {
      href: `${toolPath(lang, 'alerts')}?city=${city.slug}`,
      k: hi ? 'सूचना' : 'Alert',
      t: hi ? 'छुट्टी से एक शाम पहले' : 'A note the evening before',
      s: hi ? `${city.hi} में बैंक बंद होने से एक शाम पहले व्हाट्सऐप पर याद दिलाएँ।` : `A WhatsApp reminder the evening before banks close in ${city.name}.`,
    },
  ];
  return (
    <section className="tools" id="tools">
      <div className="sech"><h2>{hi ? 'साधन' : 'Tools'}</h2><span>{hi ? 'औपचारिक सूची से' : 'From official lists'}</span></div>
      <div className="toolgrid">
        {cards.map((c) => (
          <a key={c.href} className="card toolcard" href={c.href}>
            <div className="k">{c.k}</div>
            <div className="tt">{c.t}<i className="go" aria-hidden="true"><IArrow /></i></div>
            <p>{c.s}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ChequeCta({ lang = 'en', city }: { lang?: Lang; city: City }) {
  const hi = lang === 'hi';
  return (
    <a className="card toolcta" href={`${toolPath(lang === 'hi' ? 'hi' : 'en', 'cheque')}?city=${city.slug}`}>
      <div>
        <div className="k">{hi ? 'चेक क्लीयरिंग' : 'Cheque clearing'}</div>
        <p>{hi ? `आज ${city.hi} में जमा किया गया चेक कब क्रेडिट होगा?` : `When will a cheque deposited today in ${city.name} be credited?`}</p>
      </div>
      <span className="lnk">{hi ? 'गणना करें' : 'Calculate'} <IArrow /></span>
    </a>
  );
}

export function WeekendCta({ lang = 'en', stateSlug, stateName }: { lang?: Lang; stateSlug: string; stateName: string }) {
  const hi = lang === 'hi';
  return (
    <a className="card toolcta" href={toolPath(lang === 'hi' ? 'hi' : 'en', 'weekends', stateSlug)}>
      <div>
        <div className="k">{hi ? 'लंबे सप्ताहांत' : 'Long weekends'}</div>
        <p>{hi ? `${stateName} में 2026 के बाकी लंबे सप्ताहांत और एक दिन की छुट्टी वाले मौके।` : `Remaining 2026 long weekends in ${stateName}, and days where one leave gives you four.`}</p>
      </div>
      <span className="lnk">{hi ? 'देखें' : 'See the list'} <IArrow /></span>
    </a>
  );
}

export function AlertsCta({ lang = 'en', city }: { lang?: Lang; city: City }) {
  const hi = lang === 'hi';
  return (
    <a className="card toolcta" href={`${toolPath(lang === 'hi' ? 'hi' : 'en', 'alerts')}?city=${city.slug}`}>
      <div>
        <div className="k">{hi ? 'छुट्टी सूचना' : 'Holiday alert'}</div>
        <p>{hi ? `${city.hi} में बैंक छुट्टी से एक शाम पहले व्हाट्सऐप संदेश पाएँ।` : `Get a WhatsApp message the evening before a bank holiday in ${city.name}.`}</p>
      </div>
      <span className="lnk">{hi ? 'जुड़ें' : 'Sign up'} <IArrow /></span>
    </a>
  );
}

export function CopyShare({ text, path, lang = 'en' }: { text: string; path: string; lang?: Lang }) {
  const hi = lang === 'hi';
  const url = abs(path);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  const id = 'copy-' + path.replace(/[^\w]+/g, '-');
  return (
    <div className="actions">
      <button type="button" className="btn sec" id={id} data-copy={url}>{hi ? 'लिंक कॉपी करें' : 'Copy link'}</button>
      <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer"><IWa />{hi ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}</a>
      <script dangerouslySetInnerHTML={{ __html: `(function(){var b=document.getElementById(${JSON.stringify(id)});if(!b)return;b.addEventListener('click',async function(){var u=b.getAttribute('data-copy')||'';try{await navigator.clipboard.writeText(u);b.textContent=${JSON.stringify(hi ? 'लिंक कॉपी हो गया' : 'Link copied')};}catch(e){window.prompt(${JSON.stringify(hi ? 'यह लिंक कॉपी करें' : 'Copy this link')},u);}});})();` }} />
    </div>
  );
}

export { toolsHome };
