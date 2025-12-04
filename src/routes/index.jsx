/**
 * 路由配置
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";

// 创建路由
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/parameter" replace />,
      },
      {
        path: "parameter",
        lazy: () => import("../pages/parameter/ParameterList"),
      },
      {
        path: "order",
        lazy: () => import("../pages/order/OrderList"),
      },
      {
        path: "chassis",
        lazy: () => import("../pages/chassis/ChassisList"),
      },
      {
        path: "print",
        lazy: () => import("../pages/print/PrintPage"),
      },
      {
        path: "reprint",
        lazy: () => import("../pages/reprint/ReprintPage"),
      },
      {
        path: "reports",
        lazy: () => import("../pages/reports/ReportsPage"),
      },
    ],
  },
]);

export default router;
