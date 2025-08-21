// 检查是否在Chrome扩展环境中
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.get('analysisData', (data) => {
    if (data.analysisData) {
      const metrics = data.analysisData;
      displayMetrics(metrics);
    }
  });
} else {
  // 在普通网页环境中提供模拟数据用于演示
  const mockMetrics = {
    pageUrl: 'https://example.com',
    pageTitle: '示例页面',
    pageHtml: '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>示例页面</title>\n</head>\n<body>\n  <h1>这是一个示例页面</h1>\n  <p>这里是页面的HTML源码内容...</p>\n  <div class="content">\n    <p>更多内容...</p>\n  </div>\n</body>\n</html>',
    navStart: Date.now() - 5000,
    loadTime: '1.23',
    domContent: '0.89',
    firstPaint: '0.45',
    firstContentfulPaint: '0.67',
    lcp: 1.2,
    cls: 0.05,
    fid: 12,
    requests: [
      { url: 'https://api.example.com/data', method: 'GET', requestBody: 'N/A', statusCode: 200 },
      { url: 'https://api.example.com/user', method: 'POST', requestBody: '{"id":123}', statusCode: 201 }
    ],
    resourceCount: 3,
    totalSize: 234.56,
    resources: [
      { url: 'https://example.com/main.css', type: 'stylesheet', size: '45.67', duration: '0.12' },
      { url: 'https://example.com/app.js', type: 'script', size: '123.45', duration: '0.34' },
      { url: 'https://example.com/image.jpg', type: 'image', size: '65.43', duration: '0.23' }
    ],
    errors: [
      { type: 'JavaScript Error', message: '示例错误信息', filename: 'main.js', lineno: 42 }
    ]
  };
  displayMetrics(mockMetrics);
}

