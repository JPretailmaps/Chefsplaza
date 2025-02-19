import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { blockCountryService } from '@services/index';
import {
  Input, Layout, Spin, Switch, Table, message
} from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { COUNTRIES } from 'src/constants';

function BlockCountries() {
  const [searching, setSearching] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [countries, setCountries] = useState(COUNTRIES);
  const [blockCountries, setBlockCountries] = useState([] as any);

  const handleFilterCountry = (q) => {
    setCountries(COUNTRIES.filter((c) => {
      const regex = new RegExp(q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
      return regex.test(c.name);
    }));
  };

  const handleChange = (value: boolean, countryCode: string) => {
    if (value) {
      try {
        setSubmiting(true);
        blockCountryService.create(countryCode).then((resp) => {
          if (resp?.data) {
            const newBlock = blockCountries.concat(resp?.data);
            setBlockCountries(newBlock);
          }
        });
      } catch (error) {
        message.error('error');
      } finally {
        setSubmiting(false);
      }
    }
    if (!value) {
      try {
        setSubmiting(true);
        blockCountryService.delete(countryCode);
        const newBlock = blockCountries.filter((item) => item.countryCode !== countryCode);
        setBlockCountries(newBlock);
      } catch (error) {
        message.error('error');
      } finally {
        setSubmiting(false);
      }
    }
  };

  const searchCountry = async () => {
    try {
      setSearching(true);
      const [respBlockCountries] = await Promise.all([
        blockCountryService.search()
      ]);
      setSearching(false);
      setBlockCountries(respBlockCountries?.data);
    } catch (e) {
      message.error('An error occurred, please try again!');
      setSearching(false);
    }
  };

  useEffect(() => {
    searchCountry();
  }, []);

  const columns = [
    {
      title: 'Country',
      key: 'name',
      render: (record) => (
        <span>
          <img src={record.flag} width="50px" alt="flag" />
          &nbsp;
          {record.name}
        </span>
      )
    },
    {
      title: 'Country Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Block',
      dataIndex: 'code',
      key: 'check',
      render: (code) => (
        <Switch
          disabled={submiting}
          checked={!!(blockCountries.length > 0 && blockCountries.find((c) => c.countryCode === code))}
          onChange={(val) => handleChange(val, code)}
        />
      )
    }
  ];

  return (
    <>
      <Head>
        <title>Block Countries</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Block Countries' }]} />
      <Page>
        <Input.Search placeholder="Type to search country here" enterButton="Search" onSearch={handleFilterCountry} />
        <div style={{ margin: '15px 0' }}>
          {searching && <div className="text-center" style={{ margin: '20px' }}><Spin /></div>}
          {countries && countries.length > 0 && (
            <div className="table-responsive">
              <Table
                pagination={false}
                dataSource={countries.map((c) => ({ ...c, key: c.code }))}
                columns={columns}
              />
            </div>
          )}
        </div>
      </Page>
    </>
  );
}

export default BlockCountries;
