/**
 * 主布局组件
 */
import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  DatabaseOutlined,
  ShoppingOutlined,
  PrinterOutlined,
  ReloadOutlined,
  ToolOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../api/auth';
import { storage } from '../../utils';
import { ROLE_NAMES } from '../../constants';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = storage.getUserInfo();

  // 菜单项配置
  const menuItems = [
    {
      key: '/parameter',
      icon: <DatabaseOutlined />,
      label: '参数表维护',
    },
    {
      key: '/order',
      icon: <ShoppingOutlined />,
      label: '订单车维护',
    },
    {
      key: '/print',
      icon: <PrinterOutlined />,
      label: '合格证打印',
    },
    {
      key: '/reprint',
      icon: <ReloadOutlined />,
      label: '合格证补打',
    },
    {
      key: '/chassis',
      icon: <ToolOutlined />,
      label: '二类底盘维护',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '统计报表',
    },
    {
      key: '/operator',
      icon: <TeamOutlined />,
      label: '操作员管理',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'changePassword',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = async ({ key }) => {
    if (key === 'logout') {
      try {
        await logout();
        storage.clear();
        message.success('退出登录成功');
        navigate('/login');
      } catch {
        // 错误已在拦截器处理
        storage.clear();
        navigate('/login');
      }
    } else if (key === 'changePassword') {
      // TODO: 打开修改密码对话框
      message.info('修改密码功能开发中');
    }
  };

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {collapsed ? '合格证' : '合格证打印系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="site-layout-header">
          <div className="header-left">
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} />
            )}
          </div>
          <div className="header-right">
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">{userInfo?.name || '用户'}</span>
                <span className="user-role">
                  {ROLE_NAMES[userInfo?.role] || '操作员'}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="site-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
