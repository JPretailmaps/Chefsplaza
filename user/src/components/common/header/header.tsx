import { updateBalance } from '@redux/user/actions';
import { Event } from 'src/socket';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { IUser } from '@interfaces/user';
import style from './header.module.scss';

const MiddleMenu = dynamic(() => import('./middle-menu'));

function Header() {
  const user: IUser = useSelector((state: any) => state.user.current);
  const dispatch = useDispatch();

  const handleUpdateBalance = (event) => {
    if (user.isPerformer) {
      dispatch(updateBalance({ token: event.token }));
    }
  };

  const handlePaymentStatusCallback = ({ redirectUrl }) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <>
      <Event
        event="update_balance"
        handler={handleUpdateBalance}
      />
      <Event
        event="payment_status_callback"
        handler={handlePaymentStatusCallback}
      />
      <div
        className={style['main-header']}
        id="layoutHeader"
      >
        <div className="main-container">
          <MiddleMenu />
        </div>
      </div>
    </>
  );
}

export default Header;
