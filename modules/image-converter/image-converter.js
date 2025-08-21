class ImageConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentFile = null;
        this.convertedBlob = null;
        this.batchFiles = [];
        
        // 初始化显示占位符
        this.showBatchPlaceholder();
    }

    initializeElements() {
        // 上传相关
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.imageInfo = document.getElementById('imageInfo');
        
        // 图片信息显示
        this.fileName = document.getElementById('fileName');
        this.fileFormat = document.getElementById('fileFormat');
        this.fileDimensions = document.getElementById('fileDimensions');
        this.fileSize = document.getElementById('fileSize');
        
        // 转换设置
        this.outputFormat = document.getElementById('outputFormat');
        this.quality = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.resizeEnabled = document.getElementById('resizeEnabled');
        this.sizeInputs = document.getElementById('sizeInputs');
        this.width = document.getElementById('width');
        this.height = document.getElementById('height');
        this.keepAspectRatio = document.getElementById('keepAspectRatio');
        
        // 按钮
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // 预览
        this.previewSection = document.getElementById('previewSection');
        this.originalImage = document.getElementById('originalImage');
        this.convertedImage = document.getElementById('convertedImage');
        this.originalFormat = document.getElementById('originalFormat');
        this.originalSize = document.getElementById('originalSize');
        this.convertedFormat = document.getElementById('convertedFormat');
        this.convertedSize = document.getElementById('convertedSize');
        this.compressionRatio = document.getElementById('compressionRatio');
        
        // 批量转换
        this.batchSelectBtn = document.getElementById('batchSelectBtn');
        this.batchFileInput = document.getElementById('batchFileInput');
        this.batchOutputFormat = document.getElementById('batchOutputFormat');
        this.batchConvertBtn = document.getElementById('batchConvertBtn');
        this.batchList = document.getElementById('batchList');
        this.fileList = document.getElementById('fileList');
        this.batchProgress = document.getElementById('batchProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // 状态栏
        this.statusBar = document.getElementById('statusBar');
    }

    bindEvents() {
        // Tab切换事件
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 使用currentTarget确保获取到按钮元素，而不是内部的子元素
                const tabName = e.currentTarget.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
        
        // 上传区域事件
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 拖拽上传
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // 质量滑块
        this.quality.addEventListener('input', () => {
            this.qualityValue.textContent = this.quality.value;
        });
        
        // 输出格式变化时更新质量控制显示
        this.outputFormat.addEventListener('change', () => {
            this.updateQualityControl();
        });
        
        // 尺寸调整
        this.resizeEnabled.addEventListener('change', () => {
            if (this.resizeEnabled.checked) {
                this.sizeInputs.classList.remove('hidden');
                this.sizeInputs.classList.add('flex');
            } else {
                this.sizeInputs.classList.remove('flex');
                this.sizeInputs.classList.add('hidden');
            }
        });
        
        // 宽高比保持
        this.width.addEventListener('input', () => this.handleSizeChange('width'));
        this.height.addEventListener('input', () => this.handleSizeChange('height'));
        
        // 按钮事件
        this.convertBtn.addEventListener('click', () => this.convertImage());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        
        // 批量转换
        this.batchSelectBtn.addEventListener('click', () => this.batchFileInput.click());
        this.batchFileInput.addEventListener('change', (e) => this.handleBatchFileSelect(e));
        this.batchConvertBtn.addEventListener('click', () => this.batchConvert());
    }
    
    updateQualityControl() {
        const format = this.outputFormat.value;
        const qualityContainer = this.quality.closest('.setting-item');
        
        if (format === 'svg' || format === 'ico') {
            qualityContainer.style.opacity = '0.5';
            qualityContainer.style.pointerEvents = 'none';
            this.quality.disabled = true;
        } else {
            qualityContainer.style.opacity = '1';
            qualityContainer.style.pointerEvents = 'auto';
            this.quality.disabled = false;
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    loadImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showStatus('请选择有效的图片文件', 'error');
            return;
        }

        this.currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.displayImageInfo(file, img);
                this.originalImage.src = e.target.result;
                this.convertBtn.disabled = false;
                this.updateQualityControl(); // 更新质量控制状态
                this.showStatus('图片加载成功', 'success');
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    displayImageInfo(file, img) {
        this.fileName.textContent = file.name;
        this.fileFormat.textContent = file.type.split('/')[1].toUpperCase();
        this.fileDimensions.textContent = `${img.width} × ${img.height}`;
        this.fileSize.textContent = this.formatFileSize(file.size);
        
        // 设置默认尺寸
        this.width.value = img.width;
        this.height.value = img.height;
        
        this.imageInfo.classList.remove('hidden');
    }

    handleSizeChange(changedField) {
        if (!this.keepAspectRatio.checked) return;
        
        const img = this.originalImage;
        if (!img.naturalWidth || !img.naturalHeight) return;
        
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        if (changedField === 'width') {
            const newWidth = parseInt(this.width.value);
            if (newWidth) {
                this.height.value = Math.round(newWidth / aspectRatio);
            }
        } else {
            const newHeight = parseInt(this.height.value);
            if (newHeight) {
                this.width.value = Math.round(newHeight * aspectRatio);
            }
        }
    }

    async convertImage() {
        if (!this.currentFile) {
            this.showStatus('请先选择图片', 'error');
            return;
        }

        try {
            this.convertBtn.disabled = true;
            this.showStatus('正在转换图片...', 'info');
            
            const outputFormat = this.outputFormat.value;
            
            // 特殊处理SVG格式
            if (outputFormat === 'svg') {
                await this.convertToSVG();
                return;
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = this.originalImage;
            
            // 设置画布尺寸
            if (this.resizeEnabled.checked) {
                canvas.width = parseInt(this.width.value) || img.naturalWidth;
                canvas.height = parseInt(this.height.value) || img.naturalHeight;
            } else {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
            }
            
            // 特殊处理ICO格式 - 限制尺寸
            if (outputFormat === 'ico') {
                const size = Math.min(canvas.width, canvas.height, 256); // ICO最大256x256
                canvas.width = size;
                canvas.height = size;
            }
            
            // 绘制图片
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 转换格式
            const quality = this.quality.value / 100;
            const mimeType = outputFormat === 'ico' ? 'image/png' : `image/${outputFormat}`;
            
            canvas.toBlob((blob) => {
                this.convertedBlob = blob;
                this.displayConvertedImage(blob, outputFormat);
                this.downloadBtn.disabled = false;
                this.convertBtn.disabled = false;
                this.showStatus('图片转换完成', 'success');
            }, mimeType, quality);
            
        } catch (error) {
            this.convertBtn.disabled = false;
            this.showStatus(`转换失败: ${error.message}`, 'error');
        }
    }

    displayConvertedImage(blob, format) {
        const url = URL.createObjectURL(blob);
        this.convertedImage.src = url;
        
        this.originalFormat.textContent = this.currentFile.type.split('/')[1].toUpperCase();
        this.originalSize.textContent = this.formatFileSize(this.currentFile.size);
        this.convertedFormat.textContent = format.toUpperCase();
        this.convertedSize.textContent = this.formatFileSize(blob.size);
        
        const ratio = ((this.currentFile.size - blob.size) / this.currentFile.size * 100).toFixed(1);
        this.compressionRatio.textContent = ratio > 0 ? `减少 ${ratio}%` : `增加 ${Math.abs(ratio)}%`;
        
        this.previewSection.classList.remove('hidden');
    }

    downloadImage() {
        if (!this.convertedBlob) {
            this.showStatus('没有可下载的图片', 'error');
            return;
        }

        const url = URL.createObjectURL(this.convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        
        const originalName = this.currentFile.name.split('.')[0];
        const format = this.outputFormat.value;
        let extension;
        
        switch (format) {
            case 'jpeg':
                extension = 'jpg';
                break;
            case 'ico':
                extension = 'ico';
                break;
            case 'svg':
                extension = 'svg';
                break;
            default:
                extension = format;
        }
        
        a.download = `${originalName}_converted.${extension}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('图片下载完成', 'success');
    }

    handleBatchFileSelect(event) {
        const files = Array.from(event.target.files);
        this.batchFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (this.batchFiles.length === 0) {
            this.showStatus('请选择有效的图片文件', 'error');
            return;
        }
        
        this.displayBatchFiles();
        this.batchConvertBtn.disabled = false;
        this.showStatus(`已选择 ${this.batchFiles.length} 个图片文件`, 'success');
    }

    displayBatchFiles() {
        this.fileList.innerHTML = '';
        
        // 隐藏占位符
        const placeholder = this.fileList.querySelector('.empty-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        this.batchFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between';
            fileItem.innerHTML = `
                <div class="file-info flex items-center space-x-3">
                    <div class="bg-blue-100 rounded-lg p-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="file-name font-medium text-gray-800">${file.name}</div>
                        <div class="file-details text-sm text-gray-500">${file.type.split('/')[1].toUpperCase()} • ${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <div class="file-status waiting px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">等待中</div>
            `;
            this.fileList.appendChild(fileItem);
        });
        
        this.batchList.classList.remove('hidden');
    }
    
    showBatchPlaceholder() {
        this.fileList.innerHTML = `
            <div class="empty-placeholder bg-white rounded-xl p-6 text-center border-2 border-dashed border-gray-300">
                <div class="flex flex-col items-center space-y-3">
                    <div class="bg-gray-100 rounded-full p-3">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-gray-500 font-medium">暂无文件</p>
                        <p class="text-sm text-gray-400">请先选择要转换的图片文件</p>
                    </div>
                </div>
            </div>
        `;
    }

    async batchConvert() {
        if (this.batchFiles.length === 0) {
            this.showStatus('请先选择图片文件', 'error');
            return;
        }

        this.batchConvertBtn.disabled = true;
        this.batchProgress.classList.remove('hidden');
        
        const outputFormat = this.batchOutputFormat.value;
        const convertedFiles = [];
        
        for (let i = 0; i < this.batchFiles.length; i++) {
            const file = this.batchFiles[i];
            const fileItem = this.fileList.children[i];
            const statusElement = fileItem.querySelector('.file-status');
            
            try {
                // 更新状态
                fileItem.className = 'file-item bg-white rounded-xl p-4 border border-blue-200 flex items-center justify-between';
                statusElement.className = 'file-status processing px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800';
                statusElement.textContent = '转换中';
                
                // 转换图片
                const convertedBlob = await this.convertSingleImage(file, outputFormat);
                
                let extension;
                switch (outputFormat) {
                    case 'jpeg':
                        extension = 'jpg';
                        break;
                    case 'ico':
                        extension = 'ico';
                        break;
                    case 'svg':
                        extension = 'svg';
                        break;
                    default:
                        extension = outputFormat;
                }
                
                convertedFiles.push({
                    blob: convertedBlob,
                    name: file.name.split('.')[0] + '_converted.' + extension
                });
                
                // 更新状态
                fileItem.className = 'file-item bg-white rounded-xl p-4 border border-green-200 flex items-center justify-between';
                statusElement.className = 'file-status completed px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
                statusElement.textContent = '完成';
                
            } catch (error) {
                fileItem.className = 'file-item bg-white rounded-xl p-4 border border-red-200 flex items-center justify-between';
                statusElement.className = 'file-status error px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
                statusElement.textContent = '失败';
            }
            
            // 更新进度
            const progress = ((i + 1) / this.batchFiles.length) * 100;
            this.progressFill.style.width = progress + '%';
            this.progressText.textContent = `${i + 1}/${this.batchFiles.length}`;
        }
        
        // 打包下载
        if (convertedFiles.length > 0) {
            this.downloadBatchFiles(convertedFiles);
        }
        
        this.batchConvertBtn.disabled = false;
        this.showStatus(`批量转换完成，成功转换 ${convertedFiles.length} 个文件`, 'success');
    }

    async convertToSVG() {
        try {
            const img = this.originalImage;
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            
            // 如果启用了尺寸调整
            if (this.resizeEnabled.checked) {
                width = parseInt(this.width.value) || width;
                height = parseInt(this.height.value) || height;
            }
            
            // 将图片转换为base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/png');
            
            // 创建SVG内容
            const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image x="0" y="0" width="${width}" height="${height}" xlink:href="${base64}"/>
</svg>`;
            
            // 创建SVG Blob
            this.convertedBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            this.displayConvertedImage(this.convertedBlob, 'svg');
            this.downloadBtn.disabled = false;
            this.convertBtn.disabled = false;
            this.showStatus('SVG转换完成', 'success');
            
        } catch (error) {
            this.convertBtn.disabled = false;
            this.showStatus(`SVG转换失败: ${error.message}`, 'error');
        }
    }

    convertSingleImage(file, outputFormat) {
        return new Promise((resolve, reject) => {
            // 特殊处理SVG格式
            if (outputFormat === 'svg') {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const base64 = canvas.toDataURL('image/png');
                    
                    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image x="0" y="0" width="${img.width}" height="${img.height}" xlink:href="${base64}"/>
</svg>`;
                    
                    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                    resolve(blob);
                };
                img.onerror = () => reject(new Error('图片加载失败'));
                const reader = new FileReader();
                reader.onload = (e) => img.src = e.target.result;
                reader.readAsDataURL(file);
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 特殊处理ICO格式
                if (outputFormat === 'ico') {
                    const size = Math.min(img.width, img.height, 256);
                    canvas.width = size;
                    canvas.height = size;
                }
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const mimeType = outputFormat === 'ico' ? 'image/png' : `image/${outputFormat}`;
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('转换失败'));
                    }
                }, mimeType, 0.9);
            };
            
            img.onerror = () => reject(new Error('图片加载失败'));
            
            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(file);
        });
    }

    downloadBatchFiles(files) {
        // 简单实现：逐个下载文件
        files.forEach((file, index) => {
            setTimeout(() => {
                const url = URL.createObjectURL(file.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, index * 100); // 延迟下载避免浏览器阻止
        });
    }

    clearAll() {
        this.currentFile = null;
        this.convertedBlob = null;
        this.batchFiles = [];
        
        this.fileInput.value = '';
        this.batchFileInput.value = '';
        this.imageInfo.classList.add('hidden');
        this.previewSection.classList.add('hidden');
        this.batchList.classList.add('hidden');
        this.batchProgress.classList.add('hidden');
        
        this.convertBtn.disabled = true;
        this.downloadBtn.disabled = true;
        this.batchConvertBtn.disabled = true;
        
        this.fileList.innerHTML = '';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0/0';
        
        this.showStatus('已清空所有内容', 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showStatus(message, type) {
        this.statusBar.textContent = message;
        this.statusBar.className = `status-bar ${type} show`;
        
        setTimeout(() => {
            this.statusBar.classList.remove('show');
        }, 3000);
    }
    
    switchTab(tabName) {
        // 移除所有活动状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
            btn.classList.add('text-gray-600', 'hover:text-gray-800');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
            pane.classList.add('hidden');
        });
        
        // 激活选中的tab
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('text-gray-600', 'hover:text-gray-800');
            activeBtn.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
        }
        
        const activePane = document.getElementById(`${tabName}Tab`);
        if (activePane) {
            activePane.classList.remove('hidden');
            activePane.classList.add('active');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageConverter();
});