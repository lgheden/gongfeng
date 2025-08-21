/**
 * 前端工具箱主逻辑
 */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化工具
    const tool = new FrontendToolboxTool();

    // 全局变量
    let currentData = null;
    let generateCount = 0;

    // 初始化
    init();

    function init() {
        bindEvents();
        updateStats();
        showStatus('前端工具箱已加载', 'info');
    }

    function bindEvents() {
        // 工具切换事件
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.addEventListener('click', switchTool);
        });

        // CSS生成器事件
        bindCssGeneratorEvents();
        
        // 代码格式化事件
        bindCodeFormatterEvents();
        
        // 颜色工具事件
        bindColorToolEvents();

        // 渐变生成器事件
        bindGradientGeneratorEvents();

        // 阴影生成器事件
        bindShadowGeneratorEvents();

        // Flexbox生成器事件
        bindFlexboxGeneratorEvents();
    }

    function switchTool(event) {
        const targetTool = event.target.dataset.tool;
        
        // 更新标签状态
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新内容区域
        document.querySelectorAll('.tool-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTool).classList.add('active');
        
        // 更新统计信息
        updateCurrentTool(targetTool);
        showStatus(`已切换到${event.target.textContent}`, 'info');
    }

    function bindCssGeneratorEvents() {
        const widthRange = document.getElementById('widthRange');
        const heightRange = document.getElementById('heightRange');
        const borderRadiusRange = document.getElementById('borderRadiusRange');
        const bgColor = document.getElementById('bgColor');
        const generateCssBtn = document.getElementById('generateCssBtn');
        const clearCssBtn = document.getElementById('clearCssBtn');
        const copyCssBtn = document.getElementById('copyCssBtn');

        // 实时预览
        [widthRange, heightRange, borderRadiusRange, bgColor].forEach(element => {
            if (element) {
                element.addEventListener('input', updateCssPreview);
            }
        });

        // 按钮事件
        if (generateCssBtn) {
            generateCssBtn.addEventListener('click', generateCSS);
        }
        if (clearCssBtn) {
            clearCssBtn.addEventListener('click', clearCssGenerator);
        }
        if (copyCssBtn) {
            copyCssBtn.addEventListener('click', copyCssResult);
        }

        // 初始化预览
        updateCssPreview();
    }

    function bindCodeFormatterEvents() {
        const formatBtn = document.getElementById('formatBtn');
        const minifyBtn = document.getElementById('minifyBtn');
        const clearFormatBtn = document.getElementById('clearFormatBtn');
        const copyFormatBtn = document.getElementById('copyFormatBtn');

        if (formatBtn) {
            formatBtn.addEventListener('click', formatCode);
        }
        if (minifyBtn) {
            minifyBtn.addEventListener('click', minifyCode);
        }
        if (clearFormatBtn) {
            clearFormatBtn.addEventListener('click', clearCodeFormatter);
        }
        if (copyFormatBtn) {
            copyFormatBtn.addEventListener('click', copyFormatResult);
        }
    }

    function bindColorToolEvents() {
        const hexInput = document.getElementById('hexInput');
        const rgbInput = document.getElementById('rgbInput');
        const hslInput = document.getElementById('hslInput');
        const colorPicker = document.getElementById('colorPicker');
        const convertColorBtn = document.getElementById('convertColorBtn');
        const clearColorBtn = document.getElementById('clearColorBtn');
        const copyColorBtn = document.getElementById('copyColorBtn');

        // 输入事件
        [hexInput, rgbInput, hslInput, colorPicker].forEach(element => {
            if (element) {
                element.addEventListener('input', updateColorPreview);
            }
        });

        // 按钮事件
        if (convertColorBtn) {
            convertColorBtn.addEventListener('click', convertColor);
        }
        if (clearColorBtn) {
            clearColorBtn.addEventListener('click', clearColorTool);
        }
        if (copyColorBtn) {
            copyColorBtn.addEventListener('click', copyColorResult);
        }
    }

    // CSS生成器功能
    function updateCssPreview() {
        const width = document.getElementById('widthRange').value;
        const height = document.getElementById('heightRange').value;
        const borderRadius = document.getElementById('borderRadiusRange').value;
        const bgColor = document.getElementById('bgColor').value;
        const preview = document.getElementById('cssPreview');

        if (preview) {
            preview.style.width = width + 'px';
            preview.style.height = height + 'px';
            preview.style.backgroundColor = bgColor;
            preview.style.borderRadius = borderRadius + 'px';
        }

        // 更新显示值
        document.getElementById('widthValue').textContent = width + 'px';
        document.getElementById('heightValue').textContent = height + 'px';
        document.getElementById('borderRadiusValue').textContent = borderRadius + 'px';
    }

    function generateCSS() {
        try {
            const options = {
                elementType: document.getElementById('elementType').value,
                width: parseInt(document.getElementById('widthRange').value),
                height: parseInt(document.getElementById('heightRange').value),
                backgroundColor: document.getElementById('bgColor').value,
                borderRadius: parseInt(document.getElementById('borderRadiusRange').value)
            };

            const result = tool.generateCSS(options);
            document.getElementById('cssOutput').value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('CSS代码生成成功', 'success');
        } catch (error) {
            showStatus(`生成失败: ${error.message}`, 'error');
        }
    }

    function clearCssGenerator() {
        document.getElementById('cssOutput').value = '';
        currentData = null;
        showStatus('已清空CSS生成器', 'info');
    }

    function copyCssResult() {
        copyToClipboard(currentData, 'CSS代码');
    }

    // 代码格式化功能
    function formatCode() {
        const codeInput = document.getElementById('codeInput');
        const codeType = document.getElementById('codeType');
        const codeOutput = document.getElementById('codeOutput');

        if (!codeInput.value.trim()) {
            showStatus('请输入要格式化的代码', 'warning');
            return;
        }

        try {
            const result = tool.formatCode(codeInput.value, codeType.value);
            codeOutput.value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('代码格式化成功', 'success');
        } catch (error) {
            showStatus(`格式化失败: ${error.message}`, 'error');
        }
    }

    function minifyCode() {
        const codeInput = document.getElementById('codeInput');
        const codeType = document.getElementById('codeType');
        const codeOutput = document.getElementById('codeOutput');

        if (!codeInput.value.trim()) {
            showStatus('请输入要压缩的代码', 'warning');
            return;
        }

        try {
            const result = tool.minifyCode(codeInput.value, codeType.value);
            codeOutput.value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('代码压缩成功', 'success');
        } catch (error) {
            showStatus(`压缩失败: ${error.message}`, 'error');
        }
    }

    function clearCodeFormatter() {
        document.getElementById('codeInput').value = '';
        document.getElementById('codeOutput').value = '';
        currentData = null;
        showStatus('已清空代码格式化器', 'info');
    }

    function copyFormatResult() {
        copyToClipboard(currentData, '格式化代码');
    }

    // 颜色工具功能
    function updateColorPreview() {
        const colorPicker = document.getElementById('colorPicker');
        const preview = document.getElementById('colorPreview');
        
        if (colorPicker && preview) {
            preview.style.backgroundColor = colorPicker.value;
        }
    }

    function convertColor() {
        const hexInput = document.getElementById('hexInput');
        const rgbInput = document.getElementById('rgbInput');
        const hslInput = document.getElementById('hslInput');
        const colorPicker = document.getElementById('colorPicker');
        const colorOutput = document.getElementById('colorOutput');

        let inputColor = '';
        let fromFormat = '';

        // 确定输入的颜色和格式
        if (hexInput.value.trim()) {
            inputColor = hexInput.value.trim();
            fromFormat = 'hex';
        } else if (rgbInput.value.trim()) {
            inputColor = rgbInput.value.trim();
            fromFormat = 'rgb';
        } else if (hslInput.value.trim()) {
            inputColor = hslInput.value.trim();
            fromFormat = 'hsl';
        } else if (colorPicker.value) {
            inputColor = colorPicker.value;
            fromFormat = 'hex';
        } else {
            showStatus('请输入颜色值', 'warning');
            return;
        }

        try {
            const result = tool.convertColor(inputColor, fromFormat);
            const outputHtml = `
                <div><strong>HEX:</strong> ${result.hex}</div>
                <div><strong>RGB:</strong> ${result.rgb}</div>
                <div><strong>RGBA:</strong> ${result.rgba}</div>
                <div><strong>HSL:</strong> ${result.hsl}</div>
                <div><strong>HSLA:</strong> ${result.hsla}</div>
            `;
            colorOutput.innerHTML = outputHtml;
            currentData = JSON.stringify(result, null, 2);
            generateCount++;
            updateStats();
            showStatus('颜色转换成功', 'success');
        } catch (error) {
            showStatus(`转换失败: ${error.message}`, 'error');
        }
    }

    function clearColorTool() {
        document.getElementById('hexInput').value = '';
        document.getElementById('rgbInput').value = '';
        document.getElementById('hslInput').value = '';
        document.getElementById('colorOutput').innerHTML = '';
        currentData = null;
        showStatus('已清空颜色工具', 'info');
    }

    function copyColorResult() {
        copyToClipboard(currentData, '颜色转换结果');
    }

    // 渐变生成器功能
    function bindGradientGeneratorEvents() {
        const generateGradientBtn = document.getElementById('generateGradientBtn');
        const clearGradientBtn = document.getElementById('clearGradientBtn');
        const copyGradientBtn = document.getElementById('copyGradientBtn');
        const addColorStopBtn = document.getElementById('addColorStop');
        const gradientType = document.getElementById('gradientType');
        const gradientDirection = document.getElementById('gradientDirection');

        // 按钮事件
        if (generateGradientBtn) {
            generateGradientBtn.addEventListener('click', generateGradient);
        }
        if (clearGradientBtn) {
            clearGradientBtn.addEventListener('click', clearGradientGenerator);
        }
        if (copyGradientBtn) {
            copyGradientBtn.addEventListener('click', copyGradientResult);
        }
        if (addColorStopBtn) {
            addColorStopBtn.addEventListener('click', addColorStop);
        }

        // 实时预览
        [gradientType, gradientDirection].forEach(element => {
            if (element) {
                element.addEventListener('change', updateGradientPreview);
            }
        });

        // 绑定颜色停止点事件
        bindColorStopsEvents();
        updateGradientPreview();
    }

    function bindColorStopsEvents() {
        const colorStops = document.querySelectorAll('.color-stop');
        colorStops.forEach(stop => {
            const colorInput = stop.querySelector('input[type="color"]');
            const rangeInput = stop.querySelector('input[type="range"]');
            const removeBtn = stop.querySelector('.remove-stop');

            if (colorInput) {
                colorInput.addEventListener('input', updateGradientPreview);
            }
            if (rangeInput) {
                rangeInput.addEventListener('input', (e) => {
                    const span = stop.querySelector('span');
                    if (span) {
                        span.textContent = e.target.value + '%';
                    }
                    updateGradientPreview();
                });
            }
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (colorStops.length > 2) {
                        stop.remove();
                        updateGradientPreview();
                    }
                });
            }
        });
    }

    function addColorStop() {
        const colorStopsContainer = document.getElementById('colorStops');
        const newStop = document.createElement('div');
        newStop.className = 'color-stop';
        newStop.innerHTML = `
            <input type="color" value="#00ff00">
            <input type="range" min="0" max="100" value="50">
            <span>50%</span>
            <button class="remove-stop">×</button>
        `;
        colorStopsContainer.appendChild(newStop);
        bindColorStopsEvents();
        updateGradientPreview();
    }

    function updateGradientPreview() {
        const gradientType = document.getElementById('gradientType').value;
        const gradientDirection = document.getElementById('gradientDirection').value;
        const colorStops = document.querySelectorAll('.color-stop');
        const preview = document.getElementById('gradientPreview');

        const stops = Array.from(colorStops).map(stop => {
            const color = stop.querySelector('input[type="color"]').value;
            const position = stop.querySelector('input[type="range"]').value;
            return { color, position: parseInt(position) };
        });

        let gradient = '';
        if (gradientType === 'linear') {
            gradient = `linear-gradient(${gradientDirection}`;
        } else {
            gradient = 'radial-gradient(circle';
        }

        const stopsStr = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
        gradient += `, ${stopsStr})`;

        if (preview) {
            preview.style.background = gradient;
        }
    }

    function generateGradient() {
        try {
            const gradientType = document.getElementById('gradientType').value;
            const gradientDirection = document.getElementById('gradientDirection').value;
            const colorStops = document.querySelectorAll('.color-stop');

            const stops = Array.from(colorStops).map(stop => {
                const color = stop.querySelector('input[type="color"]').value;
                const position = stop.querySelector('input[type="range"]').value;
                return { color, position: parseInt(position) };
            });

            const options = {
                type: gradientType,
                direction: gradientDirection,
                colorStops: stops
            };

            const result = tool.generateGradient(options);
            document.getElementById('gradientOutput').value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('渐变CSS生成成功', 'success');
        } catch (error) {
            showStatus(`生成失败: ${error.message}`, 'error');
        }
    }

    function clearGradientGenerator() {
        document.getElementById('gradientOutput').value = '';
        currentData = null;
        showStatus('已清空渐变生成器', 'info');
    }

    function copyGradientResult() {
        copyToClipboard(currentData, '渐变CSS代码');
    }

    // 阴影生成器功能
    function bindShadowGeneratorEvents() {
        const generateShadowBtn = document.getElementById('generateShadowBtn');
        const clearShadowBtn = document.getElementById('clearShadowBtn');
        const copyShadowBtn = document.getElementById('copyShadowBtn');
        const hOffset = document.getElementById('hOffset');
        const vOffset = document.getElementById('vOffset');
        const blurRadius = document.getElementById('blurRadius');
        const spreadRadius = document.getElementById('spreadRadius');
        const shadowColor = document.getElementById('shadowColor');
        const shadowOpacity = document.getElementById('shadowOpacity');

        // 按钮事件
        if (generateShadowBtn) {
            generateShadowBtn.addEventListener('click', generateShadow);
        }
        if (clearShadowBtn) {
            clearShadowBtn.addEventListener('click', clearShadowGenerator);
        }
        if (copyShadowBtn) {
            copyShadowBtn.addEventListener('click', copyShadowResult);
        }

        // 实时预览
        [hOffset, vOffset, blurRadius, spreadRadius, shadowColor, shadowOpacity].forEach(element => {
            if (element) {
                element.addEventListener('input', updateShadowPreview);
            }
        });

        updateShadowPreview();
    }

    function updateShadowPreview() {
        const hOffset = document.getElementById('hOffset').value;
        const vOffset = document.getElementById('vOffset').value;
        const blurRadius = document.getElementById('blurRadius').value;
        const spreadRadius = document.getElementById('spreadRadius').value;
        const shadowColor = document.getElementById('shadowColor').value;
        const shadowOpacity = document.getElementById('shadowOpacity').value;
        const preview = document.getElementById('shadowPreview');

        // 更新显示值
        document.getElementById('hOffsetValue').textContent = hOffset + 'px';
        document.getElementById('vOffsetValue').textContent = vOffset + 'px';
        document.getElementById('blurRadiusValue').textContent = blurRadius + 'px';
        document.getElementById('spreadRadiusValue').textContent = spreadRadius + 'px';
        document.getElementById('shadowOpacityValue').textContent = shadowOpacity + '%';

        if (preview) {
            const opacity = shadowOpacity / 100;
            const rgbaColor = tool.hexToRgba(shadowColor, opacity);
            const shadow = `${hOffset}px ${vOffset}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
            preview.style.boxShadow = shadow;
        }
    }

    function generateShadow() {
        try {
            const options = {
                hOffset: parseInt(document.getElementById('hOffset').value),
                vOffset: parseInt(document.getElementById('vOffset').value),
                blurRadius: parseInt(document.getElementById('blurRadius').value),
                spreadRadius: parseInt(document.getElementById('spreadRadius').value),
                color: document.getElementById('shadowColor').value,
                opacity: parseInt(document.getElementById('shadowOpacity').value) / 100
            };

            const result = tool.generateShadow(options);
            document.getElementById('shadowOutput').value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('阴影CSS生成成功', 'success');
        } catch (error) {
            showStatus(`生成失败: ${error.message}`, 'error');
        }
    }

    function clearShadowGenerator() {
        document.getElementById('shadowOutput').value = '';
        currentData = null;
        showStatus('已清空阴影生成器', 'info');
    }

    function copyShadowResult() {
        copyToClipboard(currentData, '阴影CSS代码');
    }

    // Flexbox生成器功能
    function bindFlexboxGeneratorEvents() {
        const generateFlexBtn = document.getElementById('generateFlexBtn');
        const clearFlexBtn = document.getElementById('clearFlexBtn');
        const copyFlexBtn = document.getElementById('copyFlexBtn');
        const flexDirection = document.getElementById('flexDirection');
        const justifyContent = document.getElementById('justifyContent');
        const alignItems = document.getElementById('alignItems');
        const flexWrap = document.getElementById('flexWrap');
        const flexGap = document.getElementById('flexGap');

        // 按钮事件
        if (generateFlexBtn) {
            generateFlexBtn.addEventListener('click', generateFlexbox);
        }
        if (clearFlexBtn) {
            clearFlexBtn.addEventListener('click', clearFlexboxGenerator);
        }
        if (copyFlexBtn) {
            copyFlexBtn.addEventListener('click', copyFlexboxResult);
        }

        // 实时预览
        [flexDirection, justifyContent, alignItems, flexWrap, flexGap].forEach(element => {
            if (element) {
                element.addEventListener('change', updateFlexboxPreview);
                element.addEventListener('input', updateFlexboxPreview);
            }
        });

        updateFlexboxPreview();
    }

    function updateFlexboxPreview() {
        const flexDirection = document.getElementById('flexDirection').value;
        const justifyContent = document.getElementById('justifyContent').value;
        const alignItems = document.getElementById('alignItems').value;
        const flexWrap = document.getElementById('flexWrap').value;
        const flexGap = document.getElementById('flexGap').value;
        const preview = document.getElementById('flexPreview');

        // 更新显示值
        document.getElementById('flexGapValue').textContent = flexGap + 'px';

        if (preview) {
            preview.style.display = 'flex';
            preview.style.flexDirection = flexDirection;
            preview.style.justifyContent = justifyContent;
            preview.style.alignItems = alignItems;
            preview.style.flexWrap = flexWrap;
            preview.style.gap = flexGap + 'px';
        }
    }

    function generateFlexbox() {
        try {
            const options = {
                flexDirection: document.getElementById('flexDirection').value,
                justifyContent: document.getElementById('justifyContent').value,
                alignItems: document.getElementById('alignItems').value,
                flexWrap: document.getElementById('flexWrap').value,
                gap: document.getElementById('flexGap').value
            };

            const result = tool.generateFlexbox(options);
            document.getElementById('flexOutput').value = result;
            currentData = result;
            generateCount++;
            updateStats();
            showStatus('Flexbox CSS生成成功', 'success');
        } catch (error) {
            showStatus(`生成失败: ${error.message}`, 'error');
        }
    }

    function clearFlexboxGenerator() {
        document.getElementById('flexOutput').value = '';
        currentData = null;
        showStatus('已清空Flexbox生成器', 'info');
    }

    function copyFlexboxResult() {
        copyToClipboard(currentData, 'Flexbox CSS代码');
    }

    // 通用功能
    function copyToClipboard(text, description) {
        if (!text) {
            showStatus('没有可复制的内容', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();
            showStatus(`${description}已复制到剪贴板`, 'success');
        }).catch(() => {
            showStatus('复制失败', 'error');
        });
    }

    function updateStats() {
        const generateCountElement = document.getElementById('generateCount');
        if (generateCountElement) {
            generateCountElement.textContent = generateCount;
        }
    }

    function updateCurrentTool(toolName) {
        const currentToolElement = document.getElementById('currentTool');
        if (currentToolElement) {
            const toolNames = {
                'css-generator': 'CSS生成器',
                'code-formatter': '代码格式化',
                'color-tools': '颜色工具'
            };
            currentToolElement.textContent = toolNames[toolName] || toolName;
        }
    }

    function showStatus(message, type = 'info') {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            const colors = {
                'success': '#28a745',
                'error': '#dc3545',
                'warning': '#ffc107',
                'info': '#17a2b8'
            };
            
            statusBar.style.color = colors[type] || colors.info;
            statusBar.textContent = message;
            
            setTimeout(() => {
                statusBar.textContent = '';
            }, 3000);
        }
    }

    function showCopyNotification() {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = '✓ 已复制';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // 键盘快捷键
    document.addEventListener('keydown', function(event) {
        // Ctrl+Enter 处理当前工具
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            const activeTool = document.querySelector('.tool-tab.active').dataset.tool;
            
            switch (activeTool) {
                case 'css-generator':
                    generateCSS();
                    break;
                case 'code-formatter':
                    formatCode();
                    break;
                case 'color-tools':
                    convertColor();
                    break;
            }
        }
        
        // Ctrl+Shift+C 复制
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            if (currentData) {
                copyToClipboard(currentData, '当前结果');
            }
        }
    });
}); 