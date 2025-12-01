/**
 * 统计报表相关API
 */
import request from './request';

/**
 * 根据VIN查询车辆打印历史记录
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getVehiclePrintHistory = (vin) => {
  return request.get('/report/print-history', { params: { vin } });
};

/**
 * 根据时间段查询订单车修改信息
 * @param {Object} params - 查询参数
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise}
 */
export const getOrderModifyInfo = (params) => {
  return request.get('/report/order-modify', { params });
};

/**
 * 根据时间段统计合格证数量
 * @param {Object} params - 查询参数
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise}
 */
export const getCertificateCount = (params) => {
  return request.get('/report/certificate-count', { params });
};

/**
 * 根据操作员和时间段查询合格证打印数量
 * @param {Object} params - 查询参数
 * @param {string} params.operatorId - 操作员ID
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise}
 */
export const getOperatorPrintCount = (params) => {
  return request.get('/report/operator-print-count', { params });
};

/**
 * 根据操作员和时间段查询合格证补打数量
 * @param {Object} params - 查询参数
 * @param {string} params.operatorId - 操作员ID
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise}
 */
export const getOperatorReprintCount = (params) => {
  return request.get('/report/operator-reprint-count', { params });
};

/**
 * 根据合格证编号查询合格证信息
 * @param {string} certificateNo - 合格证编号
 * @returns {Promise}
 */
export const getCertificateInfo = (certificateNo) => {
  return request.get('/report/certificate-info', { params: { certificateNo } });
};

/**
 * 导出报表到Excel
 * @param {string} reportType - 报表类型
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const exportReport = (reportType, params) => {
  return request.post(`/report/export/${reportType}`, params, {
    responseType: 'blob',
  });
};
