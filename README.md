# 营销活动管理系统 | Marketing Campaign Management System

[English](#english) | [中文](#中文)

<a name="english"></a>
# Marketing Campaign Management System

A modern marketing campaign management system that supports multi-merchant and multi-agent marketing activities, providing comprehensive campaign creation, management, statistics, and analysis capabilities.

## Features

### 1. Campaign Management
- Support for multiple campaign types (discounts, promotions, coupons, etc.)
- Flexible campaign rule configuration
- Campaign time management
- Real-time campaign status monitoring

### 2. Merchant Management
- Multi-merchant support
- Merchant fee management
- Merchant data statistics
- Merchant campaign permission control

### 3. Agent Management
- Multi-level agent system
- Commission settlement
- Performance statistics
- Agent permission management

### 4. User Benefits
- Benefit distribution
- Benefit usage records
- Benefit verification
- Benefit inquiry

### 5. Data Analysis
- Campaign effectiveness analysis
- User behavior analysis
- Conversion rate statistics
- Data visualization

## Technical Architecture

### Frontend Stack
- HTML5
- CSS3
- JavaScript
- TailwindCSS

### Backend Stack
- Node.js
- Express
- MySQL
- Redis

## Quick Start

### Requirements
- Node.js >= 14.0.0
- MySQL >= 5.7
- Redis >= 6.0

### Installation

1. Clone the repository
```bash
git clone https://github.com/hubo1989/promotions.git
cd promotions
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env file with necessary environment variables
```

4. Start development server
```bash
npm run dev
```

## Project Structure

```
promotions/
├── admin/           # Admin dashboard
├── preview/         # Preview pages
├── prototype_h5/    # H5 prototypes
├── images/          # Image resources
└── docs/           # Documentation
```

## Development Guidelines

- Follow ESLint standards
- Use Prettier for code formatting
- Follow Git Flow workflow
- Write unit tests

## Deployment

1. Build production code
```bash
npm run build
```

2. Configure production environment
- Set environment variables
- Configure database
- Configure cache service

3. Start service
```bash
npm start
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## Version History

- v0.1.0
  - Initial release
  - Basic features implementation

## Author

- hubo1989 - [GitHub](https://github.com/hubo1989)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

- Project Link: [https://github.com/hubo1989/promotions](https://github.com/hubo1989/promotions)

---

<a name="中文"></a>
# 营销活动管理系统

一个现代化的营销活动管理系统，支持多商户、多代理商的营销活动管理，提供完整的活动创建、管理、统计和分析功能。

## 功能特点

### 1. 活动管理
- 支持多种活动类型（满减、折扣、优惠券等）
- 灵活的活动规则配置
- 活动时间管理
- 活动状态实时监控

### 2. 商户管理
- 多商户支持
- 商户费率管理
- 商户数据统计
- 商户活动权限控制

### 3. 代理商管理
- 多级代理商体系
- 佣金结算
- 业绩统计
- 代理商权限管理

### 4. 用户权益
- 权益发放
- 权益使用记录
- 权益核销
- 权益查询

### 5. 数据分析
- 活动效果分析
- 用户行为分析
- 转化率统计
- 数据可视化展示

## 技术架构

### 前端技术栈
- HTML5
- CSS3
- JavaScript
- TailwindCSS

### 后端技术栈
- Node.js
- Express
- MySQL
- Redis

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- MySQL >= 5.7
- Redis >= 6.0

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/hubo1989/promotions.git
cd promotions
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量
```

4. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
promotions/
├── admin/           # 管理后台
├── preview/         # 预览页面
├── prototype_h5/    # H5原型
├── images/          # 图片资源
└── docs/           # 文档
```

## 开发规范

- 遵循 ESLint 规范
- 使用 Prettier 进行代码格式化
- 遵循 Git Flow 工作流
- 编写单元测试

## 部署说明

1. 构建生产环境代码
```bash
npm run build
```

2. 配置生产环境
- 设置环境变量
- 配置数据库
- 配置缓存服务

3. 启动服务
```bash
npm start
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 版本历史

- v0.1.0
  - 初始版本发布
  - 基础功能实现

## 作者

- hubo1989 - [GitHub](https://github.com/hubo1989)

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目链接: [https://github.com/hubo1989/promotions](https://github.com/hubo1989/promotions) 
