import { Skeleton } from 'antd';

export const skeletonLoading = () => (<Skeleton paragraph={{ rows: 3 }} />);

export const skeletonLoadingBtn = () => <Skeleton.Button active />;
