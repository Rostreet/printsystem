/**
 * 合格证打印相关API
 */
import request from './request';

/**
 * 校验VIN和VSN
 * @param {Object} data - VIN和VSN信息
 * @param {string} data.vin - VIN码
 * @param {string} data.vsn - VSN码
 * @returns {Promise}
 */
export const validateVehicle = (data) => {
  return request.post('/print/validate', data);
};

/**
 * 获取打印预览数据
 * @param {Object} params - 查询参数
 * @param {string} params.vin - VIN码
 * @param {string} params.vsn - VSN码
 * @returns {Promise}
 */
export const getPrintPreview = (params) => {
  return request.get('/print/preview', { params });
};

/**
 * 正常打印合格证
 * @param {Object} data - 打印数据
 * @param {string} data.vin - VIN码
 * @param {string} data.vsn - VSN码
 * @param {string} data.engineNo - 发动机号
 * @param {Object} data.parameters - 打印参数
 * @returns {Promise}
 */
export const normalPrint = (data) => {
  return request.post('/print/normal', data);
};

/**
 * 重打合格证
 * @param {Object} data - 重打数据
 * @param {string} data.vin - VIN码
 * @returns {Promise}
 */
export const reprintCertificate = (data) => {
  return request.post('/print/reprint', data);
};

/**
 * 获取打印历史
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getPrintHistory = (vin) => {
  return request.get(`/print/history/${vin}`);
};
