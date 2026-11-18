import { Page } from '@/components/page';
import { Crumb } from '@/components/ui';
import { meta } from '@/lib/meta';
export const metadata = meta({ title: 'Privacy | Khula Hai', description: 'Khula Hai privacy policy: no accounts, no tracking cookies. Holiday alert sign-ups store a WhatsApp number only with consent.', path: '/privacy' });
export default function P() {
  return (
    <Page>
      <div className="layout narrow"><div>
        <Crumb items={[{ href: '/', label: 'Home' }, { label: 'Privacy' }]} />
        <div className="phero"><div><div className="e">Privacy</div><h1>Privacy policy</h1></div></div>
        <div className="card prose">
          <p>Khula Hai has no accounts and sets no tracking cookies. We do not sell or share personal data.</p>
          <h2>Your city</h2>
          <p>On the homepage, our host (Vercel) tells us the approximate city of your IP address so we can show your city first. We do not store it. You can always pick a city yourself.</p>
          <h2>Holiday alerts</h2>
          <p>If you sign up for a holiday alert, we store the WhatsApp number you give us, the city you pick, the consent text you agreed to, and an email address only if you provide one. This is used solely to send a reminder the evening before a bank holiday in that city. We do not send marketing messages. Sending is switched off until a WhatsApp service is connected. Until sending begins, the number is only stored. When sending begins, each message will include a way to stop, and this page will carry a removal form.</p>
          <h2>Server logs</h2>
          <p>Our hosting provider keeps standard, short-lived request logs (such as IP address and page requested) for security and reliability.</p>
          <h2>Ads</h2>
          <p>The site does not show ads today. If that changes, this page will be updated first.</p>
          <p className="t">Last updated: 18 November 2026.</p>
        </div>
      </div></div>
    </Page>
  );
}
