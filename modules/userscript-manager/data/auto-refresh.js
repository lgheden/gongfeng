export default `// 网页自动刷新器
let refreshTimer = null;
let countdownTimer = null;
let isRefreshing = false;
let refreshInterval = 30; // 默认30秒

// 创建控制面板
const panel = document.createElement('div');
panel.style.cssText = \`
    position: fixed; top: 10px; right: 10px; z-index: 10000;
    background: white; border: 2px solid #007bff; border-radius: 8px;
    padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-family: Arial, sans-serif; font-size: 14px;
    min-width: 200px;
\`;

panel.innerHTML = \`
    <div style="margin-bottom: 10px; font-weight: bold; color: #007bff;">🔄 自动刷新</div>
    <div style="margin-bottom: 10px;">
        <label>刷新间隔: </label>
        <input type="number" id="refreshInterval" value="30" min="1" max="3600" style="width: 60px; padding: 2px;"> 秒
    </div>
    <div style="margin-bottom: 10px;">
        <button id="toggleRefresh" style="width: 48%; padding: 6px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">开始</button>
        <button id="refreshNow" style="width: 48%; padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 4%;">立即刷新</button>
    </div>
    <div id="countdown" style="text-align: center; color: #666; font-size: 12px;"></div>
\`;

document.body.appendChild(panel);

const intervalInput = document.getElementById('refreshInterval');
const toggleBtn = document.getElementById('toggleRefresh');
const refreshNowBtn = document.getElementById('refreshNow');
const countdownDiv = document.getElementById('countdown');

intervalInput.addEventListener('change', () => {
    refreshInterval = parseInt(intervalInput.value) || 30;
    if (isRefreshing) {
        stopRefresh();
        startRefresh();
    }
});

function startRefresh() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    toggleBtn.textContent = '停止';
    toggleBtn.style.background = '#dc3545';
    
    let timeLeft = refreshInterval;
    
    function updateCountdown() {
        countdownDiv.textContent = \`下次刷新: \${timeLeft}秒\`;
        timeLeft--;
        
        if (timeLeft < 0) {
            location.reload();
        }
    }
    
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
    
    refreshTimer = setTimeout(() => {
        location.reload();
    }, refreshInterval * 1000);
}

function stopRefresh() {
    if (!isRefreshing) return;
    
    isRefreshing = false;
    toggleBtn.textContent = '开始';
    toggleBtn.style.background = '#28a745';
    countdownDiv.textContent = '';
    
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

toggleBtn.addEventListener('click', () => {
    if (isRefreshing) {
        stopRefresh();
    } else {
        startRefresh();
    }
});

refreshNowBtn.addEventListener('click', () => {
    location.reload();
});

// 页面卸载时清理定时器
window.addEventListener('beforeunload', () => {
    stopRefresh();
});`;