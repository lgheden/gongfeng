// 程序员计算器 JavaScript

class ProgrammerCalculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.currentMode = 'DEC'; // DEC, HEX, OCT, BIN
        this.memory = 0;
        this.history = [];
        this.currentFormula = ''; // 当前公式
        this.isCalculatorMode = true; // 默认为计算器模式
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.initModeSwitch();
    }

    initializeElements() {
        // 显示区域
        this.hexDisplay = document.getElementById('hexDisplay');
        this.decDisplay = document.getElementById('decDisplay');
        this.octDisplay = document.getElementById('octDisplay');
        this.binDisplay = document.getElementById('binDisplay');
        this.mainDisplay = document.getElementById('mainDisplay');
        this.formulaDisplay = document.getElementById('formulaDisplay');
        this.formulaInput = document.getElementById('formulaInput');
        
        // 模式按钮
        this.modeButtons = document.querySelectorAll('.mode-btn');
        
        // 公式按钮
        this.calculateFormulaBtn = document.getElementById('calculateFormula');
        this.clearFormulaBtn = document.getElementById('clearFormula');
        
        // 状态栏
        this.statusBar = document.getElementById('statusBar');
        
        // 历史记录
        this.historyList = document.getElementById('historyList');
    }

    initModeSwitch() {
        const modeSwitch = document.getElementById('calculator-mode-switch');
        if (modeSwitch) {
            modeSwitch.addEventListener('change', (e) => {
                this.isCalculatorMode = !e.target.checked;
                this.toggleCalculatorMode();
            });
        }
    }
    
    toggleCalculatorMode() {
        const calculatorContainer = document.querySelector('.calculator-container');
        const unitConverter = document.querySelector('.unit-converter');
        
        if (this.isCalculatorMode) {
            // 计算器模式：显示计算器，隐藏单位换算输入功能
            if (calculatorContainer) calculatorContainer.style.opacity = '1';
            if (unitConverter) {
                // 禁用单位换算的输入事件
                const inputs = unitConverter.querySelectorAll('input[type="number"], select');
                inputs.forEach(input => input.disabled = true);
            }
        } else {
            // 单位换算模式：淡化计算器，启用单位换算
            if (calculatorContainer) calculatorContainer.style.opacity = '0.5';
            if (unitConverter) {
                // 启用单位换算的输入事件
                const inputs = unitConverter.querySelectorAll('input[type="number"], select');
                inputs.forEach(input => input.disabled = false);
            }
        }
    }

    bindEvents() {
        // 数字按钮
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                const value = btn.dataset.value || btn.textContent;
                this.inputNumber(value);
            });
        });
        
        // 运算符按钮
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                const action = btn.dataset.action;
                this.inputOperator(action);
            });
        });
        
        // 功能按钮
        document.querySelectorAll('.btn-function').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                const action = btn.dataset.action;
                this.inputFunction(action);
            });
        });
        
        // 等号按钮
        document.querySelectorAll('.btn-equals').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                this.calculate();
            });
        });
        
        // 位运算按钮
        document.querySelectorAll('.btn-bitwise').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                const action = btn.dataset.action;
                this.inputBitwise(action);
            });
        });
        
        // 十六进制字母按钮
        document.querySelectorAll('.btn-hex').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                const value = btn.dataset.value || btn.textContent;
                this.inputHex(value);
            });
        });
        
        // 模式切换按钮
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isCalculatorMode) {
                    e.preventDefault();
                    return;
                }
                this.switchMode(btn.dataset.mode);
            });
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 公式相关事件
        if (this.calculateFormulaBtn) {
            console.log('绑定计算公式按钮事件');
            this.calculateFormulaBtn.addEventListener('click', () => {
                console.log('计算公式按钮被点击');
                this.calculateFormula();
            });
        } else {
            console.error('找不到计算公式按钮元素');
        }
        
        if (this.clearFormulaBtn) {
            console.log('绑定清空公式按钮事件');
            this.clearFormulaBtn.addEventListener('click', () => {
                console.log('清空公式按钮被点击');
                this.clearFormula();
            });
        } else {
            console.error('找不到清空公式按钮元素');
        }
        
        if (this.formulaInput) {
            this.formulaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.calculateFormula();
                }
            });
        }
        
        // 历史记录按钮
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }

    // 输入数字
    inputNumber(num) {
        if (!this.isValidDigit(num)) {
            this.showStatus(`数字 ${num} 在 ${this.currentMode} 模式下无效`, 'error');
            return;
        }
        
        // 处理小数点
        if (num === '.') {
            // 只有在DEC模式下才允许小数点
            if (this.currentMode !== 'DEC') {
                this.showStatus('小数点只能在十进制模式下使用', 'error');
                return;
            }
            // 防止重复输入小数点
            if (this.currentValue.includes('.')) {
                return;
            }
            // 如果当前值为空或等待操作数，则添加"0."
            if (this.waitingForOperand || this.currentValue === '0') {
                this.currentValue = '0.';
                this.waitingForOperand = false;
            } else {
                this.currentValue += '.';
            }
        } else {
            if (this.waitingForOperand) {
                this.currentValue = num;
                this.waitingForOperand = false;
            } else {
                this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
            }
        }
        
        this.updateDisplay();
    }

    // 输入十六进制字母
    inputHex(hex) {
        if (this.currentMode !== 'HEX') {
            this.showStatus('十六进制字母只能在 HEX 模式下使用', 'error');
            return;
        }
        
        this.inputNumber(hex);
    }

    // 输入运算符
    inputOperator(nextOperator) {
        const inputValue = this.parseValue(this.currentValue);
        
        if (this.previousValue === '') {
            this.previousValue = inputValue;
            this.currentFormula = this.formatValue(inputValue) + ' ' + this.getOperatorSymbol(nextOperator) + ' ';
        } else if (this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);
            
            if (newValue === null) return;
            
            this.currentValue = this.formatValue(newValue);
            this.previousValue = newValue;
            this.currentFormula = this.formatValue(newValue) + ' ' + this.getOperatorSymbol(nextOperator) + ' ';
        }
        
        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.updateDisplay();
    }

    // 输入位运算
    inputBitwise(operation) {
        const inputValue = this.parseValue(this.currentValue);
        
        if (this.previousValue === '') {
            this.previousValue = inputValue;
            this.waitingForOperand = true;
            this.operator = operation;
        } else if (this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performBitwiseCalculation(currentValue, inputValue, operation);
            
            if (newValue === null) return;
            
            this.currentValue = this.formatValue(newValue);
            this.previousValue = newValue;
            this.waitingForOperand = true;
            this.operator = operation;
        }
        
        this.updateDisplay();
    }

    // 输入功能
    inputFunction(func) {
        switch (func) {
            case 'clear':
                this.clear();
                break;
            case 'clearEntry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'negate':
                this.negate();
                break;
            case 'not':
                this.bitwiseNot();
                break;
            case 'mod':
                this.inputOperator('modulo');
                break;
            case 'sqrt':
                this.sqrt();
                break;
            case 'power':
                this.power();
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'ms':
                this.memoryStore();
                break;
            case 'mplus':
                this.memoryAdd();
                break;
            case 'mminus':
                this.memorySubtract();
                break;
        }
    }

    // 计算
    calculate() {
        const inputValue = this.parseValue(this.currentValue);
        
        if (this.previousValue !== '' && this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.operator.includes('bit') ? 
                this.performBitwiseCalculation(currentValue, inputValue, this.operator) :
                this.performCalculation(currentValue, inputValue, this.operator);
            
            if (newValue === null) return;
            
            // 完成公式显示
            this.currentFormula += this.formatValue(inputValue) + ' = ' + this.formatValue(newValue);
            
            // 添加到历史记录
            this.addToHistory(`${this.formatValue(currentValue)} ${this.getOperatorSymbol(this.operator)} ${this.formatValue(inputValue)} = ${this.formatValue(newValue)}`);
            
            this.currentValue = this.formatValue(newValue);
            this.previousValue = '';
            this.operator = null;
            this.waitingForOperand = true;
            
            this.updateDisplay();
            this.showStatus('计算完成', 'success');
        }
    }

    // 执行基本计算
    performCalculation(firstValue, secondValue, operator) {
        try {
            switch (operator) {
                case 'add':
                    return firstValue + secondValue;
                case 'subtract':
                    return firstValue - secondValue;
                case 'multiply':
                    return firstValue * secondValue;
                case 'divide':
                    if (secondValue === 0) {
                        this.showStatus('除数不能为零', 'error');
                        return null;
                    }
                    // 在十进制模式下支持浮点数除法，其他模式使用整数除法
                    return this.currentMode === 'DEC' ? firstValue / secondValue : Math.floor(firstValue / secondValue);
                case 'modulo':
                    if (secondValue === 0) {
                        this.showStatus('除数不能为零', 'error');
                        return null;
                    }
                    return firstValue % secondValue;
                default:
                    return secondValue;
            }
        } catch (error) {
            this.showStatus('计算错误', 'error');
            return null;
        }
    }

    // 执行位运算计算
    performBitwiseCalculation(firstValue, secondValue, operator) {
        try {
            switch (operator) {
                case 'and':
                    return firstValue & secondValue;
                case 'or':
                    return firstValue | secondValue;
                case 'xor':
                    return firstValue ^ secondValue;
                case 'lshift':
                    return firstValue << secondValue;
                case 'rshift':
                    return firstValue >> secondValue;
                default:
                    return secondValue;
            }
        } catch (error) {
            this.showStatus('位运算错误', 'error');
            return null;
        }
    }

    // 清空
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.currentFormula = '';
        this.updateDisplay();
        this.showStatus('已清空', 'success');
    }
    
    // 清空当前输入
    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
        this.showStatus('当前输入已清空', 'success');
    }
    
    // 平方根
    sqrt() {
        const value = this.parseValue(this.currentValue);
        if (value < 0) {
            this.showStatus('负数不能开平方根', 'error');
            return;
        }
        const result = Math.floor(Math.sqrt(value));
        this.currentValue = this.formatValue(result);
        this.updateDisplay();
        this.showStatus('平方根计算完成', 'success');
    }
    
    // 平方
    power() {
        const value = this.parseValue(this.currentValue);
        const result = value * value;
        this.currentValue = this.formatValue(result);
        this.updateDisplay();
        this.showStatus('平方计算完成', 'success');
    }

    // 退格
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    // 取反
    negate() {
        const value = this.parseValue(this.currentValue);
        this.currentValue = this.formatValue(-value);
        this.updateDisplay();
    }

    // 按位取反
    bitwiseNot() {
        const value = this.parseValue(this.currentValue);
        const result = ~value;
        this.currentValue = this.formatValue(result);
        this.updateDisplay();
        this.showStatus('按位取反完成', 'success');
    }

    // 内存操作
    memoryClear() {
        this.memory = 0;
        this.showStatus('内存已清空', 'success');
    }

    memoryRecall() {
        this.currentValue = this.formatValue(this.memory);
        this.updateDisplay();
        this.showStatus('内存值已调用', 'success');
    }

    memoryStore() {
        this.memory = this.parseValue(this.currentValue);
        this.showStatus('值已存储到内存', 'success');
    }

    memoryAdd() {
        this.memory += this.parseValue(this.currentValue);
        this.showStatus('值已添加到内存', 'success');
    }

    memorySubtract() {
        this.memory -= this.parseValue(this.currentValue);
        this.showStatus('值已从内存减去', 'success');
    }

    // 切换模式
    switchMode(mode) {
        // 将小写模式转换为大写
        this.currentMode = mode.toUpperCase();
        
        // 更新模式按钮状态
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode.toLowerCase());
        });
        
        // 更新按钮可用性
        this.updateButtonStates();
        
        // 重新格式化当前值
        const value = this.parseValue(this.currentValue);
        this.currentValue = this.formatValue(value);
        
        this.updateDisplay();
        this.showStatus(`已切换到 ${this.currentMode} 模式`, 'success');
    }

    // 更新按钮状态
    updateButtonStates() {
        // 数字按钮
        document.querySelectorAll('.btn-number').forEach(btn => {
            const digit = btn.textContent;
            btn.disabled = !this.isValidDigit(digit);
        });
        
        // 十六进制字母按钮
        document.querySelectorAll('.btn-hex').forEach(btn => {
            btn.disabled = this.currentMode !== 'HEX';
        });
    }

    // 检查数字是否在当前模式下有效
    isValidDigit(digit) {
        switch (this.currentMode) {
            case 'BIN':
                return /^[01]$/.test(digit);
            case 'OCT':
                return /^[0-7]$/.test(digit);
            case 'DEC':
                return /^[0-9.]$/.test(digit);
            case 'HEX':
                return /^[0-9A-F]$/i.test(digit);
            default:
                return false;
        }
    }

    // 解析值
    parseValue(value) {
        if (typeof value === 'number') return value;
        
        switch (this.currentMode) {
            case 'BIN':
                return parseInt(value, 2) || 0;
            case 'OCT':
                return parseInt(value, 8) || 0;
            case 'DEC':
                // 在十进制模式下支持浮点数
                return parseFloat(value) || 0;
            case 'HEX':
                return parseInt(value, 16) || 0;
            default:
                return 0;
        }
    }

    // 格式化值
    formatValue(value) {
        if (typeof value !== 'number' || isNaN(value)) return '0';
        
        switch (this.currentMode) {
            case 'BIN':
                // 二进制模式只支持整数
                value = Math.max(-2147483648, Math.min(2147483647, Math.floor(value)));
                return (value >>> 0).toString(2);
            case 'OCT':
                // 八进制模式只支持整数
                value = Math.max(-2147483648, Math.min(2147483647, Math.floor(value)));
                return (value >>> 0).toString(8);
            case 'DEC':
                // 十进制模式支持浮点数
                return value.toString(10);
            case 'HEX':
                // 十六进制模式只支持整数
                value = Math.max(-2147483648, Math.min(2147483647, Math.floor(value)));
                return (value >>> 0).toString(16).toUpperCase();
            default:
                return '0';
        }
    }

    // 更新显示
    updateDisplay() {
        const value = this.parseValue(this.currentValue);
        
        // 更新多进制显示 - 使用value属性因为这些是input元素
        // 对于浮点数，其他进制显示取整数部分
        const intValue = Math.floor(value);
        if (this.hexDisplay) this.hexDisplay.value = (intValue >>> 0).toString(16).toUpperCase();
        if (this.decDisplay) this.decDisplay.value = value.toString(10);
        if (this.octDisplay) this.octDisplay.value = (intValue >>> 0).toString(8);
        if (this.binDisplay) this.binDisplay.value = (intValue >>> 0).toString(2).padStart(8, '0');
        
        // 更新主显示 - 使用value属性因为这是input元素
        if (this.mainDisplay) {
            this.mainDisplay.value = this.currentValue;
            // 当有值且不是默认值"0"时，改变边框颜色
            if (this.currentValue && this.currentValue !== '0') {
                this.mainDisplay.className = this.mainDisplay.className.replace('border-gray-300', 'border-blue-500');
            } else {
                this.mainDisplay.className = this.mainDisplay.className.replace('border-blue-500', 'border-gray-300');
            }
        }
        
        // 更新公式显示
        if (this.formulaDisplay) {
            this.formulaDisplay.value = this.currentFormula;
        }
    }

    // 获取运算符符号
    getOperatorSymbol(operator) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷',
            'modulo': 'MOD',
            'and': 'AND',
            'or': 'OR',
            'xor': 'XOR',
            'lshift': '<<',
            'rshift': '>>'
        };
        return symbols[operator] || operator;
    }

    // 添加到历史记录
    addToHistory(expression) {
        this.history.unshift(expression);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.updateHistoryDisplay();
    }

    // 更新历史记录显示
    updateHistoryDisplay() {
        if (this.historyList) {
            this.historyList.innerHTML = '';
            this.history.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.addEventListener('click', () => {
                    // 点击历史记录项可以重新使用结果
                    const result = item.split(' = ')[1];
                    if (result) {
                        this.currentValue = result;
                        this.updateDisplay();
                    }
                });
                this.historyList.appendChild(li);
            });
        }
    }

    // 清空历史记录
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.showStatus('历史记录已清空', 'success');
    }

    // 显示状态信息
    showStatus(message, type = 'info') {
        if (this.statusBar) {
            this.statusBar.textContent = message;
            this.statusBar.className = `status-bar ${type}`;
            
            setTimeout(() => {
                if (this.statusBar) {
                    this.statusBar.textContent = '';
                    this.statusBar.className = 'status-bar';
                }
            }, 3000);
        }
    }

    // 计算公式
    calculateFormula() {
        console.log('calculateFormula方法被调用');
        
        if (!this.formulaInput) {
            console.error('formulaInput元素不存在');
            this.showStatus('公式输入框不存在', 'error');
            return;
        }
        
        if (!this.formulaInput.value.trim()) {
            console.log('公式输入框为空');
            this.showStatus('请输入公式', 'error');
            return;
        }
        
        const formula = this.formulaInput.value.trim();
        console.log('要计算的公式:', formula);
        
        try {
            // 安全的数学表达式计算
            const result = this.evaluateFormula(formula);
            console.log('计算结果:', result);
            
            if (result !== null && !isNaN(result) && isFinite(result)) {
                this.currentValue = this.formatValue(result);
                this.currentFormula = formula + ' = ' + this.formatValue(result);
                this.previousValue = '';
                this.operator = null;
                this.waitingForOperand = true;
                
                // 添加到历史记录
                this.addToHistory(this.currentFormula);
                
                this.updateDisplay();
                this.showStatus('公式计算完成', 'success');
            } else {
                this.showStatus('公式计算错误：结果无效', 'error');
            }
        } catch (error) {
            console.error('公式计算错误:', error);
            this.showStatus('公式格式错误: ' + error.message, 'error');
        }
    }
    
    // 清空公式
    clearFormula() {
        if (this.formulaInput) {
            this.formulaInput.value = '';
        }
        this.currentFormula = '';
        // 同时清空主显示区域
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
        this.showStatus('公式已清空', 'success');
    }
    
    // 安全的公式计算 - 使用递归下降解析器避免CSP限制
    evaluateFormula(formula) {
        console.log('原始公式:', formula);
        
        // 预处理：清理和标准化输入
        let cleanFormula = formula
            .trim()
            .replace(/\s+/g, '') // 移除所有空格
            .replace(/×/g, '*')   // 替换乘号
            .replace(/÷/g, '/')   // 替换除号
            .replace(/（/g, '(')   // 替换中文括号
            .replace(/）/g, ')');
            
        console.log('清理后的公式:', cleanFormula);
        
        try {
            const result = this.parseExpression(cleanFormula);
            console.log('解析计算结果:', result);
            return typeof result === 'number' && isFinite(result) ? result : null;
        } catch (error) {
            console.error('解析错误:', error);
            throw new Error(`计算错误: ${error.message}`);
        }
    }
    
    // 递归下降解析器 - 安全的数学表达式计算
    parseExpression(expr) {
        this.pos = 0;
        this.expr = expr;
        const result = this.parseAddSub();
        if (this.pos < this.expr.length) {
            throw new Error('表达式格式错误');
        }
        return result;
    }
    
    // 解析加法和减法
    parseAddSub() {
        let result = this.parseMulDiv();
        while (this.pos < this.expr.length) {
            const op = this.expr[this.pos];
            if (op === '+') {
                this.pos++;
                result += this.parseMulDiv();
            } else if (op === '-') {
                this.pos++;
                result -= this.parseMulDiv();
            } else {
                break;
            }
        }
        return result;
    }
    
    // 解析乘法和除法
    parseMulDiv() {
        let result = this.parseFactor();
        while (this.pos < this.expr.length) {
            const op = this.expr[this.pos];
            if (op === '*') {
                this.pos++;
                result *= this.parseFactor();
            } else if (op === '/') {
                this.pos++;
                const divisor = this.parseFactor();
                if (divisor === 0) throw new Error('除零错误');
                result /= divisor;
            } else {
                break;
            }
        }
        return result;
    }
    
    // 解析因子（数字、括号、函数）
    parseFactor() {
        // 跳过空格
        while (this.pos < this.expr.length && this.expr[this.pos] === ' ') {
            this.pos++;
        }
        
        if (this.pos >= this.expr.length) {
            throw new Error('意外的表达式结束');
        }
        
        const char = this.expr[this.pos];
        
        // 处理负号
        if (char === '-') {
            this.pos++;
            return -this.parseFactor();
        }
        
        // 处理正号
        if (char === '+') {
            this.pos++;
            return this.parseFactor();
        }
        
        // 处理括号
        if (char === '(') {
            this.pos++;
            const result = this.parseAddSub();
            if (this.pos >= this.expr.length || this.expr[this.pos] !== ')') {
                throw new Error('缺少右括号');
            }
            this.pos++;
            return result;
        }
        
        // 处理函数和常数
        if (this.isLetter(char)) {
            return this.parseFunction();
        }
        
        // 处理数字
        if (this.isDigit(char) || char === '.') {
            return this.parseNumber();
        }
        
        throw new Error(`无效字符: ${char}`);
    }
    
    // 解析数字
    parseNumber() {
        let numStr = '';
        while (this.pos < this.expr.length && (this.isDigit(this.expr[this.pos]) || this.expr[this.pos] === '.')) {
            numStr += this.expr[this.pos];
            this.pos++;
        }
        const num = parseFloat(numStr);
        if (isNaN(num)) {
            throw new Error(`无效数字: ${numStr}`);
        }
        return num;
    }
    
    // 解析函数和常数
    parseFunction() {
        let funcName = '';
        while (this.pos < this.expr.length && this.isLetter(this.expr[this.pos])) {
            funcName += this.expr[this.pos];
            this.pos++;
        }
        
        const lowerName = funcName.toLowerCase();
        
        // 数学常数
        if (lowerName === 'pi') return Math.PI;
        if (lowerName === 'e') return Math.E;
        
        // 数学函数
         if (this.pos < this.expr.length && this.expr[this.pos] === '(') {
             this.pos++; // 跳过 '('
             
             let arg1, arg2;
             
             // 解析参数
             if (lowerName === 'pow') {
                 arg1 = this.parseAddSub();
                 if (this.pos >= this.expr.length || this.expr[this.pos] !== ',') {
                     throw new Error('pow函数需要两个参数');
                 }
                 this.pos++; // 跳过 ','
                 arg2 = this.parseAddSub();
             } else {
                 arg1 = this.parseAddSub();
             }
             
             if (this.pos >= this.expr.length || this.expr[this.pos] !== ')') {
                 throw new Error('缺少右括号');
             }
             this.pos++; // 跳过 ')'
             
             // 执行函数计算
             switch (lowerName) {
                 case 'sqrt':
                     if (arg1 < 0) throw new Error('负数不能开平方根');
                     return Math.sqrt(arg1);
                 case 'sin':
                     return Math.sin(arg1);
                 case 'cos':
                     return Math.cos(arg1);
                 case 'tan':
                     return Math.tan(arg1);
                 case 'log':
                     if (arg1 <= 0) throw new Error('对数的参数必须大于0');
                     return Math.log10(arg1);
                 case 'ln':
                     if (arg1 <= 0) throw new Error('自然对数的参数必须大于0');
                     return Math.log(arg1);
                 case 'abs':
                     return Math.abs(arg1);
                 case 'floor':
                     return Math.floor(arg1);
                 case 'ceil':
                     return Math.ceil(arg1);
                 case 'round':
                     return Math.round(arg1);
                 case 'pow':
                     return Math.pow(arg1, arg2);
                 default:
                     throw new Error(`未知函数: ${funcName}`);
             }
         }
        
        throw new Error(`无效的函数或常数: ${funcName}`);
    }
    
    // 辅助函数
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    
    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    // 键盘事件处理
    handleKeyboard(event) {
        // 如果不在计算器模式，不处理全局键盘事件
        if (!this.isCalculatorMode) {
            return;
        }
        
        // 如果焦点在公式输入框上，不处理全局键盘事件
        if (document.activeElement === this.formulaInput) {
            return;
        }
        
        // 如果焦点在其他输入框上（如单位换算、金融计算器），不处理全局键盘事件
        if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'number') {
            return;
        }
        
        const key = event.key;
        
        // 数字键和小数点
        if (/^[0-9.]$/.test(key)) {
            event.preventDefault();
            this.inputNumber(key);
        }
        // 十六进制字母
        else if (/^[A-F]$/i.test(key) && this.currentMode === 'HEX') {
            event.preventDefault();
            this.inputHex(key.toUpperCase());
        }
        // 运算符
        else if (key === '+') {
            event.preventDefault();
            this.inputOperator('add');
        }
        else if (key === '-') {
            event.preventDefault();
            this.inputOperator('subtract');
        }
        else if (key === '*') {
            event.preventDefault();
            this.inputOperator('multiply');
        }
        else if (key === '/') {
            event.preventDefault();
            this.inputOperator('divide');
        }
        else if (key === '%') {
            event.preventDefault();
            this.inputOperator('modulo');
        }
        // 等号和回车
        else if (key === '=' || key === 'Enter') {
            event.preventDefault();
            this.calculate();
        }
        // 退格
        else if (key === 'Backspace') {
            event.preventDefault();
            this.backspace();
        }
        // 清空
        else if (key === 'Escape' || key === 'Delete') {
            event.preventDefault();
            this.clear();
        }
        // 模式切换
        else if (event.ctrlKey) {
            switch (key) {
                case '1':
                    event.preventDefault();
                    this.switchMode('BIN');
                    break;
                case '2':
                    event.preventDefault();
                    this.switchMode('OCT');
                    break;
                case '3':
                    event.preventDefault();
                    this.switchMode('DEC');
                    break;
                case '4':
                    event.preventDefault();
                    this.switchMode('HEX');
                    break;
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const calculator = new ProgrammerCalculator();
    
    console.log('计算器初始化完成');
});

