/**
 * 系统常量定义
 */

// API 基础路径
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// 用户角色
export const USER_ROLES = {
  PARAMETER_MAINTAINER: "PARAMETER_MAINTAINER", // 参数表维护员
  ORDER_MAINTAINER: "ORDER_MAINTAINER", // 订单车维护员
  PRINTER: "PRINTER", // 打印操作员
  REPRINTER: "REPRINTER", // 补打操作员
  CHASSIS_MAINTAINER: "CHASSIS_MAINTAINER", // 二类底盘维护员
  SYSTEM_ADMIN: "SYSTEM_ADMIN", // 系统管理员
  REPORT_VIEWER: "REPORT_VIEWER", // 报表查询员
};

// 角色名称映射
export const ROLE_NAMES = {
  [USER_ROLES.PARAMETER_MAINTAINER]: "参数表维护员",
  [USER_ROLES.ORDER_MAINTAINER]: "订单车维护员",
  [USER_ROLES.PRINTER]: "打印操作员",
  [USER_ROLES.REPRINTER]: "补打操作员",
  [USER_ROLES.CHASSIS_MAINTAINER]: "二类底盘维护员",
  [USER_ROLES.SYSTEM_ADMIN]: "系统管理员",
  [USER_ROLES.REPORT_VIEWER]: "报表查询员",
};

// 打印类型
export const PRINT_TYPES = {
  NORMAL: "NORMAL", // 正常打印
  REPRINT: "REPRINT", // 重打
  SUPPLEMENT: "SUPPLEMENT", // 补打
};

// 打印类型名称
export const PRINT_TYPE_NAMES = {
  [PRINT_TYPES.NORMAL]: "正常打印",
  [PRINT_TYPES.REPRINT]: "重打",
  [PRINT_TYPES.SUPPLEMENT]: "补打",
};

// 车辆类型
export const VEHICLE_TYPES = {
  PASSENGER: "PASSENGER", // 乘用车
  TRUCK: "TRUCK", // 货车
  SPECIAL: "SPECIAL", // 专用车
  CHASSIS: "CHASSIS", // 二类底盘
};

// 车辆类型名称
export const VEHICLE_TYPE_NAMES = {
  [VEHICLE_TYPES.PASSENGER]: "乘用车",
  [VEHICLE_TYPES.TRUCK]: "货车",
  [VEHICLE_TYPES.SPECIAL]: "专用车",
  [VEHICLE_TYPES.CHASSIS]: "二类底盘",
};

// 订单状态
export const ORDER_STATUS = {
  PENDING: "PENDING", // 待审核
  APPROVED: "APPROVED", // 已批准
  IN_PRODUCTION: "IN_PRODUCTION", // 生产中
  COMPLETED: "COMPLETED", // 已完成
};

// 订单状态名称
export const ORDER_STATUS_NAMES = {
  [ORDER_STATUS.PENDING]: "待审核",
  [ORDER_STATUS.APPROVED]: "已批准",
  [ORDER_STATUS.IN_PRODUCTION]: "生产中",
  [ORDER_STATUS.COMPLETED]: "已完成",
};

// 操作员状态
export const OPERATOR_STATUS = {
  ENABLED: "ENABLED", // 启用
  DISABLED: "DISABLED", // 禁用
};

// 操作员状态名称
export const OPERATOR_STATUS_NAMES = {
  [OPERATOR_STATUS.ENABLED]: "启用",
  [OPERATOR_STATUS.DISABLED]: "禁用",
};

// VIN码长度
export const VIN_LENGTH = 17;

// VSN码长度
export const VSN_LENGTH = 13;

// 合格证编号长度
export const CERTIFICATE_NO_LENGTH = 14;

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};
