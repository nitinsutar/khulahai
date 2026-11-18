import { CITIES, cityBySlug, type City } from '@/lib/places';
import { CONSENT_EN, CONSENT_HI } from '@/lib/alerts';
import { Crumb, Faq } from './ui';
import { ToolNav } from './tools';
import type { Lang } from '@/lib/lang';

export function AlertsView({ lang = 'en', citySlug, status, error, storeReady }: { lang?: Lang; citySlug?: string; status?: 'created' | 'updated' | 'unavailable' | 'error'; error?: string; storeReady: boolean }) {
  const hi = lang === 'hi';
  const city: City = cityBySlug(citySlug || '') ?? CITIES[0];
  const faq = hi
    ? [
        { q: 'संदेश कब आएगा?', a: 'आपके चुने शहर में बैंक बंद होने से एक शाम पहले, लगभग 7 बजे IST। अभी संदेश भेजना बंद है, जब तक व्हाट्सऐप सेवा जुड़ नहीं जाती। आपकी जानकारी तब तक सुरक्षित रखी जाती है।' },
        { q: 'क्या आप विज्ञापन भेजेंगे?', a: 'नहीं। सहमति केवल बैंक छुट्टी की सूचना के लिए है।' },
        { q: 'हटाना हो तो क्या करें?', a: 'संदेश शुरू होने पर हर संदेश में रोकने का तरीका होगा, और इस पेज पर हटाने का फॉर्म भी रहेगा। तब तक कोई संदेश नहीं जाता।' },
      ]
    : [
        { q: 'When would the message arrive?', a: 'The evening before a bank closure in the city you picked, around 7 pm IST. Sending is off until a WhatsApp service is connected. Your sign-up is stored so it can be used then.' },
        { q: 'Will you send marketing messages?', a: 'No. Consent is only for a bank holiday reminder.' },
        { q: 'How do I leave?', a: 'When sending begins, every message will include a way to stop, and this page will have a removal form. Until then, no messages are sent.' },
      ];
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { label: hi ? 'छुट्टी सूचना' : 'Holiday alerts' }]} />
        <div className="phero"><div><div className="e">{hi ? 'साधन' : 'Tools'}</div><h1>{hi ? 'छुट्टी से एक शाम पहले सूचना' : 'A message the evening before a bank holiday'}</h1></div></div>
        <ToolNav lang={lang} current="alerts" />
        <p className="lead">
          {hi
            ? 'शहर चुनें और व्हाट्सऐप नंबर दें। हम उसी शहर में बैंक बंद होने से एक शाम पहले संदेश भेजने की तैयारी करते हैं। अभी कोई संदेश नहीं भेजा जाता।'
            : 'Pick a city and a WhatsApp number. We prepare a message for the evening before banks close in that city. No messages are sent yet.'}
        </p>
        {status === 'created' || status === 'updated' ? (
          <p className="note" role="status">
            {hi
              ? 'धन्यवाद। आपका नंबर सुरक्षित रख लिया गया है। संदेश तब शुरू होंगे जब व्हाट्सऐप सेवा जुड़ेगी, और तब भी केवल आपकी सहमति वाली छुट्टी सूचना के लिए।'
              : 'Thank you. Your number has been stored securely. Messages will start only after a WhatsApp service is connected, and only for the holiday reminder you agreed to.'}
          </p>
        ) : null}
        {!storeReady && status !== 'created' && status !== 'updated' && status !== 'unavailable' ? (
          <p className="note" role="status">
            {hi ? 'अभी साइन-अप जमा नहीं हो पा रहा है, क्योंकि सुरक्षित भंडारण जुड़ा नहीं है। फॉर्म भर सकते हैं, पर बाद में फिर कोशिश करें।' : 'Sign-ups cannot be stored yet because secure storage is not connected. You can still fill the form, but please try again later.'}
          </p>
        ) : null}
        {status === 'unavailable' ? (
          <p className="note" role="status">
            {hi ? 'अभी साइन-अप जमा नहीं हो पा रहा है। कृपया बाद में कोशिश करें।' : 'Sign-ups cannot be stored just now. Please try again later.'}
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="note" role="alert">
            {error === 'phone' ? (hi ? 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर लिखें।' : 'Please enter a valid 10-digit Indian mobile number.')
              : error === 'email' ? (hi ? 'ईमेल सही नहीं है। आप इसे खाली छोड़ सकते हैं।' : 'That email does not look valid. You can leave it blank.')
              : error === 'consent' ? (hi ? 'साइन-अप से पहले सहमति चाहिए।' : 'Consent is required before we can store your number.')
              : error === 'city' ? (hi ? 'कृपया सूची में से एक शहर चुनें।' : 'Please pick a city from the list.')
              : error === 'rate' ? (hi ? 'बहुत बार कोशिश हुई। कृपया बाद में आएँ।' : 'Too many attempts. Please try again later.')
              : (hi ? 'फॉर्म पूरा करें और फिर कोशिश करें।' : 'Please complete the form and try again.')}
          </p>
        ) : null}
        <form className="card toolform" method="post" action="/api/alerts" id="form">
          <input type="hidden" name="lang" value={lang} />
          <div className="fg">
            <label htmlFor="city">{hi ? 'शहर' : 'City'}</label>
            <select id="city" name="city" defaultValue={city.slug} required>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>{hi ? c.hi : c.name}</option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label htmlFor="phone">{hi ? 'व्हाट्सऐप नंबर' : 'WhatsApp number'}</label>
            <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" required placeholder={hi ? '10 अंक, जैसे 9876543210' : '10 digits, for example 9876543210'} />
          </div>
          <div className="fg">
            <label htmlFor="email">{hi ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder={hi ? 'अगर चाहें तो' : 'If you want a copy later'} />
          </div>
          <label className="consent">
            <input type="checkbox" name="consent" value="1" required />
            <span>{hi ? CONSENT_HI : CONSENT_EN}</span>
          </label>
          <button className="btn pri" type="submit">{hi ? 'सूचना के लिए जुड़ें' : 'Sign up for alerts'}</button>
        </form>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={faq} />
      </div>
    </div>
  );
}
