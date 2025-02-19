import {
  EditOutlined, PlusOutlined, ShoppingCartOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { ShippingAddressForm } from '@components/product/shipping-address-form';
import { showError } from '@lib/utils';
import {
  Button, Descriptions, Divider, message, Modal,
  Select, Tag
} from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { COUNTRIES } from 'src/constants/countries';
import {
  IAddress,
  IOrder
} from 'src/interfaces';
import { orderService, shippingAddressService } from 'src/services';
import nextCookie from 'next-cookies';
import classNames from 'classnames';
import style from './my-order.module.scss';

const { Item } = Descriptions;

interface IProps {
  order: IOrder;
}

function OrderDetailPage({ order }: IProps) {
  const [addresses, setAddresses] = useState<IAddress[]>();
  const [onEditAddress, setOnEditAddress] = useState(false);
  const [submiting, setsubmiting] = useState(false);
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);

  const getAddresses = async () => {
    const resp = await shippingAddressService.search({ limit: 10 });
    setAddresses(resp?.data?.data || []);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const downloadFile = async () => {
    try {
      const resp = await orderService.getDownloadLinkDigital(order.productId);
      window.open(resp?.data?.downloadLink, '_blank');
    } catch (e) {
      showError(e);
    }
  };

  const onUpdateDeliveryAddress = async (deliveryAddressId: string) => {
    try {
      await orderService.updateDeliveryAddress(order._id, { deliveryAddressId });
      message.success('Updated delivery address successfully!');
      Router.replace(Router.asPath, undefined, { shallow: false });
    } catch (e) {
      showError(e);
    } finally {
      setOnEditAddress(false);
    }
  };

  const addNewAddress = async (payload: any) => {
    try {
      setsubmiting(true);
      const country = COUNTRIES.find((c) => c.code === payload.country);
      const data = { ...payload, country: country.name };
      const resp = await shippingAddressService.create(data);
      setAddresses([...[resp.data], ...addresses]);
    } catch (e) {
      showError(e);
    } finally {
      setOpenAddAddressModal(false);
      setsubmiting(false);
    }
  };

  const onRemoveAddress = (addressId: string) => {
    setAddresses((items) => items.filter((i) => i._id !== addressId));
  };

  return (
    <>
      <SeoMetaHead pageTitle={`Order #${order?.orderNumber}`} />

      <div className="main-container">
        <PageHeading title={`#${order?.orderNumber}`} icon={<ShoppingCartOutlined />} />
        <div className={classNames(
          style['my-order-detail']
        )}
        >
          <Descriptions>
            <Item key="seller" label="Creator">
              {order?.performerInfo?.name || order?.performerInfo?.username || 'N/A'}
            </Item>
            <Item key="name" label="Product">
              {order?.productInfo?.name || 'N/A'}
            </Item>
            <Item key="description" label="Description">
              {order?.productInfo?.description || 'N/A'}
            </Item>
            <Item key="unitPrice" label="Unit price">
              $
              {(order?.unitPrice || 0).toFixed(2)}
            </Item>
            <Item key="quantiy" label="Quantity">
              {order?.quantity || '0'}
            </Item>
            <Item key="totalPrice" label="Total Price">
              $
              {(order?.totalPrice || 0).toFixed(2)}
            </Item>
          </Descriptions>
          {order?.productInfo?.type === 'digital' ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {order?.deliveryStatus === 'delivered' ? (
                <div style={{ marginBottom: '10px' }}>
                  Download Link:
                  {' '}
                  <a aria-hidden onClick={() => downloadFile()}>Click to download</a>
                </div>
              ) : (
                <div style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                  Delivery Status:
                  {' '}
                  <Tag color="green">{order?.deliveryStatus || 'N/A'}</Tag>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '0' }}>Delivery information</h3>
              <Descriptions>
                <Item key="seller" label="Delivery Address">
                  {!onEditAddress ? order?.deliveryAddress : (
                    <Select
                      style={{ minWidth: 250 }}
                      defaultValue={order?.deliveryAddressId}
                      onChange={(id) => onUpdateDeliveryAddress(id)}
                    >
                      {addresses.map((a: IAddress) => (
                        <Select.Option value={a._id} key={a._id}>
                          <div style={{ position: 'relative', paddingRight: 30 }}>
                            {a.name}
                            {' '}
                            -
                            {' '}
                            <small>{`${a.streetNumber || ''} ${a.streetAddress || ''}, ${a.ward || ''}, ${a.district || ''}, ${a.city || ''}, ${a.state || ''} (${a.zipCode || ''}), ${a.country}`}</small>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  &nbsp;&nbsp;
                  {order?.deliveryStatus === 'processing' && (
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {!onEditAddress ? (
                      <a aria-hidden onClick={() => setOnEditAddress(true)}>
                        <EditOutlined />
                        {' '}
                        Change
                      </a>
                    ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                      <>
                        {addresses.length < 10 && (
                        <a aria-hidden onClick={() => setOpenAddAddressModal(true)}>
                          <PlusOutlined />
                          {' '}
                          Add New Address
                        </a>
                        )}
                      </>
                    )}
                  </>
                  )}
                </Item>
              </Descriptions>
              <Descriptions>
                <Item key="seller" label="Phone Number">
                  {order?.phoneNumber || 'N/A'}
                </Item>
                <Item key="seller" label="Shipping Code">
                  <Tag style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '205px',
                    whiteSpace: 'normal',
                    border: 'none',
                    color: '#1ea2f1',
                    verticalAlign: 'middle'
                  }}
                  >
                    {order?.shippingCode || 'N/A'}
                  </Tag>
                </Item>
                <Item key="seller" label="Delivery Status">
                  <Tag color="green">{order?.deliveryStatus || 'N/A'}</Tag>
                </Item>
              </Descriptions>
            </>
          )}
        </div>
      </div>
      <div className="text-center" style={{ margin: '20px 0' }}>
        <Button className="primary" onClick={() => Router.back()}>
          Back
        </Button>
      </div>
      {openAddAddressModal && (
      <Modal
        key="add-new-address"
        width={660}
        title={null}
        open={openAddAddressModal}
        onOk={() => setOpenAddAddressModal(false)}
        footer={null}
        onCancel={() => setOpenAddAddressModal(false)}
        destroyOnClose
        centered
      >
        <ShippingAddressForm
          addresses={addresses}
          onRemoveAddress={onRemoveAddress}
          onCancel={() => setOpenAddAddressModal(false)}
          submiting={submiting}
          onFinish={addNewAddress}
        />
      </Modal>
      )}
    </>
  );
}

OrderDetailPage.authenticate = true;

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = nextCookie(ctx);
    const resp = await orderService.findById(`${ctx.query.id}`, {
      Authorization: token || ''
    });
    return { props: { order: resp.data } };
  } catch {
    return { notFound: true };
  }
};

export default OrderDetailPage;
