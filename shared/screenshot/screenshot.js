class PageScreenshotInjector {
    constructor() {
        this.screenshotBtn = null;
        this.isCapturing = false;
    }

    // 创建截图按钮组
    createScreenshotButton() {
        console.log('开始创建截图按钮组...');

        // 检查是否已存在按钮组
        const existingBtnGroup = document.querySelector('.screenshot-btn-group');
        if (existingBtnGroup) {
            console.log('截图按钮组已存在，跳过创建');
            return;
        }

        // 创建按钮组容器
        this.screenshotBtnGroup = document.createElement('div');
        this.screenshotBtnGroup.className = 'screenshot-btn-group';

        // 创建可见区域截图按钮
        const visibleBtn = document.createElement('button');
        visibleBtn.className = 'screenshot-btn visible-btn';
        visibleBtn.innerHTML = `
            <span class="icon">📸</span>
            <span>可见区域</span>
        `;
        visibleBtn.title = '截取当前可见区域';
        visibleBtn.addEventListener('click', () => this.captureVisibleArea());

        // 创建全屏截图按钮
        const fullpageBtn = document.createElement('button');
        fullpageBtn.className = 'screenshot-btn fullpage-btn';
        fullpageBtn.innerHTML = `
            <span class="icon">📄</span>
            <span>整个页面</span>
        `;
        fullpageBtn.title = '截取整个页面';
        fullpageBtn.addEventListener('click', () => this.captureFullPage());

        // 创建设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'screenshot-btn settings-btn';
        settingsBtn.innerHTML = `
            <span class="icon">⚙️</span>
            <span>设置</span>
        `;
        settingsBtn.title = '截图设置';
        settingsBtn.addEventListener('click', () => this.showSettingsDialog());

        // 将按钮添加到容器
        this.screenshotBtnGroup.appendChild(visibleBtn);
        this.screenshotBtnGroup.appendChild(fullpageBtn);
        this.screenshotBtnGroup.appendChild(settingsBtn);

        // 保存按钮引用
        this.visibleBtn = visibleBtn;
        this.fullpageBtn = fullpageBtn;
        this.settingsBtn = settingsBtn;

        console.log('截图按钮组元素已创建');

        // 添加到页面
        document.body.appendChild(this.screenshotBtnGroup);
        console.log('截图按钮组已添加到页面');
    }

    // 截取可见区域
    async captureVisibleArea() {
        await this.performCapture({ type: 'visible', quality: 100, format: 'png' });
    }

    // 截取整个页面
    async captureFullPage() {
        await this.performCapture({ type: 'fullpage', quality: 100, format: 'png' });
    }

    // 显示设置对话框
    async showSettingsDialog() {
        const options = await this.showScreenshotOptions();
        if (options) {
            await this.performCapture(options);
        }
    }

    // 执行截图操作
    async performCapture(options) {
        if (this.isCapturing) {
            return;
        }

        try {
            this.isCapturing = true;

            this.updateButtonState('capturing');

            // 隐藏截图按钮和提示框
            this.hideUIElements();

            // 等待一小段时间确保UI完全隐藏
            await this.delay(300);

            // 使用Chrome扩展API截图
            const screenshotData = await this.captureWithChromeAPI(options);

            if (screenshotData) {
                // 下载截图
                this.downloadScreenshot(screenshotData, options);
                this.showToast(`${options.type === 'fullpage' ? '全屏' : '可见区域'}截图成功！`, 'success');
            } else {
                throw new Error('截图数据为空');
            }
        } catch (error) {
            console.error('截图失败:', error);
            this.showToast('截图失败: ' + error.message, 'error');
        } finally {
            this.isCapturing = false;
            this.updateButtonState('normal');
            // 恢复UI元素显示
            this.showUIElements();
        }
    }

    // 显示截图选项对话框
    async showScreenshotOptions() {
        return new Promise((resolve) => {
            // 创建对话框
            const dialog = document.createElement('div');
            dialog.className = 'screenshot-options-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>📸 截图设置</h3>
                    <div class="option-group">
                        <label>截图类型：</label>
                        <select id="captureType">
                            <option value="visible">可见区域</option>
                            <option value="fullpage">整个页面</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>图片质量：</label>
                        <select id="imageQuality">
                            <option value="100">最高质量</option>
                            <option value="90">高质量</option>
                            <option value="80">标准质量</option>
                            <option value="60">压缩质量</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>图片格式：</label>
                        <select id="imageFormat">
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                        </select>
                    </div>
                    <div class="dialog-buttons">
                        <button id="confirmBtn" class="primary">开始截图</button>
                        <button id="cancelBtn">取消</button>
                    </div>
                </div>
            `;

            // 添加样式
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            const content = dialog.querySelector('.dialog-content');
            content.style.cssText = `
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                min-width: 320px;
                max-width: 400px;
            `;

            document.body.appendChild(dialog);

            // 绑定事件
            const confirmBtn = dialog.querySelector('#confirmBtn');
            const cancelBtn = dialog.querySelector('#cancelBtn');

            confirmBtn.onclick = () => {
                const options = {
                    type: dialog.querySelector('#captureType').value,
                    quality: parseInt(dialog.querySelector('#imageQuality').value),
                    format: dialog.querySelector('#imageFormat').value
                };
                document.body.removeChild(dialog);
                resolve(options);
            };

            cancelBtn.onclick = () => {
                document.body.removeChild(dialog);
                resolve(null);
            };
        });
    }

    // 隐藏UI元素
    hideUIElements() {
        if (this.screenshotBtnGroup) {
            this.screenshotBtnGroup.style.display = 'none';
        }
        // 隐藏所有toast消息
        const toasts = document.querySelectorAll('.screenshot-toast');
        toasts.forEach(toast => {
            toast.style.display = 'none';
        });
    }

    // 显示UI元素
    showUIElements() {
        if (this.screenshotBtnGroup) {
            this.screenshotBtnGroup.style.display = 'flex';
        }
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 使用Chrome API截图
    async captureWithChromeAPI(options) {
        return new Promise((resolve, reject) => {
            // 向background script发送截图请求
            chrome.runtime.sendMessage(
                {
                    action: 'captureScreenshot',
                    options: options
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }

                    if (response && response.success) {
                        resolve(response.dataUrl);
                    } else {
                        reject(new Error(response?.error || '截图失败'));
                    }
                }
            );
        });
    }

    // 下载截图
    downloadScreenshot(dataUrl, options) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = this.generateFileName(options);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 生成文件名
    generateFileName(options = { format: 'png', type: 'visible' }) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const domain = this.extractDomain(window.location.href);
        const typePrefix = options.type === 'fullpage' ? 'fullpage' : 'screenshot';
        const extension = options.format === 'jpeg' ? 'jpg' : options.format;
        return `${typePrefix}-${domain}-${timestamp}.${extension}`;
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

    // 更新按钮状态
    updateButtonState(state) {
        if (!this.visibleBtn || !this.fullpageBtn || !this.settingsBtn) return;

        switch (state) {
            case 'capturing':
                // 禁用所有按钮并显示加载状态
                this.visibleBtn.classList.add('capturing');
                this.visibleBtn.innerHTML = `
                    <span class="icon">⏳</span>
                    <span>截图中...</span>
                `;
                this.visibleBtn.disabled = true;

                this.fullpageBtn.classList.add('capturing');
                this.fullpageBtn.innerHTML = `
                    <span class="icon">⏳</span>
                    <span>截图中...</span>
                `;
                this.fullpageBtn.disabled = true;

                this.settingsBtn.classList.add('capturing');
                this.settingsBtn.innerHTML = `
                    <span class="icon">⏳</span>
                    <span>处理中...</span>
                `;
                this.settingsBtn.disabled = true;
                break;
            case 'normal':
            default:
                // 恢复所有按钮的正常状态
                this.visibleBtn.classList.remove('capturing');
                this.visibleBtn.innerHTML = `
                    <span class="icon">📸</span>
                    <span>可见区域</span>
                `;
                this.visibleBtn.disabled = false;

                this.fullpageBtn.classList.remove('capturing');
                this.fullpageBtn.innerHTML = `
                    <span class="icon">📄</span>
                    <span>整个页面</span>
                `;
                this.fullpageBtn.disabled = false;

                this.settingsBtn.classList.remove('capturing');
                this.settingsBtn.innerHTML = `
                    <span class="icon">⚙️</span>
                    <span>设置</span>
                `;
                this.settingsBtn.disabled = false;
                break;
        }
    }

    // 显示提示消息
    showToast(message, type = 'success') {
        // 移除已存在的toast
        const existingToast = document.querySelector('.screenshot-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = `screenshot-toast ${type}`;
        toast.textContent = message;

        // 添加到页面
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

const screenshotInjector = new PageScreenshotInjector();
screenshotInjector.createScreenshotButton();