import { Header, Footer } from './chrome';
import { todayIST } from '@/lib/date';

// If a cached page was built on an earlier IST day, reload once to pick up the fresh version.
const guard = (d: string) =>
  `(function(){try{var t=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());if(t!=='${d}'){var k='kh-r-'+t+location.pathname;if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,'1');location.reload();}}}catch(e){}})();`;

export function Page({ children, lang = 'en', alt }: { children: React.ReactNode; lang?: 'en' | 'hi'; alt?: string }) {
  const d = todayIST();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: guard(d) }} />
      <a href="#main" className="sr">Skip to content</a>
      <Header lang={lang} alt={alt} />
      <main id="main" lang={lang === 'hi' ? 'hi' : undefined} data-day={d}><div className="wrap">{children}</div></main>
      <Footer lang={lang} />
    </>
  );
}
