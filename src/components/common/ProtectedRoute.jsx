/**
 * 路由守卫组件
 */
import { Navigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
