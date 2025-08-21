// ==UserScript==
// @name         下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  增强网页下载功能
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

class DownloadHelper {
    constructor() {
        this.downloads = [];
        this.isEnabled = true;
        this.downloadExtensions = [
            // 文档
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv',
            // 图片
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
            // 音频
            'mp3', 'wav', 'ogg', 'flac', 'aac',
            // 视频
            'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm',
            // 压缩文件
            'zip', 'rar', '7z', 'tar', 'gz',
            // 可执行文件
            'exe', 'msi', 'dmg', 'apk',
            // 其他
            'iso', 'torrent'
        ];
        this.init();
    }

    init() {
        this.createUI();
        this.interceptDownloads();
        this.enhanceLinks();
        console.log('下载助手已初始化');
    }

    createUI() {
        // 创建下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadHelperBtn';
        downloadBtn.innerHTML = '📥 下载';
        downloadBtn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 10000;
            background: #007bff; color: white; border: none; border-radius: 5px;
            padding: 10px 15px; cursor: pointer; font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        downloadBtn.addEventListener('click', () => {
            this.toggleDownloadPanel();
        });
        
        document.body.appendChild(downloadBtn);
        
        // 创建下载面板
        this.createDownloadPanel();
    }

    createDownloadPanel() {
        const panel = document.createElement('div');
        panel.id = 'downloadPanel';
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 10000;
            background: white; border: 1px solid #ddd; border-radius: 8px;
            padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif; width: 300px; max-height: 400px;
            overflow-y: auto; display: none;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #333;">📥 下载管理器</div>
            <div id="downloadList" style="margin-bottom: 10px;">暂无下载</div>
            <div style="text-align: center;">
                <button id="clearDownloadsBtn" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">清空列表</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('clearDownloadsBtn').addEventListener('click', () => {
            this.clearDownloads();
        });
    }

    toggleDownloadPanel() {
        const panel = document.getElementById('downloadPanel');
        const btn = document.getElementById('downloadHelperBtn');
        
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            btn.style.display = 'none';
            this.updateDownloadList();
        } else {
            panel.style.display = 'none';
            btn.style.display = 'block';
        }
    }

    updateDownloadList() {
        const list = document.getElementById('downloadList');
        
        if (this.downloads.length === 0) {
            list.innerHTML = '暂无下载';
            return;
        }
        
        list.innerHTML = this.downloads.map(download => `
            <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 5px; word-break: break-all;">${download.filename}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                    状态: ${this.getStatusText(download.status)}
                    ${download.progress ? ` | 进度: ${download.progress}%` : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    ${download.status === 'completed' ? 
                        `<a href="${download.url}" download style="flex: 1; text-align: center; padding: 3px; background: #28a745; color: white; text-decoration: none; border-radius: 3px; font-size: 12px;">下载</a>` : 
                        ''
                    }
                    <button onclick="window.downloadHelper.removeDownload('${download.id}')" style="flex: 1; padding: 3px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">删除</button>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '等待中',
            'downloading': '下载中',
            'completed': '已完成',
            'failed': '失败'
        };
        return statusMap[status] || status;
    }

    addDownload(url, filename) {
        const id = Date.now().toString();
        const download = {
            id,
            url,
            filename: filename || this.getFilenameFromUrl(url),
            status: 'pending',
            progress: 0,
            size: 0,
            startTime: Date.now()
        };
        
        this.downloads.unshift(download);
        this.updateDownloadList();
        
        // 模拟下载过程
        this.simulateDownload(id);
        
        return id;
    }

    simulateDownload(id) {
        const download = this.downloads.find(d => d.id === id);
        if (!download) return;
        
        download.status = 'downloading';
        
        // 获取文件大小
        this.getFileSize(download.url).then(size => {
            download.size = size;
            this.updateDownloadList();
        }).catch(() => {
            // 忽略错误
        });
        
        // 模拟下载进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                download.status = 'completed';
            }
            
            download.progress = Math.floor(progress);
            this.updateDownloadList();
        }, 500);
    }

    removeDownload(id) {
        this.downloads = this.downloads.filter(d => d.id !== id);
        this.updateDownloadList();
    }

    clearDownloads() {
        this.downloads = [];
        this.updateDownloadList();
    }

    getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            return filename || 'unknown_file';
        } catch (e) {
            return 'unknown_file';
        }
    }

    async getFileSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            return contentLength ? parseInt(contentLength, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    interceptDownloads() {
        // 拦截下载链接点击
        document.addEventListener('click', (e) => {
            if (!this.isEnabled) return;
            
            const link = e.target.closest('a');
            if (link && this.isDownloadLink(link)) {
                e.preventDefault();
                
                this.addDownload(link.href, link.download || null);
                this.showDownloadStartedNotification(link.href);
            }
        });
        
        // 创建增强下载面板
        this.createEnhancedDownloadPanel();
    }

    createEnhancedDownloadPanel() {
        const panel = document.createElement('div');
        panel.id = 'enhancedDownloadPanel';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 1px solid #ddd; border-radius: 8px;
            padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif; width: 400px; z-index: 10001;
            display: none;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px; color: #333;">
                📥 增强下载
                <button id="closeEnhancedDownloadBtn" style="float: right; background: none; border: none; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
            <div id="downloadDetails" style="margin-bottom: 15px;"></div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">保存为:</label>
                <input id="downloadFilename" type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="startDownloadBtn" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">开始下载</button>
                <button id="cancelDownloadBtn" style="flex: 1; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('closeEnhancedDownloadBtn').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        document.getElementById('cancelDownloadBtn').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        document.getElementById('startDownloadBtn').addEventListener('click', () => {
            const url = panel.dataset.url;
            const filename = document.getElementById('downloadFilename').value;
            
            if (url) {
                this.addDownload(url, filename);
                panel.style.display = 'none';
                this.showDownloadStartedNotification(url);
            }
        });
    }

    showEnhancedDownloadPanel(url) {
        const panel = document.getElementById('enhancedDownloadPanel');
        const detailsDiv = document.getElementById('downloadDetails');
        const filenameInput = document.getElementById('downloadFilename');
        
        panel.dataset.url = url;
        const filename = this.getFilenameFromUrl(url);
        filenameInput.value = filename;
        
        // 获取文件信息
        this.getFileInfo(url).then(info => {
            detailsDiv.innerHTML = `
                <div style="margin-bottom: 5px;"><strong>文件:</strong> ${filename}</div>
                ${info.size ? `<div style="margin-bottom: 5px;"><strong>大小:</strong> ${this.formatFileSize(info.size)}</div>` : ''}
                ${info.type ? `<div><strong>类型:</strong> ${info.type}</div>` : ''}
            `;
        }).catch(() => {
            detailsDiv.innerHTML = `<div><strong>文件:</strong> ${filename}</div>`;
        });
        
        panel.style.display = 'block';
    }

    async getFileInfo(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return {
                size: parseInt(response.headers.get('content-length') || '0', 10),
                type: response.headers.get('content-type') || ''
            };
        } catch (e) {
            return { size: 0, type: '' };
        }
    }

    isDownloadLink(link) {
        if (!link.href) return false;
        
        // 检查是否有download属性
        if (link.hasAttribute('download')) return true;
        
        // 检查文件扩展名
        const url = new URL(link.href);
        const pathname = url.pathname;
        return this.downloadExtensions.some(ext => pathname.endsWith(`.${ext}`));
    }

    enhanceLinks() {
        // 增强页面上的下载链接
        if (!this.isEnabled) return;
        
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (this.isDownloadLink(link) && !link.dataset.enhanced) {
                link.dataset.enhanced = 'true';
                
                // 添加下载图标
                const icon = document.createElement('span');
                icon.innerHTML = ' 📥';
                icon.style.cssText = `
                    display: inline-block;
                    margin-left: 5px;
                    font-size: 14px;
                `;
                
                link.appendChild(icon);
                
                // 添加点击事件
                link.addEventListener('click', (e) => {
                    if (this.isEnabled) {
                        e.preventDefault();
                        this.showEnhancedDownloadPanel(link.href);
                    }
                });
            }
        });
    }

    showDownloadStartedNotification(url) {
        const filename = this.getFilenameFromUrl(url);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; z-index: 10000;
            background: #28a745; color: white; border-radius: 5px;
            padding: 10px 15px; font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold;">下载已开始</div>
            <div style="font-size: 12px; word-break: break-all;">${filename}</div>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动关闭
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // 高级下载功能
    async downloadWithProgress(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const contentLength = response.headers.get('content-length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            let loaded = 0;
            
            const id = Date.now().toString();
            const download = {
                id,
                url,
                filename: filename || this.getFilenameFromUrl(url),
                status: 'downloading',
                progress: 0,
                size: total,
                startTime: Date.now(),
                error: null
            };
            
            this.downloads.unshift(download);
            this.updateDownloadList();
            
            const reader = response.body.getReader();
            const chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                
                if (total) {
                    download.progress = Math.floor((loaded / total) * 100);
                    this.updateDownloadList();
                }
            }
            
            // 完成下载
            download.status = 'completed';
            download.progress = 100;
            this.updateDownloadList();
            
            // 创建Blob并下载
            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = download.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            return id;
        } catch (error) {
            const id = Date.now().toString();
            const download = {
                id,
                url,
                filename: filename || this.getFilenameFromUrl(url),
                status: 'failed',
                progress: 0,
                size: 0,
                startTime: Date.now(),
                error: error.message
            };
            
            this.downloads.unshift(download);
            this.updateDownloadList();
            
            throw error;
        }
    }

    // 批量下载功能
    batchDownload(urls) {
        if (!Array.isArray(urls) || urls.length === 0) return;
        
        // 创建批量下载面板
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 1px solid #ddd; border-radius: 8px;
            padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif; width: 500px; z-index: 10001;
        `;
        
        container.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px; color: #333;">
                📥 批量下载 (${urls.length}个文件)
                <button id="closeBatchDownloadBtn" style="float: right; background: none; border: none; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
            <div id="batchDownloadList" style="max-height: 300px; overflow-y: auto; margin-bottom: 15px;"></div>
            <div style="display: flex; gap: 10px;">
                <button id="startBatchDownloadBtn" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">开始下载</button>
                <button id="cancelBatchDownloadBtn" style="flex: 1; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // 填充下载列表
        const listContainer = document.getElementById('batchDownloadList');
        listContainer.innerHTML = urls.map(url => `
            <div style="padding: 8px; border-bottom: 1px solid #eee;">
                <div style="font-weight: bold; margin-bottom: 3px; word-break: break-all;">${this.getFilenameFromUrl(url)}</div>
                <div style="font-size: 12px; color: #666;">${url}</div>
            </div>
        `).join('');
        
        // 绑定事件
        document.getElementById('closeBatchDownloadBtn').addEventListener('click', () => {
            container.remove();
        });
        
        document.getElementById('cancelBatchDownloadBtn').addEventListener('click', () => {
            container.remove();
        });
        
        document.getElementById('startBatchDownloadBtn').addEventListener('click', () => {
            container.remove();
            
            // 开始批量下载
            urls.forEach(url => {
                this.addDownload(url);
            });
            
            // 显示下载面板
            this.toggleDownloadPanel();
        });
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        window.downloadHelper = new DownloadHelper();
    });
}

export default DownloadHelper;