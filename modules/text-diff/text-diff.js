/**
 * 文本对比工具
 * 实现文本差异检测和可视化显示
 */

$(document).ready(function() {
    // 初始化
    initializeTextDiff();
});

// CodeMirror编辑器实例
let originalTextEditor, comparedTextEditor, originalJsonEditor, comparedJsonEditor;

function initializeTextDiff() {
    // 初始化CodeMirror编辑器
    initializeCodeMirrorEditors();
    
    // 绑定事件
    bindEvents();
    
    // 初始化计数器
    updateTextStats();
    updateJsonStats();
    
    // 初始化标签页
    initializeTabs();
}

function initializeCodeMirrorEditors() {
    // 初始化文本编辑器
    originalTextEditor = CodeMirror(document.getElementById('originalText'), {
        lineNumbers: true,
        mode: 'text/plain',
        theme: 'default',
        lineWrapping: true,
        placeholder: '请输入原始文本...',
        readOnly: false
    });
    
    comparedTextEditor = CodeMirror(document.getElementById('comparedText'), {
        lineNumbers: true,
        mode: 'text/plain',
        theme: 'default',
        lineWrapping: true,
        placeholder: '请输入要对比的文本...',
        readOnly: false
    });
    
    // 初始化JSON编辑器
    originalJsonEditor = CodeMirror(document.getElementById('originalJson'), {
        lineNumbers: true,
        mode: 'application/json',
        theme: 'default',
        lineWrapping: true,
        placeholder: '请输入原始JSON数据...',
        readOnly: false
    });
    
    comparedJsonEditor = CodeMirror(document.getElementById('comparedJson'), {
        lineNumbers: true,
        mode: 'application/json',
        theme: 'default',
        lineWrapping: true,
        placeholder: '请输入要对比的JSON数据...',
        readOnly: false
    });
    
    // 绑定编辑器事件
    originalTextEditor.on('change', function() {
        clearCodeMirrorHighlights();
        updateTextStats();
        hideResult();
    });
    
    comparedTextEditor.on('change', function() {
        clearCodeMirrorHighlights();
        updateTextStats();
        hideResult();
    });
    
    originalJsonEditor.on('change', function() {
        clearJsonCodeMirrorHighlights();
        updateJsonStats();
        validateJson();
        hideResult();
    });
    
    comparedJsonEditor.on('change', function() {
        clearJsonCodeMirrorHighlights();
        updateJsonStats();
        validateJson();
        hideResult();
    });
}

// 标签页功能
function initializeTabs() {
    // 标签页切换事件
    $('.tab-btn').on('click', function() {
        const tabName = $(this).data('tab');
        switchTab(tabName);
    });
}

function switchTab(tabName) {
    // 更新标签按钮状态
    $('.tab-btn').removeClass('active');
    $(`.tab-btn[data-tab="${tabName}"]`).addClass('active');
    
    // 显示对应的标签页内容
    $('.tab-content').hide();
    $(`#${tabName}Tab`).show();
    
    // 检查当前标签页的显示对比结果选项状态
    const showResultChecked = tabName === 'text' ? 
        $('#showResultSection').is(':checked') : 
        $('#jsonShowResultSection').is(':checked');
    
    if (showResultChecked) {
        $('body').addClass('show-result');
        showResult();
    } else {
        $('body').removeClass('show-result');
        hideResult();
    }
}

