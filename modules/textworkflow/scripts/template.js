 /**
 * 模板生成工具
 * 用于动态生成HTML模板
 */
class TemplateGenerator {
    constructor() {
        this.tool = new TextWorkflowTool();
    }

    /**
     * 生成工作流步骤HTML
     */
    generateWorkflowStep(step, index) {
        const stepInfo = this.tool.stepTypes[step.type];
        const stepNumber = index + 1;
        const totalSteps = window.workflowSteps ? window.workflowSteps.length : 0;

        // 生成参数预览
        const paramsPreview = this.generateParamsPreview(step);

        return `
            <div class="workflow-step" data-step-index="${index}" draggable="true">               
                <div class="step-info">
                 <div class="step-number">${stepNumber}</div>
                 <div class="step-content">
                    <div class="step-title">${stepInfo.name}</div>
                    <div class="step-description">${stepInfo.description}</div>                    
                </div>
            </div>
                <div class="step-actions">
                    <button class="btn-edit" data-id="${index}" title="编辑步骤">
                        <span class="btn-icon">💻</span>
                    </button>
                    <button class="btn-delete" data-id="${index}" onclick="deleteStep(${index})" title="删除步骤">
                        <span class="btn-icon">🗑️</span>
                    </button>
                    <button class="btn-move btn-move-up" data-id="${index}" onclick="moveStep(${index}, 'up')" 
                            ${index === 0 ? 'disabled' : ''} title="上移步骤">
                        <span class="btn-icon">⬆</span>
                    </button>
                    <button class="btn-move btn-move-down" data-id="${index}" onclick="moveStep(${index}, 'down')" 
                            ${index === totalSteps - 1 ? 'disabled' : ''} title="下移步骤">
                        <span class="btn-icon">⬇</span>
                    </button>
                    <div class="step-drag-handle" title="拖拽重新排序">
                        <span class="drag-icon">⋮⋮</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成参数预览
     */
    generateParamsPreview(step) {
        const params = step.params;
        const previews = [];

        for (const [paramName, paramValue] of Object.entries(params)) {
            if (paramValue !== undefined && paramValue !== '' && paramValue !== false) {
                let displayValue = paramValue;

                // 格式化显示值
                if (typeof paramValue === 'boolean') {
                    displayValue = paramValue ? '是' : '否';
                } else if (typeof paramValue === 'string' && paramValue.length > 20) {
                    displayValue = paramValue.substring(0, 20) + '...';
                }

                previews.push(`${paramName}: ${displayValue}`);
            }
        }

        if (previews.length > 0) {
            return `<div class="params-preview">${previews.join(', ')}</div>`;
        }

        return '';
    }

    /**
     * 生成步骤参数配置HTML
     */
    generateStepParams(stepType) {
        const config = this.tool.getStepParamsConfig(stepType);
        let html = '';

        for (const [paramName, paramConfig] of Object.entries(config)) {
            html += this.generateParamField(paramName, paramConfig);
        }

        return html;
    }

    /**
     * 生成参数字段HTML
     */
    generateParamField(paramName, config) {
        const { type, label, options, value } = config;

        switch (type) {
            case 'text':
                return `
                    <div class="param-group">
                        <label for="${paramName}">${label}:</label>
                        <input type="text" id="${paramName}" name="${paramName}" value="${value || ''}" class="form-control">
                    </div>
                `;

            case 'number':
                return `
                    <div class="param-group">
                        <label for="${paramName}">${label}:</label>
                        <input type="number" id="${paramName}" name="${paramName}" value="${value || 1}" class="form-control">
                    </div>
                `;

            case 'select':
                let optionsHtml = '';
                if (options) {
                    optionsHtml = options.map(option =>
                        `<option value="${option.value}">${option.label}</option>`
                    ).join('');
                }
                return `
                    <div class="param-group">
                        <label for="${paramName}">${label}:</label>
                        <select id="${paramName}" name="${paramName}" class="form-control">
                            ${optionsHtml}
                        </select>
                    </div>
                `;

            case 'checkbox':
                return `
                    <div class="param-group">
                        <label for="${paramName}">${label}:</label>
                        <input type="checkbox" id="${paramName}" name="${paramName}" ${value ? 'checked' : ''}>
                    </div>
                `;
            case 'radio':
                let radioHtml = '';
                if (options) {
                    radioHtml = options.map(option => `
                    <div class="radio-option">
                        <input type="radio" id="${paramName}_${option.value}" name="${paramName}" value="${option.value}" ${option.value === value ? 'checked' : ''}>
                        <label for="${paramName}_${option.value}">${option.label}</label>
                    </div>
                `).join('');
                }
                return `
                <div class="param-group">
                    <label>${label}:</label>
                    <div class="radio-group">
                        ${radioHtml}
                    </div>
                </div>
            `;
            default:
                return `
                    <div class="param-group">
                        <label for="${paramName}">${label}:</label>
                        <input type="text" id="${paramName}" name="${paramName}" class="form-control">
                    </div>
                `;
        }
    }

    /**
     * 生成空工作流提示HTML
     */
    generateEmptyWorkflow() {
        return `
            <div class="workflow-steps empty">
                <p>暂无工作流步骤，点击"添加步骤"开始配置</p>
            </div>
        `;
    }

    /**
     * 生成统计信息HTML
     */
    generateStats(stats) {
        return `
            <div class="stat-item">
                <span class="stat-label">字符数:</span>
                <span class="stat-value">${stats.charCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">行数:</span>
                <span class="stat-value">${stats.lineCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">单词数:</span>
                <span class="stat-value">${stats.wordCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">处理时间:</span>
                <span class="stat-value">${stats.processTime}ms</span>
            </div>
        `;
    }

    /**
     * 生成复制成功提示HTML
     */
    generateCopyNotification() {
        return `
            <div class="copy-notification">
                <span>✓ 已复制到剪贴板</span>
            </div>
        `;
    }

    /**
     * 生成加载动画HTML
     */
    generateLoadingSpinner() {
        return `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>处理中...</span>
            </div>
        `;
    }

    /**
     * 生成错误提示HTML
     */
    generateErrorAlert(message) {
        return `
            <div class="error-alert">
                <span class="error-icon">⚠</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
    }

    /**
     * 生成成功提示HTML
     */
    generateSuccessAlert(message) {
        return `
            <div class="success-alert">
                <span class="success-icon">✓</span>
                <span class="success-message">${message}</span>
                <button class="success-close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
    }

    /**
     * 生成示例数据HTML
     */
    generateSampleData() {
        return `
            <div class="sample-data">
                <h4>示例数据</h4>
                <div class="sample-list">
                    <button onclick="loadSample('text')">普通文本</button>
                    <button onclick="loadSample('list')">列表数据</button>
                    <button onclick="loadSample('code')">代码片段</button>
                    <button onclick="loadSample('data')">数据表格</button>
                </div>
            </div>
        `;
    }
}

// 导出模板生成器
window.TemplateGenerator = TemplateGenerator;