function displayMetrics(metrics) {
    // 页面信息
    document.getElementById('pageUrl').textContent = metrics.pageUrl || '-';
    document.getElementById('pageTitle').textContent = metrics.pageTitle || '-';
    
    // 启用查看HTML按钮并绑定事件
    const viewHtmlBtn = document.getElementById('viewHtmlBtn');
    if (metrics.pageHtml) {
      viewHtmlBtn.disabled = false;
      viewHtmlBtn.onclick = () => showHtmlModal(metrics.pageHtml);
    }

    // 页面性能指标
    document.getElementById('navStart').textContent = new Date(metrics.navStart).toLocaleTimeString();
    document.getElementById('loadTime').textContent = metrics.loadTime;
    document.getElementById('domContent').textContent = metrics.domContent;
    document.getElementById('firstPaint').textContent = metrics.firstPaint;
    document.getElementById('firstContentfulPaint').textContent = metrics.firstContentfulPaint;

    // Web Vitals
    document.getElementById('lcp').textContent = metrics.lcp ? metrics.lcp.toFixed(2) : '未测量';
    document.getElementById('cls').textContent = metrics.cls ? metrics.cls.toFixed(3) : '未测量';
    document.getElementById('fid').textContent = metrics.fid ? metrics.fid.toFixed(2) : '未触发';
    
    const vitalsChartCanvas = document.getElementById('vitalsChart');
    if (metrics.lcp || metrics.cls || metrics.fid) {
      // 清除可能存在的占位内容
      const placeholder = vitalsChartCanvas.parentNode.querySelector('.chart-placeholder');
      if (placeholder) {
        placeholder.remove();
      }
      vitalsChartCanvas.style.display = 'block';
      
      new Chart(vitalsChartCanvas, {
        type: 'bar',
        data: {
          labels: ['LCP (ms)', 'CLS', 'FID (ms)'],
          datasets: [{
            label: 'Web Vitals',
            data: [
              metrics.lcp || 0,
              metrics.cls || 0,
              metrics.fid || 0
            ],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
          }]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });
    } else {
      // 显示占位图
      vitalsChartCanvas.style.display = 'none';
      
      // 检查是否已存在占位内容
      let placeholder = vitalsChartCanvas.parentNode.querySelector('.chart-placeholder');
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'chart-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center';
        placeholder.innerHTML = `
          <div class="text-gray-500">
            <svg class="mx-auto mb-4 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-lg font-medium mb-2">暂无 Web Vitals 数据</p>
            <p class="text-sm">请等待页面交互或重新分析以获取完整的性能指标</p>
          </div>
        `;
        vitalsChartCanvas.parentNode.insertBefore(placeholder, vitalsChartCanvas);
      }
    }

    // 网络请求统计
    document.getElementById('requestCount').textContent = metrics.requests.length;
    const requestTable = document.getElementById('requestTable').querySelector('tbody');
    metrics.requests.forEach(req => {
      const row = document.createElement('tr');
      row.className = 'border-b hover:bg-gray-50';
      row.innerHTML = `
        <td class="p-2 cursor-pointer hover:bg-blue-50 transition-colors url-cell" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;" title="${req.url}">${req.url}</td>
        <td class="p-2">${req.method}</td>
        <td class="p-2" style="word-break: break-all;">${req.requestBody}</td>
        <td class="p-2">${req.statusCode || req.error || '未知'}</td>
      `;
      requestTable.appendChild(row);
    });
    
    // 存储请求数据用于导出
    window.requestsData = metrics.requests;

    // 资源加载统计
    document.getElementById('resourceCount').textContent = metrics.resourceCount;
    document.getElementById('totalSize').textContent = metrics.totalSize.toFixed(2);
    const resourceTable = document.getElementById('resourceTable').querySelector('tbody');
    metrics.resources.forEach(res => {
      const row = document.createElement('tr');
      row.className = 'border-b hover:bg-gray-50';
      row.innerHTML = `
        <td class="p-2 cursor-pointer hover:bg-blue-50 transition-colors url-cell" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;" title="${res.url}">${res.url}</td>
        <td class="p-2">${res.type}</td>
        <td class="p-2">${res.size}</td>
        <td class="p-2">${res.duration}</td>
      `;
      resourceTable.appendChild(row);
    });
    
    // 存储资源数据用于导出和下载
    window.resourcesData = metrics.resources;
    
    new Chart(document.getElementById('resourceChart'), {
      type: 'bar',
      data: {
        labels: metrics.resources.map(r => {
          const filename = r.url.split('/').pop();
          // 限制文件名长度，避免显示过长
          return filename.length > 15 ? filename.substring(0, 12) + '...' : filename;
        }),
        datasets: [{
          label: '加载时间 (ms)',
          data: metrics.resources.map(r => parseFloat(r.duration)),
          backgroundColor: '#4CAF50'
        }]
      },
      options: { 
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(context) {
                // 在tooltip中显示完整的文件名
                return metrics.resources[context[0].dataIndex].url.split('/').pop();
              }
            }
          }
        }
      }
    });

    // 错误统计
    document.getElementById('errorCount').textContent = metrics.errors ? metrics.errors.length : 0;
    const errorTable = document.getElementById('errorTable').querySelector('tbody');
    if (metrics.errors) {
      metrics.errors.forEach(err => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.innerHTML = `
          <td class="p-2">${err.type}</td>
          <td class="p-2" style="word-break: break-all;">${err.message}</td>
          <td class="p-2">${err.filename || '未知'}</td>
          <td class="p-2">${err.lineno || '未知'}</td>
        `;
        errorTable.appendChild(row);
      });
    }
    
    // 存储错误数据用于导出
    window.errorsData = metrics.errors || [];
}

// 折叠/展开功能
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.classList.toggle('hidden');
    
    // 获取按钮的基础文本（不包含箭头）
    const baseText = btn.textContent.replace(/[▲▼]/g, '').trim();
    
    // 更新箭头符号和颜色
    if (target.classList.contains('hidden')) {
      // 折叠状态：向下箭头，蓝色
      btn.innerHTML = baseText + ' <span class="text-blue-600">▼</span>';
    } else {
      // 展开状态：向上箭头，绿色
      btn.innerHTML = baseText + ' <span class="text-green-600">▲</span>';
    }
  });
});

// 表格单元格复制功能
function addCopyFunctionality() {
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
      const text = e.target.textContent.trim();
      if (text && text !== '-' && text !== '未知') {
        navigator.clipboard.writeText(text).then(() => {
          showCopyTooltip(e.target, '已复制!');
        }).catch(() => {
          // 降级方案：使用传统方法复制
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showCopyTooltip(e.target, '已复制!');
        });
      }
    }
  });
}

// 显示复制成功提示
function showCopyTooltip(element, message) {
  const tooltip = document.createElement('div');
  tooltip.className = 'copied-tooltip';
  tooltip.textContent = message;
  
  const rect = element.getBoundingClientRect();
  tooltip.style.left = '50%';
  tooltip.style.top = '50%';
  
  document.body.appendChild(tooltip);
  
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }, 200);
}

// 初始化复制功能
addCopyFunctionality();

// URL点击复制功能
function addUrlCopyFunctionality() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('url-cell')) {
      const url = e.target.title || e.target.textContent;
      navigator.clipboard.writeText(url).then(() => {
        showCopyTooltip(e.target, '已复制URL');
      }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyTooltip(e.target, '已复制URL');
      });
    }
  });
}

