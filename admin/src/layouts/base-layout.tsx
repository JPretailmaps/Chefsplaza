import dynamic from 'next/dynamic';

const PrimaryLayout = dynamic(() => import('./primary-layout'));
const PublicLayout = dynamic(() => import('./public-layout'));

interface IProps {
  children: any;
  layout?: string;
}

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout
};
function BaseLayout({ children, layout }: IProps) {
  const Container = layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
  return <Container>{children}</Container>;
}

BaseLayout.defaultProps = {
  layout: ''
};

export default BaseLayout;
