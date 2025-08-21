// 模块配置文件 - 统一管理所有模块相关配置

// 定义所有可用模块
const availableModules = [
    {
        id: "json-formatter",
        name: 'JSON格式化工具',
        description: 'JSON/JSON5数据格式化、压缩、验证工具',
        icon: '📋',
        path: 'modules/json-formatter/json-formatter.html',
        category: '数据处理',
        keywords: ['json', 'format', '格式化', '数据']
    },
    {
        id: "calculator",
        name: '程序员计算器',
        description: '支持多进制转换的程序员专用计算器',
        icon: '🧮',
        path: 'modules/calculator/calculator.html',
        category: '计算工具',
        keywords: ['calculator', '计算器', '进制', '转换']
    },
    {
        id: "regex-tester",
        name: '正则表达式调试',
        description: '正则表达式测试、调试和学习工具',
        icon: '🔍',
        path: 'modules/regex-tester/regex-tester.html',
        category: '开发工具',
        keywords: ['regex', '正则', '调试', '测试']
    },
    {
        id: "emoji",
        name: 'Emoji表情工具',
        description: 'Emoji表情符号搜索、分类浏览和一键复制工具',
        icon: '😀',
        path: 'modules/emoji/emoji.html',
        category: '实用工具',
        keywords: ['emoji', '表情', '符号', '复制']
    },
    {
        id: "encoder-decoder",
        name: '编码解码',
        description: 'URL、Base64、HTML等多种编码解码工具',
        icon: '🔐',
        path: 'modules/encoder-decoder/encoder-decoder.html',
        category: '数据处理',
        keywords: ['encode', 'decode', '编码', '解码']
    },
    {
        id: "timestamp-converter",
        name: '时间戳转换',
        description: '时间戳与日期时间相互转换工具',
        icon: '⏰',
        path: 'modules/timestamp-converter/timestamp-converter.html',
        category: '时间工具',
        keywords: ['timestamp', '时间戳', '时间', '转换']
    },
    {
        id: "db-to-java",
        name: '数据库转Java对象',
        description: '数据库表结构转换为Java实体类',
        icon: '☕',
        path: 'modules/db-to-java/db-to-java.html',
        category: '代码生成',
        keywords: ['database', 'java', '数据库', '实体类']
    },
    {
        id: "cron-generator",
        name: 'Cron表达式生成器',
        description: 'Cron定时任务表达式生成和解析工具',
        icon: '⏲️',
        path: 'modules/cron-generator/cron-generator.html',
        category: '开发工具',
        keywords: ['cron', '定时', '表达式', '任务']
    },
    {
        id: "qr-code",
        name: '二维码工具',
        description: '二维码生成和识别工具',
        icon: '📱',
        path: 'modules/qr-code/qr-code.html',
        category: '实用工具',
        keywords: ['qr', 'qrcode', '二维码', '生成']
    },
    {
        id: "text-diff",
        name: '文本对比工具',
        description: '文本内容差异对比和高亮显示',
        icon: '📝',
        path: 'modules/text-diff/text-diff.html',
        category: '文本工具',
        keywords: ['diff', 'compare', '对比', '文本']
    },
    {
        id: "code-beautifier",
        name: '代码美化工具',
        description: '多语言代码格式化和美化工具',
        icon: '✨',
        path: 'modules/code-beautifier/code-beautifier.html',
        category: '开发工具',
        keywords: ['code', 'format', '代码', '美化']
    },
    {
        id: "image-converter",
        name: '图片格式转换',
        description: '图片格式转换和压缩工具',
        icon: '🖼️',
        path: 'modules/image-converter/image-converter.html',
        category: '图像工具',
        keywords: ['image', 'convert', '图片', '转换']
    },
    {
        id: "web-navigation",
        name: '优质设计网站',
        description: '收集优化的设计网站',
        icon: '🎖️',
        path: 'modules/web-navigation/web-navigation.html',
        category: '导航工具',
        keywords: ['navigation', '优质', '设计', '网站', '管理', 'web']
    },
    {
        id: "api-tester",
        name: 'API测试工具',
        description: 'HTTP API接口测试和调试工具',
        icon: '🌐',
        path: 'modules/api-tester/api-tester.html',
        category: '开发工具',
        keywords: ['api', 'http', '接口', '测试']
    },
    {
        id: "page-screenshot",
        name: '页面截图工具',
        description: '网页截图和标注工具',
        icon: '📷',
        path: 'modules/page-screenshot/page-screenshot.html',
        category: '实用工具',
        keywords: ['screenshot', '截图', '页面', '标注']
    },
    {
        id: "color-picker",
        name: '颜色转换及配色工具',
        description: '颜色格式转换和配色方案生成',
        icon: '🎨',
        path: 'modules/color-picker/color-picker.html',
        category: '设计工具',
        keywords: ['color', '颜色', '配色', '转换']
    },
    {
        id: "get-color",
        name: '颜色取色器',
        description: '页面颜色取色器',
        icon: '🎨',
        path: 'modules/get-color/get-color.html',
        category: '设计工具',
        keywords: ['color', '颜色', '取色', '转换']
    },
    {
        id: "userscript-manager",
        name: '网页油猴工具',
        description: '用户脚本管理和执行工具',
        icon: '🐒',
        path: 'modules/userscript-manager/userscript-manager.html',
        category: '开发工具',
        keywords: ['userscript', '油猴', '脚本', '管理']
    },
    {
        id: "prompt-library",
        name: 'Prompt库',
        description: 'AI提示词库和管理工具',
        icon: '💡',
        path: 'modules/prompt-library/prompt-library.html',
        category: 'AI工具',
        keywords: ['prompt', 'ai', '提示词', '库']
    },
    // {
    //     id: "quickref",
    //     name: 'QuickRef快速参考',
    //     description: '编程语言和工具快速参考手册',
    //     icon: '📚',
    //     path: 'modules/quickref/quickref.html',
    //     category: '参考工具',
    //     keywords: ['reference', '参考', '手册', '文档']
    // },
    {
        id: "dashboard",
        name: '页面性能监控',
        description: '页面性能分析、Web Vitals监控、加载时间统计',
        icon: '📊',
        path: 'modules/dashboard/dashboard.html',
        category: '开发工具',
        keywords: ['dashboard', '性能', '分析', 'web vitals', '加载时间']
    },
    {
        id: "cipin",
        name: '词频统计工具',
        description: '词频统计工具',
        icon: '🌍',
        path: 'modules/cipin/cipin.html',
        category: '开发工具',
        keywords: ['cipin', '词频', '工具']
    },
    {
        id: "textworkflow",
        name: '文本工作流工具',
        description: '文本处理、转换和批量操作工具集',
        icon: '📝',
        path: 'modules/textworkflow/textworkflow.html',
        category: '文本处理',
        keywords: ['textworkflow', '文本', '处理', '转换', '批量']
    },
    {
        id: "pinyin-converter",
        name: '拼音转换工具',
        description: '汉字转拼音、拼音转汉字工具',
        icon: '🇨🇳',
        path: 'modules/pinyin-converter/pinyin-converter.html',
        category: '实用工具',
        keywords: ['pinyin', '拼音', '转换', '汉字']
    },
    {
        id: "frontend-toolbox",
        name: '前端工具箱',
        description: 'CSS生成器、代码格式化、颜色工具等前端开发必备工具',
        icon: '🛠️',
        path: 'modules/frontend-toolbox/frontend-toolbox.html',
        category: '开发工具',
        keywords: ['frontend', '前端', 'css', '代码格式化', '颜色工具', '渐变', '阴影', 'flexbox']
    }
];

