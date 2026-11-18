import { redirect } from 'next/navigation';
import { TODAY_PATH } from '@/lib/lang';
export default function P() { redirect(TODAY_PATH['bn']); }