function bindEvents() {
    // 注意：文本输入事件现在在initializeCodeMirrorEditors中绑定
    
    // 对比按钮
    $('#compareBtn').on('click', performComparison);
    $('#compareJsonBtn').on('click', performJsonComparison);
    
    // 清空按钮
    $('#clearBtn').on('click', clearAllText);
    $('#clearJsonBtn').on('click', clearAllJson);
    
    // 交换按钮
    $('#swapBtn').on('click', swapTexts);
    $('#swapJsonBtn').on('click', swapJsons);
    
    // JSON格式化按钮
    $('#formatOriginalBtn').on('click', function() { formatJson('original'); });
    $('#formatComparedBtn').on('click', function() { formatJson('compared'); });
    
    // JSON压缩按钮
    $('#compressOriginalBtn').on('click', function() { compressJson('original'); });
    $('#compressComparedBtn').on('click', function() { compressJson('compared'); });
    
    // 导出按钮
    $('#exportBtn').on('click', exportResult);
    
    // 复制结果按钮
    $('#copyResultBtn').on('click', copyDiffResult);
    
    // 加载示例按钮
    $('#loadTextExampleBtn').on('click', loadTextExample);
    $('#loadJsonExampleBtn').on('click', loadJsonExample);
    
    // 显示对比结果选项变化
    $('#showResultSection').on('change', function() {
        if (this.checked) {
            $('body').addClass('show-result');
            showResult();
        } else {
            $('body').removeClass('show-result');
            hideResult();
        }
    });
    
    $('#jsonShowResultSection').on('change', function() {
        if (this.checked) {
            $('body').addClass('show-result');
            showResult();
        } else {
            $('body').removeClass('show-result');
            hideResult();
        }
    });
    
    // 选项变化时重新对比
    $('.control-options input[type="checkbox"]').on('change', function() {
        // 排除显示对比结果的选项
        if (this.id === 'showResultSection' || this.id === 'jsonShowResultSection') {
            return;
        }
        
        if ($('#resultSection').is(':visible')) {
            const activeTab = $('.tab-btn.active').data('tab');
            if (activeTab === 'text') {
                performComparison();
            } else if (activeTab === 'json') {
                performJsonComparison();
            }
        }
    });
}

function updateTextStats() {
    const originalText = originalTextEditor ? originalTextEditor.getValue() : '';
    const comparedText = comparedTextEditor ? comparedTextEditor.getValue() : '';
    
    // 更新原始文本统计
    $('#originalCount').text(originalText.length);
    $('#originalLines').text(originalText ? originalText.split('\n').length : 0);
    
    // 更新对比文本统计
    $('#comparedCount').text(comparedText.length);
    $('#comparedLines').text(comparedText ? comparedText.split('\n').length : 0);
}

function performComparison() {
    const originalText = originalTextEditor.getValue();
    const comparedText = comparedTextEditor.getValue();
    
    if (!originalText && !comparedText) {
        showStatus('请输入要对比的文本', 'warning');
        return;
    }
    
    //showStatus('正在对比文本...', 'info');
    
    // 获取对比选项
    const options = {
        ignoreWhitespace: $('#ignoreWhitespace').is(':checked'),
        ignoreCase: $('#ignoreCase').is(':checked'),
        ignoreEmptyLines: $('#ignoreEmptyLines').is(':checked'),
        wordLevel: $('#wordLevel').is(':checked'),
        showDiffOnly: $('#showDiffOnly').is(':checked')
    };
    
    // 执行对比
    const diffResult = computeDiff(originalText, comparedText, options);
    
    // 自动勾选显示对比结果选项
    $('#showResultSection').prop('checked', true);
    $('body').addClass('show-result');
    
    // 显示结果
    displayDiffResult(diffResult);
    showResult();
    
    // 在CodeMirror中高亮差异
    highlightDifferencesInCodeMirror(diffResult);
    
    //showStatus('对比完成', 'success');
}

function computeDiff(text1, text2, options) {
    // 预处理文本
    let lines1 = preprocessText(text1, options);
    let lines2 = preprocessText(text2, options);
    
    // 计算差异
    const diff = calculateLineDiff(lines1, lines2, options);
    
    return {
        original: lines1,
        compared: lines2,
        diff: diff,
        stats: calculateStats(diff)
    };
}

function preprocessText(text, options) {
    if (!text) return [];
    
    let lines = text.split('\n');
    
    // 忽略空行
    if (options.ignoreEmptyLines) {
        lines = lines.filter(line => line.trim() !== '');
    }
    
    // 处理每一行
    lines = lines.map(line => {
        let processedLine = line;
        
        // 忽略大小写
        if (options.ignoreCase) {
            processedLine = processedLine.toLowerCase();
        }
        
        // 忽略空白字符
        if (options.ignoreWhitespace) {
            processedLine = processedLine.replace(/\s+/g, ' ').trim();
        }
        
        return {
            original: line,
            processed: processedLine
        };
    });
    
    return lines;
}

