/**
 * 二类底盘维护相关API
 */
import request from "./request";

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
  return request.get("/chassis", { params });
};

/**
 * 根据ID获取底盘详情
 * @param {string} id - 底盘ID
 * @returns {Promise}
 */
export const getChassisById = (id) => {
  return request.get(`/chassis/${id}`);
};

/**
 * 新增底盘配置
 * @param {Object} data - 底盘数据
 * @returns {Promise}
 */
export const createChassis = (data) => {
  return request.post("/chassis", data);
};

/**
 * 更新底盘配置
 * @param {string} id - 底盘ID
 * @param {Object} data - 底盘数据
 * @returns {Promise}
 */
export const updateChassis = (id, data) => {
  return request.put(`/chassis/${id}`, data);
};

/**
 * 删除底盘配置
 * @param {string} id - 底盘ID
 * @returns {Promise}
 */
export const deleteChassis = (id) => {
  return request.delete(`/chassis/${id}`);
};
