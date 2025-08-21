/**
 * 前端工具箱工具类
 */
class FrontendToolboxTool {
    constructor() {
        this.config = {
            defaultIndent: 2,
            maxPreviewSize: 500
        };
    }

    /**
     * CSS生成器
     * @param {object} options - CSS选项
     * @returns {string} 生成的CSS代码
     */
    generateCSS(options) {
        const {
            elementType = 'div',
            width = 200,
            height = 50,
            backgroundColor = '#007bff',
            borderRadius = 0,
            borderWidth = 0,
            borderColor = '#000000',
            borderStyle = 'solid'
        } = options;

        let css = `${elementType} {\n`;
        css += `    width: ${width}px;\n`;
        css += `    height: ${height}px;\n`;
        css += `    background-color: ${backgroundColor};\n`;
        
        if (borderRadius > 0) {
            css += `    border-radius: ${borderRadius}px;\n`;
        }
        
        if (borderWidth > 0) {
            css += `    border: ${borderWidth}px ${borderStyle} ${borderColor};\n`;
        }
        
        css += `}`;
        
        return css;
    }

    /**
     * 代码格式化
     * @param {string} code - 要格式化的代码
     * @param {string} type - 代码类型
     * @returns {string} 格式化后的代码
     */
    formatCode(code, type = 'javascript') {
        try {
            switch (type) {
                case 'json':
                    return this.formatJSON(code);
                case 'javascript':
                    return this.formatJavaScript(code);
                case 'css':
                    return this.formatCSS(code);
                case 'html':
                    return this.formatHTML(code);
                default:
                    return code;
            }
        } catch (error) {
            throw new Error(`格式化失败: ${error.message}`);
        }
    }

    /**
     * 代码压缩
     * @param {string} code - 要压缩的代码
     * @param {string} type - 代码类型
     * @returns {string} 压缩后的代码
     */
    minifyCode(code, type = 'javascript') {
        try {
            switch (type) {
                case 'json':
                    return JSON.stringify(JSON.parse(code));
                case 'javascript':
                    return this.minifyJavaScript(code);
                case 'css':
                    return this.minifyCSS(code);
                case 'html':
                    return this.minifyHTML(code);
                default:
                    return code;
            }
        } catch (error) {
            throw new Error(`压缩失败: ${error.message}`);
        }
    }

