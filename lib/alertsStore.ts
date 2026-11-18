import { CONSENT_VERSION } from './alerts';
import { CITIES, type City } from './places';

export type Subscription = {
  id: string;
  phone: string;
  email: string | null;
  city: string;
  consentVersion: string;
  createdAt: string;
};

function redisEnv(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function alertsStoreConfigured(): boolean {
  return redisEnv() !== null;
}

async function redis(cmd: (string | number)[]): Promise<{ result: unknown } | null> {
  const env = redisEnv();
  if (!env) return null;
  const r = await fetch(env.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`store_${r.status}`);
  return r.json() as Promise<{ result: unknown }>;
}

export async function rateLimitOk(ip: string, limit = 8, windowSec = 3600): Promise<boolean> {
  const key = `kh:alerts:rl:${ip || 'unknown'}`;
  const n = await redis(['INCR', key]);
  if (!n) return true;
  const count = Number(n.result ?? 0);
  if (count === 1) await redis(['EXPIRE', key, windowSec]);
  return count <= limit;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function saveSignup(input: { city: City; phone: string; email: string | null }): Promise<{ status: 'created' | 'updated' | 'unavailable'; id?: string }> {
  if (!alertsStoreConfigured()) return { status: 'unavailable' };
  const existing = await redis(['GET', `kh:alerts:phone:${input.phone}`]);
  const now = new Date().toISOString();
  const oldId = typeof existing?.result === 'string' && existing.result ? existing.result : null;
  const id = oldId ?? newId();
  let createdAt = now;
  if (oldId) {
    const prev = await redis(['GET', `kh:alerts:sub:${oldId}`]);
    if (typeof prev?.result === 'string' && prev.result) {
      try {
        const p = JSON.parse(prev.result) as Subscription;
        createdAt = p.createdAt || now;
        if (p.city && p.city !== input.city.slug) await redis(['SREM', `kh:alerts:city:${p.city}`, oldId]);
      } catch {
        createdAt = now;
      }
    }
  }
  const sub: Subscription = {
    id,
    phone: input.phone,
    email: input.email,
    city: input.city.slug,
    consentVersion: CONSENT_VERSION,
    createdAt,
  };
  await redis(['SET', `kh:alerts:sub:${id}`, JSON.stringify(sub)]);
  await redis(['SET', `kh:alerts:phone:${input.phone}`, id]);
  await redis(['SADD', `kh:alerts:city:${input.city.slug}`, id]);
  await redis(['SADD', 'kh:alerts:all', id]);
  return { status: oldId ? 'updated' : 'created', id };
}

export async function countForCity(citySlug: string): Promise<number | null> {
  if (!CITIES.some((c) => c.slug === citySlug)) return 0;
  const r = await redis(['SCARD', `kh:alerts:city:${citySlug}`]);
  if (!r) return null;
  return Number(r.result ?? 0);
}
