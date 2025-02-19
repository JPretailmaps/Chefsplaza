import { ShopOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { FormProduct } from '@components/product/form-product';
import { showError } from '@lib/utils';
import { productService } from '@services/product.service';
import { message } from 'antd';
import Router from 'next/router';
import { NextPageContext } from 'next/types';
import { useState } from 'react';
import { IProduct } from 'src/interfaces';
import nextCookie from 'next-cookies';

interface IProps {
  product: IProduct;
}

interface IFiles {
  fieldname: string;
  file: File;
}

function ProductUpdate({ product }: IProps) {
  const [submiting, setsubmiting] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  // eslint-disable-next-line prefer-const
  let _files: {
    image: File;
    digitalFile: File;
  } = {
    image: null,
    digitalFile: null
  };

  const onUploading = (resp: any) => {
    if (_files.image || _files.digitalFile) {
      setUploadPercentage(resp.percentage);
    }
  };

  const beforeUpload = (file: File, field: string) => {
    _files[field] = file;
  };

  const submit = async (data: any) => {
    try {
      const files = Object.keys(_files).reduce((tmpFiles, key) => {
        if (_files[key]) {
          tmpFiles.push({
            fieldname: key,
            file: _files[key] || null
          });
        }
        return tmpFiles;
      }, [] as IFiles[]) as [IFiles];

      setsubmiting(true);

      const submitData = {
        ...data
      };
      await productService.update(
        product._id,
        files,
        submitData,
        onUploading
      );
      message.success('Changes saved.');
      Router.push('/creator/my-store');
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      <SeoMetaHead pageTitle="Edit Product" />
      <div className="main-container">
        <PageHeading title="Edit Product" icon={<ShopOutlined />} />
        <FormProduct
          product={product}
          submit={submit}
          uploading={submiting}
          beforeUpload={beforeUpload}
          uploadPercentage={uploadPercentage}
        />
      </div>
    </>
  );
}

ProductUpdate.authenticate = true;

ProductUpdate.onlyPerformer = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const resp = await productService.findById(`${ctx.query.id}`, { Authorization: token });
    return {
      props: {
        product: resp.data
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default ProductUpdate;
