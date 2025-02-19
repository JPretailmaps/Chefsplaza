import { IPerformer } from '@interfaces/performer';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { setSubscription } from '@redux/subscription/actions';
import style from './subscribe-buttons.module.scss';

const mapStates = (state: any) => ({
  loggedIn: state.auth.loggedIn,
  user: state.user.current
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  performer: IPerformer;
} & PropsFromRedux;

function VideoSubscribeButtons({
  performer,
  user,
  loggedIn
}: Props) {
  const dispatch = useDispatch();

  const handleSubscribe = (subscriptionType: string) => {
    dispatch(setSubscription({ showModal: true, performer, subscriptionType }));
  };

  return (
    <>
      {!performer.isSubscribed && !user.isPerformer && (
        <Button
          className={style['btn-primary']}
          type="primary"
          disabled={(!loggedIn || user.isPerformer)}
          onClick={() => handleSubscribe('monthly')}
        >
          MONTHLY SUBSCRIPTION FOR
          {' '}
          $
          {performer && performer.monthlyPrice.toFixed(2)}
        </Button>
      )}
      {!performer.isSubscribed && !user.isPerformer && (
        <Button
          type="primary"
          className={style['btn-primary']}
          disabled={(!user._id || user.isPerformer)}
          onClick={() => handleSubscribe('yearly')}
        >
          SUBSCRIBE FOR
          {' '}
          $
          {performer.yearlyPrice.toFixed(2)}
        </Button>
      )}
      {performer.isFreeSubscription && !performer.isSubscribed && !user.isPerformer && (
        <Button
          className="secondary"
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
      )}
    </>
  );
}

export default connector(VideoSubscribeButtons);
