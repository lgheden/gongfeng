/**
 * 文本处理工作流工具主逻辑
 */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化工具和模板生成器
    const tool = new TextWorkflowTool();
    const template = new TemplateGenerator();

    // 获取DOM元素
    const inputArea = document.getElementById('inputArea');
    const outputArea = document.getElementById('outputArea');
    const statusBar = document.getElementById('statusBar');
    const workflowSteps = document.getElementById('workflowSteps');
    const stepModal = document.getElementById('stepModal');
    const stepType = document.getElementById('stepType');
    const stepParams = document.getElementById('stepParams');

    // 按钮元素
    const addStepBtn = document.getElementById('addStepBtn');
    const clearWorkflowBtn = document.getElementById('clearWorkflowBtn');
    const saveWorkflowBtn = document.getElementById('saveWorkflowBtn');
    const loadWorkflowBtn = document.getElementById('loadWorkflowBtn');
    const processBtn = document.getElementById('processBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const compareBtn = document.getElementById('compareBtn');
    const saveStepBtn = document.getElementById('saveStepBtn');
    const cancelStepBtn = document.getElementById('cancelStepBtn');

    // 统计元素
    const charCount = document.getElementById('charCount');
    const lineCount = document.getElementById('lineCount');
    const wordCount = document.getElementById('wordCount');
    const processTime = document.getElementById('processTime');

    // 全局变量
    window.workflowSteps = [];
    let currentEditingIndex = -1;
    let currentData = null;

    // 初始化
    init();

    function init() {
        bindEvents();
        updateWorkflowDisplay();
        updateStats();
        showStatus('文本处理工作流工具已加载', 'info');
    }

    function bindEvents() {
        // 工作流管理事件
        // addStepBtn.addEventListener('click', showAddStepModal);
        clearWorkflowBtn.addEventListener('click', clearWorkflow);
        saveWorkflowBtn.addEventListener('click', saveWorkflow);
        loadWorkflowBtn.addEventListener('click', loadWorkflow);

        // 文本处理事件
        processBtn.addEventListener('click', processWorkflow);
        clearBtn.addEventListener('click', clearAll);
        loadSampleBtn.addEventListener('click', showSampleData);

        // 结果操作事件
        copyBtn.addEventListener('click', copyResult);
        downloadBtn.addEventListener('click', downloadResult);
        compareBtn.addEventListener('click', showCompare);

        // 模态框事件
        stepType.addEventListener('change', updateStepParams);
        saveStepBtn.addEventListener('click', saveStep);
        cancelStepBtn.addEventListener('click', hideModal);

        // 获取所有class为workflow-btn的按钮
        const buttons = document.querySelectorAll('.workflow-btn');

        // 为每个按钮绑定点击事件
        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // 获取当前按钮的data-id属性值
                const dataId = this.getAttribute('data-id');
                stepType.value = dataId;
                addStepParams(dataId);
                showModal();
            });
        });

        // 模态框关闭事件 - 支持多个模态框
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal.id === 'stepModal') {
                    hideModal();
                } else if (modal.id === 'sampleModal') {
                    hideSampleModal();
                } else if (modal.id === 'compareModal') {
                    hideCompareModal();
                }
            });
        });

        // 点击模态框外部关闭
        window.addEventListener('click', function (event) {
            if (event.target.classList.contains('modal')) {
                if (event.target.id === 'stepModal') {
                    hideModal();
                } else if (event.target.id === 'sampleModal') {
                    hideSampleModal();
                } else if (event.target.id === 'compareModal') {
                    hideCompareModal();
                }
            }
        });

        // 输入区域事件
        inputArea.addEventListener('input', updateStats);
        inputArea.addEventListener('paste', updateStats);

        // 键盘快捷键
        document.addEventListener('keydown', handleKeyboard);

        document.addEventListener('click', handleClick);
    }

    // 工作流管理功能
    function showAddStepModal() {
        currentEditingIndex = -1;
        stepType.value = 'case';
        updateStepParams();
        showModal();
    }

    function showEditStepModal(index) {
        if (index < 0 || index >= window.workflowSteps.length) {
            showStatus('无效的步骤索引', 'error');
            return;
        }

        currentEditingIndex = index;
        const step = window.workflowSteps[index];

        // 设置步骤类型
        stepType.value = step.type;
        updateStepParams();

        // 等待DOM更新后填充参数
        setTimeout(() => {
            try {
                for (const [paramName, paramValue] of Object.entries(step.params)) {
                    const element = document.getElementById(paramName);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = Boolean(paramValue);
                        } else if (element.type === 'number') {
                            element.value = Number(paramValue) || 0;
                        } else {
                            element.value = String(paramValue || '');
                        }
                    }
                }
            } catch (error) {
                console.error('填充步骤参数时出错:', error);
                showStatus('加载步骤参数失败', 'error');
            }
        }, 150);

        showModal();

        // 更新模态框标题
        const modalTitle = document.querySelector('.modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = `编辑步骤 ${index + 1}`;
        }
    }

    function addStepParams(selectedType) {
        try {
            stepType.value = selectedType;
            stepParams.innerHTML = template.generateStepParams(selectedType);

            // 为新生成的参数元素添加事件监听
            setTimeout(() => {
                addParamEventListeners();
            }, 50);
        } catch (error) {
            console.error('更新步骤参数时出错:', error);
            stepParams.innerHTML = '<p class="error">参数配置加载失败</p>';
        }
    }

    function updateStepParams() {
        const selectedType = stepType.value;
        try {
            stepParams.innerHTML = template.generateStepParams(selectedType);

            // 为新生成的参数元素添加事件监听
            setTimeout(() => {
                addParamEventListeners();
            }, 50);
        } catch (error) {
            console.error('更新步骤参数时出错:', error);
            stepParams.innerHTML = '<p class="error">参数配置加载失败</p>';
        }
    }

    function addParamEventListeners() {
        // 为文本输入框添加实时验证
        const textInputs = stepParams.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            input.addEventListener('input', function () {
                validateParamInput(this);
            });
        });

        // 为数字输入框添加范围验证
        const numberInputs = stepParams.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', function () {
                validateNumberInput(this);
            });
        });

        // 为选择框添加变化事件
        const selects = stepParams.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', function () {
                handleSelectChange(this);
            });
        });
    }

    function validateParamInput(input) {
        const value = input.value.trim();
        const paramName = input.name;

        // 根据参数类型进行验证
        if (paramName === 'pattern' && value) {
            try {
                new RegExp(value);
                input.style.borderColor = '#28a745';
            } catch (error) {
                input.style.borderColor = '#dc3545';
                input.title = '无效的正则表达式: ' + error.message;
            }
        } else {
            input.style.borderColor = '';
            input.title = '';
        }
    }

    function validateNumberInput(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min) || 0;
        const max = parseInt(input.max) || 999999;

        if (value < min || value > max) {
            input.style.borderColor = '#dc3545';
            input.title = `数值应在 ${min} 到 ${max} 之间`;
        } else {
            input.style.borderColor = '';
            input.title = '';
        }
    }

    function handleSelectChange(select) {
        // 根据选择的值动态显示/隐藏相关参数
        const selectedValue = select.value;
        const paramName = select.name;

        // 例如：当选择"删除字符"模式时，显示相关提示
        if (paramName === 'mode' && selectedValue === 'all') {
            showParamHint('将删除文本中所有匹配的字符');
        } else if (paramName === 'mode' && selectedValue === 'start') {
            showParamHint('将删除每行开头的匹配字符');
        } else if (paramName === 'mode' && selectedValue === 'end') {
            showParamHint('将删除每行结尾的匹配字符');
        }
    }

    function showParamHint(message) {
        // 移除现有提示
        const existingHint = stepParams.querySelector('.param-hint');
        if (existingHint) {
            existingHint.remove();
        }

        // 添加新提示
        const hint = document.createElement('div');
        hint.className = 'param-hint';
        hint.style.cssText = `
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 4px;
            padding: 8px;
            margin: 8px 0;
            font-size: 12px;
            color: #0066cc;
        `;
        hint.textContent = message;
        stepParams.appendChild(hint);
    }

    function saveStep() {
        try {
            const stepTypeValue = stepType.value;
            const params = {};

            // 验证必填参数
            const config = tool.getStepParamsConfig(stepTypeValue);
            const requiredParams = [];

            for (const [paramName, paramConfig] of Object.entries(config)) {
                const element = document.getElementById(paramName);
                if (element) {
                    let value;

                    if (element.type === 'checkbox') {
                        value = element.checked;
                    } else if (element.type === 'number') {
                        value = parseInt(element.value) || 0;
                    } else {
                        value = element.value.trim();
                    }

                    // 检查必填参数
                    if (paramConfig.required && (!value || value === '')) {
                        requiredParams.push(paramConfig.label);
                    }

                    params[paramName] = value;
                }
            }

            // 显示必填参数错误
            if (requiredParams.length > 0) {
                showStatus(`请填写必填参数: ${requiredParams.join(', ')}`, 'error');
                return;
            }

            const step = {
                type: stepTypeValue,
                params: params
            };

            if (currentEditingIndex >= 0) {
                // 编辑现有步骤
                window.workflowSteps[currentEditingIndex] = step;
                showStatus(`步骤 ${currentEditingIndex + 1} 已更新`, 'success');
            } else {
                // 添加新步骤
                window.workflowSteps.push(step);
                showStatus(`步骤 ${window.workflowSteps.length} 已添加`, 'success');
            }

            updateWorkflowDisplay();
            hideModal();

        } catch (error) {
            console.error('保存步骤时出错:', error);
            showStatus('保存步骤失败: ' + error.message, 'error');
        }
    }

    function deleteStep(index) {
        if (index < 0 || index >= window.workflowSteps.length) {
            showStatus('无效的步骤索引', 'error');
            return;
        }

        const step = window.workflowSteps[index];
        const stepInfo = tool.stepTypes[step.type];

        const confirmMessage = `确定要删除步骤 ${index + 1} (${stepInfo.name}) 吗？\n\n此操作无法撤销。`;

        if (confirm(confirmMessage)) {
            try {
                window.workflowSteps.splice(index, 1);
                updateWorkflowDisplay();
                showStatus(`步骤 ${index + 1} 已删除`, 'info');

                // 如果删除的是当前编辑的步骤，重置编辑状态
                if (currentEditingIndex === index) {
                    currentEditingIndex = -1;
                } else if (currentEditingIndex > index) {
                    currentEditingIndex--;
                }
            } catch (error) {
                console.error('删除步骤时出错:', error);
                showStatus('删除步骤失败: ' + error.message, 'error');
            }
        }
    }

    function moveStep(index, direction) {
        if (index < 0 || index >= window.workflowSteps.length) {
            showStatus('无效的步骤索引', 'error');
            return;
        }

        try {
            let newIndex = index;

            if (direction === 'up' && index > 0) {
                newIndex = index - 1;
                [window.workflowSteps[index], window.workflowSteps[newIndex]] =
                    [window.workflowSteps[newIndex], window.workflowSteps[index]];
                showStatus(`步骤 ${index + 1} 已上移`, 'info');
            } else if (direction === 'down' && index < window.workflowSteps.length - 1) {
                newIndex = index + 1;
                [window.workflowSteps[index], window.workflowSteps[newIndex]] =
                    [window.workflowSteps[newIndex], window.workflowSteps[index]];
                showStatus(`步骤 ${index + 1} 已下移`, 'info');
            } else {
                showStatus(`步骤无法${direction === 'up' ? '上移' : '下移'}`, 'warning');
                return;
            }

            // 更新编辑索引
            if (currentEditingIndex === index) {
                currentEditingIndex = newIndex;
            } else if (currentEditingIndex === newIndex) {
                currentEditingIndex = index;
            }

            updateWorkflowDisplay();

        } catch (error) {
            console.error('移动步骤时出错:', error);
            showStatus('移动步骤失败: ' + error.message, 'error');
        }
    }

    function clearWorkflow() {
        if (window.workflowSteps.length === 0) {
            showStatus('工作流已经是空的', 'info');
            return;
        }

        const confirmMessage = `确定要清空整个工作流吗？\n\n当前有 ${window.workflowSteps.length} 个步骤，此操作无法撤销。`;

        if (confirm(confirmMessage)) {
            try {
                window.workflowSteps = [];
                currentEditingIndex = -1;
                updateWorkflowDisplay();
                showStatus('工作流已清空', 'info');
            } catch (error) {
                console.error('清空工作流时出错:', error);
                showStatus('清空工作流失败: ' + error.message, 'error');
            }
        }
    }

    function updateWorkflowDisplay() {
        try {
            if (window.workflowSteps.length === 0) {
                workflowSteps.innerHTML = template.generateEmptyWorkflow();
            } else {
                workflowSteps.innerHTML = window.workflowSteps.map((step, index) =>
                    template.generateWorkflowStep(step, index)
                ).join('');

                // 添加拖拽功能
                addDragAndDropSupport();
            }
        } catch (error) {
            console.error('更新工作流显示时出错:', error);
            workflowSteps.innerHTML = '<p class="error">工作流显示更新失败</p>';
        }
    }

    function addDragAndDropSupport() {
        const stepElements = workflowSteps.querySelectorAll('.workflow-step');

        stepElements.forEach((element, index) => {
            element.draggable = true;

            element.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', index);
                this.classList.add('dragging');
            });

            element.addEventListener('dragend', function () {
                this.classList.remove('dragging');
            });

            element.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            element.addEventListener('dragleave', function () {
                this.classList.remove('drag-over');
            });

            element.addEventListener('drop', function (e) {
                e.preventDefault();
                this.classList.remove('drag-over');

                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;

                if (fromIndex !== toIndex) {
                    moveStepByDrag(fromIndex, toIndex);
                }
            });
        });
    }

    function moveStepByDrag(fromIndex, toIndex) {
        try {
            const step = window.workflowSteps.splice(fromIndex, 1)[0];
            window.workflowSteps.splice(toIndex, 0, step);

            // 更新编辑索引
            if (currentEditingIndex === fromIndex) {
                currentEditingIndex = toIndex;
            } else if (currentEditingIndex > fromIndex && currentEditingIndex <= toIndex) {
                currentEditingIndex--;
            } else if (currentEditingIndex < fromIndex && currentEditingIndex >= toIndex) {
                currentEditingIndex++;
            }

            updateWorkflowDisplay();
            showStatus(`步骤已从位置 ${fromIndex + 1} 移动到位置 ${toIndex + 1}`, 'success');
        } catch (error) {
            console.error('拖拽移动步骤时出错:', error);
            showStatus('移动步骤失败: ' + error.message, 'error');
        }
    }

    // 文本处理功能
    function processWorkflow() {
        const input = inputArea.value.trim();
        if (!input) {
            showStatus('请输入要处理的文本', 'warning');
            return;
        }

        if (window.workflowSteps.length === 0) {
            showStatus('请先添加工作流步骤', 'warning');
            return;
        }

        const startTime = performance.now();

        try {
            const result = tool.processWorkflow(input, window.workflowSteps);
            const endTime = performance.now();

            outputArea.value = result;
            currentData = result;

            processTime.textContent = Math.round(endTime - startTime);
            updateStats();

            showStatus(`工作流执行完成，处理了 ${window.workflowSteps.length} 个步骤`, 'success');
        } catch (error) {
            showStatus('处理失败: ' + error.message, 'error');
        }
    }

    function clearAll() {
        inputArea.value = '';
        outputArea.value = '';
        currentData = null;
        updateStats();
        showStatus('已清空', 'info');
    }

    function showSampleData() {
        const sampleModal = document.getElementById('sampleModal');
        const sampleCards = sampleModal.querySelectorAll('.sample-card');

        // 绑定示例卡片点击事件
        sampleCards.forEach(card => {
            card.addEventListener('click', function () {
                const sampleType = this.getAttribute('data-sample');
                loadSampleData(sampleType);

                // 添加选中效果
                sampleCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');

                // 延迟关闭模态框
                setTimeout(() => {
                    hideSampleModal();
                }, 500);
            });
        });

        // 绑定取消按钮事件
        document.getElementById('cancelSampleBtn').addEventListener('click', hideSampleModal);

        // 绑定模态框关闭事件
        sampleModal.querySelector('.close').addEventListener('click', hideSampleModal);

        showSampleModal();
    }

    function loadSampleData(sampleType) {
        const samples = {
            text: `这是一个示例文本。
包含多行内容。
用于测试文本处理功能。

Hello World!
这是一个混合中英文的文本。

您可以使用这个文本来测试各种文本处理功能，
比如大小写转换、文本替换、删除空行等。`,

            list: `苹果
香蕉
橙子
葡萄
西瓜
草莓
蓝莓
樱桃
柠檬
柚子
猕猴桃
芒果`,

            code: `function hello() {
    console.log("Hello World!");
}

const data = {
    name: "张三",
    age: 25,
    city: "北京"
};

// 这是一个JavaScript代码示例
class Example {
    constructor() {
        this.value = 42;
    }
    
    getValue() {
        return this.value;
    }
}`,

            data: `姓名,年龄,城市,职业
张三,25,北京,工程师
李四,30,上海,设计师
王五,28,广州,产品经理
赵六,35,深圳,数据分析师
钱七,27,杭州,前端开发
孙八,32,成都,后端开发`,

            email: `user1@example.com
user2@example.com
admin@company.com
support@service.com
info@website.com
contact@business.com
sales@enterprise.com
marketing@corp.com`,

            log: `[2024-01-01 10:00:00] INFO: 系统启动成功
[2024-01-01 10:00:05] DEBUG: 初始化数据库连接
[2024-01-01 10:00:10] INFO: 数据库连接成功
[2024-01-01 10:00:15] WARN: 缓存服务连接超时
[2024-01-01 10:00:20] ERROR: 用户认证失败
[2024-01-01 10:00:25] INFO: 服务运行正常
[2024-01-01 10:00:30] DEBUG: 处理用户请求`
        };

        if (samples[sampleType]) {
            inputArea.value = samples[sampleType];
            updateStats();
            showStatus(`已加载${getSampleTypeName(sampleType)}示例数据`, 'success');
        }
    }

    function getSampleTypeName(type) {
        const names = {
            text: '普通文本',
            list: '列表数据',
            code: '代码片段',
            data: '数据表格',
            email: '邮件列表',
            log: '日志文件'
        };
        return names[type] || '示例';
    }

    function showSampleModal() {
        const sampleModal = document.getElementById('sampleModal');
        sampleModal.style.display = 'block';
    }

    function hideSampleModal() {
        const sampleModal = document.getElementById('sampleModal');
        sampleModal.style.display = 'none';
    }

    // 结果操作功能
    function copyResult() {
        if (!currentData) {
            showStatus('没有可复制的内容', 'warning');
            return;
        }

        navigator.clipboard.writeText(currentData).then(function () {
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        }).catch(function (err) {
            showStatus('复制失败: ' + err.message, 'error');
        });
    }

    function downloadResult() {
        if (!currentData) {
            showStatus('没有可下载的内容', 'warning');
            return;
        }

        const blob = new Blob([currentData], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed_text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus('文件已下载', 'success');
    }

    function showCompare() {
        const input = inputArea.value;
        const output = outputArea.value;

        if (!input || !output) {
            showStatus('需要输入和输出内容才能对比', 'warning');
            return;
        }

        // 更新对比数据
        updateCompareData(input, output);

        // 绑定对比模态框事件
        const compareModal = document.getElementById('compareModal');
        document.getElementById('exportCompareBtn').addEventListener('click', exportCompareReport);
        document.getElementById('closeCompareBtn').addEventListener('click', hideCompareModal);
        compareModal.querySelector('.close').addEventListener('click', hideCompareModal);

        showCompareModal();
    }

    function updateCompareData(originalText, processedText) {
        // 更新统计信息
        const originalLines = originalText.split('\n');
        const processedLines = processedText.split('\n');

        document.getElementById('originalCharCount').textContent = originalText.length;
        document.getElementById('originalLineCount').textContent = originalLines.length;
        document.getElementById('processedCharCount').textContent = processedText.length;
        document.getElementById('processedLineCount').textContent = processedLines.length;

        // 计算变化
        const charChange = processedText.length - originalText.length;
        const lineChange = processedLines.length - originalLines.length;
        const changeRate = originalText.length > 0 ?
            Math.round((charChange / originalText.length) * 100) : 0;

        document.getElementById('charChange').textContent = charChange > 0 ? `+${charChange}` : charChange;
        document.getElementById('lineChange').textContent = lineChange > 0 ? `+${lineChange}` : lineChange;
        document.getElementById('changeRate').textContent = `${changeRate > 0 ? '+' : ''}${changeRate}%`;

        // 设置颜色
        const charChangeEl = document.getElementById('charChange');
        const lineChangeEl = document.getElementById('lineChange');
        const changeRateEl = document.getElementById('changeRate');

        charChangeEl.style.color = charChange > 0 ? '#28a745' : charChange < 0 ? '#dc3545' : '#666';
        lineChangeEl.style.color = lineChange > 0 ? '#28a745' : lineChange < 0 ? '#dc3545' : '#666';
        changeRateEl.style.color = changeRate > 0 ? '#28a745' : changeRate < 0 ? '#dc3545' : '#666';

        // 显示文本内容（带高亮）
        document.getElementById('originalText').textContent = originalText;
        document.getElementById('processedText').innerHTML = highlightChanges(originalText, processedText);
    }

    function highlightChanges(original, processed) {
        // 简单的差异高亮算法
        const originalLines = original.split('\n');
        const processedLines = processed.split('\n');

        let result = '';

        for (let i = 0; i < Math.max(originalLines.length, processedLines.length); i++) {
            const originalLine = originalLines[i] || '';
            const processedLine = processedLines[i] || '';

            if (originalLine === processedLine) {
                result += originalLine + '\n';
            } else {
                if (originalLine && !processedLine) {
                    result += `<span class="highlight-removed">${originalLine}</span>\n`;
                } else if (!originalLine && processedLine) {
                    result += `<span class="highlight-added">${processedLine}</span>\n`;
                } else {
                    result += `<span class="highlight-changed">${processedLine}</span>\n`;
                }
            }
        }

        return result;
    }

    function exportCompareReport() {
        const input = inputArea.value;
        const output = outputArea.value;

        if (!input || !output) {
            showStatus('没有对比数据可导出', 'warning');
            return;
        }

        const report = generateCompareReport(input, output);
        const blob = new Blob([report], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text_compare_report_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus('对比报告已导出', 'success');
    }

    function generateCompareReport(original, processed) {
        const originalLines = original.split('\n');
        const processedLines = processed.split('\n');
        const charChange = processed.length - original.length;
        const lineChange = processedLines.length - originalLines.length;
        const changeRate = original.length > 0 ?
            Math.round((charChange / original.length) * 100) : 0;

        return `文本对比报告
生成时间: ${new Date().toLocaleString()}

原始文本统计:
- 字符数: ${original.length}
- 行数: ${originalLines.length}

处理后文本统计:
- 字符数: ${processed.length}
- 行数: ${processedLines.length}

变化统计:
- 字符变化: ${charChange > 0 ? '+' : ''}${charChange}
- 行数变化: ${lineChange > 0 ? '+' : ''}${lineChange}
- 变化率: ${changeRate > 0 ? '+' : ''}${changeRate}%

原始文本:
${'='.repeat(50)}
${original}

处理后文本:
${'='.repeat(50)}
${processed}

对比结果:
${'='.repeat(50)}
${highlightChangesForReport(original, processed)}
`;
    }

    function highlightChangesForReport(original, processed) {
        const originalLines = original.split('\n');
        const processedLines = processed.split('\n');

        let result = '';

        for (let i = 0; i < Math.max(originalLines.length, processedLines.length); i++) {
            const originalLine = originalLines[i] || '';
            const processedLine = processedLines[i] || '';

            if (originalLine === processedLine) {
                result += `  ${originalLine}\n`;
            } else {
                if (originalLine && !processedLine) {
                    result += `- ${originalLine}\n`;
                } else if (!originalLine && processedLine) {
                    result += `+ ${processedLine}\n`;
                } else {
                    result += `~ ${processedLine}\n`;
                }
            }
        }

        return result;
    }

    function showCompareModal() {
        const compareModal = document.getElementById('compareModal');
        compareModal.style.display = 'block';
    }

    function hideCompareModal() {
        const compareModal = document.getElementById('compareModal');
        compareModal.style.display = 'none';
    }

    // 工作流保存/加载功能
    function saveWorkflow() {
        if (window.workflowSteps.length === 0) {
            showStatus('没有工作流可保存', 'warning');
            return;
        }

        const workflowData = {
            name: prompt('请输入工作流名称:') || '未命名工作流',
            steps: window.workflowSteps,
            timestamp: new Date().toISOString()
        };

        const workflows = JSON.parse(localStorage.getItem('textWorkflows') || '[]');
        workflows.push(workflowData);
        localStorage.setItem('textWorkflows', JSON.stringify(workflows));

        showStatus('工作流已保存', 'success');
    }

    function loadWorkflow() {
        const workflows = JSON.parse(localStorage.getItem('textWorkflows') || '[]');

        if (workflows.length === 0) {
            showStatus('没有保存的工作流', 'info');
            return;
        }

        const workflowList = workflows.map((wf, index) =>
            `${index + 1}. ${wf.name} (${wf.steps.length} 步骤)`
        ).join('\n');

        const choice = prompt(`请选择要加载的工作流:\n\n${workflowList}\n\n请输入数字(1-${workflows.length}):`);
        const index = parseInt(choice) - 1;

        if (index >= 0 && index < workflows.length) {
            window.workflowSteps = workflows[index].steps;
            updateWorkflowDisplay();
            showStatus(`工作流"${workflows[index].name}"已加载`, 'success');
        }
    }

    // 工具函数
    function updateStats() {
        const text = inputArea.value;
        const lines = text.split('\n');
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);

        charCount.textContent = text.length;
        lineCount.textContent = lines.length;
        wordCount.textContent = words.length;
    }

    function showStatus(message, type = 'info') {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };

        statusBar.style.color = colors[type] || colors.info;
        statusBar.textContent = message;

        setTimeout(() => {
            statusBar.textContent = '';
        }, 3000);
    }

    function showCopyNotification() {
        const notification = document.createElement('div');
        notification.textContent = '✓ 已复制';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function showModal() {
        stepModal.style.display = 'block';
    }

    function hideModal() {
        stepModal.style.display = 'none';
        currentEditingIndex = -1;
    }

    function handleKeyboard(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            processWorkflow();
        }

        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            saveWorkflow();
        }

        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            loadWorkflow();
        }
    }

    function handleClick(event) {
        const target = event.target.closest('.step-actions button');
        if (target) {
            const dataId = target.getAttribute('data-id');
            const index = parseInt(dataId, 10);
            if (target.classList.contains('btn-edit')) {
                editStep(index);
            } else if (target.classList.contains('btn-delete')) {
                deleteStep(index);
            } else if (target.classList.contains('btn-move-up')) {
                moveStep(index, 'up');
            } else if (target.classList.contains('btn-move-down')) {
                moveStep(index, 'down');
            }
        };
    }



    // 全局函数（供模板调用）
    window.editStep = showEditStepModal;
    window.deleteStep = deleteStep;
    window.moveStep = moveStep;

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
