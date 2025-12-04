/**
 * TanStack Query 配置
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * 创建 QueryClient 实例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 窗口聚焦时不自动重新请求
      refetchOnWindowFocus: false,
      // 网络重连时重新请求
      refetchOnReconnect: true,
      // 失败重试次数
      retry: 1,
      // 数据新鲜度时间（5秒内不重新请求）
      staleTime: 5000,
      // 缓存时间（5分钟）
      gcTime: 300000,
    },
    mutations: {
      // 失败重试次数
      retry: 0,
    },
  },
});
