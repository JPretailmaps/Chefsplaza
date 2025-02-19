import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { showError } from '@lib/message';
import {
  Button,
  Input,
  Select,
  Tag,
  message
} from 'antd';
import Head from 'next/head';
import { useState } from 'react';
import { IOrder } from 'src/interfaces';
import { orderService } from 'src/services';
import Router from 'next/router';
import { NextPageContext } from 'next/types';
import nextCookie from 'next-cookies';

interface IProps {
  order: IOrder;
}

function OrderDetailPage({ order }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [shippingCode, setShippingCode] = useState(order?.shippingCode || '');
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);

  const onUpdate = async () => {
    if (!shippingCode && deliveryStatus !== 'refunded') {
      message.error('Missing shipping code');
      return;
    }
    try {
      setSubmiting(true);
      await orderService.update(order._id, { deliveryStatus, shippingCode });
      message.success('Changes saved.');
      Router.push('/order');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Order Details</title>
      </Head>
      <div className="main-container">
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Orders', href: '/order' },
            {
              title: order && order.orderNumber ? `#${order.orderNumber}` : 'Order Details'
            }
          ]}
        />
        <Page>

          <div className="item-list">
            <strong>Order number</strong>
            <div>
              : #
              {order.orderNumber}
            </div>
          </div>
          <div className="item-list">
            <strong>Product name</strong>
            <div>
              :
              {' '}
              {order?.productInfo?.name || 'N/A'}
            </div>
          </div>
          <div className="item-list">
            <strong>Product description</strong>
            <div>
              :
              {' '}
              {order?.productInfo?.description || 'N/A'}
            </div>
          </div>
          <div className="item-list">
            <strong>Product type:</strong>
            <div>
              {' '}
              <Tag color="pink">{order?.productInfo?.type || 'N/A'}</Tag>
            </div>
          </div>
          <div className="item-list">
            <strong>Buyer</strong>
            <div>
              :
              {' '}
              {`${order.userInfo?.name || 'N/A'}  - @${order.userInfo?.username || 'n/a'}`}
            </div>
          </div>
          <div className="item-list">
            <strong>Seller</strong>
            <div>
              :
              {' '}
              {`${order.performerInfo?.name || 'N/A'}  - @${order.performerInfo?.username || 'n/a'}`}
            </div>
          </div>
          <div className="item-list">
            <strong>Unit price</strong>
            <div>
              :
              {' '}
              $
              {(order.unitPrice || 0).toFixed(2)}
            </div>
          </div>
          <div className="item-list">
            <strong>Quantity</strong>
            <div>
              :
              {' '}
              {order.quantity}
            </div>
          </div>
          <div className="item-list">
            <strong>Total price</strong>
            <div>
              :
              {' '}
              $
              {(order.totalPrice || 0).toFixed(2)}
            </div>
          </div>
          {order?.productInfo?.type === 'physical' ? (
            <div className="main-container">
              <div className="item-list">
                <strong>Delivery Address</strong>
                <div>
                  :
                  {' '}
                  {order?.deliveryAddress || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Shipping Code</strong>
                <div>
                  <Input
                    disabled={!['shipping', 'processing'].includes(deliveryStatus)}
                    placeholder="Enter shipping code here"
                    defaultValue={order?.shippingCode}
                    onChange={(e) => setShippingCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="item-list">
                <strong>Delivery Status</strong>
                <div>
                  <Select
                    onChange={(e) => setDeliveryStatus(e)}
                    defaultValue={order.deliveryStatus}
                    disabled={submiting || order.deliveryStatus === 'refunded'}
                  >
                    <Select.Option key="processing" value="processing" disabled>
                      Processing
                    </Select.Option>
                    <Select.Option key="shipping" value="shipping">
                      Shipping
                    </Select.Option>
                    <Select.Option key="delivered" value="delivered">
                      Delivered
                    </Select.Option>
                    <Select.Option key="refunded" value="refunded">
                      Refunded
                    </Select.Option>
                  </Select>
                </div>
              </div>
              <div className="item-list-button">
                <Button type="primary" onClick={onUpdate}>Update</Button>
                <Button danger onClick={() => Router.push('/order')} style={{ margin: '0 0 0 10px' }}>Back</Button>
              </div>
            </div>
          ) : <div className="item-list"><Tag color="success">{order.deliveryStatus}</Tag></div>}
        </Page>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);
  try {
    const resp = await orderService.findById(`${id}`, {
      Authorization: token || ''
    });
    return {
      props: {
        order: resp.data
      }
    };
  } catch (e) {
    return { notFound: true };
  }
};

export default OrderDetailPage;
