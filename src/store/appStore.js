import { create } from "zustand";

/**
 * 应用全局状态管理
 *
 * 用于管理应用级别的状态，如主题、语言、侧边栏状态等
 * 这些状态不需要持久化，刷新后恢复默认值
 */
const useAppStore = create((set) => ({
  // 侧边栏是否折叠
  sidebarCollapsed: false,

  // 当前主题
  theme: "light",

  // 当前语言
  language: "zh-CN",

  // 设置侧边栏折叠状态
  setSidebarCollapsed: (collapsed) =>
    set({
      sidebarCollapsed: collapsed,
    }),

  // 切换侧边栏折叠状态
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  // 设置主题
  setTheme: (theme) =>
    set({
      theme,
    }),

  // 设置语言
  setLanguage: (language) =>
    set({
      language,
    }),
}));

export default useAppStore;
