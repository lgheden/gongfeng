/**
 * 代码美化工具
 * 支持多种编程语言的格式化、压缩和语法高亮
 */
class CodeBeautifier {
    constructor() {
        this.inputEditor = null;
        this.outputEditor = null;
        this.previewEditor = null;
        this.currentLanguage = 'javascript';
        this.originalCode = '';
        this.prettierInitialized = false;
        
        // 示例代码数据
        this.exampleCodes = {
            javascript: `// JavaScript 示例 - 计算器类
class Calculator {
constructor(){this.result=0;}
add(num){this.result+=num;return this;}
subtract(num){this.result-=num;return this;}
multiply(num){this.result*=num;return this;}
divide(num){if(num!==0){this.result/=num;}return this;}
getResult(){return this.result;}
reset(){this.result=0;return this;}
}

// 使用示例
const calc=new Calculator();
const result=calc.add(10).multiply(2).subtract(5).getResult();
console.log('计算结果:',result);`,
            
            html: `<!DOCTYPE html><html><head><title>示例页面</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5;}.container{max-width:800px;margin:0 auto;background:white;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}.header{text-align:center;color:#333;margin-bottom:30px;}.card{background:#fff;border:1px solid #ddd;border-radius:6px;padding:20px;margin:15px 0;}.btn{background:#007bff;color:white;padding:10px 20px;border:none;border-radius:4px;cursor:pointer;}</style></head><body><div class="container"><div class="header"><h1>欢迎来到我的网站</h1><p>这是一个示例HTML页面</p></div><div class="card"><h2>关于我们</h2><p>我们是一家专注于Web开发的公司。</p><button class="btn">了解更多</button></div></div></body></html>`,
            
            css: `/* CSS 示例 - 现代卡片布局 */
.card-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;padding:20px;}.card{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:15px;padding:25px;color:white;box-shadow:0 10px 30px rgba(0,0,0,0.2);transition:transform 0.3s ease,box-shadow 0.3s ease;}.card:hover{transform:translateY(-5px);box-shadow:0 15px 40px rgba(0,0,0,0.3);}.card-title{font-size:1.5em;margin-bottom:15px;font-weight:bold;}.card-content{line-height:1.6;opacity:0.9;}.card-button{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);color:white;padding:12px 24px;border-radius:25px;cursor:pointer;transition:all 0.3s ease;margin-top:20px;}.card-button:hover{background:rgba(255,255,255,0.3);transform:scale(1.05);}`,
            
            json: `{\n  // 项目基本信息\n  name: "示例项目",\n  version: "1.0.0",\n  description: "这是一个示例JSON5配置文件",\n  main: "index.js",\n  \n  // 脚本命令\n  scripts: {\n    start: "node index.js",\n    dev: "nodemon index.js",\n    test: "jest",\n    build: "webpack --mode production", // 生产环境构建\n  },\n  \n  // 生产依赖\n  dependencies: {\n    express: "^4.18.0",\n    mongoose: "^6.0.0",\n    bcryptjs: "^2.4.3",\n    jsonwebtoken: "^8.5.1",\n  },\n  \n  // 开发依赖\n  devDependencies: {\n    nodemon: "^2.0.0",\n    jest: "^27.0.0",\n    webpack: "^5.0.0",\n  },\n  \n  // 作者信息\n  author: "开发者",\n  license: "MIT",\n  keywords: ["node", "express", "api", "mongodb"],\n}`,
            
            python: `# Python 示例 - 学生管理系统\nclass Student:\n    def __init__(self,name,age,student_id):\n        self.name=name\n        self.age=age\n        self.student_id=student_id\n        self.grades=[]\n    def add_grade(self,subject,score):\n        self.grades.append({'subject':subject,'score':score})\n    def get_average(self):\n        if not self.grades:return 0\n        return sum(grade['score'] for grade in self.grades)/len(self.grades)\n    def __str__(self):\n        return f"学生: {self.name}, 年龄: {self.age}, 学号: {self.student_id}"\n\nclass StudentManager:\n    def __init__(self):\n        self.students=[]\n    def add_student(self,student):\n        self.students.append(student)\n    def find_student(self,student_id):\n        for student in self.students:\n            if student.student_id==student_id:\n                return student\n        return None\n    def get_top_students(self,n=3):\n        return sorted(self.students,key=lambda s:s.get_average(),reverse=True)[:n]\n\n# 使用示例\nmanager=StudentManager()\nstudent1=Student("张三",20,"2021001")\nstudent1.add_grade("数学",95)\nstudent1.add_grade("英语",88)\nmanager.add_student(student1)\nprint(f"平均分: {student1.get_average():.2f}")`,
            
            java: `// Java 示例 - 银行账户系统\npublic class BankAccount{private String accountNumber;private String ownerName;private double balance;public BankAccount(String accountNumber,String ownerName,double initialBalance){this.accountNumber=accountNumber;this.ownerName=ownerName;this.balance=initialBalance;}public boolean deposit(double amount){if(amount>0){balance+=amount;return true;}return false;}public boolean withdraw(double amount){if(amount>0&&amount<=balance){balance-=amount;return true;}return false;}public double getBalance(){return balance;}public String getAccountInfo(){return String.format("账户: %s, 户主: %s, 余额: %.2f",accountNumber,ownerName,balance);}}class SavingsAccount extends BankAccount{private double interestRate;public SavingsAccount(String accountNumber,String ownerName,double initialBalance,double interestRate){super(accountNumber,ownerName,initialBalance);this.interestRate=interestRate;}public void addInterest(){double interest=getBalance()*interestRate/100;deposit(interest);}}`,
            
            sql: `-- SQL 示例 - 电商数据库\nCREATE TABLE users(id INT PRIMARY KEY AUTO_INCREMENT,username VARCHAR(50) UNIQUE NOT NULL,email VARCHAR(100) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);CREATE TABLE products(id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(100) NOT NULL,description TEXT,price DECIMAL(10,2) NOT NULL,stock_quantity INT DEFAULT 0,category_id INT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_category(category_id),INDEX idx_price(price));CREATE TABLE orders(id INT PRIMARY KEY AUTO_INCREMENT,user_id INT NOT NULL,total_amount DECIMAL(10,2) NOT NULL,status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));INSERT INTO users(username,email,password_hash)VALUES('admin','admin@shop.com','$2y$10$hash'),('customer1','user1@email.com','$2y$10$hash2');SELECT u.username,COUNT(o.id) as order_count,SUM(o.total_amount) as total_spent FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE o.created_at>=DATE_SUB(NOW(),INTERVAL 30 DAY) GROUP BY u.id,u.username HAVING total_spent>100 ORDER BY total_spent DESC;`
        };

        this.init();
    }

    async init() {
        try {
            await this.initializePrettier();
            this.initializeElements();
            this.initializeEditors();
            this.bindEvents();
            this.showStatus('代码美化工具已就绪', 'info');
        } catch (error) {
            console.error('初始化失败:', error);
            // 即使Prettier初始化失败，也要初始化其他组件
            this.initializeElements();
            this.initializeEditors();
            this.bindEvents();
            this.showStatus('代码美化工具已就绪 (Prettier不可用)', 'warning');
        }
    }

