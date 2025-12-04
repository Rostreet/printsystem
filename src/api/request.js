/**
 * Axios 请求封装
 */
import axios from "axios";
import { message } from "antd";
import { API_BASE_URL } from "../constants";
import useUserStore from "../store/userStore";

// 创建axios实例
const request = axios.create({
  baseURL: "", // 开发环境使用空字符串,让Vite代理处理请求
  timeout: 10000, // 增加超时时间到10秒
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log("响应数据:", response);
    const { data } = response;

    // 统一处理响应
    if (data.code === 200 || data.code === 201) {
      return data;
    }

    // 处理业务错误
    message.error(data.message || "操作失败");
    return Promise.reject(new Error(data.message || "操作失败"));
  },
  (error) => {
    console.error("请求错误:", error);
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      console.error("错误响应:", status, data);

      switch (status) {
        case 401:
          message.error("未授权,请重新登录");
          useUserStore.getState().logout();
          // 跳转到登录页
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问该资源");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器错误,请稍后重试");
          break;
        default:
          message.error(data?.message || "请求失败");
      }
    } else if (error.request) {
      console.error("无响应:", error.request);
      message.error("网络错误,请检查网络连接");
    } else {
      message.error(error.message || "请求失败");
    }

    return Promise.reject(error);
  }
);

export default request;
