export default `// 深色模式切换器
class DarkModeToggler {
    constructor() {
        this.isDark = localStorage.getItem('darkMode') === 'true';
        this.init();
    }
    
    init() {
        this.applyDarkMode();
        this.createToggleButton();
        this.addKeyboardShortcut();
    }
    
    applyDarkMode() {
        if (this.isDark) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }
    
    enableDarkMode() {
        // 移除现有的深色模式样式
        const existingStyle = document.getElementById('darkModeStyles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const darkStyles = document.createElement('style');
        darkStyles.id = 'darkModeStyles';
        darkStyles.textContent = \`
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
            
            html, body {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            div, section, article, aside, nav, header, footer, main {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
            }
            
            p, span, h1, h2, h3, h4, h5, h6, li, td, th {
                color: #e0e0e0 !important;
            }
            
            a {
                color: #66b3ff !important;
            }
            
            a:hover {
                color: #99ccff !important;
            }
            
            input, textarea, select {
                background-color: #3a3a3a !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }
            
            button {
                background-color: #4a4a4a !important;
                color: #e0e0e0 !important;
                border-color: #666 !important;
            }
            
            button:hover {
                background-color: #5a5a5a !important;
            }
            
            table {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            tr:nth-child(even) {
                background-color: #3a3a3a !important;
            }
            
            tr:hover {
                background-color: #4a4a4a !important;
            }
            
            code, pre {
                background-color: #1e1e1e !important;
                color: #f8f8f2 !important;
                border-color: #444 !important;
            }
            
            blockquote {
                background-color: #3a3a3a !important;
                border-left-color: #666 !important;
            }
            
            hr {
                border-color: #555 !important;
            }
            
            img {
                opacity: 0.9;
                filter: brightness(0.9);
            }
            
            /* 特殊网站适配 */
            [style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: #ffffff"] {
                background-color: #2d2d2d !important;
            }
            
            [style*="color: black"], [style*="color: #000"], [style*="color: #000000"] {
                color: #e0e0e0 !important;
            }
        \`;
        
        document.head.appendChild(darkStyles);
        this.isDark = true;
        localStorage.setItem('darkMode', 'true');
        this.updateToggleButton();
    }
    
    disableDarkMode() {
        const darkStyles = document.getElementById('darkModeStyles');
        if (darkStyles) {
            darkStyles.remove();
        }
        
        this.isDark = false;
        localStorage.setItem('darkMode', 'false');
        this.updateToggleButton();
    }
    
    toggle() {
        if (this.isDark) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    createToggleButton() {
        // 避免重复创建
        if (document.getElementById('darkModeToggle')) return;
        
        this.toggleButton = document.createElement('div');
        this.toggleButton.id = 'darkModeToggle';
        this.updateToggleButton();
        
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.transform = 'scale(1.1)';
        });
        
        this.toggleButton.addEventListener('mouseleave', () => {
            this.toggleButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(this.toggleButton);
    }
    
    updateToggleButton() {
        if (!this.toggleButton) return;
        
        this.toggleButton.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: \${this.isDark ? '#ffd700' : '#2c3e50'};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
        \`;
        
        this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        this.toggleButton.title = this.isDark ? '切换到浅色模式' : '切换到深色模式';
    }
    
    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + D 切换深色模式
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    // 自动检测系统主题偏好
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem('darkMode')) {
                this.enableDarkMode();
            }
        }
        
        // 监听系统主题变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('darkMode')) {
                    if (e.matches) {
                        this.enableDarkMode();
                    } else {
                        this.disableDarkMode();
                    }
                }
            });
        }
    }
    
    // 智能时间切换
    autoTimeBasedToggle() {
        const hour = new Date().getHours();
        // 晚上6点到早上6点自动开启深色模式
        if ((hour >= 18 || hour < 6) && !localStorage.getItem('darkMode')) {
            this.enableDarkMode();
        }
    }
}

// 初始化深色模式切换器
const darkModeToggler = new DarkModeToggler();

// 检测系统主题偏好
darkModeToggler.detectSystemTheme();

// 智能时间切换（可选）
// darkModeToggler.autoTimeBasedToggle();

// 页面可见性变化时重新应用样式
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            darkModeToggler.applyDarkMode();
        }, 100);
    }
});`;