    async initializePrettier() {
        try {
            // 检查Prettier是否已经通过script标签加载
            if (typeof window.prettier !== 'undefined') {
                this.prettier = window.prettier;
                this.prettierPlugins = {
                    babel: window.prettierPlugins?.babel,
                    estree: window.prettierPlugins?.estree,
                    html: window.prettierPlugins?.html,
                    css: window.prettierPlugins?.postcss,
                    typescript: window.prettierPlugins?.typescript,
                    markdown: window.prettierPlugins?.markdown
                };
            } else {
                throw new Error('Prettier not loaded via script tags');
            }
            
            // 可选插件暂时不支持，因为Chrome扩展的安全限制
            console.log('Optional plugins (PHP, XML, SQL) are not available in Chrome extension environment');
            
            this.prettierInitialized = true;
            console.log('Prettier initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Prettier:', error);
            this.prettier = null;
            this.prettierInitialized = false;
        }
    }

    initializeElements() {
        // 控制元素
        this.languageSelect = document.getElementById('languageSelect');
        this.indentType = document.getElementById('indentType');
        this.indentSize = document.getElementById('indentSize');
        this.showLineNumbers = document.getElementById('showLineNumbers');
        this.enableFolding = document.getElementById('enableFolding');
        this.wrapLines = document.getElementById('wrapLines');

        // 按钮元素
        this.beautifyBtn = document.getElementById('beautifyBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.validateBtn = document.getElementById('validateBtn');
        this.exampleBtn = document.getElementById('exampleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyInputBtn = document.getElementById('copyInputBtn');
        this.copyOutputBtn = document.getElementById('copyOutputBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.previewBtn = document.getElementById('previewBtn');
        this.uploadBtn = document.getElementById('uploadBtn');

        // 文件相关
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');

        // 统计信息
        this.lineCount = document.getElementById('lineCount');
        this.charCount = document.getElementById('charCount');
        this.fileSize = document.getElementById('fileSize');

        // 预览区域
        this.previewSection = document.getElementById('previewSection');
        this.previewFrame = document.getElementById('previewFrame');

        // 状态栏
        this.statusBar = document.getElementById('statusBar');
    }

    initializeEditors() {
        // 获取初始设置值
        const initialIndentSize = parseInt(this.indentSize.value);
        const initialUseTabs = this.indentType.value === 'tabs';

        // 初始化输入编辑器
        this.inputEditor = CodeMirror(document.getElementById('codeInput'), {
            mode: this.getCodeMirrorMode('javascript'),
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: false,
            gutters: ['CodeMirror-linenumbers'],
            indentUnit: initialIndentSize,
            indentWithTabs: initialUseTabs,
            smartIndent: true,
            electricChars: true,
            tabSize: initialIndentSize,
            autoCloseBrackets: true,
            matchBrackets: true,
            placeholder: '请输入或粘贴您的代码...',
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Ctrl-/': 'toggleComment',
                'Ctrl-A': 'selectAll',
                'F11': function (cm) {
                    cm.setOption('fullScreen', !cm.getOption('fullScreen'));
                },
                'Esc': function (cm) {
                    if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
                }
            }
        });

        // 初始化输出编辑器
        this.outputEditor = CodeMirror(document.getElementById('codeOutput'), {
            mode: this.getCodeMirrorMode('javascript'),
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            foldGutter: false,
            gutters: ['CodeMirror-linenumbers'],
            indentUnit: initialIndentSize,
            indentWithTabs: initialUseTabs,
            smartIndent: true,
            electricChars: true,
            tabSize: initialIndentSize,
            placeholder: '美化后的代码将显示在这里...'
        });

        // 监听输入变化
        this.inputEditor.on('change', () => {
            this.updateStats();
            this.clearMessages();
        });
    }

    bindEvents() {
        // 语言选择
        this.languageSelect.addEventListener('change', () => {
            this.currentLanguage = this.languageSelect.value;
            this.updateEditorMode();
        });

        // 编辑器选项
        this.showLineNumbers.addEventListener('change', () => {
            const show = this.showLineNumbers.checked;
            this.inputEditor.setOption('lineNumbers', show);
            this.outputEditor.setOption('lineNumbers', show);
        });

        this.enableFolding.addEventListener('change', () => {
            const enable = this.enableFolding.checked;
            const gutters = enable ?
                ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'] :
                ['CodeMirror-linenumbers'];

            this.inputEditor.setOption('foldGutter', enable);
            this.inputEditor.setOption('gutters', gutters);
            this.outputEditor.setOption('foldGutter', enable);
            this.outputEditor.setOption('gutters', gutters);
        });

        this.wrapLines.addEventListener('change', () => {
            const wrap = this.wrapLines.checked;
            this.inputEditor.setOption('lineWrapping', wrap);
            this.outputEditor.setOption('lineWrapping', wrap);
        });

        this.indentSize.addEventListener('change', () => {
            const size = parseInt(this.indentSize.value);
            this.inputEditor.setOption('indentUnit', size);
            this.inputEditor.setOption('tabSize', size);
            this.outputEditor.setOption('indentUnit', size);
            this.outputEditor.setOption('tabSize', size);
        });

        this.indentType.addEventListener('change', () => {
            const useTabs = this.indentType.value === 'tabs';
            this.inputEditor.setOption('indentWithTabs', useTabs);
            this.outputEditor.setOption('indentWithTabs', useTabs);
        });

        // 按钮事件
        this.beautifyBtn.addEventListener('click', () => this.beautifyCode());
        this.minifyBtn.addEventListener('click', () => this.minifyCode());
        this.validateBtn.addEventListener('click', () => this.validateCode());
        this.exampleBtn.addEventListener('click', () => this.showExampleCode());
        this.clearBtn.addEventListener('click', () => this.clearCode());
        this.copyInputBtn.addEventListener('click', () => this.copyToClipboard('input'));
        this.copyOutputBtn.addEventListener('click', () => this.copyToClipboard('output'));
        this.downloadBtn.addEventListener('click', () => this.downloadCode());
        this.previewBtn.addEventListener('click', () => this.togglePreview());
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());

        // 文件上传
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // 拖拽上传
        this.setupDragAndDrop();
    }

    getCodeMirrorMode(language) {
        const modeMap = {
            'javascript': 'javascript',
            'typescript': 'javascript',
            'html': 'htmlmixed',
            'css': 'css',
            'json': { name: 'javascript', json: true },
            'xml': 'xml',
            'sql': 'sql',
            'python': 'python',
            'java': 'text/x-java',
            'csharp': 'text/x-csharp',
            'cpp': 'text/x-c++src',
            'php': 'php',
            'go': 'go',
            'rust': 'rust',
            'markdown': 'markdown'
        };
        return modeMap[language] || 'text';
    }

    updateEditorMode() {
        const mode = this.getCodeMirrorMode(this.currentLanguage);
        this.inputEditor.setOption('mode', mode);
        this.outputEditor.setOption('mode', mode);
        this.showStatus(`已切换到 ${this.languageSelect.options[this.languageSelect.selectedIndex].text} 模式`, 'info');
    }

    async beautifyCode() {
        const code = this.inputEditor.getValue();
        if (!code.trim()) {
            this.showStatus('请输入要美化的代码', 'error');
            return;
        }

        this.showStatus('正在美化代码...', 'info');
        this.beautifyBtn.classList.add('loading');

        try {
            let beautifiedCode = '';
            
            // JSON使用原有的美化逻辑
            if (this.currentLanguage === 'json') {
                const indentChar = this.indentType.value === 'tabs' ? '\t' : ' '.repeat(parseInt(this.indentSize.value));
                beautifiedCode = this.beautifyJSON(code, indentChar);
            } else {
                // 其他语言使用Prettier
                beautifiedCode = await this.beautifyWithPrettier(code);
            }

            this.outputEditor.setValue(beautifiedCode);
            this.showStatus('代码美化完成', 'success');
            this.updateStats();
            
            // 如果预览是开启状态，自动更新预览内容
            this.updatePreviewIfActive();
        } catch (error) {
            this.showStatus(`美化失败: ${error.message}`, 'error');
        } finally {
            this.beautifyBtn.classList.remove('loading');
        }
    }

    async beautifyWithPrettier(code) {
        if (!this.prettier || !this.prettierInitialized) {
            throw new Error('Prettier未初始化，使用备用美化方法');
        }

        try {
            const options = this.getPrettierOptions();
            const parser = this.getPrettierParser();
            const plugins = this.getPrettierPlugins();

            if (!parser) {
                throw new Error(`不支持的语言: ${this.currentLanguage}`);
            }

            const result = await this.prettier.format(code, {
                ...options,
                parser: parser,
                plugins: plugins
            });

            return result;
        } catch (error) {
            console.error('Prettier formatting failed:', error);
            // 如果Prettier失败，回退到原有的美化方法
            return this.fallbackBeautify(code);
        }
    }

    getPrettierOptions() {
        const indentSize = parseInt(this.indentSize.value);
        const useTabs = this.indentType.value === 'tabs';

        return {
            tabWidth: indentSize,
            useTabs: useTabs,
            semi: true,
            singleQuote: false,
            quoteProps: 'as-needed',
            trailingComma: 'es5',
            bracketSpacing: true,
            bracketSameLine: false,
            arrowParens: 'always',
            printWidth: 80,
            endOfLine: 'lf'
        };
    }

    getPrettierParser() {
        const parserMap = {
            'javascript': 'babel',
            'typescript': 'typescript',
            'html': 'html',
            'css': 'css',
            'markdown': 'markdown'
            // 其他语言不支持Prettier，将使用备用美化方法
        };
        return parserMap[this.currentLanguage] || null;
    }

    getPrettierPlugins() {
        const plugins = [];
        
        // 基础插件
        if (this.prettierPlugins.babel) plugins.push(this.prettierPlugins.babel);
        if (this.prettierPlugins.estree) plugins.push(this.prettierPlugins.estree);
        
        // 根据语言添加特定插件
        switch (this.currentLanguage) {
            case 'html':
                if (this.prettierPlugins.html) plugins.push(this.prettierPlugins.html);
                break;
            case 'css':
                if (this.prettierPlugins.css) plugins.push(this.prettierPlugins.css);
                break;
            case 'typescript':
                if (this.prettierPlugins.typescript) plugins.push(this.prettierPlugins.typescript);
                break;
            case 'php':
                if (this.prettierPlugins.php) plugins.push(this.prettierPlugins.php);
                break;
            case 'xml':
                if (this.prettierPlugins.xml) plugins.push(this.prettierPlugins.xml);
                break;
            case 'sql':
                if (this.prettierPlugins.sql) plugins.push(this.prettierPlugins.sql);
                break;
            case 'markdown':
                if (this.prettierPlugins.markdown) plugins.push(this.prettierPlugins.markdown);
                break;
        }
        
        return plugins;
    }

    fallbackBeautify(code) {
        const indentChar = this.indentType.value === 'tabs' ? '\t' : ' '.repeat(parseInt(this.indentSize.value));
        
        // 根据语言选择备用美化方法
        switch (this.currentLanguage) {
            case 'javascript':
            case 'typescript':
                return this.beautifyJavaScript(code, indentChar);
            case 'java':
                return this.beautifyJava(code, indentChar);
            case 'python':
                return this.beautifyPython(code, indentChar);
            case 'csharp':
                return this.beautifyCSharp(code, indentChar);
            case 'cpp':
            case 'c':
                return this.beautifyCpp(code, indentChar);
            case 'php':
                return this.beautifyPHP(code, indentChar);
            case 'go':
                return this.beautifyGo(code, indentChar);
            case 'rust':
                return this.beautifyRust(code, indentChar);
            case 'sql':
                return this.beautifySQL(code, indentChar);
            case 'html':
                return this.beautifyHTML(code, indentChar);
            case 'css':
                return this.beautifyCSS(code, indentChar);
            case 'xml':
                return this.beautifyXML(code, indentChar);
            default:
                return this.beautifyGeneric(code, indentChar);
        }
    }

    beautifyJavaScript(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        // JavaScript美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // 移除所有现有的缩进和多余空白（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'" || char === '`')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += '{\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyJava(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为4个空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        // Java美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // 移除所有现有的缩进和多余空白（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'")) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += '{\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === '@') {
                    // 处理Java注解
                    if (result.trim() && !result.endsWith('\n')) {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyPython(code, indent) {
        // Python美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释（Python使用#）
        code = code.replace(/#.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行字符串注释（Python的三引号）
        code = code.replace(/"""[\s\S]*?"""/g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        code = code.replace(/'''[\s\S]*?'''/g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // Python美化实现 - 基于缩进的语法结构（注释已被保护）
        const lines = code.split('\n').map(line => line.trim()).filter(line => line);
        let result = '';
        let indentLevel = 0;
        let inMultilineStatement = false;
        let multilineIndentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const nextLine = lines[i + 1] || '';
            const prevLine = lines[i - 1] || '';

            // 处理多行语句的结束
            if (inMultilineStatement && !line.endsWith('\\') && !line.match(/[\(\[{,]\s*$/)) {
                inMultilineStatement = false;
                indentLevel = multilineIndentLevel;
            }

            // 减少缩进的关键字
            if (line.match(/^(except|elif|else|finally)\b/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // 处理右括号、右方括号、右大括号的缩进
            if (line.match(/^[\)\]\}]/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // 添加当前行
            let currentIndent = indentLevel;
            if (inMultilineStatement) {
                currentIndent = multilineIndentLevel + 1;
            }
            
            result += indent.repeat(currentIndent) + line + '\n';

            // 增加缩进的关键字（以冒号结尾的语句）
            if (line.match(/:(\s*#.*|\s*__COMMENT_\d+__)?$/)) {
                indentLevel++;
                
                // 在类和函数定义后添加空行
                if (line.match(/^(class|def)\b/) && nextLine && !nextLine.match(/^(class|def|@)\b/)) {
                    result += '\n';
                }
            }

            // 处理多行语句的开始
            if (line.endsWith('\\') || line.match(/[\(\[{,]\s*$/)) {
                if (!inMultilineStatement) {
                    inMultilineStatement = true;
                    multilineIndentLevel = indentLevel;
                }
            }

            // 在装饰器后不添加额外缩进
            if (line.startsWith('@') && nextLine && nextLine.match(/^(def|class)\b/)) {
                // 装饰器不影响缩进级别
            }
        }

        // 恢复被保护的注释内容
        let finalResult = result.trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyCSharp(code, indent) {
        // C#美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // C#美化实现 - 类似Java但有C#特有语法（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, ' {')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'")) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += ' {\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === '[' && prevChar === ']') {
                    // 处理C#特性
                    if (result.trim() && !result.endsWith('\n')) {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyCpp(code, indent) {
        // C++美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // C++美化实现 - 处理C++特有语法（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, ' {')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'")) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += ' {\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === '#') {
                    // 处理预处理指令
                    if (result.trim() && !result.endsWith('\n')) {
                        result += '\n';
                    }
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyPHP(code, indent) {
        // PHP美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释（PHP使用//和#）
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        code = code.replace(/#.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // PHP美化实现 - 处理PHP特有语法（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, ' {')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'" || char === '`')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += ' {\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === '<' && nextChar === '?') {
                    // 处理PHP开始标签
                    if (result.trim() && !result.endsWith('\n')) {
                        result += '\n';
                    }
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyGo(code, indent) {
        // Go美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // Go美化实现 - 处理Go特有语法（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, ' {')
            .replace(/\s*}\s*/g, '}')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'" || char === '`')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += ' {\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyRust(code, indent) {
        // Rust美化实现 - 保护注释内容不被处理
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护单行注释
        code = code.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });

        // Rust美化实现 - 处理Rust特有语法（注释已被保护）
        const normalized = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\s*{\s*/g, ' {')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/[ \t]+/g, ' '); // 只替换空格和制表符，保留换行符

        let result = '';
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';
        let inComment = false;
        let inMultiComment = false;

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';
            const prevChar = normalized[i - 1] || '';

            // 处理字符串
            if (!inComment && !inMultiComment && (char === '"' || char === "'")) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && prevChar !== '\\') {
                    inString = false;
                    stringChar = '';
                }
            }

            // 处理注释
            if (!inString) {
                if (char === '/' && nextChar === '/' && !inMultiComment) {
                    inComment = true;
                } else if (char === '/' && nextChar === '*') {
                    inMultiComment = true;
                } else if (char === '*' && nextChar === '/' && inMultiComment) {
                    inMultiComment = false;
                    result += char + nextChar;
                    i++;
                    continue;
                } else if (char === '\n' && inComment) {
                    inComment = false;
                }
            }

            if (!inString && !inComment && !inMultiComment) {
                if (char === '{') {
                    result += ' {\n';
                    indentLevel++;
                    result += indent.repeat(indentLevel);
                    continue;
                } else if (char === '}') {
                    if (result.trim().endsWith(indent)) {
                        result = result.trimEnd();
                    }
                    result += '\n';
                    indentLevel = Math.max(0, indentLevel - 1);
                    result += indent.repeat(indentLevel) + char;
                    if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === ';') {
                    result += char;
                    if (nextChar && nextChar !== '}' && nextChar !== '\n') {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    continue;
                } else if (char === '#' && nextChar === '[') {
                    // 处理Rust属性
                    if (result.trim() && !result.endsWith('\n')) {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                }
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyHTML(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        // HTML美化 - 改进的实现
        const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr', 'param'];
        const inlineTags = ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 'small', 'code', 'kbd', 'samp', 'var', 'sub', 'sup'];
        
        // 预处理：保护注释和脚本内容
        let protectedItems = [];
        let processedCode = code;
        
        // 保护HTML注释
        processedCode = processedCode.replace(/<!--[\s\S]*?-->/g, (match) => {
            protectedItems.push(match);
            return `__COMMENT_${protectedItems.length - 1}__`;
        });
        
        // 处理并格式化script和style标签内容
         processedCode = processedCode.replace(/<(script|style)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tagName, attributes, content) => {
             let formattedContent = content.trim();
             if (formattedContent) {
                 try {
                     if (tagName.toLowerCase() === 'script') {
                         // 格式化JavaScript代码
                         formattedContent = this.beautifyJavaScript(formattedContent, indent);
                     } else if (tagName.toLowerCase() === 'style') {
                         // 格式化CSS代码
                         formattedContent = this.beautifyCSS(formattedContent, indent);
                     }
                     // 为内容添加适当的缩进
                     const contentLines = formattedContent.split('\n');
                     const indentedContent = contentLines.map((line, index) => {
                         if (line.trim()) {
                             return indent + line;
                         }
                         return line;
                     }).join('\n');
                     formattedContent = '\n' + indentedContent + '\n';
                 } catch (e) {
                     // 如果格式化失败，保持原内容
                     console.warn(`Failed to format ${tagName} content:`, e);
                     formattedContent = content;
                 }
             }
             const formattedTag = `<${tagName}${attributes}>${formattedContent}</${tagName}>`;
             protectedItems.push(formattedTag);
             return `__PROTECTED_${protectedItems.length - 1}__`;
         });
        
        // 规范化空白字符
        processedCode = processedCode
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/\s*<\s*/g, '<')
            .replace(/\s*>\s*/g, '>')
            .trim();
        
        let result = '';
        let indentLevel = 0;
        let i = 0;
        
        while (i < processedCode.length) {
            if (processedCode[i] === '<') {
                // 找到完整的标签
                let tagEnd = processedCode.indexOf('>', i);
                if (tagEnd === -1) break;
                
                let fullTag = processedCode.substring(i, tagEnd + 1);
                let isClosingTag = fullTag.startsWith('</');
                let isSelfClosing = fullTag.endsWith('/>');
                
                // 提取标签名
                let tagNameMatch = fullTag.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/i);
                let tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
                
                // 处理缩进
                if (isClosingTag) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                
                // 添加换行和缩进（除了第一个标签）
                if (result.trim() && !inlineTags.includes(tagName)) {
                    result += '\n' + indent.repeat(indentLevel);
                }
                
                result += fullTag;
                
                // 增加缩进（对于非自闭合的开始标签）
                if (!isClosingTag && !isSelfClosing && !selfClosingTags.includes(tagName)) {
                    indentLevel++;
                }
                
                i = tagEnd + 1;
            } else {
                // 处理文本内容
                let textStart = i;
                let nextTag = processedCode.indexOf('<', i);
                if (nextTag === -1) nextTag = processedCode.length;
                
                let textContent = processedCode.substring(textStart, nextTag).trim();
                if (textContent) {
                    // 如果前面有标签且不是内联标签，添加换行和缩进
                    if (result.trim() && !result.endsWith('>')) {
                        result += '\n' + indent.repeat(indentLevel);
                    }
                    result += textContent;
                }
                
                i = nextTag;
            }
        }
        
        // 恢复保护的内容
        for (let j = protectedItems.length - 1; j >= 0; j--) {
            result = result.replace(new RegExp(`__(COMMENT|PROTECTED)_${j}__`, 'g'), protectedItems[j]);
        }
        
        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyCSS(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        // CSS美化 - 先保护注释，再规范化，最后重新格式化
        // 先提取并保护注释内容
        const commentPlaceholders = [];
        let commentIndex = 0;
        
        // 保护多行注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${commentIndex}__`;
            commentPlaceholders[commentIndex] = match;
            commentIndex++;
            return placeholder;
        });
        
        // 移除所有现有的缩进和多余空白（注释已被保护）
        const normalized = code
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*,\s*/g, ',')
            .trim();

        let result = '';
        let indentLevel = 0;
        let inRule = false;
        let currentSelector = '';

        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            const nextChar = normalized[i + 1] || '';

            if (char === '{') {
                // 处理选择器
                if (currentSelector.trim()) {
                    const selectors = currentSelector.split(',');
                    result += selectors.map(sel => sel.trim()).join(',\n') + ' {\n';
                } else {
                    result += ' {\n';
                }
                indentLevel++;
                inRule = true;
                currentSelector = '';
                continue;
            } else if (char === '}') {
                if (inRule) {
                    // 移除最后一个属性后的多余换行和缩进
                    result = result.replace(/\n\s*$/, '');
                    result += '\n';
                }
                indentLevel = Math.max(0, indentLevel - 1);
                result += '}\n';
                if (nextChar && nextChar !== '}') {
                    result += '\n';
                }
                inRule = false;
                continue;
            } else if (char === ';' && inRule) {
                result += ';\n' + indent.repeat(indentLevel);
                continue;
            } else if (char === ':' && inRule) {
                result += ': ';
                continue;
            } else if (!inRule) {
                currentSelector += char;
                continue;
            }

            // 在规则内部，添加适当的缩进
            if (inRule && result.endsWith('\n')) {
                result += indent.repeat(indentLevel);
            }

            result += char;
        }

        // 恢复被保护的注释内容
        let finalResult = result.replace(/\n\s*\n/g, '\n').trim();
        commentPlaceholders.forEach((comment, index) => {
            finalResult = finalResult.replace(`__COMMENT_${index}__`, comment);
        });
        
        return finalResult;
    }

    beautifyJSON(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        try {
            // 使用JSON5解析支持扩展语法，但输出标准JSON格式
            const parsed = JSON5.parse(code);
            const indentStr = this.indentType.value === 'tabs' ? '\t' : ' '.repeat(parseInt(this.indentSize.value));
            return JSON.stringify(parsed, null, indentStr);
        } catch (error) {
            throw new Error('无效的JSON5格式');
        }
    }

    beautifyXML(code, indent) {
        // 简单的XML美化
        return this.beautifyHTML(code, indent);
    }

    beautifySQL(code, indent) {
        // SQL美化实现 - 保护注释内容不被处理
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格
        
        // 注释保护将在后续的protectedItems机制中统一处理

        const keywords = {
            major: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'WITH', 'DECLARE', 'SET'],
            join: ['JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN'],
            clause: ['AND', 'OR', 'ON', 'WHEN', 'THEN', 'ELSE', 'CASE', 'END', 'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT', 'EXISTS', 'NOT EXISTS'],
            functions: ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'TOP', 'LIMIT', 'OFFSET', 'SUBSTRING', 'CONCAT', 'UPPER', 'LOWER', 'TRIM'],
            operators: ['=', '<>', '!=', '<', '>', '<=', '>=', 'LIKE', 'IN', 'NOT IN', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'NOT LIKE']
        };

        // 预处理：保护字符串（注释已被保护）
        let protectedItems = [];
        let protectedCode = code;

        // 保护字符串
        protectedCode = protectedCode.replace(/'([^'\\]|\\.)*'/g, (match) => {
            protectedItems.push(match);
            return `__STRING_${protectedItems.length - 1}__`;
        });
        protectedCode = protectedCode.replace(/"([^"\\]|\\.)*"/g, (match) => {
            protectedItems.push(match);
            return `__STRING_${protectedItems.length - 1}__`;
        });

        // 保护单行注释
        protectedCode = protectedCode.split('\n').map(line => {
            return line.replace(/(--.*$)/g, (match) => {
                protectedItems.push(match);
                return `__COMMENT_${protectedItems.length - 1}__`;
            });
        }).join('\n');

        // 保护多行注释
        protectedCode = protectedCode.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
            protectedItems.push(match);
            return `__COMMENT_${protectedItems.length - 1}__`;
        });

        // 规范化代码 - 保持注释的换行结构
        let normalized = protectedCode
            // 先处理非换行的空白字符
            .replace(/[ \t]+/g, ' ')
            // 处理多个连续换行符
            .replace(/\n\s*\n/g, '\n')
            .replace(/,\s*/g, ',')
            .replace(/\(\s*/g, '(')
            .replace(/\s*\)/g, ')')
            .replace(/\s*=\s*/g, ' = ')
            .replace(/\s*<>\s*/g, ' <> ')
            .replace(/\s*!=\s*/g, ' != ')
            .replace(/\s*<\s*/g, ' < ')
            .replace(/\s*>\s*/g, ' > ')
            .replace(/\s*<=\s*/g, ' <= ')
            .replace(/\s*>=\s*/g, ' >= ')
            .trim();

        let result = '';
        let indentLevel = 0;
        let subqueryLevel = 0;

        // 按行处理，保持注释与字段的关联
        const normalizedLines = normalized.split('\n');
        const tokens = [];

        // 将每行的内容分割成tokens，但保持行的结构信息
        for (let lineIndex = 0; lineIndex < normalizedLines.length; lineIndex++) {
            const line = normalizedLines[lineIndex].trim();
            if (line) {
                // 特殊处理：先分离注释占位符，确保它们独立成为token
                let processedLine = line;
                const commentMatches = [];

                // 提取所有注释占位符
                processedLine = processedLine.replace(/__COMMENT_\d+__/g, (match) => {
                    commentMatches.push(match);
                    return ` ${match} `; // 在注释占位符前后添加空格，确保独立分割
                });

                if (processedLine.includes('__COMMENT_')) {
                    tokens.push({
                        token: processedLine,
                        lineIndex: lineIndex,
                        isLastInLine: 0
                    });
                } else {
                    const lineTokens = processedLine.split(/\s+/).filter(token => token.trim());
                    for (let tokenIndex = 0; tokenIndex < lineTokens.length; tokenIndex++) {
                        tokens.push({
                            token: lineTokens[tokenIndex],
                            lineIndex: lineIndex,
                            isLastInLine: tokenIndex === lineTokens.length - 1
                        });
                    }
                }
            }
        }

        for (let i = 0; i < tokens.length; i++) {
            const tokenObj = tokens[i];
            const token = tokenObj.token.toUpperCase();
            const originalToken = tokenObj.token;
            const nextTokenObj = tokens[i + 1];
            const nextToken = nextTokenObj ? nextTokenObj.token.toUpperCase() : '';
            const prevTokenObj = tokens[i - 1];
            const prevToken = prevTokenObj ? prevTokenObj.token.toUpperCase() : '';

            // 处理保护的字符串和注释
            if (originalToken.includes('__STRING_') || originalToken.includes('__COMMENT_')) {
                const index = parseInt(originalToken.match(/\d+/)[0]);
                let restored = protectedItems[index];
                // 注释处理：保持原始格式
                if (restored.startsWith('--') || restored.startsWith('/*')) {
                    // 检查是否是行中的第一个token（注释独占一行）
                    const isFirstInLine = i === 0 || (prevTokenObj && prevTokenObj.lineIndex < tokenObj.lineIndex);

                    if (isFirstInLine) {
                        // 注释独占一行，需要换行并缩进
                        if (result.trim()) {
                            result += '\n';
                        }
                        let originalTokenText = originalToken.replace("__COMMENT_" + index + "__", restored);
                        result += originalTokenText;
                    } else {
                        // 注释与字段在同一行，直接添加注释
                        result += ' ' + restored;
                    }
                } else {
                    // 字符串处理 - 不自动添加空格，让后续逻辑处理
                    result += restored;
                }
                continue;
            }

            // 处理子查询括号
            if (originalToken.includes('(')) {
                subqueryLevel++;
            }
            if (originalToken.includes(')')) {
                subqueryLevel = Math.max(0, subqueryLevel - 1);
            }

            // 主要关键字 - 大写并独占一行
            if (keywords.major.includes(token)) {
                if (result.trim()) {
                    result += '\n';
                }
                result += token;

                // 根据关键字类型决定后续格式
                if (token === 'SELECT') {
                    if (i == 0) {
                        result += indent;
                    } else {
                        result += '\n' + indent;
                    }
                    indentLevel = 1;
                } else {
                    result += ' ';
                    indentLevel = 0;
                }
            }
            // JOIN 关键字 - 大写并独占一行
            else if (keywords.join.includes(token) ||
                (token === 'LEFT' && (nextToken === 'JOIN' || nextToken === 'OUTER')) ||
                (token === 'RIGHT' && (nextToken === 'JOIN' || nextToken === 'OUTER')) ||
                (token === 'INNER' && nextToken === 'JOIN') ||
                (token === 'FULL' && (nextToken === 'JOIN' || nextToken === 'OUTER')) ||
                (token === 'CROSS' && nextToken === 'JOIN')) {
                result += '\n' + token + ' ';
            }
            // 逻辑操作符 - 大写，AND/OR缩进与WHERE对齐
            else if (keywords.clause.includes(token)) {
                if (token === 'AND' || token === 'OR') {
                    result += '\n' + token + ' ';
                } else if (token === 'ON') {
                    result += '\n' + indent + token + ' ';
                } else if (token === 'UNION' || token === 'UNION ALL' || token === 'INTERSECT' || token === 'EXCEPT') {
                    result += '\n' + token + '\n';
                } else {
                    result += token + ' ';
                }
            }
            // 逗号处理 - 逗号在行尾，下一个字段换行缩进
            else if (originalToken.endsWith(',')) {
                const tokenWithoutComma = originalToken.slice(0, -1);
                result += tokenWithoutComma + ',';
                if (indentLevel > 0) {
                    result += '\n' + indent;
                } else {
                    result += ' ';
                }
            }
            // 函数名 - 大写，函数名和括号之间没有空格
            else if (keywords.functions.includes(token)) {
                result += token;
                if (nextTokenObj && nextTokenObj.token.startsWith('(')) {
                    // 函数名后直接跟括号，不加空格
                } else {
                    result += ' ';
                }
            }
            // 操作符 - 前后有空格
            else if (keywords.operators.includes(token) || keywords.operators.includes(originalToken)) {
                result += ' ' + originalToken + ' ';
            }
            // AS 关键字处理
            else if (token === 'AS') {
                result += ' ' + token + ' ';
            }
            // 处理子查询括号
            else if (originalToken === '(' && nextToken === 'SELECT') {
                result += originalToken + '\n' + indent.repeat(subqueryLevel);
            }
            else if (originalToken === ')' && subqueryLevel === 0) {
                result = result.trimEnd() + originalToken + ' ';
            }
            // 普通标识符和值
            else {
                result += originalToken;
                // 只在需要时添加空格
                if (i < tokens.length - 1 && !tokenObj.isLastInLine) {
                    const nextOriginalToken = nextTokenObj.token;
                    // 如果下一个token不是标点符号，则添加空格
                    if (!nextOriginalToken.match(/^[,()\[\];]$/)) {
                        result += ' ';
                    }
                }
            }
        }

        // 最终格式化处理
        let finalResult = result
            .split('\n')
            .map(line => line.trim())
            .map((line, index, lines) => {
                if (!line) return ''; // 保留空行
                // 检查是否为注释行
                const isComment = line.includes('--') || line.includes('/*') || line.includes('*/');

                // 缩进规则
                if (line.match(/^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|DECLARE|SET)\b/)) {
                    return line; // 主要关键字不缩进
                } else if (line.match(/^(AND|OR)\b/)) {
                    return line; // AND/OR与WHERE对齐，不额外缩进
                } else if (line.match(/^(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|LEFT OUTER JOIN|RIGHT OUTER JOIN|FULL OUTER JOIN)\b/)) {
                    return line; // JOIN不缩进
                } else if (line.match(/^(UNION|UNION ALL|INTERSECT|EXCEPT)\b/)) {
                    return line; // 集合操作不缩进
                } else if (line.match(/^ON\b/)) {
                    return indent + line; // ON条件缩进
                } else if (isComment && line.trim().startsWith('--')) {
                    // 单行注释：根据上下文决定缩进
                    const prevLine = lines[index - 1] || '';
                    if (prevLine.match(/^SELECT\b/) || prevLine.endsWith(',') || prevLine.match(/^FROM\b/) || prevLine.match(/^WHERE\b/) || prevLine.match(/^GROUP BY\b/) || prevLine.match(/^ORDER BY\b/) || prevLine.match(/^HAVING\b/)) {
                        return indent + line;
                    }
                    return line;
                } else {
                    // 字段列表、表名等内容缩进
                    const prevLine = lines[index - 1] || '';
                    if (prevLine.match(/^SELECT\b/) || prevLine.endsWith(',') || prevLine.match(/^FROM\b/) || prevLine.match(/^WHERE\b/) || prevLine.match(/^GROUP BY\b/) || prevLine.match(/^ORDER BY\b/) || prevLine.match(/^HAVING\b/)) {
                        return indent + line;
                    }
                    return line;
                }
            })
            .join('\n');
            
        // 恢复被保护的注释内容
        protectedItems.forEach((item, index) => {
            if (item.startsWith('--') || item.startsWith('/*')) {
                finalResult = finalResult.replace(`__COMMENT_${index}__`, item);
            } else {
                finalResult = finalResult.replace(`__STRING_${index}__`, item);
            }
        });
        
        return finalResult;
    }

    beautifyGeneric(code, indent) {
        // 统一处理Tab和空格：将所有Tab转换为空格
        code = code.replace(/\t/g, '    '); // 将Tab转换为4个空格

        // 通用美化：处理缩进转换和格式化
        const lines = code.split('\n');
        let indentLevel = 0;

        return lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';

            // 检查是否有闭合符号，需要减少缩进
            const hasClosing = /[}\])]/.test(trimmed);
            if (hasClosing) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // 应用新的缩进
            const result = indent.repeat(indentLevel) + trimmed;

            // 检查是否有开放符号，需要增加缩进
            const hasOpening = /[{\[(]/.test(trimmed);
            if (hasOpening) {
                indentLevel++;
            }

            return result;
        }).join('\n');
    }

    minifyCode() {
        const code = this.inputEditor.getValue();
        if (!code.trim()) {
            this.showStatus('请输入要压缩的代码', 'error');
            return;
        }

        this.showStatus('正在压缩代码...', 'info');
        this.minifyBtn.classList.add('loading');

        try {
            let minifiedCode = '';

            switch (this.currentLanguage) {
                case 'javascript':
                case 'typescript':
                    minifiedCode = this.minifyJavaScript(code);
                    break;
                case 'css':
                    minifiedCode = this.minifyCSS(code);
                    break;
                case 'html':
                    minifiedCode = this.minifyHTML(code);
                    break;
                case 'json':
                    minifiedCode = this.minifyJSON(code);
                    break;
                case 'sql':
                    minifiedCode = this.minifySQL(code);
                    break;
                case 'python':
                    minifiedCode = this.minifyPython(code);
                    break;
                case 'java':
                case 'csharp':
                case 'cpp':
                    minifiedCode = this.minifyJavaLike(code);
                    break;
                case 'php':
                    minifiedCode = this.minifyPHP(code);
                    break;
                case 'go':
                    minifiedCode = this.minifyGo(code);
                    break;
                case 'rust':
                    minifiedCode = this.minifyRust(code);
                    break;
                case 'markdown':
                    minifiedCode = this.minifyMarkdown(code);
                    break;
                case 'xml':
                    minifiedCode = this.minifyXML(code);
                    break;
                default:
                    minifiedCode = this.minifyGeneric(code);
            }

            this.outputEditor.setValue(minifiedCode);
            this.showStatus('代码压缩完成', 'success');
            this.updateStats();
            
            // 如果预览是开启状态，自动更新预览内容
            this.updatePreviewIfActive();
        } catch (error) {
            this.showStatus(`压缩失败: ${error.message}`, 'error');
        } finally {
            this.minifyBtn.classList.remove('loading');
        }
    }

    minifyJavaScript(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
            .replace(/\/\/.*$/gm, '') // 移除单行注释
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/;\s*}/g, '}') // 移除分号前的空格
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .trim();
    }

