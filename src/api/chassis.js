/**
 * 二类底盘维护相关API
 */
import { get, post, put, del } from "../utils/fetch";

/**
 * 获取底盘列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.vinPrefix - VIN前缀（可选）
 * @param {string} params.vsnPrefix - VSN前缀（可选）
 * @returns {Promise}
 */
export const getChassisList = (params) => {
  return get("/api/chassiscar/getall", params);
};

/**
 * 根据ID获取底盘详情
 * @param {string} id - 底盘ID
 * @returns {Promise}
 */
export const getChassisById = (id) => {
  return get(`/chassis/${id}`);
};

/**
 * 新增底盘配置
 * @param {Object} data - 底盘数据
 * @returns {Promise}
 */
export const createChassis = (data) => {
  return post("/chassis", data);
};

/**
 * 更新底盘配置
 * @param {string} id - 底盘ID
 * @param {Object} data - 底盘数据
 * @returns {Promise}
 */
export const updateChassis = (id, data) => {
  return put(`/chassis/${id}`, data);
};

/**
 * 删除底盘配置
 * @param {string} id - 底盘ID
 * @returns {Promise}
 */
export const deleteChassis = (id) => {
  return del(`/chassis/${id}`);
};