// Tab 切换功能
class TabManager {
    constructor() {
        this.initTabs();
    }
    
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // 移除所有活动状态
                tabBtns.forEach(b => {
                    b.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
                    b.classList.add('text-gray-600', 'hover:text-gray-800');
                });
                tabPanels.forEach(p => {
                    p.classList.remove('block');
                    p.classList.add('hidden');
                });
                
                // 添加活动状态
                btn.classList.remove('text-gray-600', 'hover:text-gray-800');
                btn.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
                document.getElementById(targetTab + '-tab').classList.remove('hidden');
                document.getElementById(targetTab + '-tab').classList.add('block');
            });
        });
    }
}

// 单位换算器
class UnitConverter {
    constructor() {
        this.initConverters();
        this.disableInputs(); // 默认禁用所有输入
    }
    
    disableInputs() {
        const unitConverter = document.querySelector('.unit-converter');
        if (unitConverter) {
            const inputs = unitConverter.querySelectorAll('input[type="number"], select');
            inputs.forEach(input => input.disabled = true);
        }
    }
    
    initConverters() {
        // 长度换算
        this.setupConverter('length', {
            m: 1,
            cm: 100,
            mm: 1000,
            km: 0.001,
            inch: 39.3701,
            ft: 3.28084
        });
        
        // 重量换算
        this.setupConverter('weight', {
            kg: 1,
            g: 1000,
            mg: 1000000,
            t: 0.001,
            lb: 2.20462,
            oz: 35.274
        });
        
        // 温度换算（特殊处理）
        this.setupTemperatureConverter();
        
        // 面积换算
        this.setupConverter('area', {
            m2: 1,
            cm2: 10000,
            km2: 0.000001,
            acre: 0.000247105,
            hectare: 0.0001
        });
    }
    
