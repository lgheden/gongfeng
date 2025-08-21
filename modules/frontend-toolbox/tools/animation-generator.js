/**
 * 动画生成器工具
 * 提供CSS动画和关键帧生成功能
 */
class AnimationGenerator {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.updateAnimationPreview();
    }

    initElements() {
        this.animationType = document.getElementById('animationType');
        this.animationDuration = document.getElementById('animationDuration');
        this.animationDelay = document.getElementById('animationDelay');
        this.animationEasing = document.getElementById('animationEasing');
        this.animationIteration = document.getElementById('animationIteration');
        this.animationDirection = document.getElementById('animationDirection');
        this.animationPreview = document.getElementById('animationPreview');
        this.animatedElement = document.querySelector('.animated-element');
        this.animationOutput = document.getElementById('animationOutput');
        this.generateAnimationBtn = document.getElementById('generateAnimationBtn');
        this.clearAnimationBtn = document.getElementById('clearAnimationBtn');
        this.copyAnimationBtn = document.getElementById('copyAnimationBtn');
        this.playAnimationBtn = document.getElementById('playAnimationBtn');
        
        // 数值显示元素
        this.animationDurationValue = document.getElementById('animationDurationValue');
        this.animationDelayValue = document.getElementById('animationDelayValue');
    }

    bindEvents() {
        // 绑定滑块事件
        this.animationDuration.addEventListener('input', () => {
            this.animationDurationValue.textContent = this.animationDuration.value + 's';
            this.updateAnimationPreview();
        });

        this.animationDelay.addEventListener('input', () => {
            this.animationDelayValue.textContent = this.animationDelay.value + 's';
            this.updateAnimationPreview();
        });

        // 绑定选择器事件
        this.animationType.addEventListener('change', () => this.updateAnimationPreview());
        this.animationEasing.addEventListener('change', () => this.updateAnimationPreview());
        this.animationIteration.addEventListener('change', () => this.updateAnimationPreview());
        this.animationDirection.addEventListener('change', () => this.updateAnimationPreview());

        // 绑定按钮事件
        this.generateAnimationBtn.addEventListener('click', () => this.generateCSS());
        this.clearAnimationBtn.addEventListener('click', () => this.clearAll());
        this.copyAnimationBtn.addEventListener('click', () => this.copyCSS());
        this.playAnimationBtn.addEventListener('click', () => this.playAnimation());
    }

    updateAnimationPreview() {
        const type = this.animationType.value;
        const duration = this.animationDuration.value + 's';
        const delay = this.animationDelay.value + 's';
        const easing = this.animationEasing.value;
        const iteration = this.animationIteration.value;
        const direction = this.animationDirection.value;

        // 清除现有动画
        this.animatedElement.style.animation = 'none';
        this.animatedElement.offsetHeight; // 触发重排

        // 生成动画名称
        const animationName = `animation-${type}`;

        // 创建或更新关键帧动画
        this.createKeyframes(type, animationName);

        // 应用动画
        this.animatedElement.style.animation = `${animationName} ${duration} ${easing} ${delay} ${iteration} ${direction}`;
    }

    createKeyframes(type, animationName) {
        // 移除现有的关键帧
        const existingKeyframes = document.querySelector(`style[data-animation="${animationName}"]`);
        if (existingKeyframes) {
            existingKeyframes.remove();
        }

        let keyframes = '';
        switch (type) {
            case 'fade':
                keyframes = `
                    0% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                `;
                break;
            case 'slide':
                keyframes = `
                    0% { transform: translateX(-100px); opacity: 0; }
                    50% { transform: translateX(20px); opacity: 0.8; }
                    100% { transform: translateX(0); opacity: 1; }
                `;
                break;
            case 'scale':
                keyframes = `
                    0% { transform: scale(0.5) rotate(0deg); }
                    50% { transform: scale(1.2) rotate(180deg); }
                    100% { transform: scale(1) rotate(360deg); }
                `;
                break;
            case 'rotate':
                keyframes = `
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                `;
                break;
            case 'bounce':
                keyframes = `
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-30px); }
                    70% { transform: translateY(-15px); }
                    90% { transform: translateY(-4px); }
                `;
                break;
            case 'custom':
                keyframes = `
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    25% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
                    50% { transform: translateY(0) scale(0.9); opacity: 0.6; }
                    75% { transform: translateY(20px) scale(1.05); opacity: 0.8; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                `;
                break;
            default:
                keyframes = `
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                `;
        }

        // 创建样式元素
        const style = document.createElement('style');
        style.setAttribute('data-animation', animationName);
        style.textContent = `@keyframes ${animationName} {${keyframes}}`;
        document.head.appendChild(style);
    }

    playAnimation() {
        // 重新触发动画
        this.animatedElement.style.animation = 'none';
        this.animatedElement.offsetHeight; // 触发重排
        this.updateAnimationPreview();
    }

    generateCSS() {
        const type = this.animationType.value;
        const duration = this.animationDuration.value + 's';
        const delay = this.animationDelay.value + 's';
        const easing = this.animationEasing.value;
        const iteration = this.animationIteration.value;
        const direction = this.animationDirection.value;

        const animationName = `my-${type}-animation`;

        let keyframes = '';
        switch (type) {
            case 'fade':
                keyframes = `
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 0.8; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }`;
                break;
            case 'slide':
                keyframes = `
    0% { transform: translateX(-100px); opacity: 0; }
    50% { transform: translateX(20px); opacity: 0.8; }
    100% { transform: translateX(0); opacity: 1; }`;
                break;
            case 'scale':
                keyframes = `
    0% { transform: scale(0.5) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }`;
                break;
            case 'rotate':
                keyframes = `
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }`;
                break;
            case 'bounce':
                keyframes = `
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-30px); }
    70% { transform: translateY(-15px); }
    90% { transform: translateY(-4px); }`;
                break;
            case 'custom':
                keyframes = `
    0% { transform: translateY(0) scale(1); opacity: 1; }
    25% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
    50% { transform: translateY(0) scale(0.9); opacity: 0.6; }
    75% { transform: translateY(20px) scale(1.05); opacity: 0.8; }
    100% { transform: translateY(0) scale(1); opacity: 1; }`;
                break;
        }

        const css = `/* 关键帧动画定义 */
@keyframes ${animationName} {${keyframes}
}

/* 应用动画的元素 */
.animated-element {
    animation: ${animationName} ${duration} ${easing} ${delay} ${iteration} ${direction};
    /* 其他样式 */
    width: 80px;
    height: 60px;
    background: linear-gradient(45deg, #007bff, #28a745);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 12px;
    font-weight: bold;
}`;

        this.animationOutput.value = css;
        this.showNotification('动画CSS代码已生成！');
    }

    clearAll() {
        this.animationType.value = 'fade';
        this.animationDuration.value = 1;
        this.animationDelay.value = 0;
        this.animationEasing.value = 'ease';
        this.animationIteration.value = 1;
        this.animationDirection.value = 'normal';
        
        this.animationDurationValue.textContent = '1s';
        this.animationDelayValue.textContent = '0s';
        
        this.animationOutput.value = '';
        this.animatedElement.style.animation = 'none';
        this.showNotification('已清空所有设置！');
    }

    copyCSS() {
        if (this.animationOutput.value) {
            navigator.clipboard.writeText(this.animationOutput.value).then(() => {
                this.showNotification('CSS代码已复制到剪贴板！');
            }).catch(() => {
                this.showNotification('复制失败，请手动复制！');
            });
        } else {
            this.showNotification('请先生成CSS代码！');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 当DOM加载完成后初始化工具
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在动画生成器工具页面
    if (document.getElementById('animation-generator')) {
        new AnimationGenerator();
    }
}); 