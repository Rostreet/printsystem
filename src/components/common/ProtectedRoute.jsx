/**
 * 路由守卫组件
 */
import { Navigate } from 'react-router-dom';
import { storage } from '../../utils';

const ProtectedRoute = ({ children }) => {
  const token = storage.getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
