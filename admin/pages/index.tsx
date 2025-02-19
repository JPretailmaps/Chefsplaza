import Head from 'next/head';
import {
  Row, Col, Statistic, Card
} from 'antd';
import { useEffect, useState } from 'react';
import { utilsService } from '@services/utils.service';
import {
  AreaChartOutlined, PieChartOutlined, BarChartOutlined,
  LineChartOutlined, DotChartOutlined
} from '@ant-design/icons';
import Link from 'next/link';

function Dashboard() {
  const [stats, setStats] = useState({
    totalActivePerformers: 0,
    totalInactivePerformers: 0,
    totalPendingPerformers: 0,
    totalActiveUsers: 0,
    totalInactiveUsers: 0,
    totalPendingUsers: 0,
    totalDeliveredOrders: 0,
    totalGrossPrice: 0,
    totalNetPrice: 0,
    totalPriceCommission: 0,
    totalOrders: 0,
    totalPosts: 0,
    totalPhotoPosts: 0,
    totalVideoPosts: 0,
    totalGalleries: 0,
    totalPhotos: 0,
    totalVideos: 0,
    totalProducts: 0,
    totalRefundedOrders: 0,
    totalShippingdOrders: 0,
    totalSubscribers: 0,
    totalActiveSubscribers: 0,
    totalInactiveSubscribers: 0
  });
  const [fetching, setFetching] = useState(true);

  const getStats = async () => {
    try {
      const resp = await utilsService.statistics();
      setStats(resp.data);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="dashboard-stats">
        <Row>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { status: 'active' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="ACTIVE USERS"
                  value={stats.totalActiveUsers}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { status: 'inactive' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="INACTIVE USERS"
                  value={stats.totalInactiveUsers}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { verifiedEmail: false } }}>
              <Card loading={fetching}>
                <Statistic
                  title="NOT VERIFIED EMAIL USERS"
                  value={stats.totalPendingUsers}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { status: 'active' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="ACTIVE CREATORS"
                  value={stats.totalActivePerformers}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>

          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { status: 'inactive' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="INACTIVE CREATORS"
                  value={stats.totalInactivePerformers}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { verifiedDocument: false } }}>
              <Card loading={fetching}>
                <Statistic
                  title="NOT VERIFIED ID CREATORS"
                  value={stats.totalPendingPerformers}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/feed">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL POSTS"
                  value={stats.totalPosts}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/gallery">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL GALLERIES"
                  value={stats.totalGalleries}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/photos">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL PHOTOS"
                  value={stats.totalPhotos}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/video">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL VIDEOS"
                  value={stats.totalVideos}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/product">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL PRODUCTS"
                  value={stats.totalProducts}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/subscription">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL SUBSCRIBERS"
                  value={stats.totalSubscribers}
                  valueStyle={{ color: '#941fd0' }}
                  prefix={<DotChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL EARNINGS"
                  value={`${stats?.totalGrossPrice.toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={fetching}>
                <Statistic
                  title="PLATFORM EARNINGS"
                  value={`${stats?.totalPriceCommission.toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={fetching}>
                <Statistic
                  title="CREATOR'S EARNINGS"
                  value={`${stats?.totalNetPrice.toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=shipping">
              <Card loading={fetching}>
                <Statistic
                  title="SHIPPED ORDERS"
                  value={stats.totalShippingdOrders}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=delivered">
              <Card loading={fetching}>
                <Statistic
                  title="DELIVERED ORDERS"
                  value={stats.totalDeliveredOrders}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=refunded">
              <Card loading={fetching}>
                <Statistic
                  title="REFUNDED ORDERS"
                  value={stats.totalRefundedOrders}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
