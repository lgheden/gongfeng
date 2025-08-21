// 使用配置文件中的内容
// const { MODULE_IDS, defaultInstalled, moduleToToolMap, availableModules, generateToolsHTML } = window.ModulesConfig;

/**
 * 弹出窗口主要功能类
 */
class PopupManager {
    constructor() {
        this.searchInput = null;
        this.toolItems = [];
        this.noResultsElement = null;

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadUserPreferences();
        this.loadModuleConfiguration();
        this.setupStorageListener();
        this.generateToolsList(); // 动态生成工具列表
    }

    /**
     * 动态生成工具列表
     */
    generateToolsList() {
        const toolsContainer = document.getElementById('toolsContainer');
        if (toolsContainer && window.ModulesConfig) {
            toolsContainer.innerHTML = window.ModulesConfig.generateToolsHTML();
            // 重新绑定工具项
            this.toolItems = Array.from(document.querySelectorAll('.tool-item'));
            this.bindToolItemsEvents();
        }
    }

    /**
     * 绑定工具项事件
     */
    bindToolItemsEvents() {
        this.toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolName = item.dataset.tool;
                this.openTool(toolName);
            });
        });
    }

    /**
     * 绑定DOM元素
     */
    bindElements() {
        this.searchInput = document.getElementById('searchInput');
        this.toolItems = Array.from(document.querySelectorAll('.tool-item'));

        // 创建无搜索结果提示元素
        this.createNoResultsElement();
    }

    /**
     * 创建无搜索结果提示元素
     */
    createNoResultsElement() {
        this.noResultsElement = document.createElement('div');
        this.noResultsElement.className = 'no-results';
        this.noResultsElement.style.display = 'none';
        this.noResultsElement.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <h3>未找到相关工具</h3>
            <p>请尝试使用其他关键词搜索</p>
        `;

        const toolsContainer = document.querySelector('.tools-container');
        toolsContainer.appendChild(this.noResultsElement);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 搜索功能
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleEnterKey();
                }
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // 模块管理按钮
        const moduleManagerBtn = document.getElementById('moduleManagerBtn');
        if (moduleManagerBtn) {
            moduleManagerBtn.addEventListener('click', () => {
                this.openModuleManager();
            });
        }

        // 底部链接事件
        this.bindFooterEvents();

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * 绑定底部链接事件
     */
    bindFooterEvents() {
        const aboutLink = document.getElementById('aboutLink');
        const feedbackLink = document.getElementById('feedbackLink');
        const helpLink = document.getElementById('helpLink');
        const donateLink = document.getElementById('donateLink');

        if (aboutLink) {
            aboutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAbout();
            });
        }

        if (feedbackLink) {
            feedbackLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFeedback();
            });
        }

        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHelp();
            });
        }

        if (donateLink) {
            donateLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDonate();
            });
        }
    }

    /**
     * 处理搜索
     */
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;

        this.toolItems.forEach(item => {
            const toolName = item.querySelector('h3').textContent.toLowerCase();
            const toolDesc = item.querySelector('p').textContent.toLowerCase();
            const keywords = item.dataset.keywords ? item.dataset.keywords.toLowerCase() : '';

            const isMatch = toolName.includes(searchTerm) ||
                toolDesc.includes(searchTerm) ||
                keywords.includes(searchTerm);

            if (isMatch || searchTerm === '') {
                item.style.display = 'flex';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // 显示/隐藏无结果提示
        if (visibleCount === 0 && searchTerm !== '') {
            this.noResultsElement.style.display = 'block';
        } else {
            this.noResultsElement.style.display = 'none';
        }

        // 保存搜索历史
        if (searchTerm) {
            this.saveSearchHistory(searchTerm);
        }
    }

    /**
     * 处理回车键
     */
    handleEnterKey() {
        const visibleItems = this.toolItems.filter(item => !item.classList.contains('hidden'));
        if (visibleItems.length > 0) {
            const toolName = visibleItems[0].dataset.tool;
            this.openTool(toolName);
        }
    }

    /**
     * 清空搜索
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.handleSearch('');
            this.searchInput.focus();
        }
    }

    /**
     * 打开模块管理页面
     */
    async openModuleManager() {
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
                const url = chrome.runtime.getURL('core/module-manager/module-manager.html');
                await chrome.tabs.create({ url });
                window.close();
            } else {
                // 非扩展环境，直接在当前窗口打开
                window.open('core/module-manager/module-manager.html', '_blank');
            }
        } catch (error) {
            console.error('打开模块管理页面失败:', error);
        }
    }

    /**
     * 打开工具
     */
    async openTool(toolName) {
        if (!toolName) return;
        this.recordToolUsage(toolName);
        // 检查是否在扩展环境中
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (toolName === 'page-screenshot') {
                try {
                    if (tab) {
                        chrome.tabs.sendMessage(tab.id, { action: 'injectScreenshotButton' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error('发送消息失败:', chrome.runtime.lastError.message);
                            } else {
                                console.log('截图按钮注入成功:', response);
                            }
                        });
                        window.close();
                        return;
                    }
                } catch (error) {
                    console.error('注入截图按钮失败:', error);
                }
            } else if (toolName === 'get-color') {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'startColorPicker' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('发送消息失败:', chrome.runtime.lastError.message);
                        } else {
                            console.log('截图按钮注入成功:', response);
                        }
                    });
                    window.close();
                    return;
                }
            } else if (toolName === 'dashboard') {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'startDashboard' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('页面分析发送消息失败:', chrome.runtime.lastError.message);
                        } else {
                            console.log('页面分析成功:', response);
                        }
                    });
                    window.close();
                    return;
                }
            }

            // 其他工具或页面截图工具注入失败时，打开工具页面
            const toolUrl = `modules/${toolName}/${toolName}.html`;
            chrome.tabs.create({ url: chrome.runtime.getURL(toolUrl) });
            // 关闭弹出窗口
            window.close();
        } else {
            // 非扩展环境，直接在当前窗口打开
            const toolUrl = `modules/${toolName}/${toolName}.html`;
            window.open(toolUrl, '_blank');
        }
    }

    /**
     * 处理键盘快捷键
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (this.searchInput) {
                this.searchInput.focus();
                this.searchInput.select();
            }
        }

        // 数字键快速打开工具
        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const index = parseInt(e.key) - 1;
            const visibleItems = this.toolItems.filter(item => !item.classList.contains('hidden'));
            if (visibleItems[index]) {
                const toolName = visibleItems[index].dataset.tool;
                this.openTool(toolName);
            }
        }
    }

    /**
     * 显示关于信息
     */
    showAbout() {
        const aboutInfo = {
            name: '程序员工具箱',
            version: '1.0.0',
            description: '程序员日常开发必备工具集合',
            author: 'Developer',
            features: [
                'JSON格式化与验证',
                '程序员计算器',
                '正则表达式调试',
                '编码解码工具',
                '时间戳转换',
                '数据库转Java对象',
                'Cron表达式生成器',
                '二维码工具',
                '文本对比工具'
            ]
        };

        alert(`${aboutInfo.name} v${aboutInfo.version}\n\n${aboutInfo.description}\n\n功能特性：\n${aboutInfo.features.map(f => '• ' + f).join('\n')}`);
    }

    /**
     * 显示反馈信息
     */
    showFeedback() {
        const feedbackUrl = 'mailto:lgheden@qq.com?subject=程序员工具箱反馈';
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.create({ url: feedbackUrl });
        } else {
            window.open(feedbackUrl, '_blank');
        }
    }

    /**
     * 显示帮助信息
     */
    showHelp() {
        const helpText = `
程序员工具箱 - 使用帮助

快捷键：
• Ctrl+K: 聚焦搜索框
• 1-5: 快速打开对应工具
• Enter: 打开第一个搜索结果
• Esc: 清空搜索

搜索技巧：
• 支持工具名称搜索
• 支持功能描述搜索
• 支持关键词搜索

工具说明：
• JSON格式化: 格式化、压缩、验证JSON数据
• 程序员计算器: 多进制计算和转换
• 正则表达式: 测试和调试正则表达式
• 编码解码: 各种编码格式转换
• 时间戳转换: 时间戳与日期互转
• 数据库转Java对象: 将DDL语句转换为Java实体类
• Cron表达式生成器: 生成和解析定时任务表达式
• 二维码工具: 二维码生成、解码、扫描识别
• 文本对比工具: 文本内容对比、差异分析
        `;

        alert(helpText.trim());
    }

    /**
     * 显示打赏页面
     */
    showDonate() {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.tabs) {
            const donateUrl = chrome.runtime.getURL('pages/donate.html');
            chrome.tabs.create({ url: donateUrl });
            window.close();
        } else {
            // 非扩展环境，直接打开打赏页面
            window.open('pages/donate.html', '_blank');
        }
    }

    /**
     * 记录工具使用统计
     */
    recordToolUsage(toolName) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['toolUsage'], (result) => {
                const usage = result.toolUsage || {};
                usage[toolName] = (usage[toolName] || 0) + 1;
                usage.lastUsed = Date.now();

                chrome.storage.local.set({ toolUsage: usage });
            });
        }
        // 非扩展环境下不记录统计
    }

    /**
     * 保存搜索历史
     */
    saveSearchHistory(searchTerm) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['searchHistory'], (result) => {
                const history = result.searchHistory || [];

                // 移除重复项
                const filteredHistory = history.filter(item => item !== searchTerm);

                // 添加到开头
                filteredHistory.unshift(searchTerm);

                // 限制历史记录数量
                const limitedHistory = filteredHistory.slice(0, 10);

                chrome.storage.local.set({ searchHistory: limitedHistory });
            });
        }
        // 非扩展环境下不保存历史
    }

    /**
     * 加载用户偏好设置
     */
    loadUserPreferences() {
        // 检查是否在扩展环境中
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['userPreferences'], (result) => {
                const preferences = result.userPreferences || {};

                // 应用主题设置
                if (preferences.theme) {
                    document.body.setAttribute('data-theme', preferences.theme);
                }

                // 应用其他设置
                if (preferences.autoFocusSearch !== false) {
                    // 默认聚焦搜索框
                    setTimeout(() => {
                        if (this.searchInput) {
                            this.searchInput.focus();
                        }
                    }, 100);
                }
            });
        } else {
            // 非扩展环境，使用默认设置
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }, 100);
        }
    }

    /**
     * 加载模块配置并更新工具显示
     */
    loadModuleConfiguration() {
        // 检查是否在扩展环境中
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(['installedModules'], (result) => {
                const installedModules = result.installedModules || [];
                this.updateToolsDisplay(installedModules);
            });
        } else {
            // 在普通网页环境中使用localStorage
            try {
                const stored = localStorage.getItem('moduleManagerConfig');
                if (stored) {
                    const config = JSON.parse(stored);
                    const installedModules = config.installedModules || [];
                    // 如果配置中的模块列表为空，使用默认配置
                    if (installedModules.length === 0) {
                        this.useDefaultConfiguration();
                    } else {
                        this.updateToolsDisplay(installedModules);
                    }
                } else {
                    // 未找到配置，使用默认配置
                    this.useDefaultConfiguration();
                }
            } catch (error) {
                console.error('加载模块配置失败:', error);
                // 使用默认配置作为降级方案
                this.useDefaultConfiguration();
            }
        }
    }

    /**
     * 使用默认配置
     */
    useDefaultConfiguration() {
        this.updateToolsDisplay(window.ModulesConfig.defaultInstalled);
    }

    /**
     * 根据安装的模块更新工具显示
     */
    updateToolsDisplay(installedModules) {
        // 获取所有工具项
        const allToolItems = document.querySelectorAll('.tool-item');

        // 如果没有安装任何模块，显示所有工具
        if (installedModules.length === 0) {
            allToolItems.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }

        // 根据安装的模块显示/隐藏工具
        allToolItems.forEach(item => {
            const toolName = item.getAttribute('data-tool');
            const moduleId = Object.keys(window.ModulesConfig.moduleToToolMap).find(key => window.ModulesConfig.moduleToToolMap[key] === toolName);

            if (moduleId && installedModules.includes(moduleId)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // 更新工具项数组
        this.toolItems = Array.from(document.querySelectorAll('.tool-item[style*="flex"]'));
    }

    /**
     * 设置存储变化监听器
     */
    setupStorageListener() {
        // 检查是否在扩展环境中
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'sync' && changes.installedModules) {
                    const newInstalledModules = changes.installedModules.newValue || [];
                    this.updateToolsDisplay(newInstalledModules);
                }
            });

            // 监听来自模块管理器的消息
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.action === 'updatePopupModules') {
                    this.loadModuleConfiguration();
                }
            });
        } else {
            // 在普通网页环境中监听localStorage变化
            window.addEventListener('storage', (e) => {
                if (e.key === 'moduleManagerConfig' && e.newValue) {
                    try {
                        const config = JSON.parse(e.newValue);
                        const installedModules = config.installedModules || [];
                        this.updateToolsDisplay(installedModules);
                    } catch (error) {
                        console.error('解析存储配置失败:', error);
                    }
                }
            });
        }
    }

    /**
     * 获取工具使用统计
     */
    getToolUsageStats() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['toolUsage'], (result) => {
                resolve(result.toolUsage || {});
            });
        });
    }
}

// 初始化弹出窗口管理器
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopupManager;
}
