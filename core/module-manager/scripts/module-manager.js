


// 模块管理器类
class ModuleManager {
    constructor() {

        this.MODULE_IDS = window.ModulesConfig.MODULE_IDS;
        this.availableModules = window.ModulesConfig.availableModules;
        this.defaultInstalled = window.ModulesConfig.defaultInstalled;

        this.modules = [];
        this.installedModules = []; // popup中显示的模块
        this.contextMenuModules = []; // 右键菜单中显示的模块
        this.init();
    }


    async init() {
        try {
            console.log('开始初始化模块管理器...');

            this.bindEvents();
            await this.loadConfiguration();
            await this.scanModules();
            await this.loadModuleOrder(); // 加载保存的模块顺序

            console.log('初始化完成，开始渲染...');
            this.renderModules();
            this.updateStats();
            this.updatePresetStatus();

            // 延迟更新预览，确保DOM元素已加载
            setTimeout(() => {
                this.updatePreview();
            }, 100);

            this.showStatus('模块管理器初始化完成');
        } catch (error) {
            console.error('模块管理器初始化失败:', error);
            this.showStatus('模块管理器初始化失败: ' + error.message);

            // 显示错误信息给用户
            const container = document.querySelector('.container');
            if (container) {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'background: #fee; color: #c33; padding: 20px; margin: 20px; border: 1px solid #fcc; border-radius: 4px;';
                errorDiv.innerHTML = `
                    <h3>初始化失败</h3>
                    <p>错误信息: ${error.message}</p>
                    <p>请检查控制台获取详细信息，或刷新页面重试。</p>
                `;
                container.appendChild(errorDiv);
            }
        }
    }

    // 绑定事件
    bindEvents() {
        try {
            // 重置默认
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.installAllModules());
            } else {
                console.warn('resetBtn 元素未找到');
            }

