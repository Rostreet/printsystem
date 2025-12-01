/**
 * 工具函数集合
 */
import { STORAGE_KEYS } from '../constants';

/**
 * 本地存储工具
 */
export const storage = {
  // 获取token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // 设置token
  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  // 移除token
  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  },

  // 移除用户信息
  removeUserInfo() {
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  // 清空所有
  clear() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },
};

/**
 * VIN码校验
 * @param {string} vin - VIN码
 * @returns {boolean}
 */
export const validateVIN = (vin) => {
  if (!vin || typeof vin !== 'string') return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
};

/**
 * VSN码校验
 * @param {string} vsn - VSN码
 * @returns {boolean}
 */
export const validateVSN = (vsn) => {
  if (!vsn || typeof vsn !== 'string') return false;
  return /^[A-Z0-9]{13}$/.test(vsn);
};

/**
 * 合格证编号校验
 * @param {string} certificateNo - 合格证编号
 * @returns {boolean}
 */
export const validateCertificateNo = (certificateNo) => {
  if (!certificateNo || typeof certificateNo !== 'string') return false;
  return /^[A-Z0-9]{14}$/.test(certificateNo);
};

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式，默认 YYYY-MM-DD HH:mm:ss
 * @returns {string}
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 下载文件
 * @param {Blob} blob - 文件Blob对象
 * @param {string} filename - 文件名
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 导出Excel
 * @param {Blob} blob - Excel Blob对象
 * @param {string} filename - 文件名（不含扩展名）
 */
export const exportExcel = (blob, filename) => {
  downloadFile(blob, `${filename}.xlsx`);
};

/**
 * 获取VIN前8位
 * @param {string} vin - VIN码
 * @returns {string}
 */
export const getVINPrefix = (vin) => {
  if (!vin || vin.length < 8) return '';
  return vin.substring(0, 8);
};

/**
 * 获取VSN前2位
 * @param {string} vsn - VSN码
 * @returns {string}
 */
export const getVSNPrefix = (vsn) => {
  if (!vsn || vsn.length < 2) return '';
  return vsn.substring(0, 2);
};

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export const throttle = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
};

/**
 * 深拷贝
 * @param {any} obj - 要拷贝的对象
 * @returns {any}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloneObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
};
