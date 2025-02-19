import {
  PerformerBlockCountriesForm
} from '@components/performer/management-form/block-countries-form';
import { showError } from '@lib/utils';
import { updateUserSuccess } from '@redux/user/actions';
import {
  blockService
} from '@services/index';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
  IBlockCountries,
  IPerformer
} from 'src/interfaces';

interface IProps {
  performer: IPerformer;
}

const mapStatesToProps = () => ({});

const mapDispatchToProps = {
  updateUserSuccess
};

const connector = connect(mapStatesToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function PerformerBlockCountriesList(props: IProps & PropsFromRedux) {
  const [submiting, setsubmiting] = useState(false);

  const handleUpdateBlockCountries = async (data: IBlockCountries) => {
    const { performer, updateUserSuccess: onUpdateSuccess } = props;
    try {
      setsubmiting(true);
      const resp = await blockService.blockCountries(data);
      onUpdateSuccess({ ...performer, blockCountries: resp.data });
      message.success('Changes saved');
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const {
    performer
  } = props;

  return (
    <PerformerBlockCountriesForm
      onFinish={handleUpdateBlockCountries}
      updating={submiting}
      blockCountries={performer?.blockCountries || { countryCodes: [] }}
    />
  );
}

export default connector(PerformerBlockCountriesList);
