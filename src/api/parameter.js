/**
 * 参数表维护相关API
 */
import request from './request';

/**
 * 获取参数表列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.modelCode - 车型代码（可选）
 * @param {string} params.vehicleCategory - 车辆类别（可选）
 * @returns {Promise}
 */
export const getParameterList = (params) => {
  return request.get('/parameter', { params });
};

/**
 * 根据车型代码获取参数详情
 * @param {string} modelCode - 车型代码
 * @returns {Promise}
 */
export const getParameterByModelCode = (modelCode) => {
  return request.get(`/parameter/${modelCode}`);
};

/**
 * 新增参数
 * @param {Object} data - 参数数据
 * @returns {Promise}
 */
export const createParameter = (data) => {
  return request.post('/parameter', data);
};

/**
 * 更新参数
 * @param {string} modelCode - 车型代码
 * @param {Object} data - 参数数据
 * @returns {Promise}
 */
export const updateParameter = (modelCode, data) => {
  return request.put(`/parameter/${modelCode}`, data);
};

/**
 * 删除参数
 * @param {string} modelCode - 车型代码
 * @returns {Promise}
 */
export const deleteParameter = (modelCode) => {
  return request.delete(`/parameter/${modelCode}`);
};

/**
 * 复制参数（从已有车型复制）
 * @param {Object} data - 复制数据
 * @param {string} data.sourceModelCode - 源车型代码
 * @param {string} data.targetModelCode - 目标车型代码
 * @returns {Promise}
 */
export const copyParameter = (data) => {
  return request.post('/parameter/copy', data);
};

/**
 * 导出参数到Excel
 * @param {string} modelCode - 车型代码
 * @returns {Promise}
 */
export const exportParameterToExcel = (modelCode) => {
  return request.get(`/parameter/${modelCode}/export`, {
    responseType: 'blob',
  });
};

/**
 * 批量导出参数
 * @param {Array<string>} modelCodes - 车型代码数组
 * @returns {Promise}
 */
export const batchExportParameters = (modelCodes) => {
  return request.post('/parameter/batch-export', { modelCodes }, {
    responseType: 'blob',
  });
};
