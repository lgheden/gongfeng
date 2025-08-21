/**
 * CSS Grid生成器工具
 * 提供现代化的网格布局生成功能
 */
class CSSGridTool {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.updateGridPreview();
    }

    initElements() {
        this.gridColumns = document.getElementById('gridColumns');
        this.gridRows = document.getElementById('gridRows');
        this.gridColumnGap = document.getElementById('gridColumnGap');
        this.gridRowGap = document.getElementById('gridRowGap');
        this.gridAlign = document.getElementById('gridAlign');
        this.gridTemplate = document.getElementById('gridTemplate');
        this.gridPreview = document.getElementById('gridPreview');
        this.gridOutput = document.getElementById('gridOutput');
        this.generateGridBtn = document.getElementById('generateGridBtn');
        this.clearGridBtn = document.getElementById('clearGridBtn');
        this.copyGridBtn = document.getElementById('copyGridBtn');
        
        // 数值显示元素
        this.gridColumnsValue = document.getElementById('gridColumnsValue');
        this.gridRowsValue = document.getElementById('gridRowsValue');
        this.gridColumnGapValue = document.getElementById('gridColumnGapValue');
        this.gridRowGapValue = document.getElementById('gridRowGapValue');
    }

    bindEvents() {
        // 绑定滑块事件
        this.gridColumns.addEventListener('input', () => {
            this.gridColumnsValue.textContent = this.gridColumns.value;
            this.updateGridPreview();
        });

        this.gridRows.addEventListener('input', () => {
            this.gridRowsValue.textContent = this.gridRows.value;
            this.updateGridPreview();
        });

        this.gridColumnGap.addEventListener('input', () => {
            this.gridColumnGapValue.textContent = this.gridColumnGap.value + 'px';
            this.updateGridPreview();
        });

        this.gridRowGap.addEventListener('input', () => {
            this.gridRowGapValue.textContent = this.gridRowGap.value + 'px';
            this.updateGridPreview();
        });

        // 绑定选择器事件
        this.gridAlign.addEventListener('change', () => this.updateGridPreview());
        this.gridTemplate.addEventListener('change', () => this.updateGridPreview());

        // 绑定按钮事件
        this.generateGridBtn.addEventListener('click', () => this.generateCSS());
        this.clearGridBtn.addEventListener('click', () => this.clearAll());
        this.copyGridBtn.addEventListener('click', () => this.copyCSS());
    }

    updateGridPreview() {
        const columns = parseInt(this.gridColumns.value);
        const rows = parseInt(this.gridRows.value);
        const columnGap = this.gridColumnGap.value + 'px';
        const rowGap = this.gridRowGap.value + 'px';
        const align = this.gridAlign.value;
        const template = this.gridTemplate.value;

        // 更新网格容器样式
        this.gridPreview.style.display = 'grid';
        this.gridPreview.style.gap = `${rowGap} ${columnGap}`;
        this.gridPreview.style.alignItems = align;

        // 根据模板类型设置列模板
        let gridTemplateColumns;
        switch (template) {
            case 'repeat':
                gridTemplateColumns = `repeat(${columns}, 1fr)`;
                break;
            case 'auto-fit':
                gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
                break;
            case 'auto-fill':
                gridTemplateColumns = `repeat(auto-fill, minmax(100px, 1fr))`;
                break;
            case 'manual':
                gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
                break;
            default:
                gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }

        this.gridPreview.style.gridTemplateColumns = gridTemplateColumns;
        this.gridPreview.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        // 更新网格项目数量
        this.updateGridItems(columns * rows);
    }

    updateGridItems(count) {
        // 清空现有项目
        this.gridPreview.innerHTML = '';

        // 添加新的网格项目
        for (let i = 1; i <= count; i++) {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.textContent = i;
            this.gridPreview.appendChild(item);
        }
    }

    generateCSS() {
        const columns = parseInt(this.gridColumns.value);
        const rows = parseInt(this.gridRows.value);
        const columnGap = this.gridColumnGap.value + 'px';
        const rowGap = this.gridRowGap.value + 'px';
        const align = this.gridAlign.value;
        const template = this.gridTemplate.value;

        let gridTemplateColumns;
        switch (template) {
            case 'repeat':
                gridTemplateColumns = `repeat(${columns}, 1fr)`;
                break;
            case 'auto-fit':
                gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
                break;
            case 'auto-fill':
                gridTemplateColumns = `repeat(auto-fill, minmax(100px, 1fr))`;
                break;
            case 'manual':
                gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
                break;
            default:
                gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }

        const css = `.grid-container {
    display: grid;
    grid-template-columns: ${gridTemplateColumns};
    grid-template-rows: repeat(${rows}, 1fr);
    gap: ${rowGap} ${columnGap};
    align-items: ${align};
    min-height: 200px;
}

.grid-item {
    background: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    padding: 10px;
}`;

        this.gridOutput.value = css;
        this.showNotification('CSS Grid代码已生成！');
    }

    clearAll() {
        this.gridColumns.value = 3;
        this.gridRows.value = 3;
        this.gridColumnGap.value = 10;
        this.gridRowGap.value = 10;
        this.gridAlign.value = 'start';
        this.gridTemplate.value = 'repeat';
        
        this.gridColumnsValue.textContent = '3';
        this.gridRowsValue.textContent = '3';
        this.gridColumnGapValue.textContent = '10px';
        this.gridRowGapValue.textContent = '10px';
        
        this.gridOutput.value = '';
        this.updateGridPreview();
        this.showNotification('已清空所有设置！');
    }

    copyCSS() {
        if (this.gridOutput.value) {
            navigator.clipboard.writeText(this.gridOutput.value).then(() => {
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
    // 检查是否在CSS Grid工具页面
    if (document.getElementById('css-grid')) {
        new CSSGridTool();
    }
}); 