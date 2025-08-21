// 时间戳转换工具 JavaScript

class TimestampConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentTime();
        this.startCurrentTimeUpdate();
        this.initializeDateTime();
        
        // 初始化时间戳单位的默认值
        this.timestampUnit.dataset.previousValue = this.timestampUnit.value;
    }

    initializeElements() {
        // 当前时间显示
        this.currentTimestampSec = document.getElementById('currentTimestampSec');
        this.currentTimestampMs = document.getElementById('currentTimestampMs');
        this.currentDateTime = document.getElementById('currentDateTime');
        
        // 时间戳转日期
        this.timestampInput = document.getElementById('timestampInput');
        this.timestampUnit = document.getElementById('timestampUnit');
        this.localTime = document.getElementById('localTime');
        this.utcTime = document.getElementById('utcTime');
        this.isoTime = document.getElementById('isoTime');
        this.relativeTime = document.getElementById('relativeTime');
        
        // 日期转时间戳
        this.dateInput = document.getElementById('dateInput');
        this.timeInput = document.getElementById('timeInput');
        this.manualDateTimeInput = document.getElementById('manualDateTimeInput');
        this.timezoneSelect = document.getElementById('timezoneSelect');
        this.resultTimestampSec = document.getElementById('resultTimestampSec');
        this.resultTimestampMs = document.getElementById('resultTimestampMs');
        this.resultIsoTime = document.getElementById('resultIsoTime');
        
        // 格式示例
        this.formatInputs = {
            format1: document.getElementById('format1'),
            format2: document.getElementById('format2'),
            format3: document.getElementById('format3'),
            format4: document.getElementById('format4'),
            format5: document.getElementById('format5'),
            format6: document.getElementById('format6')
        };
        
        // 时间计算器
        this.baseTimestamp = document.getElementById('baseTimestamp');
        this.calcResult = document.getElementById('calcResult');
        
        // 状态栏
        this.statusBar = document.getElementById('statusBar');
    }

    bindEvents() {
        // 按钮事件
        document.getElementById('nowBtn').addEventListener('click', () => this.setCurrentTimestamp());
        document.getElementById('convertBtn').addEventListener('click', () => this.convertAll());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('copyTimestampBtn').addEventListener('click', () => this.copyCurrentTimestamp());
        document.getElementById('copyDateBtn').addEventListener('click', () => this.copyCurrentDate());
        
        // 输入事件
        this.timestampInput.addEventListener('input', () => this.convertTimestampToDate());
        this.timestampUnit.addEventListener('change', () => this.handleTimestampUnitChange());
        
        this.dateInput.addEventListener('change', () => this.convertDateToTimestamp());
        this.timeInput.addEventListener('change', () => this.convertDateToTimestamp());
        this.manualDateTimeInput.addEventListener('input', () => this.convertManualDateTimeToTimestamp());
        this.timezoneSelect.addEventListener('change', () => this.convertDateToTimestamp());
        
        // 快速时间戳按钮
        document.querySelectorAll('.timestamp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickTimestamp(e));
        });
        
        // 计算器按钮
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCalculation(e));
        });
        
        // 基准时间戳输入
        this.baseTimestamp.addEventListener('input', () => this.updateCalculatorBase());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // 更新当前时间显示
    updateCurrentTime() {
        const now = new Date();
        const timestampSec = Math.floor(now.getTime() / 1000);
        const timestampMs = now.getTime();
        
        this.currentTimestampSec.value = timestampSec;
        this.currentTimestampMs.value = timestampMs;
        this.currentDateTime.value = this.formatDateTime(now);
        
        // 更新格式示例
        this.updateFormatExamples(now);
    }

    // 开始定时更新当前时间
    startCurrentTimeUpdate() {
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    // 初始化日期时间输入
    initializeDateTime() {
        const now = new Date();
        this.dateInput.value = now.toISOString().split('T')[0];
        this.timeInput.value = now.toTimeString().split(' ')[0];
        this.convertDateToTimestamp();
    }

    // 设置当前时间戳
    setCurrentTimestamp() {
        const now = Date.now();
        this.timestampInput.value = now;
        this.timestampUnit.value = 'milliseconds';
        this.timestampUnit.dataset.previousValue = 'milliseconds';
        this.convertTimestampToDate();
        this.showStatus('已设置为当前时间戳', 'success');
    }

    // 转换所有
    convertAll() {
        this.convertTimestampToDate();
        this.convertDateToTimestamp();
        this.showStatus('转换完成', 'success');
    }

    // 清空所有
    clearAll() {
        // 清空时间戳输入
        this.timestampInput.value = '';
        this.localTime.value = '';
        this.utcTime.value = '';
        this.isoTime.value = '';
        this.relativeTime.value = '';
        
        // 清空计算器
        this.baseTimestamp.value = '';
        this.calcResult.value = '';
        
        // 重置日期时间为当前
        this.initializeDateTime();
        
        this.showStatus('已清空所有输入', 'success');
    }

    // 复制当前时间戳
    copyCurrentTimestamp() {
        const timestamp = this.currentTimestampSec.value;
        this.copyToClipboard(timestamp, '当前时间戳已复制');
    }

    // 复制当前日期
    copyCurrentDate() {
        const dateTime = this.currentDateTime.value;
        this.copyToClipboard(dateTime, '当前日期时间已复制');
    }

    // 处理时间戳单位切换
    handleTimestampUnitChange() {
        const input = this.timestampInput.value.trim();
        if (!input) {
            this.convertTimestampToDate();
            return;
        }

        try {
            let timestamp = parseInt(input);
            if (isNaN(timestamp)) {
                this.convertTimestampToDate();
                return;
            }

            const currentUnit = this.timestampUnit.value;
            const previousUnit = this.timestampUnit.dataset.previousValue || 'seconds';
            
            // 如果单位发生了变化，转换时间戳值
            if (currentUnit !== previousUnit) {
                if (previousUnit === 'seconds' && currentUnit === 'milliseconds') {
                    // 从秒转换为毫秒：乘以1000
                    timestamp = timestamp * 1000;
                } else if (previousUnit === 'milliseconds' && currentUnit === 'seconds') {
                    // 从毫秒转换为秒：除以1000
                    timestamp = Math.floor(timestamp / 1000);
                }
                
                this.timestampInput.value = timestamp;
            }
            
            // 记录当前单位作为下次比较的基准
            this.timestampUnit.dataset.previousValue = currentUnit;
            
        } catch (error) {
            // 转换出错时忽略，直接进行日期转换
        }
        
        // 重新转换日期
        this.convertTimestampToDate();
    }

    // 时间戳转日期
    convertTimestampToDate() {
        const input = this.timestampInput.value.trim();
        if (!input) {
            this.clearTimestampResults();
            return;
        }

        try {
            let timestamp = parseInt(input);
            if (isNaN(timestamp)) {
                throw new Error('无效的时间戳格式');
            }

            let date;
            // 根据单位转换
            if (this.timestampUnit.value === 'milliseconds') {
                // 毫秒时间戳直接创建Date对象
                date = new Date(timestamp);
                // 验证毫秒时间戳范围（1970-2100年之间）
                if (timestamp < 0 || timestamp > 4102444800000) {
                    throw new Error('时间戳超出有效范围');
                }
            } else {
                // 秒时间戳需要乘以1000
                date = new Date(timestamp * 1000);
                // 验证秒时间戳范围（1970-2100年之间）
                if (timestamp < 0 || timestamp > 4102444800) {
                    throw new Error('时间戳超出有效范围');
                }
            }
            
            this.localTime.value = this.formatDateTime(date);
            this.utcTime.value = this.formatDateTime(date, true);
            this.isoTime.value = date.toISOString();
            this.relativeTime.value = this.getRelativeTime(date);
            
            // 更新格式示例
            this.updateFormatExamples(date);
            
            // 移除错误样式
            this.timestampInput.classList.remove('error');
            
        } catch (error) {
            this.clearTimestampResults();
            this.timestampInput.classList.add('error');
            this.showStatus(`转换错误: ${error.message}`, 'error');
        }
    }

    // 日期转时间戳
    convertDateToTimestamp() {
        const dateValue = this.dateInput.value;
        const timeValue = this.timeInput.value;
        
        if (!dateValue || !timeValue) {
            this.clearDateResults();
            return;
        }

        try {
            const dateTimeString = `${dateValue}T${timeValue}`;
            let date;
            
            // 根据时区处理
            const timezone = this.timezoneSelect.value;
            if (timezone === 'local') {
                date = new Date(dateTimeString);
            } else if (timezone === 'utc') {
                date = new Date(dateTimeString + 'Z');
            } else {
                // 处理UTC偏移
                const offset = parseInt(timezone);
                date = new Date(dateTimeString);
                date.setHours(date.getHours() - offset);
            }

            const timestampSec = Math.floor(date.getTime() / 1000);
            const timestampMs = date.getTime();
            
            this.resultTimestampSec.value = timestampSec;
            this.resultTimestampMs.value = timestampMs;
            this.resultIsoTime.value = date.toISOString();
            
            // 移除错误样式
            this.dateInput.classList.remove('error');
            this.timeInput.classList.remove('error');
            
        } catch (error) {
            this.clearDateResults();
            this.dateInput.classList.add('error');
            this.timeInput.classList.add('error');
            this.showStatus(`转换错误: ${error.message}`, 'error');
        }
    }

    // 手动输入完整日期时间转时间戳
    convertManualDateTimeToTimestamp() {
        const manualInput = this.manualDateTimeInput.value.trim();
        
        if (!manualInput) {
            this.clearDateResults();
            this.manualDateTimeInput.classList.remove('error');
            return;
        }

        try {
            let date;
            
            // 支持多种日期时间格式
            const formats = [
                // ISO 格式
                /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?Z?$/,
                // 标准格式: YYYY-MM-DD HH:mm:ss
                /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
                // 带毫秒: YYYY-MM-DD HH:mm:ss.SSS
                /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/,
                // 简化格式: YYYY/MM/DD HH:mm:ss
                /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
                // 中文格式: YYYY年MM月DD日 HH:mm:ss
                /^(\d{4})年(\d{2})月(\d{2})日\s+(\d{2}):(\d{2}):(\d{2})$/
            ];
            
            // 尝试直接解析
            date = new Date(manualInput);
            
            // 如果直接解析失败，尝试格式化后解析
            if (isNaN(date.getTime())) {
                // 处理中文格式
                let normalizedInput = manualInput
                    .replace(/年/g, '-')
                    .replace(/月/g, '-')
                    .replace(/日/g, '')
                    .replace(/\//g, '-');
                
                date = new Date(normalizedInput);
            }
            
            // 验证日期是否有效
            if (isNaN(date.getTime())) {
                throw new Error('无法识别的日期时间格式');
            }
            
            // 根据时区处理
            const timezone = this.timezoneSelect.value;
            if (timezone === 'utc') {
                // 如果输入没有时区信息，按UTC处理
                if (!manualInput.includes('Z') && !manualInput.includes('+') && !manualInput.includes('T')) {
                    const localOffset = date.getTimezoneOffset() * 60000;
                    date = new Date(date.getTime() + localOffset);
                }
            } else if (timezone !== 'local') {
                // 处理UTC偏移
                const offset = parseInt(timezone);
                date.setHours(date.getHours() - offset);
            }

            const timestampSec = Math.floor(date.getTime() / 1000);
            const timestampMs = date.getTime();
            
            this.resultTimestampSec.value = timestampSec;
            this.resultTimestampMs.value = timestampMs;
            this.resultIsoTime.value = date.toISOString();
            
            // 移除错误样式
            this.manualDateTimeInput.classList.remove('error');
            
            // 同步到日期和时间输入框
            const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
            this.dateInput.value = localDate.toISOString().split('T')[0];
            this.timeInput.value = localDate.toISOString().split('T')[1].split('.')[0];
            
        } catch (error) {
            this.clearDateResults();
            this.manualDateTimeInput.classList.add('error');
            this.showStatus(`转换错误: ${error.message}`, 'error');
        }
    }

    // 处理快速时间戳
    handleQuickTimestamp(event) {
        const btn = event.target;
        const offset = btn.dataset.offset;
        const timestamp = btn.dataset.timestamp;
        
        let targetTimestamp;
        
        if (timestamp !== undefined) {
            // 特定时间戳
            targetTimestamp = parseInt(timestamp);
        } else {
            // 相对偏移
            const now = Math.floor(Date.now() / 1000);
            targetTimestamp = now + parseInt(offset);
        }
        
        this.timestampInput.value = targetTimestamp;
        this.timestampUnit.value = 'seconds';
        this.convertTimestampToDate();
        
        // 高亮按钮
        btn.classList.add('highlight');
        setTimeout(() => btn.classList.remove('highlight'), 600);
        
        this.showStatus(`已设置时间戳: ${btn.textContent}`, 'success');
    }

    // 处理时间计算
    handleCalculation(event) {
        const btn = event.target;
        const operation = btn.dataset.operation;
        const value = parseInt(btn.dataset.value);
        
        const baseValue = this.baseTimestamp.value.trim();
        if (!baseValue) {
            this.showStatus('请先输入基准时间戳', 'warning');
            return;
        }
        
        try {
            let baseTimestamp = parseInt(baseValue);
            if (isNaN(baseTimestamp)) {
                throw new Error('无效的基准时间戳');
            }
            
            let result;
            if (operation === 'add') {
                result = baseTimestamp + value;
            } else if (operation === 'subtract') {
                result = baseTimestamp - value;
            }
            
            this.calcResult.value = result;
            
            // 显示计算结果的日期时间
            const resultDate = new Date(result * 1000);
            this.showStatus(`计算结果: ${this.formatDateTime(resultDate)}`, 'success');
            
            // 高亮按钮
            btn.classList.add('highlight');
            setTimeout(() => btn.classList.remove('highlight'), 600);
            
        } catch (error) {
            this.showStatus(`计算错误: ${error.message}`, 'error');
        }
    }

    // 更新计算器基准
    updateCalculatorBase() {
        const value = this.baseTimestamp.value.trim();
        if (value) {
            try {
                const timestamp = parseInt(value);
                if (!isNaN(timestamp)) {
                    const date = new Date(timestamp * 1000);
                    this.showStatus(`基准时间: ${this.formatDateTime(date)}`, 'info');
                }
            } catch (error) {
                // 忽略错误
            }
        }
    }

    // 清空时间戳结果
    clearTimestampResults() {
        this.localTime.value = '';
        this.utcTime.value = '';
        this.isoTime.value = '';
        this.relativeTime.value = '';
    }

    // 清空日期结果
    clearDateResults() {
        this.resultTimestampSec.value = '';
        this.resultTimestampMs.value = '';
        this.resultIsoTime.value = '';
    }

    // 格式化日期时间
    formatDateTime(date, isUTC = false, includeMilliseconds = true) {
        const year = isUTC ? date.getUTCFullYear() : date.getFullYear();
        const month = String(isUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1).padStart(2, '0');
        const day = String(isUTC ? date.getUTCDate() : date.getDate()).padStart(2, '0');
        const hours = String(isUTC ? date.getUTCHours() : date.getHours()).padStart(2, '0');
        const minutes = String(isUTC ? date.getUTCMinutes() : date.getMinutes()).padStart(2, '0');
        const seconds = String(isUTC ? date.getUTCSeconds() : date.getSeconds()).padStart(2, '0');
        const milliseconds = String(isUTC ? date.getUTCMilliseconds() : date.getMilliseconds()).padStart(3, '0');
        
        let result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        if (includeMilliseconds) {
            result += `.${milliseconds}`;
        }
        if (isUTC) {
            result += ' UTC';
        }
        
        return result;
    }

    // 获取相对时间
    getRelativeTime(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(Math.abs(diffMs) / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffMonth = Math.floor(diffDay / 30);
        const diffYear = Math.floor(diffDay / 365);
        
        const isPast = diffMs > 0;
        const suffix = isPast ? '前' : '后';
        
        if (diffYear > 0) {
            return `${diffYear}年${suffix}`;
        } else if (diffMonth > 0) {
            return `${diffMonth}个月${suffix}`;
        } else if (diffDay > 0) {
            return `${diffDay}天${suffix}`;
        } else if (diffHour > 0) {
            return `${diffHour}小时${suffix}`;
        } else if (diffMin > 0) {
            return `${diffMin}分钟${suffix}`;
        } else if (diffSec > 0) {
            return `${diffSec}秒${suffix}`;
        } else {
            return '现在';
        }
    }

    // 更新格式示例
    updateFormatExamples(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
        this.formatInputs.format1.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        this.formatInputs.format2.value = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        this.formatInputs.format3.value = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        this.formatInputs.format4.value = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        this.formatInputs.format5.value = date.toUTCString();
        this.formatInputs.format6.value = `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒${milliseconds}毫秒`;
    }

    // 复制到剪贴板
    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            this.showCopyNotification(message);
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyNotification(message);
        });
    }

    // 显示复制通知
    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 显示状态信息
    showStatus(message, type = 'info') {
        this.statusBar.textContent = message;
        this.statusBar.className = `status-bar ${type}`;
        
        // 3秒后清除状态
        setTimeout(() => {
            this.statusBar.textContent = '';
            this.statusBar.className = 'status-bar';
        }, 3000);
    }

    // 键盘快捷键处理
    handleKeyboard(event) {
        // Ctrl+Enter: 转换
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.convertAll();
        }
        // Ctrl+L: 清空
        else if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            this.clearAll();
        }
        // Ctrl+N: 当前时间
        else if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            this.setCurrentTimestamp();
        }
        // Ctrl+C: 复制时间戳（当焦点在时间戳输入框时）
        else if (event.ctrlKey && event.key === 'c' && document.activeElement === this.timestampInput) {
            if (this.timestampInput.value) {
                this.copyToClipboard(this.timestampInput.value, '时间戳已复制');
            }
        }
        // Ctrl+Shift+C: 复制日期（当焦点在日期结果框时）
        else if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            if (this.localTime.value) {
                this.copyToClipboard(this.localTime.value, '日期时间已复制');
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TimestampConverter();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimestampConverter;
}