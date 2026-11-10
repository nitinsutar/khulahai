import { LAST_CHECKED } from '@/lib/data';

export function Header({ lang = 'en', alt }: { lang?: 'en' | 'hi'; alt?: string }) {
  const hi = lang === 'hi';
  return (
    <header className="head">
      <div className="wrap">
        <a href={hi ? '/hi' : '/'} className="wordmark" aria-label="Khula Hai home"><b aria-hidden="true" />khula hai</a>
        <nav className="nav" aria-label="Main">
          <a href="/bank-holidays-2026">{hi ? 'बैंक छुट्टियाँ' : 'Bank holidays'}</a>
          <a href={hi ? '/hi/share-market' : '/nse-bse-holidays-2026'}>{hi ? 'शेयर बाज़ार' : 'NSE & BSE holidays'}</a>
          <a href="/post-office-holidays-2026">{hi ? 'डाकघर' : 'Post office'}</a>
          <a href="/bank-holiday-today">{hi ? 'आज की छुट्टी' : 'Today'}</a>
        </nav>
        <div className="hright">
          <div className="lang" role="group" aria-label="Language">
            {hi ? <a href={alt ?? '/'} hrefLang="en" lang="en">EN</a> : <span className="on" aria-current="true">EN</span>}
            {hi ? <span className="on dv" aria-current="true" lang="hi">हिं</span> : <a className="dv" href={alt ?? '/hi'} hrefLang="hi" lang="hi" aria-label="हिंदी">हिं</a>}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer({ lang = 'en' }: { lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  return (
    <footer className="foot">
      <div className="wrap">
        <nav aria-label="Footer">
          <a href="/bank-holidays-2026">Bank holidays 2026</a>
          <a href="/bank-holiday-today">Bank holiday today</a>
          <a href="/bank-holiday-tomorrow">Bank holiday tomorrow</a>
          <a href="/saturday-bank-holiday">Saturday bank holidays</a>
          <a href="/bank-holiday-this-month">This month</a>
          <a href="/sbi-holiday-list-2026">SBI holiday list 2026</a>
          <a href="/nse-bse-holidays-2026">NSE &amp; BSE holidays 2026</a>
          <a href="/post-office-holidays-2026">Post office holidays 2026</a>
          <a href="/post-office-holidays-2027">2027 lists</a>
          <a href="/hi">आज बैंक खुला है?</a>
          <a href="/about">Sources &amp; about</a>
          <a href="/privacy">Privacy</a>
        </nav>
        <p>
          {hi
            ? 'स्रोत: आरबीआई अवकाश तालिका (परक्राम्य लिखत अधिनियम), NSE और BSE परिपत्र, DoPT केंद्र सरकार अवकाश सूची। समय सामान्य हैं, आधिकारिक नहीं।'
            : 'Sources: RBI Holiday Matrix (Negotiable Instruments Act holidays), NSE & BSE trading holiday circulars, DoPT central government holiday list. Hours are typical, not official.'}{' '}
          <span className="t">{hi ? 'अंतिम जाँच' : 'Data last checked'}: {LAST_CHECKED}</span>. © 2026 khulahai.in
        </p>
      </div>
    </footer>
  );
}
