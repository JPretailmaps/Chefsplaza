import { IPerformer } from '@interfaces/performer';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import classNames from 'classnames';
import { setSubscription } from '@redux/subscription/actions';
import { Button, message } from 'antd';
import Router from 'next/router';
import { IUser } from '@interfaces/user';
import style from './subscribe-buttons.module.scss';

type Props = {
  performer: IPerformer;
};

function SubscribeButtons({
  performer
}: Props) {
  if (!performer) return null;
  const user: IUser = useSelector((state: any) => state.user.current);
  const dispatch = useDispatch();

  const handleSubscribe = (subscriptionType: string) => {
    if (!user._id) {
      message.error('Please log in or register!');
      dispatch(setSubscription({ showModal: false, performerId: '' }));
      Router.push({
        pathname: '/auth/login',
        href: '/'
      });
      return;
    }
    dispatch(setSubscription({ showModal: true, performer, subscriptionType }));
  };

  return (
    <>
      {!performer?.isSubscribed && (
        <div className={classNames(
          style['subscription-bl']
        )}
        >
          <h5>Monthly Subscription</h5>
          <Button
            className={style['sub-btn']}
            type="primary"
            disabled={(!user._id || user.isPerformer)}
            onClick={() => handleSubscribe('monthly')}
          >
            SUBSCRIBE FOR
            {' '}
            $
            {(performer?.monthlyPrice || 0).toFixed(2)}
          </Button>
        </div>
      )}
      {!performer.isSubscribed && (
        <div className={classNames(
          style['subscription-bl']
        )}
        >
          <h5>Yearly Subscription</h5>
          <Button
            type="primary"
            className={style['sub-btn']}
            disabled={(!user._id || user.isPerformer)}
            onClick={() => handleSubscribe('yearly')}
          >
            SUBSCRIBE FOR
            {' '}
            $
            {performer.yearlyPrice.toFixed(2)}
          </Button>
        </div>
      )}
      {performer.isFreeSubscription && !performer?.isSubscribed && !performer?.usedFreeSubscription && (
        <div className={classNames(
          style['subscription-bl']
        )}
        >
          <h5>Free Subscription</h5>
          <Button
            type="primary"
            className={style['sub-btn']}
            disabled={(!user._id || user.isPerformer)}
            onClick={() => handleSubscribe('free')}
          >
            SUBSCRIBE FOR FREE FOR
            {' '}
            {performer.durationFreeSubscriptionDays || 1}
            {' '}
            {performer.durationFreeSubscriptionDays > 1 ? 'DAYS' : 'DAY'}
            {/* {settings.paymentGateway === 'stripe' && ` THEN ${performer.monthlyPrice.toFixed(2)} PER MONTH`} */}
          </Button>
        </div>
      )}
    </>
  );
}

export default SubscribeButtons;
