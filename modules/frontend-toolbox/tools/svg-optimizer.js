/**
 * SVG优化器工具
 * 提供SVG代码压缩和优化功能
 */
class SVGOptimizer {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.svgOptimizationLevel = document.getElementById('svgOptimizationLevel');
        this.keepIds = document.getElementById('keepIds');
        this.keepClasses = document.getElementById('keepClasses');
        this.keepComments = document.getElementById('keepComments');
        this.keepMetadata = document.getElementById('keepMetadata');
        this.svgPrecision = document.getElementById('svgPrecision');
        this.svgInput = document.getElementById('svgInput');
        this.svgPreview = document.getElementById('svgPreview');
        this.svgOutput = document.getElementById('svgOutput');
        this.optimizeSvgBtn = document.getElementById('optimizeSvgBtn');
        this.clearSvgBtn = document.getElementById('clearSvgBtn');
        this.copySvgBtn = document.getElementById('copySvgBtn');
        
        // 统计元素
        this.originalSize = document.getElementById('originalSize');
        this.optimizedSize = document.getElementById('optimizedSize');
        this.compressionRatio = document.getElementById('compressionRatio');
        this.svgPrecisionValue = document.getElementById('svgPrecisionValue');
    }

    bindEvents() {
        // 绑定精度滑块事件
        this.svgPrecision.addEventListener('input', () => {
            this.svgPrecisionValue.textContent = this.svgPrecision.value + '位小数';
        });

        // 绑定输入事件
        this.svgInput.addEventListener('input', () => {
            this.updatePreview();
        });

        // 绑定按钮事件
        this.optimizeSvgBtn.addEventListener('click', () => this.optimizeSVG());
        this.clearSvgBtn.addEventListener('click', () => this.clearAll());
        this.copySvgBtn.addEventListener('click', () => this.copySVG());
    }

    updatePreview() {
        const svgCode = this.svgInput.value.trim();
        if (svgCode) {
            this.svgPreview.innerHTML = svgCode;
        } else {
            this.svgPreview.innerHTML = '<p>SVG预览区域</p>';
        }
    }

    optimizeSVG() {
        const svgCode = this.svgInput.value.trim();
        if (!svgCode) {
            this.showNotification('请先输入SVG代码！');
            return;
        }

        try {
            // 解析SVG
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgCode, 'image/svg+xml');
            const svgElement = doc.querySelector('svg');
            
            if (!svgElement) {
                throw new Error('无效的SVG代码');
            }

            // 计算原始大小
            const originalSize = new Blob([svgCode]).size;
            this.originalSize.textContent = this.formatBytes(originalSize);

            // 优化SVG
            const optimizedSVG = this.optimizeSVGElement(svgElement);

            // 计算优化后大小
            const optimizedSize = new Blob([optimizedSVG]).size;
            this.optimizedSize.textContent = this.formatBytes(optimizedSize);

            // 计算压缩率
            const ratio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
            this.compressionRatio.textContent = ratio + '%';

            // 显示优化结果
            this.svgOutput.value = optimizedSVG;
            this.svgPreview.innerHTML = optimizedSVG;

            this.showNotification(`SVG优化完成！压缩率: ${ratio}%`);
        } catch (error) {
            this.showNotification('SVG优化失败: ' + error.message);
        }
    }

    optimizeSVGElement(svgElement) {
        const optimizationLevel = parseInt(this.svgOptimizationLevel.value);
        const precision = parseInt(this.svgPrecision.value);
        const keepIds = this.keepIds.checked;
        const keepClasses = this.keepClasses.checked;
        const keepComments = this.keepComments.checked;
        const keepMetadata = this.keepMetadata.checked;

        // 克隆SVG元素进行优化
        const optimizedSvg = svgElement.cloneNode(true);

        // 根据优化级别应用不同的优化策略
        switch (optimizationLevel) {
            case 1: // 轻度优化
                this.lightOptimization(optimizedSvg, precision, keepIds, keepClasses, keepComments, keepMetadata);
                break;
            case 2: // 中度优化
                this.mediumOptimization(optimizedSvg, precision, keepIds, keepClasses, keepComments, keepMetadata);
                break;
            case 3: // 深度优化
                this.deepOptimization(optimizedSvg, precision, keepIds, keepClasses, keepComments, keepMetadata);
                break;
        }

        return optimizedSvg.outerHTML;
    }

    lightOptimization(svg, precision, keepIds, keepClasses, keepComments, keepMetadata) {
        // 移除空白和换行
        this.removeWhitespace(svg);
        
        // 优化数值精度
        this.optimizeNumbers(svg, precision);
        
        // 移除不必要的属性
        this.removeUnnecessaryAttributes(svg, keepIds, keepClasses, keepComments, keepMetadata);
    }

    mediumOptimization(svg, precision, keepIds, keepClasses, keepComments, keepMetadata) {
        this.lightOptimization(svg, precision, keepIds, keepClasses, keepComments, keepMetadata);
        
        // 合并重复的样式
        this.mergeStyles(svg);
        
        // 优化路径
        this.optimizePaths(svg, precision);
        
        // 移除空元素
        this.removeEmptyElements(svg);
    }

    deepOptimization(svg, precision, keepIds, keepClasses, keepComments, keepMetadata) {
        this.mediumOptimization(svg, precision, keepIds, keepClasses, keepComments, keepMetadata);
        
        // 简化路径
        this.simplifyPaths(svg, precision);
        
        // 合并相似的图形
        this.mergeSimilarShapes(svg);
        
        // 移除隐藏元素
        this.removeHiddenElements(svg);
    }

    removeWhitespace(element) {
        // 移除文本节点中的空白
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = node.textContent.replace(/\s+/g, ' ').trim();
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.removeWhitespace(node);
            }
        }
    }

    optimizeNumbers(element, precision) {
        const numberAttributes = ['x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'd'];
        
        for (let attr of numberAttributes) {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                const optimized = this.roundNumber(value, precision);
                element.setAttribute(attr, optimized);
            }
        }

        // 递归处理子元素
        for (let child of element.children) {
            this.optimizeNumbers(child, precision);
        }
    }

    roundNumber(value, precision) {
        // 处理路径数据和其他数值
        return value.replace(/-?\d+\.?\d*/g, (match) => {
            const num = parseFloat(match);
            return isNaN(num) ? match : num.toFixed(precision);
        });
    }

    removeUnnecessaryAttributes(element, keepIds, keepClasses, keepComments, keepMetadata) {
        const unnecessaryAttrs = ['xmlns:xlink', 'version', 'xml:space'];
        
        if (!keepIds) unnecessaryAttrs.push('id');
        if (!keepClasses) unnecessaryAttrs.push('class');
        if (!keepComments) {
            // 移除注释节点
            for (let node of element.childNodes) {
                if (node.nodeType === Node.COMMENT_NODE) {
                    node.remove();
                }
            }
        }
        if (!keepMetadata) {
            // 移除metadata元素
            const metadata = element.querySelector('metadata');
            if (metadata) metadata.remove();
        }

        for (let attr of unnecessaryAttrs) {
            if (element.hasAttribute(attr)) {
                element.removeAttribute(attr);
            }
        }

        // 递归处理子元素
        for (let child of element.children) {
            this.removeUnnecessaryAttributes(child, keepIds, keepClasses, keepComments, keepMetadata);
        }
    }

    mergeStyles(element) {
        // 简单的样式合并逻辑
        const elementsWithStyle = element.querySelectorAll('[style]');
        elementsWithStyle.forEach(el => {
            const style = el.getAttribute('style');
            // 移除重复的样式声明
            const styles = style.split(';').filter(s => s.trim());
            const uniqueStyles = [...new Set(styles)];
            el.setAttribute('style', uniqueStyles.join(';'));
        });
    }

    optimizePaths(element, precision) {
        const paths = element.querySelectorAll('path');
        paths.forEach(path => {
            if (path.hasAttribute('d')) {
                const d = path.getAttribute('d');
                // 简化路径数据
                const optimized = this.simplifyPathData(d, precision);
                path.setAttribute('d', optimized);
            }
        });
    }

    simplifyPathData(d, precision) {
        // 简化路径数据，移除不必要的空格和重复
        return d
            .replace(/\s+/g, ' ')
            .replace(/([MLHVCSQTAZmlhvcsqtaz])\s+/g, '$1')
            .replace(/\s+([MLHVCSQTAZmlhvcsqtaz])/g, '$1')
            .trim();
    }

    removeEmptyElements(element) {
        const emptyElements = element.querySelectorAll('g, defs, symbol');
        emptyElements.forEach(el => {
            if (el.children.length === 0) {
                el.remove();
            }
        });
    }

    simplifyPaths(element, precision) {
        // 深度路径简化
        const paths = element.querySelectorAll('path');
        paths.forEach(path => {
            if (path.hasAttribute('d')) {
                const d = path.getAttribute('d');
                const simplified = this.deepSimplifyPath(d, precision);
                path.setAttribute('d', simplified);
            }
        });
    }

    deepSimplifyPath(d, precision) {
        // 更复杂的路径简化算法
        return d
            .replace(/([MLHVCSQTAZmlhvcsqtaz])\s*([^MLHVCSQTAZmlhvcsqtaz]*)/g, (match, command, params) => {
                const numbers = params.trim().split(/\s+/).map(n => {
                    const num = parseFloat(n);
                    return isNaN(num) ? n : num.toFixed(precision);
                });
                return command + numbers.join(' ');
            });
    }

    mergeSimilarShapes(element) {
        // 合并相似的图形元素（简化实现）
        const rects = element.querySelectorAll('rect');
        const circles = element.querySelectorAll('circle');
        
        // 这里可以实现更复杂的合并逻辑
        // 目前只是简单的示例
    }

    removeHiddenElements(element) {
        const hiddenElements = element.querySelectorAll('[style*="display:none"], [style*="visibility:hidden"]');
        hiddenElements.forEach(el => el.remove());
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearAll() {
        this.svgInput.value = '';
        this.svgOutput.value = '';
        this.svgPreview.innerHTML = '<p>SVG预览区域</p>';
        this.originalSize.textContent = '0 Bytes';
        this.optimizedSize.textContent = '0 Bytes';
        this.compressionRatio.textContent = '0%';
        this.showNotification('已清空所有内容！');
    }

    copySVG() {
        if (this.svgOutput.value) {
            navigator.clipboard.writeText(this.svgOutput.value).then(() => {
                this.showNotification('优化后的SVG代码已复制到剪贴板！');
            }).catch(() => {
                this.showNotification('复制失败，请手动复制！');
            });
        } else {
            this.showNotification('请先优化SVG代码！');
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
    // 检查是否在SVG优化器工具页面
    if (document.getElementById('svg-optimizer')) {
        new SVGOptimizer();
    }
}); 