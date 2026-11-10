import { Page } from '@/components/page';
export default function NotFound() {
  return <Page><div className="card prose" style={{ marginTop: 20 }}><h2>Page not found</h2><p>Try <a href="/">today’s status</a> or <a href="/bank-holidays-2026">bank holidays 2026</a>.</p></div></Page>;
}
