// ==UserScript==
// @name         页面翻译器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为网页添加翻译功能
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

class PageTranslator {
    constructor() {
        this.isEnabled = true;
        this.currentLang = 'zh';
        this.translatedElements = new Set();
        this.originalTexts = new Map();
        this.languages = {
            'zh': '中文',
            'en': 'English',
            'ja': '日本語',
            'ko': '한국어',
            'fr': 'Français',
            'de': 'Deutsch',
            'es': 'Español',
            'ru': 'Русский',
            'ar': 'العربية',
            'pt': 'Português'
        };
        this.init();
    }

    init() {
        this.createUI();
        this.bindEvents();
        console.log('页面翻译器已初始化');
    }

    createUI() {
        // 创建翻译按钮
        const translateBtn = document.createElement('button');
        translateBtn.id = 'translateBtn';
        translateBtn.innerHTML = '🌐 翻译';
        translateBtn.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: #007bff; color: white; border: none; border-radius: 5px;
            padding: 10px 15px; cursor: pointer; font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        translateBtn.addEventListener('click', () => {
            this.showTranslatePanel();
        });
        
        document.body.appendChild(translateBtn);
    }

    bindEvents() {
        // 监听文本选择
        document.addEventListener('mouseup', (e) => {
            const selection = window.getSelection();
            if (selection.toString().trim()) {
                this.showQuickTranslate(selection.toString().trim(), e.pageX, e.pageY);
            }
        });

        // 监听键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.translatePage();
            }
        });
    }

    showQuickTranslate(text, x, y) {
        // 移除已存在的快速翻译面板
        const existingPanel = document.getElementById('quickTranslatePanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'quickTranslatePanel';
        panel.style.cssText = `
            position: absolute; left: ${x}px; top: ${y + 20}px; z-index: 10001;
            background: white; border: 1px solid #ddd; border-radius: 5px;
            padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif; max-width: 300px;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #333;">快速翻译</div>
            <div style="margin-bottom: 8px; padding: 5px; background: #f8f9fa; border-radius: 3px; font-size: 12px;">${text}</div>
            <div id="quickTranslateResult" style="padding: 5px; background: #e8f5e8; border-radius: 3px; font-size: 12px;">翻译中...</div>
            <button onclick="this.parentElement.remove()" style="margin-top: 8px; padding: 3px 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">关闭</button>
        `;
        
        document.body.appendChild(panel);
        
        // 执行翻译
        this.translateText(text).then(result => {
            const resultDiv = document.getElementById('quickTranslateResult');
            if (resultDiv) {
                resultDiv.textContent = result;
            }
        }).catch(error => {
            const resultDiv = document.getElementById('quickTranslateResult');
            if (resultDiv) {
                resultDiv.textContent = '翻译失败: ' + error.message;
                resultDiv.style.background = '#f8d7da';
            }
        });

        // 3秒后自动关闭
        setTimeout(() => {
            if (panel.parentElement) {
                panel.remove();
            }
        }, 3000);
    }

    async translateText(text, sourceLang = 'auto', targetLang = this.currentLang) {
        try {
            // 使用免费的翻译API
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
            const data = await response.json();
            
            if (data.responseStatus === 200) {
                return data.responseData.translatedText;
            } else {
                throw new Error('翻译服务暂时不可用');
            }
        } catch (error) {
            console.error('翻译错误:', error);
            // 备用翻译方法
            return this.fallbackTranslate(text);
        }
    }

    fallbackTranslate(text) {
        // 简单的备用翻译（实际项目中可以集成其他翻译服务）
        const commonTranslations = {
            'hello': '你好',
            'world': '世界',
            'welcome': '欢迎',
            'thank you': '谢谢',
            'goodbye': '再见'
        };
        
        const lowerText = text.toLowerCase();
        return commonTranslations[lowerText] || `[翻译] ${text}`;
    }

    showTranslatePanel() {
        // 移除已存在的翻译面板
        const existingPanel = document.getElementById('translatePanel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'translatePanel';
        panel.style.cssText = `
            position: fixed; top: 60px; right: 20px; z-index: 10000;
            background: white; border: 1px solid #ddd; border-radius: 8px;
            padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif; min-width: 200px;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #333;">
                🌐 页面翻译器
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">目标语言:</label>
                <select id="targetLangSelect" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    ${Object.entries(this.languages).map(([code, name]) => 
                        `<option value="${code}" ${code === this.currentLang ? 'selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="translatePageBtn" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; margin-bottom: 5px;">翻译整页</button>
                <button id="restorePageBtn" style="width: 100%; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; margin-bottom: 5px;">恢复原文</button>
                <button id="toggleTranslateBtn" style="width: 100%; padding: 8px; background: ${this.isEnabled ? '#dc3545' : '#28a745'}; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    ${this.isEnabled ? '禁用翻译' : '启用翻译'}
                </button>
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.remove()" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">关闭</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定事件
        document.getElementById('targetLangSelect').addEventListener('change', (e) => {
            this.currentLang = e.target.value;
        });
        
        document.getElementById('translatePageBtn').addEventListener('click', () => {
            this.translatePage();
        });
        
        document.getElementById('restorePageBtn').addEventListener('click', () => {
            this.restorePage();
        });
        
        document.getElementById('toggleTranslateBtn').addEventListener('click', () => {
            this.toggleTranslate();
        });
    }

    async translatePage() {
        if (!this.isEnabled) return;
        
        const textNodes = this.getTextNodes(document.body);
        const translatePromises = [];
        
        for (const node of textNodes) {
            const text = node.textContent.trim();
            if (text && text.length > 1 && !this.translatedElements.has(node)) {
                // 保存原文
                this.originalTexts.set(node, text);
                
                // 添加翻译任务
                const promise = this.translateText(text).then(translatedText => {
                    if (translatedText && translatedText !== text) {
                        node.textContent = translatedText;
                        this.translatedElements.add(node);
                    }
                }).catch(error => {
                    console.error('翻译节点失败:', error);
                });
                
                translatePromises.push(promise);
            }
        }
        
        try {
            await Promise.all(translatePromises);
            console.log('页面翻译完成');
        } catch (error) {
            console.error('页面翻译失败:', error);
        }
    }

    restorePage() {
        for (const [node, originalText] of this.originalTexts) {
            if (node.parentElement) {
                node.textContent = originalText;
            }
        }
        
        this.translatedElements.clear();
        this.originalTexts.clear();
        console.log('页面已恢复原文');
    }

    toggleTranslate() {
        this.isEnabled = !this.isEnabled;
        
        const toggleBtn = document.getElementById('toggleTranslateBtn');
        if (toggleBtn) {
            toggleBtn.style.background = this.isEnabled ? '#dc3545' : '#28a745';
            toggleBtn.textContent = this.isEnabled ? '禁用翻译' : '启用翻译';
        }
        
        console.log(`翻译功能已${this.isEnabled ? '启用' : '禁用'}`);
    }

    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 跳过脚本、样式等标签
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    
                    const tagName = parent.tagName.toLowerCase();
                    if (['script', 'style', 'noscript', 'iframe', 'object', 'embed'].includes(tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // 跳过翻译面板
                    if (parent.closest('#translatePanel, #quickTranslatePanel, #translateBtn')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    const text = node.textContent.trim();
                    if (text.length > 1) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
    }

    // 备用Google翻译API（需要代理）
    async googleTranslate(text) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${this.currentLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                return data[0][0][0];
            }
            
            throw new Error('Google翻译响应格式错误');
        } catch (error) {
            console.error('Google翻译失败:', error);
            throw error;
        }
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        new PageTranslator();
    });
}

export default PageTranslator;