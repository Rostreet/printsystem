/**
 * 订单车维护相关API
 */
import request from "./request";

/**
 * 获取订单车列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.vin - VIN码（可选）
 * @param {string} params.vsn - VSN码（可选）
 * @param {string} params.modelCode - 车型代码（可选）
 * @returns {Promise}
 */
export const getOrderList = (params) => {
  return request.get("/order", { params });
};

/**
 * 根据VIN获取订单车详情
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getOrderByVin = (vin) => {
  return request.get(`/order/${vin}`);
};

/**
 * 新增订单车
 * @param {Object} data - 订单车数据
 * @returns {Promise}
 */
export const createOrder = (data) => {
  return request.post("/order", data);
};

/**
 * 更新订单车信息
 * @param {string} vin - VIN码
 * @param {Object} data - 订单车数据
 * @returns {Promise}
 */
export const updateOrder = (vin, data) => {
  return request.put(`/order/${vin}`, data);
};

/**
 * 删除订单车
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const deleteOrder = (vin) => {
  return request.delete(`/order/${vin}`);
};