// CodeMirror差异高亮函数
function highlightDifferencesInCodeMirror(diffResult) {
    // 清除之前的高亮
    clearCodeMirrorHighlights();
    
    // 原始文本编辑器设为只读
    originalTextEditor.setOption('readOnly', true);
    
    // 遍历差异结果，在两个编辑器中高亮差异行
    diffResult.diff.forEach((diffLine, index) => {
        const lineNumber = index;
        
        switch (diffLine.type) {
            case 'added':
                // 新增行 - 在对比文本编辑器中绿色高亮
                comparedTextEditor.addLineClass(lineNumber, 'background', 'cm-diff-added');
                break;
            case 'removed':
                // 删除行 - 在原始文本编辑器中红色高亮
                originalTextEditor.addLineClass(lineNumber, 'background', 'cm-diff-removed');
                break;
            case 'modified':
                // 修改行 - 在两个编辑器中都用黄色高亮
                originalTextEditor.addLineClass(lineNumber, 'background', 'cm-diff-modified');
                comparedTextEditor.addLineClass(lineNumber, 'background', 'cm-diff-modified');
                break;
            case 'same':
            default:
                // 相同行 - 不高亮
                break;
        }
    });
}

// 清除CodeMirror高亮
function clearCodeMirrorHighlights() {
    if (originalTextEditor) {
        originalTextEditor.setOption('readOnly', false);
        // 清除所有行的高亮类
        for (let i = 0; i < originalTextEditor.lineCount(); i++) {
            originalTextEditor.removeLineClass(i, 'background');
        }
    }
    
    if (comparedTextEditor) {
        // 清除所有行的高亮类
        for (let i = 0; i < comparedTextEditor.lineCount(); i++) {
            comparedTextEditor.removeLineClass(i, 'background');
        }
    }
    
    // 清除JSON编辑器高亮
    if (originalJsonEditor) {
        originalJsonEditor.setOption('readOnly', false);
        for (let i = 0; i < originalJsonEditor.lineCount(); i++) {
            originalJsonEditor.removeLineClass(i, 'background');
        }
    }
    
    if (comparedJsonEditor) {
        for (let i = 0; i < comparedJsonEditor.lineCount(); i++) {
            comparedJsonEditor.removeLineClass(i, 'background');
        }
    }
}

// JSON差异高亮函数
function highlightJsonDifferencesInCodeMirror(diffResult) {
    // 清除之前的高亮
    clearJsonCodeMirrorHighlights();
    
    // 原始JSON编辑器设为只读
    originalJsonEditor.setOption('readOnly', true);
    
    // 获取两个编辑器的内容并按行分割
    const originalLines = originalJsonEditor.getValue().split('\n');
    const comparedLines = comparedJsonEditor.getValue().split('\n');
    
    // 遍历差异结果，在JSON编辑器中高亮差异
    diffResult.differences.forEach(diff => {
        // 根据路径在JSON文本中查找对应的行并高亮
        highlightJsonPathInEditor(diff, originalLines, comparedLines);
    });
}

// 清除JSON编辑器高亮
function clearJsonCodeMirrorHighlights() {
    if (originalJsonEditor) {
        originalJsonEditor.setOption('readOnly', false);
        for (let i = 0; i < originalJsonEditor.lineCount(); i++) {
            originalJsonEditor.removeLineClass(i, 'background');
        }
    }
    
    if (comparedJsonEditor) {
        for (let i = 0; i < comparedJsonEditor.lineCount(); i++) {
            comparedJsonEditor.removeLineClass(i, 'background');
        }
    }
}