// CSV导出功能
function exportToCSV(data, filename, headers) {
  const csvContent = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(header => {
      let value = '';
      switch(header) {
        case 'URL':
          value = row.url || '';
          break;
        case '方法':
          value = row.method || '';
          break;
        case '请求体':
          value = row.requestBody || '';
          break;
        case '状态':
          value = row.statusCode || row.error || '未知';
          break;
        case '类型':
          value = row.type || '';
          break;
        case '大小 (KB)':
          value = row.size || '';
          break;
        case '加载时间 (ms)':
          value = row.duration || '';
          break;
        case '消息':
          value = row.message || '';
          break;
        case '文件':
          value = row.filename || '未知';
          break;
        case '行号':
          value = row.lineno || '未知';
          break;
      }
      // 处理包含逗号的值
      return value.toString().includes(',') ? `"${value}"` : value;
    });
    csvContent.push(values.join(','));
  });
  
  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// 下载资源功能（支持按类型筛选）
function downloadResources(filterType = 'all') {
  if (!window.resourcesData || window.resourcesData.length === 0) {
    alert('没有可下载的资源数据');
    return;
  }

  let filteredResources = window.resourcesData;
  let zipFileName = 'all_resources.zip';

  // 根据类型筛选资源
  if (filterType !== 'all') {
    const typeExtensions = {
      'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'],
      'scripts': ['.js', '.jsx', '.ts', '.tsx'],
      'stylesheets': ['.css', '.scss', '.sass', '.less'],
      'fonts': ['.woff', '.woff2', '.ttf', '.otf', '.eot']
    };

    if (typeExtensions[filterType]) {
      filteredResources = window.resourcesData.filter(resource => {
        const url = resource.url.toLowerCase();
        return typeExtensions[filterType].some(ext => url.includes(ext));
      });
      zipFileName = `${filterType}_resources.zip`;
    }
  }

  if (filteredResources.length === 0) {
    alert(`没有找到${filterType === 'all' ? '' : getTypeDisplayName(filterType)}资源`);
    return;
  }

  // 使用JSZip创建压缩包
  const zip = new JSZip();
  let downloadCount = 0;
  const totalResources = filteredResources.length;
  
  // 更新下载按钮状态
  const downloadBtn = document.getElementById('downloadDropdownBtn');
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = `
    <svg class="inline w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
    下载中...
  `;
  downloadBtn.disabled = true;
  
  filteredResources.forEach((resource, index) => {
    if (resource.url && resource.url.startsWith('http')) {
      fetch(resource.url)
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error(`HTTP ${response.status}`);
        })
        .then(blob => {
          const fileName = resource.url.split('/').pop() || `resource_${index}`;
          zip.file(fileName, blob);
          downloadCount++;
          
          if (downloadCount === totalResources) {
            generateAndDownloadZip(zip, zipFileName, downloadBtn, originalText);
          }
        })
        .catch(error => {
          console.warn(`无法下载资源 ${resource.url}:`, error);
          downloadCount++;
          
          if (downloadCount === totalResources) {
            generateAndDownloadZip(zip, zipFileName, downloadBtn, originalText);
          }
        });
    } else {
      downloadCount++;
      if (downloadCount === totalResources) {
        generateAndDownloadZip(zip, zipFileName, downloadBtn, originalText);
      }
    }
  });
}

// 生成并下载ZIP文件
function generateAndDownloadZip(zip, fileName, downloadBtn, originalText) {
  zip.generateAsync({type: 'blob'})
    .then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      
      // 恢复按钮状态
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    })
    .catch(error => {
      console.error('生成ZIP文件失败:', error);
      alert('下载失败，请重试');
      
      // 恢复按钮状态
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    });
}

// 获取类型显示名称
function getTypeDisplayName(type) {
  const displayNames = {
    'images': '图片',
    'scripts': 'JS',
    'stylesheets': 'CSS',
    'fonts': '字体'
  };
  return displayNames[type] || type;
}

// 兼容旧的函数名
function downloadAllResources() {
  downloadResources('all');
}