// 模块ID常量（自动生成）
const MODULE_IDS = Object.freeze(
    Object.fromEntries(availableModules.map(m => [m.id.toUpperCase().replace(/-/g, '_'), m.id]))
);

// 默认安装模块列表（自动生成）
const defaultInstalled = availableModules.filter(m => m.default).map(m => m.id);

// 模块ID到工具名的映射（自动生成）
const moduleToToolMap = Object.fromEntries(availableModules.map(m => [m.id, m.id]));

function getPresetConfigs() {
    return {
        developer: {
            name: '开发者套装',
            modules: ['json-formatter', 'regex-tester', 'encoder-decoder', 'timestamp-converter']
        },
        designer: {
            name: '设计师套装',
            modules: ['color-picker', 'get-color', 'qr-code', 'image-converter', 'page-screenshot', 'dashboard']
        },
        productivity: {
            name: '效率办公',
            modules: ['text-diff', 'api-tester', 'cron-generator', 'quickref']
        },
        minimal: {
            name: '精简模式',
            modules: ['json-formatter', 'calculator', 'get-color', 'page-screenshot']
        },
        full: {
            name: '完整套装',
            modules: availableModules.map(m => m.id)
        }
    };
}

// 生成工具HTML的函数
function generateToolsHTML() {
    return availableModules.map(module => {
        const keywords = module.keywords.join(' ');
        return `
            <!-- ${module.name} -->
            <div class="tool-item" data-tool="${moduleToToolMap[module.id]}" data-keywords="${keywords}">
                <div class="tool-icon">${module.icon}</div>
                <div class="tool-info">
                    <h3>${module.name}</h3>
                    <p>${module.description}</p>
                </div>
                <div class="tool-arrow">→</div>
            </div>
        `;
    }).join('\n');
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 环境
    module.exports = {
        MODULE_IDS,
        defaultInstalled,
        moduleToToolMap,
        availableModules,
        generateToolsHTML,
        getPresetConfigs
    };
} else if (typeof window !== 'undefined') {
    // 浏览器环境
    window.ModulesConfig = {
        MODULE_IDS,
        defaultInstalled,
        moduleToToolMap,
        availableModules,
        generateToolsHTML,
        getPresetConfigs
    };
}
