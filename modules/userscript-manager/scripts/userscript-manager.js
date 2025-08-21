class UserScriptManager {
    constructor() {
        this.tasks = [];
        this.runningTasks = new Map();
        this.taskIdCounter = 1;
        this.isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        this.marketScripts = [];
        this.editingTaskId = null; // 用于跟踪正在编辑的任务ID
        this.exampleScripts = null; // 存储独立的示例脚本
        this.isFullscreen = false; // 全屏状态
        this.originalParent = null; // 保存原始父容器

        this.loadExampleScripts().then(() => {
            this.loadTasks().then(() => {
                this.init();
            });
        });
    }

    async loadExampleScripts() {
        try {
            // 直接使用内置的示例脚本数据
            this.exampleScripts = {
                'baidu-logo-replace': {
                    name: '百度Logo替换为Google',
                    description: '将百度首页的Logo替换为Google Logo',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://www.baidu.com/*'],
                    scriptCode: `// 百度Logo替换脚本\n(function() {\n    'use strict';\n    const logo = document.querySelector('#lg img');\n    if (logo) {\n        logo.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';\n        logo.alt = 'Google';\n    }\n})();`
                },
                'auto-refresh': {
                    name: '网页自动刷新器',
                    description: '为网页添加自动刷新功能，可自定义刷新间隔',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 自动刷新脚本\n(function() {\n    'use strict';\n    const interval = prompt('请输入刷新间隔（秒）:', '60');\n    if (interval && !isNaN(interval)) {\n        setInterval(() => location.reload(), interval * 1000);\n    }\n})();`
                },
                'github-enhancer': {
                    name: 'GitHub增强器',
                    description: '为GitHub添加便捷功能，如一键复制仓库地址等',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://github.com/*'],
                    scriptCode: `// GitHub增强功能\n(function() {\n    'use strict';\n    \n    function addCopyRepoButton() {\n        const repoHeader = document.querySelector('[data-testid="repository-container-header"]');\n        if (!repoHeader) return;\n        \n        const copyBtn = document.createElement('button');\n        copyBtn.innerHTML = '📋 复制仓库地址';\n        copyBtn.style.cssText = \`\n            background: #238636;\n            color: white;\n            border: none;\n            padding: 6px 12px;\n            border-radius: 6px;\n            cursor: pointer;\n            margin-left: 8px;\n            font-size: 14px;\n        \`;\n        \n        copyBtn.addEventListener('click', () => {\n            const repoUrl = window.location.href.split('?')[0].split('#')[0];\n            navigator.clipboard.writeText(repoUrl + '.git').then(() => {\n                copyBtn.innerHTML = '✅ 已复制';\n                setTimeout(() => {\n                    copyBtn.innerHTML = '📋 复制仓库地址';\n                }, 2000);\n            });\n        });\n        \n        const actionList = repoHeader.querySelector('[data-testid="repository-container-header"] .d-flex');\n        if (actionList) {\n            actionList.appendChild(copyBtn);\n        }\n    }\n    \n    // 初始化\n    addCopyRepoButton();\n})();`
                },
                'auto-login': {
                    name: '自动登录助手',
                    description: '自动填充登录表单并提交（需要预先配置账号信息）',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 自动登录助手\n(function() {\n    'use strict';\n    \n    const config = {\n        'github.com': { user: '#login_field', pass: '#password', submit: '[name="commit"]' },\n        'stackoverflow.com': { user: '#email', pass: '#password', submit: '#submit-button' },\n        'default': { user: 'input[type="email"], input[name*="user"], input[name*="login"]', pass: 'input[type="password"]', submit: 'button[type="submit"], input[type="submit"]' }\n    };\n    \n    const domain = window.location.hostname;\n    const siteConfig = config[domain] || config.default;\n    \n    const userField = document.querySelector(siteConfig.user);\n    const passField = document.querySelector(siteConfig.pass);\n    const submitBtn = document.querySelector(siteConfig.submit);\n    \n    if (userField && passField) {\n        const savedUser = localStorage.getItem('autoLogin_user_' + domain);\n        const savedPass = localStorage.getItem('autoLogin_pass_' + domain);\n        \n        if (savedUser && savedPass) {\n            userField.value = savedUser;\n            passField.value = atob(savedPass);\n            \n            if (submitBtn && confirm('检测到保存的登录信息，是否自动登录？')) {\n                submitBtn.click();\n            }\n        }\n    }\n})();`
                },
                'ad-blocker': {
                    name: '智能广告屏蔽',
                    description: '智能识别并屏蔽网页中的广告内容',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 智能广告屏蔽器\n(function() {\n    'use strict';\n    \n    const adSelectors = [\n        '[class*="ad"]', '[id*="ad"]', '[class*="advertisement"]',\n        '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',\n        'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',\n        '.google-ads', '.adsense', '[data-ad-slot]'\n    ];\n    \n    let blockedCount = 0;\n    \n    function blockAds() {\n        adSelectors.forEach(selector => {\n            document.querySelectorAll(selector).forEach(el => {\n                if (!el.dataset.adBlocked) {\n                    el.style.display = 'none';\n                    el.dataset.adBlocked = 'true';\n                    blockedCount++;\n                }\n            });\n        });\n    }\n    \n    // 初始屏蔽\n    blockAds();\n    \n    // 监听DOM变化\n    const observer = new MutationObserver(blockAds);\n    observer.observe(document.body, { childList: true, subtree: true });\n    \n    console.log('广告屏蔽器已启动，已屏蔽', blockedCount, '个广告元素');\n})();`
                },
                'dark-mode': {
                    name: '万能夜间模式',
                    description: '为任何网站添加夜间模式，保护眼睛',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 深色模式切换器\n(function() {\n    'use strict';\n    \n    let isDark = localStorage.getItem('darkMode') === 'true';\n    \n    function applyDarkMode() {\n        const existingStyle = document.getElementById('darkModeStyles');\n        if (existingStyle) {\n            existingStyle.remove();\n        }\n        \n        if (isDark) {\n            const darkStyles = document.createElement('style');\n            darkStyles.id = 'darkModeStyles';\n            darkStyles.textContent = \`\n                * {\n                    background-color: #1a1a1a !important;\n                    color: #e0e0e0 !important;\n                    border-color: #333 !important;\n                }\n                img, video {\n                    opacity: 0.8 !important;\n                }\n                a {\n                    color: #4da6ff !important;\n                }\n            \`;\n            document.head.appendChild(darkStyles);\n        }\n    }\n    \n    function createToggleButton() {\n        const toggleBtn = document.createElement('button');\n        toggleBtn.innerHTML = isDark ? '☀️' : '🌙';\n        toggleBtn.style.cssText = \`\n            position: fixed; top: 20px; left: 20px; z-index: 10000;\n            background: #333; color: white; border: none; border-radius: 50%;\n            width: 50px; height: 50px; cursor: pointer; font-size: 20px;\n        \`;\n        \n        toggleBtn.addEventListener('click', () => {\n            isDark = !isDark;\n            localStorage.setItem('darkMode', isDark);\n            toggleBtn.innerHTML = isDark ? '☀️' : '🌙';\n            applyDarkMode();\n        });\n        \n        document.body.appendChild(toggleBtn);\n    }\n    \n    applyDarkMode();\n    createToggleButton();\n})();`
                },
                'page-translator': {
                    name: '网页翻译器',
                    description: '一键翻译网页内容，支持多种语言',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 网页翻译器\n(function() {\n    'use strict';\n    \n    function createTranslateButton() {\n        const translateBtn = document.createElement('button');\n        translateBtn.innerHTML = '🌐 翻译';\n        translateBtn.style.cssText = \`\n            position: fixed; top: 20px; right: 20px; z-index: 10000;\n            background: #007bff; color: white; border: none; border-radius: 5px;\n            padding: 10px 15px; cursor: pointer; font-size: 14px;\n            box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n        \`;\n        \n        translateBtn.addEventListener('click', () => {\n            const text = document.body.innerText;\n            const targetLang = prompt('请输入目标语言代码 (zh=中文, en=英文, ja=日文):', 'zh');\n            if (targetLang) {\n                // 这里可以集成翻译API\n                alert('翻译功能需要配置翻译API密钥');\n            }\n        });\n        \n        document.body.appendChild(translateBtn);\n    }\n    \n    createTranslateButton();\n})();`
                },
                'download-helper': {
                    name: '下载助手',
                    description: '增强下载功能，支持批量下载和下载管理',
                    author: 'UserScript Manager',
                    version: '1.0',
                    match: ['*://*/*'],
                    scriptCode: `// 下载助手\n(function() {\n    'use strict';\n    \n    const downloadExtensions = ['pdf', 'doc', 'docx', 'zip', 'rar', 'mp3', 'mp4', 'jpg', 'png'];\n    \n    function enhanceDownloadLinks() {\n        const links = document.querySelectorAll('a[href]');\n        links.forEach(link => {\n            const href = link.href.toLowerCase();\n            const hasDownloadExt = downloadExtensions.some(ext => href.includes('.' + ext));\n            \n            if (hasDownloadExt && !link.dataset.enhanced) {\n                link.dataset.enhanced = 'true';\n                link.style.cssText += 'background: #28a745; color: white; padding: 2px 6px; border-radius: 3px; margin-left: 5px;';\n                link.innerHTML += ' 📥';\n                \n                link.addEventListener('click', (e) => {\n                    console.log('下载文件:', link.href);\n                });\n            }\n        });\n    }\n    \n    function createDownloadPanel() {\n        const panel = document.createElement('div');\n        panel.innerHTML = '📥 下载助手';\n        panel.style.cssText = \`\n            position: fixed; bottom: 20px; right: 20px; z-index: 10000;\n            background: #28a745; color: white; padding: 10px; border-radius: 5px;\n            cursor: pointer; font-size: 14px;\n        \`;\n        \n        panel.addEventListener('click', () => {\n            alert('下载助手面板 - 功能开发中');\n        });\n        \n        document.body.appendChild(panel);\n    }\n    \n    enhanceDownloadLinks();\n    createDownloadPanel();\n    \n    // 监听DOM变化\n    const observer = new MutationObserver(enhanceDownloadLinks);\n    observer.observe(document.body, { childList: true, subtree: true });\n})();`
                }
            };
            console.log('成功加载示例脚本文件');
        } catch (error) {
            console.error('加载示例脚本文件失败:', error);
            this.exampleScripts = {};
        }
    }

    getExampleScript(scriptId) {
        if (!this.exampleScripts) {
            console.error('示例脚本未加载');
            return '// 示例脚本加载失败';
        }
        
        const script = this.exampleScripts[scriptId];
        if (script && script.scriptCode) {
            return script.scriptCode;
        }
        
        return '// 未找到对应的示例脚本';
    }

    async loadTasks() {
        try {
            // 优先从chrome.storage.local读取数据
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await new Promise((resolve) => {
                    chrome.storage.local.get(['userscript_tasks'], (result) => {
                        if (chrome.runtime.lastError) {
                            console.error('从chrome.storage读取任务失败:', chrome.runtime.lastError);
                            resolve(null);
                        } else {
                            resolve(result.userscript_tasks);
                        }
                    });
                });

                if (result && Array.isArray(result)) {
                    this.tasks = result;
                    console.log('从chrome.storage加载任务:', this.tasks.length, '个');
                } else {
                    // 检查localStorage中是否有数据需要迁移
                    const localTasks = JSON.parse(localStorage.getItem('userscript_tasks') || '[]');
                    if (localTasks.length > 0) {
                        console.log('发现localStorage中的任务数据，开始迁移到chrome.storage:', localTasks.length, '个');
                        this.tasks = localTasks;
                        // 迁移数据到chrome.storage
                        await this.migrateToChromeStorage();
                    } else {
                        this.tasks = [];
                        console.log('没有找到任何任务数据');
                    }
                }
            } else {
                // 降级到localStorage
                this.tasks = JSON.parse(localStorage.getItem('userscript_tasks') || '[]');
                console.log('从localStorage加载任务:', this.tasks.length, '个');
            }

            this.taskIdCounter = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        } catch (error) {
            console.error('加载任务失败:', error);
            this.tasks = [];
            this.taskIdCounter = 1;
        }
    }

    async migrateToChromeStorage() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && this.tasks.length > 0) {
                await new Promise((resolve, reject) => {
                    chrome.storage.local.set({
                        'userscript_tasks': this.tasks
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('迁移到chrome.storage失败:', chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        } else {
                            console.log('数据迁移到chrome.storage成功，任务数量:', this.tasks.length);
                            // 迁移成功后清除localStorage中的数据
                            localStorage.removeItem('userscript_tasks');
                            console.log('已清除localStorage中的旧数据');
                            resolve();
                        }
                    });
                });
            }
        } catch (error) {
            console.error('数据迁移失败:', error);
        }
    }

    init() {
        this.initTheme();
        this.initCodeMirror();
        this.bindEvents();
        this.initTaskManager();
        this.updateStats();
        this.loadMarketScripts();

    }

    // 初始化主题
    initTheme() {
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.getElementById('themeToggle').innerHTML = '☀️ 浅色模式';
        }
    }

    // 初始化CodeMirror编辑器
    initCodeMirror() {
        const scriptCodeElement = document.getElementById('scriptCode');
        if (scriptCodeElement && typeof CodeMirror !== 'undefined') {
            try {
                this.scriptCodeEditor = CodeMirror.fromTextArea(scriptCodeElement, {
                mode: 'javascript',
                theme: 'default',
                lineNumbers: true,
                lineWrapping: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                indentUnit: 4,
                tabSize: 4,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                },
                placeholder: "输入要注入的JavaScript代码"
            });

            // 设置默认值
            this.scriptCodeEditor.setValue("alert('欢迎你来到百度！');");

                // 监听内容变化
                this.scriptCodeEditor.on('change', () => {
                    this.scriptCodeEditor.save(); // 同步到原始textarea
                });
            } catch (error) {
                console.warn('CodeMirror初始化失败，使用普通文本框:', error);
                this.scriptCodeEditor = null;
                // 设置默认值到普通文本框
                scriptCodeElement.value = "alert('欢迎你来到百度！');"; 
            }
        } else {
            console.warn('CodeMirror不可用或scriptCode元素不存在，使用普通文本框');
        }
    }

    // 更新统计面板
    updateStats() {
        try {
            const totalScripts = this.tasks.length;
            const runningTasks = this.tasks.filter(task => task.status === 'running').length;
            const todayExecutions = this.getTodayExecutions();

            const totalScriptsEl = document.getElementById('totalScripts');
            const runningTasksEl = document.getElementById('runningTasks');
            const todayExecutionsEl = document.getElementById('todayExecutions');

            if (totalScriptsEl) totalScriptsEl.textContent = totalScripts;
            if (runningTasksEl) runningTasksEl.textContent = runningTasks;
            if (todayExecutionsEl) todayExecutionsEl.textContent = todayExecutions;

            console.log('统计数据已更新:', {
                totalScripts,
                runningTasks,
                todayExecutions
            });
        } catch (error) {
            console.error('更新统计数据失败:', error);
        }
    }

    // 获取今日执行次数
    getTodayExecutions() {
        const today = new Date().toDateString();
        const executions = JSON.parse(localStorage.getItem('daily_executions') || '{}');
        return executions[today] || 0;
    }

    // 记录执行次数
    recordExecution() {
        const today = new Date().toDateString();
        const executions = JSON.parse(localStorage.getItem('daily_executions') || '{}');
        executions[today] = (executions[today] || 0) + 1;
        localStorage.setItem('daily_executions', JSON.stringify(executions));
        this.updateStats();
    }

    // 切换主题
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        localStorage.setItem('darkTheme', this.isDarkTheme.toString());

        const themeBtn = document.getElementById('themeToggle');
        themeBtn.innerHTML = this.isDarkTheme ? '☀️ 浅色模式' : '🌙 夜间模式';
    }

    // 加载脚本市场数据
    async loadMarketScripts() {
        try {
            // 从API获取市场脚本数据
            const response = await fetch('https://xmf.anyitv.com/market');
            
            if (response.ok) {
                const data = await response.json();
                
                // 检查API返回的数据结构
                let scriptsArray = [];
                if (data && data.success && data.result && Array.isArray(data.result.records)) {
                    // 新的API数据结构
                    scriptsArray = data.result.records;
                } else if (Array.isArray(data)) {
                    // 原始的API数据结构（直接返回数组）
                    scriptsArray = data;
                } else {
                    console.warn('API返回数据格式不正确:', data);
                    this.marketScripts = [];
                    this.renderMarketScripts();
                    return;
                }
                
                // 处理API返回的数据
                this.marketScripts = scriptsArray.map(item => {
                    try {
                        // 如果code字段是Base64编码，进行解码
                        let decodedCode = item.code;
                        if (item.code && typeof item.code === 'string') {
                            try {
                                console.log(`正在解码脚本 "${item.title}" 的代码，原始长度: ${item.code.length}`);
                                // 尝试Base64解码
                                decodedCode = atob(item.code);
                                // 确保是UTF-8编码
                                decodedCode = decodeURIComponent(escape(decodedCode));
                                // 处理转义字符，将\n转换为真正的换行符
                                decodedCode = decodedCode.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
                                console.log(`脚本 "${item.title}" 解码成功，解码后长度: ${decodedCode.length}`);
                            } catch (decodeError) {
                                // 如果解码失败，使用原始数据
                                console.warn(`脚本 "${item.title}" 代码解码失败，使用原始数据:`, decodeError);
                                decodedCode = item.code;
                            }
                        } else {
                            console.log(`脚本 "${item.title}" 没有代码内容或代码格式不正确`);
                        }
                        
                        return {
                            id: item.id,
                            title: item.title || '未知脚本',
                            description: item.description || '暂无描述',
                            category: item.category || 'utility',
                            rating: item.rating || 0,
                            downloads: item.downloads || 0,
                            author: item.author || '未知作者',
                            version: item.version || '1.0.0',
                            updated: item.updated || new Date().toISOString().split('T')[0],
                            tags: item.tags || [],
                            code: decodedCode
                        };
                    } catch (error) {
                        console.error('处理脚本数据失败:', error, item);
                        return null;
                    }
                }).filter(item => item !== null); // 过滤掉处理失败的项目
                
                const totalCount = data && data.result && data.result.total ? data.result.total : this.marketScripts.length;
                console.log('成功从API加载市场脚本:', this.marketScripts.length, '个，总计:', totalCount);
            } else {
                throw new Error('API请求失败: ' + response.status);
            }
        } catch (error) {
            console.error('加载市场脚本失败:', error);
            
            // 如果API请求失败，使用测试数据来验证解码功能
            console.log('使用测试数据来验证解码功能');
            const testData = {
                success: true,
                result: {
                    records: [
                        {
                            id: 1,
                            title: '测试脚本 - Base64编码',
                            description: '这是一个测试脚本，用于验证Base64解码功能',
                            category: 'utility',
                            rating: 4.5,
                            downloads: 1000,
                            author: '测试作者',
                            version: '1.0.0',
                            updated: '2025-01-01',
                            tags: ['测试', '解码'],
                            code: btoa(unescape(encodeURIComponent('// 这是解码后的测试脚本\nconsole.log("Hello from decoded script!");\n\n// 测试中文注释\nfunction testFunction() {\n    alert("脚本解码成功！");\n}\n\ntestFunction();')))
                        },
                        {
                            id: 2,
                            title: '换行符测试脚本',
                            description: '测试\\n转义字符是否能正确转换为换行符',
                            category: 'utility',
                            rating: 4.0,
                            downloads: 500,
                            author: '测试作者2',
                            version: '1.1.0',
                            updated: '2025-01-01',
                            tags: ['测试', '换行符'],
                            code: btoa(unescape(encodeURIComponent('// 广告屏蔽器增强版\\n// 强力屏蔽各种广告，提升浏览体验\\n// 作者: AdBlocker Pro\\n// 版本: 2.1.0\\n\\n(function() {\\n    "use strict";\\n    \\n    // 广告选择器列表\\n    const adSelectors = [\\n        ".ad", ".ads", ".advertisement", ".banner",\\n        "[class*=\\\\"ad-\\\\"]", "[id*=\\\\"ad-\\\\"]", "[class*=\\\\"ads-\\\\"]",\\n        ".google-ads", ".adsense", ".adsbygoogle"\\n    ];\\n    \\n    // 移除广告元素\\n    function removeAds() {\\n        adSelectors.forEach(selector => {\\n            const elements = document.querySelectorAll(selector);\\n            elements.forEach(el => {\\n                el.style.display = "none";\\n                console.log("已屏蔽广告元素:", el);\\n            });\\n        });\\n    }\\n    \\n    // 页面加载完成后执行\\n    if (document.readyState === "loading") {\\n        document.addEventListener("DOMContentLoaded", removeAds);\\n    } else {\\n        removeAds();\\n    }\\n    \\n    // 监听动态添加的广告\\n    const observer = new MutationObserver(removeAds);\\n    observer.observe(document.body, {\\n        childList: true,\\n        subtree: true\\n    });\\n    \\n    console.log("广告屏蔽器增强版已启动");\\n})();')))
                        }
                    ],
                    total: 2
                }
            };
            
            // 模拟API响应处理
            let scriptsArray = [];
            if (testData && testData.success && testData.result && Array.isArray(testData.result.records)) {
                scriptsArray = testData.result.records;
            }
            
            // 处理测试数据
            this.marketScripts = scriptsArray.map(item => {
                try {
                    // 如果code字段是Base64编码，进行解码
                    let decodedCode = item.code;
                    if (item.code && typeof item.code === 'string') {
                        try {
                            console.log(`正在解码脚本 "${item.title}" 的代码，原始长度: ${item.code.length}`);
                            // 尝试Base64解码
                            decodedCode = atob(item.code);
                            // 确保是UTF-8编码
                            decodedCode = decodeURIComponent(escape(decodedCode));
                            console.log(`脚本 "${item.title}" 解码成功，解码后长度: ${decodedCode.length}`);
                        } catch (decodeError) {
                            // 如果解码失败，使用原始数据
                            console.warn(`脚本 "${item.title}" 代码解码失败，使用原始数据:`, decodeError);
                            decodedCode = item.code;
                        }
                    } else {
                        console.log(`脚本 "${item.title}" 没有代码内容或代码格式不正确`);
                    }
                    
                    return {
                        id: item.id,
                        title: item.title || '未知脚本',
                        description: item.description || '暂无描述',
                        category: item.category || 'utility',
                        rating: item.rating || 0,
                        downloads: item.downloads || 0,
                        author: item.author || '未知作者',
                        version: item.version || '1.0.0',
                        updated: item.updated || new Date().toISOString().split('T')[0],
                        tags: item.tags || [],
                        code: decodedCode
                    };
                } catch (error) {
                    console.error('处理脚本数据失败:', error, item);
                    return null;
                }
            }).filter(item => item !== null);
            
            console.log('使用测试数据加载市场脚本:', this.marketScripts.length, '个');
        }
        
        this.renderMarketScripts();
    }



    bindEvents() {
        // 标签页切换事件
        this.setupTabNavigation();

        // 顶部工具栏事件（已移除相关按钮）

        // 脚本配置事件
        document.getElementById('saveScript').addEventListener('click', () => this.saveScript());
        document.getElementById('clearForm').addEventListener('click', () => this.clearForm());
        // 移除自动刷新复选框事件监听器（已改为直接输入刷新间隔）
        
        // 全屏编辑器事件
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('exitFullscreenBtn').addEventListener('click', () => this.exitFullscreen());
        
        // ESC键退出全屏，F11键切换全屏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            } else if (e.key === 'F11' && document.activeElement && document.activeElement.id === 'scriptCode') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });

        // 预览控制事件
        document.getElementById('copyScript').addEventListener('click', () => this.copyScript());
        document.getElementById('downloadScript').addEventListener('click', () => this.downloadScript());
        document.getElementById('closePreview').addEventListener('click', () => this.closePreview());

        // 脚本市场事件
        document.getElementById('marketSearch').addEventListener('input', () => this.filterMarketScripts());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterMarketScripts());
        document.getElementById('sortFilter').addEventListener('change', () => this.filterMarketScripts());

        // 全局模态框事件委托
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-load-market-modal')) {
                const scriptId = e.target.dataset.scriptId;
                if (scriptId) {
                    this.loadMarketScript(parseInt(scriptId));
                    e.target.closest('.modal-overlay').remove();
                }
            } else if (e.target.classList.contains('btn-close-modal')) {
                e.target.closest('.modal-overlay').remove();
            }
        });



        this.setupTaskEventListeners();
    }

    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // 移除所有活动状态
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // 添加活动状态
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    initTaskManager() {
        this.renderTaskList();

    }

    setupTaskEventListeners() {

        // 任务列表控制事件
        document.getElementById('runAllTasks').addEventListener('click', () => this.runAllTasks());
        document.getElementById('stopAllTasks').addEventListener('click', () => this.stopAllTasks());
        document.getElementById('refreshTasks').addEventListener('click', () => this.refreshTaskStatus());

        // 筛选事件
        document.getElementById('statusFilter').addEventListener('change', () => this.filterTasks());
        document.getElementById('priorityFilter').addEventListener('change', () => this.filterTasks());
        document.getElementById('taskSearch').addEventListener('input', () => this.filterTasks());

        // 任务列表事件委托
        document.getElementById('taskListContainer').addEventListener('click', (e) => {
            const taskId = e.target.closest('.task-item')?.dataset.taskId;
            if (taskId) {
                this.handleTaskAction(e.target, parseInt(taskId));
            }
        });
    }

    // 脚本保存功能
    saveScript() {
        const config = this.getScriptConfig();
        if (!this.validateConfig(config)) return;

        if (this.editingTaskId) {
            // 更新现有任务
            const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].name = config.name;
                this.tasks[taskIndex].description = `油猴脚本：${config.name}`;
                this.tasks[taskIndex].scriptConfig = config;

                this.saveTasks();
                this.renderTaskList();
                this.updateStats();

                // 清除编辑状态
                this.editingTaskId = null;

                // 切换到任务管理标签页
                document.querySelector('[data-tab="task-management"]').click();

                this.showNotification(`任务 "${config.name}" 已更新`, 'success');
                return;
            }
        }

        // 创建新任务并保存到任务管理
        const taskData = {
            id: this.taskIdCounter++,
            name: config.name,
            description: `油猴脚本：${config.name}`,
            priority: 'medium',
            executionPlan: 'manual',
            scheduleTime: '',
            repeatInterval: 60,
            status: 'pending',

            createdAt: new Date().toISOString(),
            scriptConfig: config
        };

        this.tasks.push(taskData);
        this.saveTasks();
        this.renderTaskList();
        this.updateStats();

        // 切换到任务管理标签页
        document.querySelector('[data-tab="task-management"]').click();

        this.showNotification(`脚本 "${config.name}" 已保存到任务管理列表`, 'success');
    }

    getScriptConfig() {
        const refreshInterval = parseInt(document.getElementById('refreshInterval').value) || 0;
        return {
            name: document.getElementById('scriptName').value.trim(),
            matchRules: document.getElementById('matchRules').value.trim().split('\n').filter(rule => rule.trim()),
            autoRefresh: refreshInterval > 0,
            refreshInterval: refreshInterval,
            dependencies: document.getElementById('dependencies').value.trim().split('\n').filter(dep => dep.trim()),
            scriptCode: this.scriptCodeEditor ? this.scriptCodeEditor.getValue().trim() : document.getElementById('scriptCode').value.trim()
        };
    }

    validateConfig(config) {
        if (!config.name) {
            this.showNotification(`请输入脚本名称`, 'error');
            return false;
        }
        if (config.matchRules.length === 0) {
            this.showNotification(`请输入至少一个网址匹配规则`, 'error');
            return false;
        }
        if (!config.scriptCode) {
            this.showNotification(`请输入注入脚本代码`, 'error');
            return false;
        }
        return true;
    }

    buildUserScript(config) {
        let script = `// ==UserScript==\n`;
        script += `// @name         ${config.name}\n`;
        script += `// @namespace    http://tampermonkey.net/\n`;
        script += `// @version      1.0\n`;
        script += `// @description  ${config.name}\n`;
        script += `// @author       UserScript Manager\n`;

        // 添加匹配规则
        config.matchRules.forEach(rule => {
            script += `// @match        ${rule}\n`;
        });

        // 添加依赖
        config.dependencies.forEach(dep => {
            script += `// @require      ${dep}\n`;
        });

        script += `// @grant        none\n`;
        script += `// ==/UserScript==\n\n`;

        script += `(function() {\n`;
        script += `    'use strict';\n\n`;

        // 添加自动刷新功能
        if (config.autoRefresh) {
            script += `    // 自动刷新功能\n`;
            script += `    setTimeout(() => {\n`;
            script += `        location.reload();\n`;
            script += `    }, ${config.refreshInterval * 1000});\n\n`;
        }

        // 添加用户脚本代码
        script += `    // 用户自定义代码\n`;
        script += `    ${config.scriptCode}\n`;

        script += `})();`;

        return script;
    }

    // 新增：在新窗口中测试脚本
    testScriptInNewWindow(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || !task.scriptConfig) {
            this.showNotification(`任务不存在或没有脚本配置`, 'error');
            return;
        }

        const config = task.scriptConfig;
        const testUrl = config.matchRules[0] || 'about:blank';

        // 创建测试页面HTML
        const testPageHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>脚本测试 - ${config.name}</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .test-header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .test-console { background: #000; color: #0f0; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: auto; }
                    .test-controls { margin: 10px 0; }
                    .btn { padding: 8px 15px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
                    .btn-primary { background: #007bff; color: white; }
                    .btn-success { background: #28a745; color: white; }
                    .btn-danger { background: #dc3545; color: white; }
                </style>
            </head>
            <body>
                <div class="test-header">
                    <h2>🧪 脚本测试环境</h2>
                    <p><strong>脚本名称:</strong> ${config.name}</p>
                    <p><strong>目标URL:</strong> ${testUrl}</p>
                    <p><strong>测试时间:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="test-controls">
                    <button class="btn btn-primary" onclick="executeTestScript()">▶️ 执行脚本</button>
                    <button class="btn btn-success" onclick="clearConsole()">🗑️ 清空控制台</button>
                    <button class="btn btn-danger" onclick="window.close()">❌ 关闭测试</button>
                </div>
                
                <div id="testConsole" class="test-console">
                    <div>测试控制台已就绪...</div>
                </div>
                
                <script>
                    // 重写console方法以显示在测试控制台
                    const originalConsole = { ...console };
                    const testConsole = document.getElementById('testConsole');
                    
                    function addToConsole(type, ...args) {
                        const div = document.createElement('div');
                        div.style.color = type === 'error' ? '#f00' : type === 'warn' ? '#ff0' : '#0f0';
                        div.textContent = '[' + new Date().toLocaleTimeString() + '] ' + args.join(' ');
                        testConsole.appendChild(div);
                        testConsole.scrollTop = testConsole.scrollHeight;
                        originalConsole[type](...args);
                    }
                    
                    console.log = (...args) => addToConsole('log', ...args);
                    console.error = (...args) => addToConsole('error', ...args);
                    console.warn = (...args) => addToConsole('warn', ...args);
                    console.info = (...args) => addToConsole('info', ...args);
                    
                    function clearConsole() {
                        testConsole.innerHTML = '<div>控制台已清空...</div>';
                    }
                    
                    function executeTestScript() {
                        console.log('开始执行脚本...');
                        try {
                            // 使用Function构造函数安全执行脚本
                            const scriptFunction = new Function(\`${config.scriptCode.replace(/`/g, '\\`')}\`);
                            scriptFunction();
                            console.log('脚本执行完成');
                        } catch (error) {
                            console.error('脚本执行失败:', error.message);
                            console.error('错误堆栈:', error.stack);
                        }
                    }
                    
                    // 页面加载完成后自动执行一次
                    window.addEventListener('load', () => {
                        console.log('测试环境加载完成');
                        setTimeout(() => {
                            console.log('自动执行脚本...');
                            executeTestScript();
                        }, 1000);
                    });
                </script>
            </body>
            </html>
        `;

        // 在新窗口中打开测试页面
        const testWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        testWindow.document.write(testPageHtml);
        testWindow.document.close();

        this.showNotification(`脚本测试窗口已打开`, 'info');
    }





    // 新增：通知系统
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10001;
            background: ${colors[type] || colors.info}; color: white;
            padding: 15px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif; font-size: 14px; max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);

        // 添加CSS动画
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showScriptPreview(script) {
        document.getElementById('scriptContent').textContent = script;
        document.getElementById('scriptPreview').style.display = 'block';
        document.getElementById('scriptPreview').scrollIntoView({ behavior: 'smooth' });
    }

    copyScript() {
        const scriptContent = document.getElementById('scriptContent').textContent;
        navigator.clipboard.writeText(scriptContent).then(() => {
            this.showNotification(`脚本已复制到剪贴板`, 'success');
        }).catch(() => {
            this.showNotification(`复制失败，请手动复制`, 'error');
        });
    }

    downloadScript() {
        const scriptContent = document.getElementById('scriptContent').textContent;
        const scriptName = document.getElementById('scriptName').value.trim() || 'userscript';
        const blob = new Blob([scriptContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${scriptName}.user.js`;
        a.click();
        URL.revokeObjectURL(url);
    }

    closePreview() {
        document.getElementById('scriptPreview').style.display = 'none';
    }

    clearForm() {
        document.getElementById('scriptName').value = '';
        document.getElementById('matchRules').value = '';
        document.getElementById('refreshInterval').value = '0';
        document.getElementById('dependencies').value = '';
        if (this.scriptCodeEditor) {
            this.scriptCodeEditor.setValue('');
        } else {
            document.getElementById('scriptCode').value = '';
        }

        setTimeout(() => {
            this.scriptCodeEditor.refresh();
        }, 0);

        // 清除编辑状态
        this.editingTaskId = null;
    }



    // 任务管理功能
    createTaskFromCurrentScript() {
        const config = this.getScriptConfig();
        if (!this.validateConfig(config)) return;

        document.getElementById('taskName').value = config.name;
        document.getElementById('taskDescription').value = `自动生成的任务：${config.name}`;
        this.showNotification(`已将当前脚本配置填入任务表单，请完善任务信息后添加`, 'success');
        document.querySelector('.task-management').scrollIntoView({ behavior: 'smooth' });
    }

    addTask() {
        const taskData = {
            id: this.taskIdCounter++,
            name: document.getElementById('taskName').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            priority: document.getElementById('taskPriority').value,
            executionPlan: document.getElementById('executionPlan').value,
            scheduleTime: document.getElementById('scheduleTime').value,
            repeatInterval: parseInt(document.getElementById('repeatInterval').value) || 60,
            status: 'pending',
            createdAt: new Date().toISOString(),
            scriptConfig: this.getScriptConfig()
        };

        if (!taskData.name) {
            this.showNotification(`请输入任务名称`, 'error');
            return;
        }

        this.tasks.push(taskData);
        this.saveTasks();
        this.renderTaskList();
        this.updateStats();
        this.clearTaskForm();
        this.showNotification(`任务添加成功`, 'success');
    }

    clearTaskForm() {
        document.getElementById('taskName').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('executionPlan').value = 'manual';
        document.getElementById('scheduleTime').value = '';
        document.getElementById('repeatInterval').value = '60';
        this.toggleScheduleOptions('manual');
    }

    toggleScheduleOptions(plan) {
        const scheduleOptions = document.getElementById('scheduleOptions');
        scheduleOptions.style.display = (plan === 'scheduled' || plan === 'repeat') ? 'block' : 'none';
    }

    renderTaskList() {
        const container = document.getElementById('taskListContainer');

        if (this.tasks.length === 0) {
            container.innerHTML = '<div class="task-item"><p>暂无任务，请添加任务</p></div>';
            return;
        }

        container.innerHTML = this.tasks.map(task => this.renderTaskItem(task)).join('');
    }

    renderTaskItem(task) {
        const priorityClass = `priority-${task.priority}`;
        const statusClass = `status-${task.status}`;
        const isRunning = task.status === 'running';

        return `
            <div class="task-item ${priorityClass}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title-group">
                        <h3 class="task-title">${task.name}</h3>
                    </div>
                    <span class="task-status ${statusClass}">${this.getStatusText(task.status)}</span>
                </div>
                <div class="task-content-row">
                    <div class="task-info">
                        <div class="task-description">${task.description}</div>
                        <div class="task-meta">
                            <span>优先级: ${this.getPriorityText(task.priority)}</span>
                            <span>执行计划: ${this.getExecutionPlanText(task.executionPlan)}</span>
                            <span>创建时间: ${new Date(task.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        ${isRunning ?
                '<button class="btn btn-warning btn-stop" data-action="stop">⏹️ 停止</button>' :
                '<button class="btn btn-success btn-run" data-action="run">▶️ 运行</button>'
            }
                        ${task.scriptConfig ?
                '<button class="btn btn-secondary btn-test" data-action="test">🧪 测试</button>' : ''
            }
                        <button class="btn btn-info btn-edit" data-action="edit">✏️ 编辑</button>
                        <button class="btn btn-danger btn-delete" data-action="delete">🗑️ 删除</button>
                    </div>
                </div>
            </div>
        `;
    }

    getPriorityText(priority) {
        const map = { high: '高', medium: '中', low: '低' };
        return map[priority] || priority;
    }

    getStatusText(status) {
        const map = {
            pending: '待执行',
            running: '运行中',
            completed: '已完成',
            failed: '失败'
        };
        return map[status] || status;
    }

    getExecutionPlanText(plan) {
        const map = {
            manual: '手动执行',
            scheduled: '定时执行',
            repeat: '重复执行'
        };
        return map[plan] || plan;
    }

    handleTaskAction(target, taskId) {
        const action = target.dataset.action;
        if (!action) return;

        switch (action) {
            case 'run':
                this.runTask(taskId);
                break;
            case 'stop':
                this.stopTask(taskId);
                break;
            case 'edit':
                this.editTask(taskId);
                break;
            case 'delete':
                this.deleteTask(taskId);
                break;

            case 'test':
                this.testScriptInNewWindow(taskId);
                break;
        }
    }





    runTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.status === 'running') {
            this.showNotification(`任务正在运行中`, 'success');
            return;
        }

        // 模拟任务执行
        task.status = 'running';
        /*this.runningTasks.set(taskId, {
            startTime: Date.now(),
            timer: setTimeout(() => {
                task.status = Math.random() > 0.2 ? 'completed' : 'failed';
                this.runningTasks.delete(taskId);
                this.saveTasks();
                this.renderTaskList();
                this.updateStats();
            }, 3000 + Math.random() * 5000)
        });*/

        this.saveTasks();
        this.renderTaskList();
        this.updateStats();
        this.showNotification(`任务 "${task.name}" 开始执行`, 'success');
    }

    stopTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.status !== 'running') {
            this.showNotification(`任务未在运行中`, 'error');
            return;
        }

        // 停止运行中的任务
        if (this.runningTasks.has(taskId)) {
            const runningTask = this.runningTasks.get(taskId);
            clearTimeout(runningTask.timer);
            this.runningTasks.delete(taskId);
        }

        task.status = 'pending';
        this.saveTasks();
        this.renderTaskList();
        this.updateStats();
        this.showNotification(`任务 "${task.name}" 已停止运行`, 'error');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        debugger
        // 如果任务正在运行，先停止它
        if (task.status === 'running' && this.runningTasks.has(taskId)) {
            const runningTask = this.runningTasks.get(taskId);
            clearTimeout(runningTask.timer);
            this.runningTasks.delete(taskId);
            task.status = 'pending';
            this.saveTasks();
            this.renderTaskList();
            this.updateStats();
            this.showNotification(`任务 "${task.name}" 已停止运行`, 'error');
        }

        // 填充脚本配置表单
        if (task.scriptConfig) {
            document.getElementById('scriptName').value = task.scriptConfig.name || '';
            document.getElementById('matchRules').value = (task.scriptConfig.matchRules || []).join('\n');
            document.getElementById('refreshInterval').value = task.scriptConfig.refreshInterval || 0;
            document.getElementById('dependencies').value = (task.scriptConfig.dependencies || []).join('\n');
            if (this.scriptCodeEditor) {
                this.scriptCodeEditor.setValue(task.scriptConfig.scriptCode || '');
            } else {
                document.getElementById('scriptCode').value = task.scriptConfig.scriptCode || '';
            }
            setTimeout(() => {
                this.scriptCodeEditor.refresh();
            }, 0);
        }

        // 切换到脚本配置标签页
        document.querySelector('[data-tab="script-config"]').click();

        // 存储正在编辑的任务ID，以便后续更新
        this.editingTaskId = taskId;

        // 滚动到脚本配置区域
        setTimeout(() => {
            document.getElementById('script-config').scrollIntoView({ behavior: 'smooth' });
        }, 100);

        this.showNotification(`任务 "${task.name}" 已加载到脚本配置中进行编辑`, 'info');
    }



    deleteTask(taskId, confirm = true) {
        if (confirm && !window.confirm('确定要删除这个任务吗？')) {
            return;
        }

        // 停止运行中的任务
        if (this.runningTasks.has(taskId)) {
            clearTimeout(this.runningTasks.get(taskId).timer);
            this.runningTasks.delete(taskId);
        }

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTaskList();
        this.updateStats();

        if (confirm) {
           this.showNotification(`任务已删除`, 'success');
        }
    }

    runAllTasks() {
        const pendingTasks = this.tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length === 0) {
            this.showNotification(`没有待执行的任务`, 'success');
            return;
        }

        if (!confirm(`确定要运行 ${pendingTasks.length} 个待执行任务吗？`)) {
            return;
        }

        pendingTasks.forEach(task => {
            setTimeout(() => this.runTask(task.id), Math.random() * 1000);
        });
    }

    stopAllTasks() {
        const runningTaskIds = Array.from(this.runningTasks.keys());
        if (runningTaskIds.length === 0) {
            this.showNotification(`没有运行中的任务`, 'error');
            return;
        }

        if (!confirm(`确定要停止 ${runningTaskIds.length} 个运行中的任务吗？`)) {
            return;
        }

        runningTaskIds.forEach(taskId => {
            const runningTask = this.runningTasks.get(taskId);
            if (runningTask) {
                clearTimeout(runningTask.timer);
                this.runningTasks.delete(taskId);

                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = 'pending';
                }
            }
        });

        this.saveTasks();
        this.renderTaskList();
        this.updateStats();
        this.showNotification(`所有运行中的任务已停止`, 'success');
    }

    refreshTaskStatus() {
        this.renderTaskList();
        this.updateStats();
        this.showNotification(`任务状态已刷新`, 'success');
    }

    filterTasks() {
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const searchText = document.getElementById('taskSearch').value.toLowerCase();

        const taskItems = document.querySelectorAll('.task-item');

        taskItems.forEach(item => {
            const taskId = parseInt(item.dataset.taskId);
            const task = this.tasks.find(t => t.id === taskId);

            if (!task) {
                item.style.display = 'none';
                return;
            }

            let show = true;

            // 状态筛选
            if (statusFilter !== 'all' && task.status !== statusFilter) {
                show = false;
            }

            // 优先级筛选
            if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
                show = false;
            }

            // 搜索筛选
            if (searchText && !task.name.toLowerCase().includes(searchText) &&
                !task.description.toLowerCase().includes(searchText)) {
                show = false;
            }

            item.style.display = show ? 'block' : 'none';
        });
    }

    clearAllTasks() {
        if (!confirm('确定要清空所有任务吗？此操作不可恢复！')) {
            return;
        }

        // 停止所有运行中的任务
        this.runningTasks.forEach(runningTask => {
            clearTimeout(runningTask.timer);
        });
        this.runningTasks.clear();

        this.tasks = [];
        this.saveTasks();
        this.renderTaskList();
        this.updateStats();

        alert('所有任务已清空');
    }

    exportTasks() {
        if (this.tasks.length === 0) {
            alert('没有任务可导出');
            return;
        }

        const data = {
            tasks: this.tasks,
            exportTime: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `userscript-tasks-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification(`任务已导出`, 'success');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.tasks || !Array.isArray(data.tasks)) {
                    throw new Error('无效的任务文件格式');
                }

                if (!confirm(`确定要导入 ${data.tasks.length} 个任务吗？这将覆盖现有任务！`)) {
                    return;
                }

                // 重新分配ID
                data.tasks.forEach(task => {
                    task.id = this.taskIdCounter++;
                    task.status = 'pending'; // 重置状态
                });

                this.tasks = data.tasks;
                this.saveTasks();
                this.renderTaskList();
                this.updateStats();
                this.showNotification(`任务导入成功`, 'success');

            } catch (error) {
                this.showNotification('导入失败：' + error.message, 'error');
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // 清空文件选择
    }

    saveTasks() {
        // 使用chrome.storage.local实现跨域名数据共享
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({
                'userscript_tasks': this.tasks
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('保存任务到chrome.storage失败:', chrome.runtime.lastError);
                    // 降级到localStorage
                    localStorage.setItem('userscript_tasks', JSON.stringify(this.tasks));
                } else {
                    console.log('任务已保存到chrome.storage');
                }
                // 更新统计数据
                this.updateStats();
            });
        } else {
            // 降级到localStorage
            localStorage.setItem('userscript_tasks', JSON.stringify(this.tasks));
            // 更新统计数据
            this.updateStats();
        }
    }

    // 示例功能




    loadExampleById(exampleId) {
        // 确保获取最新的示例数据
        const allExamples = this.getExamplesData();
        const example = allExamples.find(e => e.id === exampleId);
        if (!example) {
            this.showNotification(`未找到ID为 "${exampleId}" 的示例`, 'error');
            return;
        }

        console.log('Loading example:', example);
        let config;

        // 处理内置示例（只有code属性）和自定义示例（有config属性）
        if (example.config) {
            config = example.config;
        } else {
            // 为内置示例创建默认配置
            config = {
                name: example.title,
                matchRules: ['*'],
                autoRefresh: false,
                refreshInterval: 0,
                dependencies: [],
                scriptCode: example.code || ''
            };
        }

        console.log('Config to load:', config);

        // 填充表单
        const scriptNameEl = document.getElementById('scriptName');
        const matchRulesEl = document.getElementById('matchRules');
        const refreshIntervalEl = document.getElementById('refreshInterval');
        const dependenciesEl = document.getElementById('dependencies');
        const scriptCodeEl = document.getElementById('scriptCode');

        console.log('Form elements:', {
            scriptName: scriptNameEl,
            matchRules: matchRulesEl,
            refreshInterval: refreshIntervalEl,
            dependencies: dependenciesEl,
            scriptCode: scriptCodeEl
        });

        if (scriptNameEl) scriptNameEl.value = config.name;
        if (matchRulesEl) matchRulesEl.value = config.matchRules.join('\n');
        if (refreshIntervalEl) refreshIntervalEl.value = config.refreshInterval || 0;
        if (dependenciesEl) dependenciesEl.value = config.dependencies.join('\n');

        // 切换到脚本配置标签页
        const configTab = document.querySelector('[data-tab="script-config"]');
        if (configTab) {
            configTab.click();
        }

        // 显示加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 1000;
            font-size: 14px;
        `;
        loadingIndicator.textContent = '正在加载脚本代码...';

        const scriptCodeContainer = scriptCodeEl ? scriptCodeEl.parentElement : document.querySelector('.CodeMirror')?.parentElement;
        if (scriptCodeContainer) {
            scriptCodeContainer.style.position = 'relative';
            scriptCodeContainer.appendChild(loadingIndicator);
        }

        // 异步加载脚本代码以提高性能
        setTimeout(() => {
            if (this.scriptCodeEditor) {
                // 对于CodeMirror编辑器，使用批量操作模式
                this.scriptCodeEditor.operation(() => {
                    this.scriptCodeEditor.setValue(config.scriptCode);
                });
            } else if (scriptCodeEl) {
                // 对于普通textarea，直接设置值
                scriptCodeEl.value = config.scriptCode;
            }

            // 移除加载指示器
            if (loadingIndicator && loadingIndicator.parentElement) {
                loadingIndicator.remove();
            }
        }, 50); // 延迟50ms让UI先更新

        // 滚动到脚本配置区域
        setTimeout(() => {
            const configSection = document.getElementById('script-config');
            if (configSection) {
                configSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 150); // 增加延迟确保代码加载完成后再滚动

        this.showNotification(`示例 "${example.title}" 已加载到脚本配置中`, 'success');
    }

    previewExampleById(exampleId) {
        // 确保获取最新的示例数据
        const allExamples = this.getExamplesData();
        const example = allExamples.find(e => e.id === exampleId);
        if (!example) {
            this.showNotification(`未找到ID为 "${exampleId}" 的示例`, 'error');
            return;
        }

        let config;

        // 处理内置示例（只有code属性）和自定义示例（有config属性）
        if (example.config) {
            config = example.config;
        } else {
            // 为内置示例创建默认配置
            config = {
                name: example.title,
                matchRules: ['*'],
                autoRefresh: false,
                refreshInterval: 30,
                dependencies: [],
                scriptCode: example.code || ''
            };
        }

        const script = this.buildUserScript(config);

        // 使用弹窗显示脚本预览
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 80vh;">
                <div class="modal-header">
                    <h3>📄 ${this.escapeHtml(example.title)} - 脚本预览</h3>
                    <button class="close-btn" data-action="close">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                    <div class="script-info" style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <p><strong>📝 描述：</strong>${this.escapeHtml(example.description)}</p>
                        <p><strong>🏷️ 标签：</strong>${example.tags ? example.tags.map(tag => this.escapeHtml(tag)).join(', ') : '无'}</p>
                        <p><strong>🎯 匹配规则：</strong>${config.matchRules.map(rule => this.escapeHtml(rule)).join(', ')}</p>
                    </div>
                    <div class="code-preview">
                        <h4>💻 完整脚本代码：</h4>
                        <pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; line-height: 1.4; max-height: 400px; overflow-y: auto; border: 1px solid #dee2e6;"><code>${this.escapeHtml(script)}</code></pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-action="copy">📋 复制脚本</button>
                    <button class="btn btn-success" data-action="load">📥 加载配置</button>
                    <button class="btn btn-secondary" data-action="close">关闭</button>
                </div>
            </div>
        `;

        // 添加事件监听器
        modal.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'close') {
                modal.remove();
            } else if (action === 'copy') {
                navigator.clipboard.writeText(script).then(() => {
                    this.showNotification('脚本已复制到剪贴板', 'success');
                }).catch(() => {
                    this.showNotification('复制失败，请手动复制', 'error');
                });
            } else if (action === 'load') {
                modal.remove();
                this.loadExampleById(exampleId);
            }
        });

        document.body.appendChild(modal);
    }





    // 显示帮助
    showHelp() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>使用帮助</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="help-section">
                        <h4>🚀 快速开始</h4>
                        <p>1. 在"脚本配置"标签页编写或导入脚本</p>
                        <p>2. 设置匹配规则和执行条件</p>
                        <p>3. 点击"保存脚本"创建任务</p>
                        <p>4. 在"任务管理"中启用和管理脚本</p>
                    </div>
                    <div class="help-section">
                        <h4>📝 脚本编写</h4>
                        <p>• 支持标准JavaScript语法</p>
                        <p>• 可使用DOM API操作页面元素</p>
                        <p>• 支持异步操作和定时器</p>
                        <p>• 内置常用工具函数</p>
                    </div>
                    <div class="help-section">
                        <h4>🛠 高级功能</h4>
                        <p>• 脚本市场：浏览和安装社区脚本</p>
                        <p>• 在线编辑器：专业的代码编辑环境</p>
                        <p>• 自动刷新：定时刷新页面执行脚本</p>
                        <p>• 任务调度：设置脚本执行时间</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">知道了</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 渲染脚本市场
    renderMarketScripts() {
        const container = document.getElementById('marketGrid');
        if (!container) return;

        container.innerHTML = this.marketScripts.map(script => `
            <div class="market-item" data-category="${script.category}">
                <div class="market-item-header">
                    <h4>${script.title}</h4>
                    <div class="market-item-rating">
                        ${'★'.repeat(Math.floor(script.rating))}${'☆'.repeat(5 - Math.floor(script.rating))}
                        <span>${script.rating}</span>
                    </div>
                </div>
                <p class="market-item-description">${script.description}</p>
                <div class="market-item-meta">
                    <span class="author">作者: ${script.author}</span>
                    <span class="version">v${script.version}</span>
                    <span class="downloads">${script.downloads.toLocaleString()} 下载</span>
                </div>
                <div class="market-item-actions">
                    <button class="btn btn-primary btn-sm btn-load-market" data-script-id="${script.id}">加载配置</button>
                    <button class="btn btn-info btn-sm btn-preview-market" data-script-id="${script.id}">预览脚本</button>
                </div>
            </div>
        `).join('');

        // 绑定市场脚本事件
        container.addEventListener('click', (e) => {
            const scriptId = e.target.dataset.scriptId;
            if (!scriptId) return;

            if (e.target.classList.contains('btn-load-market')) {
                this.loadMarketScript(parseInt(scriptId));
            } else if (e.target.classList.contains('btn-preview-market')) {
                this.previewMarketScript(parseInt(scriptId));
            }
        });
    }

    // 筛选脚本市场
    filterMarketScripts() {
        const searchTerm = document.getElementById('marketSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const items = document.querySelectorAll('.market-item');

        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('.market-item-description').textContent.toLowerCase();
            const itemCategory = item.dataset.category;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = category === 'all' || itemCategory === category;

            item.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }



    // 加载市场脚本配置
    loadMarketScript(scriptId) {
        const script = this.marketScripts.find(s => s.id === scriptId);
        if (!script) {
            this.showNotification('脚本不存在', 'error');
            return;
        }

        // 使用实际的脚本代码内容
        let scriptContent;
        if (script.code !== undefined && script.code !== null) {
            // 使用解码后的真实脚本代码
            scriptContent = script.code;
        } else {
            // 如果没有代码内容，使用模板
            scriptContent = `// ${script.title}\n// ${script.description}\n// 作者: ${script.author}\n// 版本: ${script.version}\n\nconsole.log('${script.title} 已安装并运行');\n\n// 在这里添加脚本的具体功能代码\n// TODO: 实现 ${script.description}`;
        }

        // 填充脚本配置表单
        document.getElementById('scriptName').value = script.title;
        document.getElementById('matchRules').value = '*://*/*';
        document.getElementById('refreshInterval').value = 0;
        document.getElementById('dependencies').value = '';
        
        if (this.scriptCodeEditor) {
            this.scriptCodeEditor.setValue(scriptContent);
            // 安全的刷新CodeMirror，确保在扩展环境下也能正常工作
            setTimeout(() => {
                try {
                    if (this.scriptCodeEditor && typeof this.scriptCodeEditor.refresh === 'function') {
                        this.scriptCodeEditor.refresh();
                    }
                } catch (error) {
                    console.warn('CodeMirror刷新失败:', error);
                }
            }, 100);
        } else {
            document.getElementById('scriptCode').value = scriptContent;
        }

        // 清除编辑状态，确保这是新的脚本配置
        this.editingTaskId = null;

        // 切换到脚本配置标签页
        document.querySelector('[data-tab="script-config"]').click();

        // 滚动到脚本配置区域
        setTimeout(() => {
            document.getElementById('script-config').scrollIntoView({ behavior: 'smooth' });
        }, 100);

        this.showNotification(`脚本 "${script.title}" 已加载到配置中，请完善后保存`, 'success');
    }

    // 预览市场脚本
    previewMarketScript(scriptId) {
        const script = this.marketScripts.find(s => s.id === scriptId);
        if (!script) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 80vh;">
                <div class="modal-header">
                    <h3>📄 ${this.escapeHtml(script.title)} - 脚本预览</h3>
                    <button class="close-btn" data-action="close">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                    <div class="script-info" style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <p><strong>📝 描述：</strong>${this.escapeHtml(script.description)}</p>
                        <p><strong>👤 作者：</strong>${this.escapeHtml(script.author)}</p>
                        <p><strong>🏷️ 版本：</strong>${this.escapeHtml(script.version)}</p>
                        <p><strong>📅 更新时间：</strong>${this.escapeHtml(script.updated)}</p>
                        <p><strong>⭐ 评分：</strong>${script.rating}/5.0 (${script.downloads} 下载)</p>
                        <p><strong>🏷️ 标签：</strong>${script.tags ? script.tags.map(tag => this.escapeHtml(tag)).join(', ') : '无'}</p>
                    </div>
                    <div class="code-preview">
                        <h4>💻 完整脚本代码：</h4>
                        <pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; line-height: 1.4; max-height: 400px; overflow-y: auto; border: 1px solid #dee2e6;"><code>${this.escapeHtml(script.code || '// 暂无脚本代码内容')}</code></pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-action="copy">📋 复制脚本</button>
                    <button class="btn btn-success" data-action="load">📥 加载配置</button>
                    <button class="btn btn-secondary" data-action="close">关闭</button>
                </div>
            </div>
        `;

        // 添加事件监听器
        modal.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'close' || e.target.classList.contains('modal-overlay')) {
                modal.remove();
            } else if (action === 'copy') {
                const codeContent = script.code || '// 暂无脚本代码内容';
                this.copyToClipboard(codeContent);
            } else if (action === 'load') {
                modal.remove();
                this.loadMarketScript(script.id);
            }
        });

        document.body.appendChild(modal);
    }



    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#000';
                break;
            default:
                notification.style.background = '#17a2b8';
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // JavaScript字符串转义
    escapeForJs(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }

    // 兼容的复制到剪贴板方法
    copyToClipboard(text) {
        // 优先使用现代 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('脚本已复制到剪贴板', 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    // 备用复制方法（兼容旧浏览器和扩展环境）
    fallbackCopyToClipboard(text) {
        try {
            // 创建临时文本区域
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            // 尝试执行复制命令
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showNotification('脚本已复制到剪贴板', 'success');
            } else {
                this.showNotification('复制失败，请手动复制', 'error');
            }
        } catch (err) {
            console.error('复制失败:', err);
            this.showNotification('复制失败，请手动复制', 'error');
        }
    }

    // 新的脚本示例库功能
    renderExamplesLibrary() {
        const examplesData = this.getExamplesData();
        this.allExamples = examplesData;
        this.filteredExamples = examplesData;
        this.renderExampleCards();
    }

    getExamplesData() {
        const builtInExamples = [
            {
                id: 'baidu-logo-replace',
                title: '百度Logo替换为Google',
                description: '访问百度时将百度Logo替换为Google Logo，展示基本的DOM操作',
                category: 'utility',
                tags: ['DOM操作', '图片替换', '百度'],
                rating: 4.2,
                downloads: 3250,
                author: 'DOMHelper',
                lastUpdate: '2024-01-10',
                config: {
                    name: '百度Logo替换为Google',
                    matchRules: ['https://www.baidu.com/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('baidu-logo-replace')
                }
            },
            {
                id: 'auto-refresh',
                title: '网页自动刷新器',
                description: '为任意网页添加自动刷新功能，可自定义刷新间隔',
                category: 'utility',
                tags: ['自动刷新', '定时器', '通用'],
                rating: 4.6,
                downloads: 8750,
                author: 'RefreshMaster',
                lastUpdate: '2024-01-12',
                config: {
                    name: '网页自动刷新器',
                    matchRules: ['*://*/*'],
                    autoRefresh: true,
                    refreshInterval: 60,
                    dependencies: [],
                    scriptCode: this.getExampleScript('auto-refresh')
                }
            },
            {
                id: 'github-enhancer',
                title: 'GitHub增强器',
                description: '为GitHub添加额外功能，如一键复制仓库地址、显示文件大小等',
                category: 'development',
                tags: ['GitHub', '增强功能', '开发工具'],
                rating: 4.7,
                downloads: 6420,
                author: 'DevTools',
                lastUpdate: '2024-01-14',
                config: {
                    name: 'GitHub增强器',
                    matchRules: ['https://github.com/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('github-enhancer')
                }
            },
            {
                id: 'auto-login',
                title: '自动登录助手',
                description: '自动填充登录表单并提交，支持多种网站的登录页面识别',
                category: 'automation',
                tags: ['自动化', '登录', '表单'],
                rating: 4.8,
                downloads: 15420,
                author: 'AutoScript',
                lastUpdate: '2024-01-15',
                config: {
                    name: '自动登录助手',
                    matchRules: ['*://*/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('auto-login')
                }
            },
            {
                id: 'ad-blocker',
                title: '智能广告屏蔽',
                description: '智能识别并屏蔽网页广告，支持动态加载的广告内容',
                category: 'utility',
                tags: ['广告屏蔽', 'DOM操作', '性能优化'],
                rating: 4.9,
                downloads: 28750,
                author: 'AdBlocker',
                lastUpdate: '2024-01-20',
                config: {
                    name: '智能广告屏蔽',
                    matchRules: ['*://*/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('ad-blocker')
                }
            },
            {
                id: 'dark-mode',
                title: '万能夜间模式',
                description: '为任意网站添加夜间模式，智能反转颜色并保护眼睛',
                category: 'ui',
                tags: ['夜间模式', '护眼', '主题'],
                rating: 4.7,
                downloads: 19830,
                author: 'DarkTheme',
                lastUpdate: '2024-01-18',
                config: {
                    name: '万能夜间模式',
                    matchRules: ['*://*/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('dark-mode')
                }
            },
            {
                id: 'page-translator',
                title: '网页翻译器',
                description: '一键翻译整个网页内容，支持多种语言互译',
                category: 'utility',
                tags: ['翻译', '多语言', 'API'],
                rating: 4.6,
                downloads: 12450,
                author: 'Translator',
                lastUpdate: '2024-01-22',
                config: {
                    name: '网页翻译器',
                    matchRules: ['*://*/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('page-translator')
                }
            },
            {
                id: 'download-helper',
                title: '下载助手',
                description: '增强网页下载功能，支持批量下载、断点续传等',
                category: 'utility',
                tags: ['下载', '批量操作', '文件管理'],
                rating: 4.5,
                downloads: 8920,
                author: 'DownloadMaster',
                lastUpdate: '2024-01-25',
                config: {
                    name: '下载助手',
                    matchRules: ['*://*/*'],
                    autoRefresh: false,
                    refreshInterval: 30,
                    dependencies: [],
                    scriptCode: this.getExampleScript('download-helper')
                }
            }
        ];

        // 获取自定义示例
        const customExamples = JSON.parse(localStorage.getItem('customExamples') || '[]');

        // 合并内置示例和自定义示例
        return [...builtInExamples, ...customExamples];
    }

    renderExampleCards() {
        const container = document.getElementById('examplesContainer');
        if (!container) return;

        container.innerHTML = this.filteredExamples.map(example => `
            <div class="example-card" data-example-id="${example.id}">
                <h3>${example.title}</h3>
                <div class="category-tag">${this.getCategoryName(example.category)}</div>
                <div class="description">${example.description}</div>

                <div class="script-tags">
                    ${example.tags.map(tag => `<span class="script-tag">${tag}</span>`).join('')}
                </div>
                <div class="actions">
                    <button class="btn btn-primary btn-load-example" data-example-id="${example.id}">加载配置</button>
                    <button class="btn btn-secondary btn-preview-example" data-example-id="${example.id}">预览脚本</button>
                </div>
            </div>
        `).join('');

        // 绑定事件委托
        container.removeEventListener('click', this.handleExampleCardClick);
        this.handleExampleCardClick = (e) => {
            const exampleId = e.target.dataset.exampleId;
            if (!exampleId) return;

            if (e.target.classList.contains('btn-load-example')) {
                this.loadExampleById(exampleId);
            } else if (e.target.classList.contains('btn-preview-example')) {
                this.previewExampleById(exampleId);
            }
        };
        container.addEventListener('click', this.handleExampleCardClick);
    }

    getCategoryName(category) {
        const categoryNames = {
            'dom': 'DOM操作',
            'ui': '界面增强',
            'automation': '自动化',
            'utility': '实用工具',
            'api': 'API调用'
        };
        return categoryNames[category] || category;
    }

    filterExamples() {
        const searchTerm = document.getElementById('exampleSearch')?.value.toLowerCase() || '';
        const selectedCategory = document.getElementById('exampleCategory')?.value || 'all';

        this.filteredExamples = this.allExamples.filter(example => {
            const matchesSearch = example.title.toLowerCase().includes(searchTerm) ||
                example.description.toLowerCase().includes(searchTerm) ||
                example.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        this.renderExampleCards();
    }

    useExample(exampleId) {
        const example = this.allExamples.find(e => e.id === exampleId);
        if (!example) return;

        // 切换到脚本配置标签页
        document.querySelector('[data-tab="config"]').click();

        // 填充表单
        document.getElementById('scriptName').value = example.title;
        document.getElementById('scriptDescription').value = example.description;
        if (this.scriptCodeEditor) {
            this.scriptCodeEditor.setValue(example.code.replace(/\\n/g, '\n'));
        } else {
            document.getElementById('scriptCode').value = example.code.replace(/\\n/g, '\n');
        }

        setTimeout(() => {
            this.scriptCodeEditor.refresh();
        }, 0);

        this.showNotification(`已加载示例脚本：${example.title}`, 'success');
    }
    
    // 全屏功能方法
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    enterFullscreen() {
        const editorContainer = document.getElementById('editorContainer');
        if (!editorContainer) return;
        
        this.isFullscreen = true;
        this.originalParent = editorContainer.parentElement;
        
        // 保存当前滚动位置
        const scrollTop = this.scriptCodeEditor ? this.scriptCodeEditor.getScrollInfo().top : 0;
        
        // 添加全屏样式类
        editorContainer.classList.add('fullscreen');
        
        // 移动到body下以避免层级问题
        document.body.appendChild(editorContainer);
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 延迟刷新以确保动画完成
        setTimeout(() => {
            this.refreshCodeMirror();
            // 恢复滚动位置
            if (this.scriptCodeEditor && scrollTop > 0) {
                this.scriptCodeEditor.scrollTo(0, scrollTop);
            }
        }, 300);        
    }
    
    exitFullscreen() {
        const editorContainer = document.getElementById('editorContainer');
        if (!editorContainer || !this.isFullscreen) return;
        
        // 保存当前滚动位置
        const scrollTop = this.scriptCodeEditor ? this.scriptCodeEditor.getScrollInfo().top : 0;
        
        this.isFullscreen = false;
        
        // 添加退出动画类
        editorContainer.classList.add('exiting');
        
        // 等待动画完成后移除全屏样式
        setTimeout(() => {
            editorContainer.classList.remove('fullscreen', 'exiting');
            
            // 恢复到原始位置
            if (this.originalParent) {
                this.originalParent.appendChild(editorContainer);
            }
            
            // 恢复页面滚动
            document.body.style.overflow = '';
            
            // 刷新CodeMirror以适应新尺寸
            setTimeout(() => {
                this.refreshCodeMirror();
                // 恢复滚动位置
                if (this.scriptCodeEditor && scrollTop > 0) {
                    this.scriptCodeEditor.scrollTo(0, scrollTop);
                }
            }, 100);
        }, 300);
        
    }
    
    refreshCodeMirror() {
        // 延迟刷新以确保DOM更新完成
        setTimeout(() => {
            try {
                if (this.scriptCodeEditor && typeof this.scriptCodeEditor.refresh === 'function') {
                    this.scriptCodeEditor.refresh();
                    // 确保滚动条正确显示
                    this.scriptCodeEditor.scrollTo(0, 0);
                }
            } catch (error) {
                console.warn('CodeMirror刷新失败:', error);
            }
        }, 100);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('油猴脚本管理器开始加载');

    // 初始化管理器
    const manager = new UserScriptManager();

    // 将manager设置为全局变量以便其他地方使用
    window.manager = manager;

    // 初始化脚本示例库事件监听器
    const exampleSearch = document.getElementById('exampleSearch');
    const exampleCategory = document.getElementById('exampleCategory');

    if (exampleSearch) {
        exampleSearch.addEventListener('input', () => {
            manager.filterExamples();
        });
    }

    if (exampleCategory) {
        exampleCategory.addEventListener('change', () => {
            manager.filterExamples();
        });
    }

    // 初始化脚本示例库
    manager.renderExamplesLibrary();
    
});