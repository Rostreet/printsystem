/**
 * 订单车维护相关API
 */
import { get, post, put, del } from "../utils/fetch";

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
  return get("/api/ordercar/getall", params);
};

/**
 * 根据VIN获取订单车详情
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getOrderByVin = (vin) => {
  return get(`/order/${vin}`);
};

/**
 * 新增订单车
 * @param {Object} data - 订单车数据
 * @returns {Promise}
 */
export const createOrder = (data) => {
  return post("/order", data);
};

/**
 * 更新订单车信息
 * @param {string} vin - VIN码
 * @param {Object} data - 订单车数据
 * @returns {Promise}
 */
export const updateOrder = (vin, data) => {
  const params = {
    vin: vin,
    ...data,
  };
  return put(`/api/warehousingcar/update`, params);
};

/**
 * 删除订单车
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const deleteOrder = (vin) => {
  return del(`/order/${vin}`);
};
