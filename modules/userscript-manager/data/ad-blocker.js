export default `// 智能广告屏蔽器
class AdBlocker {
    constructor() {
        this.adSelectors = [
            '[class*="ad"]', '[id*="ad"]', '[class*="advertisement"]',
            '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',
            'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
            '.google-ads', '.adsense', '[data-ad-slot]'
        ];
        
        this.adKeywords = ['advertisement', 'sponsored', '广告', '推广'];
        this.blockedCount = 0;
        this.isEnabled = true;
        this.init();
    }
    
    init() {
        this.blockAds();
        this.observeChanges();
        this.addToggleButton();
        this.createCounter();
    }
    
    blockAds() {
        if (!this.isEnabled) return;
        
        this.adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (this.isAd(el) && !el.dataset.adBlocked) {
                    this.hideElement(el);
                    el.dataset.adBlocked = 'true';
                    this.blockedCount++;
                }
            });
        });
        
        // 检查文本内容包含广告关键词的元素
        document.querySelectorAll('*').forEach(el => {
            if (this.containsAdKeywords(el.textContent) && !el.dataset.adBlocked) {
                this.hideElement(el);
                el.dataset.adBlocked = 'true';
                this.blockedCount++;
            }
        });
        
        this.updateCounter();
    }
    
    isAd(element) {
        const rect = element.getBoundingClientRect();
        const commonAdSizes = [
            [728, 90], [300, 250], [336, 280], [320, 50], [468, 60]
        ];
        
        return commonAdSizes.some(([width, height]) => 
            Math.abs(rect.width - width) < 10 && Math.abs(rect.height - height) < 10
        );
    }
    
    containsAdKeywords(text) {
        if (!text || text.length > 100) return false;
        return this.adKeywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    hideElement(element) {
        if (this.isEnabled) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
        }
    }
    
    showElement(element) {
        element.style.display = '';
        element.style.visibility = '';
        element.style.opacity = '';
    }
    
    observeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.checkElement(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    checkElement(element) {
        if (!this.isEnabled) return;
        
        this.adSelectors.forEach(selector => {
            if (element.matches && element.matches(selector)) {
                if (this.isAd(element) && !element.dataset.adBlocked) {
                    this.hideElement(element);
                    element.dataset.adBlocked = 'true';
                    this.blockedCount++;
                    this.updateCounter();
                }
            }
        });
        
        // 检查子元素
        element.querySelectorAll && element.querySelectorAll('*').forEach(child => {
            this.adSelectors.forEach(selector => {
                if (child.matches && child.matches(selector)) {
                    if (this.isAd(child) && !child.dataset.adBlocked) {
                        this.hideElement(child);
                        child.dataset.adBlocked = 'true';
                        this.blockedCount++;
                        this.updateCounter();
                    }
                }
            });
        });
    }
    
    createCounter() {
        const counter = document.createElement('div');
        counter.id = 'adBlockerCounter';
        counter.style.cssText = \`
            position: fixed;
            top: 10px;
            left: 10px;
            background: #dc3545;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        \`;
        
        document.body.appendChild(counter);
        this.updateCounter();
    }
    
    updateCounter() {
        const counter = document.getElementById('adBlockerCounter');
        if (counter) {
            counter.textContent = \`🛡️ 已屏蔽 \${this.blockedCount} 个广告\`;
        }
    }
    
    createToggleButton() {
        // 避免重复创建
        if (document.getElementById('adBlockerToggle')) return;
        
        const button = document.createElement('button');
        button.id = 'adBlockerToggle';
        button.style.cssText = \`
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        \`;
        
        button.textContent = \`🛡️ 已屏蔽 \${this.blockedCount} 个广告\`;
        
        button.addEventListener('click', () => {
            this.toggle();
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(button);
    }
    
    addToggleButton() {
        this.createToggleButton();
    }
    
    toggle() {
        this.isEnabled = !this.isEnabled;
        const button = document.getElementById('adBlockerToggle');
        
        if (this.isEnabled) {
            this.blockAds();
            button.style.background = '#dc3545';
            button.textContent = \`🛡️ 已屏蔽 \${this.blockedCount} 个广告\`;
        } else {
            this.showAllAds();
            button.style.background = '#6c757d';
            button.textContent = \`👁️ 显示 \${this.blockedCount} 个广告\`;
        }
    }
    
    showAllAds() {
        document.querySelectorAll('[data-ad-blocked="true"]').forEach(el => {
            this.showElement(el);
        });
    }
}

// 初始化广告屏蔽器
const adBlocker = new AdBlocker();

// 添加快捷键支持（Ctrl+Shift+A 切换广告屏蔽）
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        adBlocker.toggle();
    }
});`;