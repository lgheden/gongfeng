document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const inputArea = document.getElementById('inputArea');
    const outputArea = document.getElementById('outputArea');
    const statusBar = document.getElementById('statusBar');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');

    // 配置选项
    const ignoreCase = document.getElementById('ignoreCase');
    const ignoreNumbers = document.getElementById('ignoreNumbers');
    const ignorePunctuation = document.getElementById('ignorePunctuation');
    const minWordLength = document.getElementById('minWordLength');
    const topCount = document.getElementById('topCount');
    const sortBy = document.getElementById('sortBy');

    // 视图控制
    const tableViewBtn = document.getElementById('tableViewBtn');
    const chartViewBtn = document.getElementById('chartViewBtn');
    const tableView = document.getElementById('tableView');
    const chartView = document.getElementById('chartView');
    const wordTable = document.getElementById('wordTable');
    const wordChart = document.getElementById('wordChart');

    // 统计信息
    const totalWords = document.getElementById('totalWords');
    const uniqueWords = document.getElementById('uniqueWords');
    const avgWordLength = document.getElementById('avgWordLength');
    const analysisTime = document.getElementById('analysisTime');

    // 测试数据按钮
    const testChineseBtn = document.getElementById('testChineseBtn');
    const testEnglishBtn = document.getElementById('testEnglishBtn');
    const testMixedBtn = document.getElementById('testMixedBtn');
    const testCodeBtn = document.getElementById('testCodeBtn');

    // 初始化状态
    let currentData = null;
    let wordFrequencyData = null;
    let chartInstance = null;

    // 初始化CodeMirror编辑器
    const editor = CodeMirror(inputArea, {
        mode: 'text/plain',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        value: '// 请输入要分析的文本...',
        viewportMargin: 50,
        scrollbarStyle: 'native'
    });

    // 处理占位符逻辑
    let isPlaceholderActive = true;
    editor.on('focus', function() {
        if (isPlaceholderActive && editor.getValue() === '// 请输入要分析的文本...') {
            editor.setValue('');
            isPlaceholderActive = false;
        }
    });

    editor.on('blur', function() {
        if (editor.getValue().trim() === '') {
            editor.setValue('// 请输入要分析的文本...');
            isPlaceholderActive = true;
        }
    });

    // 主要功能按钮事件
    analyzeBtn.addEventListener('click', function() {
        try {
            const startTime = performance.now();
            const input = getInputData();
            if (!input) {
                showStatus('请输入要分析的文本', 'warning');
                return;
            }

            const viewType = 'table';
            tableView.style.display = viewType === 'table' ? 'block' : 'none';
            chartView.style.display = viewType === 'chart' ? 'block' : 'none';

            const result = analyzeText(input);
            displayResult(result);

            const endTime = performance.now();
            const analysisDuration = Math.round(endTime - startTime);
            analysisTime.textContent = analysisDuration + 'ms';

            showStatus('分析完成', 'success');
        } catch (error) {
            showStatus('分析失败: ' + error.message, 'error');
        }
    });

    // 清空按钮事件
    clearBtn.addEventListener('click', function() {
        clearAll();
        showStatus('已清空', 'info');
    });

    // 复制按钮事件
    copyBtn.addEventListener('click', function() {
        copyResult();
    });

    // 导出按钮事件
    exportBtn.addEventListener('click', function() {
        exportData();
    });

    // 视图切换事件
    tableViewBtn.addEventListener('click', function() {
        switchView('table');
    });

    chartViewBtn.addEventListener('click', function() {
        switchView('chart');
    });

    // 测试数据事件
    testChineseBtn.addEventListener('click', function() {
        loadTestData('chinese');
    });

    testEnglishBtn.addEventListener('click', function() {
        loadTestData('english');
    });

    testMixedBtn.addEventListener('click', function() {
        loadTestData('mixed');
    });

    testCodeBtn.addEventListener('click', function() {
        loadTestData('code');
    });

    // 核心功能函数
    function getInputData() {
        const input = editor.getValue().trim();
        if (input === '// 请输入要分析的文本...' || isPlaceholderActive) {
            return '';
        }
        return input;
    }

    function analyzeText(text) {
        // 文本预处理
        let processedText = text;

        if (ignoreCase.checked) {
            processedText = processedText.toLowerCase();
        }

        if (ignorePunctuation.checked) {
            processedText = processedText.replace(/[^\w\s\u4e00-\u9fff]/g, ' ');
        }

        // 分词处理（支持中英文）
        const words = processedText
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => word.trim());

        // 过滤条件
        const minLength = parseInt(minWordLength.value);
        const filteredWords = words.filter(word => {
            if (word.length < minLength) return false;
            if (ignoreNumbers.checked && /^\d+$/.test(word)) return false;
            return true;
        });

        // 统计词频
        const wordCount = {};
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        // 转换为数组并排序
        const wordFrequency = Object.entries(wordCount).map(([word, count]) => ({
            word,
            count,
            percentage: (count / filteredWords.length * 100).toFixed(2)
        }));

        // 排序
        const sortType = sortBy.value;
        switch (sortType) {
            case 'frequency':
                wordFrequency.sort((a, b) => b.count - a.count);
                break;
            case 'alphabetical':
                wordFrequency.sort((a, b) => a.word.localeCompare(b.word));
                break;
            case 'length':
                wordFrequency.sort((a, b) => b.word.length - a.word.length);
                break;
        }

        // 限制显示数量
        const topN = parseInt(topCount.value);
        const topWords = wordFrequency.slice(0, topN);

        // 计算统计信息
        const totalWordCount = filteredWords.length;
        const uniqueWordCount = wordFrequency.length;
        const avgLength = totalWordCount > 0
            ? (filteredWords.reduce((sum, word) => sum + word.length, 0) / totalWordCount).toFixed(1)
            : 0;

        return {
            words: topWords,
            stats: {
                total: totalWordCount,
                unique: uniqueWordCount,
                avgLength: avgLength
            }
        };
    }

    function displayResult(result) {
        wordFrequencyData = result;

        // 更新统计信息
        totalWords.textContent = result.stats.total;
        uniqueWords.textContent = result.stats.unique;
        avgWordLength.textContent = result.stats.avgLength;

        // 显示表格
        displayTable(result.words);

        // 准备图表数据
        prepareChartData(result.words);

        currentData = result;
    }

    function displayTable(words) {
        if (words.length === 0) {
            wordTable.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">没有找到符合条件的词汇</p>';
            return;
        }

        const maxCount = words[0]?.count || 1;

        const tableHTML = `
            <table class="word-table">
                <thead>
                    <tr>
                        <th class="rank">排名</th>
                        <th class="word">词汇</th>
                        <th class="frequency">频次</th>
                        <th class="percentage">占比(%)</th>
                        <th class="bar">分布</th>
                    </tr>
                </thead>
                <tbody>
                    ${words.map((item, index) => `
                        <tr>
                            <td class="rank">${index + 1}</td>
                            <td class="word">${escapeHtml(item.word)}</td>
                            <td class="frequency">${item.count}</td>
                            <td class="percentage">${item.percentage}%</td>
                            <td class="bar">
                                <div class="bar-container">
                                    <div class="bar-fill" style="width: ${(item.count / maxCount * 100)}%"></div>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        wordTable.innerHTML = tableHTML;
    }

    function prepareChartData(words) {
        if (words.length === 0) return;

        const labels = words.map(item => item.word);
        const data = words.map(item => item.count);

        // 销毁现有图表
        if (chartInstance) {
            chartInstance.destroy();
        }

        // 创建新图表
        const ctx = wordChart.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '词频统计',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.8)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '出现次数'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '词汇'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const word = words[context.dataIndex];
                                return `${word.word}: ${word.count}次 (${word.percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function switchView(viewType) {
        // 更新按钮状态
        tableViewBtn.classList.toggle('active', viewType === 'table');
        chartViewBtn.classList.toggle('active', viewType === 'chart');

        // 切换视图
        // tableView.classList.toggle('active', viewType === 'table');
        // chartView.classList.toggle('active', viewType === 'chart');
        tableView.style.display = viewType === 'table' ? 'block' : 'none';
        chartView.style.display = viewType === 'chart' ? 'block' : 'none';

        // 如果是图表视图，重新绘制图表
        if (viewType === 'chart' && wordFrequencyData) {
            prepareChartData(wordFrequencyData.words);
        }
    }

    function clearAll() {
        editor.setValue('// 请输入要分析的文本...');
        isPlaceholderActive = true;
        wordTable.innerHTML = '';
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        // 清空统计信息
        totalWords.textContent = '0';
        uniqueWords.textContent = '0';
        avgWordLength.textContent = '0';
        analysisTime.textContent = '0ms';

        currentData = null;
        wordFrequencyData = null;
    }

    function copyResult() {
        if (!currentData) {
            showStatus('没有可复制的内容', 'warning');
            return;
        }

        const resultText = formatResultForCopy(currentData);

        navigator.clipboard.writeText(resultText).then(function() {
            showStatus('已复制到剪贴板', 'success');
            showCopyNotification();
        }).catch(function(err) {
            showStatus('复制失败: ' + err.message, 'error');
        });
    }

    function exportData() {
        if (!currentData) {
            showStatus('没有可导出的数据', 'warning');
            return;
        }

        const csvContent = formatResultForCSV(currentData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', '词频统计结果.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showStatus('数据导出成功', 'success');
        } else {
            showStatus('浏览器不支持下载功能', 'error');
        }
    }

    function formatResultForCopy(data) {
        let result = '词频统计结果\n';
        result += '='.repeat(20) + '\n\n';
        result += `总词数: ${data.stats.total}\n`;
        result += `不重复词数: ${data.stats.unique}\n`;
        result += `平均词长: ${data.stats.avgLength}\n\n`;
        result += '排名\t词汇\t频次\t占比\n';
        result += '-'.repeat(30) + '\n';

        data.words.forEach((item, index) => {
            result += `${index + 1}\t${item.word}\t${item.count}\t${item.percentage}%\n`;
        });

        return result;
    }

    function formatResultForCSV(data) {
        let csv = '排名,词汇,频次,占比(%)\n';

        data.words.forEach((item, index) => {
            csv += `${index + 1},"${item.word}",${item.count},${item.percentage}\n`;
        });

        return csv;
    }

    function loadTestData(type) {
        const testData = {
            chinese: `人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。人工智能从诞生以来，理论和技术日益成熟，应用领域也不断扩大，可以设想，未来人工智能带来的科技产品，将会是人类智慧的"容器"。`,
            english: `Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often used to describe machines (or computers) that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".`,
            mixed: `人工智能 AI 是计算机科学 computer science 的一个重要分支。它结合了机器学习 machine learning、深度学习 deep learning 和自然语言处理 natural language processing 等技术。在2023年，AI技术取得了重大突破，ChatGPT等大语言模型的出现改变了人们的工作方式。`,
            code: `function analyzeText(text) {
    const words = text.split('\\s+');
    const wordCount = {};
    
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return wordCount;
}

const result = analyzeText("hello world hello javascript");
console.log(result); // { hello: 2, world: 1, javascript: 1 }`
        };

        editor.setValue(testData[type] || '');
        isPlaceholderActive = false;
        showStatus(`已加载${getTestDataName(type)}测试数据`, 'info');
    }

    function getTestDataName(type) {
        const names = {
            chinese: '中文',
            english: '英文',
            mixed: '混合',
            code: '代码'
        };
        return names[type] || type;
    }

    // 工具函数
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

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 初始化
    showStatus('词频统计工具已加载', 'info');
});
