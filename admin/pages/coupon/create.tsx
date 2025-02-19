import Head from 'next/head';
import { useState } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { couponService } from '@services/coupon.service';
import { FormCoupon } from '@components/coupon/form-coupon';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

function CouponCreate() {
  const [submitting, setSubmitting] = useState(false);

  const submit = async (data: any) => {
    try {
      setSubmitting(true);
      const submitData = {
        ...data,
        value: data.value
      };
      await couponService.create(submitData);
      message.success('Created successfully');
      Router.push('/coupon');
    } catch (e) {
      // TODO - check and show error here
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'Something went wrong, please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create new coupon</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Coupons', href: '/coupon' }, { title: 'Create new coupon' }]} />
      <Page>
        <FormCoupon onFinish={submit} submitting={submitting} />
      </Page>
    </>
  );
}

export default CouponCreate;
