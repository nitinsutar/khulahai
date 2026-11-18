import { cityParams, cityPostMetadata, CityPostPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('bn');
export const generateMetadata = cityPostMetadata('bn');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityPostPage lang="bn" params={params} />; }
