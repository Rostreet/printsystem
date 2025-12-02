/**
 * Zustand Store 统一导出
 *
 * 项目使用 Zustand 进行全局状态管理
 * - 轻量级，bundle 体积小
 * - API 简单直观
 * - 支持中间件（persist 持久化等）
 * - 无需 Provider 包裹
 * - 性能优秀，避免不必要的重渲染
 *
 * ## 使用示例
 *
 * ### 1. 在 React 组件中使用
 * ```javascript
 * import { useUserStore } from '@/store';
 *
 * function MyComponent() {
 *   const { userInfo, isAuthenticated, login, logout } = useUserStore();
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <p>欢迎, {userInfo?.name}</p>
 *       ) : (
 *         <button onClick={() => login(userData, token)}>登录</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * ### 2. 性能优化：只订阅需要的状态
 * ```javascript
 * // 只订阅 userInfo，其他状态变化不会触发重渲染
 * const userInfo = useUserStore((state) => state.userInfo);
 * ```
 *
 * ### 3. 在非 React 组件中使用
 * ```javascript
 * import { useUserStore } from '@/store';
 *
 * // 在 axios 拦截器、工具函数等地方
 * const token = useUserStore.getState().token;
 * useUserStore.getState().logout();
 * ```
 *
 * ### 4. 订阅状态变化
 * ```javascript
 * useUserStore.subscribe((state) => {
 *   console.log('用户状态已更新:', state);
 * });
 * ```
 *
 * ## 可用的 Store
 *
 * - **useUserStore**: 用户信息管理（带持久化）
 *   - userInfo: 用户信息
 *   - isAuthenticated: 登录状态
 *   - token: 认证令牌
 *   - login(userInfo, token): 登录
 *   - logout(): 退出登录
 *   - updateUserInfo(updates): 更新用户信息
 *
 * - **useAppStore**: 应用状态管理
 *   - sidebarCollapsed: 侧边栏折叠状态
 *   - theme: 主题
 *   - language: 语言
 *   - toggleSidebar(): 切换侧边栏
 *   - setTheme(theme): 设置主题
 *   - setLanguage(language): 设置语言
 */

export { default as useUserStore } from "./userStore";
export { default as useAppStore } from "./appStore";
