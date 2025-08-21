export default `// GitHub增强功能
function addGitHubEnhancements() {
    // 添加复制仓库按钮
    addCopyRepoButton();
    
    // 显示文件大小
    showFileSizes();
    
    // 添加快速导航
    addQuickNavigation();
}

function addCopyRepoButton() {
    const repoHeader = document.querySelector('[data-testid="repository-container-header"]');
    if (!repoHeader) return;
    
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋 复制仓库地址';
    copyBtn.style.cssText = \`
        background: #238636;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        margin-left: 8px;
        font-size: 14px;
    \`;
    
    copyBtn.addEventListener('click', () => {
        const repoUrl = window.location.href.split('?')[0].split('#')[0];
        navigator.clipboard.writeText(repoUrl + '.git').then(() => {
            copyBtn.innerHTML = '✅ 已复制';
            setTimeout(() => {
                copyBtn.innerHTML = '📋 复制仓库地址';
            }, 2000);
        });
    });
    
    const actionList = repoHeader.querySelector('[data-testid="repository-container-header"] .d-flex');
    if (actionList) {
        actionList.appendChild(copyBtn);
    }
}

function showFileSizes() {
    const fileRows = document.querySelectorAll('[role="row"][data-testid="file-row"]');
    
    fileRows.forEach(row => {
        if (row.querySelector('.file-size-display')) return; // 已添加
        
        const fileLink = row.querySelector('a[title]');
        if (!fileLink) return;
        
        const fileName = fileLink.textContent.trim();
        const isFile = !row.querySelector('[aria-label="Directory"]');
        
        if (isFile) {
            // 模拟文件大小（实际应用中可通过API获取）
            const randomSize = Math.floor(Math.random() * 10000) + 100;
            const sizeText = formatFileSize(randomSize);
            
            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'file-size-display';
            sizeSpan.textContent = sizeText;
            sizeSpan.style.cssText = \`
                color: #656d76;
                font-size: 12px;
                margin-left: 8px;
            \`;
            
            const nameCell = row.querySelector('[role="gridcell"]:first-child');
            if (nameCell) {
                nameCell.appendChild(sizeSpan);
            }
        }
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function addQuickNavigation() {
    const quickNav = document.createElement('div');
    quickNav.style.cssText = \`
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: #24292f;
        border-radius: 8px;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    \`;
    
    const navItems = [
        { text: '📁 代码', path: '' },
        { text: '📋 Issues', path: '/issues' },
        { text: '🔀 Pull requests', path: '/pulls' },
        { text: '📊 Insights', path: '/pulse' },
        { text: '⚙️ Settings', path: '/settings' }
    ];
    
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = window.location.pathname.split('/').slice(0, 3).join('') + item.path;
        link.textContent = item.text;
        link.style.cssText = \`
            display: block;
            color: #f0f6fc;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 4px;
            margin-bottom: 4px;
            font-size: 14px;
            transition: background 0.2s;
        \`;
        
        link.addEventListener('mouseenter', () => {
            link.style.background = '#30363d';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
        });
        
        quickNav.appendChild(link);
    });
    
    document.body.appendChild(quickNav);
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addGitHubEnhancements);
} else {
    addGitHubEnhancements();
}

// 监听页面变化（SPA路由）
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(addGitHubEnhancements, 1000);
    }
}).observe(document, { subtree: true, childList: true });`;