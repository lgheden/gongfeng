// 页面截图工具类
class PageScreenshotTool {
    constructor() {
        this.currentTab = null;
        this.screenshotHistory = [];
        this.init();
    }

    // 初始化
    init() {
        this.initElements();
        this.bindEvents();
        this.loadHistory();
        this.getCurrentTabInfo();
    }

    // 初始化DOM元素
    initElements() {
        // 页面信息元素
        this.pageTitle = document.getElementById('pageTitle');
        this.pageUrl = document.getElementById('pageUrl');
        this.pageSize = document.getElementById('pageSize');
        
        // 配置元素
        this.screenshotFormat = document.getElementById('screenshotFormat');
        this.imageQuality = document.getElementById('imageQuality');
        this.qualityValue = document.getElementById('qualityValue');
        this.captureMode = document.getElementById('captureMode');
        this.includeScrollbars = document.getElementById('includeScrollbars');
        
        // 操作按钮
        this.captureBtn = document.getElementById('captureBtn');
        this.refreshPageInfo = document.getElementById('refreshPageInfo');
        
        // 状态和预览元素
        this.statusText = document.getElementById('statusText');
        this.progressBar = document.getElementById('progressBar');
        this.previewSection = document.getElementById('previewSection');
        this.previewImage = document.getElementById('previewImage');
        this.fileName = document.getElementById('fileName');
        this.imageDimensions = document.getElementById('imageDimensions');
        this.fileSize = document.getElementById('fileSize');
        this.imageFormat = document.getElementById('imageFormat');
        
        // 预览操作按钮
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // 历史记录元素
        this.historyList = document.getElementById('historyList');
        this.historyCount = document.getElementById('historyCount');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // 模态框元素
        this.imageModal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.closeModal = document.querySelector('.close');
    }

    // 绑定事件
    bindEvents() {
        // 质量滑块事件
        this.imageQuality.addEventListener('input', () => {
            this.qualityValue.textContent = this.imageQuality.value + '%';
        });
        
        // 格式变化事件
        this.screenshotFormat.addEventListener('change', () => {
            const isJpegOrWebp = ['jpeg', 'webp'].includes(this.screenshotFormat.value);
            this.imageQuality.disabled = !isJpegOrWebp;
            this.qualityValue.style.opacity = isJpegOrWebp ? '1' : '0.5';
        });
        
        // 操作按钮事件
        this.captureBtn.addEventListener('click', () => this.captureCurrentPage());
        this.refreshPageInfo.addEventListener('click', () => this.getCurrentTabInfo());
        
        // 预览操作事件
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearPreview());
        
