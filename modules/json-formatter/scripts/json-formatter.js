document.addEventListener('DOMContentLoaded', function() {
    const jsonInputElement = document.getElementById('jsonInput');
    const jsonOutputElement = document.getElementById('jsonOutput');
    const statusBar = document.getElementById('statusBar');
    const formatBtn = document.getElementById('formatBtn');
    const compressBtn = document.getElementById('compressBtn');
    const validateBtn = document.getElementById('validateBtn');
    const sortBtn = document.getElementById('sortBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // 初始化输入CodeMirror编辑器
    const jsonInput = CodeMirror(jsonInputElement, {
        mode: 'application/json',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        value: '',
        viewportMargin: 50,
        viewportMargin: Infinity,
        scrollbarStyle: 'native'
    });

    // 初始化输出CodeMirror编辑器
    const jsonOutput = CodeMirror(jsonOutputElement, {
        mode: 'application/json',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,  // 允许编辑
        indentUnit: 2,
        tabSize: 2,
        value: '',
        foldGutter: true,
        viewportMargin: Infinity,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        viewportMargin: 50,
        scrollbarStyle: 'native',
        extraKeys: {
            "Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); },
            "Ctrl-Alt-[": function(cm) { cm.foldCode(cm.getCursor()); },
            "Ctrl-Alt-]": function(cm) { cm.unfoldCode(cm.getCursor()); }
        }
    });

    // 添加占位符文本
    let isPlaceholderActive = true;
    if (jsonInput.getValue() === '') {
        jsonInput.setValue('// 请输入JSON5数据...');
        jsonInput.setCursor(0, 0);
        jsonInput.setSelection({line: 0, ch: 0}, {line: 0, ch: jsonInput.getLine(0).length});
    }

    // 处理占位符逻辑
    jsonInput.on('focus', function() {
        if (isPlaceholderActive && jsonInput.getValue() === '// 请输入JSON5数据...') {
            jsonInput.setValue('');
            isPlaceholderActive = false;
        }
    });

    jsonInput.on('blur', function() {
        if (jsonInput.getValue().trim() === '') {
            jsonInput.setValue('// 请输入JSON5数据...');
            isPlaceholderActive = true;
        }
    });

    // 新增的控制元素
    const enableCollapse = document.getElementById('enableCollapse');
    const sortKeys = document.getElementById('sortKeys');
    const showLineNumbers = document.getElementById('showLineNumbers');
    const indentSize = document.getElementById('indentSize');

    // 默认显示行号
    showLineNumbers.checked = true;
    const collapseControls = document.getElementById('collapseControls');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseLevel = document.getElementById('collapseLevel');

    // 测试数据按钮
    const testSimpleBtn = document.getElementById('testSimpleBtn');
    const testJson5Btn = document.getElementById('testJson5Btn');
    const testComplexBtn = document.getElementById('testComplexBtn');
    const testArrayBtn = document.getElementById('testArrayBtn');
    const testNestedBtn = document.getElementById('testNestedBtn');

    let currentJson = null;
    let maxDepth = 0;

    // 格式化JSON
    formatBtn.addEventListener('click', function() {
        let input = jsonInput.getValue().trim();
        // 如果是占位符文本，视为空输入
        if (input === '// 请输入JSON数据...' || isPlaceholderActive) {
            input = '';
        }
        if (!input) {
            showStatus('请输入JSON数据', 'error');
            return;
        }

        try {
            const jsonpPattern = /^[^(]+\(([\s\S]*)\)$/;
            const jsonpMatch = input.match(jsonpPattern);

            if (jsonpMatch) {
                // 尝试解析括号内的内容是否为合法 JSON
                input = jsonpMatch[1].trim();
            }

            // 先处理转义的引号
            input = input.replace(/\\"/g, '"');
            let parsed = JSON5.parse(input);
            // 如果启用了自动排序
            if (sortKeys.checked) {
                parsed = sortObjectKeys(parsed);
            }

            currentJson = parsed;
            const indentValue = getIndentValue();
            const formatted = JSON.stringify(parsed, null, indentValue);

            if (enableCollapse.checked) {
                displayCollapsibleJson(parsed);
            } else {
                displayFormattedJson(formatted);
            }

            showStatus('JSON格式化成功', 'success');
            showJsonStats(formatted);
        } catch (error) {
            jsonOutput.setValue(safeParseString(input));
        }
    });

    function safeParseString(str) {
        try {
            return JSON.parse(str);
        } catch  (error) {
            showStatus(`JSON格式错误: ${error.message}`, 'error');
            return str;
        }
    }


    // 排序JSON键名
    sortBtn.addEventListener('click', function() {
        let input = jsonInput.getValue().trim();
        // 如果是占位符文本，视为空输入
        if (input === '// 请输入JSON数据...' || isPlaceholderActive) {
            input = '';
        }
        if (!input) {
            showStatus('请输入JSON数据', 'error');
            return;
        }

        try {
            let funcName = null;
            const jsonpRegex = /^([\w$.]+)\(\s*([\s\S]*)\s*\)$/;
            const match = jsonpRegex.exec(input);
            if (match) {
                funcName = match[1];
                input = match[2]; // 提取 JSON 部分
            }

            // 先处理转义的引号
            input = input.replace(/\\"/g, '"');

            let parsed = JSON5.parse(input);
            parsed = sortObjectKeys(parsed);
            currentJson = parsed;

            const indentValue = getIndentValue();
            const formatted = JSON.stringify(parsed, null, indentValue);

            if (enableCollapse.checked) {
                displayCollapsibleJson(parsed);
            } else {
                displayFormattedJson(formatted);
            }

            showStatus('JSON键名排序成功', 'success');
            showJsonStats(formatted);
        } catch (error) {
            showStatus(`JSON格式错误: ${error.message}`, 'error');
            jsonOutput.setValue(`错误: ${error.message}`);
        }
    });

    // 压缩JSON
    compressBtn.addEventListener('click', function() {
        let input = jsonInput.getValue().trim();
        // 如果是占位符文本，视为空输入
        if (input === '// 请输入JSON数据...' || isPlaceholderActive) {
            input = '';
        }
        if (!input) {
            showStatus('请输入JSON数据', 'error');
            return;
        }

        try {
            let funcName = null;
            const jsonpRegex = /^([\w$.]+)\(\s*([\s\S]*)\s*\)$/;
            const match = jsonpRegex.exec(input);
            if (match) {
                funcName = match[1];
                input = match[2]; // 提取 JSON 部分
            }

            // 先处理转义的引号
            input = input.replace(/\\"/g, '"');

            let parsed = JSON5.parse(input);

            // 如果启用了自动排序
            if (sortKeys.checked) {
                parsed = sortObjectKeys(parsed);
            }

            currentJson = parsed;
            const compressed = JSON.stringify(parsed);
            jsonOutput.setValue(compressed);
            showStatus('JSON压缩成功', 'success');
            showJsonStats(compressed);
        } catch (error) {
            showStatus(`JSON格式错误: ${error.message}`, 'error');
            jsonOutput.setValue(`错误: ${error.message}`);
        }
    });

    // 验证JSON
    validateBtn.addEventListener('click', function() {
        let input = jsonInput.getValue().trim();
        // 如果是占位符文本，视为空输入
        if (input === '// 请输入JSON数据...' || isPlaceholderActive) {
            input = '';
        }
        if (!input) {
            showStatus('请输入JSON数据', 'error');
            return;
        }

        try {
            let funcName = null;
            const jsonpRegex = /^([\w$.]+)\(\s*([\s\S]*)\s*\)$/;
            const match = jsonpRegex.exec(input);
            if (match) {
                funcName = match[1];
                input = match[2]; // 提取 JSON 部分
            }

            // 先处理转义的引号
            input = input.replace(/\\"/g, '"');

            const parsed = JSON5.parse(input);
            currentJson = parsed;
            showStatus('JSON格式正确 ✓', 'success');
            jsonInput.getWrapperElement().classList.add('json-valid');
            jsonInput.getWrapperElement().classList.remove('json-invalid');
        } catch (error) {
            showStatus(`JSON格式错误: ${error.message}`, 'error');
            jsonInput.getWrapperElement().classList.add('json-invalid');
            jsonInput.getWrapperElement().classList.remove('json-valid');
        }
    });

    // 清空
    clearBtn.addEventListener('click', function() {
        jsonInput.setValue('');
        jsonOutput.setValue('');
        jsonInput.getWrapperElement().classList.remove('json-valid', 'json-invalid');
        statusBar.textContent = '';
        statusBar.className = 'status-bar';
        currentJson = null;
    });

    // 复制结果
    copyBtn.addEventListener('click', function() {
        const output = jsonOutput.getValue();
        if (!output) {
            showStatus('没有可复制的内容', 'error');
            return;
        }

        navigator.clipboard.writeText(output).then(function() {
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        }).catch(function() {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = output;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        });
    });

    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', function() {
        filterOutput(this.value);
    });

    function filterOutput(query) {
        if (!currentJson) return;

        const formatted = JSON.stringify(currentJson, null, getIndentValue());
        const lines = formatted.split('\n');

        if (!query.trim()) {
            jsonOutput.setValue(formatted);
            return;
        }

        const filteredLines = lines.filter(line => line.toLowerCase().includes(query.toLowerCase()));
        jsonOutput.setValue(filteredLines.join('\n'));
    }

    // 显示格式化的JSON
    function displayFormattedJson(jsonString) {
        // 隐藏折叠容器，显示CodeMirror编辑器
        const wrapper = jsonOutput.getWrapperElement();
        const existingCollapsible = wrapper.parentElement.querySelector('.json-collapsible-container');
        if (existingCollapsible) {
            existingCollapsible.remove();
        }
        wrapper.style.display = 'block';

        jsonOutput.setValue(jsonString);
        jsonOutput.getWrapperElement().classList.add('json-valid');
    }

    // JSON语法高亮
    function highlightJson(jsonString) {
        return jsonString
            .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
            .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
            .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/: null/g, ': <span class="json-null">null</span>')
            .replace(/([\[\]{}])/g, '<span class="json-bracket">$1</span>');
    }

    // 显示状态信息
    function showStatus(message, type) {
        statusBar.textContent = message;
        statusBar.className = `status-bar status-${type}`;
    }

    // 显示JSON统计信息
    function showJsonStats(jsonString) {
        const lines = jsonString.split('\n').length;
        const chars = jsonString.length;
        const size = new Blob([jsonString]).size;

        const statsHtml = `
            <div class="json-stats">
                <span>行数: ${lines}</span>
                <span>字符数: ${chars}</span>
                <span>大小: ${formatBytes(size)}</span>
            </div>
        `;

        statusBar.innerHTML = statusBar.innerHTML + statsHtml;
    }

    // 格式化字节大小
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 显示复制通知
    function showCopyNotification() {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = '已复制到剪贴板 ✓';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    formatBtn.click();
                    break;
                case 'k':
                    e.preventDefault();
                    clearBtn.click();
                    break;
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        copyBtn.click();
                    }
                    break;
            }
        }
    });

    // 自动验证输入
    jsonInput.on('change', function() {
        const input = jsonInput.getValue().trim();
        // 跳过占位符文本的验证
        if (input && input !== '// 请输入JSON5数据...' && !isPlaceholderActive) {
            try {
                JSON5.parse(input);
                jsonInput.getWrapperElement().classList.add('json-valid');
                jsonInput.getWrapperElement().classList.remove('json-invalid');
            } catch (error) {
                jsonInput.getWrapperElement().classList.add('json-invalid');
                jsonInput.getWrapperElement().classList.remove('json-valid');
            }
        } else {
            jsonInput.getWrapperElement().classList.remove('json-valid', 'json-invalid');
        }
    });

    // 启用折叠选项变化时显示/隐藏折叠控制
    enableCollapse.addEventListener('change', function() {
        collapseControls.style.display = this.checked ? 'flex' : 'none';
        if (currentJson) {
            formatBtn.click();
        }
    });

    // 全部折叠
    collapseAllBtn.addEventListener('click', function() {
        if (currentJson && enableCollapse.checked) {
            foldAll();
        }
    });

    // 全部展开
    expandAllBtn.addEventListener('click', function() {
        if (currentJson && enableCollapse.checked) {
            unfoldAll();
        }
    });

    // 按级别折叠
    collapseLevel.addEventListener('change', function() {
        if (currentJson && enableCollapse.checked) {
            unfoldAll(); // 先展开所有
            const level = parseInt(this.value);
            if (level > 0) {
                setTimeout(() => foldByLevel(level), 50);
            }
        }
    });

    // 选项变化时重新格式化
    [sortKeys, indentSize].forEach(element => {
        element.addEventListener('change', function() {
            if (currentJson) {
                formatBtn.click();
            }
        });
    });

    // 行号显示选项变化
    showLineNumbers.addEventListener('change', function() {
        jsonOutput.setOption('lineNumbers', this.checked);
    });

    // 初始化行号显示状态
    jsonOutput.setOption('lineNumbers', showLineNumbers.checked);

    // 获取缩进值
    function getIndentValue() {
        const value = indentSize.value;
        return value === '\t' ? '\t' : parseInt(value);
    }

    // 递归排序对象键名
    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    // 显示可折叠的JSON
    function displayCollapsibleJson(obj) {
        // 移除可能存在的自定义折叠容器
        const wrapper = jsonOutput.getWrapperElement();
        const existingCollapsible = wrapper.parentElement.querySelector('.json-collapsible-container');
        if (existingCollapsible) {
            existingCollapsible.remove();
        }

        // 确保CodeMirror编辑器可见
        wrapper.style.display = 'block';

        // 格式化JSON并设置到CodeMirror
        const indentValue = getIndentValue();
        const formatted = JSON.stringify(obj, null, indentValue);
        jsonOutput.setValue(formatted);

        // 添加有效状态类
        jsonOutput.getWrapperElement().classList.add('json-valid');
        jsonOutput.getWrapperElement().classList.remove('json-invalid');

        // 计算最大深度用于折叠级别选项
        maxDepth = calculateMaxDepth(obj);
        updateCollapseLevelOptions();

        // 根据当前折叠级别设置自动折叠
        setTimeout(() => {
            const level = parseInt(collapseLevel.value);
            if (level > 0) {
                foldByLevel(level);
            }
        }, 100);
    }

    // 计算JSON对象的最大深度
    function calculateMaxDepth(obj, depth = 0) {
        if (Array.isArray(obj)) {
            if (obj.length === 0) return depth;
            return Math.max(...obj.map(item => calculateMaxDepth(item, depth + 1)));
        } else if (obj !== null && typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return depth;
            return Math.max(...keys.map(key => calculateMaxDepth(obj[key], depth + 1)));
        }
        return depth;
    }

    // 根据级别折叠
    function foldByLevel(level) {
        const doc = jsonOutput.getDoc();
        const lineCount = doc.lineCount();
        const indentValue = getIndentValue();
        const indentSize = typeof indentValue === 'number' ? indentValue : 4; // 制表符按4个空格计算

        for (let i = 0; i < lineCount; i++) {
            const line = doc.getLine(i);
            if (!line) continue;

            // 计算当前行的缩进级别
            const indentMatch = line.match(/^(\s*)/);
            if (!indentMatch) continue;

            const indentStr = indentMatch[1];
            let indentLevel;

            if (indentValue === '\t') {
                // 制表符缩进
                indentLevel = indentStr.length;
            } else {
                // 空格缩进
                indentLevel = Math.floor(indentStr.length / indentSize);
            }

            // 如果当前行的缩进级别等于指定级别，并且包含可折叠的结构
            if (indentLevel === level && (line.includes('{') || line.includes('['))) {
                const pos = CodeMirror.Pos(i, 0);
                jsonOutput.foldCode(pos);
            }
        }
    }

    // 全部折叠
    function foldAll() {
        CodeMirror.commands.foldAll(jsonOutput);
    }

    // 全部展开
    function unfoldAll() {
        CodeMirror.commands.unfoldAll(jsonOutput);
    }



    // 更新折叠级别选项
    function updateCollapseLevelOptions() {
        const currentValue = collapseLevel.value;
        collapseLevel.innerHTML = '';

        // 添加"不折叠"选项
        const noneOption = document.createElement('option');
        noneOption.value = '0';
        noneOption.textContent = '不折叠';
        if (currentValue === '0') {
            noneOption.selected = true;
        }
        collapseLevel.appendChild(noneOption);

        // 添加各级别选项
        for (let i = 1; i <= Math.max(maxDepth, 5); i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = `${i}级`;
            if (i.toString() === currentValue) {
                option.selected = true;
            }
            collapseLevel.appendChild(option);
        }
    }

    // 测试数据
    const testData = {
        simple: {
            "name": "张三",
            "age": 25,
            "city": "北京",
            "isActive": true
        },
        json5: {
            // JSON5支持注释
            name: "李四", // 支持无引号的键名
            age: 30,
            hobbies: [
                "编程",
                "阅读",
                "旅行", // 支持尾随逗号
            ],
            config: {
                debug: true,
                timeout: 5000,
                features: [
                    "comments",
                    "trailing-commas",
                    "unquoted-keys",
                ], // 尾随逗号
            }, // 尾随逗号
        },
        complex: {
            "id": 12345,
            "user": {
                "name": "李四",
                "email": "lisi@example.com",
                "profile": {
                    "avatar": "https://example.com/avatar.jpg",
                    "bio": "全栈开发工程师",
                    "skills": ["JavaScript", "Python", "React", "Node.js"],
                    "experience": {
                        "years": 5,
                        "companies": [
                            {"name": "科技公司A", "duration": "2年"},
                            {"name": "互联网公司B", "duration": "3年"}
                        ]
                    }
                },
                "settings": {
                    "theme": "dark",
                    "notifications": true,
                    "privacy": {
                        "showEmail": false,
                        "showPhone": true
                    }
                }
            },
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {
                "version": "1.0.0",
                "source": "api"
            }
        },
        array: [
            {
                "id": 1,
                "title": "学习JavaScript",
                "completed": true,
                "priority": "high",
                "tags": ["编程", "前端"]
            },
            {
                "id": 2,
                "title": "完成项目文档",
                "completed": false,
                "priority": "medium",
                "tags": ["文档", "项目管理"]
            },
            {
                "id": 3,
                "title": "代码审查",
                "completed": false,
                "priority": "low",
                "tags": ["代码质量", "团队协作"]
            }
        ],
        nested: {
            "company": {
                "name": "科技创新有限公司",
                "departments": {
                    "engineering": {
                        "name": "工程部",
                        "teams": {
                            "frontend": {
                                "name": "前端团队",
                                "members": [
                                    {
                                        "name": "王五",
                                        "role": "高级前端工程师",
                                        "projects": {
                                            "current": {
                                                "name": "用户管理系统",
                                                "status": "进行中",
                                                "features": {
                                                    "authentication": {
                                                        "status": "完成",
                                                        "methods": ["OAuth", "JWT"]
                                                    },
                                                    "dashboard": {
                                                        "status": "开发中",
                                                        "components": ["图表", "表格", "筛选器"]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            "backend": {
                                "name": "后端团队",
                                "members": [
                                    {
                                        "name": "赵六",
                                        "role": "后端架构师",
                                        "specialties": ["微服务", "数据库设计", "API设计"]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    };

    // 测试数据按钮事件监听器
    testSimpleBtn.addEventListener('click', function() {
        loadTestData('simple');
    });

    testJson5Btn.addEventListener('click', function() {
        loadTestData('json5');
    });

    testComplexBtn.addEventListener('click', function() {
        loadTestData('complex');
    });

    testArrayBtn.addEventListener('click', function() {
        loadTestData('array');
    });

    testNestedBtn.addEventListener('click', function() {
        loadTestData('nested');
    });

    // 加载测试数据函数
    function loadTestData(type) {
        const data = testData[type];
        if (data) {
            isPlaceholderActive = false;
            jsonInput.setValue(JSON.stringify(data, null, 2));
            showStatus(`已加载${getTestDataName(type)}测试数据`, 'success');
        }
    }

    // 获取测试数据名称
    function getTestDataName(type) {
        const names = {
            'simple': '简单对象',
            'json5': 'JSON5语法',
            'complex': '复杂数据',
            'array': '数组数据',
            'nested': '嵌套结构'
        };
        return names[type] || type;
    }
});
