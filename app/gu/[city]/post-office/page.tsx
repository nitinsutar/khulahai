import { cityParams, cityPostMetadata, CityPostPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('gu');
export const generateMetadata = cityPostMetadata('gu');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityPostPage lang="gu" params={params} />; }