        // 历史记录事件
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // 模态框事件
        this.closeModal.addEventListener('click', () => this.closeImageModal());
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) {
                this.closeImageModal();
            }
        });
        
        // 预览图片点击事件
        this.previewImage.addEventListener('click', () => {
            if (this.previewImage.src) {
                this.showImageModal(this.previewImage.src);
            }
        });
    }

    // 获取当前标签页信息
    async getCurrentTabInfo() {
        try {
            this.showStatus('正在获取页面信息...', 'info');
            
            // 检查是否在扩展环境中
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime && chrome.runtime.id) {
                try {
                    // 获取当前活动标签页
                    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                    this.currentTab = tab;
                    
                    // 更新页面信息
                    this.pageTitle.textContent = tab.title || '未知标题';
                    this.pageUrl.textContent = tab.url || '未知URL';
                    
                    // 获取页面尺寸
                    try {
                        const results = await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            function: () => {
                                return {
                                    width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                                    height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                                    viewportWidth: window.innerWidth,
                                    viewportHeight: window.innerHeight
                                };
                            }
                        });
                        
                        if (results && results[0] && results[0].result) {
                            const size = results[0].result;
                            this.pageSize.textContent = `${size.width} × ${size.height} (视口: ${size.viewportWidth} × ${size.viewportHeight})`;
                        } else {
                            this.pageSize.textContent = '无法获取页面尺寸';
                        }
                    } catch (error) {
                        console.warn('获取页面尺寸失败:', error);
                        this.pageSize.textContent = '无法获取页面尺寸';
                    }
                    
                    this.showStatus('页面信息获取成功（扩展模式）', 'success');
                } catch (error) {
                    console.warn('扩展API调用失败，切换到普通模式:', error);
                    this.loadCurrentPageInfo();
                }
            } else {
                // 非扩展环境，显示当前页面信息
                this.loadCurrentPageInfo();
            }
        } catch (error) {
            console.error('获取页面信息失败:', error);
            this.showStatus('获取页面信息失败: ' + error.message, 'error');
            
            // 显示错误信息
            this.pageTitle.textContent = '获取失败';
            this.pageUrl.textContent = '获取失败';
            this.pageSize.textContent = '获取失败';
        }
    }

    // 加载当前页面信息（非扩展模式）
    loadCurrentPageInfo() {
        this.pageTitle.textContent = document.title || '当前页面';
        this.pageUrl.textContent = window.location.href;
        
        const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
        const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
        this.pageSize.textContent = `${width} × ${height} (视口: ${window.innerWidth} × ${window.innerHeight})`;
        
        this.showStatus('当前页面信息已加载（普通网页模式）', 'info');
    }

    // 截取当前页面
    async captureCurrentPage() {
        try {
            this.showStatus('正在截取页面...', 'info');
            this.showProgress(true);
            this.captureBtn.disabled = true;
            
            const config = this.getScreenshotConfig();
            let screenshotData;
            
            // 检查是否在扩展环境中
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime && chrome.runtime.id && this.currentTab) {
                try {
                    screenshotData = await this.captureWithChromeAPI(config);
                } catch (error) {
                    console.warn('Chrome API截图失败，尝试使用html2canvas:', error);
                    screenshotData = await this.captureWithHtml2Canvas(config);
                }
            } else {
                // 非扩展环境，使用html2canvas
                screenshotData = await this.captureWithHtml2Canvas(config);
            }
            
            if (screenshotData) {
                this.displayScreenshot(screenshotData);
                this.addToHistory(screenshotData);
                this.showStatus('截图完成！', 'success');
            } else {
                throw new Error('截图数据为空');
            }
        } catch (error) {
            console.error('截图失败:', error);
            this.showStatus('截图失败: ' + error.message, 'error');
        } finally {
            this.showProgress(false);
            this.captureBtn.disabled = false;
        }
    }

    // 使用Chrome扩展API截图
    async captureWithChromeAPI(config) {
        try {
            // 使用Chrome的截图API
            const dataUrl = await chrome.tabs.captureVisibleTab(this.currentTab.windowId, {
                format: config.format === 'png' ? 'png' : 'jpeg',
                quality: config.format === 'png' ? undefined : config.quality
            });
            
            // 如果需要截取整个页面，需要滚动并拼接
            if (config.captureMode === 'full') {
                return await this.captureFullPageWithScrolling(config);
            }
            
            // 转换为blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            // 获取图片尺寸
            const img = new Image();
            img.src = dataUrl;
            await new Promise(resolve => img.onload = resolve);
            
            return {
                url: dataUrl,
                blob: blob,
                width: img.width,
                height: img.height,
                format: config.format,
                size: blob.size,
                timestamp: Date.now(),
                pageTitle: this.currentTab.title,
                pageUrl: this.currentTab.url
            };
        } catch (error) {
            console.error('Chrome API截图失败:', error);
            throw new Error('Chrome API截图失败: ' + error.message);
        }
    }

    // 截取整个页面（滚动拼接）
    async captureFullPageWithScrolling(config) {
        try {
            // 获取页面尺寸信息
            const [sizeResult] = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    return {
                        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                        scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                        viewportWidth: window.innerWidth,
                        viewportHeight: window.innerHeight,
                        originalScrollX: window.scrollX,
                        originalScrollY: window.scrollY
                    };
                }
            });
            
            const pageInfo = sizeResult.result;
            const screenshots = [];
            
            // 计算需要截取的次数
            const cols = Math.ceil(pageInfo.scrollWidth / pageInfo.viewportWidth);
            const rows = Math.ceil(pageInfo.scrollHeight / pageInfo.viewportHeight);
            
            // 逐块截图
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * pageInfo.viewportWidth;
                    const y = row * pageInfo.viewportHeight;
                    
                    // 滚动到指定位置
                    await chrome.scripting.executeScript({
                        target: { tabId: this.currentTab.id },
                        function: (scrollX, scrollY) => {
                            window.scrollTo(scrollX, scrollY);
                        },
                        args: [x, y]
                    });
                    
                    // 等待滚动完成
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    // 截图
                    const dataUrl = await chrome.tabs.captureVisibleTab(this.currentTab.windowId, {
                        format: config.format === 'png' ? 'png' : 'jpeg',
                        quality: config.format === 'png' ? undefined : config.quality
                    });
                    
                    screenshots.push({
                        dataUrl,
                        x,
                        y,
                        row,
                        col
                    });
                }
            }
            
            // 恢复原始滚动位置
            await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: (scrollX, scrollY) => {
                    window.scrollTo(scrollX, scrollY);
                },
                args: [pageInfo.originalScrollX, pageInfo.originalScrollY]
            });
            
            // 拼接图片
            const canvas = document.createElement('canvas');
            canvas.width = pageInfo.scrollWidth;
            canvas.height = pageInfo.scrollHeight;
            const ctx = canvas.getContext('2d');
            
            // 绘制所有截图片段
            for (const screenshot of screenshots) {
                const img = new Image();
                img.src = screenshot.dataUrl;
                await new Promise(resolve => img.onload = resolve);
                
                ctx.drawImage(img, screenshot.x, screenshot.y);
            }
            
            // 转换为指定格式
            const mimeType = this.getMimeType(config.format);
            const quality = config.format === 'png' ? undefined : config.quality / 100;
            
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve({
                        url,
                        blob,
                        width: canvas.width,
                        height: canvas.height,
                        format: config.format,
                        size: blob.size,
                        timestamp: Date.now(),
                        pageTitle: this.currentTab.title,
                        pageUrl: this.currentTab.url
                    });
                }, mimeType, quality);
            });
        } catch (error) {
            console.error('全页面截图失败:', error);
            throw new Error('全页面截图失败: ' + error.message);
        }
    }

    // 使用html2canvas截图（非扩展环境）
    async captureWithHtml2Canvas(config) {
        try {
            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas库未加载，请检查网络连接');
            }
            
            // 选择截图元素
            let element;
            if (config.captureMode === 'full') {
                // 全页面截图，选择整个文档
                element = document.documentElement;
            } else {
                // 可见区域截图，创建一个临时容器
                element = document.body;
            }
            
            // html2canvas配置
            const html2canvasOptions = {
                allowTaint: true,
                useCORS: true,
                scale: 1,
                logging: false,
                backgroundColor: '#ffffff'
            };
            
            // 如果是可见区域截图，设置尺寸限制
            if (config.captureMode === 'visible') {
                html2canvasOptions.width = window.innerWidth;
                html2canvasOptions.height = window.innerHeight;
                html2canvasOptions.scrollX = window.scrollX;
                html2canvasOptions.scrollY = window.scrollY;
            }
            
            // 如果不包含滚动条，添加忽略元素函数
            if (!config.includeScrollbars) {
                html2canvasOptions.ignoreElements = (element) => {
                    const style = window.getComputedStyle(element);
                    return style.overflow === 'scroll' || 
                           style.overflowX === 'scroll' || 
                           style.overflowY === 'scroll' ||
                           element.tagName === 'SCROLLBAR';
                };
            }
            
            // 执行截图
            const canvas = await html2canvas(element, html2canvasOptions);
            
            // 转换为指定格式
            const mimeType = this.getMimeType(config.format);
            const quality = config.format === 'png' ? undefined : config.quality / 100;
            
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('无法生成图片数据'));
                        return;
                    }
                    
                    const url = URL.createObjectURL(blob);
                    resolve({
                        url,
                        blob,
                        width: canvas.width,
                        height: canvas.height,
                        format: config.format,
                        size: blob.size,
                        timestamp: Date.now(),
                        pageTitle: document.title,
                        pageUrl: window.location.href
                    });
                }, mimeType, quality);
            });
        } catch (error) {
            console.error('html2canvas截图失败:', error);
            throw new Error('html2canvas截图失败: ' + error.message);
        }
    }

    // 获取截图配置
    getScreenshotConfig() {
        return {
            format: this.screenshotFormat.value,
            quality: parseInt(this.imageQuality.value),
            captureMode: this.captureMode.value,
            includeScrollbars: this.includeScrollbars.checked
        };
    }

    // 获取MIME类型
    getMimeType(format) {
        const mimeTypes = {
            'png': 'image/png',
            'jpeg': 'image/jpeg',
            'webp': 'image/webp'
        };
        return mimeTypes[format] || 'image/png';
    }

    // 显示截图
    displayScreenshot(screenshotData) {
        this.previewImage.src = screenshotData.url;
        this.fileName.textContent = this.generateFileName(screenshotData);
        this.imageDimensions.textContent = `${screenshotData.width} × ${screenshotData.height}`;
        this.fileSize.textContent = this.formatBytes(screenshotData.size);
        this.imageFormat.textContent = screenshotData.format.toUpperCase();
        
        this.previewSection.style.display = 'block';
        this.currentScreenshot = screenshotData;
    }

    // 下载图片
    downloadImage() {
        if (!this.currentScreenshot) return;
        
        const link = document.createElement('a');
        link.href = this.currentScreenshot.url;
        link.download = this.generateFileName(this.currentScreenshot);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showStatus('图片下载已开始', 'success');
    }

    // 复制到剪贴板
    async copyToClipboard() {
        if (!this.currentScreenshot) return;
        
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                const item = new ClipboardItem({
                    [this.currentScreenshot.blob.type]: this.currentScreenshot.blob
                });
                await navigator.clipboard.write([item]);
                this.showStatus('图片已复制到剪贴板', 'success');
            } else {
                throw new Error('浏览器不支持剪贴板API');
            }
        } catch (error) {
            console.error('复制失败:', error);
            this.showStatus('复制失败: ' + error.message, 'error');
        }
    }

    // 清空预览
    clearPreview() {
        this.previewSection.style.display = 'none';
        this.previewImage.src = '';
        this.currentScreenshot = null;
        this.showStatus('预览已清空', 'info');
    }

    // 添加到历史记录
    addToHistory(screenshotData) {
        this.screenshotHistory.unshift({
            ...screenshotData,
            id: Date.now() + Math.random()
        });
        
        // 限制历史记录数量
        if (this.screenshotHistory.length > 20) {
            this.screenshotHistory = this.screenshotHistory.slice(0, 20);
        }
        
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    // 更新历史记录显示
    updateHistoryDisplay() {
        this.historyCount.textContent = this.screenshotHistory.length;
        
        if (this.screenshotHistory.length === 0) {
            this.historyList.innerHTML = '<div class="empty-history">暂无截图历史</div>';
            return;
        }
        
        this.historyList.innerHTML = this.screenshotHistory.map(item => `
            <div class="history-item" onclick="pageScreenshotTool.showImageModal('${item.url}')">
                <img src="${item.url}" alt="历史截图">
                <div class="history-item-info">
                    <div class="history-item-title">${item.pageTitle || '未知页面'}</div>
                    <div>${new Date(item.timestamp).toLocaleString()}</div>
                    <div>${item.width} × ${item.height}</div>
                    <div>${this.formatBytes(item.size)}</div>
                </div>
            </div>
        `).join('');
    }

    // 清空历史记录
    clearHistory() {
        if (confirm('确定要清空所有截图历史吗？')) {
            this.screenshotHistory = [];
            this.updateHistoryDisplay();
            this.saveHistory();
            this.showStatus('历史记录已清空', 'info');
        }
    }

    // 显示图片模态框
    showImageModal(imageUrl) {
        this.modalImage.src = imageUrl;
        this.imageModal.style.display = 'block';
    }

    // 关闭图片模态框
    closeImageModal() {
        this.imageModal.style.display = 'none';
        this.modalImage.src = '';
    }

    // 生成文件名
    generateFileName(screenshotData) {
        const timestamp = new Date(screenshotData.timestamp).toISOString().replace(/[:.]/g, '-');
        const domain = this.extractDomain(screenshotData.pageUrl || '');
        return `screenshot-${domain}-${timestamp}.${screenshotData.format}`;
    }

    // 提取域名
    extractDomain(url) {
        try {
            const domain = new URL(url).hostname.replace(/^www\./, '');
            return domain.replace(/[^a-zA-Z0-9.-]/g, '_');
        } catch {
            return 'unknown';
        }
    }

    // 格式化字节
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 显示状态
    showStatus(message, type = 'info') {
        this.statusText.textContent = message;
        this.statusText.className = `status-text ${type}`;
    }

    // 显示/隐藏进度条
    showProgress(show) {
        this.progressBar.style.display = show ? 'block' : 'none';
    }

    // 保存历史记录
    saveHistory() {
        try {
            // 只保存基本信息，不保存blob数据
            const historyToSave = this.screenshotHistory.map(item => ({
                id: item.id,
                url: item.url,
                width: item.width,
                height: item.height,
                format: item.format,
                size: item.size,
                timestamp: item.timestamp,
                pageTitle: item.pageTitle,
                pageUrl: item.pageUrl
            }));
            localStorage.setItem('pageScreenshotHistory', JSON.stringify(historyToSave));
        } catch (error) {
            console.warn('保存历史记录失败:', error);
        }
    }

    // 加载历史记录
    loadHistory() {
        try {
            const saved = localStorage.getItem('pageScreenshotHistory');
            if (saved) {
                this.screenshotHistory = JSON.parse(saved);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.warn('加载历史记录失败:', error);
            this.screenshotHistory = [];
        }
    }
}

// 初始化工具
let pageScreenshotTool;
document.addEventListener('DOMContentLoaded', () => {
    try {
        pageScreenshotTool = new PageScreenshotTool();
    } catch (error) {
        console.error('页面截图工具初始化失败:', error);
        // 显示错误信息
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = '工具初始化失败: ' + error.message;
            statusText.className = 'status-text error';
        }
    }
});

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('页面错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});