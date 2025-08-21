// 颜色转换及配色工具 JavaScript

class ColorPicker {
    constructor() {
        this.currentColor = '#3498db';
        this.currentAlpha = 1.0; // 透明度值 (0-1)
        this.colorHistory = this.loadColorHistory();
        this.initializeElements();
        this.bindEvents();
        this.updateAllFormats(this.currentColor);
        this.renderColorHistory();
    }

    initializeElements() {
        this.colorInput = document.getElementById('colorInput');
        this.colorPreview = document.getElementById('colorPreview');
        this.hexInput = document.getElementById('hexInput');
        this.rgbInput = document.getElementById('rgbInput');
        this.hslInput = document.getElementById('hslInput');
        this.hsvaInput = document.getElementById('hsvaInput');
        this.eyedropperBtn = document.getElementById('eyedropperBtn');
        this.schemeType = document.getElementById('schemeType');
        this.generateScheme = document.getElementById('generateScheme');
        this.colorSchemeDisplay = document.getElementById('colorSchemeDisplay');
        this.saveColor = document.getElementById('saveColor');
        this.clearHistory = document.getElementById('clearHistory');
        this.colorHistoryContainer = document.getElementById('colorHistory');
        this.copyAllFormats = document.getElementById('copyAllFormats');
        this.generateCSS = document.getElementById('generateCSS');
        this.exportPalette = document.getElementById('exportPalette');
        
        // 透明度控制器元素
        this.alphaSlider = document.getElementById('alphaSlider');
        this.alphaInput = document.getElementById('alphaInput');
        
        // 颜色信息元素
        this.brightnessValue = document.getElementById('brightnessValue');
        this.contrastWhite = document.getElementById('contrastWhite');
        this.contrastBlack = document.getElementById('contrastBlack');
        this.readability = document.getElementById('readability');
    }

    bindEvents() {
        // 颜色输入事件
        this.colorInput.addEventListener('input', (e) => {
            this.updateAllFormats(e.target.value);
        });

        // 格式输入事件
        this.hexInput.addEventListener('input', (e) => {
            const value = e.target.value;
            // 支持8位HEX（包含透明度）
            if (value.length === 9 && /^#[A-Fa-f0-9]{8}$/.test(value)) {
                const hex = value.substring(0, 7);
                const alpha = parseInt(value.substring(7, 9), 16) / 255;
                this.currentAlpha = alpha;
                this.alphaSlider.value = Math.round(alpha * 100);
                this.alphaInput.value = Math.round(alpha * 100);
                this.updateAllFormats(hex, false);
            } else if (value.length === 5 && /^#[A-Fa-f0-9]{4}$/.test(value)) {
                // 支持4位HEX（3位颜色+1位透明度）
                const hex = value.substring(0, 4);
                const alpha = parseInt(value.substring(4, 5) + value.substring(4, 5), 16) / 255;
                this.currentAlpha = alpha;
                this.alphaSlider.value = Math.round(alpha * 100);
                this.alphaInput.value = Math.round(alpha * 100);
                this.updateAllFormats(hex, false);
            } else if (this.isValidHex(value)) {
                this.updateAllFormats(value, false);
            } else if (value.length >= 4 && value.startsWith('#')) {
                // 实时预览：即使输入不完整也尝试解析
                const partialHex = value.padEnd(7, '0'); // 用0填充到6位
                if (/^#[A-Fa-f0-9]{6}$/.test(partialHex)) {
                    this.updateAllFormats(partialHex, false);
                }
            }
        });

        this.rgbInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const hex = this.rgbToHex(value);
            if (hex) {
                this.updateAllFormats(hex, false);
            } else {
                // 实时预览：尝试解析部分输入
                const partialMatch = value.match(/rgb\((\d+),?\s*(\d+)?,?\s*(\d+)?/);
                if (partialMatch) {
                    const r = parseInt(partialMatch[1]) || 0;
                    const g = parseInt(partialMatch[2]) || 0;
                    const b = parseInt(partialMatch[3]) || 0;
                    const partialHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    this.updateAllFormats(partialHex, false);
                }
            }
        });