// 在JSON编辑器中高亮指定路径的行
function highlightJsonPathInEditor(diff, originalLines, comparedLines) {
    const pathKey = diff.path.split('.').pop() || diff.path;
    
    // 在原始JSON中查找包含该路径的行
    originalLines.forEach((line, index) => {
        if (line.includes(`"${pathKey}"`) || line.includes(`'${pathKey}'`)) {
            switch (diff.type) {
                case 'removed':
                    originalJsonEditor.addLineClass(index, 'background', 'cm-diff-removed');
                    break;
                case 'modified':
                    originalJsonEditor.addLineClass(index, 'background', 'cm-diff-modified');
                    break;
            }
        }
    });
    
    // 在对比JSON中查找包含该路径的行
    comparedLines.forEach((line, index) => {
        if (line.includes(`"${pathKey}"`) || line.includes(`'${pathKey}'`)) {
            switch (diff.type) {
                case 'added':
                    comparedJsonEditor.addLineClass(index, 'background', 'cm-diff-added');
                    break;
                case 'modified':
                    comparedJsonEditor.addLineClass(index, 'background', 'cm-diff-modified');
                    break;
            }
        }
    });
}

function calculateLineDiff(lines1, lines2, options) {
    const diff = [];
    const maxLines = Math.max(lines1.length, lines2.length);
    
    // 使用简单的逐行对比算法
    let i = 0, j = 0;
    
    while (i < lines1.length || j < lines2.length) {
        const line1 = i < lines1.length ? lines1[i] : null;
        const line2 = j < lines2.length ? lines2[j] : null;
        
        if (!line1) {
            // 只有右侧有内容（新增）
            diff.push({
                type: 'added',
                left: null,
                right: line2,
                leftLineNum: null,
                rightLineNum: j + 1
            });
            j++;
        } else if (!line2) {
            // 只有左侧有内容（删除）
            diff.push({
                type: 'removed',
                left: line1,
                right: null,
                leftLineNum: i + 1,
                rightLineNum: null
            });
            i++;
        } else if (line1.processed === line2.processed) {
            // 内容相同
            diff.push({
                type: 'same',
                left: line1,
                right: line2,
                leftLineNum: i + 1,
                rightLineNum: j + 1
            });
            i++;
            j++;
        } else {
            // 内容不同，尝试找到最佳匹配
            const nextMatch = findNextMatch(lines1, lines2, i, j, options);
            
            if (nextMatch.found) {
                // 处理中间的差异
                while (i < nextMatch.leftIndex) {
                    diff.push({
                        type: 'removed',
                        left: lines1[i],
                        right: null,
                        leftLineNum: i + 1,
                        rightLineNum: null
                    });
                    i++;
                }
                
                while (j < nextMatch.rightIndex) {
                    diff.push({
                        type: 'added',
                        left: null,
                        right: lines2[j],
                        leftLineNum: null,
                        rightLineNum: j + 1
                    });
                    j++;
                }
            } else {
                // 标记为修改
                diff.push({
                    type: 'modified',
                    left: line1,
                    right: line2,
                    leftLineNum: i + 1,
                    rightLineNum: j + 1
                });
                i++;
                j++;
            }
        }
    }
    
    return diff;
}

function findNextMatch(lines1, lines2, startI, startJ, options) {
    const searchRange = 5; // 搜索范围
    
    for (let i = startI; i < Math.min(lines1.length, startI + searchRange); i++) {
        for (let j = startJ; j < Math.min(lines2.length, startJ + searchRange); j++) {
            if (lines1[i].processed === lines2[j].processed) {
                return {
                    found: true,
                    leftIndex: i,
                    rightIndex: j
                };
            }
        }
    }
    
    return { found: false };
}

function calculateStats(diff) {
    const stats = {
        same: 0,
        added: 0,
        removed: 0,
        modified: 0
    };
    
    diff.forEach(item => {
        stats[item.type]++;
    });
    
    return stats;
}

