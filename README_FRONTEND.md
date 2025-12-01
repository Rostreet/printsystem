# 合格证打印系统 - 前端

## 项目概述

车辆合格证打印系统是一个基于 React + Spring Boot + MySQL 的前后端分离应用，用于管理车辆合格证的打印流程。

## 技术栈

### 前端
- **React**: 19.2.0
- **Vite**: 7.2.4
- **React Router**: 7.9.6
- **Ant Design**: 6.0.0
- **Axios**: 1.13.2
- **Day.js**: 1.11.19

### 后端
- **Java**: Spring Boot
- **数据库**: MySQL
- **API**: RESTful

## 项目结构

```
src/
├── api/                    # API 接口层
│   ├── request.js         # Axios 请求封装
│   ├── auth.js           # 认证 API
│   ├── parameter.js      # 参数表 API
│   ├── print.js          # 打印 API
│   └── reports.js        # 报表 API
├── components/            # 公共组件
│   ├── common/           # 通用组件
│   │   └── ProtectedRoute.jsx  # 路由守卫
│   └── layout/           # 布局组件
│       └── MainLayout.jsx      # 主布局
├── pages/                 # 页面组件
│   ├── auth/             # 认证页面
│   │   └── Login.jsx    # 登录页
│   ├── parameter/        # 参数表维护
│   ├── order/            # 订单车维护
│   ├── print/            # 合格证打印
│   ├── reprint/          # 合格证补打
│   ├── chassis/          # 二类底盘维护
│   ├── reports/          # 统计报表
│   └── operator/         # 操作员管理
├── routes/                # 路由配置
│   └── index.jsx
├── utils/                 # 工具函数
│   └── index.js
├── constants/             # 常量定义
│   └── index.js
├── App.jsx               # 应用入口
└── main.jsx              # 主文件
```

## 功能模块

### 1. 用户认证模块
- ✅ 登录功能
- ✅ JWT Token 管理
- ✅ 路由守卫

### 2. 参数表维护模块
- ⏳ 车型参数管理
- ⏳ 参数增删改查
- ⏳ Excel 导出

### 3. 订单车维护模块
- ⏳ 订单车信息管理
- ⏳ 特殊信息维护

### 4. 合格证打印模块
- ⏳ VIN 扫描
- ⏳ 二类底盘校验
- ⏳ 打印预览

### 5. 合格证补打模块
- ⏳ 历史记录查询
- ⏳ 参数修改
- ⏳ 补打功能

### 6. 二类底盘维护模块
- ⏳ VIN/VSN 前缀管理

### 7. 统计报表模块
- ⏳ 6 类报表查询
- ⏳ 数据导出

### 8. 操作员管理模块
- ⏳ 操作员增删改查

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

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

### 预览生产版本
```bash
pnpm preview
```

## 环境变量配置

创建 `.env` 文件：

```bash
# API 基础路径
VITE_API_BASE_URL=http://localhost:8080/api
```

## 用户角色

系统支持以下角色：
- **参数表维护员**: 管理车型参数
- **订单车维护员**: 管理订单车信息
- **打印操作员**: 执行正常打印和重打
- **补打操作员**: 执行补打操作
- **二类底盘维护员**: 管理底盘识别规则
- **系统管理员**: 管理操作员
- **报表查询员**: 查询统计报表

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 组件使用函数式组件 + Hooks
- 使用 ES6+ 语法

### 命名规范
- 组件文件: PascalCase（如 `ParameterList.jsx`）
- 工具函数文件: camelCase（如 `index.js`）
- CSS 文件: kebab-case（如 `main-layout.css`）

### 目录规范
- 每个功能模块独立一个目录
- 组件相关的样式文件与组件放在同一目录
- API 接口按模块划分

## 业务术语

- **VIN码**: 17位车辆识别码
- **VSN码**: 13位车辆序列号（前4位为车型代码）
- **合格证编号**: 14位编号（前4位为企业代码）
- **重打**: 不修改数据的再次打印
- **补打**: 需要修改数据的打印
- **二类底盘**: 根据VIN前8位和VSN前2位判定

## API 接口说明

### 基础路径
```
http://localhost:8080/api
```

### 认证接口
- `POST /user/login` - 登录
- `POST /user/logout` - 登出
- `GET /user/current` - 获取当前用户信息

### 参数表接口
- `GET /parameter` - 获取参数列表
- `GET /parameter/:modelCode` - 获取参数详情
- `POST /parameter` - 新增参数
- `PUT /parameter/:modelCode` - 更新参数
- `DELETE /parameter/:modelCode` - 删除参数

### 打印接口
- `POST /print/validate` - 校验VIN和VSN
- `GET /print/preview` - 获取打印预览
- `POST /print/normal` - 正常打印
- `POST /print/reprint` - 重打

### 报表接口
- `GET /report/print-history` - 打印历史查询
- `GET /report/certificate-count` - 合格证数量统计
- `POST /report/export/:type` - 导出报表

## 注意事项

1. **后端依赖**: 本前端项目需要配合 Spring Boot 后端服务使用
2. **跨域配置**: 开发环境需要配置后端允许跨域请求
3. **Token 管理**: JWT Token 存储在 localStorage 中
4. **权限控制**: 不同角色可访问不同的菜单和功能

## 后续开发计划

- [ ] 完善参数表维护功能
- [ ] 实现打印功能和二类底盘校验
- [ ] 开发统计报表模块
- [ ] 添加单元测试
- [ ] 性能优化

## 许可证

专有软件
