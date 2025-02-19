import dynamic from 'next/dynamic';
import SeoMetaHead from '@components/common/seo-meta-head';
import { performerCategoryService } from '@services/perfomer-category.service';
import { IPerformerCategory } from '@interfaces/performer-category';

const ModelRegisterForm = dynamic(() => import('@components/auth/model-register-form'));

type P = {
  categories: IPerformerCategory[]
}

function ModelRegister({ categories }: P) {
  return (
    <>
      <SeoMetaHead pageTitle="Creator sign up" />
      <ModelRegisterForm categories={categories} />
    </>
  );
}

ModelRegister.layout = 'public';
ModelRegister.authenticate = false;

export const getServerSideProps = async () => {
  const resp = await performerCategoryService.search({ limit: 200 });
  return {
    props: {
      categories: resp?.data?.data || []
    }
  };
};

export default ModelRegister;
