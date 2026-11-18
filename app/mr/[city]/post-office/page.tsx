import { cityParams, cityPostMetadata, CityPostPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('mr');
export const generateMetadata = cityPostMetadata('mr');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityPostPage lang="mr" params={params} />; }
