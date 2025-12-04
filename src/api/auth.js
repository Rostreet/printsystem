/**
 * 用户认证相关API
 */
import { get, post } from "../utils/fetch";

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.operatorId - 操作员ID
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export const login = (data) => {
  return post("/api/user/login", data);
};

/**
 * 用户登出
 * @returns {Promise}
 */
export const logout = () => {
  return post("/user/logout");
};

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export const getCurrentUser = () => {
  return get("/user/current");
};
