import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 用户信息全局状态管理
 *
 * 使用 Zustand 的 persist 中间件实现数据持久化
 * 数据会自动保存到 localStorage 中，页面刷新后也不会丢失
 *
 * 使用方式：
 * ```javascript
 * import useUserStore from './store/userStore';
 *
 * // 在组件中
 * const { userInfo, isAuthenticated, login, logout } = useUserStore();
 *
 * // 在非 React 组件中（如 axios 拦截器）
 * const token = useUserStore.getState().token;
 * useUserStore.getState().logout();
 * ```
 */
const useUserStore = create(
  persist(
    (set) => ({
      // 用户信息
      user: null,
      // 是否已登录
      isAuthenticated: false,
      // Token
      token: null,

      // 设置用户信息
      setUserInfo: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // 设置 Token
      setToken: (token) =>
        set({
          token,
        }),

      // 登录
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // 登出
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // 更新用户信息
      updateUserInfo: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
              }
            : null,
        })),
    }),
    {
      name: "user-storage", // localStorage 中的 key 名称
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
