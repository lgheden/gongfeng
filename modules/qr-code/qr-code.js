// 二维码生成器和解码器

class QRCodeTool {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeDefaults();
        this.cameraStream = null;
    }

    initializeElements() {
        // Tab相关元素
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // 生成器元素
        this.contentType = document.getElementById('contentType');
        this.errorLevel = document.getElementById('errorLevel');
        this.qrSize = document.getElementById('qrSize');
        this.qrPadding = document.getElementById('qrPadding');
        this.qrContent = document.getElementById('qrContent');
        this.qrCodeContainer = document.getElementById('qrCodeContainer');
        
        // 样式相关元素
        this.qrStyle = document.getElementById('qrStyle');
        this.colorTheme = document.getElementById('colorTheme');
        this.animationType = document.getElementById('animationType');
        this.customColorSection = document.getElementById('customColorSection');
        this.foregroundColor = document.getElementById('foregroundColor');
        this.backgroundColor = document.getElementById('backgroundColor');
        this.gradientColor = document.getElementById('gradientColor');
        
        // 不同类型的输入区域
        this.textInput = document.getElementById('textInput');
        this.urlInput = document.getElementById('urlInput');
        this.emailInput = document.getElementById('emailInput');
        this.phoneInput = document.getElementById('phoneInput');
        this.smsInput = document.getElementById('smsInput');
        this.wifiInput = document.getElementById('wifiInput');
        this.vcardInput = document.getElementById('vcardInput');
        
        // 具体输入字段
        this.urlContent = document.getElementById('urlContent');
        this.emailContent = document.getElementById('emailContent');
        this.emailSubject = document.getElementById('emailSubject');
        this.emailBody = document.getElementById('emailBody');
        this.phoneContent = document.getElementById('phoneContent');
        this.smsPhone = document.getElementById('smsPhone');
        this.smsContent = document.getElementById('smsContent');
        this.wifiSSID = document.getElementById('wifiSSID');
        this.wifiPassword = document.getElementById('wifiPassword');
        this.wifiSecurity = document.getElementById('wifiSecurity');
        this.wifiHidden = document.getElementById('wifiHidden');
        
        // 中间图标相关元素
        this.enableLogo = document.getElementById('enableLogo');
        this.logoUploadSection = document.getElementById('logoUploadSection');
        this.logoSizeSection = document.getElementById('logoSizeSection');
        this.logoInput = document.getElementById('logoInput');
        this.logoUploadBtn = document.getElementById('logoUploadBtn');
        this.logoPreview = document.getElementById('logoPreview');
        this.logoImage = document.getElementById('logoImage');
        this.removeLogo = document.getElementById('removeLogo');
        this.logoSize = document.getElementById('logoSize');
        
        // 存储logo图片数据
        this.logoImageData = null;
        
        // 名片字段
        this.vcardName = document.getElementById('vcardName');
        this.vcardOrg = document.getElementById('vcardOrg');
        this.vcardTitle = document.getElementById('vcardTitle');
        this.vcardPhone = document.getElementById('vcardPhone');
        this.vcardEmail = document.getElementById('vcardEmail');
        this.vcardUrl = document.getElementById('vcardUrl');
        this.vcardAddress = document.getElementById('vcardAddress');
        
        // 解码器元素
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.cameraBtn = document.getElementById('cameraBtn');
        this.cameraContainer = document.getElementById('cameraContainer');
        this.cameraVideo = document.getElementById('cameraVideo');
        this.cameraCanvas = document.getElementById('cameraCanvas');
        this.decodeResult = document.getElementById('decodeResult');
        this.contentTypeResult = document.getElementById('contentTypeResult');
        
        // 按钮元素
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyImageBtn = document.getElementById('copyImageBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.stopCameraBtn = document.getElementById('stopCameraBtn');
        this.copyResultBtn = document.getElementById('copyResultBtn');
        this.openLinkBtn = document.getElementById('openLinkBtn');
    }

    bindEvents() {
        // Tab切换事件
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 内容类型切换事件
        if (this.contentType) {
            this.contentType.addEventListener('change', () => this.onContentTypeChange());
        }
        
        // 样式相关事件
        if (this.colorTheme) {
            this.colorTheme.addEventListener('change', () => this.onColorThemeChange());
        }
        
        if (this.qrStyle) {
            this.qrStyle.addEventListener('change', () => this.onStyleChange());
        }
        
        if (this.animationType) {
            this.animationType.addEventListener('change', () => this.onAnimationChange());
        }

        // 生成器按钮事件
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generateQRCode());
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearGenerator());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
        
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        }
        
        if (this.copyImageBtn) {
            this.copyImageBtn.addEventListener('click', () => this.copyQRCodeImage());
        }
        
        // 中间图标事件
        if (this.enableLogo) {
            this.enableLogo.addEventListener('change', () => this.onLogoToggle());
        }
        
        if (this.logoUploadBtn) {
            this.logoUploadBtn.addEventListener('click', () => this.logoInput.click());
        }
        
        if (this.logoInput) {
            this.logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        }
        
        if (this.removeLogo) {
            this.removeLogo.addEventListener('click', () => this.removeLogoImage());
        }

        // 解码器事件
        if (this.uploadArea) {
            this.uploadArea.addEventListener('click', () => this.fileInput.click());
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }
        
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => this.startCamera());
        }
        
        if (this.captureBtn) {
            this.captureBtn.addEventListener('click', () => this.captureAndDecode());
        }
        
        if (this.stopCameraBtn) {
            this.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        }
        
        if (this.copyResultBtn) {
            this.copyResultBtn.addEventListener('click', () => this.copyDecodeResult());
        }
        
        if (this.openLinkBtn) {
            this.openLinkBtn.addEventListener('click', () => this.openDecodedLink());
        }
        
        // 样式相关事件
        if (this.colorTheme) {
            this.colorTheme.addEventListener('change', () => this.onColorThemeChange());
        }
        
        if (this.qrStyle) {
            this.qrStyle.addEventListener('change', () => this.onStyleChange());
        }
        
        if (this.animationType) {
            this.animationType.addEventListener('change', () => this.onAnimationChange());
        }
    }

    initializeDefaults() {
        // 激活第一个tab
        this.switchTab('generator');
        // 设置默认内容类型
        this.onContentTypeChange();
    }

    switchTab(tabName) {
        // 移除所有活动状态
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活选中的tab
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const tabContent = document.getElementById(tabName);
        
        if (tabBtn) {
            tabBtn.classList.add('active');
        }
        if (tabContent) {
            tabContent.classList.add('active');
        }
        
        // 如果切换到解码器，停止摄像头
        if (tabName !== 'decoder' && this.cameraStream) {
            this.stopCamera();
        }
    }

    onContentTypeChange() {
        const type = this.contentType.value;
        
        // 隐藏所有输入区域
        [this.textInput, this.urlInput, this.emailInput, this.phoneInput, 
         this.smsInput, this.wifiInput, this.vcardInput].forEach(element => {
            if (element) element.style.display = 'none';
        });
        
        // 显示对应的输入区域
        const inputMap = {
            'text': this.textInput,
            'url': this.urlInput,
            'email': this.emailInput,
            'phone': this.phoneInput,
            'sms': this.smsInput,
            'wifi': this.wifiInput,
            'vcard': this.vcardInput
        };
        
        const targetInput = inputMap[type];
        if (targetInput) {
            targetInput.style.display = 'block';
        }
    }

    // 中间图标切换
    onLogoToggle() {
        const enabled = this.enableLogo.checked;
        
        if (enabled) {
            this.logoUploadSection.style.display = 'block';
            this.logoSizeSection.style.display = 'block';
        } else {
            this.logoUploadSection.style.display = 'none';
            this.logoSizeSection.style.display = 'none';
            this.removeLogoImage();
        }
    }

    // 处理图标上传
    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showStatus('请选择图片文件', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // 存储图片数据
                this.logoImageData = img;
                
                // 显示预览
                this.logoImage.src = event.target.result;
                this.logoPreview.style.display = 'block';
                
                this.showStatus('图标上传成功', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 移除图标
    removeLogoImage() {
        this.logoImageData = null;
        this.logoImage.src = '';
        this.logoPreview.style.display = 'none';
        this.logoInput.value = '';
    }

    // 颜色主题变化处理
    onColorThemeChange() {
        const theme = this.colorTheme.value;
        if (theme === 'custom') {
            this.customColorSection.style.display = 'block';
        } else {
            this.customColorSection.style.display = 'none';
        }
    }
    
    // 样式变化处理
    onStyleChange() {
        // 样式变化时可以实时预览效果
        console.log('QR样式已更改为:', this.qrStyle.value);
    }
    
    // 动画变化处理
    onAnimationChange() {
        console.log('动画效果已更改为:', this.animationType.value);
    }
    
    // 获取颜色配置
    getColorConfig() {
        const theme = this.colorTheme && this.colorTheme.value ? this.colorTheme.value : 'classic';
        
        const themes = {
            classic: { dark: '#000000', light: '#FFFFFF' },
            blue: { dark: '#1e3a8a', light: '#dbeafe' },
            purple: { dark: '#7c3aed', light: '#ede9fe' },
            green: { dark: '#059669', light: '#d1fae5' },
            orange: { dark: '#ea580c', light: '#fed7aa' },
            pink: { dark: '#db2777', light: '#fce7f3' },
            rainbow: { dark: '#000000', light: '#FFFFFF', gradient: true },
            custom: {
                dark: this.foregroundColor && this.foregroundColor.value ? this.foregroundColor.value : '#000000',
                light: this.backgroundColor && this.backgroundColor.value ? this.backgroundColor.value : '#FFFFFF',
                gradient: this.gradientColor && this.gradientColor.value ? this.gradientColor.value : '#666666'
            }
        };
        
        const selectedTheme = themes[theme] || themes.classic;
        
        // 确保返回的对象包含必需的属性
        return {
            dark: selectedTheme.dark || '#000000',
            light: selectedTheme.light || '#FFFFFF',
            gradient: selectedTheme.gradient || false
        };
    }
    
    // 应用样式到canvas
    applyQRStyle(canvas, colors) {
        const style = this.qrStyle && this.qrStyle.value ? this.qrStyle.value : 'classic';
        const ctx = canvas.getContext('2d');
        
        // 添加CSS类用于样式
        canvas.className = 'qr-canvas';
        
        // 根据样式类型进行特殊处理
        switch (style) {
            case 'rounded':
                this.applyRoundedStyle(canvas, colors);
                break;
            case 'dots':
                this.applyDotsStyle(canvas, colors);
                break;
            case 'liquid':
                this.applyLiquidStyle(canvas, colors);
                break;
            case 'gradient':
                this.applyGradientStyle(canvas, colors);
                break;
            default:
                // 经典样式不需要额外处理
                break;
        }
    }
    
    // 应用圆角样式
    applyRoundedStyle(canvas, colors) {
        // 这里可以实现圆角二维码的绘制逻辑
        canvas.style.borderRadius = '12px';
    }
    
    // 应用圆点样式
    applyDotsStyle(canvas, colors) {
        // 这里可以实现圆点二维码的绘制逻辑
        canvas.style.filter = 'blur(0.5px)';
    }
    
    // 应用液体样式
    applyLiquidStyle(canvas, colors) {
        // 这里可以实现液体风格的绘制逻辑
        canvas.style.filter = 'blur(1px) contrast(1.2)';
    }
    
    // 应用渐变样式
    applyGradientStyle(canvas, colors) {
        if (colors.gradient) {
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, colors.dark);
            gradient.addColorStop(1, colors.gradient || '#666666');
            // 这里需要重新绘制二维码以应用渐变
        }
    }
    
    // 应用动画效果
    applyAnimation(canvas) {
        const animation = this.animationType && this.animationType.value ? this.animationType.value : 'none';
        if (animation !== 'none') {
            // 移除之前的动画类
            canvas.className = canvas.className.replace(/qr-animation-\w+/g, '').trim();
            // 确保保留基础类
            if (!canvas.classList.contains('qr-canvas')) {
                canvas.classList.add('qr-canvas');
            }
            // 添加新的动画类
            canvas.classList.add(`qr-animation-${animation}`);
        }
    }

    getQRContent() {
        const type = this.contentType && this.contentType.value ? this.contentType.value : 'text';
        
        switch (type) {
            case 'text':
                return this.qrContent && this.qrContent.value ? this.qrContent.value.trim() : '';
                
            case 'url':
                const url = this.urlContent && this.urlContent.value ? this.urlContent.value.trim() : '';
                if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                    return 'https://' + url;
                }
                return url;
                
            case 'email':
                const email = this.emailContent && this.emailContent.value ? this.emailContent.value.trim() : '';
                const subject = this.emailSubject && this.emailSubject.value ? this.emailSubject.value.trim() : '';
                const body = this.emailBody && this.emailBody.value ? this.emailBody.value.trim() : '';
                let mailto = `mailto:${email}`;
                const params = [];
                if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                if (body) params.push(`body=${encodeURIComponent(body)}`);
                if (params.length > 0) {
                    mailto += '?' + params.join('&');
                }
                return mailto;
                
            case 'phone':
                return `tel:${this.phoneContent && this.phoneContent.value ? this.phoneContent.value.trim() : ''}`;
                
            case 'sms':
                const smsPhone = this.smsPhone && this.smsPhone.value ? this.smsPhone.value.trim() : '';
                const smsContent = this.smsContent && this.smsContent.value ? this.smsContent.value.trim() : '';
                return `sms:${smsPhone}${smsContent ? '?body=' + encodeURIComponent(smsContent) : ''}`;
                
            case 'wifi':
                const ssid = this.wifiSSID && this.wifiSSID.value ? this.wifiSSID.value.trim() : '';
                const password = this.wifiPassword && this.wifiPassword.value ? this.wifiPassword.value.trim() : '';
                const security = this.wifiSecurity && this.wifiSecurity.value ? this.wifiSecurity.value : 'WPA';
                const hidden = this.wifiHidden && this.wifiHidden.checked ? this.wifiHidden.checked : false;
                return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
                
            case 'vcard':
                const vcard = [
                    'BEGIN:VCARD',
                    'VERSION:3.0',
                    `FN:${this.vcardName && this.vcardName.value ? this.vcardName.value.trim() : ''}`,
                    `ORG:${this.vcardOrg && this.vcardOrg.value ? this.vcardOrg.value.trim() : ''}`,
                    `TITLE:${this.vcardTitle && this.vcardTitle.value ? this.vcardTitle.value.trim() : ''}`,
                    `TEL:${this.vcardPhone && this.vcardPhone.value ? this.vcardPhone.value.trim() : ''}`,
                    `EMAIL:${this.vcardEmail && this.vcardEmail.value ? this.vcardEmail.value.trim() : ''}`,
                    `URL:${this.vcardUrl && this.vcardUrl.value ? this.vcardUrl.value.trim() : ''}`,
                    `ADR:;;${this.vcardAddress && this.vcardAddress.value ? this.vcardAddress.value.trim() : ''};;;;`,
                    'END:VCARD'
                ].filter(line => !line.endsWith(':')).join('\n');
                return vcard;
                
            default:
                return this.qrContent && this.qrContent.value ? this.qrContent.value.trim() : '';
        }
    }

    async generateQRCode() {
        const content = this.getQRContent();
        
        if (!content || content.trim() === '') {
            this.showStatus('请输入要生成二维码的内容', 'error');
            return;
        }
        
        // 验证内容长度
        if (content.length > 2000) {
            this.showStatus('内容过长，请减少内容长度', 'error');
            return;
        }
        
        console.log('生成二维码内容:', content);
        console.log('内容长度:', content.length);
        
        try {
            if (this.generateBtn) {
                this.generateBtn.innerHTML = '<span class="loading"></span>生成中...';
                this.generateBtn.disabled = true;
            }
            
            const size = parseInt(this.qrSize && this.qrSize.value ? this.qrSize.value : '300');
            const errorCorrectionLevel = this.errorLevel && this.errorLevel.value ? this.errorLevel.value : 'M';
            const colors = this.getColorConfig();
            
            // 确保颜色配置正确
            console.log('颜色配置:', colors);
            console.log('内容:', content);
            
            // 映射纠错级别
            let correctLevel = 2; // 默认为M级别
            switch(errorCorrectionLevel) {
                case 'L': correctLevel = 1; break;
                case 'M': correctLevel = 0; break;
                case 'Q': correctLevel = 3; break;
                case 'H': correctLevel = 2; break;
            }
            
            const options = {
                render: 'canvas',
                width: size,
                height: size,
                correctLevel: correctLevel,
                background: colors && colors.light ? colors.light : '#FFFFFF',
                foreground: colors && colors.dark ? colors.dark : '#000000',
                text: content
            };
            
            console.log('jQuery QRCode选项:', options);
            
            // 清空容器
            if (this.qrCodeContainer) {
                this.qrCodeContainer.innerHTML = '';
            }
            
            // 创建临时容器用于生成二维码
            const tempContainer = $('<div></div>');
            
            // 使用jquery.qrcode生成二维码
            tempContainer.qrcode(options);
            
            // 获取生成的canvas元素
            const originalCanvas = tempContainer.find('canvas')[0];
            
            if (!originalCanvas) {
                throw new Error('无法生成二维码canvas元素');
            }
            
            // 创建带有配置留白的新canvas
            const padding = parseInt(this.qrPadding && this.qrPadding.value ? this.qrPadding.value : '10');
            const newSize = size + (padding * 2);
            const canvas = document.createElement('canvas');
            canvas.width = newSize;
            canvas.height = newSize;
            
            const ctx = canvas.getContext('2d');
            
            // 填充背景色（留白区域）
            ctx.fillStyle = colors && colors.light ? colors.light : '#FFFFFF';
            ctx.fillRect(0, 0, newSize, newSize);
            
            // 将原始二维码绘制到中心位置（添加10px边距）
            ctx.drawImage(originalCanvas, padding, padding);
            
            // 应用样式
            this.applyQRStyle(canvas, colors);
            
            // 如果启用了中间图标，则添加图标
            if (this.enableLogo && this.enableLogo.checked && this.logoImageData) {
                await this.addLogoToQRCode(canvas);
            }
            
            // 将canvas添加到容器中
            if (this.qrCodeContainer) {
                this.qrCodeContainer.appendChild(canvas);
            }
            
            // 应用动画效果
            this.applyAnimation(canvas);
            
            // 验证生成的二维码
            this.validateQRCode(canvas, content);
            
            // 显示操作按钮
            if (this.downloadBtn) this.downloadBtn.style.display = 'inline-block';
            if (this.copyImageBtn) this.copyImageBtn.style.display = 'inline-block';
            
            this.showStatus('二维码生成成功', 'success');
            
        } catch (error) {
            console.error('生成二维码失败:', error);
            this.showStatus('生成二维码失败: ' + error.message, 'error');
        } finally {
            if (this.generateBtn) {
                this.generateBtn.innerHTML = '生成二维码';
                this.generateBtn.disabled = false;
            }
        }
    }

    // 在二维码中添加中间图标
    async addLogoToQRCode(canvas) {
        const ctx = canvas.getContext('2d');
        const canvasSize = canvas.width;
        const logoSizeRatio = parseFloat(this.logoSize && this.logoSize.value ? this.logoSize.value : '0.2');
        const logoSize = canvasSize * logoSizeRatio;
        
        // 计算图标位置（居中）
        const logoX = (canvasSize - logoSize) / 2;
        const logoY = (canvasSize - logoSize) / 2;
        
        // 创建圆角背景
        const padding = logoSize * 0.1;
        const bgSize = logoSize + padding * 2;
        const bgX = logoX - padding;
        const bgY = logoY - padding;
        const borderRadius = bgSize * 0.1;
        
        // 绘制白色背景
        ctx.fillStyle = '#FFFFFF';
        this.drawRoundedRect(ctx, bgX, bgY, bgSize, bgSize, borderRadius);
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        this.drawRoundedRect(ctx, bgX, bgY, bgSize, bgSize, borderRadius);
        ctx.stroke();
        
        // 绘制图标
        ctx.save();
        this.drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, borderRadius * 0.8);
        ctx.clip();
        ctx.drawImage(this.logoImageData, logoX, logoY, logoSize, logoSize);
        ctx.restore();
    }

    // 验证二维码
    validateQRCode(canvas, originalContent) {
        try {
            // 获取canvas的图像数据
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 使用jsQR库解码
            if (typeof jsQR !== 'undefined') {
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    console.log('二维码验证成功');
                    console.log('原始内容:', originalContent);
                    console.log('解码内容:', code.data);
                    
                    if (code.data === originalContent) {
                        console.log('✅ 内容匹配，二维码有效');
                    } else {
                        console.warn('⚠️ 内容不匹配');
                        console.warn('期望:', originalContent);
                        console.warn('实际:', code.data);
                    }
                } else {
                    console.error('❌ 无法解码二维码，可能无效');
                    this.showStatus('警告：生成的二维码可能无效', 'warning');
                }
            } else {
                console.log('jsQR库未加载，跳过验证');
            }
        } catch (error) {
            console.error('二维码验证失败:', error);
        }
    }
    
    // 绘制圆角矩形
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    clearGenerator() {
        // 清空所有输入字段
        const inputs = document.querySelectorAll('#generator input, #generator textarea, #generator select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        
        // 重置中间图标
        this.removeLogoImage();
        this.onLogoToggle();
        
        // 重置二维码显示区域
        this.qrCodeContainer.innerHTML = '<div class="qr-placeholder">点击"生成二维码"按钮生成</div>';
        
        // 隐藏操作按钮
        this.downloadBtn.style.display = 'none';
        this.copyImageBtn.style.display = 'none';
        
        // 重置内容类型
        this.onContentTypeChange();
        
        this.showStatus('已清空所有内容', 'info');
    }

    resetToDefaults() {
        // 清空内容
        this.clearGenerator();
        
        // 重置为推荐的默认设置
        if (this.errorLevel) this.errorLevel.value = 'M';
        if (this.qrSize) this.qrSize.value = '300';
        if (this.qrPadding) this.qrPadding.value = '10';
        if (this.colorTheme) this.colorTheme.value = 'classic';
        if (this.qrStyle) this.qrStyle.value = 'classic';
        if (this.animationType) this.animationType.value = 'none';
        if (this.enableLogo) this.enableLogo.checked = false;
        
        // 隐藏logo相关控件
        this.onLogoToggle();
        
        // 隐藏自定义颜色控件
        this.onColorThemeChange();
        
        // 设置默认文本内容
        if (this.qrContent) this.qrContent.value = 'Hello World';
        
        this.showStatus('已重置为推荐的默认设置', 'success');
    }

    downloadQRCode() {
        const canvas = this.qrCodeContainer.querySelector('canvas');
        if (!canvas) {
            this.showStatus('没有可下载的二维码', 'error');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.download = `qrcode_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.showStatus('二维码已下载', 'success');
        } catch (error) {
            this.showStatus('下载失败: ' + error.message, 'error');
        }
    }

    async copyQRCodeImage() {
        const canvas = this.qrCodeContainer.querySelector('canvas');
        if (!canvas) {
            this.showStatus('没有可复制的二维码', 'error');
            return;
        }
        
        try {
            canvas.toBlob(async (blob) => {
                if (navigator.clipboard && window.ClipboardItem) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    this.showStatus('二维码图片已复制到剪贴板', 'success');
                } else {
                    // 降级方案：复制数据URL
                    const dataUrl = canvas.toDataURL('image/png');
                    await navigator.clipboard.writeText(dataUrl);
                    this.showStatus('二维码数据已复制到剪贴板', 'success');
                }
            }, 'image/png');
        } catch (error) {
            this.showStatus('复制失败: ' + error.message, 'error');
        }
    }

    // 拖拽事件处理
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file);
        }
    }

    processImageFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showStatus('请选择图片文件', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.decodeQRCodeFromImage(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    decodeQRCodeFromImage(img) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                this.displayDecodeResult(code.data);
            } else {
                this.showStatus('未在图片中找到二维码', 'error');
                this.clearDecodeResult();
            }
        } catch (error) {
            console.error('解码失败:', error);
            this.showStatus('解码失败: ' + error.message, 'error');
            this.clearDecodeResult();
        }
    }

    async startCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            this.cameraVideo.srcObject = this.cameraStream;
            this.cameraContainer.style.display = 'block';
            this.cameraBtn.style.display = 'none';
            
            this.showStatus('摄像头已启动', 'success');
        } catch (error) {
            console.error('启动摄像头失败:', error);
            this.showStatus('启动摄像头失败: ' + error.message, 'error');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        this.cameraContainer.style.display = 'none';
        this.cameraBtn.style.display = 'inline-block';
        
        this.showStatus('摄像头已停止', 'info');
    }

    captureAndDecode() {
        if (!this.cameraStream) {
            this.showStatus('摄像头未启动', 'error');
            return;
        }
        
        try {
            const canvas = this.cameraCanvas;
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.cameraVideo.videoWidth;
            canvas.height = this.cameraVideo.videoHeight;
            ctx.drawImage(this.cameraVideo, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                this.displayDecodeResult(code.data);
                this.stopCamera();
            } else {
                this.showStatus('未检测到二维码，请调整角度重试', 'warning');
            }
        } catch (error) {
            console.error('拍照解码失败:', error);
            this.showStatus('拍照解码失败: ' + error.message, 'error');
        }
    }

    displayDecodeResult(data) {
        this.decodeResult.textContent = data;
        
        // 分析内容类型
        const contentType = this.analyzeContentType(data);
        this.contentTypeResult.textContent = contentType;
        
        // 显示操作按钮
        this.copyResultBtn.style.display = 'inline-block';
        
        // 如果是链接，显示打开按钮
        if (data.startsWith('http://') || data.startsWith('https://')) {
            this.openLinkBtn.style.display = 'inline-block';
        } else {
            this.openLinkBtn.style.display = 'none';
        }
        
        this.showStatus('二维码解码成功', 'success');
    }

    analyzeContentType(data) {
        if (data.startsWith('http://') || data.startsWith('https://')) {
            return '网址链接';
        } else if (data.startsWith('mailto:')) {
            return '邮箱地址';
        } else if (data.startsWith('tel:')) {
            return '电话号码';
        } else if (data.startsWith('sms:')) {
            return '短信';
        } else if (data.startsWith('WIFI:')) {
            return 'WiFi配置';
        } else if (data.startsWith('BEGIN:VCARD')) {
            return '电子名片';
        } else if (/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(data)) {
            return '邮箱地址';
        } else if (/^[+]?[\d\s()-]+$/.test(data)) {
            return '电话号码';
        } else {
            return '纯文本';
        }
    }

    clearDecodeResult() {
        this.decodeResult.textContent = '';
        this.contentTypeResult.textContent = '';
        this.copyResultBtn.style.display = 'none';
        this.openLinkBtn.style.display = 'none';
    }

    async copyDecodeResult() {
        const result = this.decodeResult.textContent;
        if (!result) {
            this.showStatus('没有可复制的内容', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(result);
            this.showStatus('解码结果已复制到剪贴板', 'success');
        } catch (error) {
            this.showStatus('复制失败: ' + error.message, 'error');
        }
    }

    openDecodedLink() {
        const result = this.decodeResult.textContent;
        if (result && (result.startsWith('http://') || result.startsWith('https://'))) {
            window.open(result, '_blank');
            this.showStatus('已打开链接', 'success');
        } else {
            this.showStatus('不是有效的链接', 'error');
        }
    }

    showStatus(message, type = 'info') {
        // 移除现有的状态栏
        const existingStatus = document.querySelector('.status-bar');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // 创建新的状态栏
        const statusBar = document.createElement('div');
        statusBar.className = `status-bar ${type} show`;
        statusBar.textContent = message;
        
        document.body.appendChild(statusBar);
        
        // 3秒后自动移除
        setTimeout(() => {
            statusBar.classList.remove('show');
            setTimeout(() => {
                if (statusBar.parentNode) {
                    statusBar.parentNode.removeChild(statusBar);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeTool();
});