    setupConverter(type, ratios) {
        const input = document.getElementById(type + '-input');
        const output = document.getElementById(type + '-output');
        const fromSelect = document.getElementById(type + '-from');
        const toSelect = document.getElementById(type + '-to');
        
        const convert = () => {
            const value = parseFloat(input.value);
            if (isNaN(value)) {
                output.value = '';
                return;
            }
            
            const fromUnit = fromSelect.value;
            const toUnit = toSelect.value;
            
            // 转换为基准单位，再转换为目标单位
            const baseValue = value / ratios[fromUnit];
            const result = baseValue * ratios[toUnit];
            
            output.value = result.toFixed(6).replace(/\.?0+$/, '');
        };
        
        input.addEventListener('input', convert);
        fromSelect.addEventListener('change', convert);
        toSelect.addEventListener('change', convert);
    }
    
    setupTemperatureConverter() {
        const input = document.getElementById('temp-input');
        const output = document.getElementById('temp-output');
        const fromSelect = document.getElementById('temp-from');
        const toSelect = document.getElementById('temp-to');
        
        const convert = () => {
            const value = parseFloat(input.value);
            if (isNaN(value)) {
                output.value = '';
                return;
            }
            
            const fromUnit = fromSelect.value;
            const toUnit = toSelect.value;
            
            let celsius = value;
            
            // 转换为摄氏度
            if (fromUnit === 'f') {
                celsius = (value - 32) * 5/9;
            } else if (fromUnit === 'k') {
                celsius = value - 273.15;
            }
            
            // 从摄氏度转换为目标单位
            let result = celsius;
            if (toUnit === 'f') {
                result = celsius * 9/5 + 32;
            } else if (toUnit === 'k') {
                result = celsius + 273.15;
            }
            
            output.value = result.toFixed(2);
        };
        
        input.addEventListener('input', convert);
        fromSelect.addEventListener('change', convert);
        toSelect.addEventListener('change', convert);
    }
}

