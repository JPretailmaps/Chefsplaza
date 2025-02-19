import Head from 'next/head';
import { useEffect, useState } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { couponService } from '@services/coupon.service';
import { ICouponUpdate } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormCoupon } from '@components/coupon/form-coupon';

interface IProps {
  id: string;
}
function CouponUpdate(props: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [coupon, setCoupon] = useState({} as ICouponUpdate);

  const findByIdOrCode = async () => {
    const { id } = props;
    try {
      setFetching(true);
      const resp = await couponService.findByIdOrCode(id);
      setCoupon(resp.data);
    } catch (e) {
      message.error('Coupon not found!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    findByIdOrCode();
  }, []);

  const submit = async (data: any) => {
    const { id } = props;
    try {
      setSubmitting(true);
      const submitData = {
        ...data
      };
      await couponService.update(id, submitData);
      message.success('Updated successfully');
    } catch (e) {
      // TODO - check and show error here
      message.error('Something went wrong, please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Update Coupon</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[{ title: 'Coupon', href: '/coupon' }, { title: coupon.name ? coupon.name : 'Detail coupon' }]}
      />
      <Page>
        {fetching ? (
          <Loader />
        ) : (
          <FormCoupon coupon={coupon} onFinish={submit} submitting={submitting} />
        )}
      </Page>
    </>
  );
}

CouponUpdate.getInitialProps = async (ctx) => ctx.query;

export default CouponUpdate;
