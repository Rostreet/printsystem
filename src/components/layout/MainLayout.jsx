/**
 * 主布局组件
 */
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
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
  CarOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../api/auth";
import useUserStore from "../../store/userStore";
import useAppStore from "../../store/appStore";
import { ROLE_NAMES } from "../../constants";
import styles from "./MainLayout.module.css";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout: logoutUser } = useUserStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  // 菜单项配置
  const menuItems = [
    {
      key: "/parameter",
      icon: <DatabaseOutlined />,
      label: "入库车列表",
    },
    {
      key: "/order",
      icon: <ShoppingOutlined />,
      label: "订单车列表",
    },
    {
      key: "/chassis",
      icon: <ToolOutlined />,
      label: "二类底盘列表",
    },
    {
      key: "/print",
      icon: <PrinterOutlined />,
      label: "合格证打印",
    },
    {
      key: "/reprint",
      icon: <ReloadOutlined />,
      label: "合格证补打",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "统计报表",
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = async ({ key }) => {
    if (key === "logout") {
      try {
        await logout();
        logoutUser();
        message.success("退出登录成功");
        navigate("/login");
      } catch {
        // 错误已在拦截器处理
        logoutUser();
        navigate("/login");
      }
    }
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className={styles.sider}
      >
        <div className={styles.siderTitle}>
          {sidebarCollapsed ? <CarOutlined /> : "合格证打印系统"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerToggle}>
            {sidebarCollapsed ? (
              <MenuUnfoldOutlined onClick={toggleSidebar} />
            ) : (
              <MenuFoldOutlined onClick={toggleSidebar} />
            )}
          </div>
          <div className={styles.headerUser}>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <div className={styles.userDropdown}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.userName}>
                  {userInfo?.name || "用户"}
                </span>
                <span className={styles.userRole}>
                  {ROLE_NAMES[userInfo?.role] || "操作员"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
