document.addEventListener('DOMContentLoaded', function() {
    const regexInput = document.getElementById('regexInput');
    const testText = document.getElementById('testText');
    const matchResults = document.getElementById('matchResults');
    const groupsDetails = document.getElementById('groupsDetails');
    const regexExplanation = document.getElementById('regexExplanation');
    const statusBar = document.getElementById('statusBar');
    const replaceInput = document.getElementById('replaceInput');
    const replaceSection = document.querySelector('.replace-section');
    
    const testBtn = document.getElementById('testBtn');
    const replaceBtn = document.getElementById('replaceBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    
    const flagCheckboxes = document.querySelectorAll('.flags-container input[type="checkbox"]');
    const patternButtons = document.querySelectorAll('.pattern-btn');
    
    const textLength = document.getElementById('textLength');
    const lineCount = document.getElementById('lineCount');
    const matchCount = document.getElementById('matchCount');
    const groupCount = document.getElementById('groupCount');
    
    let currentMode = 'test'; // 'test' or 'replace'
    let savedPatterns = JSON.parse(localStorage.getItem('regexPatterns') || '[]');
    
    // 初始化
    updateTextStats();
    loadSavedPatterns();
    
    // 测试按钮
    testBtn.addEventListener('click', function() {
        currentMode = 'test';
        replaceSection.style.display = 'none';
        testBtn.classList.add('btn-primary');
        testBtn.classList.remove('btn-secondary');
        replaceBtn.classList.add('btn-secondary');
        replaceBtn.classList.remove('btn-primary');
        performTest();
    });
    
    // 替换按钮
    replaceBtn.addEventListener('click', function() {
        currentMode = 'replace';
        replaceSection.style.display = 'block';
        replaceBtn.classList.add('btn-primary');
        replaceBtn.classList.remove('btn-secondary');
        testBtn.classList.add('btn-secondary');
        testBtn.classList.remove('btn-primary');
        performReplace();
    });
    
    // 清空按钮
    clearBtn.addEventListener('click', function() {
        regexInput.value = '';
        testText.value = '';
        replaceInput.value = '';
        matchResults.textContent = '';
        groupsDetails.textContent = '';
        regexExplanation.textContent = '';
        statusBar.textContent = '';
        statusBar.className = 'status-bar';
        flagCheckboxes.forEach(cb => cb.checked = false);
        updateTextStats();
        updateMatchStats(0, 0);
    });
    
    // 保存模式
    saveBtn.addEventListener('click', function() {
        const pattern = regexInput.value.trim();
        const flags = getSelectedFlags();
        const description = prompt('请输入模式描述:');
        
        if (pattern && description) {
            const savedPattern = {
                pattern: pattern,
                flags: flags,
                description: description,
                timestamp: new Date().toISOString()
            };
            
            savedPatterns.unshift(savedPattern);
            if (savedPatterns.length > 10) {
                savedPatterns = savedPatterns.slice(0, 10);
            }
            
            localStorage.setItem('regexPatterns', JSON.stringify(savedPatterns));
            showStatus('模式已保存', 'success');
            loadSavedPatterns();
        }
    });
    
    // 加载模式
    loadBtn.addEventListener('click', function() {
        showSavedPatternsDialog();
    });
    
    // 快速模式按钮
    patternButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pattern = this.getAttribute('data-pattern');
            const desc = this.getAttribute('data-desc');
            regexInput.value = pattern;
            showStatus(`已加载模式: ${desc}`, 'info');
            explainRegex(pattern);
            if (testText.value.trim()) {
                performTest();
            }
        });
    });
    
    // 实时测试
    regexInput.addEventListener('input', function() {
        const pattern = this.value.trim();
        if (pattern) {
            explainRegex(pattern);
            if (testText.value.trim()) {
                if (currentMode === 'test') {
                    performTest();
                } else {
                    performReplace();
                }
            }
        } else {
            regexExplanation.textContent = '';
        }
    });
    
    // 标志变化时重新测试
    flagCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            if (regexInput.value.trim() && testText.value.trim()) {
                if (currentMode === 'test') {
                    performTest();
                } else {
                    performReplace();
                }
            }
        });
    });
    
    // 测试文本变化时更新统计
    testText.addEventListener('input', function() {
        updateTextStats();
        if (regexInput.value.trim() && this.value.trim()) {
            if (currentMode === 'test') {
                performTest();
            } else {
                performReplace();
            }
        }
    });
    
    // 替换文本变化时重新替换
    replaceInput.addEventListener('input', function() {
        if (currentMode === 'replace' && regexInput.value.trim() && testText.value.trim()) {
            performReplace();
        }
    });
    
    // 执行测试
    function performTest() {
        const pattern = regexInput.value.trim();
        const text = testText.value;
        const flags = getSelectedFlags();
        
        if (!pattern) {
            showStatus('请输入正则表达式', 'error');
            return;
        }
        
        if (!text) {
            showStatus('请输入测试文本', 'error');
            return;
        }
        
        try {
            // 确保正则表达式包含全局标志以支持 matchAll
            const globalFlags = flags.includes('g') ? flags : flags + 'g';
            const regex = new RegExp(pattern, globalFlags);
            const matches = [...text.matchAll(regex)];
            
            displayMatches(text, matches);
            displayGroups(matches);
            updateMatchStats(matches.length, getGroupCount(matches));
            
            if (matches.length > 0) {
                showStatus(`找到 ${matches.length} 个匹配`, 'success');
                matchResults.classList.add('match-success');
                matchResults.classList.remove('match-error');
            } else {
                showStatus('没有找到匹配', 'info');
                matchResults.classList.remove('match-success', 'match-error');
            }
            
        } catch (error) {
            showStatus(`正则表达式错误: ${error.message}`, 'error');
            matchResults.innerHTML = `<div class="regex-error">${error.message}</div>`;
            matchResults.classList.add('match-error');
            matchResults.classList.remove('match-success');
            groupsDetails.textContent = '';
            updateMatchStats(0, 0);
        }
    }
    
    // 执行替换
    function performReplace() {
        const pattern = regexInput.value.trim();
        const text = testText.value;
        const replacement = replaceInput.value;
        const flags = getSelectedFlags();
        
        if (!pattern) {
            showStatus('请输入正则表达式', 'error');
            return;
        }
        
        if (!text) {
            showStatus('请输入测试文本', 'error');
            return;
        }
        
        try {
            // 确保正则表达式包含全局标志以支持 matchAll
            const globalFlags = flags.includes('g') ? flags : flags + 'g';
            const regex = new RegExp(pattern, globalFlags);
            const originalMatches = [...text.matchAll(regex)];
            const replacedText = text.replace(regex, replacement);
            
            displayReplaceResult(text, replacedText, originalMatches);
            displayGroups(originalMatches);
            updateMatchStats(originalMatches.length, getGroupCount(originalMatches));
            
            if (originalMatches.length > 0) {
                showStatus(`替换了 ${originalMatches.length} 个匹配`, 'success');
                matchResults.classList.add('match-success');
                matchResults.classList.remove('match-error');
            } else {
                showStatus('没有找到可替换的匹配', 'info');
                matchResults.classList.remove('match-success', 'match-error');
            }
            
        } catch (error) {
            showStatus(`正则表达式错误: ${error.message}`, 'error');
            matchResults.innerHTML = `<div class="regex-error">${error.message}</div>`;
            matchResults.classList.add('match-error');
            matchResults.classList.remove('match-success');
            groupsDetails.textContent = '';
            updateMatchStats(0, 0);
        }
    }
    
    // 显示匹配结果
    function displayMatches(text, matches) {
        if (matches.length === 0) {
            matchResults.innerHTML = '<div class="no-matches">没有找到匹配</div>';
            return;
        }
        
        let highlightedText = text;
        let offset = 0;
        
        matches.forEach((match, index) => {
            const matchStart = match.index + offset;
            const matchEnd = matchStart + match[0].length;
            const highlightedMatch = `<span class="match-highlight" title="匹配 ${index + 1}">${match[0]}</span>`;
            
            highlightedText = highlightedText.slice(0, matchStart) + 
                            highlightedMatch + 
                            highlightedText.slice(matchEnd);
            
            offset += highlightedMatch.length - match[0].length;
        });
        
        matchResults.innerHTML = highlightedText;
    }
    
    // 显示替换结果
    function displayReplaceResult(originalText, replacedText, matches) {
        if (matches.length === 0) {
            matchResults.innerHTML = '<div class="no-matches">没有找到可替换的匹配</div>';
            return;
        }
        
        const resultHtml = `
            <div style="margin-bottom: 15px;">
                <strong>原文本:</strong>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 5px; font-family: monospace;">${escapeHtml(originalText)}</div>
            </div>
            <div>
                <strong>替换后:</strong>
                <div style="background: #d4edda; padding: 10px; border-radius: 4px; margin-top: 5px; font-family: monospace;">${escapeHtml(replacedText)}</div>
            </div>
        `;
        
        matchResults.innerHTML = resultHtml;
    }
    
    // 显示捕获组
    function displayGroups(matches) {
        if (matches.length === 0) {
            groupsDetails.textContent = '没有捕获组';
            return;
        }
        
        let groupsHtml = '';
        
        matches.forEach((match, matchIndex) => {
            groupsHtml += `<div style="margin-bottom: 15px;"><strong>匹配 ${matchIndex + 1}:</strong></div>`;
            
            match.forEach((group, groupIndex) => {
                if (groupIndex === 0) {
                    groupsHtml += `<div class="group-item"><span class="group-index">完整匹配:</span><span class="group-value">${escapeHtml(group || '')}</span></div>`;
                } else {
                    groupsHtml += `<div class="group-item"><span class="group-index">组 ${groupIndex}:</span><span class="group-value">${escapeHtml(group || '(未匹配)')}</span></div>`;
                }
            });
        });
        
        groupsDetails.innerHTML = groupsHtml;
    }
    
    // 解释正则表达式
    function explainRegex(pattern) {
        const explanations = {
            '\\d': '匹配任意数字 (0-9)',
            '\\w': '匹配单词字符 (字母、数字、下划线)',
            '\\s': '匹配空白字符 (空格、制表符、换行符)',
            '\\D': '匹配非数字字符',
            '\\W': '匹配非单词字符',
            '\\S': '匹配非空白字符',
            '.': '匹配任意字符 (除换行符外)',
            '^': '匹配行的开始',
            '$': '匹配行的结束',
            '*': '匹配前面的字符 0 次或多次',
            '+': '匹配前面的字符 1 次或多次',
            '?': '匹配前面的字符 0 次或 1 次',
            '\\b': '匹配单词边界',
            '\\B': '匹配非单词边界',
            '|': '或运算符',
            '()': '捕获组',
            '[]': '字符类',
            '{}': '量词'
        };
        
        let explanationHtml = '';
        
        for (const [regex, desc] of Object.entries(explanations)) {
            if (pattern.includes(regex.replace(/\\\\/g, '\\'))) {
                explanationHtml += `<div class="explanation-item"><div class="explanation-pattern">${regex}</div><div class="explanation-desc">${desc}</div></div>`;
            }
        }
        
        if (!explanationHtml) {
            explanationHtml = '<div class="explanation-item"><div class="explanation-desc">输入正则表达式以查看说明</div></div>';
        }
        
        regexExplanation.innerHTML = explanationHtml;
    }
    
    // 获取选中的标志
    function getSelectedFlags() {
        let flags = '';
        flagCheckboxes.forEach(cb => {
            if (cb.checked) {
                flags += cb.value;
            }
        });
        return flags;
    }
    
    // 获取捕获组数量
    function getGroupCount(matches) {
        if (matches.length === 0) return 0;
        return Math.max(...matches.map(match => match.length - 1));
    }
    
    // 更新文本统计
    function updateTextStats() {
        const text = testText.value;
        textLength.textContent = `字符数: ${text.length}`;
        lineCount.textContent = `行数: ${text.split('\n').length}`;
    }
    
    // 更新匹配统计
    function updateMatchStats(matches, groups) {
        matchCount.textContent = `匹配数: ${matches}`;
        groupCount.textContent = `捕获组: ${groups}`;
    }
    
    // 显示状态
    function showStatus(message, type) {
        statusBar.textContent = message;
        statusBar.className = `status-bar status-${type}`;
    }
    
    // 转义HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 加载保存的模式
    function loadSavedPatterns() {
        // 这里可以添加加载保存模式的UI逻辑
    }
    
    // 显示保存的模式对话框
    function showSavedPatternsDialog() {
        if (savedPatterns.length === 0) {
            alert('没有保存的模式');
            return;
        }
        
        let dialogHtml = '选择要加载的模式:\n\n';
        savedPatterns.forEach((pattern, index) => {
            dialogHtml += `${index + 1}. ${pattern.description}\n   模式: /${pattern.pattern}/${pattern.flags}\n\n`;
        });
        
        const choice = prompt(dialogHtml + '请输入序号 (1-' + savedPatterns.length + '):');
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < savedPatterns.length) {
            const pattern = savedPatterns[index];
            regexInput.value = pattern.pattern;
            
            // 设置标志
            flagCheckboxes.forEach(cb => {
                cb.checked = pattern.flags.includes(cb.value);
            });
            
            showStatus(`已加载模式: ${pattern.description}`, 'success');
            explainRegex(pattern.pattern);
            
            if (testText.value.trim()) {
                performTest();
            }
        }
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (currentMode === 'test') {
                        performTest();
                    } else {
                        performReplace();
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    clearBtn.click();
                    break;
                case 's':
                    e.preventDefault();
                    saveBtn.click();
                    break;
                case 'o':
                    e.preventDefault();
                    loadBtn.click();
                    break;
            }
        }
    });
});