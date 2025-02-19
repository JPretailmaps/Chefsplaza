import { ShopOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { FormProduct } from '@components/product/form-product';
import { showError } from '@lib/utils';
import { productService } from '@services/product.service';
import { message } from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IPerformer } from 'src/interfaces';

interface IFiles {
  fieldname: string;
  file: File;
}

interface IProps {
  user: IPerformer;
}

function CreateProduct(props: IProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  // eslint-disable-next-line prefer-const
  let _files: {
    image: File;
    digitalFile: File;
  } = {
    image: null,
    digitalFile: null
  };

  useEffect(() => {
    const { user } = props;
    if (!user || !user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      Router.back();
    }
  }, []);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const beforeUpload = (file: File, field: string) => {
    _files[field] = file;
  };

  const submit = async (data: any) => {
    if (!_files.image) {
      message.error('Please upload a product image!');
      return;
    }
    if (data.type === 'digital' && !_files.digitalFile) {
      message.error('Please select digital file!');
      return;
    }
    if (data.type === 'physical') {
      _files.digitalFile = null;
    }

    const files = Object.keys(_files).reduce((tmpFiles, key) => {
      if (_files[key]) {
        tmpFiles.push({
          fieldname: key,
          file: _files[key] || null
        });
      }
      return tmpFiles;
    }, [] as IFiles[]) as [IFiles];

    setUploading(true);
    try {
      await productService.createProduct(
        files,
        data,
        onUploading
      );
      message.success('New product was successfully created');
      Router.push('/creator/my-store');
    } catch (e) {
      showError(e);
      setUploading(false);
    }
  };

  return (
    <>
      <SeoMetaHead pageTitle="New product" />
      <div className="main-container">
        <PageHeading title="New Product" icon={<ShopOutlined />} />
        <FormProduct
          submit={submit}
          beforeUpload={beforeUpload}
          uploading={uploading}
          uploadPercentage={uploadPercentage}
        />
      </div>
    </>
  );
}

CreateProduct.authenticate = true;
CreateProduct.onlyPerformer = true;

const mapStates = (state: any) => ({
  user: state.user.current
});
export default connect(mapStates)(CreateProduct);
