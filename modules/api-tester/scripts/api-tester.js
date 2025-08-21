/**
 * API测试工具 - 简易版Postman
 * 支持多种HTTP方法、请求配置和响应查看
 */
class ApiTester {
    constructor() {
        this.bodyEditor = null;
        this.responseEditor = null;
        this.wsMessageEditor = null;
        this.websocket = null;
        this.wsMessageHistory = [];
        this.currentRequest = {
            method: 'GET',
            url: '',
            params: [],
            headers: [],
            body: '',
            bodyType: 'none',
            auth: { type: 'none' }
        };
        
        // 当前响应数据
        this.currentResponse = {
            status: null,
            statusText: '',
            headers: {},
            data: null,
            responseTime: 0,
            size: 0
        };
        
        this.initializeElements();
        this.initializeEditors();
        this.bindEvents();
        this.parseUrlParams(); // 初始化时解析URL参数
        this.initializeResponseInfo(); // 初始化响应信息显示
        this.showStatus('API测试工具已就绪', 'info');
    }

    initializeElements() {
        // 请求配置元素
        this.methodSelect = document.getElementById('methodSelect');
        this.urlInput = document.getElementById('urlInput');
        this.sendBtn = document.getElementById('sendBtn');
        
        // 选项卡元素
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // 参数相关元素
        this.paramsList = document.getElementById('paramsList');
        this.addParamBtn = document.getElementById('addParamBtn');
        
        // 请求头相关元素
        this.headersList = document.getElementById('headersList');
        this.addHeaderBtn = document.getElementById('addHeaderBtn');
        
        // 请求体相关元素
        this.bodyTypeRadios = document.querySelectorAll('input[name="bodyType"]');
        this.formDataContainer = document.getElementById('formDataContainer');
        this.formDataList = document.getElementById('formDataList');
        this.addFormDataBtn = document.getElementById('addFormDataBtn');
        
        // 认证相关元素
        this.authTypeRadios = document.querySelectorAll('input[name="authType"]');
        this.authConfig = document.getElementById('authConfig');
        
        // 响应相关元素
        this.responseStatus = document.getElementById('responseStatus');
        this.responseTime = document.getElementById('responseTime');
        this.responseSize = document.getElementById('responseSize');
        this.responseTabBtns = document.querySelectorAll('.response-tab-btn');
        this.responseTabContents = document.querySelectorAll('.response-tab-content');
        this.formatResponseBtn = document.getElementById('formatResponseBtn');
        this.copyResponseBtn = document.getElementById('copyResponseBtn');
        this.responseViewMode = document.getElementById('responseViewMode');
        this.responseHeaders = document.getElementById('responseHeaders');
        
        // 状态栏
        this.statusBar = document.getElementById('statusBar');
        this.statusText = document.getElementById('statusText');
        
        // 测试用例弹窗相关元素
        this.showTestCasesBtn = document.getElementById('showTestCasesBtn');
        this.testCasesModal = document.getElementById('testCasesModal');
        this.modalCloseBtn = this.testCasesModal.querySelector('.close');
        
        // WebSocket相关元素
        this.wsUrlInput = document.getElementById('wsUrlInput');
        this.wsConnectBtn = document.getElementById('wsConnectBtn');
        this.wsDisconnectBtn = document.getElementById('wsDisconnectBtn');
        this.wsStatus = document.getElementById('wsStatus');
        this.wsSendBtn = document.getElementById('wsSendBtn');
        this.wsClearBtn = document.getElementById('wsClearBtn');
        
        // 响应区域的WebSocket消息历史元素
        this.responseWsMessageHistory = document.getElementById('responseWsMessageHistory');
        this.responseAutoScrollCheckbox = document.getElementById('responseAutoScrollCheckbox');
        this.websocketMessagesTab = document.querySelector('[data-tab="websocket-messages"]');
    }

    initializeEditors() {
        // 初始化请求体编辑器
        const bodyEditorElement = document.getElementById('bodyEditor');
        this.bodyEditor = CodeMirror(bodyEditorElement, {
            mode: 'application/json',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            placeholder: '请输入请求体内容...',
            value: ''
        });
        
        // 初始化响应体编辑器
        const responseBodyElement = document.getElementById('responseBody');
        this.responseEditor = CodeMirror(responseBodyElement, {
            mode: 'application/json',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            value: ''
        });
        
        // 初始化WebSocket消息编辑器
        const wsMessageEditorElement = document.getElementById('wsMessageEditor');
        this.wsMessageEditor = CodeMirror(wsMessageEditorElement, {
            mode: 'application/json',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            placeholder: '输入要发送的消息...',
            value: ''
        });
    }

