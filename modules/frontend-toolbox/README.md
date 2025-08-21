# 前端工具箱模块

## 模块概述

前端工具箱是一个集成了多种前端开发常用工具的模块，为开发者提供便捷的CSS生成、代码格式化、颜色转换等功能。

## 功能特性

### 1. CSS生成器
- **实时预览**: 通过滑块和颜色选择器实时预览CSS效果
- **多元素支持**: 支持div、button、input、span、p等常见元素
- **样式控制**: 可调节宽度、高度、背景色、边框半径等属性
- **代码生成**: 自动生成对应的CSS代码

### 2. 代码格式化工具
- **多语言支持**: 支持JavaScript、CSS、HTML、JSON格式化和压缩
- **智能格式化**: 自动调整缩进、换行等格式
- **代码压缩**: 一键压缩代码，减少文件大小
- **语法检查**: 基本的语法验证功能

### 3. 颜色工具
- **多格式转换**: 支持HEX、RGB、HSL、RGBA、HSLA格式互转
- **颜色选择器**: 内置颜色选择器，直观选择颜色
- **实时预览**: 实时显示颜色效果
- **批量转换**: 一次性获取所有格式的颜色值

## 使用方法

### CSS生成器
1. 选择目标元素类型
2. 使用滑块调节宽度、高度、边框半径
3. 使用颜色选择器选择背景色
4. 实时查看预览效果
5. 点击"生成CSS"获取代码

### 代码格式化
1. 选择代码类型（JavaScript/CSS/HTML/JSON）
2. 在输入框中粘贴要格式化的代码
3. 点击"格式化"或"压缩"按钮
4. 复制格式化后的代码

### 颜色工具
1. 在任意输入框中输入颜色值（HEX/RGB/HSL）
2. 或使用颜色选择器选择颜色
3. 点击"转换"按钮
4. 查看所有格式的颜色值

## 快捷键

- `Ctrl + Enter`: 执行当前工具的主要功能
- `Ctrl + Shift + C`: 复制当前结果到剪贴板

## 技术实现

### 文件结构
```
frontend-toolbox/
├── frontend-toolbox.html      # 主HTML文件
├── assets/
│   └── frontend-toolbox.css   # 样式文件
├── scripts/
│   ├── frontendToolboxTool.js # 核心工具类
│   └── frontend-toolbox.js    # 主逻辑文件
└── README.md                  # 说明文档
```

### 核心类
- `FrontendToolboxTool`: 提供所有工具功能的核心类
- 包含CSS生成、代码格式化、颜色转换等方法

### 主要方法
- `generateCSS(options)`: 生成CSS代码
- `formatCode(code, type)`: 格式化代码
- `minifyCode(code, type)`: 压缩代码
- `convertColor(color, fromFormat)`: 颜色格式转换

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持CSS生成器、代码格式化、颜色工具
- 实现实时预览和键盘快捷键
- 响应式设计支持

## 贡献指南

欢迎提交Issue和Pull Request来改进这个模块。

## 许可证

MIT License 