function displayDiffResult(result) {
    // 更新统计信息
    $('#sameLines').text(result.stats.same);
    $('#addedLines').text(result.stats.added);
    $('#removedLines').text(result.stats.removed);
    $('#modifiedLines').text(result.stats.modified);
    
    // 生成差异视图
    const leftHtml = generateDiffHtml(result.diff, 'left');
    const rightHtml = generateDiffHtml(result.diff, 'right');
    
    $('#originalDiff').html(leftHtml);
    $('#comparedDiff').html(rightHtml);
    
    // 显示结果区域
    $('#resultSection').show();
    
    // 滚动到结果区域
    $('html, body').animate({
        scrollTop: $('#resultSection').offset().top - 20
    }, 500);
}

function generateDiffHtml(diff, side) {
    let html = '';
    const showDiffOnly = $('#showDiffOnly').is(':checked');
    
    diff.forEach(item => {
        const line = side === 'left' ? item.left : item.right;
        const lineNum = side === 'left' ? item.leftLineNum : item.rightLineNum;
        
        // 如果启用"只显示差异行"选项，跳过相同的行
        if (showDiffOnly && item.type === 'same') {
            return;
        }
        
        // 只显示有内容的行，跳过空行占位
        if (line !== null) {
            const content = escapeHtml(line.original);
            const cssClass = getDiffLineClass(item.type, side);
            
            html += `<div class="diff-line ${cssClass}">`;
            html += `<span class="diff-line-number">${lineNum || ''}</span>`;
            html += content;
            html += `</div>`;
        }
    });
    
    return html;
}

function getDiffLineClass(type, side) {
    switch (type) {
        case 'same':
            return 'same';
        case 'added':
            return side === 'right' ? 'added' : 'empty';
        case 'removed':
            return side === 'left' ? 'removed' : 'empty';
        case 'modified':
            return 'modified';
        default:
            return '';
    }
}

function clearAllText() {
    clearCodeMirrorHighlights();
    originalTextEditor.setValue('');
    comparedTextEditor.setValue('');
    updateTextStats();
    
    // 取消勾选显示对比结果选项
    $('#showResultSection').prop('checked', false);
    $('body').removeClass('show-result');
    
    hideResult();
   // showStatus('已清空所有文本', 'info');
}

function swapTexts() {
    clearCodeMirrorHighlights();
    const originalText = originalTextEditor.getValue();
    const comparedText = comparedTextEditor.getValue();
    
    originalTextEditor.setValue(comparedText);
    comparedTextEditor.setValue(originalText);
    
    updateTextStats();
    
    if ($('#resultSection').is(':visible')) {
        performComparison();
    }
    
    showStatus('已交换文本内容', 'info');
}

function exportResult() {
    const originalText = originalTextEditor.getValue();
    const comparedText = comparedTextEditor.getValue();
    
    if (!$('#resultSection').is(':visible')) {
        showStatus('请先进行文本对比', 'warning');
        return;
    }
    
    // 生成导出内容
    let exportContent = '文本对比结果\n';
    exportContent += '================\n\n';
    
    // 添加统计信息
    exportContent += '统计信息:\n';
    exportContent += `相同行: ${$('#sameLines').text()}\n`;
    exportContent += `新增行: ${$('#addedLines').text()}\n`;
    exportContent += `删除行: ${$('#removedLines').text()}\n`;
    exportContent += `修改行: ${$('#modifiedLines').text()}\n\n`;
    
    // 添加原始文本
    exportContent += '原始文本:\n';
    exportContent += '----------\n';
    exportContent += originalText + '\n\n';
    
    // 添加对比文本
    exportContent += '对比文本:\n';
    exportContent += '----------\n';
    exportContent += comparedText + '\n\n';
    
    // 创建下载
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-diff-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    //showStatus('导出成功', 'success');
}

