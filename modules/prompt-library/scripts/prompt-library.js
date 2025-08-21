/**
 * Prompt库主要逻辑文件
 * 实现搜索、筛选、收藏、复制等功能
 */

class PromptLibrary {
    
    // Base64解码函数
    decodeBase64(str) {
        try {
            // 检查是否为Base64编码（简单检查）
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str) || str.length % 4 !== 0) {
                return str; // 如果不是Base64格式，直接返回原字符串
            }
            
            // 使用atob解码Base64
            const decoded = atob(str);
            
            // 处理UTF-8编码的中文字符
            return decodeURIComponent(escape(decoded));
        } catch (e) {
            console.warn('Base64解码失败，返回原字符串:', e);
            return str; // 解码失败时返回原字符串
        }
    }
    constructor() {
        console.log('PromptLibrary constructor - PROMPT_DATA:', PROMPT_DATA);
        console.log('Categories:', PROMPT_DATA.categories);
        console.log('Languages:', PROMPT_DATA.languages);
        console.log('Prompts count:', PROMPT_DATA.prompts?.length);
        
        // 确保数据完整性
        this.prompts = PROMPT_DATA.prompts || [];
        this.categories = (PROMPT_DATA.categories || []).filter(cat => cat && cat.icon && cat.name);
        this.languages = PROMPT_DATA.languages || [];
        
        // 如果categories为空，使用默认分类
        if (this.categories.length === 0) {
            this.categories = [
                { id: 'code-generation', name: '代码生成', icon: '🔧' },
                { id: 'debugging', name: '调试优化', icon: '🐛' },
                { id: 'code-review', name: '代码审查', icon: '👀' }
            ];
        }
        
        console.log('Filtered categories:', this.categories);
        
        this.favorites = this.loadFavorites();
        this.currentPrompt = null;
        this.filteredPrompts = [...this.prompts];
        
        this.init();
    }
    
    init() {
        this.renderCategories();
        this.renderLanguages();
        this.renderPrompts();
        this.bindEvents();
        this.updateStats();
    }
    
    // 渲染分类选项
    renderCategories() {
        try {
            const container = $('#categoryFilter');
            container.empty();
            
            // 添加"全部"选项
            container.append(`
                <option value="">🌟 全部分类</option>
            `);
            
            console.log('Rendering categories:', this.categories);
            
            if (!this.categories || !Array.isArray(this.categories)) {
                console.error('Categories is not an array:', this.categories);
                return;
            }
            
            this.categories.forEach((category, index) => {
                try {
                    if (!category) {
                        console.error('Category is null/undefined at index:', index);
                        return;
                    }
                    if (!category.icon) {
                        console.error('Category missing icon at index:', index, category);
                        return;
                    }
                    if (!category.name) {
                        console.error('Category missing name at index:', index, category);
                        return;
                    }
                    
                    container.append(`
                        <option value="${category.id || ''}">
                            ${category.icon} ${category.name}
                        </option>
                    `);
                } catch (error) {
                    console.error('Error rendering category at index:', index, error, category);
                }
            });
        } catch (error) {
            console.error('Error in renderCategories:', error);
        }
    }
    
    // 渲染语言选项
    renderLanguages() {
        const container = $('#languageFilter');
        container.empty();
        
        // 添加"全部"选项
        container.append(`
            <option value="">🌐 全部语言</option>
        `);
        
        this.languages.forEach(language => {
            container.append(`
                <option value="${language.id}">
                    ${language.name}
                </option>
            `);
        });
    }
    
    // 渲染Prompt列表
    renderPrompts() {
        const container = $('#promptList');
        container.empty();
        
        if (this.filteredPrompts.length === 0) {
            container.html(`
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">没有找到匹配的Prompt</div>
                    <div class="no-results-hint">尝试调整搜索条件或筛选器</div>
                </div>
            `);
            return;
        }
        
        this.filteredPrompts.forEach(prompt => {
            const category = this.categories.find(c => c.id === prompt.category) || { id: 'unknown', name: '未知分类', icon: '❓' };
            const language = this.languages.find(l => l.id === prompt.language) || { id: 'unknown', name: '未知语言', icon: '❓' };
            const isFavorite = this.favorites.includes(prompt.id);
            
            const promptCard = $(`
                <div class="prompt-item" data-id="${prompt.id}">
                    <div class="prompt-item-header">
                        <div class="prompt-title-row">
                            <div class="prompt-title">${prompt.title}</div>
                            <div class="prompt-actions">
                                <button class="btn-icon favorite-btn ${isFavorite ? 'active' : ''}" 
                                        data-id="${prompt.id}" title="${isFavorite ? '取消收藏' : '添加收藏'}">
                                    ${isFavorite ? '❤️' : '🤍'}
                                </button>
                            </div>
                        </div>
                        <div class="prompt-tags">
                            <span class="tag category">${category.icon} ${category.name}</span>
                            <span class="tag language">${language.name}</span>
                            <span class="tag difficulty">${this.getDifficultyIcon(prompt.difficulty)} ${prompt.difficulty}</span>
                           
                        </div>
                    </div>
                    <div class="prompt-description">${prompt.description}</div>
                </div>
            `);
            
            container.append(promptCard);
        });
    }
    
    // 获取难度图标
    getDifficultyIcon(difficulty) {
        const icons = {
            '初级': '🟢',
            '中级': '🟡',
            '高级': '🔴'
        };
        return icons[difficulty] || '⚪';
    }
    
    // 显示Prompt详情
    showPromptDetail(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;
        
        this.currentPrompt = prompt;
        const category = this.categories.find(c => c.id === prompt.category);
        const language = this.languages.find(l => l.id === prompt.language);
        const isFavorite = this.favorites.includes(prompt.id);
        
        // 更新详情面板 - 将description放在title后面，同一行显示
        $('#promptDetailTitle').html(`
            ${prompt.title}
            <span class="prompt-description-inline">${prompt.description}</span>
        `);
        
        // 更新收藏按钮
        $('#favoriteDetailBtn')
            .removeClass('active')
            .addClass(isFavorite ? 'active' : '')
            .attr('title', isFavorite ? '取消收藏' : '添加收藏')
            .html(isFavorite ? '❤️ 已收藏' : '🤍 收藏');
        
        // 解码并设置Prompt内容到编辑器
        const decodedPrompt = this.decodeBase64(prompt.prompt);
        if (window.promptEditor) {
            window.promptEditor.setValue(decodedPrompt);
            // 强制刷新显示
            setTimeout(() => {
                if (window.promptEditor) {
                    window.promptEditor.refresh();
                }
            }, 50);
        } else {
            // 如果编辑器还没初始化，先初始化再设置内容
            initializePromptEditor();
            if (window.promptEditor) {
                window.promptEditor.setValue(decodedPrompt);
                // 强制刷新显示
                setTimeout(() => {
                    if (window.promptEditor) {
                        window.promptEditor.refresh();
                    }
                }, 50);
            } else {
                // 如果CodeMirror初始化失败，使用备用textarea
                const textarea = document.getElementById('promptTextarea');
                if (textarea) {
                    textarea.value = decodedPrompt;
                }
            }
        }
        
        // 渲染示例
        this.renderExamples(prompt.examples || []);
        
        // 隐藏空状态，显示详情内容
        $('#promptDetail .empty-state').hide();
        $('#promptDetail .detail-content').show();
        $('#promptDetail').addClass('active');
        
        // 更新URL（可选）
        if (history.pushState) {
            history.pushState(null, null, `#prompt-${promptId}`);
        }
    }
    
    // 渲染示例
    renderExamples(examples) {
        const container = $('#promptExamples');
        container.empty();
        
        if (examples.length === 0) {
            container.append('<h3>💡 使用示例</h3>');
            container.append('<div class="no-examples">暂无示例</div>');
            return;
        }
        
        examples.forEach((example, index) => {
            const exampleHtml = $(`
                <div class="example-item">
                    <div class="example-header">
                        <h3>💡 使用示例</h3>
                        <div class="example-title-actions">
                            <h4 class="example-title">${example.title}</h4>
                            <button class="btn-icon copy-example-btn" data-index="${index}" title="复制示例代码">
                                📋
                            </button>
                        </div>
                    </div>
                    <div class="example-code">
                        <pre><code>${this.escapeHtml(this.decodeBase64(example.code))}</code></pre>
                    </div>
                </div>
            `);
            
            container.append(exampleHtml);
        });
    }
    
    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 隐藏Prompt详情
    hidePromptDetail() {
        $('#promptDetail').removeClass('active');
        $('#promptDetail .detail-content').hide();
        $('#promptDetail .empty-state').show();
        this.currentPrompt = null;
        
        // 清除URL hash（可选）
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
    }
    
    // 搜索和筛选
    filterPrompts() {
        const searchTerm = $('#searchInput').val().toLowerCase().trim();
        const categoryFilter = $('#categoryFilter').val();
        const languageFilter = $('#languageFilter').val();
        const difficultyFilter = $('#difficultyFilter').val();
        const showFavoritesOnly = $('#favoritesFilter').is(':checked');
        
        this.filteredPrompts = this.prompts.filter(prompt => {
            // 搜索关键词匹配
            const matchesSearch = !searchTerm || 
                prompt.title.toLowerCase().includes(searchTerm) ||
                prompt.description.toLowerCase().includes(searchTerm) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                prompt.prompt.toLowerCase().includes(searchTerm);
            
            // 分类筛选
            const matchesCategory = !categoryFilter || prompt.category === categoryFilter;
            
            // 语言筛选
            const matchesLanguage = !languageFilter || prompt.language === languageFilter;
            
            // 难度筛选
            const matchesDifficulty = !difficultyFilter || prompt.difficulty === difficultyFilter;
            
            // 收藏筛选
            const matchesFavorites = !showFavoritesOnly || this.favorites.includes(prompt.id);
            
            return matchesSearch && matchesCategory && matchesLanguage && 
                   matchesDifficulty && matchesFavorites;
        });
        
        this.renderPrompts();
        this.updateStats();
    }
    
    // 更新统计信息
    updateStats() {
        const totalCount = this.prompts.length;
        const filteredCount = this.filteredPrompts.length;
        const favoritesCount = this.favorites.length;
        
        // 更新totalCount元素
        $('#totalCount').text(totalCount);
        
        // 更新收藏角标
        $('#favoritesCount').text(favoritesCount);
        
        // 如果没有收藏，隐藏角标；有收藏则显示
        if (favoritesCount > 0) {
            $('#favoritesCount').addClass('show');
        } else {
            $('#favoritesCount').removeClass('show');
        }
    }
    
    // 切换收藏状态
    toggleFavorite(promptId) {
        const index = this.favorites.indexOf(promptId);
        
        if (index > -1) {
            // 取消收藏
            this.favorites.splice(index, 1);
            this.showMessage('已取消收藏', 'info');
        } else {
            // 添加收藏
            this.favorites.push(promptId);
            this.showMessage('已添加到收藏', 'success');
        }
        
        this.saveFavorites();
        this.renderPrompts();
        this.updateStats();
        
        // 如果当前显示的是该Prompt的详情，更新收藏按钮
        if (this.currentPrompt && this.currentPrompt.id === promptId) {
            const isFavorite = this.favorites.includes(promptId);
            $('#favoriteDetailBtn')
                .removeClass('active')
                .addClass(isFavorite ? 'active' : '')
                .attr('title', isFavorite ? '取消收藏' : '添加收藏')
                .html(isFavorite ? '❤️ 已收藏' : '🤍 收藏');
        }
    }
    
    // 复制Prompt内容
    copyPrompt() {
        if (!this.currentPrompt) return;
        
        // 优先从编辑器中获取当前内容
        let textToCopy;
        if (window.promptEditor) {
            textToCopy = window.promptEditor.getValue();
        } else {
            const textarea = document.getElementById('promptTextarea');
            if (textarea) {
                textToCopy = textarea.value;
            } else {
                textToCopy = this.currentPrompt.prompt;
            }
        }
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showMessage('Prompt已复制到剪贴板', 'success');
            }).catch(() => {
                this.fallbackCopy(textToCopy);
            });
        } else {
            this.fallbackCopy(textToCopy);
        }
    }
    
    // 复制示例代码
    copyExample(exampleIndex) {
        if (!this.currentPrompt || !this.currentPrompt.examples) return;
        
        const example = this.currentPrompt.examples[exampleIndex];
        if (!example) return;
        
        const textToCopy = this.decodeBase64(example.code);
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showMessage('示例代码已复制到剪贴板', 'success');
            }).catch(() => {
                this.fallbackCopy(textToCopy);
            });
        } else {
            this.fallbackCopy(textToCopy);
        }
    }
    
    // 备用复制方法
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('内容已复制到剪贴板', 'success');
        } catch (err) {
            this.showMessage('复制失败，请手动复制', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    // 显示收藏夹
    showFavorites() {
        const favoritePrompts = this.prompts.filter(p => this.favorites.includes(p.id));
        const container = $('#favoritesList');
        container.empty();
        
        if (favoritePrompts.length === 0) {
            container.html(`
                <div class="no-favorites">
                    <div class="no-favorites-icon">💝</div>
                    <div class="no-favorites-text">还没有收藏的Prompt</div>
                    <div class="no-favorites-hint">点击Prompt卡片上的心形图标来收藏</div>
                </div>
            `);
        } else {
            favoritePrompts.forEach(prompt => {
                const category = this.categories.find(c => c.id === prompt.category);
                const language = this.languages.find(l => l.id === prompt.language);
                
                const favoriteItem = $(`
                    <div class="favorite-item" data-id="${prompt.id}">
                        <div class="favorite-header">
                            <div class="favorite-title">${prompt.title}</div>
                            <button class="btn-icon remove-favorite-btn" data-id="${prompt.id}" title="取消收藏">
                                ❌
                            </button>
                        </div>
                        <div class="favorite-meta">
                            <span>${category.icon} ${category.name}</span>
                            <span>${language.icon} ${language.name}</span>
                        </div>
                        <div class="favorite-description">${prompt.description}</div>
                    </div>
                `);
                
                container.append(favoriteItem);
            });
        }
        
        $('#favoritesModal').addClass('active');
    }
    
    // 隐藏收藏夹
    hideFavorites() {
        $('#favoritesModal').removeClass('active');
    }
    
    // 清空搜索
    clearSearch() {
        $('#searchInput').val('');
        $('#categoryFilter').val('');
        $('#languageFilter').val('');
        $('#difficultyFilter').val('');
        $('#favoritesFilter').prop('checked', false);
        this.filterPrompts();
    }
    
    // 保存收藏到本地存储
    saveFavorites() {
        try {
            localStorage.setItem('prompt-library-favorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.warn('无法保存收藏到本地存储:', e);
        }
    }
    
    // 从本地存储加载收藏
    loadFavorites() {
        try {
            const saved = localStorage.getItem('prompt-library-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('无法从本地存储加载收藏:', e);
            return [];
        }
    }
    
    // 显示消息提示
    showMessage(message, type = 'info') {
        const messageEl = $(`
            <div class="message message-${type}">
                <span class="message-text">${message}</span>
                <button class="message-close">×</button>
            </div>
        `);
        
        $('body').append(messageEl);
        
        // 自动消失
        setTimeout(() => {
            messageEl.addClass('fade-out');
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
        
        // 点击关闭
        messageEl.find('.message-close').on('click', () => {
            messageEl.addClass('fade-out');
            setTimeout(() => messageEl.remove(), 300);
        });
    }
    
    // 绑定事件
    bindEvents() {
        // 搜索和筛选事件
        $('#searchInput').on('input', () => this.filterPrompts());
        $('#categoryFilter, #languageFilter, #difficultyFilter').on('change', () => this.filterPrompts());
        $('#favoritesFilter').on('change', () => this.filterPrompts());
        
        // 清空搜索
        $('#clearSearchBtn').on('click', () => this.clearSearch());
        
        // Prompt项目点击
        $(document).on('click', '.prompt-item', (e) => {
            if ($(e.target).closest('.favorite-btn').length) return;
            const promptId = $(e.currentTarget).data('id');
            this.showPromptDetail(promptId);
        });
        
        // 收藏按钮点击
        $(document).on('click', '.favorite-btn', (e) => {
            e.stopPropagation();
            const promptId = $(e.currentTarget).data('id');
            this.toggleFavorite(promptId);
        });
        
        // 详情面板收藏按钮
        $('#favoriteDetailBtn').on('click', () => {
            if (this.currentPrompt) {
                this.toggleFavorite(this.currentPrompt.id);
            }
        });
        
        // 复制按钮
        $('#copyPromptBtn').on('click', () => this.copyPrompt());
        
        // 复制详情按钮
        $('#copyDetailBtn').on('click', () => this.copyPrompt());
        
        // 使用示例按钮
        $('#useExampleBtn').on('click', () => {
            if (this.currentPrompt && this.currentPrompt.examples && this.currentPrompt.examples.length > 0) {
                const example = this.currentPrompt.examples[0];
                const textToCopy = this.decodeBase64(example.input || example.code || example.text || '');
                this.copyToClipboard(textToCopy);
                this.showMessage('示例已复制到剪贴板', 'success');
            }
        });
        
        // 复制示例代码
        $(document).on('click', '.copy-example-btn', (e) => {
            const exampleIndex = parseInt($(e.currentTarget).data('index'));
            this.copyExample(exampleIndex);
        });
        
        // 关闭详情面板
        $('#closeDetailBtn').on('click', () => this.hidePromptDetail());
        
        // 浮动按钮
        $('#showFavoritesBtn').on('click', () => this.showFavorites());

        
        // 收藏夹模态框
        $('#closeFavoritesModal, #favoritesModal .modal-overlay').on('click', () => this.hideFavorites());
        
        // 收藏夹中的项目点击
        $(document).on('click', '.favorite-item', (e) => {
            if ($(e.target).closest('.remove-favorite-btn').length) return;
            const promptId = $(e.currentTarget).data('id');
            this.hideFavorites();
            this.showPromptDetail(promptId);
        });
        
        // 收藏夹中的移除按钮
        $(document).on('click', '.remove-favorite-btn', (e) => {
            e.stopPropagation();
            const promptId = $(e.currentTarget).data('id');
            this.toggleFavorite(promptId);
        });
        
        // 键盘快捷键
        $(document).on('keydown', (e) => {
            // ESC键关闭详情面板或收藏夹
            if (e.key === 'Escape') {
                if ($('#favoritesModal').hasClass('active')) {
                    this.hideFavorites();
                } else if ($('#promptDetail').hasClass('active')) {
                    this.hidePromptDetail();
                }
            }
            
            // Ctrl+F 聚焦搜索框
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                $('#searchInput').focus();
            }
            
            // Ctrl+C 复制当前Prompt
            if (e.ctrlKey && e.key === 'c' && this.currentPrompt && $('#promptDetail').hasClass('active')) {
                if (!$(e.target).is('input, textarea')) {
                    e.preventDefault();
                    this.copyPrompt();
                }
            }
        });
        

        
        // 处理URL hash
        $(window).on('hashchange', () => {
            const hash = window.location.hash;
            if (hash.startsWith('#prompt-')) {
                const promptId = hash.substring(8);
                this.showPromptDetail(promptId);
            }
        });
        
        // 页面加载时检查hash
        const hash = window.location.hash;
        if (hash.startsWith('#prompt-')) {
            const promptId = hash.substring(8);
            this.showPromptDetail(promptId);
        }
    }
}

// 初始化CodeMirror编辑器
function initializePromptEditor() {
    // 如果编辑器已经存在，直接返回
    if (window.promptEditor) {
        return;
    }
    
    // 检查是否存在目标元素
    const promptContentElement = document.getElementById('promptContent');
    if (typeof CodeMirror !== 'undefined' && promptContentElement) {
        try {
            // 清空元素内容，避免textarea冲突
            promptContentElement.innerHTML = '';
            
            window.promptEditor = CodeMirror(promptContentElement, {
                mode: 'text/plain',
                theme: 'default',
                lineNumbers: true,
                lineWrapping: true,
                readOnly: false,
                viewportMargin: 50,
                scrollbarStyle: 'native',
                value: '' // 设置初始值为空
            });
            
            // 强制刷新CodeMirror显示
            setTimeout(() => {
                if (window.promptEditor) {
                    window.promptEditor.refresh();
                }
            }, 100);
            
            console.log('CodeMirror编辑器初始化成功');
        } catch (error) {
            console.error('CodeMirror编辑器初始化失败:', error);
            // 如果CodeMirror初始化失败，创建一个简单的textarea作为备用
            promptContentElement.innerHTML = '<textarea id="promptTextarea" style="width: 100%; height: 100%; border: 2px solid #3498db; border-radius: 8px; padding: 10px; font-family: monospace; resize: none;"></textarea>';
        }
    } else {
        console.log('CodeMirror编辑器跳过初始化：目标元素不存在或CodeMirror未加载');
    }
}

// 等待所有资源加载完成后初始化
function initializeWhenReady() {
    console.log('检查初始化条件...');
    
    // 检查依赖
    if (typeof PROMPT_DATA === 'undefined') {
        console.error('PROMPT_DATA未加载，请确保prompt-data.js文件已正确引入');
        $('#promptList').html('<div class="alert alert-danger">数据加载失败，请刷新页面重试</div>');
        return;
    }
    
    console.log('PROMPT_DATA状态:', {
        exists: typeof PROMPT_DATA !== 'undefined',
        categories: PROMPT_DATA.categories ? PROMPT_DATA.categories.length : 0,
        languages: PROMPT_DATA.languages ? PROMPT_DATA.languages.length : 0,
        prompts: PROMPT_DATA.prompts ? PROMPT_DATA.prompts.length : 0
    });
    
    // 检查数据是否已经更新
    if (!PROMPT_DATA.prompts || PROMPT_DATA.prompts.length === 0) {
        console.log('数据还未准备好，等待中...');
        setTimeout(initializeWhenReady, 100);
        return;
    }
    
    console.log('PROMPT_DATA已加载:', {
        categories: PROMPT_DATA.categories?.length,
        languages: PROMPT_DATA.languages?.length,
        prompts: PROMPT_DATA.prompts?.length
    });
    
    try {
        // 初始化编辑器
        initializePromptEditor();
        
        // 初始化Prompt库
        window.promptLibrary = new PromptLibrary();
        
        console.log('Prompt库初始化完成');
    } catch (error) {
        console.error('Prompt库初始化失败:', error);
        console.error('错误堆栈:', error.stack);
        $('#promptList').html('<div class="alert alert-danger">初始化失败: ' + error.message + '</div>');
    }
}

// 页面加载完成后开始检查初始化条件
$(document).ready(function() {
    console.log('jQuery ready, 开始检查初始化条件');
    initializeWhenReady();
});

// 同时在window.onload时也尝试初始化（备用方案）
window.addEventListener('load', function() {
    if (!window.promptLibrary) {
        console.log('window.onload触发，尝试初始化');
        initializeWhenReady();
    }
});