import { loadUIValue } from '@redux/ui/actions';
import { blockService } from '@services/index';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';

const Loader = dynamic(() => import('@components/common/base/loader'));
const PublicLayout = dynamic(() => import('./public-layout'));
const BlankLayout = dynamic(() => import('./blank-layout'));
const GEOLayout = dynamic(() => import('./geoBlocked-layout'));
const MaintenaceLayout = dynamic(() => import('./maintenance-layout'));
const PrimaryLayout = dynamic(() => import('./primary-layout'));
const HomeLayout = dynamic(() => import('./home-layout'));

declare global {
  interface Window {
    addToHomescreen: () => void;
  }
}
interface DefaultProps {
  children: any;
  layout: string;
  maintenance: boolean;
}

const LayoutMap = {
  geoBlock: GEOLayout,
  maintenance: MaintenaceLayout,
  primary: PrimaryLayout,
  public: PublicLayout,
  blank: BlankLayout,
  home: HomeLayout
};

export default function BaseLayout({ children, layout, maintenance = false }: DefaultProps) {
  const [geoBlocked, setGeoBlocked] = useState(false);
  const [routerChange, setRouterChange] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const onRouterChangComplete = () => {
    setTimeout(() => setRouterChange(false), 500);
  };

  const clientCheckBlockByIp = async () => {
    const checkBlock = await blockService.checkCountryBlock();
    if (checkBlock?.data?.blocked) {
      setGeoBlocked(true);
    }
  };

  useEffect(() => {
    dispatch(loadUIValue());
    Router.events.on('routeChangeStart', () => setRouterChange(true));
    Router.events.on('routeChangeComplete', onRouterChangComplete);
    return () => {
      Router.events.off('routeChangeStart', () => setRouterChange(true));
      Router.events.off('routeChangeComplete', onRouterChangComplete);
    };
  }, [router.pathname]);

  useEffect(() => {
    process.env.NODE_ENV === 'production' && document.addEventListener('contextmenu', (event) => event.preventDefault());
    clientCheckBlockByIp();
    isMobile && window.addToHomescreen && window.addToHomescreen();
    return () => {
      process.env.NODE_ENV === 'production' && document.removeEventListener('contextmenu', (event) => event.preventDefault());
    };
  }, []);

  // eslint-disable-next-line no-nested-ternary
  const Container = maintenance ? LayoutMap.maintenance : geoBlocked ? LayoutMap.geoBlock : layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
  return (
    <Container>
      {children}
      <Loader active={routerChange} customText="" />
    </Container>
  );
}