function copyDiffResult() {
    if (!$('#resultSection').is(':visible')) {
        showStatus('请先进行文本对比', 'warning');
        return;
    }
    
    // 生成差异摘要
    let diffSummary = '文本对比摘要:\n';
    diffSummary += `相同行: ${$('#sameLines').text()}, `;
    diffSummary += `新增行: ${$('#addedLines').text()}, `;
    diffSummary += `删除行: ${$('#removedLines').text()}, `;
    diffSummary += `修改行: ${$('#modifiedLines').text()}`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(diffSummary).then(() => {
        showStatus('差异摘要已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = diffSummary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showStatus('差异摘要已复制到剪贴板', 'success');
    });
}

function showResult() {
    $('#resultSection').show();
}

function hideResult() {
    $('#resultSection').hide();
}

function showStatus(message, type = 'info') {
    const statusBar = $('#statusBar');
    statusBar.removeClass('show');
    
    setTimeout(() => {
        statusBar.text(message).addClass('show');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            statusBar.removeClass('show');
        }, 3000);
    }, 100);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 工具函数：获取文件扩展名
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// JSON对比相关函数
function updateJsonStats() {
    const originalJson = originalJsonEditor ? originalJsonEditor.getValue() : '';
    const comparedJson = comparedJsonEditor ? comparedJsonEditor.getValue() : '';
    
    // 更新字符数统计
    $('#originalJsonCount').text(originalJson.length);
    $('#comparedJsonCount').text(comparedJson.length);
}

function validateJson() {
    validateJsonField('original');
    validateJsonField('compared');
}

function validateJsonField(type) {
    const editor = type === 'original' ? originalJsonEditor : comparedJsonEditor;
    const jsonText = editor.getValue();
    const statusElement = $(`#${type}JsonStatus`);
    
    if (!jsonText.trim()) {
        statusElement.text('待验证').removeClass('valid invalid pending');
        return;
    }
    
    try {
        JSON.parse(jsonText);
        statusElement.text('有效').removeClass('invalid pending').addClass('valid');
    } catch (e) {
        statusElement.text('无效').removeClass('valid pending').addClass('invalid');
    }
}

function formatJson(type) {
    const editor = type === 'original' ? originalJsonEditor : comparedJsonEditor;
    const jsonText = editor.getValue();
    
    if (!jsonText.trim()) {
        ///showStatus('请输入JSON数据', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(jsonText);
        const formatted = JSON.stringify(parsed, null, 2);
        editor.setValue(formatted);
        updateJsonStats();
        validateJson();
        //showStatus('JSON格式化成功', 'success');
    } catch (e) {
        showStatus('JSON格式错误: ' + e.message, 'error');
    }
}

function compressJson(type) {
    const editor = type === 'original' ? originalJsonEditor : comparedJsonEditor;
    const jsonText = editor.getValue();
    
    if (!jsonText.trim()) {
        //showStatus('请输入JSON数据', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(jsonText);
        const compressed = JSON.stringify(parsed);
        editor.setValue(compressed);
        updateJsonStats();
        validateJson();
        //showStatus('JSON压缩成功', 'success');
    } catch (e) {
        showStatus('JSON格式错误: ' + e.message, 'error');
    }
}

function clearAllJson() {
    clearJsonCodeMirrorHighlights();
    originalJsonEditor.setValue('');
    comparedJsonEditor.setValue('');
    updateJsonStats();
    validateJson();
    
    // 取消勾选显示对比结果选项
    $('#jsonShowResultSection').prop('checked', false);
    $('body').removeClass('show-result');
    
    hideResult();
    //showStatus('已清空所有JSON', 'info');
}

function swapJsons() {
    clearJsonCodeMirrorHighlights();
    const originalJson = originalJsonEditor.getValue();
    const comparedJson = comparedJsonEditor.getValue();
    
    originalJsonEditor.setValue(comparedJson);
    comparedJsonEditor.setValue(originalJson);
    
    updateJsonStats();
    validateJson();
    
    if ($('#resultSection').is(':visible')) {
        performJsonComparison();
    }
    
    //showStatus('已交换JSON内容', 'info');
}

