import { ShoppingCartOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { showError } from '@lib/utils';
import {
  Alert, Button, Descriptions, Input, message, Select, Tag
} from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { IOrder } from 'src/interfaces';
import { orderService } from 'src/services';
import nextCookie from 'next-cookies';
import classNames from 'classnames';
import style from './my-order.module.scss';

const { Item } = Descriptions;
interface IProps {
  order: IOrder;
}

function getTagColor(deliveryStatus) {
  let color = '';
  switch (deliveryStatus) {
    case 'created':
      color = 'gray';
      break;
    case 'processing':
      color = '#FFCF00';
      break;
    case 'shipping':
      color = '#00dcff';
      break;
    case 'delivered':
      color = '#00c12c';
      break;
    case 'refunded':
      color = 'red';
      break;
    default:
      break;
  }
  return color;
}
function OrderDetailPage({ order }: IProps) {
  const [submiting, setsubmiting] = useState(false);
  const [shippingCode, setShippingCode] = useState(order.shippingCode);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);

  const onUpdate = async () => {
    if (!shippingCode && deliveryStatus !== 'refunded') {
      message.error('Missing shipping code!');
      return;
    }
    try {
      setsubmiting(true);
      await orderService.update(order._id, { deliveryStatus, shippingCode });
      message.success('Changes saved.');
      Router.back();
    } catch (e) {
      showError(e);
      setsubmiting(false);
    }
  };

  useEffect(() => {
    setShippingCode(order.shippingCode);
    setDeliveryStatus(order.deliveryStatus);
  }, [order]);

  return (
    <>
      <SeoMetaHead pageTitle={`Order #${order.orderNumber || ''}`} />
      <div className="main-container">
        <PageHeading title={`#${order.orderNumber || ''}`} icon={<ShoppingCartOutlined />} />
        <div className={classNames(
          style['my-order-detail']
        )}
        >
          <Descriptions>
            <Item key="name" label="Product">
              {order?.productInfo?.name || 'N/A'}
            </Item>
            <Item key="description" label="Description">
              {order?.productInfo?.name || 'N/A'}
            </Item>
            <Item key="productType" label="Product type">
              <Tag color="orange" style={{ textTransform: 'capitalize' }}>{order?.productInfo?.type || 'N/A'}</Tag>
            </Item>
            <Item key="unitPrice" label="Unit price">
              $
              {order.unitPrice}
            </Item>
            <Item key="quantiy" label="Quantity">
              {order.quantity || '0'}
            </Item>
            <Item key="originalPrice" label="Total Price">
              $
              {order.totalPrice}
            </Item>
          </Descriptions>
          {order?.productInfo?.type === 'physical'
            ? (
              <>
                <Descriptions>
                  <Item key="name" label="Delivery Address">
                    {order.deliveryAddress || 'N/A'}
                  </Item>
                </Descriptions>
                <Descriptions>
                  <Item key="name" label="Phone Number">
                    {order.phoneNumber || 'N/A'}
                  </Item>
                </Descriptions>
                <Alert type="warning" message="Update shipping code & delivery status below!" />
                <Descriptions>
                  <Item key="name" label="Shipping Code">
                    <Input
                      disabled={['delivered', 'refunded'].includes(deliveryStatus)}
                      placeholder="Enter shipping code here"
                      defaultValue={order.shippingCode}
                      onChange={(e) => setShippingCode(e.target.value)}
                      style={{ width: '250px' }}
                    />
                  </Item>
                </Descriptions>
                <Descriptions>
                  <Item key="name" label="Delivery Status">
                    <Select
                      onChange={(e) => setDeliveryStatus(e)}
                      defaultValue={order.deliveryStatus}
                      disabled={submiting || order.deliveryStatus === 'refunded'}
                      style={{ minWidth: '250px' }}
                    >
                      <Select.Option key="processing" value="processing">
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
                  </Item>
                </Descriptions>
                <div style={{ marginBottom: '10px' }}>
                  <Button
                    className="primary"
                    onClick={() => onUpdate()}
                    loading={submiting}
                    disabled={submiting}
                    style={{ marginRight: '5px' }}
                  >
                    Update
                  </Button>
                </div>
              </>
            ) : (
              <div className={style['my-order-tags']}>
                Delivery Status:
                {' '}
                <Tag color={
                  getTagColor(order.deliveryStatus)
                }
                >
                  {order.deliveryStatus}
                </Tag>
              </div>
            )}
        </div>
        <div className="text-center">
          <Button className="primary" onClick={() => Router.push('/creator/my-order')}>Back</Button>
        </div>
      </div>
    </>
  );
}

OrderDetailPage.authenticate = true;

OrderDetailPage.onlyPerformer = true;

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = nextCookie(ctx);
    const resp = await orderService.findById(`${ctx.query.id}`, {
      Authorization: token || ''
    });
    return { props: { order: resp.data } };
  } catch (e) {
    return { notFound: true };
  }
};

export default OrderDetailPage;
