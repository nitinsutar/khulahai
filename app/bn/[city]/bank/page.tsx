import { cityParams, cityBankMetadata, CityBankPage } from '@/lib/localeRoutes';
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = cityParams('bn');
export const generateMetadata = cityBankMetadata('bn');
export default function P({ params }: { params: Promise<{ city: string }> }) { return <CityBankPage lang="bn" params={params} />; }