    /**
     * 颜色转换工具
     * @param {string} color - 输入颜色
     * @param {string} fromFormat - 输入格式
     * @returns {object} 转换结果
     */
    convertColor(color, fromFormat = 'hex') {
        try {
            let rgb, hex, hsl;

            switch (fromFormat) {
                case 'hex':
                    rgb = this.hexToRgb(color);
                    hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
                    hex = color;
                    break;
                case 'rgb':
                    const rgbValues = color.match(/\d+/g);
                    if (rgbValues && rgbValues.length >= 3) {
                        rgb = { r: parseInt(rgbValues[0]), g: parseInt(rgbValues[1]), b: parseInt(rgbValues[2]) };
                        hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
                        hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                    } else {
                        throw new Error('无效的RGB格式');
                    }
                    break;
                case 'hsl':
                    const hslValues = color.match(/\d+/g);
                    if (hslValues && hslValues.length >= 3) {
                        const h = parseInt(hslValues[0]);
                        const s = parseInt(hslValues[1]);
                        const l = parseInt(hslValues[2]);
                        rgb = this.hslToRgb(h, s, l);
                        hsl = { h, s, l };
                        hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                    } else {
                        throw new Error('无效的HSL格式');
                    }
                    break;
                default:
                    throw new Error('不支持的颜色格式');
            }

            return {
                hex: hex,
                rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
                hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
                hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`
            };
        } catch (error) {
            throw new Error(`颜色转换失败: ${error.message}`);
        }
    }

    // 私有方法：颜色转换辅助函数
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) throw new Error('无效的HEX颜色格式');
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

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

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

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

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // 私有方法：代码格式化辅助函数
    formatJSON(code) {
        return JSON.stringify(JSON.parse(code), null, this.config.defaultIndent);
    }

    formatJavaScript(code) {
        return code
            .replace(/;\s*/g, ';\n')
            .replace(/\{\s*/g, ' {\n')
            .replace(/\s*\}/g, '\n}')
            .replace(/\n\s*\n/g, '\n');
    }

    formatCSS(code) {
        return code
            .replace(/\s*\{\s*/g, ' {\n    ')
            .replace(/\s*;\s*/g, ';\n    ')
            .replace(/\s*\}\s*/g, '\n}\n');
    }

    formatHTML(code) {
        return code
            .replace(/>\s*</g, '>\n<')
            .replace(/\n\s*\n/g, '\n');
    }

    minifyJavaScript(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,=])\s*/g, '$1')
            .trim();
    }

    minifyCSS(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,])\s*/g, '$1')
            .trim();
    }

    minifyHTML(code) {
        return code
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s+/g, ' ')
            .replace(/>\s*</g, '><')
            .trim();
    }

    /**
     * 验证输入
     */
    validateInput(input, type = 'text') {
        if (!input || typeof input !== 'string') {
            throw new Error('输入内容无效');
        }
        
        switch (type) {
            case 'hex':
                return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(input);
            case 'rgb':
                return /^\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$/.test(input);
            case 'hsl':
                return /^\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*$/.test(input);
            default:
                return true;
        }
    }

    /**
     * 渐变生成器
     * @param {object} options - 渐变选项
     * @returns {string} 生成的CSS渐变代码
     */
    generateGradient(options) {
        const {
            type = 'linear',
            direction = 'to right',
            colorStops = [
                { color: '#ff0000', position: 0 },
                { color: '#0000ff', position: 100 }
            ]
        } = options;

        let gradient = '';
        
        if (type === 'linear') {
            gradient = `linear-gradient(${direction}`;
        } else {
            gradient = 'radial-gradient(circle';
        }

        const stops = colorStops.map(stop => 
            `${stop.color} ${stop.position}%`
        ).join(', ');

        gradient += `, ${stops})`;
        
        return `background: ${gradient};`;
    }

    /**
     * 阴影生成器
     * @param {object} options - 阴影选项
     * @returns {string} 生成的CSS阴影代码
     */
    generateShadow(options) {
        const {
            hOffset = 5,
            vOffset = 5,
            blurRadius = 10,
            spreadRadius = 0,
            color = '#000000',
            opacity = 0.3
        } = options;

        const rgbaColor = this.hexToRgba(color, opacity);
        const shadow = `${hOffset}px ${vOffset}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
        
        return `box-shadow: ${shadow};`;
    }

    /**
     * Flexbox生成器
     * @param {object} options - Flexbox选项
     * @returns {string} 生成的CSS Flexbox代码
     */
    generateFlexbox(options) {
        const {
            flexDirection = 'row',
            justifyContent = 'flex-start',
            alignItems = 'stretch',
            flexWrap = 'nowrap',
            gap = '0'
        } = options;

        let css = 'display: flex;\n';
        css += `flex-direction: ${flexDirection};\n`;
        css += `justify-content: ${justifyContent};\n`;
        css += `align-items: ${alignItems};\n`;
        css += `flex-wrap: ${flexWrap};\n`;
        
        if (gap !== '0') {
            css += `gap: ${gap}px;\n`;
        }

        return css;
    }

    /**
     * 将HEX颜色转换为RGBA
     * @param {string} hex - HEX颜色值
     * @param {number} opacity - 透明度 (0-1)
     * @returns {string} RGBA颜色值
     */
    hexToRgba(hex, opacity) {
        const rgb = this.hexToRgb(hex);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    /**
     * 生成CSS动画
     * @param {object} options - 动画选项
     * @returns {string} 生成的CSS动画代码
     */
    generateAnimation(options) {
        const {
            name = 'myAnimation',
            duration = '1s',
            timingFunction = 'ease',
            delay = '0s',
            iterationCount = '1',
            direction = 'normal',
            fillMode = 'none',
            keyframes = [
                { offset: 0, properties: { opacity: 0, transform: 'translateY(20px)' } },
                { offset: 100, properties: { opacity: 1, transform: 'translateY(0)' } }
            ]
        } = options;

        let css = `@keyframes ${name} {\n`;
        keyframes.forEach(keyframe => {
            css += `    ${keyframe.offset}% {\n`;
            Object.entries(keyframe.properties).forEach(([prop, value]) => {
                css += `        ${prop}: ${value};\n`;
            });
            css += `    }\n`;
        });
        css += `}\n\n`;
        css += `.animated-element {\n`;
        css += `    animation: ${name} ${duration} ${timingFunction} ${delay} ${iterationCount} ${direction} ${fillMode};\n`;
        css += `}`;

        return css;
    }

    /**
     * 生成CSS网格布局
     * @param {object} options - 网格选项
     * @returns {string} 生成的CSS网格代码
     */
    generateGrid(options) {
        const {
            columns = 'repeat(3, 1fr)',
            rows = 'auto',
            gap = '10px',
            justifyItems = 'stretch',
            alignItems = 'stretch',
            justifyContent = 'start',
            alignContent = 'start'
        } = options;

        let css = 'display: grid;\n';
        css += `grid-template-columns: ${columns};\n`;
        css += `grid-template-rows: ${rows};\n`;
        css += `gap: ${gap};\n`;
        css += `justify-items: ${justifyItems};\n`;
        css += `align-items: ${alignItems};\n`;
        css += `justify-content: ${justifyContent};\n`;
        css += `align-content: ${alignContent};\n`;

        return css;
    }

    /**
     * 生成CSS变换
     * @param {object} options - 变换选项
     * @returns {string} 生成的CSS变换代码
     */
    generateTransform(options) {
        const {
            translateX = '0',
            translateY = '0',
            scaleX = '1',
            scaleY = '1',
            rotate = '0deg',
            skewX = '0deg',
            skewY = '0deg'
        } = options;

        const transforms = [];
        
        if (translateX !== '0' || translateY !== '0') {
            transforms.push(`translate(${translateX}, ${translateY})`);
        }
        if (scaleX !== '1' || scaleY !== '1') {
            transforms.push(`scale(${scaleX}, ${scaleY})`);
        }
        if (rotate !== '0deg') {
            transforms.push(`rotate(${rotate})`);
        }
        if (skewX !== '0deg' || skewY !== '0deg') {
            transforms.push(`skew(${skewX}, ${skewY})`);
        }

        if (transforms.length === 0) {
            return 'transform: none;';
        }

        return `transform: ${transforms.join(' ')};`;
    }

    /**
     * 生成CSS过渡
     * @param {object} options - 过渡选项
     * @returns {string} 生成的CSS过渡代码
     */
    generateTransition(options) {
        const {
            properties = 'all',
            duration = '0.3s',
            timingFunction = 'ease',
            delay = '0s'
        } = options;

        return `transition: ${properties} ${duration} ${timingFunction} ${delay};`;
    }

    /**
     * 生成CSS边框
     * @param {object} options - 边框选项
     * @returns {string} 生成的CSS边框代码
     */
    generateBorder(options) {
        const {
            width = '1px',
            style = 'solid',
            color = '#000000',
            radius = '0'
        } = options;

        let css = `border: ${width} ${style} ${color};\n`;
        
        if (radius !== '0') {
            css += `border-radius: ${radius};\n`;
        }

        return css;
    }

    /**
     * 生成CSS字体
     * @param {object} options - 字体选项
     * @returns {string} 生成的CSS字体代码
     */
    generateFont(options) {
        const {
            family = 'Arial, sans-serif',
            size = '16px',
            weight = 'normal',
            style = 'normal',
            lineHeight = '1.5'
        } = options;

        return `font: ${style} ${weight} ${size}/${lineHeight} ${family};`;
    }

    /**
     * 生成CSS背景
     * @param {object} options - 背景选项
     * @returns {string} 生成的CSS背景代码
     */
    generateBackground(options) {
        const {
            color = 'transparent',
            image = 'none',
            repeat = 'repeat',
            position = '0% 0%',
            size = 'auto',
            attachment = 'scroll'
        } = options;

        return `background: ${color} ${image} ${repeat} ${attachment} ${position}/${size};`;
    }
} 