function performJsonComparison() {
    const originalJson = originalJsonEditor.getValue();
    const comparedJson = comparedJsonEditor.getValue();
    
    if (!originalJson && !comparedJson) {
        //showStatus('请输入要对比的JSON数据', 'warning');
        return;
    }
    
    //showStatus('正在对比JSON...', 'info');
    
    try {
        // 解析JSON
        const obj1 = originalJson ? JSON.parse(originalJson) : {};
        const obj2 = comparedJson ? JSON.parse(comparedJson) : {};
        
        // 获取对比选项
        const options = {
            ignoreOrder: $('#jsonIgnoreOrder').is(':checked'),
            ignoreArrayOrder: $('#jsonIgnoreArrayOrder').is(':checked'),
            strictMode: $('#jsonStrictMode').is(':checked'),
            showPath: $('#jsonShowPath').is(':checked')
        };
        
        // 执行JSON对比
        const diffResult = compareJsonObjects(obj1, obj2, options);
        
        // 自动勾选显示对比结果选项
        $('#jsonShowResultSection').prop('checked', true);
        $('body').addClass('show-result');
        
        // 显示结果
        displayJsonDiffResult(diffResult);
        showResult();
        
        // 添加CodeMirror高亮
        highlightJsonDifferencesInCodeMirror(diffResult);
        
        //showStatus('JSON对比完成', 'success');
        
    } catch (e) {
        showStatus('JSON解析错误: ' + e.message, 'error');
    }
}

function compareJsonObjects(obj1, obj2, options) {
    const differences = [];
    const paths = new Set();
    
    // 收集所有路径
    collectPaths(obj1, '', paths);
    collectPaths(obj2, '', paths);
    
    // 对比每个路径
    for (const path of paths) {
        const value1 = getValueByPath(obj1, path);
        const value2 = getValueByPath(obj2, path);
        
        const diff = compareValues(value1, value2, path, options);
        if (diff) {
            differences.push(diff);
        }
    }
    
    return {
        differences: differences,
        stats: calculateJsonStats(differences)
    };
}

function collectPaths(obj, prefix, paths) {
    if (obj === null || obj === undefined) {
        paths.add(prefix || 'root');
        return;
    }
    
    if (typeof obj !== 'object') {
        paths.add(prefix || 'root');
        return;
    }
    
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            collectPaths(item, `${prefix}[${index}]`, paths);
        });
    } else {
        Object.keys(obj).forEach(key => {
            const newPath = prefix ? `${prefix}.${key}` : key;
            collectPaths(obj[key], newPath, paths);
        });
    }
}

function getValueByPath(obj, path) {
    if (!path || path === 'root') return obj;
    
    try {
        return path.split(/[.\[\]]/).filter(Boolean).reduce((current, key) => {
            return current && current[key];
        }, obj);
    } catch (e) {
        return undefined;
    }
}

function compareValues(value1, value2, path, options) {
    const exists1 = value1 !== undefined;
    const exists2 = value2 !== undefined;
    
    if (!exists1 && !exists2) return null;
    
    if (!exists1) {
        return {
            type: 'added',
            path: path,
            value: value2
        };
    }
    
    if (!exists2) {
        return {
            type: 'removed',
            path: path,
            value: value1
        };
    }
    
    if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        return {
            type: 'modified',
            path: path,
            oldValue: value1,
            newValue: value2
        };
    }
    
    return null;
}

function calculateJsonStats(differences) {
    const stats = {
        same: 0,
        added: 0,
        removed: 0,
        modified: 0
    };
    
    differences.forEach(diff => {
        stats[diff.type]++;
    });
    
    return stats;
}

function displayJsonDiffResult(result) {
    // 更新统计信息
    $('#sameLines').text(result.stats.same);
    $('#addedLines').text(result.stats.added);
    $('#removedLines').text(result.stats.removed);
    $('#modifiedLines').text(result.stats.modified);
    
    // 生成JSON差异视图
    const leftHtml = generateJsonDiffHtml(result.differences, 'left');
    const rightHtml = generateJsonDiffHtml(result.differences, 'right');
    
    $('#originalDiff').html(leftHtml);
    $('#comparedDiff').html(rightHtml);
    
    // 显示结果区域
    $('#resultSection').show();
    
    // 滚动到结果区域
    $('html, body').animate({
        scrollTop: $('#resultSection').offset().top - 20
    }, 500);
}

