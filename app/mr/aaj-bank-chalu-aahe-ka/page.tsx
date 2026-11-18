import { TodayPage, todayGenerateMetadata } from '@/lib/localeRoutes';
export const revalidate = 300;
export const generateMetadata = todayGenerateMetadata('mr');
export default function P() { return <TodayPage lang="mr" />; }
