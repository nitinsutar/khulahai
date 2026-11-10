export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://khulahai.in').replace(/\/$/, '');
export const SITE_NAME = 'Khula Hai';
export const abs = (p: string) => SITE_URL + p;
export const BANK_HOURS = '10:00–16:00';
export const POST_HOURS = '10:00–17:00';