function generateJsonDiffHtml(differences, side) {
    let html = '';
    
    if (differences.length === 0) {
        html = '<div class="diff-line same"><span class="diff-line-number"></span>JSON对象完全相同</div>';
        return html;
    }
    
    differences.forEach((diff, index) => {
        const cssClass = getDiffLineClass(diff.type, side);
        let content = '';
        
        if (diff.type === 'added' && side === 'right') {
            content = `${diff.path}: ${JSON.stringify(diff.value)}`;
        } else if (diff.type === 'removed' && side === 'left') {
            content = `${diff.path}: ${JSON.stringify(diff.value)}`;
        } else if (diff.type === 'modified') {
            if (side === 'left') {
                content = `${diff.path}: ${JSON.stringify(diff.oldValue)}`;
            } else {
                content = `${diff.path}: ${JSON.stringify(diff.newValue)}`;
            }
        }
        
        if (content) {
            html += `<div class="diff-line ${cssClass}">`;
            html += `<span class="diff-line-number">${index + 1}</span>`;
            html += escapeHtml(content);
            html += `</div>`;
        }
    });
    
    return html;
}

// 加载文本示例
function loadTextExample() {
    const originalExample = `欢迎使用文本对比工具！
这是原始文本的示例内容。

功能特点：
1. 支持逐行对比
2. 高亮显示差异
3. 忽略空白字符选项
4. 支持大小写忽略
5. 单词级别对比

使用方法：
- 在左侧输入原始文本
- 在右侧输入要对比的文本
- 点击"开始对比"按钮
- 查看对比结果

注意事项：
请确保文本格式正确。`;

    const comparedExample = `欢迎使用文本对比工具！
这是修改后文本的示例内容。

功能特点：
1. 支持逐行对比
2. 高亮显示差异内容
3. 忽略空白字符选项
4. 支持大小写忽略
5. 单词级别精确对比
6. 新增导出功能

使用方法：
- 在左侧输入原始文本
- 在右侧输入要对比的文本内容
- 点击"开始对比"按钮查看结果
- 查看详细的对比结果

注意事项：
请确保文本格式完全正确。
建议先清空现有内容。`;

    if (originalTextEditor && comparedTextEditor) {
        originalTextEditor.setValue(originalExample);
        comparedTextEditor.setValue(comparedExample);
        updateTextStats();
        showStatus('已加载文本示例，可以点击"开始对比"查看效果', 'success');
    }
}

// 加载JSON示例
function loadJsonExample() {
    const originalJsonExample = `{
  "name": "张三",
  "age": 25,
  "city": "北京",
  "skills": ["JavaScript", "Python", "Java"],
  "education": {
    "degree": "本科",
    "school": "清华大学",
    "year": 2020
  },
  "projects": [
    {
      "name": "电商系统",
      "technology": "Vue.js",
      "status": "已完成"
    },
    {
      "name": "管理后台",
      "technology": "React",
      "status": "进行中"
    }
  ],
  "contact": {
    "email": "zhangsan@example.com",
    "phone": "13800138000"
  }
}`;

    const comparedJsonExample = `{
  "name": "张三",
  "age": 26,
  "city": "上海",
  "skills": ["JavaScript", "Python", "Java", "Go"],
  "education": {
    "degree": "硕士",
    "school": "清华大学",
    "year": 2020,
    "major": "计算机科学"
  },
  "projects": [
    {
      "name": "电商系统",
      "technology": "Vue.js",
      "status": "已完成"
    },
    {
      "name": "管理后台",
      "technology": "React",
      "status": "已完成"
    },
    {
      "name": "移动应用",
      "technology": "React Native",
      "status": "计划中"
    }
  ],
  "contact": {
    "email": "zhangsan@newcompany.com",
    "phone": "13800138000",
    "wechat": "zhangsan_dev"
  },
  "salary": 15000
}`;

    if (originalJsonEditor && comparedJsonEditor) {
        originalJsonEditor.setValue(originalJsonExample);
        comparedJsonEditor.setValue(comparedJsonExample);
        updateJsonStats();
        //showStatus('已加载JSON示例，可以点击"对比JSON"查看效果', 'success');
    }
}