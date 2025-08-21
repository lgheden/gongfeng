document.addEventListener('DOMContentLoaded', function() {
    // 检查crypto-js库加载状态
    console.log('CryptoJS available:', typeof CryptoJS !== 'undefined');
    if (typeof CryptoJS !== 'undefined') {
        console.log('CryptoJS methods:', {
            MD5: typeof CryptoJS.MD5,
            SHA1: typeof CryptoJS.SHA1,
            SHA256: typeof CryptoJS.SHA256
        });
    }
    
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    // const encodingType = document.getElementById('encodingType'); // 旧的select元素
    const encodingTypeRadios = document.querySelectorAll('input[name="encodingType"]');
    const statusBar = document.getElementById('statusBar');
    
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const swapBtn = document.getElementById('swapBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    const actionButtons = document.querySelectorAll('.action-btn');
    const exampleButtons = document.querySelectorAll('.example-btn');
    
    const inputLength = document.getElementById('inputLength');
    const inputBytes = document.getElementById('inputBytes');
    const outputLength = document.getElementById('outputLength');
    const outputBytes = document.getElementById('outputBytes');
    const currentModeText = document.getElementById('currentModeText');
    
    let currentMode = 'encode';
    
    // 初始化
    updateTextStats();
    updateButtonStates();
    
    // 编码按钮
    encodeBtn.addEventListener('click', function() {
        currentMode = 'encode';
        updateButtonStates();
        performOperation();
    });
    
    // 解码按钮
    decodeBtn.addEventListener('click', function() {
        currentMode = 'decode';
        updateButtonStates();
        performOperation();
    });
    
    // 清空按钮
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
        statusBar.textContent = '';
        statusBar.className = 'status-bar';
        updateTextStats();
    });
    
    // 交换按钮
    swapBtn.addEventListener('click', function() {
        const temp = inputText.value;
        inputText.value = outputText.value;
        outputText.value = temp;
        updateTextStats();
        showStatus('已交换输入输出内容', 'info');
    });
    
    // 复制按钮
    copyBtn.addEventListener('click', function() {
        const output = outputText.value;
        if (!output) {
            showStatus('没有可复制的内容', 'error');
            return;
        }
        
        navigator.clipboard.writeText(output).then(function() {
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        }).catch(function() {
            // 降级方案
            outputText.select();
            document.execCommand('copy');
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        });
    });
    
    // 编码类型变化
    encodingTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateButtonStates();
            if (inputText.value.trim()) {
                performOperation();
            }
        });
    });
    
    // 输入文本变化
    inputText.addEventListener('input', function() {
        updateTextStats();
        if (this.value.trim()) {
            performOperation();
        } else {
            outputText.value = '';
            updateTextStats();
        }
    });
    
    // 快速操作按钮
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            performQuickAction(action);
        });
    });
    
    // 示例按钮
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            inputText.value = text;
            updateTextStats();
            showStatus('已加载示例数据', 'info');
            if (text.trim()) {
                performOperation();
            }
        });
    });
    
    // 获取当前选中的编码类型
    function getSelectedEncodingType() {
        const selectedRadio = document.querySelector('input[name="encodingType"]:checked');
        return selectedRadio ? selectedRadio.value : 'base64';
    }
    
    // 执行操作
    function performOperation() {
        const input = inputText.value;
        const type = getSelectedEncodingType();
        
        if (!input.trim()) {
            showStatus('请输入要处理的文本', 'error');
            return;
        }
        
        try {
            let result = '';
            
            if (currentMode === 'encode') {
                result = encode(input, type);
            } else {
                result = decode(input, type);
            }
            
            outputText.value = result;
            outputText.classList.add('output-success');
            outputText.classList.remove('output-error');
            
            updateTextStats();
            showStatus(`${currentMode === 'encode' ? '编码' : '解码'}成功`, 'success');            
        } catch (error) {
            outputText.value = '';
            outputText.classList.add('output-error');
            outputText.classList.remove('output-success');
            showStatus(`操作失败: ${error.message}`, 'error');
        }
    }
    
    // 编码函数
    function encode(text, type) {
        switch (type) {
            case 'base64':
                return btoa(unescape(encodeURIComponent(text)));
            case 'url':
                return encodeURIComponent(text);
            case 'html':
                return text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            case 'unicode':
                return text.split('').map(char => {
                    const code = char.charCodeAt(0);
                    return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : char;
                }).join('');
            case 'hex':
                return Array.from(new TextEncoder().encode(text))
                    .map(byte => byte.toString(16).padStart(2, '0'))
                    .join('');
            case 'binary':
                return Array.from(new TextEncoder().encode(text))
                    .map(byte => byte.toString(2).padStart(8, '0'))
                    .join(' ');
            case 'jwt':
                return createJWT(text);
            case 'md5':
                return md5(text);
            case 'sha1':
                return sha1(text);
            case 'sha256':
                return sha256(text);
            default:
                throw new Error('不支持的编码类型');
        }
    }
    
    // 解码函数
    function decode(text, type) {
        switch (type) {
            case 'base64':
                return decodeURIComponent(escape(atob(text)));
            case 'url':
                return decodeURIComponent(text);
            case 'html':
                return text
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
            case 'unicode':
                return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
                    return String.fromCharCode(parseInt(code, 16));
                });
            case 'hex':
                const hexBytes = text.replace(/\s/g, '').match(/.{1,2}/g) || [];
                const bytes = hexBytes.map(byte => parseInt(byte, 16));
                return new TextDecoder().decode(new Uint8Array(bytes));
            case 'binary':
                const binaryBytes = text.split(/\s+/).filter(b => b);
                const binBytes = binaryBytes.map(byte => parseInt(byte, 2));
                return new TextDecoder().decode(new Uint8Array(binBytes));
            case 'jwt':
                return parseJWTContent(text);
            case 'md5':
            case 'sha1':
            case 'sha256':
                throw new Error('哈希函数不支持解码');
            default:
                throw new Error('不支持的解码类型');
        }
    }
    
    // 快速操作
    function performQuickAction(action) {
        const input = inputText.value;
        if (!input.trim()) {
            showStatus('请输入要处理的文本', 'error');
            return;
        }
        
        try {
            let result = '';
            
            switch (action) {
                case 'base64-encode':
                    result = btoa(unescape(encodeURIComponent(input)));
                    break;
                case 'base64-decode':
                    result = decodeURIComponent(escape(atob(input)));
                    break;
                case 'url-encode':
                    result = encodeURIComponent(input);
                    break;
                case 'url-decode':
                    result = decodeURIComponent(input);
                    break;
                case 'html-encode':
                    result = input
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
                    break;
                case 'html-decode':
                    result = input
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'");
                    break;
                case 'unicode-encode':
                    result = input.split('').map(char => {
                        const code = char.charCodeAt(0);
                        return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : char;
                    }).join('');
                    break;
                case 'unicode-decode':
                    result = input.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
                        return String.fromCharCode(parseInt(code, 16));
                    });
                    break;
                case 'hex-encode':
                    result = Array.from(new TextEncoder().encode(input))
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('');
                    break;
                case 'hex-decode':
                    const hexBytes = input.replace(/\s/g, '').match(/.{1,2}/g) || [];
                    const bytes = hexBytes.map(byte => parseInt(byte, 16));
                    result = new TextDecoder().decode(new Uint8Array(bytes));
                    break;
                case 'md5-hash':
                    result = md5(input);
                    break;
                case 'sha256-hash':
                    result = sha256(input);
                    break;
                default:
                    throw new Error('不支持的操作');
            }
            
            outputText.value = result;
            outputText.classList.add('output-success');
            outputText.classList.remove('output-error');
            updateTextStats();
            showStatus('操作成功', 'success');
            
        } catch (error) {
            outputText.value = '';
            outputText.classList.add('output-error');
            outputText.classList.remove('output-success');
            showStatus(`操作失败: ${error.message}`, 'error');
        }
    }
        
    // 创建JWT
    function createJWT(text) {
        try {
            // 尝试解析输入文本为JSON对象
            let payload;
            try {
                payload = JSON.parse(text);
            } catch {
                // 如果不是JSON，创建一个简单的payload
                payload = { data: text, iat: Math.floor(Date.now() / 1000) };
            }
            
            // 创建标准的JWT header
            const header = {
                "alg": "HS256",
                "typ": "JWT"
            };
            
            // Base64编码header和payload
            const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
            const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
            
            // 创建一个示例签名（实际应用中需要使用密钥）
            const signature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
            
            return `${encodedHeader}.${encodedPayload}.${signature}`;
        } catch (error) {
            throw new Error('JWT创建失败: ' + error.message);
        }
    }
    
    // 解析JWT内容
    function parseJWTContent(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('无效的JWT格式');
            }
            
            // 添加Base64填充
            const addPadding = (str) => {
                const padding = 4 - (str.length % 4);
                return padding === 4 ? str : str + '='.repeat(padding);
            };
            
            const header = JSON.parse(atob(addPadding(parts[0])));
            const payload = JSON.parse(atob(addPadding(parts[1])));
            
            return `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nSignature:\n${parts[2]}`;
        } catch (error) {
            throw new Error('JWT解析失败: ' + error.message);
        }
    }
    
    // 更新按钮状态
    function updateButtonStates() {
        const type = getSelectedEncodingType();
        const isHashType = ['md5', 'sha1', 'sha256'].includes(type);
        
        // 更新按钮样式和文本
        if (currentMode === 'encode') {
            encodeBtn.classList.remove('btn-secondary');
            encodeBtn.classList.add('btn-primary', 'active-mode');
            encodeBtn.textContent = '编码 ✓';
            
            decodeBtn.classList.remove('btn-primary', 'active-mode');
            decodeBtn.classList.add('btn-secondary');
            decodeBtn.textContent = '解码';
            
            // 更新模式指示器
            if (currentModeText) {
                currentModeText.textContent = '编码模式';
                currentModeText.style.background = 'rgb(235, 43, 0)';
            }
        } else {
            decodeBtn.classList.remove('btn-secondary');
            decodeBtn.classList.add('btn-primary', 'active-mode');
            decodeBtn.textContent = '解码 ✓';
            
            encodeBtn.classList.remove('btn-primary', 'active-mode');
            encodeBtn.classList.add('btn-secondary');
            encodeBtn.textContent = '编码';
            
            // 更新模式指示器
            if (currentModeText) {
                currentModeText.textContent = '解码模式';
                currentModeText.style.background = 'rgb(23, 184, 85)';
            }
        }
        
        // 哈希类型只支持编码，JWT类型支持编码和解码
        decodeBtn.disabled = isHashType;
        if (isHashType && currentMode === 'decode') {
            currentMode = 'encode';
            updateButtonStates();
            return;
        }
        
        // 禁用状态的按钮样式
        if (isHashType) {
            decodeBtn.classList.remove('btn-primary', 'btn-secondary', 'active-mode');
            decodeBtn.classList.add('btn-disabled');
            decodeBtn.textContent = '解码 (不支持)';
        }
        
        // 更新快速操作按钮状态
        actionButtons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (action.includes('decode') && isHashType) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    }
    
    // 更新文本统计
    function updateTextStats() {
        const input = inputText.value;
        const output = outputText.value;
        
        inputLength.textContent = `字符数: ${input.length}`;
        inputBytes.textContent = `字节数: ${new Blob([input]).size}`;
        outputLength.textContent = `字符数: ${output.length}`;
        outputBytes.textContent = `字节数: ${new Blob([output]).size}`;
    }
    
    // 显示状态
    function showStatus(message, type) {
        statusBar.textContent = message;
        statusBar.className = `status-bar status-${type}`;
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
    
    // MD5哈希实现
    function md5(string) {
        try {
            if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
                return CryptoJS.MD5(string).toString();
            } else {
                return 'MD5(' + string + ') - crypto-js库未加载';
            }
        } catch (error) {
            return 'MD5计算错误: ' + error.message;
        }
    }
    
    // SHA1哈希实现
    function sha1(string) {
        try {
            if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA1) {
                return CryptoJS.SHA1(string).toString();
            } else {
                return 'SHA1(' + string + ') - crypto-js库未加载';
            }
        } catch (error) {
            return 'SHA1计算错误: ' + error.message;
        }
    }
    
    // SHA256哈希实现
    function sha256(string) {
        try {
            if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
                return CryptoJS.SHA256(string).toString();
            } else {
                return 'SHA256(' + string + ') - crypto-js库未加载';
            }
        } catch (error) {
            return 'SHA256计算错误: ' + error.message;
        }
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    performOperation();
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
                case 's':
                    e.preventDefault();
                    swapBtn.click();
                    break;
            }
        }
    });
});