            // 搜索功能
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.filterModules());
            } else {
                console.warn('searchInput 元素未找到');
            }
            if (searchBtn) {
                searchBtn.addEventListener('click', () => this.filterModules());
            } else {
                console.warn('searchBtn 元素未找到');
            }

            // 批量操作
            const installAllBtn = document.getElementById('installAllBtn');
            const uninstallAllBtn = document.getElementById('uninstallAllBtn');
            if (installAllBtn) {
                installAllBtn.addEventListener('click', () => this.installAllModules());
            } else {
                console.warn('installAllBtn 元素未找到');
            }
            if (uninstallAllBtn) {
                uninstallAllBtn.addEventListener('click', () => this.uninstallAllModules());
            } else {
                console.warn('uninstallAllBtn 元素未找到');
            }

            // 快速配置方案
            const presetBtns = document.querySelectorAll('.preset-btn');
            presetBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const presetType = e.target.closest('.preset-item').dataset.preset;
                    this.applyPreset(presetType);
                });
            });

            // 模态框
            const modalClose = document.getElementById('modalClose');
            const modalCancel = document.getElementById('modalCancel');
            if (modalClose) {
                modalClose.addEventListener('click', () => this.closeModal());
            } else {
                console.warn('modalClose 元素未找到');
            }
            if (modalCancel) {
                modalCancel.addEventListener('click', () => this.closeModal());
            } else {
                console.warn('modalCancel 元素未找到');
            }
        } catch (error) {
            console.error('绑定事件失败:', error);
        }
    }

    // 扫描所有模块
    async scanModules() {
        this.showStatus('正在扫描模块...');

        try {
            if (!availableModules || !Array.isArray(availableModules)) {
                throw new Error('availableModules 不是有效的数组');
            }

            this.modules = availableModules;
            console.log('模块扫描完成:', {
                totalModules: this.modules.length,
                modules: this.modules.map(m => ({ id: m.id, name: m.name }))
            });

            this.showStatus(`扫描完成，发现 ${this.modules.length} 个模块`);
        } catch (error) {
            console.error('扫描模块失败:', error);
            this.modules = [];
            this.showStatus('扫描模块失败: ' + error.message);
            throw error;
        }
    }

    // 加载配置
    async loadConfiguration() {
        try {
            // 默认添加到右键菜单的模块（可以为空或包含部分模块）
            const defaultContextMenu = [];

            // 检查是否在Chrome扩展环境中
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.sync.get(['installedModules', 'contextMenuModules', 'moduleOrder']);
                this.installedModules = result.installedModules || defaultInstalled;
                this.contextMenuModules = result.contextMenuModules || defaultContextMenu;
                this.moduleOrder = result.moduleOrder || defaultInstalled;
            } else {
                // 在普通网页环境中使用localStorage
                const stored = localStorage.getItem('moduleManagerConfig');
                if (stored) {
                    const config = JSON.parse(stored);
                    this.installedModules = config.installedModules || defaultInstalled;
                    this.contextMenuModules = config.contextMenuModules || defaultContextMenu;
                    this.moduleOrder = config.moduleOrder || defaultInstalled;
                } else {
                    this.installedModules = defaultInstalled;
                    this.contextMenuModules = defaultContextMenu;
                    this.moduleOrder = defaultInstalled;
                }
            }

        } catch (error) {
            console.error('加载配置失败:', error);
            this.showStatus('加载配置失败，使用默认配置');
            this.installedModules = defaultInstalled;
            this.contextMenuModules = [];
            this.moduleOrder = defaultInstalled;
        }
    }

    // 保存配置
    async saveConfiguration() {
        try {
            const config = {
                installedModules: this.installedModules,
                contextMenuModules: this.contextMenuModules,
                moduleOrder: this.moduleOrder
            };

            // 检查是否在Chrome扩展环境中
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.sync.set(config);
                await this.updateContextMenus();
                await this.notifyComponentsUpdate();
            } else {
                // 在普通网页环境中使用localStorage
                localStorage.setItem('moduleManagerConfig', JSON.stringify(config));
            }

            this.showStatus('配置保存成功');
        } catch (error) {
            console.error('保存配置失败:', error);
            this.showStatus('保存配置失败');
        }
    }


    // 更新右键菜单
    async updateContextMenus() {
        try {
            // 只在Chrome扩展环境中更新右键菜单
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                // 发送消息给background script更新右键菜单                
                await chrome.runtime.sendMessage({
                    action: 'updateContextMenus',
                    modules: this.contextMenuModules.map(moduleId => {
                        const module = this.modules.find(m => m.id === moduleId);
                        return {
                            id: moduleId,
                            name: module.name,
                            path: module.path,
                            icon: module.icon
                        };
                    })
                });
            }
        } catch (error) {
            console.error('更新右键菜单失败:', error);
        }
    }

    // 通知所有组件更新
    async notifyComponentsUpdate() {
        try {
            // 只在Chrome扩展环境中发送通知
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                // 通知popup更新
                await chrome.runtime.sendMessage({
                    action: 'updatePopupModules',
                    installedModules: this.installedModules,
                    moduleOrder: this.moduleOrder
                });

                // 通知内容脚本更新（如果有需要）
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'modulesUpdated',
                            installedModules: this.installedModules,
                            contextMenuModules: this.contextMenuModules
                        }).catch(() => {
                            // 忽略无法发送消息的标签页
                        });
                    });
                });
            }
        } catch (error) {
            console.error('通知组件更新失败:', error);
        }
    }

    // 渲染模块列表
    renderModules() {
        const modulesList = document.getElementById('modulesList');
        const filteredCountEl = document.getElementById('filteredCount');

        // 检查DOM元素是否存在
        if (!modulesList) {
            console.error('modulesList 元素未找到');
            return;
        }

        if (!this.modules || this.modules.length === 0) {
            console.warn('没有可用的模块数据');
            modulesList.innerHTML = '<div class="loading">⚠️ 没有可用的模块数据</div>';
            if (filteredCountEl) {
                filteredCountEl.textContent = '0';
            }
            return;
        }

        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';

        // 过滤模块
        let filteredModules = this.modules;
        if (searchTerm) {
            filteredModules = this.modules.filter(module =>
                module.name.toLowerCase().includes(searchTerm) ||
                module.description.toLowerCase().includes(searchTerm) ||
                module.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
            );
        }

        // 更新计数
        if (filteredCountEl) {
            filteredCountEl.textContent = filteredModules.length;
        }

        // 按安装状态和顺序排序
        filteredModules.sort((a, b) => {
            const aInstalled = this.installedModules.includes(a.id);
            const bInstalled = this.installedModules.includes(b.id);

            if (aInstalled && bInstalled) {
                return this.moduleOrder.indexOf(a.id) - this.moduleOrder.indexOf(b.id);
            }
            if (aInstalled && !bInstalled) return -1;
            if (!aInstalled && bInstalled) return 1;
            return a.name.localeCompare(b.name);
        });

        modulesList.innerHTML = '';

        filteredModules.forEach((module, index) => {
            try {
                const moduleItem = this.createModuleItem(module, index);
                modulesList.appendChild(moduleItem);
            } catch (error) {
                console.error('创建模块项失败:', module, error);
            }
        });

        if (filteredModules.length === 0) {
            modulesList.innerHTML = '<div class="loading">🔍 没有找到匹配的模块</div>';
        }
    }

    // 创建模块项
    createModuleItem(module, index) {
        const isInPopup = this.installedModules.includes(module.id);
        const isInContextMenu = this.contextMenuModules.includes(module.id);

        const item = document.createElement('div');
        item.className = `module-item ${(isInPopup || isInContextMenu) ? 'installed' : ''}`;
        item.dataset.moduleId = module.id;
        item.draggable = true;
        item.dataset.index = index;

        const hidePreviewIds = ['page-screenshot', 'dashboard', 'get-color'];
        const showPreview = !hidePreviewIds.includes(module.id);

        item.innerHTML = `
            <div class="module-icon">${module.icon}</div>
            <div class="module-info">
                <div class="module-name">${module.name}</div>
                <div class="module-description">${module.description}</div>
            </div>
            <div class="module-status">
                <div class="status-badges">
                    <div class="status-badge ${isInPopup ? 'status-installed' : 'status-available'}">
                        ${isInPopup ? '✓ Popup' : '○ Popup'}
                    </div>
                    <div class="status-badge ${isInContextMenu ? 'status-installed' : 'status-available'}">
                        ${isInContextMenu ? '✓ 右键' : '○ 右键'}
                    </div>
                </div>
            </div>
            <div class="module-actions">
                <button class="action-btn ${isInPopup ? 'uninstall-btn' : 'install-btn'}" 
                        data-action="${isInPopup ? 'uninstall-popup' : 'install-popup'}" 
                        data-module-id="${module.id}">
                    ${isInPopup ? '移除' : '安装'}
                </button>
                <button class="action-btn ${isInContextMenu ? 'uninstall-btn' : 'install-btn'}" 
                        data-action="${isInContextMenu ? 'remove-context' : 'add-context'}" 
                        data-module-id="${module.id}">
                    ${isInContextMenu ? '移除右键' : '增加右键'}
                </button>
                ${showPreview ? `
        <button class="action-btn preview-btn" data-action="preview" data-module-id="${module.id}">
            预览
        </button>` : ''}
            </div>
        `;
        item.draggable = isInPopup;

        // 绑定事件
        this.bindModuleItemEvents(item);

        return item;
    }

    // 绑定模块项事件
    bindModuleItemEvents(item) {
        // 点击模块项显示详情
        item.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.showModuleDetails(item.dataset.moduleId);
            }
        });

        // 绑定按钮事件
        const buttons = item.querySelectorAll('button[data-action]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                const moduleId = button.dataset.moduleId;

                if (action === 'context-menu') {
                    this.toggleContextMenu(moduleId);
                } else {
                    this.handleModuleAction(moduleId, action);
                }
            });
        });

        // 添加拖拽事件
        this.bindDragEvents(item);
    }

    // 绑定拖拽事件
    bindDragEvents(item) {
        let draggedElement = null;
        let placeholder = null;

        item.addEventListener('dragstart', (e) => {
            draggedElement = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.outerHTML);

            // 为容器添加dragover事件
            const modulesList = document.getElementById('modulesList');
            this.setupContainerDragEvents(modulesList, draggedElement);
        });

        item.addEventListener('dragend', (e) => {
            item.classList.remove('dragging');
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            draggedElement = null;
            placeholder = null;

            // 清理容器事件
            const modulesList = document.getElementById('modulesList');
            this.cleanupContainerDragEvents(modulesList);
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement && draggedElement !== item) {
                this.handleModuleDrop(draggedElement, item);
            }
        });
    }

    // 设置容器拖拽事件
    setupContainerDragEvents(container, draggedElement) {
        this.containerDragOverHandler = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const afterElement = this.getDragAfterElement(container, e.clientY);

            // 移除现有的placeholder
            const existingPlaceholder = container.querySelector('.drag-placeholder');
            if (existingPlaceholder) {
                existingPlaceholder.remove();
            }

            // 创建新的placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'drag-placeholder';
            placeholder.innerHTML = '<div class="placeholder-content">放置到这里</div>';

            if (afterElement == null) {
                container.appendChild(placeholder);
            } else {
                container.insertBefore(placeholder, afterElement);
            }
        };

        this.containerDropHandler = (e) => {
            e.preventDefault();
            const placeholder = container.querySelector('.drag-placeholder');
            if (placeholder && draggedElement) {
                // 计算新的插入位置
                const placeholderIndex = [...container.children].indexOf(placeholder);

                // 计算实际的目标索引
                let targetIndex = 0;
                for (let i = 0; i < placeholderIndex; i++) {
                    if (container.children[i].classList.contains('module-item') &&
                        container.children[i].classList.contains('installed') &&
                        !container.children[i].classList.contains('dragging')) {
                        targetIndex++;
                    }
                }

                this.handleModuleDropAtIndex(draggedElement, targetIndex);
                placeholder.remove();
            }
        };

        container.addEventListener('dragover', this.containerDragOverHandler);
        container.addEventListener('drop', this.containerDropHandler);
    }

    // 清理容器拖拽事件
    cleanupContainerDragEvents(container) {
        if (this.containerDragOverHandler) {
            container.removeEventListener('dragover', this.containerDragOverHandler);
        }
        if (this.containerDropHandler) {
            container.removeEventListener('drop', this.containerDropHandler);
        }

        // 移除任何残留的placeholder
        const placeholder = container.querySelector('.drag-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }

    // 获取拖拽后的元素位置
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.module-item.installed:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // 处理模块拖拽放置到指定索引
    async handleModuleDropAtIndex(draggedItem, targetIndex) {
        const draggedModuleId = draggedItem.dataset.moduleId;
        const draggedIndex = this.moduleOrder.indexOf(draggedModuleId);

        if (draggedIndex === -1) return;

        // 如果拖拽到相同位置，不做任何操作
        if (draggedIndex === targetIndex || (draggedIndex < targetIndex && draggedIndex === targetIndex - 1)) {
            return;
        }

        // 从原位置移除
        this.moduleOrder.splice(draggedIndex, 1);

        // 调整目标索引（如果原位置在目标位置之前）
        const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;

        // 插入到新位置
        this.moduleOrder.splice(adjustedTargetIndex, 0, draggedModuleId);

        // 保存配置
        await this.saveConfiguration();

        // 重新渲染
        this.renderModules();
        this.updatePreview();
        const module = this.modules.find(m => m.id === draggedModuleId);
        this.showStatus(`已移动模块: ${module.name}`);
    }

    // 保存模块顺序到存储
    async saveModuleOrder() {
        const moduleOrder = this.modules.map(module => module.id);
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.sync.set({ moduleOrder });
            } else {
                localStorage.setItem('moduleOrder', JSON.stringify(moduleOrder));
            }
        } catch (error) {
            console.error('保存模块顺序失败:', error);
        }
    }

    // 从存储加载模块顺序
    async loadModuleOrder() {
        try {
            let moduleOrder;
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.sync.get(['moduleOrder']);
                moduleOrder = result.moduleOrder;
            } else {
                const stored = localStorage.getItem('moduleOrder');
                moduleOrder = stored ? JSON.parse(stored) : null;
            }

            this.moduleOrder = moduleOrder || defaultInstalled;
        } catch (error) {
            console.error('加载模块顺序失败:', error);
            this.moduleOrder = defaultInstalled;
        }
    }

    // 处理模块操作
    async handleModuleAction(moduleId, action) {
        switch (action) {
            case 'install-popup':
                await this.installToPopup(moduleId);
                break;
            case 'uninstall-popup':
                await this.uninstallFromPopup(moduleId);
                break;
            case 'add-context':
                await this.addToContextMenu(moduleId);
                break;
            case 'remove-context':
                await this.removeFromContextMenu(moduleId);
                break;
            case 'preview':
                this.previewModule(moduleId);
                break;
        }
    }

    // 添加模块到Popup
    async installToPopup(moduleId) {
        if (!this.installedModules.includes(moduleId)) {
            this.installedModules.push(moduleId);
            this.moduleOrder.push(moduleId);

            await this.saveConfiguration();
            this.renderModules();
            this.updateStats();
            this.updatePreview();
            this.updatePresetStatus();

            const module = this.modules.find(m => m.id === moduleId);
            this.showStatus(`已添加到Popup: ${module.name}`);
        }
    }

    // 从Popup移除模块
    async uninstallFromPopup(moduleId) {
        const moduleIndex = this.installedModules.indexOf(moduleId);
        if (moduleIndex > -1) {
            this.installedModules.splice(moduleIndex, 1);

            // 同时从moduleOrder中移除
            const orderIndex = this.moduleOrder.indexOf(moduleId);
            if (orderIndex > -1) {
                this.moduleOrder.splice(orderIndex, 1);
            }

            await this.saveConfiguration();
            this.renderModules();
            this.updateStats();
            this.updatePreview();
            this.updatePresetStatus();

            const module = this.modules.find(m => m.id === moduleId);
            this.showStatus(`已从Popup移除: ${module.name}`);
        }
    }

    // 添加模块到右键菜单
    async addToContextMenu(moduleId) {
        if (!this.contextMenuModules.includes(moduleId) && this.installedModules.includes(moduleId)) {
            this.contextMenuModules.push(moduleId);

            await this.saveConfiguration();
            this.renderModules();
            this.updateStats();

            const module = this.modules.find(m => m.id === moduleId);
            this.showStatus(`已添加到右键菜单: ${module.name}`);
        }
    }

    // 从右键菜单移除模块
    async removeFromContextMenu(moduleId) {
        const moduleIndex = this.contextMenuModules.indexOf(moduleId);
        if (moduleIndex > -1) {
            this.contextMenuModules.splice(moduleIndex, 1);

            await this.saveConfiguration();
            this.renderModules();
            this.updateStats();

            const module = this.modules.find(m => m.id === moduleId);
            this.showStatus(`已从右键菜单移除: ${module.name}`);
        }
    }

    // 切换右键菜单
    async toggleContextMenu(moduleId) {
        // 右键菜单功能已整合到安装/卸载功能中
        // 已安装的模块自动显示在右键菜单中
        this.showStatus('右键菜单已与模块安装状态同步');
    }

    // 移动模块顺序
    async moveModule(moduleId, direction) {
        const currentIndex = this.installedModules.indexOf(moduleId);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'up' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < this.installedModules.length - 1) {
            newIndex = currentIndex + 1;
        } else {
            return;
        }

        // 交换位置
        [this.installedModules[currentIndex], this.installedModules[newIndex]] =
            [this.installedModules[newIndex], this.installedModules[currentIndex]];

        await this.saveConfiguration();
        this.renderModules();
        this.updatePreview();

        const module = this.modules.find(m => m.id === moduleId);
        this.showStatus(`移动模块: ${module.name}`);
    }

    // 预览模块
    previewModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (module) {
            let url;
            // 检查是否在Chrome扩展环境中
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
                url = chrome.runtime.getURL(module.path);
            } else {
                // 在普通网页环境中使用相对路径
                url = '../' + module.path;
            }
            window.open(url, '_blank');
        }
    }

    // 显示模块详情
    showModuleDetails(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) {
            console.error('未找到模块:', moduleId);
            return;
        }

        const modal = document.getElementById('moduleModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        // 检查DOM元素是否存在
        if (!modal || !title || !content) {
            console.error('模态框元素未找到:', { modal, title, content });
            return;
        }

        try {
            title.textContent = module.name;
            content.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="font-size: 48px;">${module.icon}</div>
                    <div>
                        <h3 style="margin: 0; color: #2d3748;">${module.name}</h3>
                        <p style="margin: 5px 0; color: #718096;">${module.description}</p>
                        <p style="margin: 0; font-size: 12px; color: #a0aec0; font-family: monospace;">${module.path}</p>
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>分类:</strong> ${module.category}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>关键词:</strong> ${module.keywords.join(', ')}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>状态:</strong> 
                    <span class="status-badge ${this.installedModules.includes(moduleId) ? 'status-installed' : 'status-available'}">
                        ${this.installedModules.includes(moduleId) ? '已安装' : '可安装'}
                    </span>
                </div>
                ${this.installedModules.includes(moduleId) ? `
                    <div style="margin-bottom: 15px;">
                        <strong>右键菜单:</strong> 
                        <span class="status-badge ${this.contextMenuModules.includes(moduleId) ? 'status-installed' : 'status-available'}">
                            ${this.contextMenuModules.includes(moduleId) ? '已启用' : '未启用'}
                        </span>
                    </div>
                ` : ''}
            `;

            modal.style.display = 'flex';
        } catch (error) {
            console.error('显示模块详情失败:', error);
            content.innerHTML = '<div style="color: red; padding: 20px;">加载模块详情失败</div>';
            modal.style.display = 'flex';
        }
    }

    // 关闭模态框
    closeModal() {
        document.getElementById('moduleModal').style.display = 'none';
    }

    // 过滤模块
    filterModules() {
        this.renderModules();
    }

    // 全部添加到Popup
    async installAllModules() {
        this.installedModules = this.modules.map(m => m.id);
        this.moduleOrder = [...this.installedModules];

        await this.saveConfiguration();
        this.renderModules();
        this.updateStats();
        this.updatePreview();
        this.updatePresetStatus();
        this.showStatus('已将所有模块添加到Popup');
    }

    // 全部移除
    async uninstallAllModules() {
        this.installedModules = [];
        this.contextMenuModules = [];
        this.moduleOrder = [];

        await this.saveConfiguration();
        this.renderModules();
        this.updateStats();
        this.updatePreview();
        this.updatePresetStatus();
        this.showStatus('已移除所有模块');
    }

    // 导出配置


    // 应用预设配置方案
    async applyPreset(presetType) {
        const presets = window.ModulesConfig.getPresetConfigs();

        const preset = presets[presetType];
        if (!preset) {
            this.showStatus('未知的预设配置');
            return;
        }

        try {
            // 清空Popup模块（保留右键菜单模块不变）
            this.installedModules = [];
            this.moduleOrder = [];

            // 添加预设模块到Popup
            for (const moduleId of preset.modules) {
                if (this.modules.find(m => m.id === moduleId)) {
                    this.installedModules.push(moduleId);
                    this.moduleOrder.push(moduleId);
                }
            }

            // 保存配置
            await this.saveConfiguration();

            // 更新界面
            this.renderModules();
            this.updateStats();
            this.updatePreview();
            this.updatePresetStatus();

            this.showStatus(`已应用 ${preset.name} 配置方案到Popup`);
        } catch (error) {
            console.error('应用预设配置失败:', error);
            this.showStatus('应用配置方案失败');
        }
    }

    // 更新预设方案状态
    updatePresetStatus() {
        const presets = window.ModulesConfig.getPresetConfigs();

        document.querySelectorAll('.preset-item').forEach(item => {
            const presetType = item.dataset.preset;
            const preset = presets[presetType];
            const presetModules = preset ? preset.modules : [];
            const btn = item.querySelector('.preset-btn');

            console.log('检查预设:', {
                presetType,
                presetModules,
                currentModules: this.installedModules
            });
            // 检查是否完全匹配当前配置
            const isMatched = presetModules.length === this.installedModules.length &&
                presetModules.every(id => this.installedModules.includes(id)) &&
                this.installedModules.every(id => presetModules.includes(id));

            if (isMatched) {
                item.classList.add('applied');
                btn.textContent = '已应用';
            } else {
                item.classList.remove('applied');
                btn.textContent = '应用';
            }
        });
    }

    // 更新统计信息
    updateStats() {
        document.getElementById('totalModules').textContent = this.modules.length;
        document.getElementById('installedModules').textContent = this.installedModules.length;
        document.getElementById('contextMenuModules').textContent = this.contextMenuModules.length;
    }

    // 更新预览
    updatePreview() {
        const previewModules = document.getElementById('previewModules');
        if (!previewModules) {
            console.warn('previewModules element not found');
            return;
        }

        try {
            previewModules.innerHTML = '';

            // 按照 moduleOrder 的顺序显示已安装的模块
            const installedModulesInOrder = this.moduleOrder.map(id => this.modules.find(module => module.id === id)).filter(Boolean);

            console.log('更新预览:', {
                moduleOrder: this.moduleOrder,
                installedModules: this.installedModules,
                installedModulesInOrder: installedModulesInOrder.map(m => m.name)
            });

            installedModulesInOrder.forEach(module => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-module';
                previewItem.innerHTML = `
                    <div class="preview-module-icon">${module.icon}</div>
                    <div class="preview-module-info">
                        <div class="preview-module-name">${module.name}</div>
                        <div class="preview-module-desc">${module.description}</div>
                    </div>
                `;
                previewModules.appendChild(previewItem);
            });

            if (this.installedModules.length === 0) {
                previewModules.innerHTML = '<div style="padding: 20px; text-align: center; color: #718096;">暂无已安装的模块</div>';
            }
        } catch (error) {
            console.error('更新预览失败:', error);
            previewModules.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">预览更新失败</div>';
        }
    }



    // 显示状态信息
    showStatus(message) {
        console.log('状态:', message);

        // 可以在这里添加其他状态显示方式，比如toast通知
        // 暂时使用console.log来显示状态信息
    }
}

// 初始化模块管理器
document.addEventListener('DOMContentLoaded', () => {
    new ModuleManager();
});