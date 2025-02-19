import { useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { logout } from '@redux/auth/actions';
import Page from '@components/common/layout/page';

interface IProps {
  logout: Function;
}

function Logout({ logout: handleLogout }: IProps) {
  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <>
      <Head>
        <title>Log out</title>
      </Head>
      <Page>
        <span>Logout...</span>
      </Page>
    </>
  );
}

Logout.noAuthenticate = true;

const mapStates = (state: any) => ({

});
export default connect(mapStates, { logout })(Logout);