// 贷款计算器
class LoanCalculator {
    constructor() {
        this.initCalculator();
    }
    
    initCalculator() {
        const calculateBtn = document.getElementById('calculate-loan');
        calculateBtn.addEventListener('click', () => this.calculateLoan());
        
        // 输入框变化时自动计算
        const inputs = ['loan-amount', 'loan-years', 'loan-rate'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                if (this.validateInputs()) {
                    this.calculateLoan();
                }
            });
        });
        
        document.getElementById('loan-type').addEventListener('change', () => {
            if (this.validateInputs()) {
                this.calculateLoan();
            }
        });
    }
    
    validateInputs() {
        const amount = parseFloat(document.getElementById('loan-amount').value);
        const years = parseFloat(document.getElementById('loan-years').value);
        const rate = parseFloat(document.getElementById('loan-rate').value);
        
        return !isNaN(amount) && !isNaN(years) && !isNaN(rate) && amount > 0 && years > 0 && rate > 0;
    }
    
    calculateLoan() {
        const amount = parseFloat(document.getElementById('loan-amount').value) * 10000; // 万元转元
        const years = parseFloat(document.getElementById('loan-years').value);
        const annualRate = parseFloat(document.getElementById('loan-rate').value) / 100;
        const loanType = document.getElementById('loan-type').value;
        
        if (!this.validateInputs()) {
            this.clearResults();
            return;
        }
        
        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;
        
        let monthlyPayment, totalInterest, totalPayment;
        
        if (loanType === 'equal-payment') {
            // 等额本息
            monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                           (Math.pow(1 + monthlyRate, totalMonths) - 1);
            totalPayment = monthlyPayment * totalMonths;
            totalInterest = totalPayment - amount;
        } else {
            // 等额本金
            const principalPayment = amount / totalMonths;
            totalInterest = 0;
            
            for (let i = 0; i < totalMonths; i++) {
                const remainingPrincipal = amount - (principalPayment * i);
                const interestPayment = remainingPrincipal * monthlyRate;
                totalInterest += interestPayment;
            }
            
            // 首月月供（等额本金月供递减）
            monthlyPayment = principalPayment + (amount * monthlyRate);
            totalPayment = amount + totalInterest;
        }
        
        this.displayResults(monthlyPayment, totalInterest, totalPayment, loanType);
    }
    
    displayResults(monthlyPayment, totalInterest, totalPayment, loanType) {
        const amountElement = document.getElementById('loan-amount');
        const yearsElement = document.getElementById('loan-years');
        const rateElement = document.getElementById('loan-rate');
        
        if (!amountElement || !yearsElement || !rateElement) {
            console.error('贷款计算器元素未找到');
            return;
        }
        
        const amount = parseFloat(amountElement.value);
        const years = parseInt(yearsElement.value);
        const annualRate = parseFloat(rateElement.value) / 100;
        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;
        
        if (loanType === 'equal-payment') {
            // 等额本息详细计算
            const monthlyPrincipal = amount / totalMonths;
            const monthlyInterestFirst = amount * monthlyRate;
            
            document.getElementById('monthly-principal').textContent = this.formatCurrency(monthlyPrincipal);
            document.getElementById('monthly-interest').textContent = this.formatCurrency(monthlyInterestFirst);
            document.getElementById('monthly-payment').textContent = this.formatCurrency(monthlyPayment);
            document.getElementById('cumulative-interest').textContent = this.formatCurrency(totalInterest);
            document.getElementById('cumulative-payment').textContent = this.formatCurrency(totalPayment);
        } else {
            // 等额本金详细计算
            const principalPayment = amount / totalMonths;
            const firstMonthInterest = amount * monthlyRate;
            
            document.getElementById('monthly-principal').textContent = this.formatCurrency(principalPayment);
            document.getElementById('monthly-interest').textContent = `${this.formatCurrency(firstMonthInterest)} (首月，递减)`;
            document.getElementById('monthly-payment').textContent = `${this.formatCurrency(monthlyPayment)} (首月，递减)`;
            document.getElementById('cumulative-interest').textContent = this.formatCurrency(totalInterest);
            document.getElementById('cumulative-payment').textContent = this.formatCurrency(totalPayment);
        }
        
        // 保持原有的显示项目
        document.getElementById('total-interest').textContent = this.formatCurrency(totalInterest);
        document.getElementById('total-payment').textContent = this.formatCurrency(totalPayment);
    }
    
    clearResults() {
        document.getElementById('monthly-principal').textContent = '-';
        document.getElementById('monthly-interest').textContent = '-';
        document.getElementById('monthly-payment').textContent = '-';
        document.getElementById('cumulative-interest').textContent = '-';
        document.getElementById('cumulative-payment').textContent = '-';
        document.getElementById('total-interest').textContent = '-';
        document.getElementById('total-payment').textContent = '-';
    }
    
    formatCurrency(amount) {
        return '¥' + amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// 个税计算器
class TaxCalculator {
    constructor() {
        this.initCalculator();
        this.taxBrackets = [
            { min: 0, max: 3000, rate: 0.03, deduction: 0 },
            { min: 3000, max: 12000, rate: 0.10, deduction: 210 },
            { min: 12000, max: 25000, rate: 0.20, deduction: 1410 },
            { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
            { min: 35000, max: 55000, rate: 0.30, deduction: 4410 },
            { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
            { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 }
        ];
    }
    
    initCalculator() {
        const calculateBtn = document.getElementById('calculate-tax');
        calculateBtn.addEventListener('click', () => this.calculateTax());
        
        // 输入框变化时自动计算
        const inputs = ['gross-salary', 'insurance', 'special-deduction', 'other-deduction'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                if (this.validateInputs()) {
                    this.calculateTax();
                }
            });
        });
    }
    
    validateInputs() {
        const grossSalary = parseFloat(document.getElementById('gross-salary').value);
        return !isNaN(grossSalary) && grossSalary > 0;
    }
    
    calculateTax() {
        const grossSalary = parseFloat(document.getElementById('gross-salary').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const specialDeduction = parseFloat(document.getElementById('special-deduction').value) || 0;
        const otherDeduction = parseFloat(document.getElementById('other-deduction').value) || 0;
        
        if (!this.validateInputs()) {
            this.clearResults();
            return;
        }
        
        // 基本减除费用（起征点）
        const basicDeduction = 5000;
        
        // 计算应纳税所得额
        const taxableIncome = Math.max(0, grossSalary - insurance - basicDeduction - specialDeduction - otherDeduction);
        
        // 计算个人所得税
        const taxResult = this.calculateIncomeTax(taxableIncome);
        
        // 计算税后月薪
        const netSalary = grossSalary - insurance - taxResult.tax;
        
        // 模拟累计已缴税款（假设为0，实际应用中可由用户输入）
        const paidTax = 0;
        const taxDiff = taxResult.tax - paidTax;
        
        this.displayResults(taxableIncome, taxResult, netSalary, paidTax, taxDiff);
    }
    
    calculateIncomeTax(taxableIncome) {
        if (taxableIncome <= 0) return 0;
        
        for (const bracket of this.taxBrackets) {
            if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
                return {
                    tax: taxableIncome * bracket.rate - bracket.deduction,
                    rate: bracket.rate,
                    deduction: bracket.deduction
                };
            }
        }
        
        return { tax: 0, rate: 0, deduction: 0 };
    }
    
    displayResults(taxableIncome, taxResult, netSalary, paidTax, taxDiff) {
        document.getElementById('taxable-income').textContent = this.formatCurrency(taxableIncome);
        document.getElementById('tax-rate').textContent = (taxResult.rate * 100).toFixed(0) + '%';
        document.getElementById('quick-deduction').textContent = this.formatCurrency(taxResult.deduction);
        document.getElementById('income-tax').textContent = this.formatCurrency(taxResult.tax);
        document.getElementById('paid-tax').textContent = this.formatCurrency(paidTax);
        document.getElementById('tax-diff').textContent = this.formatCurrency(taxDiff);
        document.getElementById('net-salary').textContent = this.formatCurrency(netSalary);
    }
    
    clearResults() {
        document.getElementById('taxable-income').textContent = '-';
        document.getElementById('tax-rate').textContent = '-';
        document.getElementById('quick-deduction').textContent = '-';
        document.getElementById('income-tax').textContent = '-';
        document.getElementById('paid-tax').textContent = '-';
        document.getElementById('tax-diff').textContent = '-';
        document.getElementById('net-salary').textContent = '-';
    }
    
    formatCurrency(amount) {
        return '¥' + amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    new TabManager();
    new UnitConverter();
    new LoanCalculator();
    new TaxCalculator();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgrammerCalculator, TabManager, UnitConverter, LoanCalculator, TaxCalculator };
}