# 📰 Vue Big Event - 大事件管理系统

基于 Vue 3 + Vite + Element Plus 构建的现代化文章管理系统

## ✨ 项目简介

Vue Big Event 是一个功能完善的文章管理系统，提供了用户认证、文章分类管理、文章发布与编辑等核心功能。项目采用最新的前端技术栈，具有良好的代码规范和项目结构。

## 🚀 技术栈

### 核心框架

- **Vue 3.5.18** - 采用 Composition API 和 `<script setup>` 语法
- **Vite 7.0.6** - 新一代前端构建工具
- **Vue Router 4.5.1** - 官方路由管理器
- **Pinia 3.0.3** - 新一代状态管理库

### UI 框架与组件

- **Element Plus 2.10.5** - 基于 Vue 3 的组件库
- **@element-plus/icons-vue 2.3.2** - Element Plus 图标库
- **@vueup/vue-quill 1.2.0** - 富文本编辑器

### 工具库

- **Axios 1.11.0** - HTTP 请求库
- **pinia-plugin-persistedstate 4.4.1** - Pinia 持久化插件

### 代码规范

- **ESLint 9.31.0** - JavaScript 代码检查工具
- **Prettier 3.6.2** - 代码格式化工具
- **Husky 8.0.0** - Git hooks 工具
- **lint-staged 16.1.4** - Git 暂存文件检查工具

### 自动化工具

- **unplugin-auto-import 20.0.0** - 自动导入 API
- **unplugin-vue-components 29.0.0** - 自动导入组件
- **vite-plugin-vue-devtools 8.0.0** - Vue 开发者工具

## 📦 项目结构

```
vue-big-event/
├── public/                 # 静态资源目录
│   └── favicon.ico
├── src/
│   ├── api/               # API 接口
│   │   ├── article.js    # 文章相关接口
│   │   └── user.js       # 用户相关接口
│   ├── assets/           # 资源文件
│   │   ├── avatar.jpg    # 默认头像
│   │   ├── cover.jpg     # 默认封面
│   │   ├── login_bg.jpg  # 登录背景
│   │   └── main.scss     # 全局样式
│   ├── components/       # 公共组件
│   │   ├── PageContainer.vue  # 页面容器组件
│   │   └── PageContainer2.vue
│   ├── router/           # 路由配置
│   │   └── index.js
│   ├── stores/           # 状态管理
│   │   ├── composables/  # 可组合式函数
│   │   │   └── useCache.js
│   │   ├── modules/      # 模块化 Store
│   │   │   ├── article.js  # 文章状态管理
│   │   │   └── user.js     # 用户状态管理
│   │   └── index.js
│   ├── utils/            # 工具函数
│   │   ├── format.js     # 格式化工具
│   │   └── request.js    # Axios 封装
│   ├── views/            # 页面视图
│   │   ├── article/      # 文章管理模块
│   │   │   ├── ArticleChannel.vue    # 分类管理
│   │   │   ├── ArticleManage.vue     # 文章管理
│   │   │   └── components/           # 文章模块组件
│   │   │       ├── ArticleEdit.vue   # 文章编辑
│   │   │       ├── ChannelDialog.vue # 分类弹窗
│   │   │       └── ChannelSelect.vue # 分类选择器
│   │   ├── layout/       # 布局模块
│   │   │   └── LayoutContainer.vue
│   │   ├── login/        # 登录模块
│   │   │   └── LoginPage.vue
│   │   └── user/         # 用户模块
│   │       ├── UserAvatar.vue    # 头像管理
│   │       ├── UserPassword.vue  # 密码修改
│   │       └── UserProfile.vue   # 个人信息
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .editorconfig         # 编辑器配置
├── .prettierrc.json      # Prettier 配置
├── eslint.config.js      # ESLint 配置
├── vite.config.js        # Vite 配置
├── jsconfig.json         # JavaScript 配置
└── package.json          # 项目依赖

```

## 🎯 核心功能

### 1. 用户模块

- ✅ 用户登录 / 注册
- ✅ 个人信息管理
- ✅ 头像上传
- ✅ 密码修改

### 2. 文章分类管理

- ✅ 分类列表展示（带分页）
- ✅ 添加分类
- ✅ 编辑分类
- ✅ 删除分类
- ✅ 数据缓存与刷新机制

### 3. 文章管理

- ✅ 文章列表
- ✅ 文章发布（支持富文本编辑）
- ✅ 文章编辑
- ✅ 文章删除
- ✅ 文章分类筛选

## 🛠️ 环境要求

- **Node.js**: ^20.19.0 或 >=22.12.0
- **包管理器**: pnpm (推荐)

## 📝 快速开始

### 1. 安装依赖

```sh
pnpm install
```

### 2. 启动开发服务器

```sh
pnpm dev
```

访问 `http://localhost:5173` 查看应用

### 3. 构建生产版本

```sh
pnpm build
```

### 4. 预览生产构建

```sh
pnpm preview
```

## 🔧 开发命令

| 命令               | 说明                       |
| ------------------ | -------------------------- |
| `pnpm dev`         | 启动开发服务器             |
| `pnpm build`       | 构建生产版本               |
| `pnpm preview`     | 预览生产构建               |
| `pnpm lint`        | 运行 ESLint 检查并自动修复 |
| `pnpm format`      | 格式化 src 目录下的代码    |
| `pnpm lint-staged` | 检查暂存文件               |

## 💡 开发规范

### 代码风格

- 使用 ESLint + Prettier 进行代码检查和格式化
- 提交前自动运行 lint-staged 检查
- 使用 Husky 管理 Git hooks

### 组件开发

- 优先使用 `<script setup>` 语法
- 使用 Composition API
- 组件按功能模块划分目录

### 状态管理

- 使用 Pinia 进行状态管理
- Store 按模块拆分（user、article 等）
- 支持状态持久化

### API 请求

- 统一使用 `utils/request.js` 封装的 Axios 实例
- API 接口按模块划分文件

## 🎨 推荐 IDE 配置

- **编辑器**: [VSCode](https://code.visualstudio.com/)
- **插件**:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 语言支持
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> **注意**: 如果之前安装了 Vetur，请先禁用它

## 📚 项目特色

### 1. 自动导入

- 使用 `unplugin-auto-import` 自动导入 Vue API
- 使用 `unplugin-vue-components` 自动导入组件
- 无需手动 import，提升开发效率

### 2. 状态持久化

- 集成 `pinia-plugin-persistedstate`
- 用户登录状态自动持久化
- 刷新页面不丢失数据

### 3. 统一的请求封装

- 统一的错误处理
- 请求/响应拦截器
- Token 自动注入

### 4. 组件化设计

- 页面容器组件封装
- 表单组件抽离
- 业务逻辑与 UI 分离

## 🔗 相关链接

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)

## 📄 许可证

[MIT License](LICENSE)

## 👨‍💻 开发者

如有问题或建议，欢迎提交 Issue 或 Pull Request！

---

**Happy Coding! 🎉**