// 下拉菜单交互逻辑
function initDropdownMenu() {
  const dropdownBtn = document.getElementById('downloadDropdownBtn');
  const dropdownMenu = document.getElementById('downloadDropdownMenu');
  
  if (dropdownBtn && dropdownMenu) {
    // 确保下拉菜单初始状态是隐藏的
    dropdownMenu.classList.add('hidden');
    
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', () => {
      if (!dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
      }
    });
    
    // 阻止下拉菜单内部点击事件冒泡
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // 绑定下拉菜单选项点击事件
    const menuItems = dropdownMenu.querySelectorAll('[data-type]');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        downloadResources(type);
        dropdownMenu.classList.add('hidden');
      });
    });
  } else {
    console.error('下拉菜单元素未找到:', {
      dropdownBtn: !!dropdownBtn,
      dropdownMenu: !!dropdownMenu
    });
  }
}



// HTML弹窗相关功能
// HTML格式化函数
function formatHtml(html) {
  let formatted = '';
  let indent = 0;
  const indentSize = 2;
  
  // 移除多余的空白字符
  html = html.replace(/\s+/g, ' ').trim();
  
  // 分割标签
  const tokens = html.split(/(<\/?[^>]+>)/);
  
  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;
    
    if (token.startsWith('</')) {
      // 结束标签，减少缩进
      indent = Math.max(0, indent - indentSize);
      formatted += ' '.repeat(indent) + token + '\n';
    } else if (token.startsWith('<')) {
      // 开始标签
      formatted += ' '.repeat(indent) + token + '\n';
      // 如果不是自闭合标签，增加缩进
      if (!token.endsWith('/>') && !token.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
        indent += indentSize;
      }
    } else {
      // 文本内容
      if (token.length > 0) {
        formatted += ' '.repeat(indent) + token + '\n';
      }
    }
  }
  
  return formatted.trim();
}

function showHtmlModal(htmlContent) {
  const modal = document.getElementById('htmlModal');
  const htmlContentElement = document.getElementById('htmlContent');
  
  // 格式化并设置HTML内容
  const formattedHtml = formatHtml(htmlContent);
  htmlContentElement.textContent = formattedHtml;
  
  // 显示弹窗
  modal.classList.remove('hidden');
  
  // 防止背景滚动
  document.body.style.overflow = 'hidden';
}

function hideHtmlModal() {
  const modal = document.getElementById('htmlModal');
  modal.classList.add('hidden');
  
  // 恢复背景滚动
  document.body.style.overflow = 'auto';
}

function copyHtmlContent() {
  const htmlContent = document.getElementById('htmlContent').textContent;
  
  navigator.clipboard.writeText(htmlContent).then(() => {
    // 显示复制成功提示
    const copyBtn = document.getElementById('copyHtmlBtn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      已复制
    `;
    copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    copyBtn.classList.add('bg-green-600');
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('bg-green-600');
      copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }, 2000);
  }).catch(() => {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = htmlContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // 显示复制成功提示
    const copyBtn = document.getElementById('copyHtmlBtn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      已复制
    `;
    copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    copyBtn.classList.add('bg-green-600');
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('bg-green-600');
      copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }, 2000);
  });
}

// 绑定弹窗事件
document.addEventListener('DOMContentLoaded', () => {
  // 关闭弹窗按钮
  document.getElementById('closeHtmlModal').onclick = hideHtmlModal;
  
  // 复制HTML按钮
  document.getElementById('copyHtmlBtn').onclick = copyHtmlContent;
  
  // 点击背景关闭弹窗
  document.getElementById('htmlModal').onclick = (e) => {
    if (e.target.id === 'htmlModal') {
      hideHtmlModal();
    }
  };
  
  // ESC键关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('htmlModal');
      if (!modal.classList.contains('hidden')) {
        hideHtmlModal();
      }
    }
  });
  
  // 导出CSV按钮事件
  document.getElementById('exportRequestsCSV').onclick = () => {
    if (window.requestsData && window.requestsData.length > 0) {
      exportToCSV(window.requestsData, 'network_requests.csv', ['URL', '方法', '请求体', '状态码']);
    } else {
      alert('没有可导出的网络请求数据');
    }
  };
  
  document.getElementById('exportResourcesCSV').onclick = () => {
    if (window.resourcesData && window.resourcesData.length > 0) {
      exportToCSV(window.resourcesData, 'resources.csv', ['URL', '类型', '大小(KB)', '加载时间(s)']);
    } else {
      alert('没有可导出的资源数据');
    }
  };
  
  document.getElementById('exportErrorsCSV').onclick = () => {
    if (window.errorsData && window.errorsData.length > 0) {
      exportToCSV(window.errorsData, 'errors.csv', ['类型', '错误信息', '文件名', '行号']);
    } else {
      alert('没有可导出的错误数据');
    }
  };
  
  // 初始化下拉菜单
  initDropdownMenu();
  
  // 初始化URL复制功能
  addUrlCopyFunctionality();
});