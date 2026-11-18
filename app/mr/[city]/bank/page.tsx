import { cityParams, cityBankMetadata, CityBankPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('mr');
export const generateMetadata = cityBankMetadata('mr');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityBankPage lang="mr" params={params} />; }
