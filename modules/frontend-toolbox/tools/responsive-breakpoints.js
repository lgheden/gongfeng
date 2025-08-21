/**
 * 响应式断点生成器工具
 * 提供移动端适配和响应式断点生成功能
 */
class ResponsiveBreakpoints {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.updateBreakpoints();
    }

    initElements() {
        this.breakpointPreset = document.getElementById('breakpointPreset');
        this.breakpointsList = document.getElementById('breakpointsList');
        this.containerMaxWidth = document.getElementById('containerMaxWidth');
        this.breakpointsPreview = document.getElementById('breakpointsPreview');
        this.breakpointsOutput = document.getElementById('breakpointsOutput');
        this.generateBreakpointsBtn = document.getElementById('generateBreakpointsBtn');
        this.clearBreakpointsBtn = document.getElementById('clearBreakpointsBtn');
        this.copyBreakpointsBtn = document.getElementById('copyBreakpointsBtn');
        
        // 视口控制按钮
        this.viewportBtns = document.querySelectorAll('.viewport-btn');
    }

    bindEvents() {
        // 绑定预设断点选择
        this.breakpointPreset.addEventListener('change', () => this.loadPreset());

        // 绑定断点输入事件
        this.breakpointsList.addEventListener('input', (e) => {
            if (e.target.type === 'number') {
                this.updateBreakpoints();
            }
        });

        // 绑定容器最大宽度事件
        this.containerMaxWidth.addEventListener('input', () => this.updateBreakpoints());

        // 绑定视口按钮事件
        this.viewportBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setViewport(btn));
        });

        // 绑定按钮事件
        this.generateBreakpointsBtn.addEventListener('click', () => this.generateCSS());
        this.clearBreakpointsBtn.addEventListener('click', () => this.clearAll());
        this.copyBreakpointsBtn.addEventListener('click', () => this.copyCSS());
    }

    loadPreset() {
        const preset = this.breakpointPreset.value;
        let breakpoints = [];

        switch (preset) {
            case 'bootstrap':
                breakpoints = [
                    { name: 'xs', width: 576 },
                    { name: 'sm', width: 768 },
                    { name: 'md', width: 992 },
                    { name: 'lg', width: 1200 },
                    { name: 'xl', width: 1400 }
                ];
                break;
            case 'tailwind':
                breakpoints = [
                    { name: 'sm', width: 640 },
                    { name: 'md', width: 768 },
                    { name: 'lg', width: 1024 },
                    { name: 'xl', width: 1280 },
                    { name: '2xl', width: 1536 }
                ];
                break;
            case 'material':
                breakpoints = [
                    { name: 'xs', width: 600 },
                    { name: 'sm', width: 960 },
                    { name: 'md', width: 1280 },
                    { name: 'lg', width: 1920 }
                ];
                break;
            case 'custom':
                return; // 保持当前设置
        }

        // 更新断点列表
        this.updateBreakpointsList(breakpoints);
        this.updateBreakpoints();
    }

    updateBreakpointsList(breakpoints) {
        this.breakpointsList.innerHTML = '';
        
        breakpoints.forEach(bp => {
            const item = document.createElement('div');
            item.className = 'breakpoint-item';
            item.innerHTML = `
                <label>${bp.name}:</label>
                <input type="number" value="${bp.width}" min="320" max="2000">
                <span>px</span>
                <span class="breakpoint-name">(${bp.name})</span>
            `;
            this.breakpointsList.appendChild(item);
        });

        // 重新绑定事件
        this.breakpointsList.addEventListener('input', (e) => {
            if (e.target.type === 'number') {
                this.updateBreakpoints();
            }
        });
    }

    updateBreakpoints() {
        const breakpoints = this.getBreakpoints();
        const maxWidth = this.containerMaxWidth.value;
        
        // 更新预览容器样式
        this.breakpointsPreview.style.maxWidth = maxWidth + 'px';
        this.breakpointsPreview.style.margin = '0 auto';
        
        // 更新响应式内容
        this.updateResponsiveContent(breakpoints);
    }

    getBreakpoints() {
        const items = this.breakpointsList.querySelectorAll('.breakpoint-item');
        const breakpoints = [];
        
        items.forEach(item => {
            const input = item.querySelector('input[type="number"]');
            const name = item.querySelector('.breakpoint-name').textContent.match(/\(([^)]+)\)/)[1];
            breakpoints.push({
                name: name,
                width: parseInt(input.value)
            });
        });
        
        return breakpoints.sort((a, b) => a.width - b.width);
    }

    updateResponsiveContent(breakpoints) {
        const content = this.breakpointsPreview.querySelector('.responsive-content');
        const currentWidth = window.innerWidth;
        
        let currentBreakpoint = 'xs';
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (currentWidth >= breakpoints[i].width) {
                currentBreakpoint = breakpoints[i].name;
                break;
            }
        }
        
        content.innerHTML = `
            <h3>当前断点: ${currentBreakpoint.toUpperCase()}</h3>
            <p>屏幕宽度: ${currentWidth}px</p>
            <div class="breakpoint-info">
                <p>断点设置:</p>
                <ul>
                    ${breakpoints.map(bp => `<li>${bp.name}: ${bp.width}px</li>`).join('')}
                </ul>
            </div>
        `;
    }

    setViewport(btn) {
        // 移除所有活动状态
        this.viewportBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const width = btn.dataset.width;
        this.breakpointsPreview.style.width = width + 'px';
        this.breakpointsPreview.style.transition = 'width 0.3s ease';
        
        // 更新响应式内容
        setTimeout(() => {
            this.updateBreakpoints();
        }, 300);
    }

    generateCSS() {
        const breakpoints = this.getBreakpoints();
        const maxWidth = this.containerMaxWidth.value;
        
        let css = `/* 响应式断点设置 */
.container {
    max-width: ${maxWidth}px;
    margin: 0 auto;
    padding: 0 15px;
}

/* 移动优先的响应式设计 */
.responsive-element {
    /* 默认样式 (移动端) */
    font-size: 14px;
    padding: 10px;
    margin: 5px 0;
}

`;

        // 生成断点CSS
        breakpoints.forEach(bp => {
            css += `/* ${bp.name.toUpperCase()} 断点 (${bp.width}px+) */
@media (min-width: ${bp.width}px) {
    .responsive-element {
        font-size: ${this.getFontSize(bp.name)}px;
        padding: ${this.getPadding(bp.name)}px;
        margin: ${this.getMargin(bp.name)}px 0;
    }
    
    .container {
        padding: 0 ${this.getContainerPadding(bp.name)}px;
    }
}

`;
        });

        // 添加实用工具类
        css += `/* 响应式工具类 */
.hidden-xs { display: none; }
.hidden-sm { display: none; }
.hidden-md { display: none; }
.hidden-lg { display: none; }

@media (min-width: ${breakpoints[0]?.width || 576}px) {
    .hidden-xs { display: block; }
}

@media (min-width: ${breakpoints[1]?.width || 768}px) {
    .hidden-sm { display: block; }
}

@media (min-width: ${breakpoints[2]?.width || 992}px) {
    .hidden-md { display: block; }
}

@media (min-width: ${breakpoints[3]?.width || 1200}px) {
    .hidden-lg { display: block; }
}`;

        this.breakpointsOutput.value = css;
        this.showNotification('响应式断点CSS代码已生成！');
    }

    getFontSize(breakpoint) {
        const sizes = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22, '2xl': 24 };
        return sizes[breakpoint] || 16;
    }

    getPadding(breakpoint) {
        const paddings = { xs: 10, sm: 15, md: 20, lg: 25, xl: 30, '2xl': 35 };
        return paddings[breakpoint] || 15;
    }

    getMargin(breakpoint) {
        const margins = { xs: 5, sm: 10, md: 15, lg: 20, xl: 25, '2xl': 30 };
        return margins[breakpoint] || 10;
    }

    getContainerPadding(breakpoint) {
        const paddings = { xs: 15, sm: 20, md: 30, lg: 40, xl: 50, '2xl': 60 };
        return paddings[breakpoint] || 20;
    }

    clearAll() {
        this.breakpointPreset.value = 'bootstrap';
        this.containerMaxWidth.value = 1200;
        this.loadPreset();
        this.breakpointsOutput.value = '';
        
        // 重置视口
        this.viewportBtns.forEach(b => b.classList.remove('active'));
        this.breakpointsPreview.style.width = '100%';
        
        this.showNotification('已清空所有设置！');
    }

    copyCSS() {
        if (this.breakpointsOutput.value) {
            navigator.clipboard.writeText(this.breakpointsOutput.value).then(() => {
                this.showNotification('CSS代码已复制到剪贴板！');
            }).catch(() => {
                this.showNotification('复制失败，请手动复制！');
            });
        } else {
            this.showNotification('请先生成CSS代码！');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 当DOM加载完成后初始化工具
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在响应式断点工具页面
    if (document.getElementById('responsive-breakpoints')) {
        new ResponsiveBreakpoints();
    }
}); 