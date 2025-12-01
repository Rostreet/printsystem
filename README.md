# 合格证打印系统

## 项目简介

车辆合格证打印系统是一个专业的企业级应用，采用 **React + Spring Boot + MySQL** 前后端分离架构，实现了车辆合格证打印的完整流程管理。

## ✨ 技术栈

### 前端
- React 19.2.0
- Vite 7.2.4
- React Router 7.9.6
- Ant Design 6.0.0
- Axios 1.13.2
- Day.js 1.11.19

### 后端
- Java + Spring Boot
- MySQL 8.0+
- MyBatis-Plus
- JWT 认证

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

访问: http://localhost:5173

### 构建生产版本
```bash
pnpm build
```

## 📚 文档

- [README_FRONTEND.md](./README_FRONTEND.md) - 前端开发文档
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 项目概览
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 实施总结
- [.qoder/quests/certificate-printing-system-design.md](./.qoder/quests/certificate-printing-system-design.md) - 系统设计文档

## ✅ 已完成功能

### 核心模块
- ✅ 用户认证系统（登录、JWT Token、路由守卫）
- ✅ 主布局系统（导航菜单、用户信息栏）
- ✅ 参数表维护模块（增删改查、导出Excel）
- ✅ 合格证打印模块（VIN扫描、校验、预览、打印）
- ✅ 统计报表模块（6类报表查询和导出）

### API 接口层
- ✅ Axios 请求封装
- ✅ 请求/响应拦截器
- ✅ 统一错误处理
- ✅ 完整的 API 接口定义

## 📦 项目结构

```
printsystem/
├── src/
│   ├── api/              # API接口层
│   ├── components/       # 公共组件
│   ├── pages/            # 页面组件
│   ├── routes/           # 路由配置
│   ├── utils/            # 工具函数
│   ├── constants/        # 常量定义
│   ├── App.jsx
│   └── main.jsx
├── .env                 # 环境变量
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 主要功能

### 1. 参数表维护
- 车型参数的增、删、改、查
- 车型复制功能
- Excel 导出功能
- 参数字段验证

### 2. 合格证打印
- VIN/VSN 扫描输入
- 自动校验功能
- 二类底盘识别
- 订单车识别
- 打印预览
- 正常打印和重打

### 3. 统计报表
- 车辆打印历史查询
- 订单车修改信息查询
- 合格证数量统计
- 操作员打印数量统计
- 操作员补打数量统计
- 合格证编号查询
- Excel 导出功能

## 🛠️ 开发说明

### 环境变量
创建 `.env` 文件：
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### API 对接
前端已定义完整的 RESTful API 接口，详见：
- `src/api/auth.js` - 认证接口
- `src/api/parameter.js` - 参数表接口
- `src/api/print.js` - 打印接口
- `src/api/reports.js` - 报表接口

## 👥 用户角色

系统支持以下角色：
- 参数表维护员
- 订单车维护员
- 打印操作员
- 补打操作员
- 二类底盘维护员
- 系统管理员
- 报表查询员

## ⚠️ 注意事项

1. 前端需要配合 Spring Boot 后端服务使用
2. 确保后端 API 地址配置正确
3. 开发环境需要后端允许跨域请求
4. 推荐使用 Chrome、Edge、Firefox 最新版本

## 📅 项目状态

- ✅ 前端基础框架已完成
- ✅ 核心功能模块已实现
- ✅ API 接口已定义
- ⏳ 等待后端 API 对接
- ⏳ 部分功能模块待完善

## 📝 许可证

专有软件

---

**开发时间**: 2024-12-01  
**当前版本**: v0.1.0  
**开发状态**: 活跃开发中
