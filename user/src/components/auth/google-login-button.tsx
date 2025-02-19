import { GoogleOutlined } from '@ant-design/icons';
import { loginSocial } from '@redux/auth/actions';
import { authService } from '@services/auth.service';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { showError } from '@lib/utils';
import { IUser } from '@interfaces/user';
import { useGoogleOneTapLogin, useGoogleLogin } from '@react-oauth/google';
import style from './google-login-button.module.scss';

interface IProps {
  googleLoginClientId: string;
}

function GoogleLoginButton({
  googleLoginClientId
}: IProps) {
  const user: IUser = useSelector((state: any) => state.user.current);

  const dipatch = useDispatch();

  const onGoogleLogin = async (resp) => {
    if (!resp.credential || user._id) {
      return;
    }
    const payload = { tokenId: resp.credential, role: 'user' };
    try {
      const response = await authService.loginGoogle(payload);
      dipatch(loginSocial({ token: response.data.token }));
    } catch (e) {
      showError(e);
    }
  };

  const onGetToken = async (response) => {
    if (!response.code) return;
    try {
      const resp = await authService.getTokenGoogle({ code: response.code });
      dipatch(loginSocial({ token: resp.data.token }));
    } catch (e) {
      showError(e);
    }
  };

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: onGetToken
  });

  useGoogleOneTapLogin({
    onError: () => message.error('Login failed!'),
    onSuccess: onGoogleLogin
  });

  if (!googleLoginClientId || !!user._id) return null;

  return (
    <Button
      onClick={() => login()}
      className={`${style['google-button']} ${style['btn-login']}`}
    >
      <div className={style['sign-in-google']}>
        <span className={style['icon-google']}>
          <GoogleOutlined />
        </span>
      &nbsp;
        <p>
          SIGN IN WITH GOOGLE
        </p>
      </div>
    </Button>
  );
}

export default GoogleLoginButton;
