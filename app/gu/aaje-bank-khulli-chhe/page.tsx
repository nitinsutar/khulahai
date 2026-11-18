import { TodayPage, todayGenerateMetadata } from '@/lib/localeRoutes';
export const revalidate = 300;
export const generateMetadata = todayGenerateMetadata('gu');
export default function P() { return <TodayPage lang="gu" />; }
