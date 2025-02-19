import { ISettings } from '@interfaces/setting';
import {
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FloatButton } from 'antd';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import style from './primary-layout.module.scss';

const Header = dynamic(() => import('@components/common/header/header'), { ssr: false });
const ConfirmSubscriptionPerformerForm = dynamic(() => import('@components/performer/common/confirm-subscription'), { ssr: false });

interface DefaultProps {
  children: any;
}

function HomeLayout({
  children
}: DefaultProps) {
  const { stripePublishableKey, paymentGateway }: ISettings = useSelector((state: any) => state.settings);

  const MainLayout = (
    <div id="primaryLayout" className="main-layout">
      <Header />
      <div className="main-content">
        {children}
      </div>
      <ConfirmSubscriptionPerformerForm />
      <FloatButton.BackTop className={style.backTop} />
    </div>
  );

  if (paymentGateway === 'stripe' && stripePublishableKey) {
    const stripe = loadStripe(stripePublishableKey);
    return (
      <Elements stripe={stripe}>
        {MainLayout}
      </Elements>
    );
  }

  return MainLayout;
}

export default HomeLayout;