    bindEvents() {
        // 发送请求按钮
        this.sendBtn.addEventListener('click', () => this.sendRequest());
        
        // URL输入框回车发送
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendRequest();
            }
        });
        
        // 选项卡切换
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // 响应选项卡切换
        this.responseTabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchResponseTab(btn.dataset.tab));
        });
        
        // 添加参数
        this.addParamBtn.addEventListener('click', () => this.addParamRow());
        
        // 添加请求头
        this.addHeaderBtn.addEventListener('click', () => this.addHeaderRow());
        
        // 添加表单数据
        this.addFormDataBtn.addEventListener('click', () => this.addFormDataRow());
        
        // 请求体类型切换
        this.bodyTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleBodyTypeChange());
        });
        
        // 认证类型切换
        this.authTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleAuthTypeChange());
        });
        
        // 响应操作按钮
        this.formatResponseBtn.addEventListener('click', () => this.formatResponse());
        this.copyResponseBtn.addEventListener('click', () => this.copyResponse());
        this.responseViewMode.addEventListener('change', () => this.changeResponseViewMode());
        
        // 删除按钮事件委托
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                e.target.closest('.param-row, .header-row, .form-data-row').remove();
            }
        });
        
        // WebSocket事件绑定
        this.wsConnectBtn.addEventListener('click', () => this.connectWebSocket());
        this.wsDisconnectBtn.addEventListener('click', () => this.disconnectWebSocket());
        this.wsSendBtn.addEventListener('click', () => this.sendWebSocketMessage());
        this.wsClearBtn.addEventListener('click', () => this.clearMessageHistory());
        
        // WebSocket消息编辑器回车发送
        this.wsMessageEditor.on('keydown', (cm, event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                this.sendWebSocketMessage();
            }
        });
        
        // 测试用例弹窗事件绑定
        this.showTestCasesBtn.addEventListener('click', () => this.showTestCasesModal());
        this.modalCloseBtn.addEventListener('click', () => this.hideTestCasesModal());
        this.testCasesModal.addEventListener('click', (e) => {
            if (e.target === this.testCasesModal) {
                this.hideTestCasesModal();
            }
        });
        
        // URL输入框变化时解析参数
        this.urlInput.addEventListener('input', () => this.parseUrlParams());
        
        // 测试用例事件绑定
        this.bindTestCaseEvents();
    }

    switchTab(tabName) {
        // 更新选项卡按钮状态
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // 更新选项卡内容显示
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
        
        // 根据选项卡类型显示/隐藏WebSocket消息选项卡
        if (tabName === 'websocket') {
            this.websocketMessagesTab.style.display = 'block';
            // 自动切换到WebSocket消息选项卡
            this.switchResponseTab('websocket-messages');
        } else {
            this.websocketMessagesTab.style.display = 'none';
            // 如果当前显示的是WebSocket消息选项卡，则切换到响应体
            const activeResponseTab = document.querySelector('.response-tab-btn.active');
            if (activeResponseTab && activeResponseTab.dataset.tab === 'websocket-messages') {
                this.switchResponseTab('response-body');
            }
        }
    }

    addParamRow(key = '', value = '') {
        const row = document.createElement('div');
        row.className = 'param-row';
        row.innerHTML = `
            <input type="text" placeholder="参数名" value="${key}" class="param-key">
            <input type="text" placeholder="参数值" value="${value}" class="param-value">
            <button class="remove-btn">×</button>
        `;
        this.paramsList.appendChild(row);
    }

    switchResponseTab(tabName) {
        // 更新响应选项卡按钮状态
        this.responseTabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // 构建正确的内容容器ID
        let contentId;
        if (tabName === 'response-body') {
            contentId = 'responseBodyTab';
        } else if (tabName === 'response-headers') {
            contentId = 'responseHeadersTab';
        } else if (tabName === 'websocket-messages') {
            contentId = 'websocketMessagesTab';
        }
        
        // 更新响应选项卡内容显示
        this.responseTabContents.forEach(content => {
            content.classList.toggle('active', content.id === contentId);
        });
        
        // 如果有保存的响应数据，重新显示对应内容
        if (this.currentResponse.status !== null) {
            if (tabName === 'response-body') {
                // 重新显示响应体
                let responseText = '';
                if (typeof this.currentResponse.data === 'object') {
                    responseText = JSON.stringify(this.currentResponse.data, null, 2);
                    this.responseEditor.setOption('mode', 'application/json');
                } else {
                    responseText = this.currentResponse.data;
                    this.responseEditor.setOption('mode', 'text/plain');
                }
                this.responseEditor.setValue(responseText);
                // 刷新编辑器显示
                setTimeout(() => this.responseEditor.refresh(), 10);
            } else if (tabName === 'response-headers') {
                // 重新显示响应头
                this.displayResponseHeaders(this.currentResponse.headers);
            }
        }
    }



    addHeaderRow() {
        const row = document.createElement('div');
        row.className = 'header-row';
        row.innerHTML = `
            <input type="text" placeholder="请求头名称" class="header-key">
            <input type="text" placeholder="请求头值" class="header-value">
            <button class="remove-btn">×</button>
        `;
        this.headersList.appendChild(row);
    }

    addFormDataRow() {
        const row = document.createElement('div');
        row.className = 'form-data-row';
        row.innerHTML = `
            <input type="text" placeholder="字段名" class="form-key">
            <input type="text" placeholder="字段值" class="form-value">
            <button class="remove-btn">×</button>
        `;
        this.formDataList.appendChild(row);
    }

    handleBodyTypeChange() {
        const selectedType = document.querySelector('input[name="bodyType"]:checked').value;
        
        if (selectedType === 'form') {
            this.formDataContainer.style.display = 'block';
            this.bodyEditor.getWrapperElement().style.display = 'none';
        } else {
            this.formDataContainer.style.display = 'none';
            this.bodyEditor.getWrapperElement().style.display = 'block';
            
            // 设置编辑器模式
            let mode = 'text/plain';
            switch (selectedType) {
                case 'json':
                    mode = 'application/json';
                    break;
                case 'text':
                    mode = 'text/plain';
                    break;
            }
            this.bodyEditor.setOption('mode', mode);
        }
        
        if (selectedType === 'none') {
            this.bodyEditor.getWrapperElement().style.display = 'none';
        }
    }

    handleAuthTypeChange() {
        const selectedType = document.querySelector('input[name="authType"]:checked').value;
        
        let configHtml = '';
        switch (selectedType) {
            case 'bearer':
                configHtml = `
                    <div class="auth-field">
                        <label>Bearer Token:</label>
                        <input type="text" id="bearerToken" placeholder="输入Bearer Token">
                    </div>
                `;
                break;
            case 'basic':
                configHtml = `
                    <div class="auth-field">
                        <label>用户名:</label>
                        <input type="text" id="basicUsername" placeholder="输入用户名">
                    </div>
                    <div class="auth-field">
                        <label>密码:</label>
                        <input type="password" id="basicPassword" placeholder="输入密码">
                    </div>
                `;
                break;
            case 'apikey':
                configHtml = `
                    <div class="auth-field">
                        <label>API Key名称:</label>
                        <input type="text" id="apiKeyName" placeholder="例如: X-API-Key">
                    </div>
                    <div class="auth-field">
                        <label>API Key值:</label>
                        <input type="text" id="apiKeyValue" placeholder="输入API Key">
                    </div>
                `;
                break;
        }
        
        this.authConfig.innerHTML = configHtml;
    }

    collectRequestData() {
        // 收集基本信息
        this.currentRequest.method = this.methodSelect.value;
        this.currentRequest.url = this.urlInput.value.trim();
        
        // 收集参数
        this.currentRequest.params = [];
        const paramRows = this.paramsList.querySelectorAll('.param-row');
        paramRows.forEach(row => {
            const key = row.querySelector('.param-key').value.trim();
            const value = row.querySelector('.param-value').value.trim();
            if (key) {
                this.currentRequest.params.push({ key, value });
            }
        });
        
        // 收集请求头
        this.currentRequest.headers = [];
        const headerRows = this.headersList.querySelectorAll('.header-row');
        headerRows.forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key) {
                this.currentRequest.headers.push({ key, value });
            }
        });
        
        // 收集请求体
        const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
        this.currentRequest.bodyType = bodyType;
        
        if (bodyType === 'form') {
            const formData = [];
            const formRows = this.formDataList.querySelectorAll('.form-data-row');
            formRows.forEach(row => {
                const key = row.querySelector('.form-key').value.trim();
                const value = row.querySelector('.form-value').value.trim();
                if (key) {
                    formData.push({ key, value });
                }
            });
            this.currentRequest.body = formData;
        } else if (bodyType !== 'none') {
            this.currentRequest.body = this.bodyEditor.getValue();
        } else {
            this.currentRequest.body = '';
        }
        
        // 收集认证信息
        const authType = document.querySelector('input[name="authType"]:checked').value;
        this.currentRequest.auth = { type: authType };
        
        switch (authType) {
            case 'bearer':
                const bearerToken = document.getElementById('bearerToken');
                if (bearerToken) {
                    this.currentRequest.auth.token = bearerToken.value.trim();
                }
                break;
            case 'basic':
                const username = document.getElementById('basicUsername');
                const password = document.getElementById('basicPassword');
                if (username && password) {
                    this.currentRequest.auth.username = username.value.trim();
                    this.currentRequest.auth.password = password.value.trim();
                }
                break;
            case 'apikey':
                const keyName = document.getElementById('apiKeyName');
                const keyValue = document.getElementById('apiKeyValue');
                if (keyName && keyValue) {
                    this.currentRequest.auth.keyName = keyName.value.trim();
                    this.currentRequest.auth.keyValue = keyValue.value.trim();
                }
                break;
        }
    }

    async sendRequest() {
        this.collectRequestData();
        
        if (!this.currentRequest.url) {
            this.showStatus('请输入API地址', 'error');
            return;
        }
        
        // 构建完整URL
        let fullUrl = this.currentRequest.url;
        if (this.currentRequest.params.length > 0) {
            const params = new URLSearchParams();
            this.currentRequest.params.forEach(param => {
                if (param.key && param.value) {
                    params.append(param.key, param.value);
                }
            });
            const separator = fullUrl.includes('?') ? '&' : '?';
            fullUrl += separator + params.toString();
        }
        
        // 构建请求配置
        const requestConfig = {
            method: this.currentRequest.method,
            headers: {}
        };
        
        // 添加请求头
        this.currentRequest.headers.forEach(header => {
            if (header.key && header.value) {
                requestConfig.headers[header.key] = header.value;
            }
        });
        
        // 添加认证
        if (this.currentRequest.auth.type === 'bearer' && this.currentRequest.auth.token) {
            requestConfig.headers['Authorization'] = `Bearer ${this.currentRequest.auth.token}`;
        } else if (this.currentRequest.auth.type === 'basic' && this.currentRequest.auth.username) {
            const credentials = btoa(`${this.currentRequest.auth.username}:${this.currentRequest.auth.password || ''}`);
            requestConfig.headers['Authorization'] = `Basic ${credentials}`;
        } else if (this.currentRequest.auth.type === 'apikey' && this.currentRequest.auth.keyName && this.currentRequest.auth.keyValue) {
            requestConfig.headers[this.currentRequest.auth.keyName] = this.currentRequest.auth.keyValue;
        }
        
        // 添加请求体
        if (this.currentRequest.method !== 'GET' && this.currentRequest.method !== 'HEAD') {
            if (this.currentRequest.bodyType === 'json' && this.currentRequest.body) {
                requestConfig.headers['Content-Type'] = 'application/json';
                requestConfig.body = this.currentRequest.body;
            } else if (this.currentRequest.bodyType === 'form' && Array.isArray(this.currentRequest.body)) {
                const formData = new FormData();
                this.currentRequest.body.forEach(item => {
                    if (item.key && item.value) {
                        formData.append(item.key, item.value);
                    }
                });
                requestConfig.body = formData;
            } else if (this.currentRequest.bodyType === 'text' && this.currentRequest.body) {
                requestConfig.headers['Content-Type'] = 'text/plain';
                requestConfig.body = this.currentRequest.body;
            }
        }
        
        // 显示加载状态
        this.sendBtn.classList.add('loading');
        this.sendBtn.disabled = true;
        this.showStatus('正在发送请求...', 'info');
        
        const startTime = Date.now();
        
        try {
            const response = await fetch(fullUrl, requestConfig);
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // 获取响应头
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            
            // 获取响应体
            const responseText = await response.text();
            let responseData = responseText;
            
            // 尝试解析JSON
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                // 不是JSON格式，保持原文本
            }
            
            // 显示响应结果
            this.displayResponse({
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                data: responseData,
                responseTime: responseTime,
                size: new Blob([responseText]).size
            });
            
            this.showStatus(`请求完成 - ${response.status} ${response.statusText}`, response.ok ? 'success' : 'error');
            
        } catch (error) {
            this.showStatus(`请求失败: ${error.message}`, 'error');
            this.displayError(error);
        } finally {
            this.sendBtn.classList.remove('loading');
            this.sendBtn.disabled = false;
        }
    }

    displayResponse(response) {
        // 保存响应数据
        this.currentResponse = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            responseTime: response.responseTime,
            size: response.size
        };
        
        // 显示状态信息
        this.responseStatus.textContent = `${response.status} ${response.statusText}`;
        this.responseStatus.className = 'response-status ' + (response.status < 400 ? 'success' : 'error');
        
        this.responseTime.textContent = `${response.responseTime}ms`;
        this.responseSize.textContent = this.formatBytes(response.size);
        
        // 显示响应体
        let responseText = '';
        if (typeof response.data === 'object') {
            responseText = JSON.stringify(response.data, null, 2);
            this.responseEditor.setOption('mode', 'application/json');
        } else {
            responseText = response.data;
            this.responseEditor.setOption('mode', 'text/plain');
        }
        
        this.responseEditor.setValue(responseText);
        // 刷新编辑器以确保正确显示
        setTimeout(() => this.responseEditor.refresh(), 10);
        
        // 显示响应头
        this.displayResponseHeaders(response.headers);
        
        // 确保默认显示响应体选项卡
        this.switchResponseTab('response-body');
    }

    displayResponseHeaders(headers) {
        let headersHtml = '';
        Object.entries(headers).forEach(([key, value]) => {
            headersHtml += `
                <div class="header-item">
                    <span class="header-name">${key}:</span>
                    <span class="header-value">${value}</span>
                </div>
            `;
        });
        
        this.responseHeaders.innerHTML = headersHtml || '<p>无响应头</p>';
    }

    displayError(error) {
        this.responseStatus.textContent = 'Error';
        this.responseStatus.className = 'response-status error';
        this.responseTime.textContent = '-';
        this.responseSize.textContent = '-';
        
        this.responseEditor.setValue(`Error: ${error.message}`);
        this.responseEditor.setOption('mode', 'text/plain');
        
        this.responseHeaders.innerHTML = '<p>请求失败，无响应头</p>';
    }

    formatResponse() {
        try {
            const content = this.responseEditor.getValue();
            const parsed = JSON.parse(content);
            const formatted = JSON.stringify(parsed, null, 2);
            this.responseEditor.setValue(formatted);
            this.showStatus('响应已格式化', 'success');
        } catch (error) {
            this.showStatus('无法格式化响应内容', 'error');
        }
    }

    copyResponse() {
        const content = this.responseEditor.getValue();
        navigator.clipboard.writeText(content).then(() => {
            this.showStatus('响应内容已复制到剪贴板', 'success');
        }).catch(() => {
            this.showStatus('复制失败', 'error');
        });
    }

    changeResponseViewMode() {
        const mode = this.responseViewMode.value;
        let codeMirrorMode = 'text/plain';
        
        switch (mode) {
            case 'json':
                codeMirrorMode = 'application/json';
                break;
            case 'html':
                codeMirrorMode = 'text/html';
                break;
            case 'xml':
                codeMirrorMode = 'application/xml';
                break;
            case 'text':
            default:
                codeMirrorMode = 'text/plain';
                break;
        }
        
        this.responseEditor.setOption('mode', codeMirrorMode);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showStatus(message, type = 'info') {
        this.statusText.textContent = message;
        this.statusText.className = type;
        
        // 自动清除状态消息
        setTimeout(() => {
            if (this.statusText.textContent === message) {
                this.statusText.textContent = '就绪';
                this.statusText.className = '';
            }
        }, 5000);
    }

    // WebSocket相关方法
    connectWebSocket() {
        const url = this.wsUrlInput.value.trim();
        if (!url) {
            this.showStatus('请输入WebSocket地址', 'error');
            return;
        }
        
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.showStatus('WebSocket已连接', 'info');
            return;
        }
        
        try {
            this.updateWebSocketStatus('connecting');
            this.showStatus('正在连接WebSocket...', 'info');
            
            this.websocket = new WebSocket(url);
            
            this.websocket.onopen = (event) => {
                this.updateWebSocketStatus('connected');
                this.addMessageToHistory('system', '连接成功', `已连接到 ${url}`);
                this.showStatus('WebSocket连接成功', 'success');
            };
            
            this.websocket.onmessage = (event) => {
                this.addMessageToHistory('received', '收到消息', event.data);
            };
            
            this.websocket.onclose = (event) => {
                this.updateWebSocketStatus('disconnected');
                const reason = event.wasClean ? '正常关闭' : '连接中断';
                this.addMessageToHistory('system', '连接关闭', `${reason} (代码: ${event.code})`);
                this.showStatus(`WebSocket连接已关闭: ${reason}`, 'info');
            };
            
            this.websocket.onerror = (event) => {
                this.updateWebSocketStatus('disconnected');
                this.addMessageToHistory('error', '连接错误', '连接发生错误');
                this.showStatus('WebSocket连接错误', 'error');
            };
            
        } catch (error) {
            this.updateWebSocketStatus('disconnected');
            this.addMessageToHistory('error', '连接失败', error.message);
            this.showStatus(`连接失败: ${error.message}`, 'error');
        }
    }

    disconnectWebSocket() {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.close(1000, '用户主动断开');
            this.addMessageToHistory('system', '主动断开', '用户主动断开连接');
        } else {
            this.showStatus('WebSocket未连接', 'info');
        }
    }

    sendWebSocketMessage() {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            this.showStatus('WebSocket未连接，无法发送消息', 'error');
            return;
        }
        
        const message = this.wsMessageEditor.getValue().trim();
        if (!message) {
            this.showStatus('请输入要发送的消息', 'error');
            return;
        }
        
        try {
            this.websocket.send(message);
            this.addMessageToHistory('sent', '发送消息', message);
            this.wsMessageEditor.setValue('');
            this.showStatus('消息发送成功', 'success');
        } catch (error) {
            this.addMessageToHistory('error', '发送失败', error.message);
            this.showStatus(`发送失败: ${error.message}`, 'error');
        }
    }

    updateWebSocketStatus(status) {
        this.wsStatus.className = `ws-status ${status}`;
        
        switch (status) {
            case 'connected':
                this.wsStatus.textContent = '已连接';
                this.wsConnectBtn.disabled = true;
                this.wsDisconnectBtn.disabled = false;
                this.wsSendBtn.disabled = false;
                break;
            case 'connecting':
                this.wsStatus.textContent = '连接中';
                this.wsConnectBtn.disabled = true;
                this.wsDisconnectBtn.disabled = true;
                this.wsSendBtn.disabled = true;
                break;
            case 'disconnected':
            default:
                this.wsStatus.textContent = '未连接';
                this.wsConnectBtn.disabled = false;
                this.wsDisconnectBtn.disabled = true;
                this.wsSendBtn.disabled = true;
                break;
        }
    }

    addMessageToHistory(type, title, content) {
        const timestamp = new Date().toLocaleTimeString();
        const messageItem = {
            type,
            title,
            content,
            timestamp
        };
        
        this.wsMessageHistory.push(messageItem);
        
        // 创建消息元素HTML
        const messageHtml = `
            <div class="ws-message-header">
                <span class="ws-message-type">${title}</span>
                <span class="ws-message-time">${timestamp}</span>
            </div>
            <div class="ws-message-content">${this.escapeHtml(content)}</div>
        `;
        
        // 添加到响应区域的WebSocket消息历史
        const responseMessageElement = document.createElement('div');
        responseMessageElement.className = `ws-message-item ${type}`;
        responseMessageElement.innerHTML = messageHtml;
        this.responseWsMessageHistory.appendChild(responseMessageElement);
        
        // 自动滚动到底部（响应区域）
        if (this.responseAutoScrollCheckbox.checked) {
            this.responseWsMessageHistory.scrollTop = this.responseWsMessageHistory.scrollHeight;
        }
    }

    clearMessageHistory() {
        this.wsMessageHistory = [];
        this.responseWsMessageHistory.innerHTML = '';
        this.showStatus('消息历史已清空', 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 测试用例相关方法
    bindTestCaseEvents() {
        // 测试用例选项卡切换
        const testCaseTabs = document.querySelectorAll('.test-case-tab');
        testCaseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const type = tab.dataset.type;
                this.switchTestCaseTab(type);
            });
        });
        
        // HTTP测试用例点击事件
        const httpTestCases = document.querySelectorAll('.test-case');
        httpTestCases.forEach(testCase => {
            testCase.addEventListener('click', () => {
                this.applyHttpTestCase(testCase);
                this.hideTestCasesModal(); // 应用测试用例后关闭弹窗
            });
        });
        
        // WebSocket测试用例点击事件
        const wsTestCases = document.querySelectorAll('.ws-test-case');
        wsTestCases.forEach(testCase => {
            testCase.addEventListener('click', () => {
                this.applyWebSocketTestCase(testCase);
                this.hideTestCasesModal(); // 应用测试用例后关闭弹窗
            });
        });
    }
    
    switchTestCaseTab(type) {
        // 更新选项卡状态
        document.querySelectorAll('.test-case-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === type);
        });
        
        // 更新内容显示
        document.querySelectorAll('.test-case-group').forEach(group => {
            group.classList.toggle('active', group.id === type + 'TestCases');
        });
    }
    
    applyHttpTestCase(testCase) {
        const method = testCase.dataset.method;
        const url = testCase.dataset.url;
        const body = testCase.dataset.body;
        const headers = testCase.dataset.headers;
        
        // 切换到HTTP选项卡
        this.switchTab('request');
        
        // 设置请求方法
        this.methodSelect.value = method;
        
        // 设置URL
        this.urlInput.value = url;
        
        // 清空现有参数和请求头
        this.clearParams();
        this.clearHeaders();
        
        // 设置请求头
        if (headers) {
            try {
                const headerList = JSON.parse(headers);
                headerList.forEach(header => {
                    this.addHeaderRow(header.key, header.value);
                });
            } catch (e) {
                console.warn('解析请求头失败:', e);
            }
        }
        
        // 设置请求体
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            this.switchTab('body');
            this.bodyEditor.setValue(body);
        }
        
        // 显示成功消息
        this.showStatus('已应用测试用例: ' + testCase.querySelector('.test-case-title').textContent, 'success');
    }
    
    applyWebSocketTestCase(testCase) {
        const url = testCase.dataset.url;
        const message = testCase.dataset.message;
        
        // 切换到WebSocket选项卡
        this.switchTab('websocket');
        
        // 设置WebSocket URL
        this.wsUrlInput.value = url;
        
        // 设置消息内容
        if (message) {
            this.wsMessageEditor.setValue(message);
        }
        
        // 切换到WebSocket消息选项卡以显示消息历史
        this.switchResponseTab('websocket-messages');
        
        // 显示成功消息
        this.showStatus('已应用WebSocket测试用例: ' + testCase.querySelector('.test-case-title').textContent, 'success');
    }
    
    clearParams() {
        const paramRows = document.querySelectorAll('#paramsList .param-row');
        paramRows.forEach(row => row.remove());
        this.addParamRow(); // 添加一个空行
    }
    
    clearHeaders() {
        const headerRows = document.querySelectorAll('#headersList .header-row');
        headerRows.forEach(row => row.remove());
        this.addHeaderRow(); // 添加一个空行
    }
    
    addHeaderRow(key = '', value = '') {
        const headersList = document.getElementById('headersList');
        const row = document.createElement('div');
        row.className = 'header-row';
        row.innerHTML = `
            <input type="text" placeholder="请求头名称" value="${key}" class="header-key">
            <input type="text" placeholder="请求头值" value="${value}" class="header-value">
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        `;
        headersList.appendChild(row);
    }
    
    // 显示测试用例弹窗
    showTestCasesModal() {
        this.testCasesModal.style.display = 'block';
    }
    
    // 隐藏测试用例弹窗
    hideTestCasesModal() {
        this.testCasesModal.style.display = 'none';
    }
    
    // 解析URL参数
    parseUrlParams() {
        const url = this.urlInput.value.trim();
        if (!url) return;
        
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            
            // 清空现有参数
            this.clearParams();
            
            // 添加URL中的参数
            for (const [key, value] of params) {
                this.addParamRow(key, value);
            }
            
            // 更新URL输入框为不带参数的URL
            const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
            if (this.urlInput.value !== baseUrl && params.size > 0) {
                this.urlInput.value = baseUrl;
            }
        } catch (error) {
            // URL格式不正确时不处理
        }
    }
    
    // 初始化响应信息显示
    initializeResponseInfo() {
        this.responseStatus.textContent = '等待请求';
        this.responseStatus.className = 'response-status';
        this.responseTime.textContent = '0ms';
        this.responseSize.textContent = '0B';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ApiTester();
});