        this.hslInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const hex = this.hslToHex(value);
            if (hex) {
                this.updateAllFormats(hex, false);
            } else {
                // 实时预览：尝试解析部分输入
                const partialMatch = value.match(/hsl\((\d+),?\s*(\d+)?%?,?\s*(\d+)?%?/);
                if (partialMatch) {
                    const h = parseInt(partialMatch[1]) || 0;
                    const s = parseInt(partialMatch[2]) || 0;
                    const l = parseInt(partialMatch[3]) || 50;
                    const partialHex = this.hslToHex(`hsl(${h}, ${s}%, ${l}%)`);
                    if (partialHex) {
                        this.updateAllFormats(partialHex, false);
                    }
                }
            }
        });

        this.hsvaInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const hex = this.hsvaToHex(value);
            if (hex) {
                this.updateAllFormats(hex, false);
            } else {
                // 实时预览：尝试解析部分输入
                const partialMatch = value.match(/hsva?\((\d+),?\s*(\d+)?%?,?\s*(\d+)?%?,?\s*([\d.]+)?/);
                if (partialMatch) {
                    const h = parseInt(partialMatch[1]) || 0;
                    const s = parseInt(partialMatch[2]) || 0;
                    const v = parseInt(partialMatch[3]) || 50;
                    const a = parseFloat(partialMatch[4]) || 1;
                    const partialHex = this.hsvaToHex(`hsva(${h}, ${s}%, ${v}%, ${a})`);
                    if (partialHex) {
                        this.updateAllFormats(partialHex, false);
                    }
                }
            }
        });

        // 透明度控制器事件
        this.alphaSlider.addEventListener('input', (e) => {
            const alphaPercent = parseInt(e.target.value);
            this.currentAlpha = alphaPercent / 100;
            this.alphaInput.value = alphaPercent;
            this.updateAllFormats(this.currentColor, false);
        });

        this.alphaInput.addEventListener('input', (e) => {
            let alphaPercent = parseInt(e.target.value);
            if (isNaN(alphaPercent)) alphaPercent = 100;
            if (alphaPercent < 0) alphaPercent = 0;
            if (alphaPercent > 100) alphaPercent = 100;
            
            this.currentAlpha = alphaPercent / 100;
            this.alphaSlider.value = alphaPercent;
            e.target.value = alphaPercent;
            this.updateAllFormats(this.currentColor, false);
        });

        // 页面取色器
        this.eyedropperBtn.addEventListener('click', () => {
            this.startEyedropper();
        });

        // 配色方案生成
        this.generateScheme.addEventListener('click', () => {
            this.generateColorScheme();
        });

        // 颜色历史操作
        this.saveColor.addEventListener('click', () => {
            this.saveCurrentColor();
        });

        this.clearHistory.addEventListener('click', () => {
            this.clearColorHistory();
        });

        // 复制和导出
        this.copyAllFormats.addEventListener('click', () => {
            this.copyAllColorFormats();
        });

        this.generateCSS.addEventListener('click', () => {
            this.generateCSSCode();
        });

        this.exportPalette.addEventListener('click', () => {
            this.exportColorPalette();
        });

        // 颜色预览点击事件
        this.colorPreview.addEventListener('click', () => {
            this.colorInput.click();
        });
    }

    // 颜色格式转换方法
    hexToRgb(hex) {
        // 支持3位和6位HEX格式
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
        
        // 处理3位HEX格式 (#abc -> #aabbcc)
        result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1] + result[1], 16),
                g: parseInt(result[2] + result[2], 16),
                b: parseInt(result[3] + result[3], 16)
            };
        }
        
        return null;
    }

    rgbToHex(rgb) {
        // 支持 rgba 格式
        let match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] ? parseFloat(match[4]) : 1;
        
        // 更新透明度
        if (match[4]) {
            this.currentAlpha = a;
            this.alphaSlider.value = Math.round(a * 100);
            this.alphaInput.value = Math.round(a * 100);
        }
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;
        
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToHex(hsl) {
        // 支持 hsla 格式
        const match = hsl.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        
        const h = parseInt(match[1]) / 360;
        const s = parseInt(match[2]) / 100;
        const l = parseInt(match[3]) / 100;
        const a = match[4] ? parseFloat(match[4]) : 1;
        
        // 更新透明度
        if (match[4]) {
            this.currentAlpha = a;
            this.alphaSlider.value = Math.round(a * 100);
            this.alphaInput.value = Math.round(a * 100);
        }
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    hexToHsva(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;
        
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
            switch (max) {
                case r: h = ((g - b) / diff) % 6; break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : Math.round((diff / max) * 100);
        const v = Math.round(max * 100);
        
        return { h, s, v, a: 1 };
    }

    // HSVA转HEX
    hsvaToHex(hsva) {
        // 支持 hsva 格式
        const match = hsva.match(/hsva?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        
        const h = parseInt(match[1]);
        const s = parseInt(match[2]) / 100;
        const v = parseInt(match[3]) / 100;
        const a = match[4] ? parseFloat(match[4]) : 1;
        
        // 更新透明度
        if (match[4]) {
            this.currentAlpha = a;
            this.alphaSlider.value = Math.round(a * 100);
            this.alphaInput.value = Math.round(a * 100);
        }
        
        // HSV转RGB
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        
        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    // 将HEX转换为带透明度的8位HEX
    hexToHexAlpha(hex, alpha) {
        if (!this.isValidHex(hex)) return hex;
        
        // 确保是6位HEX
        if (hex.length === 4) {
            // 3位HEX转6位HEX
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        
        // 将alpha转换为16进制
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();
        return hex + alphaHex;
    }

    // 更新透明度滑块背景色
    updateAlphaSliderBackground(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return;
        
        const gradient = `linear-gradient(to right, 
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 0%, 
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) 100%)`;
        
        this.alphaSlider.style.background = gradient;
    }

    // 更新所有格式
    updateAllFormats(color, updateAlpha = true) {
        this.currentColor = color;
        
        // 如果需要更新透明度（从颜色选择器输入时）
        if (updateAlpha) {
            this.currentAlpha = 1.0;
            this.alphaSlider.value = 100;
            this.alphaInput.value = 100;
        }
        
        // 更新颜色预览（包含透明度）
        const rgb = this.hexToRgb(color);
        if (rgb) {
            this.colorPreview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.currentAlpha})`;
        }
        this.colorInput.value = color;
        
        // 更新格式输入框
        this.hexInput.value = this.currentAlpha < 1 ? this.hexToHexAlpha(color, this.currentAlpha) : color.toUpperCase();
        
        if (rgb) {
            this.rgbInput.value = this.currentAlpha < 1 ? 
                `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.currentAlpha.toFixed(2)})` :
                `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        const hsl = this.hexToHsl(color);
        if (hsl) {
            this.hslInput.value = this.currentAlpha < 1 ?
                `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${this.currentAlpha.toFixed(2)})` :
                `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }
        
        const hsva = this.hexToHsva(color);
        if (hsva) {
            this.hsvaInput.value = `hsva(${hsva.h}, ${hsva.s}%, ${hsva.v}%, ${this.currentAlpha.toFixed(2)})`;
        }
        
        // 更新透明度滑块背景色
        this.updateAlphaSliderBackground(color);
        
        // 更新颜色信息
        this.updateColorInfo(color);
        
        // 添加脉冲动画
        this.colorPreview.classList.add('pulse');
        setTimeout(() => {
            this.colorPreview.classList.remove('pulse');
        }, 600);
    }

    // 更新颜色信息
    updateColorInfo(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return;
        
        // 计算亮度
        const brightness = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
        this.brightnessValue.textContent = `${brightness}/255`;
        
        // 计算对比度
        const contrastWhite = this.calculateContrast(rgb, {r: 255, g: 255, b: 255});
        const contrastBlack = this.calculateContrast(rgb, {r: 0, g: 0, b: 0});
        
        this.contrastWhite.textContent = contrastWhite.toFixed(2) + ':1';
        this.contrastBlack.textContent = contrastBlack.toFixed(2) + ':1';
        
        // 可读性评估
        const readability = contrastWhite >= 4.5 ? '良好（白色文字）' : 
                           contrastBlack >= 4.5 ? '良好（黑色文字）' : '较差';
        this.readability.textContent = readability;
    }

    calculateContrast(color1, color2) {
        const getLuminance = (rgb) => {
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }

    // 页面取色器
    async startEyedropper() {
        if (!('EyeDropper' in window)) {
            alert('您的浏览器不支持页面取色功能，请使用Chrome 95+或Edge 95+');
            return;
        }
        
        try {
            this.eyedropperBtn.disabled = true;
            this.eyedropperBtn.textContent = '正在取色...';
            
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            
            this.updateAllFormats(result.sRGBHex);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('取色失败:', error);
                alert('取色失败，请重试');
            }
        } finally {
            this.eyedropperBtn.disabled = false;
            this.eyedropperBtn.innerHTML = '<span class="icon">🎯</span>页面取色';
        }
    }

    // 生成配色方案
    generateColorScheme() {
        const type = this.schemeType.value;
        const baseHsl = this.hexToHsl(this.currentColor);
        if (!baseHsl) return;
        
        let colors = [];
        
        switch (type) {
            case 'monochromatic':
                colors = this.generateMonochromatic(baseHsl);
                break;
            case 'analogous':
                colors = this.generateAnalogous(baseHsl);
                break;
            case 'complementary':
                colors = this.generateComplementary(baseHsl);
                break;
            case 'triadic':
                colors = this.generateTriadic(baseHsl);
                break;
            case 'tetradic':
                colors = this.generateTetradic(baseHsl);
                break;
            case 'splitComplementary':
                colors = this.generateSplitComplementary(baseHsl);
                break;
        }
        
        this.displayColorScheme(colors);
    }

    generateMonochromatic(hsl) {
        const colors = [];
        const variations = [-40, -20, 0, 20, 40];
        
        variations.forEach(variation => {
            const newL = Math.max(10, Math.min(90, hsl.l + variation));
            colors.push(this.hslToHex(`hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`));
        });
        
        return colors;
    }

    generateAnalogous(hsl) {
        const colors = [];
        const hueShifts = [-60, -30, 0, 30, 60];
        
        hueShifts.forEach(shift => {
            const newH = (hsl.h + shift + 360) % 360;
            colors.push(this.hslToHex(`hsl(${newH}, ${hsl.s}%, ${hsl.l}%)`));
        });
        
        return colors;
    }

    generateComplementary(hsl) {
        const complementH = (hsl.h + 180) % 360;
        return [
            this.currentColor,
            this.hslToHex(`hsl(${complementH}, ${hsl.s}%, ${hsl.l}%)`)
        ];
    }

    generateTriadic(hsl) {
        return [
            this.currentColor,
            this.hslToHex(`hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`),
            this.hslToHex(`hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`)
        ];
    }

    generateTetradic(hsl) {
        return [
            this.currentColor,
            this.hslToHex(`hsl(${(hsl.h + 90) % 360}, ${hsl.s}%, ${hsl.l}%)`),
            this.hslToHex(`hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`),
            this.hslToHex(`hsl(${(hsl.h + 270) % 360}, ${hsl.s}%, ${hsl.l}%)`)
        ];
    }

    generateSplitComplementary(hsl) {
        const complementH = (hsl.h + 180) % 360;
        return [
            this.currentColor,
            this.hslToHex(`hsl(${(complementH - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`),
            this.hslToHex(`hsl(${(complementH + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`)
        ];
    }

    displayColorScheme(colors) {
        this.colorSchemeDisplay.innerHTML = '';
        
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'scheme-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.innerHTML = `<span class="color-code">${color.toUpperCase()}</span>`;
            
            colorDiv.addEventListener('click', () => {
                this.updateAllFormats(color);
                navigator.clipboard.writeText(color.toUpperCase()).then(() => {
                    this.showToast('颜色已复制到剪贴板');
                });
            });
            
            this.colorSchemeDisplay.appendChild(colorDiv);
        });
    }

    // 颜色历史管理
    saveCurrentColor() {
        if (!this.colorHistory.includes(this.currentColor)) {
            this.colorHistory.unshift(this.currentColor);
            if (this.colorHistory.length > 20) {
                this.colorHistory.pop();
            }
            this.saveColorHistory();
            this.renderColorHistory();
            this.showToast('颜色已保存到历史记录');
        }
    }

    clearColorHistory() {
        this.colorHistory = [];
        this.saveColorHistory();
        this.renderColorHistory();
        this.showToast('历史记录已清空');
    }

    renderColorHistory() {
        this.colorHistoryContainer.innerHTML = '';
        
        this.colorHistory.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'history-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.title = color.toUpperCase();
            
            colorDiv.addEventListener('click', () => {
                this.updateAllFormats(color);
            });
            
            this.colorHistoryContainer.appendChild(colorDiv);
        });
    }

    loadColorHistory() {
        try {
            return JSON.parse(localStorage.getItem('colorPickerHistory') || '[]');
        } catch {
            return [];
        }
    }

    saveColorHistory() {
        localStorage.setItem('colorPickerHistory', JSON.stringify(this.colorHistory));
    }

    // 复制所有格式
    copyAllColorFormats() {
        const formats = [
            `HEX: ${this.hexInput.value}`,
            `RGB: ${this.rgbInput.value}`,
            `HSL: ${this.hslInput.value}`,
            `HSVA: ${this.hsvaInput.value}`
        ].join('\n');
        
        navigator.clipboard.writeText(formats).then(() => {
            this.showToast('所有颜色格式已复制到剪贴板');
        });
    }

    // 生成CSS代码
    generateCSSCode() {
        const rgb = this.hexToRgb(this.currentColor);
        if (!rgb) return;
        
        const cssCode = `/* CSS颜色代码 */
.color-primary {
    /* HEX格式 */
    color: ${this.hexInput.value};
    background-color: ${this.hexInput.value};
    border-color: ${this.hexInput.value};
}

.color-primary-rgb {
    /* RGB格式 */
    color: ${this.rgbInput.value};
    background-color: ${this.rgbInput.value};
    border-color: ${this.rgbInput.value};
}

.color-primary-hsl {
    /* HSL格式 */
    color: ${this.hslInput.value};
    background-color: ${this.hslInput.value};
    border-color: ${this.hslInput.value};
}

/* CSS变量定义 */
:root {
    --primary-color: ${this.hexInput.value};
    --primary-color-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};
    --primary-color-alpha: ${this.currentAlpha};
}

/* 使用CSS变量 */
.element {
    color: var(--primary-color);
    background-color: rgba(var(--primary-color-rgb), var(--primary-color-alpha));
    box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
}`;
        
        // 创建模态框显示CSS代码
        this.showCSSModal(cssCode);
    }

    // 显示CSS代码模态框
    showCSSModal(cssCode) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'CSS代码生成';
        title.style.cssText = `
            margin: 0 0 16px 0;
            color: #2c3e50;
            font-size: 18px;
            font-weight: 600;
        `;
        
        const codeContainer = document.createElement('pre');
        codeContainer.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            overflow: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            color: #2c3e50;
            white-space: pre-wrap;
            max-height: 400px;
        `;
        codeContainer.textContent = cssCode;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 16px;
        `;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制代码';
        copyButton.style.cssText = `
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        // 事件监听
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(cssCode).then(() => {
                this.showToast('CSS代码已复制到剪贴板');
                document.body.removeChild(modal);
            });
        });
        
        closeButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeButton.click();
            }
        });
        
        // 组装模态框
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(codeContainer);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        
        // 显示模态框
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    // 导出调色板
    exportColorPalette() {
        const schemeColors = Array.from(this.colorSchemeDisplay.children)
            .map(el => el.style.backgroundColor)
            .filter(color => color)
            .map(color => {
                // 转换 rgb 格式到 hex
                const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgb) {
                    const r = parseInt(rgb[1]);
                    const g = parseInt(rgb[2]);
                    const b = parseInt(rgb[3]);
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
                return color;
            });
        
        const palette = {
            name: '调色板',
            colors: schemeColors,
            history: this.colorHistory,
            exportTime: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(palette, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-palette-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('调色板已导出');
    }

    // 显示提示消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: 600;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// 初始化颜色选择器
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});