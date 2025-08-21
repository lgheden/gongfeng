// Cron表达式生成器和解析器

class CronGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeDefaults();
    }

    initializeElements() {
        
        // 生成器元素
        this.cronTypeRadios = document.querySelectorAll('input[name="cronType"]');
        this.frequency = document.getElementById('frequency');
        this.executeTime = document.getElementById('executeTime');
        this.dayOfWeek = document.getElementById('dayOfWeek');
        this.dayOfMonth = document.getElementById('dayOfMonth');
        
        // 高级模式元素
        this.seconds = document.getElementById('seconds');
        this.minutes = document.getElementById('minutes');
        this.hours = document.getElementById('hours');
        this.dayOfMonthAdv = document.getElementById('dayOfMonthAdv');
        this.month = document.getElementById('month');
        this.dayOfWeekAdv = document.getElementById('dayOfWeekAdv');
        
        // 结果显示元素
        this.cronResult = document.getElementById('cronResult');
        this.cronDescription = document.getElementById('cronDescription');
        this.nextRunsList = document.getElementById('nextRunsList');
        
        // 解析器元素
        this.cronInput = document.getElementById('cronInput');
        this.parseDescription = document.getElementById('parseDescription');
        this.fieldBreakdown = document.getElementById('fieldBreakdown');
        
        // 调试：检查关键元素是否正确初始化
        console.log('Element initialization check:');
        console.log('nextRunsList:', this.nextRunsList);
        console.log('cronResult:', this.cronResult);
        console.log('cronInput:', this.cronInput);
    }

    bindEvents() {

        // 生成器事件
        this.cronTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.onCronTypeChange());
        });
        
        if (this.frequency) {
            this.frequency.addEventListener('change', () => this.onFrequencyChange());
        }
        
        // 基础配置变化事件
        [this.executeTime, this.dayOfWeek, this.dayOfMonth].forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.generateCron());
            }
        });

        // 高级模式事件
        [this.seconds, this.minutes, this.hours, this.dayOfMonthAdv, this.month, this.dayOfWeekAdv].forEach(element => {
            if (element) {
                element.addEventListener('input', () => {
                    this.validateCronField(element);
                    this.generateFromAdvanced();
                });
                element.addEventListener('blur', () => this.validateCronField(element));
            }
        });

        // 按钮事件
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateCron());
        }
        
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCronExpression());
        }
        
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearGenerator());
        }
        
        const parseBtn = document.getElementById('parseBtn');
        if (parseBtn) {
            parseBtn.addEventListener('click', () => this.parseCron());
        }
        
        // cronInput输入事件，实现实时联动
        if (this.cronInput) {
            this.cronInput.addEventListener('input', () => {
                const cronExpression = this.cronInput.value.trim();
                if (cronExpression && this.cronResult) {
                    this.cronResult.value = cronExpression;
                }
            });
        }
        
        // 示例点击事件
        document.querySelectorAll('.example-item').forEach(item => {
            item.addEventListener('click', () => this.useExample(item.dataset.cron));
        });
    }

    initializeDefaults() {
        // 生成初始cron表达式
        this.generateCron();
    }

    onCronTypeChange() {
        const simpleMode = document.getElementById('simpleMode');
        const advancedMode = document.getElementById('advancedMode');
        const selectedType = document.querySelector('input[name="cronType"]:checked')?.value;
        
        if (selectedType === 'simple') {
            simpleMode.style.display = 'block';
            advancedMode.style.display = 'none';
            this.generateCron();
        } else {
            simpleMode.style.display = 'none';
            advancedMode.style.display = 'block';
            this.generateFromAdvanced();
        }
    }

    onFrequencyChange() {
        const frequency = this.frequency.value;
        const dayOfWeekSection = document.getElementById('dayOfWeekSection');
        const dayOfMonthSection = document.getElementById('dayOfMonthSection');
        
        // 隐藏所有可选配置
        dayOfWeekSection.style.display = 'none';
        dayOfMonthSection.style.display = 'none';
        
        // 根据频率显示相应配置
        if (frequency === 'week') {
            dayOfWeekSection.style.display = 'block';
        } else if (frequency === 'month') {
            dayOfMonthSection.style.display = 'block';
        }
        
        this.generateCron();
    }

    generateCron() {
        // 检查是否为高级模式
        const cronType = document.querySelector('input[name="cronType"]:checked')?.value;
        if (cronType === 'advanced') {
            this.generateFromAdvanced();
            return;
        }

        // 简单模式逻辑
        if (!this.frequency) {
            return;
        }
        
        const frequency = this.frequency.value;
        let cronExpression = '';
        
        switch (frequency) {
            case 'minute':
                cronExpression = '0 * * * * ?';
                break;
            case 'hour':
                cronExpression = '0 0 * * * ?';
                break;
            case 'day':
                cronExpression = this.generateDailyCron();
                break;
            case 'week':
                cronExpression = this.generateWeeklyCron();
                break;
            case 'month':
                cronExpression = this.generateMonthlyCron();
                break;
            case 'year':
                cronExpression = this.generateYearlyCron();
                break;
            case 'custom':
                cronExpression = this.generateCustomCron();
                break;
            default:
                cronExpression = '0 0 12 * * ?'; // 默认每天中午12点
        }
        
        this.updateResult(cronExpression);
    }

    generateDailyCron() {
        const time = this.executeTime ? this.executeTime.value : '00:00';
        const [hour, minute] = time.split(':');
        
        return `0 ${minute} ${hour} * * ?`;
    }

    generateWeeklyCron() {
        const time = this.executeTime ? this.executeTime.value : '00:00';
        const [hour, minute] = time.split(':');
        const dayOfWeek = this.dayOfWeek ? this.dayOfWeek.value : '1';
        
        return `0 ${minute} ${hour} ? * ${dayOfWeek}`;
    }

    generateMonthlyCron() {
        const time = this.executeTime ? this.executeTime.value : '00:00';
        const [hour, minute] = time.split(':');
        const dayOfMonth = this.dayOfMonth ? this.dayOfMonth.value : '1';
        
        return `0 ${minute} ${hour} ${dayOfMonth} * ?`;
    }

    generateYearlyCron() {
        const time = this.executeTime ? this.executeTime.value : '00:00';
        const [hour, minute] = time.split(':');
        
        return `0 ${minute} ${hour} 1 1 ?`;
    }

    generateCustomCron() {
        const time = this.executeTime ? this.executeTime.value : '00:00';
        const [hour, minute] = time.split(':');
        
        return `0 ${minute} ${hour} * * ?`;
    }

    generateFromAdvanced() {
        const seconds = this.seconds ? this.seconds.value : '0';
        const minutes = this.minutes ? this.minutes.value : '*';
        const hours = this.hours ? this.hours.value : '*';
        const dayOfMonth = this.dayOfMonthAdv ? this.dayOfMonthAdv.value : '*';
        const month = this.month ? this.month.value : '*';
        const dayOfWeek = this.dayOfWeekAdv ? this.dayOfWeekAdv.value : '?';
        
        const cronExpression = `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
        this.updateResult(cronExpression);
    }

    validateCronField(element) {
        const value = element.value.trim();
        const pattern = element.getAttribute('pattern');
        
        // 移除之前的错误样式
        element.classList.remove('invalid');
        
        // 如果值为空，使用默认值
        if (!value) {
            return true;
        }
        
        // 使用HTML5 pattern验证
        if (pattern) {
            const regex = new RegExp(pattern);
            const isValid = regex.test(value);
            
            if (!isValid) {
                element.classList.add('invalid');
                this.showFieldError(element, element.getAttribute('title') || '输入格式不正确');
                return false;
            }
        }
        
        // 额外的业务逻辑验证
        const fieldId = element.id;
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldId) {
            case 'seconds':
            case 'minutes':
                isValid = this.validateTimeField(value, 0, 59);
                errorMessage = '请输入0-59之间的有效值';
                break;
            case 'hours':
                isValid = this.validateTimeField(value, 0, 23);
                errorMessage = '请输入0-23之间的有效值';
                break;
            case 'dayOfMonthAdv':
                isValid = this.validateDayField(value);
                errorMessage = '请输入1-31之间的有效日期值';
                break;
            case 'month':
                isValid = this.validateMonthField(value);
                errorMessage = '请输入1-12或JAN-DEC的有效月份值';
                break;
            case 'dayOfWeekAdv':
                isValid = this.validateWeekField(value);
                errorMessage = '请输入0-7或SUN-SAT的有效星期值';
                break;
        }
        
        if (!isValid) {
            element.classList.add('invalid');
            this.showFieldError(element, errorMessage);
        }
        
        return isValid;
    }
    
    validateTimeField(value, min, max) {
        // 处理特殊字符
        if (value === '*' || value === '?') return true;
        
        // 处理步长表达式 */n
        if (value.includes('*/')) {
            const step = parseInt(value.split('*/')[1]);
            return step > 0 && step <= max;
        }
        
        // 处理范围表达式 n-m
        if (value.includes('-')) {
            const [start, end] = value.split('-').map(v => parseInt(v));
            return start >= min && start <= max && end >= min && end <= max && start <= end;
        }
        
        // 处理逗号分隔的值 n,m,o
        if (value.includes(',')) {
            const values = value.split(',').map(v => parseInt(v.trim()));
            return values.every(v => v >= min && v <= max);
        }
        
        // 处理单个数值
        const num = parseInt(value);
        return !isNaN(num) && num >= min && num <= max;
    }
    
    validateDayField(value) {
        if (value === '*' || value === '?') return true;
        if (value === 'L' || value === 'LW') return true;
        if (value.endsWith('W')) {
            const day = parseInt(value.slice(0, -1));
            return day >= 1 && day <= 31;
        }
        return this.validateTimeField(value, 1, 31);
    }
    
    validateMonthField(value) {
        if (value === '*' || value === '?') return true;
        
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        // 处理月份名称
        if (monthNames.includes(value.toUpperCase())) return true;
        
        // 处理月份名称范围
        if (value.includes('-')) {
            const [start, end] = value.split('-');
            if (monthNames.includes(start.toUpperCase()) && monthNames.includes(end.toUpperCase())) {
                return true;
            }
        }
        
        // 处理逗号分隔的月份名称
        if (value.includes(',')) {
            const months = value.split(',').map(m => m.trim().toUpperCase());
            return months.every(m => monthNames.includes(m) || (parseInt(m) >= 1 && parseInt(m) <= 12));
        }
        
        return this.validateTimeField(value, 1, 12);
    }
    
    validateWeekField(value) {
        if (value === '*' || value === '?') return true;
        
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        
        // 处理星期名称
        if (dayNames.includes(value.toUpperCase())) return true;
        
        // 处理第n个星期几 n#m
        if (value.includes('#')) {
            const [day, week] = value.split('#');
            const dayValid = dayNames.includes(day.toUpperCase()) || (parseInt(day) >= 0 && parseInt(day) <= 7);
            const weekValid = parseInt(week) >= 1 && parseInt(week) <= 5;
            return dayValid && weekValid;
        }
        
        // 处理最后一个星期几 nL
        if (value.endsWith('L')) {
            const day = value.slice(0, -1);
            return dayNames.includes(day.toUpperCase()) || (parseInt(day) >= 0 && parseInt(day) <= 7);
        }
        
        // 处理星期名称范围和逗号分隔
        if (value.includes('-') || value.includes(',')) {
            // 简化处理，允许通过
            return true;
        }
        
        return this.validateTimeField(value, 0, 7);
    }
    
    showFieldError(element, message) {
        // 移除之前的错误提示
        const existingError = element.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // 创建新的错误提示
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '11px';
        errorElement.style.marginLeft = '8px';
        
        element.parentNode.appendChild(errorElement);
        
        // 3秒后自动移除错误提示
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 3000);
    }

    updateResult(cronExpression) {
        if (this.cronResult) {
            this.cronResult.value = cronExpression;
        }
        // 同步更新解析器输入框
        if (this.cronInput) {
            this.cronInput.value = cronExpression;
        }
        if (this.cronDescription) {
            this.cronDescription.textContent = this.describeCron(cronExpression);
        }
        this.updateNextRuns(cronExpression);
    }

    describeCron(cronExpression) {
        try {
            const parts = cronExpression.split(' ');
            if (parts.length !== 6) {
                return '无效的Cron表达式格式';
            }
            
            const [second, minute, hour, day, month, weekday] = parts;
            
            let description = '执行时间: ';
            
            // 分析分钟
            if (minute === '*') {
                description += '每分钟';
            } else if (minute.includes('/')) {
                const interval = minute.split('/')[1];
                description += `每${interval}分钟`;
            } else {
                description += `第${minute}分钟`;
            }
            
            // 分析小时
            if (hour === '*') {
                description += ', 每小时';
            } else if (hour.includes('/')) {
                const interval = hour.split('/')[1];
                description += `, 每${interval}小时`;
            } else {
                description += `, ${hour}点`;
            }
            
            // 分析日期
            if (day === '*') {
                description += ', 每天';
            } else if (day.includes('/')) {
                const interval = day.split('/')[1];
                description += `, 每${interval}天`;
            } else {
                description += `, 每月${day}号`;
            }
            
            // 分析月份
            if (month !== '*') {
                if (month.includes('/')) {
                    const interval = month.split('/')[1];
                    description += `, 每${interval}个月`;
                } else {
                    description += `, ${month}月`;
                }
            }
            
            // 分析星期
            if (weekday !== '*') {
                const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                if (weekday.includes('/')) {
                    const interval = weekday.split('/')[1];
                    description += `, 每${interval}周`;
                } else {
                    description += `, ${weekdays[parseInt(weekday)] || weekday}`;
                }
            }
            
            return description;
        } catch (error) {
            return '无法解析Cron表达式';
        }
    }

    updateNextRuns(cronExpression) {
        console.log('updateNextRuns called with:', cronExpression);
        console.log('nextRunsList element:', this.nextRunsList);
        
        if (!this.nextRunsList) {
            console.warn('nextRunsList element not found');
            return;
        }
        
        try {
            const nextRuns = this.calculateNextRuns(cronExpression, 5);
            console.log('Calculated next runs:', nextRuns);
            
            this.nextRunsList.innerHTML = '';
            
            if (nextRuns.length === 0) {
                this.nextRunsList.innerHTML = '<li>未找到匹配的执行时间</li>';
                return;
            }
            
            nextRuns.forEach(date => {
                const li = document.createElement('li');
                li.textContent = date.toLocaleString('zh-CN');
                this.nextRunsList.appendChild(li);
            });
            
            console.log('Successfully updated nextRunsList with', nextRuns.length, 'items');
        } catch (error) {
            console.error('Error calculating next runs:', error);
            this.nextRunsList.innerHTML = '<li>无法计算下次执行时间: ' + error.message + '</li>';
        }
    }

    calculateNextRuns(cronExpression, count = 5) {
        console.log('calculateNextRuns called with:', cronExpression, 'count:', count);
        
        const parts = cronExpression.split(' ');
        if (parts.length !== 6) {
            throw new Error('Invalid cron expression: expected 6 parts, got ' + parts.length);
        }
        
        const [second, minute, hour, day, month, weekday] = parts;
        console.log('Cron parts:', { second, minute, hour, day, month, weekday });
        
        const nextRuns = [];
        const now = new Date();
        let current = new Date(now.getTime() + 1000); // 从下一秒开始
        
        let attempts = 0;
        const maxAttempts = 100000;
        
        console.log('Starting calculation from:', current.toLocaleString('zh-CN'));
        
        while (nextRuns.length < count && attempts < maxAttempts) {
            if (this.matchesCron(current, second, minute, hour, day, month, weekday)) {
                nextRuns.push(new Date(current));
                console.log('Found match #' + nextRuns.length + ':', current.toLocaleString('zh-CN'));
            }
            
            // 智能递增：如果秒字段是具体值，按分钟递增；否则按秒递增
            if (second !== '*' && !second.includes('/') && !second.includes(',') && !second.includes('-')) {
                current.setMinutes(current.getMinutes() + 1);
                current.setSeconds(0); // 重置秒数
            } else {
                current.setSeconds(current.getSeconds() + 1);
            }
            attempts++;
            
            // 每10000次尝试输出一次进度
            if (attempts % 10000 === 0) {
                console.log('Progress: attempts =', attempts, 'found =', nextRuns.length, 'current =', current.toLocaleString('zh-CN'));
            }
        }
        
        console.log('Calculation completed. Found', nextRuns.length, 'matches in', attempts, 'attempts');
        
        if (nextRuns.length === 0 && attempts >= maxAttempts) {
            console.warn('Reached maximum attempts without finding matches');
        }
        
        return nextRuns;
    }

    copyCronExpression() {
        if (this.cronResult && this.cronResult.value) {
            navigator.clipboard.writeText(this.cronResult.value).then(() => {
                this.showStatus('Cron表达式已复制到剪贴板');
            }).catch(() => {
                // 降级方案
                this.cronResult.select();
                document.execCommand('copy');
                this.showStatus('Cron表达式已复制到剪贴板');
            });
        }
    }

    clearGenerator() {
        if (this.cronResult) {
            this.cronResult.value = '';
        }
        if (this.cronDescription) {
            this.cronDescription.textContent = '';
        }
        if (this.nextRunsList) {
            this.nextRunsList.innerHTML = '';
        }
        
        // 重置为默认值
        const simpleRadio = document.querySelector('input[name="cronType"][value="simple"]');
        if (simpleRadio) {
            simpleRadio.checked = true;
        }
        if (this.frequency) {
            this.frequency.value = 'day';
        }
        if (this.executeTime) {
            this.executeTime.value = '00:00';
        }
        
        this.onCronTypeChange();
        this.onFrequencyChange();
    }



    matchesCron(date, second, minute, hour, day, month, weekday) {
        const dateSecond = date.getSeconds();
        const dateMinute = date.getMinutes();
        const dateHour = date.getHours();
        const dateDay = date.getDate();
        const dateMonth = date.getMonth() + 1; // Date.getMonth()返回0-11，而cron使用1-12
        const dateWeekday = date.getDay(); // Date.getDay()返回0-6，cron也使用0-6
        
        // 检查秒
        if (!this.matchesField(dateSecond, second)) {
            return false;
        }
        
        // 检查分钟
        if (!this.matchesField(dateMinute, minute)) {
            return false;
        }
        
        // 检查小时
        if (!this.matchesField(dateHour, hour)) {
            return false;
        }
        
        // 检查日期
        if (!this.matchesField(dateDay, day)) {
            return false;
        }
        
        // 检查月份
        if (!this.matchesField(dateMonth, month)) {
            return false;
        }
        
        // 检查星期
        if (!this.matchesField(dateWeekday, weekday)) {
            return false;
        }
        
        return true;
    }

    matchesField(value, pattern) {
        if (pattern === '*' || pattern === '?') return true;
        
        // 处理步长值 (如 */5)
        if (pattern.includes('/')) {
            const [range, step] = pattern.split('/');
            const stepValue = parseInt(step);
            if (range === '*') {
                return value % stepValue === 0;
            } else {
                // 处理范围步长 (如 1-10/2)
                const [start, end] = range.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    return value >= start && value <= end && (value - start) % stepValue === 0;
                }
            }
        }
        
        // 处理范围 (如 1-5)
        if (pattern.includes('-')) {
            const [start, end] = pattern.split('-').map(Number);
            return value >= start && value <= end;
        }
        
        // 处理列表 (如 1,3,5)
        if (pattern.includes(',')) {
            const values = pattern.split(',').map(v => {
                const trimmed = v.trim();
                // 处理列表中的范围
                if (trimmed.includes('-')) {
                    const [start, end] = trimmed.split('-').map(Number);
                    return value >= start && value <= end;
                }
                return value === parseInt(trimmed);
            });
            return values.some(match => match === true || match === value);
        }
        
        // 精确匹配
        const numPattern = parseInt(pattern);
        return !isNaN(numPattern) && value === numPattern;
    }

    parseCron() {
        const cronExpression = this.cronInput.value.trim();
        console.log('parseCron called with:', cronExpression);
        
        if (!cronExpression) {
            this.showStatus('请输入Cron表达式', 'error');
            return;
        }
        
        // 同步更新生成器结果框
        if (this.cronResult) {
            this.cronResult.value = cronExpression;
        }
        
        if (!this.nextRunsList) {
            console.error('nextRunsList element not found');
            this.showStatus('解析器界面元素未找到', 'error');
            return;
        }
        
        try {
            const description = this.describeCron(cronExpression);
            const breakdown = this.getFieldBreakdown(cronExpression);
            const nextRuns = this.calculateNextRuns(cronExpression, 5);
            
            console.log('Parse results:', { description, breakdown, nextRuns });
            
            this.parseDescription.textContent = description;
            this.fieldBreakdown.innerHTML = breakdown.replace(/\n/g, '    ');
            
            // 更新统一的执行时间显示区域
            this.nextRunsList.innerHTML = '';
            
            if (nextRuns.length === 0) {
                this.nextRunsList.innerHTML = '<li>未找到匹配的执行时间</li>';
            } else {
                nextRuns.forEach(date => {
                    const li = document.createElement('li');
                    li.textContent = date.toLocaleString('zh-CN');
                    this.nextRunsList.appendChild(li);
                });
            }
            
            console.log('Successfully updated nextRunsList with', nextRuns.length, 'items');
            this.showStatus('解析成功', 'success');
        } catch (error) {
            console.error('Parse error:', error);
            this.showStatus('解析失败: ' + error.message, 'error');
        }
    }

    getFieldBreakdown(cronExpression) {
        const parts = cronExpression.split(' ');
        if (parts.length !== 6) {
            return '无效的Cron表达式格式';
        }
        
        const [second, minute, hour, day, month, weekday] = parts;
        
        return `秒: ${second}\n` +
               `分钟: ${minute}\n` +
               `小时: ${hour}\n` +
               `日期: ${day}\n` +
               `月份: ${month}\n` +
               `星期: ${weekday}`;
    }

    copyCronExpression() {
        this.copyToClipboard(this.cronResult.value, 'Cron表达式已复制到剪贴板');
    }

    copyParseInput() {
        this.copyToClipboard(this.cronInput.value, 'Cron表达式已复制到剪贴板');
    }

    copyToClipboard(text, message) {
        if (!text) {
            this.showStatus('没有内容可复制', 'error');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.showStatus(message, 'success');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus(message, 'success');
        });
    }

    resetGenerator() {
        // 重置所有表单元素
        this.scheduleType.value = 'daily';
        this.minuteSelect.value = 0;
        this.hourSelect.value = 0;
        this.daySelect.value = 1;
        this.monthSelect.value = 1;
        this.weekdaySelect.value = 0;
        this.intervalValue.value = 1;
        this.intervalUnit.value = 'minutes';
        this.customTime.value = '00:00';
        this.advancedMode.checked = false;
        
        // 重置高级模式字段
        this.cronMinute.value = '*';
        this.cronHour.value = '*';
        this.cronDay.value = '*';
        this.cronMonth.value = '*';
        this.cronWeekday.value = '*';
        
        // 重新生成
        this.toggleAdvancedMode();
        this.onScheduleTypeChange();
        this.generateCron();
        
        this.showStatus('已重置为默认设置', 'info');
    }

    useExample(cronExpression) {
        // 设置输入值并解析
        this.cronInput.value = cronExpression;
        this.parseCron();
        
        this.showStatus('已加载示例表达式', 'info');
    }

    showStatus(message, type = 'info') {
        // 移除现有的状态栏
        const existingStatus = document.querySelector('.status-bar');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // 创建新的状态栏
        const statusBar = document.createElement('div');
        statusBar.className = `status-bar ${type}`;
        statusBar.textContent = message;
        
        document.body.appendChild(statusBar);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (statusBar.parentNode) {
                statusBar.remove();
            }
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CronGenerator();
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CronGenerator;
}