    minifyCSS(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/;\s*}/g, '}') // 移除分号
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .replace(/;\s*/g, ';') // 移除分号后的空格
            .replace(/:\s*/g, ':') // 移除冒号后的空格
            .trim();
    }

    minifyHTML(code) {
        return code
            .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML注释
            .replace(/<script[^>]*>[\s\S]*?\/\*[\s\S]*?\*\/[\s\S]*?<\/script>/gi, (match) => {
                // 移除script标签内的JavaScript注释
                return match.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
            })
            .replace(/<style[^>]*>[\s\S]*?\/\*[\s\S]*?\*\/[\s\S]*?<\/style>/gi, (match) => {
                // 移除style标签内的CSS注释
                return match.replace(/\/\*[\s\S]*?\*\//g, '');
            })
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/>\s+</g, '><') // 移除标签间的空格
            .trim();
    }

    minifyJSON(code) {
        try {
            // 使用JSON5解析支持扩展语法，但输出标准JSON格式
            const parsed = JSON5.parse(code);
            return JSON.stringify(parsed);
        } catch (error) {
            throw new Error('无效的JSON5格式');
        }
    }

    minifySQL(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/--[^\r\n]*/g, '') // 移除单行注释 --
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .replace(/\s*=\s*/g, '=') // 移除等号周围的空格
            .replace(/\s*<>\s*/g, '<>') // 移除不等号周围的空格
            .replace(/\s*!=\s*/g, '!=') // 移除不等号周围的空格
            .replace(/\s*<\s*/g, '<') // 移除小于号周围的空格
            .replace(/\s*>\s*/g, '>') // 移除大于号周围的空格
            .replace(/\s*<=\s*/g, '<=') // 移除小于等于号周围的空格
            .replace(/\s*>=\s*/g, '>=') // 移除大于等于号周围的空格
            .trim();
    }

    minifyPython(code) {
        return code
            .replace(/"""[\s\S]*?"""/g, '') // 移除三引号多行注释
            .replace(/'''[\s\S]*?'''/g, '') // 移除三引号多行注释
            .replace(/#[^\r\n]*/g, '') // 移除单行注释 #
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .replace(/\s*\[\s*/g, '[') // 移除左方括号周围的空格
            .replace(/\s*\]\s*/g, ']') // 移除右方括号周围的空格
            .replace(/\s*{\s*/g, '{') // 移除左大括号周围的空格
            .replace(/\s*}\s*/g, '}') // 移除右大括号周围的空格
            .trim();
    }

    minifyJavaLike(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/\/\/.*$/gm, '') // 移除单行注释 //
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/;\s*}/g, '}') // 移除分号前的空格
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .trim();
    }

    minifyPHP(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/\/\/.*$/gm, '') // 移除单行注释 //
            .replace(/#[^\r\n]*/g, '') // 移除PHP的#注释
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/;\s*}/g, '}') // 移除分号前的空格
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .replace(/\s*\.\s*/g, '.') // 移除点号周围的空格
            .replace(/\s*->\s*/g, '->') // 移除箭头操作符周围的空格
            .trim();
    }

    minifyGo(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/\/\/.*$/gm, '') // 移除单行注释 //
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .replace(/\s*:=\s*/g, ':=') // 移除Go短变量声明周围的空格
            .replace(/\s*<-\s*/g, '<-') // 移除Go通道操作符周围的空格
            .trim();
    }

    minifyRust(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/\/\/.*$/gm, '') // 移除单行注释 //
            .replace(/\/\/\/.*$/gm, '') // 移除Rust文档注释 ///
            .replace(/\/\*\*[\s\S]*?\*\//g, '') // 移除Rust块文档注释 /** */
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/;\s*}/g, '}') // 移除分号前的空格
            .replace(/\s*{\s*/g, '{') // 移除大括号周围的空格
            .replace(/}\s*/g, '}') // 移除右大括号后的空格
            .replace(/\s*,\s*/g, ',') // 移除逗号周围的空格
            .replace(/\s*\(\s*/g, '(') // 移除左括号周围的空格
            .replace(/\s*\)\s*/g, ')') // 移除右括号周围的空格
            .replace(/\s*::\s*/g, '::') // 移除Rust路径分隔符周围的空格
            .replace(/\s*->\s*/g, '->') // 移除箭头周围的空格
            .trim();
    }

    minifyMarkdown(code) {
        return code
            .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML注释
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('<!--'))
            .join('\n');
    }

    minifyXML(code) {
        return code
            .replace(/<!--[\s\S]*?-->/g, '') // 移除XML注释
            .replace(/[ \t]+/g, ' ') // 只替换空格和制表符，保留换行符
            .replace(/>\s+</g, '><') // 移除标签间的空格
            .trim();
    }

    minifyGeneric(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释 /* */
            .replace(/\/\/.*$/gm, '') // 移除单行注释 //
            .replace(/--[^\r\n]*/g, '') // 移除SQL单行注释 --
            .replace(/#[^\r\n]*/g, '') // 移除Python/Shell注释 #
            .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML/XML注释
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join(' ');
    }

    validateCode() {
        const code = this.inputEditor.getValue();
        if (!code.trim()) {
            this.showStatus('请输入要验证的代码', 'error');
            return;
        }

        this.showStatus('正在验证代码...', 'info');
        this.validateBtn.classList.add('loading');

        try {
            let isValid = false;
            let errorMessage = '';

            switch (this.currentLanguage) {
                case 'json':
                    try {
                        // 使用JSON5解析支持扩展语法
                        JSON5.parse(code);
                        isValid = true;
                    } catch (error) {
                        errorMessage = error.message;
                    }
                    break;
                case 'javascript':
                case 'typescript':
                    // 简单的语法检查
                    try {
                        new Function(code);
                        isValid = true;
                    } catch (error) {
                        errorMessage = error.message;
                    }
                    break;
                default:
                    isValid = true;
                    errorMessage = '该语言暂不支持语法验证';
            }

            if (isValid) {
                this.showStatus('代码语法正确', 'success');
                this.inputEditor.getWrapperElement().classList.add('success-highlight');
                setTimeout(() => {
                    this.inputEditor.getWrapperElement().classList.remove('success-highlight');
                }, 2000);
            } else {
                this.showStatus(`语法错误: ${errorMessage}`, 'error');
                this.inputEditor.getWrapperElement().classList.add('error-highlight');
                setTimeout(() => {
                    this.inputEditor.getWrapperElement().classList.remove('error-highlight');
                }, 2000);
            }
        } catch (error) {
            this.showStatus(`验证失败: ${error.message}`, 'error');
        } finally {
            this.validateBtn.classList.remove('loading');
        }
    }

    clearCode() {
        this.inputEditor.setValue('');
        this.outputEditor.setValue('');
        this.fileInfo.textContent = '';
        this.previewSection.style.display = 'none';
        this.updateStats();
        this.showStatus('已清空所有内容', 'info');
    }

    async copyToClipboard(type) {
        const editor = type === 'input' ? this.inputEditor : this.outputEditor;
        const code = editor.getValue();

        if (!code.trim()) {
            this.showStatus('没有内容可复制', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(code);
            this.showStatus('已复制到剪贴板', 'success');
        } catch (error) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('已复制到剪贴板', 'success');
        }
    }

    downloadCode() {
        const code = this.outputEditor.getValue() || this.inputEditor.getValue();
        if (!code.trim()) {
            this.showStatus('没有内容可下载', 'error');
            return;
        }

        const extension = this.getFileExtension(this.currentLanguage);
        const filename = `beautified_code.${extension}`;

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showStatus(`文件已下载: ${filename}`, 'success');
    }

    getFileExtension(language) {
        const extensionMap = {
            'javascript': 'js',
            'typescript': 'ts',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'xml': 'xml',
            'sql': 'sql',
            'python': 'py',
            'java': 'java',
            'csharp': 'cs',
            'cpp': 'cpp',
            'php': 'php',
            'go': 'go',
            'rust': 'rs',
            'markdown': 'md'
        };
        return extensionMap[language] || 'txt';
    }

    togglePreview() {
        const code = this.outputEditor.getValue() || this.inputEditor.getValue();

        if (this.previewSection.style.display === 'none' || !this.previewSection.style.display) {
            if (!code.trim()) {
                this.showStatus('没有内容可预览', 'error');
                return;
            }

            if (this.currentLanguage === 'html') {
                // HTML使用iframe预览
                this.previewFrame.style.display = 'block';
                this.previewFrame.srcdoc = code;
                // 隐藏代码块容器
                const codeContainer = document.getElementById('previewCodeContainer');
                if (codeContainer) {
                    codeContainer.style.display = 'none';
                }
            } else {
                // 其他语言使用代码块预览
                this.previewFrame.style.display = 'none';
                this.showCodeBlockPreview(code);
            }
            
            this.previewSection.style.display = 'block';
            this.previewBtn.textContent = '关闭预览';
            this.showStatus('预览已开启', 'info');
        } else {
            this.previewSection.style.display = 'none';
            this.previewBtn.textContent = '预览';
            this.showStatus('预览已关闭', 'info');
        }
    }

    showCodeBlockPreview(code) {
        const previewContainer = document.querySelector('.preview-container');
        
        // 创建或获取代码块容器
        let codeContainer = document.getElementById('previewCodeContainer');
        if (!codeContainer) {
            codeContainer = document.createElement('div');
            codeContainer.id = 'previewCodeContainer';
            codeContainer.style.cssText = `
                width: 100%;
                height: 100%;
                overflow: auto;
                background: #f8f9fa;
                border-radius: 6px;
                padding: 0;
            `;
            previewContainer.appendChild(codeContainer);
        }
        
        codeContainer.style.display = 'block';
        
        // 创建CodeMirror实例用于预览
        if (this.previewEditor) {
            this.previewEditor.toTextArea();
        }
        
        codeContainer.innerHTML = '';
        const textarea = document.createElement('textarea');
        codeContainer.appendChild(textarea);
        
        this.previewEditor = CodeMirror.fromTextArea(textarea, {
            mode: this.getCodeMirrorMode(this.currentLanguage),
            theme: 'default',
            lineNumbers: true,
            readOnly: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            value: code
        });
        
        this.previewEditor.setValue(code);
        
        // 设置编辑器高度
        setTimeout(() => {
            this.previewEditor.setSize('100%', '100%');
            this.previewEditor.refresh();
        }, 100);
    }

    updatePreviewIfActive() {
        // 检查预览是否处于开启状态
        if (this.previewSection.style.display === 'block') {
            const code = this.outputEditor.getValue() || this.inputEditor.getValue();
            
            if (code.trim()) {
                if (this.currentLanguage === 'html') {
                    // HTML使用iframe预览
                    this.previewFrame.srcdoc = code;
                } else {
                    // 其他语言使用代码块预览
                    this.showCodeBlockPreview(code);
                }
            }
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.inputEditor.setValue(content);
            this.fileInfo.textContent = `已加载: ${file.name} (${this.formatFileSize(file.size)})`;

            // 根据文件扩展名自动设置语言
            const extension = file.name.split('.').pop().toLowerCase();
            const languageMap = {
                'js': 'javascript',
                'ts': 'typescript',
                'html': 'html',
                'htm': 'html',
                'css': 'css',
                'json': 'json',
                'xml': 'xml',
                'sql': 'sql',
                'py': 'python',
                'java': 'java',
                'cs': 'csharp',
                'cpp': 'cpp',
                'c': 'cpp',
                'php': 'php',
                'go': 'go',
                'rs': 'rust',
                'md': 'markdown'
            };

            if (languageMap[extension]) {
                this.languageSelect.value = languageMap[extension];
                this.currentLanguage = languageMap[extension];
                this.updateEditorMode();
            }

            this.updateStats();
            this.showStatus(`文件 ${file.name} 加载成功`, 'success');
        };

        reader.onerror = () => {
            this.showStatus('文件读取失败', 'error');
        };

        reader.readAsText(file);
    }

    setupDragAndDrop() {
        const container = document.querySelector('.container');

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('drag-over');
        });

        container.addEventListener('dragleave', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                this.fileInput.files = files;
                this.handleFileUpload({ target: { files: [file] } });
            }
        });
    }

    updateStats() {
        const inputCode = this.inputEditor.getValue();
        const outputCode = this.outputEditor.getValue();
        const code = outputCode || inputCode;

        const lines = code.split('\n').length;
        const chars = code.length;
        const bytes = new Blob([code]).size;

        this.lineCount.textContent = lines;
        this.charCount.textContent = chars;
        this.fileSize.textContent = this.formatFileSize(bytes);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearMessages() {
        const errorElements = document.querySelectorAll('.error-message, .success-message');
        errorElements.forEach(el => el.remove());

        this.inputEditor.getWrapperElement().classList.remove('error-highlight', 'success-highlight');
        this.outputEditor.getWrapperElement().classList.remove('error-highlight', 'success-highlight');
    }

    showStatus(message, type = 'info') {
        this.statusBar.textContent = message;
        this.statusBar.className = `status-bar status-${type}`;

        // 自动清除状态
        setTimeout(() => {
            if (this.statusBar.textContent === message) {
                this.statusBar.textContent = '';
                this.statusBar.className = 'status-bar';
            }
        }, 5000);
    }

    showExampleCode() {
        const exampleCode = this.exampleCodes[this.currentLanguage];
        if (exampleCode) {
            this.inputEditor.setValue(exampleCode);
            this.showStatus(`已加载 ${this.currentLanguage.toUpperCase()} 示例代码`, 'success');
            this.updateStats();
        } else {
            this.showStatus(`暂无 ${this.currentLanguage.toUpperCase()} 示例代码`, 'warning');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new CodeBeautifier();
});