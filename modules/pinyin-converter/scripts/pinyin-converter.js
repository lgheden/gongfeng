/**
 * 拼音转换器主逻辑
 */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化工具
    const tool = new PinyinConverterTool();

    // 获取DOM元素
    const inputArea = document.getElementById('textInput');
    const outputArea = document.getElementById('textOutput');
    const statusBar = document.getElementById('statusBar');
    const processBtn = document.getElementById('processBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    
    // 配置选项
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const showToneCheck = document.getElementById('showTone');
    const showAllPronunciationCheck = document.getElementById('showAllPronunciation');
    const addSpacesCheck = document.getElementById('addSpaces');
    
    // 统计元素
    const charCount = document.getElementById('charCount');
    const hanziCount = document.getElementById('hanziCount');
    const polyphoneCount = document.getElementById('polyphoneCount');

    // 全局变量
    let currentData = null;
    let currentMode = 'hanzi-to-pinyin';

    // 初始化
    init();

    async function init() {
        bindEvents();
        updateStats();
        updatePlaceholder();
        
        // 等待字典加载完成
        try {
            await tool.waitForDictionaries();
            showStatus('拼音转换器已加载（支持优先级查询）', 'info');
        } catch (error) {
            showStatus('拼音转换器加载失败: ' + error.message, 'error');
        }
    }

    function bindEvents() {
        // 绑定事件处理
        processBtn.addEventListener('click', processData);
        clearBtn.addEventListener('click', clearAll);
        copyBtn.addEventListener('click', copyResult);
        downloadBtn.addEventListener('click', downloadResult);
        loadSampleBtn.addEventListener('click', loadSample);
        
        // 配置变化事件
        modeRadios.forEach(radio => {
            radio.addEventListener('change', handleModeChange);
        });
        
        showToneCheck.addEventListener('change', updateConfig);
        showAllPronunciationCheck.addEventListener('change', updateConfig);
        addSpacesCheck.addEventListener('change', updateConfig);
        
        // 输入事件
        inputArea.addEventListener('input', updateStats);
        
        // 键盘事件
        document.addEventListener('keydown', handleKeyboard);
    }

    async function processData() {
        const input = inputArea.value.trim();
        if (!input) {
            showStatus('请输入要转换的内容', 'warning');
            return;
        }

        try {
            showStatus('正在转换...', 'info');
            const startTime = performance.now();
            
            // 获取处理选项
            const options = getProcessOptions();
            
            // 执行处理（现在是异步的）
            const result = await tool.process(input, options);
            
            // 显示结果
            outputArea.value = result;
            currentData = result;
            
            const endTime = performance.now();
            updateStats();
            showStatus(`转换完成，耗时 ${Math.round(endTime - startTime)}ms`, 'success');
            
        } catch (error) {
            showStatus(`转换失败: ${error.message}`, 'error');
        }
    }

    function getProcessOptions() {
        return {
            mode: currentMode,
            showTone: showToneCheck.checked,
            showAllPronunciation: showAllPronunciationCheck.checked,
            addSpaces: addSpacesCheck.checked
        };
    }

    function handleModeChange(event) {
        currentMode = event.target.value;
        updatePlaceholder();
        updateStats();
        showStatus(`已切换到${currentMode === 'hanzi-to-pinyin' ? '汉字转拼音' : '拼音转汉字'}模式`, 'info');
    }

    async function updateConfig() {
        // 配置变化时自动重新转换
        if (inputArea.value.trim() && currentData) {
            await processData();
        }
    }

    function updatePlaceholder() {
        if (currentMode === 'hanzi-to-pinyin') {
            inputArea.placeholder = '请输入汉字...';
            outputArea.placeholder = '拼音结果将在这里显示...';
        } else {
            inputArea.placeholder = '请输入拼音（用空格分隔）...';
            outputArea.placeholder = '汉字结果将在这里显示...';
        }
    }

    function clearAll() {
        inputArea.value = '';
        outputArea.value = '';
        currentData = null;
        updateStats();
        showStatus('已清空所有内容', 'info');
    }

    function copyResult() {
        if (!currentData) {
            showStatus('没有可复制的内容', 'warning');
            return;
        }

        navigator.clipboard.writeText(currentData).then(() => {
            showCopyNotification();
            showStatus('结果已复制到剪贴板', 'success');
        }).catch(() => {
            showStatus('复制失败', 'error');
        });
    }

    function downloadResult() {
        if (!currentData) {
            showStatus('没有可下载的内容', 'warning');
            return;
        }

        const blob = new Blob([currentData], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinyin-result-${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus('文件下载完成', 'success');
    }

    function loadSample() {
        const sampleText = tool.getSampleText(currentMode);
        inputArea.value = sampleText;
        updateStats();
        showStatus('示例文本已加载', 'info');
    }

    function updateStats() {
        const text = inputArea.value;
        const outputText = outputArea.value;
        
        // 字符数统计
        if (charCount) charCount.textContent = text.length;
        
        // 汉字数统计
        if (hanziCount) {
            const hanziCountValue = tool.countHanzi(text);
            hanziCount.textContent = hanziCountValue;
        }
        
        // 多音字统计（仅在汉字转拼音模式下显示）
        if (polyphoneCount) {
            if (currentMode === 'hanzi-to-pinyin' && outputText) {
                polyphoneCount.textContent = tool.getPolyphoneCount();
            } else {
                polyphoneCount.textContent = 0;
            }
        }
    }

    function showStatus(message, type = 'info') {
        if (statusBar) {
            statusBar.textContent = message;
            statusBar.className = `status-bar status-${type}`;
            
            // 自动清除状态（除了错误信息）
            if (type !== 'error') {
                setTimeout(() => {
                    statusBar.textContent = '';
                    statusBar.className = 'status-bar';
                }, 3000);
            }
        }
    }

    function showCopyNotification() {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = '✓ 已复制到剪贴板';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    async function handleKeyboard(event) {
        // Ctrl+Enter 转换
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            await processData();
        }
        
        // Ctrl+Shift+C 复制
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            copyResult();
        }
        
        // Ctrl+L 加载示例
        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            loadSample();
        }
        
        // Escape 清空
        if (event.key === 'Escape') {
            event.preventDefault();
            clearAll();
        }
    }

    // 添加工具提示功能
    function addTooltips() {
        const tooltips = {
            'showTone': '是否在拼音中显示声调符号',
            'showAllPronunciation': '对于多音字，显示所有可能的读音',
            'addSpaces': '在拼音之间添加空格分隔'
        };
        
        Object.entries(tooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.title = text;
            }
        });
    }

    // 初始化工具提示
    addTooltips();
    
    // 在控制台显示字典加载信息
    tool.waitForDictionaries().then(() => {
        console.log('字典统计:', {
            fourChar: Object.keys(tool.fourCharDict).length,
            threeChar: Object.keys(tool.threeCharDict).length,
            twoChar: Object.keys(tool.twoCharDict).length,
            singleChar: Object.keys(tool.singleCharDict).length,
            total: Object.keys(tool.allDict).length
        });
    }).catch(error => {
        console.error('字典加载失败:', error);
    });
}); 