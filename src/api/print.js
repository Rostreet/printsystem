/**
 * 合格证打印相关API
 */
import { get, post, postquery, put } from "../utils/fetch";

/**
 * 校验VIN和VSN
 * @param {Object} data - VIN和VSN信息
 * @param {string} data.vin - VIN码
 * @param {string} data.vsn - VSN码
 * @returns {Promise}
 */
export const validateVehicle = (data) => {
  return post("/print/validate", data);
};

/**
 * 获取打印预览数据
 * @param {Object} params - 查询参数
 * @param {string} params.vin - VIN码
 * @param {string} params.vsn - VSN码
 * @returns {Promise}
 */
export const getPrintPreview = (params) => {
  return get("/print/preview", params);
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
  return post("/print/normal", data);
};

/**
 * 重打合格证
 * @param {Object} data - 重打数据
 * @param {string} data.vin - VIN码
 * @returns {Promise}
 */
export const reprintCertificate = (data) => {
  return post("/print/reprint", data);
};

/**
 * 获取打印历史
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getPrintHistory = (vin) => {
  return get(`/print/history/${vin}`);
};

/**
 * 根据VIN查询合格证信息（用于补打）
 * @param {string} vin - VIN码
 * @returns {Promise}
 */
export const getCertificateByVin = (params) => {
  return get(`/api/warehousingcar/getbyvin`, params);
};

/**
 * 补打合格证（带修改）
 * @param {Object} data - 补打数据
 * @param {string} data.vin - VIN码
 * @param {Object} data.modifiedData - 修改的数据
 * @param {string} data.modifyReason - 修改原因
 * @returns {Promise}
 */
export const supplementPrint = (data) => {
  return put("/api/warehousingcar/update", data);
};

/**
 * 获取合格证打印统计报表
 * @param {Object} params - 获取合格证参数
 */
export const getCertificatePrintReport = (params) => {
  return postquery("/api/warehousingcar/print", params);
};
