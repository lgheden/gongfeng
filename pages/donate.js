// 合伙人收款码数据
const partnersData = {
    li: {
        name: '李光恒',
        wechat: '../icons/pay/weixin-li.png',
        alipay: '../icons/pay/alipay-li.png'
    },
    peng: {
        name: '彭女士',
        wechat: '../icons/pay/weixin-peng.png',
        alipay: '../icons/pay/alipay-peng.png'
    },
    zhang: {
        name: '张先生',
        wechat: '../icons/pay/weixin-li.png', // 暂时使用李的收款码
        alipay: '../icons/pay/alipay-li.png'  // 暂时使用李的收款码
    }
};

// 点击合伙人卡片事件
document.addEventListener('DOMContentLoaded', function() {
    const partnerItems = document.querySelectorAll('.partner-item');
    const modal = document.getElementById('qrModal');
    const modalTitle = document.getElementById('modalTitle');
    const qrCodes = document.getElementById('qrCodes');
    const closeBtn = document.querySelector('.close-btn');

    partnerItems.forEach(item => {
        item.addEventListener('click', function() {
            const partnerId = this.getAttribute('data-partner');
            const partnerData = partnersData[partnerId];
            
            if (partnerData) {
                showQRCodes(partnerData);
            }
        });
    });

    function showQRCodes(partnerData) {
        modalTitle.textContent = `${partnerData.name} - 选择支付方式`;
        
        qrCodes.innerHTML = `
            <div class="qr-item wechat">
                <div class="qr-label">
                    <span>💚</span>
                    <span>微信支付</span>
                </div>
                <div class="qr-code">
                    <img src="${partnerData.wechat}" alt="微信收款二维码" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">
                </div>
                <div class="qr-description">使用微信扫一扫(${partnerData.name})</div>
            </div>
            <div class="qr-item alipay">
                <div class="qr-label">
                    <span>💙</span>
                    <span>支付宝</span>
                </div>
                <div class="qr-code">
                    <img src="${partnerData.alipay}" alt="支付宝收款二维码" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">
                </div>
                <div class="qr-description">使用支付宝扫一扫(${partnerData.name})</div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // 关闭按钮点击事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// 关闭模态框
function closeModal() {
    document.getElementById('qrModal').style.display = 'none';
}

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});