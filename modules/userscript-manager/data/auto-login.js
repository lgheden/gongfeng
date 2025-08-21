export default `// 自动登录助手
function autoLogin() {
    const config = {
        'github.com': { user: '#login_field', pass: '#password', submit: '[name="commit"]' },
        'stackoverflow.com': { user: '#email', pass: '#password', submit: '#submit-button' },
        'default': { user: 'input[type="email"], input[name*="user"], input[name*="login"]', pass: 'input[type="password"]', submit: 'button[type="submit"], input[type="submit"]' }
    };
    
    const domain = window.location.hostname;
    const siteConfig = config[domain] || config.default;
    
    const userField = document.querySelector(siteConfig.user);
    const passField = document.querySelector(siteConfig.pass);
    const submitBtn = document.querySelector(siteConfig.submit);
    
    if (userField && passField) {
        const savedUser = localStorage.getItem('autoLogin_user_' + domain);
        const savedPass = localStorage.getItem('autoLogin_pass_' + domain);
        
        if (savedUser && savedPass) {
            userField.value = savedUser;
            passField.value = atob(savedPass);
            
            if (submitBtn && confirm('检测到保存的登录信息，是否自动登录？')) {
                submitBtn.click();
            }
        } else {
            // 显示保存登录信息的界面
            showSaveLoginUI(userField, passField, domain);
        }
    }
}

function showSaveLoginUI(userField, passField, domain) {
    // 创建保存登录信息的UI
    const saveUI = document.createElement('div');
    saveUI.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
    \`;
    
    saveUI.innerHTML = \`
        <div style="margin-bottom: 10px; font-weight: bold; color: #007bff;">💾 保存登录信息</div>
        <div style="margin-bottom: 8px; color: #666;">是否保存当前网站的登录信息？</div>
        <div style="display: flex; gap: 8px;">
            <button id="saveLoginBtn" style="flex: 1; padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            <button id="cancelSaveBtn" style="flex: 1; padding: 6px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
        </div>
    \`;
    
    document.body.appendChild(saveUI);
    
    // 保存按钮事件
    document.getElementById('saveLoginBtn').addEventListener('click', () => {
        const username = userField.value;
        const password = passField.value;
        
        if (username && password) {
            localStorage.setItem('autoLogin_user_' + domain, username);
            localStorage.setItem('autoLogin_pass_' + domain, btoa(password));
            
            saveUI.innerHTML = '<div style="color: #28a745; font-weight: bold;">✅ 登录信息已保存</div>';
            setTimeout(() => {
                document.body.removeChild(saveUI);
            }, 2000);
        }
    });
    
    // 取消按钮事件
    document.getElementById('cancelSaveBtn').addEventListener('click', () => {
        document.body.removeChild(saveUI);
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (document.body.contains(saveUI)) {
            document.body.removeChild(saveUI);
        }
    }, 10000);
}

// 添加清除保存信息的功能
function clearSavedLogin() {
    const domain = window.location.hostname;
    localStorage.removeItem('autoLogin_user_' + domain);
    localStorage.removeItem('autoLogin_pass_' + domain);
    alert('已清除保存的登录信息');
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoLogin);
} else {
    autoLogin();
}

// 添加快捷键支持（Ctrl+Shift+L 清除保存的登录信息）
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        clearSavedLogin();
    }
});`;