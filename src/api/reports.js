/**
 * 统计报表相关API
 */
import { get, post } from "../utils/fetch";

/**
 * 根据VIN查询车辆打印历史记录
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getVehiclePrintHistory = (params) => {
  // Use path parameter style: /api/report/print-history/:vin
  const result = get(`/api/report/print-history`, params, {}, false);
  console.log(result);
  return result;
};

/**
 * 根据时间段查询订单车修改信息
 * @param {Object} params - 查询参数
 * @param {string} params.start - 开始时间
 * @param {string} params.end - 结束时间
 * @returns {Promise}
 */
export const getOrderModifyInfo = (params) => {
  return get("/api/report/order-modify", params);
};

/**
 * 根据时间段统计合格证数量
 * @param {Object} params - 查询参数
 * @param {string} params.start - 开始时间
 * @param {string} params.end - 结束时间
 * @returns {Promise}
 */
export const getCertificateCount = (params) => {
  return get("/api/report/cert-distinct-count", params);
};

/**
 * 根据操作员和时间段查询合格证打印数量
 * @param {Object} params - 查询参数
 * @param {string} params.user - 操作员用户名
 * @param {string} params.start - 开始时间
 * @param {string} params.end - 结束时间
 * @returns {Promise}
 */
export const getOperatorPrintCount = (params) => {
  // 使用路径参数传递user，查询参数传递start和end
  const { user, ...queryParams } = params;
  return get(`/api/report/cert-total/${user}`, queryParams);
};

/**
 * 根据操作员和时间段查询合格证补打数量
 * @param {Object} params - 查询参数
 * @param {string} params.operatorId - 操作员ID
 * @param {string} params.start - 开始时间
 * @param {string} params.end - 结束时间
 * @returns {Promise}
 */
export const getOperatorReprintCount = (params) => {
  return get("/report/operator-reprint-count", params);
};

/**
 * 根据合格证编号查询合格证信息
 * @param {string} certificateNo - 合格证编号
 * @returns {Promise}
 */
export const getCertificateInfo = (certificateNo) => {
  return get(`/api/report/cert/${certificateNo}`);
};

/**
 * 导出报表到Excel
 * @param {string} reportType - 报表类型
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const exportReport = (reportType, params) => {
  return post(`/report/export/${reportType}`, params, {
    responseType: "blob",
  });
};
