import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

const dir = join(process.cwd(), 'assets');
let assets: Promise<{ fonts: { name: string; data: Buffer; weight: 500 | 700 | 800; style: 'normal' }[]; mark: string }> | null = null;
function load() {
  if (!assets) {
    assets = (async () => {
      const [jm, jx, mm, mx, gu, bn, svg] = await Promise.all([
        readFile(join(dir, 'og-fonts/PlusJakartaSans-Medium.ttf')),
        readFile(join(dir, 'og-fonts/PlusJakartaSans-ExtraBold.ttf')),
        readFile(join(dir, 'og-fonts/Mukta-Medium.ttf')),
        readFile(join(dir, 'og-fonts/Mukta-ExtraBold.ttf')),
        readFile(join(dir, 'og-fonts/NotoSansGujarati-Bold.ttf')),
        readFile(join(dir, 'og-fonts/NotoSansBengali-Bold.ttf')),
        readFile(join(dir, 'og-mark.svg')),
      ]);
      return {
        fonts: [
          { name: 'Jakarta', data: jm, weight: 500, style: 'normal' },
          { name: 'Jakarta', data: jx, weight: 800, style: 'normal' },
          { name: 'Mukta', data: mm, weight: 500, style: 'normal' },
          { name: 'Mukta', data: mx, weight: 800, style: 'normal' },
          { name: 'NotoGu', data: gu, weight: 700, style: 'normal' },
          { name: 'NotoBn', data: bn, weight: 700, style: 'normal' },
        ],
        mark: `data:image/svg+xml;base64,${svg.toString('base64')}`,
      };
    })();
  }
  return assets;
}

const DEV = /[\u0900-\u097F]/;
const GU = /[\u0A80-\u0AFF]/;
const BN = /[\u0980-\u09FF]/;
const family = (x: string) => (GU.test(x) ? 'NotoGu, Jakarta' : BN.test(x) ? 'NotoBn, Jakarta' : DEV.test(x) ? 'Mukta, Jakarta' : 'Jakarta, Mukta');

export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = (u.searchParams.get('t') || 'Is it open today?').slice(0, 80);
  const s = (u.searchParams.get('s') || 'Banks · Share market · Post office').slice(0, 90);
  const v = u.searchParams.get('v');
  const color = v === 'yes' ? '#0B7A45' : v === 'no' ? '#C03535' : '#1559E6';
  const bg = v === 'yes' ? '#E6F4EC' : v === 'no' ? '#FBECEC' : '#ECF2FE';
  const IND = /[\u0900-\u09FF\u0A80-\u0AFF]/;
  const hiT = IND.test(t);
  const hiS = IND.test(s);
  const titleFont = family(t);
  const subFont = family(s);
  const n = t.length;
  const size = n <= 22 ? 96 : n <= 34 ? 84 : n <= 50 ? 72 : 60;
  const { fonts, mark } = await load();

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#F4F4F1', fontFamily: 'Jakarta, Mukta', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: '#0B7A45', display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 80px 60px 88px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mark} width={64} height={64} alt="" />
              <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, color: '#0E0F11', letterSpacing: -1 }}>khula hai</div>
            </div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 500, color: '#6B6E75' }}>khulahai.in</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <div style={{ display: 'flex', fontFamily: titleFont, fontSize: size, fontWeight: 800, color: '#0E0F11', letterSpacing: hiT ? 0 : -1.5, lineHeight: hiT ? 1.2 : 1.06, maxWidth: 1000 }}>{t}</div>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: subFont, fontSize: 36, fontWeight: 800, color, background: bg, padding: hiS ? '12px 30px 8px' : '14px 30px', borderRadius: 999 }}>
                <div style={{ width: 16, height: 16, borderRadius: 99, background: color, display: 'flex' }} />
                {s}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 500, color: '#6B6E75' }}>Official RBI · NSE/BSE · DoPT lists · updated daily in IST</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } }
  );
}
