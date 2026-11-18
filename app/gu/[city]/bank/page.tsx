import { cityParams, cityBankMetadata, CityBankPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('gu');
export const generateMetadata = cityBankMetadata('gu');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityBankPage lang="gu" params={params} />; }
