import { NextRequest, NextResponse } from 'next/server';
import { validateSignup } from '@/lib/alerts';
import { alertsStoreConfigured, rateLimitOk, saveSignup } from '@/lib/alertsStore';
import { toolPath } from '@/lib/toolPaths';
import type { Lang } from '@/lib/lang';

function clientIp(req: NextRequest): string {
  const xf = req.headers.get('x-forwarded-for') || '';
  return xf.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang: Lang = form.get('lang') === 'hi' ? 'hi' : 'en';
  const path = toolPath(lang, 'alerts');
  const go = (qs: string) => NextResponse.redirect(new URL(`${path}?${qs}#form`, req.url), 303);

  if (!(await rateLimitOk(clientIp(req)))) return go('status=error&error=rate');

  const parsed = validateSignup({
    city: String(form.get('city') || ''),
    phone: String(form.get('phone') || ''),
    email: String(form.get('email') || ''),
    consent: form.get('consent') === '1' || form.get('consent') === 'on',
  });
  if (!parsed.ok) return go(`status=error&error=${parsed.error}&city=${encodeURIComponent(String(form.get('city') || ''))}`);

  const saved = await saveSignup(parsed);
  if (saved.status === 'unavailable' || !alertsStoreConfigured()) {
    return go(`status=unavailable&city=${parsed.city.slug}`);
  }
  return go(`status=${saved.status}&city=${parsed.city.slug}`);
}
