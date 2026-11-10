import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = (u.searchParams.get('t') || 'Is it open today?').slice(0, 80);
  const s = (u.searchParams.get('s') || 'Banks · Share market · Post office').slice(0, 90);
  const v = u.searchParams.get('v');
  const color = v === 'yes' ? '#0B7A45' : v === 'no' ? '#C03535' : '#1559E6';
  const bg = v === 'yes' ? '#E6F4EC' : v === 'no' ? '#FBECEC' : '#ECF2FE';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#F4F4F1', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: '#0E0F11' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#0B7A45' }} />khula hai
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 84, fontWeight: 800, color: '#0E0F11', letterSpacing: -2, lineHeight: 1.05 }}>{t}</div>
          <div style={{ display: 'flex' }}><div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 700, color, background: bg, padding: '14px 28px', borderRadius: 999 }}><div style={{ width: 16, height: 16, borderRadius: 99, background: color }} />{s}</div></div>
        </div>
        <div style={{ fontSize: 26, color: '#6B6E75' }}>Official RBI · NSE/BSE · DoPT lists · updated daily in IST</div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } }
  );
}
