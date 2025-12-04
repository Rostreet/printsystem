/**
 * 用户认证相关API
 */
import { get, post, put } from "../utils/fetch";

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.operatorId - 操作员ID
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export const login = (data) => {
  console.log("登录参数:", data);
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

/**
 * 修改密码
 * @param {Object} data - 密码信息
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export const changePassword = (data) => {
  return put("/user/password", data);
};
