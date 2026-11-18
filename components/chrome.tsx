import { LAST_CHECKED } from '@/lib/data';
import type { Alt, Lang } from '@/lib/lang';
import { HTML_LANG, LANG_TAG, TODAY_PATH } from '@/lib/lang';
import { t } from '@/lib/copy';

export function Header({ lang = 'en', alt, alts }: { lang?: Lang; alt?: string; alts?: Alt[] }) {
  const home = lang === 'en' ? '/' : lang === 'hi' ? '/hi' : TODAY_PATH[lang];
  const switchAlts = alts && alts.length ? alts : null;
  return (
    <header className="head">
      <div className="wrap">
        <a href={home} className="wordmark" aria-label="Khula Hai home"><b aria-hidden="true" />khula hai</a>
        <nav className="nav" aria-label="Main">
          <a href="/bank-holidays-2026">{lang === 'hi' ? 'बैंक छुट्टियाँ' : lang === 'mr' ? 'बँक सुट्ट्या' : lang === 'gu' ? 'બેંક રજાઓ' : lang === 'bn' ? 'ব্যাংক ছুটি' : 'Bank holidays'}</a>
          <a href={lang === 'hi' ? '/hi/share-market' : '/nse-bse-holidays-2026'}>{lang === 'hi' ? 'शेयर बाज़ार' : 'NSE & BSE holidays'}</a>
          <a href="/post-office-holidays-2026">{t(lang, 'postOffice')}</a>
          <a href={TODAY_PATH[lang]}>{lang === 'hi' ? 'आज की छुट्टी' : lang === 'en' ? 'Today' : t(lang, 'today')}</a>
        </nav>
        <div className="hright">
          <div className="lang" role="group" aria-label="Language">
            {switchAlts ? switchAlts.map((a) => (
              a.lang === lang
                ? <span key={a.lang} className={a.lang === 'en' ? 'on' : 'on dv'} aria-current="true" lang={HTML_LANG[a.lang]}>{LANG_TAG[a.lang]}</span>
                : <a key={a.lang} className={a.lang === 'en' ? undefined : 'dv'} href={a.href} hrefLang={HTML_LANG[a.lang]} lang={HTML_LANG[a.lang]}>{LANG_TAG[a.lang]}</a>
            )) : (
              <>
                {lang === 'en' ? <span className="on" aria-current="true">EN</span> : <a href={alt ?? '/'} hrefLang="en" lang="en">EN</a>}
                {lang === 'hi' ? <span className="on dv" aria-current="true" lang="hi">हिं</span> : <a className="dv" href={alt ?? '/hi'} hrefLang="hi" lang="hi" aria-label="हिंदी">हिं</a>}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer({ lang = 'en' }: { lang?: Lang }) {
  const hi = lang === 'hi';
  return (
    <footer className="foot">
      <div className="wrap">
        <nav aria-label="Footer">
          <a href="/bank-holidays-2026">Bank holidays 2026</a>
          <a href="/bank-holiday-today">Bank holiday today</a>
          <a href="/bank-holiday-tomorrow">Bank holiday tomorrow</a>
          <a href="/saturday-bank-holiday">Saturday bank holidays</a>
          <a href="/bank-holidays/november-2026">November 2026</a>
          <a href="/is-bank-open-on-guru-nanak-jayanti-2026">Guru Nanak Jayanti 2026</a>
          <a href="/is-share-market-open-today">Share market today</a>
          <a href="/is-post-office-open-today">Post office today</a>
          <a href="/sbi-holiday-list-2026">SBI holiday list 2026</a>
          <a href="/nse-bse-holidays-2026">NSE &amp; BSE holidays 2026</a>
          <a href="/post-office-holidays-2026">Post office holidays 2026</a>
          <a href="/post-office-holidays-2027">2027 lists</a>
          <a href="/hi/aaj-bank-khula-hai">आज बैंक खुला है?</a>
          <a href="/mr/aaj-bank-chalu-aahe-ka">आज बँक चालू आहे का?</a>
          <a href="/gu/aaje-bank-khulli-chhe">આજે બેંક ખુલ્લી છે?</a>
          <a href="/bn/ajk-ki-bank-khola-thakbe">আজকে কি ব্যাংক খোলা থাকবে?</a>
          <a href="/about">Sources &amp; about</a>
          <a href="/privacy">Privacy</a>
        </nav>
        <p>
          {hi
            ? 'स्रोत: आरबीआई अवकाश तालिका (परक्राम्य लिखत अधिनियम), NSE, BSE और MCX परिपत्र, भारत डाक अवकाश सूची। समय सामान्य हैं, आधिकारिक नहीं।'
            : lang === 'mr'
              ? 'स्रोत: आरबीआई सुट्टी यादी, NSE, BSE आणि इंडिया पोस्ट सुट्टी यादी. वेळ सामान्य आहे, अधिकृत नाही.'
              : lang === 'gu'
                ? 'સ્રોત: આરબીઆઈ રજા યાદી, NSE, BSE અને ઇન્ડિયા પોસ્ટ રજા યાદી. સમય સામાન્ય છે, સત્તાવાર નથી.'
                : lang === 'bn'
                  ? 'সূত্র: আরবিআই ছুটির তালিকা, NSE, BSE এবং ইন্ডিয়া পোস্ট ছুটির তালিকা। সময় সাধারণ, সরকারি নয়।'
                  : 'Sources: RBI Holiday Matrix (Negotiable Instruments Act holidays), NSE, BSE & MCX holiday circulars, India Post holidays list. Hours are typical, not official.'}{' '}
          <span className="t">{hi ? 'अंतिम जाँच' : lang === 'en' ? 'Data last checked' : t(lang, 'lastChecked')}: {LAST_CHECKED}</span>. © 2026 khulahai.in
        </p>
      </div>
    </footer>
  );
}
