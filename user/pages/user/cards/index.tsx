import { CreditCardOutlined } from '@ant-design/icons';
import { PaymentCard, StripeCardForm } from '@components/payment';
import { showError } from '@lib/utils';
import { paymentService } from '@services/index';
import {
  Divider,
  message, Spin
} from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  IPaymentCard,
  ISettings,
  IUIConfig
} from 'src/interfaces';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import style from './style.module.scss';

interface IProps {
  ui: IUIConfig;
  settings: ISettings;
}

function CardsPage({ ui, settings }: IProps) {
  const [cards, setCards] = useState<IPaymentCard[]>([]);
  const [fetching, setFetching] = useState(false);
  const [submiting, setsubmiting] = useState(false);

  const getCards = async () => {
    try {
      setFetching(true);
      const resp = await paymentService.getCards({
        paymentGateway: settings.paymentGateway,
        limit: 10
      });
      setCards(resp.data.data);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const handleAddCard = async (payload: any) => {
    if (cards.length >= 10) {
      message.error('Cannot add more than 10 cards');
      return;
    }
    try {
      setsubmiting(true);
      await paymentService.addCard(settings.paymentGateway, payload);
      message.success('Payment card added successfully');
      getCards();
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <>
      <SeoMetaHead pageTitle="My Payment Cards" />
      <div className="main-container">
        <PageHeading title="My Payment Cards" icon={<CreditCardOutlined />} />
        {!fetching && cards.length < 10 && (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {settings.paymentGateway === 'stripe' && settings.stripePublishableKey && (
              <>
                <div className={style['card-form']}>
                  <StripeCardForm submit={handleAddCard} submiting={submiting} />
                </div>
                <Divider>You can add up to 10 cards.</Divider>
              </>
            )}
          </>
        )}
        <div className={style['card-list']}>
          {!fetching && cards.length > 0 && cards.map((card) => (
            <PaymentCard key={card._id} card={card} onRemove={() => getCards()} />
          ))}
          {fetching && <div className="text-center" style={{ margin: 30 }}><Spin /></div>}
          {!fetching && !cards.length && (
            <p>
              No payment card found, please add a new one
            </p>
          )}
        </div>
      </div>
    </>
  );
}

CardsPage.authenticate = true;

const mapState = (state: any) => ({
  ui: state.ui,
  settings: state.settings
});
const mapDispatch = {};
export default connect(mapState, mapDispatch)(CardsPage);
