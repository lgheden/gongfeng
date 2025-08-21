# 小蜜蜂工具箱 - 程序员开发助手

一个功能丰富的Chrome浏览器扩展程序，专为程序员和开发者设计，集成了日常开发中常用的各种工具，提高开发效率。

## 🚀 项目简介

小蜜蜂工具箱是一款专为程序员打造的浏览器扩展工具集，包含了JSON格式化、正则表达式调试、编码解码、时间戳转换、代码美化、计算器、取色器等20+实用功能。所有工具都经过精心设计，界面简洁美观，操作便捷高效。

## 📦 安装方式

### Chrome网上应用店安装（推荐）
1. 访问 [Chrome网上应用店](https://chrome.google.com/webstore)
2. 搜索 "小蜜蜂工具箱"
3. 点击 "添加至Chrome" 按钮

### 开发者模式安装
1. 下载或克隆本项目代码
2. 打开Chrome浏览器，访问 `chrome://extensions/`
3. 开启右上角的 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择项目根目录

## 🛠️ 功能模块

### 1. JSON格式化工具
- 支持JSON数据的格式化、压缩、校验
- 支持语法高亮显示
- 支持复制、下载功能

### 2. 正则表达式测试器
- 实时测试正则表达式
- 支持全局匹配、区分大小写等选项
- 提供匹配结果高亮显示

### 3. 编码解码工具
- 支持Base64、URL、HTML、Unicode等多种编码格式
- 支持批量处理
- 实时转换，无需刷新

### 4. 时间戳转换器
- Unix时间戳与日期时间互转
- 支持毫秒级精度
- 显示当前时间戳

### 5. 代码美化工具
- 支持JavaScript、CSS、HTML、JSON等多种语言
- 智能格式化，保持代码结构清晰
- 支持自定义格式化选项

### 6. 计算器
- 标准计算器功能
- 支持科学计算模式
- 计算历史记录

### 7. 颜色选择器
- 支持RGB、HEX、HSL等多种颜色格式
- 实时预览颜色效果
- 支持颜色历史记录

### 8. 二维码生成器
- 支持文本、URL等多种内容生成
- 支持自定义尺寸和颜色
- 支持下载二维码图片

### 9. 页面截图工具
- 支持整页截图、可视区域截图
- 支持延迟截图
- 支持图片编辑和标注

### 10. 文本对比工具
- 支持文本差异对比
- 高亮显示不同之处
- 支持同步滚动查看

### 11. CRON表达式生成器
- 可视化生成CRON表达式
- 支持常用CRON模板
- 提供下次执行时间预览

### 12. 快速参考手册
- 包含常用编程语言语法速查
- CSS、JavaScript、Python、Java等语言支持
- 支持搜索和分类浏览

### 13. 图片格式转换
- 支持JPG、PNG、WebP等格式互转
- 支持批量处理
- 保持图片质量

### 14. 数据库转Java代码
- 支持MySQL、PostgreSQL等数据库
- 自动生成实体类和DAO代码
- 支持自定义包名和类名

### 15. 表情符号库
- 包含常用emoji表情
- 支持分类浏览和搜索
- 一键复制到剪贴板

### 16. API测试工具
- 支持GET、POST等多种请求方式
- 支持自定义请求头和参数
- 响应结果格式化显示

### 17. 用户脚本管理器
- 管理和运行自定义用户脚本
- 支持脚本启用/禁用
- 提供脚本编辑功能

### 18. 模块管理器
- 统一管理所有工具模块
- 支持自定义模块排序
- 快速访问常用工具

### 19. 仪表板
- 个性化首页
- 快速访问收藏的工具
- 使用统计和快捷操作

### 20. Web技术栈导航
- 收集优质的前端技术资源
- 包含框架、库、工具等分类
- 持续更新维护

## 🎯 特色功能

- **轻量级**: 单个扩展包含所有功能，无需安装多个工具
- **响应式设计**: 完美适配各种屏幕尺寸
- **深色模式**: 支持深色主题，保护视力
- **快捷键支持**: 支持键盘快捷键快速调用
- **数据同步**: 支持Chrome账户数据同步
- **离线使用**: 大部分功能无需网络连接

## 🔧 技术架构

### 前端技术栈
- **HTML5 + CSS3**: 响应式布局，支持现代浏览器
- **JavaScript ES6+**: 使用最新语法特性
- **jQuery**: 简化DOM操作和事件处理
- **CodeMirror**: 代码编辑器，支持语法高亮

### 扩展架构
- **Manifest V3**: 使用最新的Chrome扩展标准
- **模块化设计**: 各功能模块独立，便于维护
- **Service Worker**: 后台任务处理
- **Content Script**: 页面注入功能

## 📁 项目结构

```
gongfeng/
├── core/                    # 核心功能
│   ├── background.js       # 后台脚本
│   ├── content-script.js   # 内容脚本
│   ├── module-manager/     # 模块管理器
│   └── popup/              # 弹出窗口
├── modules/                # 功能模块
│   ├── api-tester/         # API测试工具
│   ├── calculator/         # 计算器
│   ├── code-beautifier/    # 代码美化
│   ├── color-picker/       # 颜色选择器
│   ├── cron-generator/     # CRON生成器
│   ├── dashboard/          # 仪表板
│   ├── db-to-java/         # 数据库转Java
│   ├── emoji/              # 表情符号
│   ├── encoder-decoder/    # 编码解码
│   ├── image-converter/    # 图片转换
│   ├── json-formatter/     # JSON格式化
│   ├── page-screenshot/    # 页面截图
│   ├── prompt-library/     # 提示词库
│   ├── qr-code/            # 二维码生成
│   ├── quickref/           # 快速参考
│   ├── regex-tester/       # 正则测试
│   ├── text-diff/          # 文本对比
│   ├── timestamp-converter/# 时间戳转换
│   ├── userscript-manager/ # 用户脚本管理
│   └── webStack/           # Web技术栈
├── shared/                 # 共享资源
│   ├── common.css          # 公共样式
│   ├── codemirror/         # 代码编辑器
│   └── ...                 # 其他共享文件
├── icons/                  # 图标资源
├── pages/                  # 独立页面
├── manifest.json           # 扩展配置文件
└── README.md               # 项目说明
```

## 🚦 开发指南

### 环境要求
- Node.js 14+
- Chrome浏览器 88+
- 代码编辑器（推荐VS Code）

### 开发步骤
1. 克隆项目代码
2. 在Chrome中加载扩展（开发者模式）
3. 修改代码后，在扩展页面点击刷新按钮

### 代码规范
- 使用ES6+语法
- 遵循Airbnb JavaScript规范
- 函数和变量使用有意义的命名
- 添加必要的注释说明

## 🤝 贡献指南

我们欢迎社区贡献！如果您想为项目做出贡献：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 贡献类型
- 🐛 Bug修复
- ✨ 新功能添加
- 📚 文档改进
- 🎨 UI/UX优化
- 🌐 国际化支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 维护者

- 项目创建者: [小蜜蜂工具箱团队](https://github.com/xiaomifeng)
- 主要维护者: 社区贡献者

## 📞 联系方式

- 问题反馈: [GitHub Issues](https://github.com/xiaomifeng/gongfeng/issues)
- 功能建议: [GitHub Discussions](https://github.com/xiaomifeng/gongfeng/discussions)
- 邮箱联系: support@xiaomifeng.com

## 🙏 致谢

感谢所有为项目做出贡献的开发者！

特别感谢以下开源项目：
- [CodeMirror](https://codemirror.net/) - 代码编辑器
- [jQuery](https://jquery.com/) - JavaScript库
- [CryptoJS](https://github.com/brix/crypto-js) - 加密库

---

⭐ 如果这个项目对您有帮助，请给我们一个星标支持！