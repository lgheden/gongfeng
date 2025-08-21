export default `// 百度Logo替换为Google
// 等待页面加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceLogo);
} else {
    replaceLogo();
}

function replaceLogo() {
    // 查找百度Logo
    const baiduLogo = document.querySelector('#lg img, .s_lg_img, [src*="baidu"][alt*="logo"], [src*="baidu"][alt*="百度"]');
    
    if (baiduLogo) {
        // 替换为Google Logo
        baiduLogo.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
        baiduLogo.alt = 'Google';
        baiduLogo.style.maxHeight = '92px';
        baiduLogo.style.width = 'auto';
        baiduAuto('百度Logo已替换')
        console.log('百度Logo已替换为Google Logo');
    } else {
        console.log('未找到百度Logo元素');
    }
    
    // 监听动态加载的内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 元素节点
                    const logo = node.querySelector ? node.querySelector('[src*="baidu"][alt*="logo"], [src*="baidu"][alt*="百度"]') : null;
                    if (logo) {
                        logo.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
                        logo.alt = 'Google';
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}`;