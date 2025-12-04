/**
 * Fetch 请求封装
 * 替代 Axios，提供统一的请求/响应拦截和错误处理
 */
import { message } from "antd";
import useUserStore from "../store/userStore";

// 默认配置
const DEFAULT_CONFIG = {
  baseURL: "", // 开发环境使用空字符串，让Vite代理处理请求
  timeout: 10000, // 30秒超时，增加超时时间
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // 携带 Cookie
};

/**
 * 序列化查询参数
 * @param {Object} params - 查询参数对象
 * @returns {string} 序列化后的查询字符串
 */
const serializeParams = (params) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key]);
    }
  });
  return searchParams.toString();
};

/**
 * 请求拦截器 - 添加 Token 等通用请求头
 * @param {Object} config - 请求配置
 * @returns {Object} 处理后的配置
 */
const requestInterceptor = (config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

/**
 * 响应拦截器 - 统一处理响应数据
 * @param {Response} response - Fetch 响应对象
 * @returns {Promise} 处理后的数据
 */
const responseInterceptor = async (response) => {
  // 解析 JSON
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("响应解析失败");
  }

  // HTTP 状态码检查
  if (!response.ok) {
    return handleHttpError(response.status, data);
  }

  // 业务状态码检查
  if (data.code === 200 || data.code === 201) {
    return data;
  }

  // 处理业务错误
  message.error(data.message || "操作失败");
  throw new Error(data.message || "操作失败");
};

/**
 * HTTP 错误处理
 * @param {number} status - HTTP 状态码
 * @param {Object} data - 响应数据
 */
const handleHttpError = (status, data) => {
  console.error("错误响应:", status, data);

  switch (status) {
    case 401:
      message.error("未授权，请重新登录");
      useUserStore.getState().logout();
      window.location.href = "/login";
      break;
    case 403:
      message.error("没有权限访问该资源");
      break;
    case 404:
      message.error("请求的资源不存在");
      break;
    case 500:
      message.error("服务器错误，请稍后重试");
      break;
    default:
      message.error(data?.message || "请求失败");
  }

  throw new Error(data?.message || `HTTP Error: ${status}`);
};

/**
 * 网络错误处理
 * @param {Error} error - 错误对象
 */
const handleNetworkError = (error) => {
  console.error("请求错误:", error);

  if (error.name === "AbortError") {
    message.error("请求超时，请重试");
    throw new Error("请求超时");
  }

  if (error.message === "Failed to fetch") {
    message.error("网络错误，请检查网络连接");
    throw new Error("网络错误");
  }

  message.error(error.message || "请求失败");
  throw error;
};

/**
 * 核心 Fetch 封装函数
 * @param {string} url - 请求路径
 * @param {Object} options - 请求选项
 * @returns {Promise} 响应数据
 */
const fetchWrapper = async (url, options = {}) => {
  // 合并配置
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...options.headers,
    },
  };

  // 请求拦截
  const interceptedConfig = requestInterceptor(config);

  // 构建完整 URL
  const fullUrl = config.baseURL + url;

  // 创建超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, config.timeout);

  try {
    // 发送请求
    const response = await fetch(fullUrl, {
      ...interceptedConfig,
      signal: controller.signal,
    });

    // 请求成功,清除超时定时器
    clearTimeout(timeoutId);

    // 响应拦截
    return await responseInterceptor(response);
  } catch (error) {
    // 清除超时定时器
    clearTimeout(timeoutId);
    // 错误处理
    return handleNetworkError(error);
  }
};

/**
 * GET 请求
 * @param {string} url - 请求路径
 * @param {Object} params - 查询参数
 * @param {Object} config - 额外配置
 * @returns {Promise}
 */
export const get = (url, params, config = {}) => {
  const queryString = serializeParams(params);
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return fetchWrapper(fullUrl, {
    ...config,
    method: "GET",
  });
};

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {Object} data - 请求体数据
 * @param {Object} config - 额外配置
 * @returns {Promise}
 */
export const post = (url, data, config = {}) => {
  return fetchWrapper(url, {
    ...config,
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const postquery = (url, params, config = {}) => {
  const queryString = serializeParams(params);
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return fetchWrapper(fullUrl, {
    ...config,
    method: "POST",
  });
};

/**
 * PUT 请求
 * @param {string} url - 请求路径
 * @param {Object} data - 请求体数据
 * @param {Object} config - 额外配置
 * @returns {Promise}
 */
export const put = (url, data, config = {}) => {
  return fetchWrapper(url, {
    ...config,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 请求
 * @param {string} url - 请求路径
 * @param {Object} config - 额外配置
 * @returns {Promise}
 */
export const del = (url, params, config = {}) => {
  const queryString = serializeParams(params);
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return fetchWrapper(fullUrl, {
    ...config,
    method: "DELETE",
  });
};

// 导出默认对象（兼容旧的 request 用法）
export default {
  get,
  post,
  put,
  delete: del,
};
