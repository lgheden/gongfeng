// 数据库工具集
class DbToJavaConverter {
    constructor() {
        this.originalJavaCode = '';
        this.originalDdlCode = '';
        this.initializeElements();
        this.bindEvents();
        this.loadExamples();
        this.initializeTabs();
    }

    initializeElements() {
        // Tab相关元素
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // 初始化CodeMirror编辑器
        this.initializeCodeMirror();
        
        // DDL转Java元素
        this.ddlInput = this.ddlInputEditor;
        this.javaOutput = document.getElementById('javaOutput');
        this.statusBar = document.getElementById('statusBar');
        
        // 配置元素
        this.dbTypeRadios = document.querySelectorAll('input[name="dbType"]');
        this.namingRadios = document.querySelectorAll('input[name="naming"]');
        this.packageInput = document.getElementById('packageName');
        this.generateOptions = document.querySelectorAll('input[name="generateOptions"]');
        
        // 按钮元素
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Java转DDL元素
        this.javaInput = this.javaInputEditor;
        this.ddlOutput = this.ddlOutputEditor;
        this.javaOutputEditor = this.javaOutputEditor;
        this.targetDbTypeRadios = document.querySelectorAll('input[name="targetDbType"]');
        this.tableNamingRadios = document.querySelectorAll('input[name="tableNaming"]');
        this.ddlOptions = document.querySelectorAll('input[name="ddlOptions"]');
        
        // Java转DDL按钮
        this.convertJavaBtn = document.getElementById('convertJavaBtn');
        this.clearJavaBtn = document.getElementById('clearJavaBtn');
        this.copyDdlBtn = document.getElementById('copyDdlBtn');
        this.downloadDdlBtn = document.getElementById('downloadDdlBtn');
        
        // 示例按钮
        this.exampleBtns = document.querySelectorAll('.example-btn');
    }

    initializeCodeMirror() {
        // 初始化DDL输入编辑器
        this.ddlInputEditor = CodeMirror(document.getElementById('ddlInput'), {
            mode: 'text/x-sql',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            placeholder: `请输入DDL语句...\n\n示例：\nCREATE TABLE user (\n    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',\n    username VARCHAR(50) NOT NULL COMMENT '用户名',\n    email VARCHAR(100) COMMENT '邮箱',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'\n) COMMENT='用户表';`,
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            }
        });
        
        // 初始化Java输入编辑器
        this.javaInputEditor = CodeMirror(document.getElementById('javaInput'), {
            mode: 'text/x-java',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            placeholder: `请输入Java实体类代码...\n\n示例：\n@Entity\n@Table(name = "user")\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    \n    @Column(name = "username", nullable = false, length = 50)\n    private String username;\n    \n    @Column(name = "email", length = 100)\n    private String email;\n    \n    // getters and setters...\n}`,
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            }
        });
        
        // 初始化Java输出编辑器
        this.javaOutputEditor = CodeMirror(document.getElementById('javaOutput'), {
            mode: 'text/x-java',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        });
        
        // 初始化DDL输出编辑器
        this.ddlOutputEditor = CodeMirror(document.getElementById('ddlOutput'), {
            mode: 'text/x-sql',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        });
        
        // 绑定输入事件
        this.ddlInputEditor.on('change', () => this.updateCharCount());
        this.javaInputEditor.on('change', () => this.updateJavaCharCount());
    }

    bindEvents() {
        // Tab切换事件
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // DDL转Java按钮事件
        this.convertBtn.addEventListener('click', () => this.convertDdlToJava());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadJavaFile());
        
        // Java转DDL按钮事件
        if (this.convertJavaBtn) {
            this.convertJavaBtn.addEventListener('click', () => this.convertJavaToDdl());
        }
        if (this.clearJavaBtn) {
            this.clearJavaBtn.addEventListener('click', () => this.clearJavaTab());
        }
        if (this.copyDdlBtn) {
            this.copyDdlBtn.addEventListener('click', () => this.copyDdlToClipboard());
        }
        if (this.downloadDdlBtn) {
            this.downloadDdlBtn.addEventListener('click', () => this.downloadDdlFile());
        }
        
        // 示例按钮事件
        this.exampleBtns.forEach(btn => {
            if (btn.dataset.example) {
                btn.addEventListener('click', () => {
                    // 根据按钮所在的标签页来判断调用哪个函数
                    const parentTab = btn.closest('.tab-content');
                    if (parentTab && parentTab.id === 'java-to-ddl-tab') {
                        // Java转DDL标签页中的示例按钮
                        this.loadJavaExample(btn.dataset.example);
                    } else {
                        // DDL转Java标签页中的示例按钮
                        this.loadExample(btn.dataset.example);
                    }
                });
            }
        });
        
        // 输入框事件已在initializeCodeMirror中处理
        
        // 绑定配置变更事件 - 实时更新
        document.querySelectorAll('input[name="generateOptions"], input[name="naming"], input[name="dbType"]').forEach(element => {
            element.addEventListener('change', () => {
                this.onConfigChange();
            });
        });
        
        this.packageInput.addEventListener('input', () => this.onConfigChange());
        
        // Java转DDL配置变更事件
        document.querySelectorAll('input[name="ddlOptions"], input[name="tableNaming"], input[name="targetDbType"]').forEach(element => {
            element.addEventListener('change', () => {
                this.onJavaConfigChange();
            });
        });
    }

    updateCharCount() {
        const text = this.ddlInputEditor.getValue();
        const charCount = text.length;
        
        // 统计表数量
        let tableCount = 0;
        if (text.trim()) {
            const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?[^`\s]+`?|[^\s(]+)\s*\(/gi;
            const matches = text.match(tableRegex);
            tableCount = matches ? matches.length : 0;
        }
        
        const inputLengthElement = document.getElementById('inputLength');
        const tableCountElement = document.getElementById('tableCount');
        
        if (inputLengthElement) inputLengthElement.textContent = `字符数: ${charCount}`;
        if (tableCountElement) tableCountElement.textContent = `表数量: ${tableCount}`;
    }

    updateOutputStats(javaCode) {
        const charCount = javaCode.length;
        
        // 统计类数量
        let classCount = 0;
        if (javaCode.trim()) {
            const classRegex = /public\s+class\s+\w+/g;
            const matches = javaCode.match(classRegex);
            classCount = matches ? matches.length : 0;
        }
        
        const outputLengthElement = document.getElementById('outputLength');
        const classCountElement = document.getElementById('classCount');
        
        if (outputLengthElement) outputLengthElement.textContent = `字符数: ${charCount}`;
        if (classCountElement) classCountElement.textContent = `类数量: ${classCount}`;
    }

    initializeTabs() {
        // 默认激活第一个tab
        this.switchTab('ddl-to-java');
    }

    switchTab(tabName) {
        // 移除所有活动状态
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活选中的tab
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeBtn && activeContent) {
            activeBtn.classList.add('active');
            activeContent.classList.add('active');
        }
    }

    onConfigChange() {
        // 配置变更时可以实时转换（可选）
        if (this.ddlInputEditor.getValue().trim()) {
            this.convertDdlToJava();
        }
    }

    onJavaConfigChange() {
        // Java转DDL配置变更时可以实时转换（可选）
        if (this.javaInputEditor && this.javaInputEditor.getValue().trim()) {
            this.convertJavaToDdl();
        }
    }

    getSelectedDbType() {
        const selected = document.querySelector('input[name="dbType"]:checked');
        return selected ? selected.value : 'mysql';
    }

    getSelectedNaming() {
        const selected = document.querySelector('input[name="naming"]:checked');
        return selected ? selected.value : 'camelCase';
    }

    getGenerateOptions() {
        const options = {};
        this.generateOptions.forEach(checkbox => {
            options[checkbox.value] = checkbox.checked;
        });
        return options;
    }

    convertDdlToJava() {
        const ddlText = this.ddlInputEditor.getValue().trim();
        if (!ddlText) {
            this.showStatus('请输入DDL语句', 'error');
            return;
        }

        try {
            const dbType = this.getSelectedDbType();
            const naming = this.getSelectedNaming();
            const packageName = this.packageInput.value.trim();
            const options = this.getGenerateOptions();

            const javaCode = this.parseDdlAndGenerateJava(ddlText, dbType, naming, packageName, options);
            // 存储原始代码用于复制和下载
            this.originalJavaCode = javaCode;
            this.javaOutputEditor.setValue(javaCode);
            this.updateOutputStats(javaCode);
            this.showStatus('转换成功！', 'success');
        } catch (error) {
            this.showStatus(`转换失败: ${error.message}`, 'error');
            console.error('转换错误:', error);
        }
    }

    parseDdlAndGenerateJava(ddlText, dbType, naming, packageName, options) {
        // 解析DDL语句
        const tables = this.parseDdl(ddlText, dbType);
        
        if (tables.length === 0) {
            throw new Error('未找到有效的表结构');
        }

        // 生成Java代码
        let javaCode = '';
        tables.forEach((table, index) => {
            if (index > 0) javaCode += '\n\n';
            javaCode += this.generateJavaClass(table, naming, packageName, options);
        });

        return javaCode;
    }

    parseDdl(ddlText, dbType) {
        const tables = [];
        
        // 移除注释和多余空白
        let cleanDdl = ddlText
            .replace(/--.*$/gm, '') // 移除单行注释
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
            .replace(/\s+/g, ' ') // 合并空白字符
            .trim();

        // 匹配CREATE TABLE语句
        const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?([^`\s]+)`?|([^\s(]+))\s*\(([^;]+)\)/gi;
        let match;

        while ((match = tableRegex.exec(cleanDdl)) !== null) {
            const tableName = match[1] || match[2];
            const columnsText = match[3];
            
            const table = {
                name: tableName,
                columns: this.parseColumns(columnsText, dbType)
            };
            
            tables.push(table);
        }

        return tables;
    }

    parseColumns(columnsText, dbType) {
        const columns = [];
        
        // 分割列定义
        const columnDefinitions = columnsText.split(',');
        
        for (let def of columnDefinitions) {
            def = def.trim();
            
            // 跳过约束定义
            if (def.match(/^(PRIMARY\s+KEY|FOREIGN\s+KEY|KEY|INDEX|UNIQUE|CONSTRAINT)/i)) {
                continue;
            }
            
            const column = this.parseColumnDefinition(def, dbType);
            if (column) {
                columns.push(column);
            }
        }
        
        return columns;
    }

    parseColumnDefinition(def, dbType) {
        // 匹配列定义: 列名 类型 [约束]
        const columnRegex = /^(?:`?([^`\s]+)`?|([^\s]+))\s+([^\s]+)(?:\s+(.*))?$/i;
        const match = def.match(columnRegex);
        
        if (!match) return null;
        
        const columnName = match[1] || match[2];
        const dataType = match[3];
        const constraints = match[4] || '';
        
        return {
            name: columnName,
            dbType: dataType,
            javaType: this.mapDbTypeToJava(dataType, dbType),
            nullable: !constraints.match(/NOT\s+NULL/i),
            primaryKey: constraints.match(/PRIMARY\s+KEY/i) !== null,
            autoIncrement: constraints.match(/AUTO_INCREMENT/i) !== null,
            comment: this.extractComment(constraints)
        };
    }

    mapDbTypeToJava(dbType, database) {
        const typeMap = {
            // 数字类型
            'TINYINT': 'Byte',
            'SMALLINT': 'Short',
            'MEDIUMINT': 'Integer',
            'INT': 'Integer',
            'INTEGER': 'Integer',
            'BIGINT': 'Long',
            'FLOAT': 'Float',
            'DOUBLE': 'Double',
            'DECIMAL': 'BigDecimal',
            'NUMERIC': 'BigDecimal',
            
            // 字符串类型
            'CHAR': 'String',
            'VARCHAR': 'String',
            'TEXT': 'String',
            'TINYTEXT': 'String',
            'MEDIUMTEXT': 'String',
            'LONGTEXT': 'String',
            
            // 日期时间类型
            'DATE': 'LocalDate',
            'TIME': 'LocalTime',
            'DATETIME': 'LocalDateTime',
            'TIMESTAMP': 'LocalDateTime',
            'YEAR': 'Integer',
            
            // 二进制类型
            'BINARY': 'byte[]',
            'VARBINARY': 'byte[]',
            'BLOB': 'byte[]',
            'TINYBLOB': 'byte[]',
            'MEDIUMBLOB': 'byte[]',
            'LONGBLOB': 'byte[]',
            
            // 布尔类型
            'BOOLEAN': 'Boolean',
            'BOOL': 'Boolean',
            
            // JSON类型
            'JSON': 'String'
        };
        
        // 提取基础类型（去除长度和参数）
        const baseType = dbType.replace(/\([^)]*\)/g, '').toUpperCase();
        
        return typeMap[baseType] || 'String';
    }

    extractComment(constraints) {
        const commentMatch = constraints.match(/COMMENT\s+['"]([^'"]*)['"]/);
        return commentMatch ? commentMatch[1] : '';
    }

    generateJavaClass(table, naming, packageName, options) {
        const className = this.convertToClassName(table.name, naming);
        let javaCode = '';
        
        // 包声明
        if (packageName) {
            javaCode += `package ${packageName};\n\n`;
        }
        
        // 导入语句
        const imports = this.generateImports(table, options);
        if (imports) {
            javaCode += imports + '\n';
        }
        
        // 类注释
        javaCode += `/**\n * ${table.name}表对应的实体类\n */\n`;
        
        // Swagger注解
        if (options.swagger) {
            javaCode += `@ApiModel(description = "${table.name}表实体")\n`;
        }
        
        // 类注解
        if (options.lombok) {
            javaCode += '@Data\n';
            if (options.builder) {
                javaCode += '@Builder\n';
            }
        }
        
        if (options.jpa) {
            javaCode += `@Entity\n@Table(name = "${table.name}")\n`;
        }
        
        // 类声明
        javaCode += `public class ${className}`;
        if (options.serializable) {
            javaCode += ' implements Serializable';
        }
        javaCode += ' {\n';
        
        // 序列化版本号
        if (options.serializable) {
            javaCode += '\n    private static final long serialVersionUID = 1L;\n';
        }
        
        // 字段声明
        table.columns.forEach(column => {
            javaCode += this.generateField(column, naming, options);
        });
        
        // 生成getter/setter（如果不使用Lombok且选择了生成getter/setter）
        if (!options.lombok && options.getterSetter) {
            table.columns.forEach(column => {
                javaCode += this.generateGetterSetter(column, naming);
            });
        }
        
        javaCode += '}\n';
        
        return javaCode;
    }

    generateImports(table, options) {
        const imports = new Set();
        
        // 基础导入
        if (options.serializable) {
            imports.add('import java.io.Serializable;');
        }
        
        // 日期时间导入
        table.columns.forEach(column => {
            if (column.javaType === 'LocalDate') {
                imports.add('import java.time.LocalDate;');
            } else if (column.javaType === 'LocalTime') {
                imports.add('import java.time.LocalTime;');
            } else if (column.javaType === 'LocalDateTime') {
                imports.add('import java.time.LocalDateTime;');
            } else if (column.javaType === 'BigDecimal') {
                imports.add('import java.math.BigDecimal;');
            }
        });
        
        // Lombok导入
        if (options.lombok) {
            imports.add('import lombok.Data;');
            if (options.builder) {
                imports.add('import lombok.Builder;');
            }
        }
        
        // JPA导入
        if (options.jpa) {
            imports.add('import javax.persistence.*;');
        }
        
        // 验证注解导入
        if (options.validation) {
            imports.add('import javax.validation.constraints.*;');
        }
        
        // Swagger导入
        if (options.swagger) {
            imports.add('import io.swagger.annotations.ApiModel;');
            imports.add('import io.swagger.annotations.ApiModelProperty;');
        }
        
        return Array.from(imports).sort().join('\n');
    }

    generateField(column, naming, options) {
        let fieldCode = '\n';
        
        // 字段注释
        if (column.comment) {
            fieldCode += `    /**\n     * ${column.comment}\n     */\n`;
        }
        
        // JPA注解
        if (options.jpa) {
            if (column.primaryKey) {
                fieldCode += '    @Id\n';
                if (column.autoIncrement) {
                    fieldCode += '    @GeneratedValue(strategy = GenerationType.IDENTITY)\n';
                }
            }
            fieldCode += `    @Column(name = "${column.name}"`;;
            if (!column.nullable) {
                fieldCode += ', nullable = false';
            }
            fieldCode += ')\n';
        }
        
        // 验证注解
        if (options.validation) {
            if (!column.nullable) {
                fieldCode += '    @NotNull\n';
            }
            if (column.javaType === 'String') {
                fieldCode += '    @NotBlank\n';
            }
        }
        
        // Swagger注解
        if (options.swagger) {
            const description = column.comment || column.name;
            if (!column.nullable) {
                fieldCode += `    @ApiModelProperty(value = "${description}", required = true)\n`;
            } else {
                fieldCode += `    @ApiModelProperty(value = "${description}")\n`;
            }
        }
        
        // 字段声明
        const fieldName = this.convertToFieldName(column.name, naming);
        fieldCode += `    private ${column.javaType} ${fieldName};\n`;
        
        return fieldCode;
    }

    generateGetterSetter(column, naming) {
        const fieldName = this.convertToFieldName(column.name, naming);
        const methodName = this.capitalize(fieldName);
        
        let code = '\n';
        
        // Getter
        code += `    public ${column.javaType} get${methodName}() {\n`;
        code += `        return ${fieldName};\n`;
        code += '    }\n\n';
        
        // Setter
        code += `    public void set${methodName}(${column.javaType} ${fieldName}) {\n`;
        code += `        this.${fieldName} = ${fieldName};\n`;
        code += '    }\n';
        
        return code;
    }

    convertToClassName(tableName, naming) {
        // 移除表前缀（如果有）
        let name = tableName.replace(/^(t_|tb_|table_)/i, '');
        
        // 转换为PascalCase
        return this.toPascalCase(name);
    }

    convertToFieldName(columnName, naming) {
        switch (naming) {
            case 'camelCase':
                return this.toCamelCase(columnName);
            case 'snake_case':
                return columnName.toLowerCase();
            case 'PascalCase':
                return this.toPascalCase(columnName);
            default:
                return this.toCamelCase(columnName);
        }
    }

    toCamelCase(str) {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                  .replace(/^[A-Z]/, letter => letter.toLowerCase());
    }

    toPascalCase(str) {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                  .replace(/^[a-z]/, letter => letter.toUpperCase());
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    highlightJavaCode() {
        const code = this.javaOutput.textContent;
        
        // 使用更安全的替换方式，避免重复替换
        let highlighted = code;
        
        // 先转义HTML特殊字符
        highlighted = highlighted
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // 使用占位符来保护已处理的内容
        const placeholders = [];
        let placeholderIndex = 0;
        
        // 1. 先处理多行注释（优先级最高）
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const placeholder = `__COMMENT_${placeholderIndex++}__`;
            placeholders.push({ placeholder, content: `<span class="comment">${match}</span>` });
            return placeholder;
        });
        
        // 2. 处理单行注释
        highlighted = highlighted.replace(/\/\/.*$/gm, (match) => {
            const placeholder = `__COMMENT_${placeholderIndex++}__`;
            placeholders.push({ placeholder, content: `<span class="comment">${match}</span>` });
            return placeholder;
        });
        
        // 3. 处理字符串字面量
        highlighted = highlighted.replace(/"[^"]*"/g, (match) => {
            const placeholder = `__STRING_${placeholderIndex++}__`;
            placeholders.push({ placeholder, content: `<span class="string">${match}</span>` });
            return placeholder;
        });
        
        // 4. 处理注解
        highlighted = highlighted.replace(/@\w+/g, (match) => {
            const placeholder = `__ANNOTATION_${placeholderIndex++}__`;
            placeholders.push({ placeholder, content: `<span class="annotation">${match}</span>` });
            return placeholder;
        });
        
        // 5. 处理关键字
        highlighted = highlighted.replace(/\b(public|private|protected|static|final|class|interface|extends|implements|import|package|return|if|else|for|while|try|catch|finally|throw|throws|new|this|super|null|true|false|void|int|long|double|float|boolean|char|byte|short)\b/g, '<span class="keyword">$&</span>');
        
        // 6. 处理Java类型
        highlighted = highlighted.replace(/\b(String|Integer|Long|Double|Float|Boolean|Character|Byte|Short|BigDecimal|LocalDate|LocalTime|LocalDateTime|List|Set|Map)\b/g, '<span class="type">$&</span>');
        
        // 7. 处理自定义类型（大写字母开头的标识符）
        highlighted = highlighted.replace(/\b[A-Z][a-zA-Z0-9]*\b/g, '<span class="type">$&</span>');
        
        // 8. 恢复占位符内容
        placeholders.forEach(({ placeholder, content }) => {
            highlighted = highlighted.replace(placeholder, content);
        });
        
        this.javaOutput.innerHTML = highlighted;
    }

    clearAll() {
        this.ddlInputEditor.setValue('');
        this.javaOutputEditor.setValue('');
        this.originalJavaCode = '';
        this.updateCharCount();
        this.updateOutputStats('');
        this.showStatus('已清空', 'info');
    }

    async copyToClipboard() {
        if (!this.originalJavaCode || !this.originalJavaCode.trim()) {
            this.showStatus('没有可复制的内容', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.originalJavaCode);
            this.showStatus('已复制到剪贴板', 'success');
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = this.originalJavaCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('已复制到剪贴板', 'success');
        }
    }

    downloadJavaFile() {
        if (!this.originalJavaCode || !this.originalJavaCode.trim()) {
            this.showStatus('没有可下载的内容', 'error');
            return;
        }

        // 提取类名作为文件名
        const classMatch = this.originalJavaCode.match(/public\s+class\s+(\w+)/);
        const fileName = classMatch ? `${classMatch[1]}.java` : 'Entity.java';
        
        const blob = new Blob([this.originalJavaCode], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus(`已下载 ${fileName}`, 'success');
    }

    loadExample(exampleType) {
        const examples = {
            'user': `CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    phone VARCHAR(20) COMMENT '手机号',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);`,
            'order': `CREATE TABLE t_order (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
    order_status TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态',
    order_date DATE NOT NULL COMMENT '下单日期',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);`,
            'product': `CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
    product_code VARCHAR(50) UNIQUE NOT NULL COMMENT '商品编码',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    category_id INT COMMENT '分类ID',
    brand VARCHAR(100) COMMENT '品牌',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    stock_quantity INT DEFAULT 0 COMMENT '库存数量',
    description TEXT COMMENT '商品描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);`,
            'complex': `CREATE TABLE IF NOT EXISTS sys_user (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    dept_id BIGINT COMMENT '部门ID',
    user_name VARCHAR(30) NOT NULL COMMENT '用户账号',
    nick_name VARCHAR(30) NOT NULL COMMENT '用户昵称',
    user_type VARCHAR(2) DEFAULT '00' COMMENT '用户类型（00系统用户）',
    email VARCHAR(50) COMMENT '用户邮箱',
    phonenumber VARCHAR(11) COMMENT '手机号码',
    sex CHAR(1) COMMENT '用户性别（0男 1女 2未知）',
    avatar VARCHAR(100) COMMENT '头像地址',
    password VARCHAR(100) COMMENT '密码',
    status CHAR(1) DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
    del_flag CHAR(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
    login_ip VARCHAR(128) COMMENT '最后登录IP',
    login_date DATETIME COMMENT '最后登录时间',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注'
);`,
            'blog': `CREATE TABLE blog_post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文章ID',
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    slug VARCHAR(200) UNIQUE NOT NULL COMMENT 'URL别名',
    content LONGTEXT NOT NULL COMMENT '文章内容',
    summary TEXT COMMENT '文章摘要',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    category_id INT COMMENT '分类ID',
    tags VARCHAR(500) COMMENT '标签，逗号分隔',
    featured_image VARCHAR(255) COMMENT '特色图片',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '状态',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    published_at DATETIME COMMENT '发布时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
);`,
            'permission': `CREATE TABLE sys_permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父权限ID',
    permission_name VARCHAR(50) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) UNIQUE NOT NULL COMMENT '权限编码',
    permission_type TINYINT NOT NULL COMMENT '权限类型：1-菜单，2-按钮，3-接口',
    menu_url VARCHAR(200) COMMENT '菜单URL',
    menu_icon VARCHAR(50) COMMENT '菜单图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    is_visible BOOLEAN DEFAULT TRUE COMMENT '是否可见',
    is_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    description VARCHAR(255) COMMENT '权限描述',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_by BIGINT COMMENT '更新人',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_parent_id (parent_id),
    INDEX idx_permission_code (permission_code),
    INDEX idx_permission_type (permission_type)
);`,
            'log': `CREATE TABLE sys_operation_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    trace_id VARCHAR(64) COMMENT '链路追踪ID',
    user_id BIGINT COMMENT '操作用户ID',
    username VARCHAR(50) COMMENT '用户名',
    operation_type VARCHAR(20) NOT NULL COMMENT '操作类型',
    operation_name VARCHAR(100) NOT NULL COMMENT '操作名称',
    method_name VARCHAR(200) COMMENT '方法名',
    request_method VARCHAR(10) COMMENT '请求方式',
    request_url VARCHAR(500) COMMENT '请求URL',
    request_params TEXT COMMENT '请求参数',
    response_data TEXT COMMENT '响应数据',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    location VARCHAR(100) COMMENT '操作地点',
    browser VARCHAR(100) COMMENT '浏览器',
    os VARCHAR(100) COMMENT '操作系统',
    status TINYINT DEFAULT 1 COMMENT '操作状态：1-成功，0-失败',
    error_msg TEXT COMMENT '错误信息',
    cost_time INT COMMENT '耗时（毫秒）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    INDEX idx_user_id (user_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at),
    INDEX idx_trace_id (trace_id)
);`,
            'ecommerce': `CREATE TABLE product_sku (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'SKU ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    sku_code VARCHAR(50) UNIQUE NOT NULL COMMENT 'SKU编码',
    sku_name VARCHAR(200) NOT NULL COMMENT 'SKU名称',
    spec_values JSON COMMENT '规格值JSON',
    original_price DECIMAL(10,2) NOT NULL COMMENT '原价',
    sale_price DECIMAL(10,2) NOT NULL COMMENT '售价',
    cost_price DECIMAL(10,2) COMMENT '成本价',
    stock_quantity INT DEFAULT 0 COMMENT '库存数量',
    warning_stock INT DEFAULT 10 COMMENT '预警库存',
    weight DECIMAL(8,3) COMMENT '重量(kg)',
    volume DECIMAL(10,3) COMMENT '体积(立方米)',
    barcode VARCHAR(50) COMMENT '条形码',
    images JSON COMMENT '图片JSON数组',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认SKU',
    is_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_product_id (product_id),
    INDEX idx_sku_code (sku_code),
    INDEX idx_sale_price (sale_price)
);`
        };
        
        const example = examples[exampleType];
        if (example) {
            this.ddlInputEditor.setValue(example);
            this.updateCharCount();
            this.showStatus(`已加载${exampleType}表示例`, 'info');
        }
    }

    loadExamples() {
        // 页面加载时可以加载默认示例
        // this.loadExample('user');
    }

    showStatus(message, type = 'info') {
        this.statusBar.textContent = message;
        this.statusBar.className = `status-bar status-${type}`;
        
        // 3秒后清除状态
        setTimeout(() => {
            this.statusBar.textContent = '';
            this.statusBar.className = 'status-bar';
        }, 3000);
    }

    // Java转DDL相关方法
    updateJavaCharCount() {
        if (!this.javaInputEditor) return;
        
        const text = this.javaInputEditor.getValue();
        const charCount = text.length;
        
        // 统计类数量
        let classCount = 0;
        if (text.trim()) {
            const classRegex = /(?:public\s+)?class\s+\w+/g;
            const matches = text.match(classRegex);
            classCount = matches ? matches.length : 0;
        }
        
        const javaInputLengthElement = document.getElementById('javaInputLength');
        const javaClassCountElement = document.getElementById('javaClassCount');
        
        if (javaInputLengthElement) javaInputLengthElement.textContent = `字符数: ${charCount}`;
        if (javaClassCountElement) javaClassCountElement.textContent = `类数量: ${classCount}`;
    }

    updateDdlOutputStats(ddlCode) {
        const charCount = ddlCode.length;
        
        // 统计表数量
        let tableCount = 0;
        if (ddlCode.trim()) {
            const tableRegex = /CREATE\s+TABLE/gi;
            const matches = ddlCode.match(tableRegex);
            tableCount = matches ? matches.length : 0;
        }
        
        const ddlOutputLengthElement = document.getElementById('ddlOutputLength');
        const ddlTableCountElement = document.getElementById('ddlTableCount');
        
        if (ddlOutputLengthElement) ddlOutputLengthElement.textContent = `字符数: ${charCount}`;
        if (ddlTableCountElement) ddlTableCountElement.textContent = `表数量: ${tableCount}`;
    }

    getSelectedTargetDbType() {
        const selected = document.querySelector('input[name="targetDbType"]:checked');
        return selected ? selected.value : 'mysql';
    }

    getSelectedTableNaming() {
        const selected = document.querySelector('input[name="tableNaming"]:checked');
        return selected ? selected.value : 'snake_case';
    }

    getDdlOptions() {
        const options = {};
        if (this.ddlOptions) {
            this.ddlOptions.forEach(checkbox => {
                options[checkbox.value] = checkbox.checked;
            });
        }
        return options;
    }

    convertJavaToDdl() {
        if (!this.javaInputEditor) return;
        
        const javaText = this.javaInputEditor.getValue().trim();
        if (!javaText) {
            this.showStatus('请输入Java实体类代码', 'error');
            return;
        }

        try {
            const targetDbType = this.getSelectedTargetDbType();
            const tableNaming = this.getSelectedTableNaming();
            const options = this.getDdlOptions();

            const ddlCode = this.parseJavaAndGenerateDdl(javaText, targetDbType, tableNaming, options);
            this.originalDdlCode = ddlCode;
            this.ddlOutputEditor.setValue(ddlCode);
            this.updateDdlOutputStats(ddlCode);
            this.showStatus('转换成功！', 'success');
        } catch (error) {
            this.showStatus(`转换失败: ${error.message}`, 'error');
            console.error('转换错误:', error);
        }
    }

    parseJavaAndGenerateDdl(javaText, targetDbType, tableNaming, options) {
        // 解析Java实体类
        const entities = this.parseJavaEntities(javaText);
        
        if (entities.length === 0) {
            throw new Error('未找到有效的Java实体类');
        }

        // 生成DDL语句
        let ddlCode = '';
        entities.forEach((entity, index) => {
            if (index > 0) ddlCode += '\n\n';
            ddlCode += this.generateCreateTableSql(entity, targetDbType, tableNaming, options);
        });

        return ddlCode;
    }

    parseJavaEntities(javaText) {
        const entities = [];
        
        // 移除注释
        let cleanJava = javaText
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
            .replace(/\/\/.*$/gm, '') // 移除单行注释
            .replace(/\s+/g, ' ') // 合并空白字符
            .trim();

        // 匹配类定义
        const classRegex = /(?:@Entity[^{]*)?(?:public\s+)?class\s+(\w+)\s*(?:extends\s+\w+)?(?:\s*implements\s+[^{]+)?\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gi;
        let match;

        while ((match = classRegex.exec(cleanJava)) !== null) {
            const className = match[1];
            const classBody = match[2];
            
            const entity = {
                name: className,
                tableName: this.extractTableName(javaText, className),
                fields: this.parseJavaFields(classBody)
            };
            
            entities.push(entity);
        }

        return entities;
    }

    extractTableName(javaText, className) {
        // 尝试从@Table注解中提取表名
        const tableRegex = new RegExp(`@Table\\s*\\(\\s*name\\s*=\\s*["']([^"']+)["']\\s*\\)[^{]*class\\s+${className}`, 'i');
        const match = javaText.match(tableRegex);
        
        if (match) {
            return match[1];
        }
        
        // 如果没有@Table注解，使用类名转换
        return this.convertToTableName(className);
    }

    convertToTableName(className) {
        // 将驼峰命名转换为下划线命名
        return className
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
    }

    parseJavaFields(classBody) {
        const fields = [];
        
        // 匹配字段定义
        const fieldRegex = /(?:@[^\n]*\n\s*)*(?:private|protected|public)?\s+(\w+(?:<[^>]+>)?)\s+(\w+)\s*;/g;
        let match;

        while ((match = fieldRegex.exec(classBody)) !== null) {
            const javaType = match[1];
            const fieldName = match[2];
            
            // 跳过静态字段和常量
            if (fieldName.toUpperCase() === fieldName) continue;
            
            const field = {
                name: fieldName,
                javaType: javaType,
                sqlType: this.mapJavaTypeToSql(javaType),
                annotations: this.extractFieldAnnotations(classBody, fieldName)
            };
            
            fields.push(field);
        }

        return fields;
    }

    extractFieldAnnotations(classBody, fieldName) {
        const annotations = {};
        
        // 查找字段前的注解
        const fieldPattern = new RegExp(`((?:@[^\\n]*\\n\\s*)*)(?:private|protected|public)?\\s+\\w+(?:<[^>]+>)?\\s+${fieldName}\\s*;`, 'g');
        const match = classBody.match(fieldPattern);
        
        if (match && match[0]) {
            const annotationText = match[0];
            
            // 解析常用注解
            if (annotationText.includes('@Id')) {
                annotations.primaryKey = true;
            }
            
            if (annotationText.includes('@GeneratedValue')) {
                annotations.autoIncrement = true;
            }
            
            const columnMatch = annotationText.match(/@Column\s*\(([^)]+)\)/);
            if (columnMatch) {
                const columnParams = columnMatch[1];
                
                const nameMatch = columnParams.match(/name\s*=\s*["']([^"']+)["']/);
                if (nameMatch) {
                    annotations.columnName = nameMatch[1];
                }
                
                const lengthMatch = columnParams.match(/length\s*=\s*(\d+)/);
                if (lengthMatch) {
                    annotations.length = parseInt(lengthMatch[1]);
                }
                
                if (columnParams.includes('nullable\s*=\s*false')) {
                    annotations.notNull = true;
                }
            }
        }
        
        return annotations;
    }

    mapJavaTypeToSql(javaType, targetDbType = 'mysql') {
        const typeMap = {
            mysql: {
                'String': 'VARCHAR(255)',
                'Integer': 'INT',
                'int': 'INT',
                'Long': 'BIGINT',
                'long': 'BIGINT',
                'Double': 'DOUBLE',
                'double': 'DOUBLE',
                'Float': 'FLOAT',
                'float': 'FLOAT',
                'Boolean': 'BOOLEAN',
                'boolean': 'BOOLEAN',
                'BigDecimal': 'DECIMAL(10,2)',
                'LocalDate': 'DATE',
                'LocalTime': 'TIME',
                'LocalDateTime': 'DATETIME',
                'Date': 'DATETIME',
                'Timestamp': 'TIMESTAMP'
            },
            postgresql: {
                'String': 'VARCHAR(255)',
                'Integer': 'INTEGER',
                'int': 'INTEGER',
                'Long': 'BIGINT',
                'long': 'BIGINT',
                'Double': 'DOUBLE PRECISION',
                'double': 'DOUBLE PRECISION',
                'Float': 'REAL',
                'float': 'REAL',
                'Boolean': 'BOOLEAN',
                'boolean': 'BOOLEAN',
                'BigDecimal': 'DECIMAL(10,2)',
                'LocalDate': 'DATE',
                'LocalTime': 'TIME',
                'LocalDateTime': 'TIMESTAMP',
                'Date': 'TIMESTAMP',
                'Timestamp': 'TIMESTAMP'
            }
        };
        
        const dbTypeMap = typeMap[targetDbType] || typeMap.mysql;
        return dbTypeMap[javaType] || 'VARCHAR(255)';
    }

    generateCreateTableSql(entity, targetDbType, tableNaming, options) {
        let sql = '';
        
        // 表名处理
        let tableName = entity.tableName;
        if (tableNaming === 'snake_case') {
            tableName = this.convertToTableName(entity.name);
        }
        
        // CREATE TABLE语句开始
        if (options.ifNotExists) {
            sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        } else {
            sql += `CREATE TABLE ${tableName} (\n`;
        }
        
        // 生成字段定义
        const fieldDefinitions = [];
        entity.fields.forEach(field => {
            let fieldDef = '    ';
            
            // 字段名
            const columnName = field.annotations.columnName || this.convertToColumnName(field.name, tableNaming);
            fieldDef += columnName;
            
            // 字段类型
            let sqlType = field.sqlType;
            if (field.annotations.length && sqlType.includes('VARCHAR')) {
                sqlType = `VARCHAR(${field.annotations.length})`;
            }
            fieldDef += ` ${sqlType}`;
            
            // 主键
            if (field.annotations.primaryKey) {
                fieldDef += ' PRIMARY KEY';
            }
            
            // 自增
            if (field.annotations.autoIncrement) {
                if (targetDbType === 'mysql') {
                    fieldDef += ' AUTO_INCREMENT';
                } else if (targetDbType === 'postgresql') {
                    fieldDef += ' SERIAL';
                }
            }
            
            // 非空约束
            if (field.annotations.notNull || field.annotations.primaryKey) {
                fieldDef += ' NOT NULL';
            }
            
            // 注释
            if (options.comments) {
                const comment = this.generateFieldComment(field.name);
                if (targetDbType === 'mysql') {
                    fieldDef += ` COMMENT '${comment}'`;
                } else if (targetDbType === 'postgresql') {
                    // PostgreSQL的注释需要在CREATE TABLE语句后单独添加
                    // 这里先不添加，在表创建完成后统一处理
                }
            }
            
            fieldDefinitions.push(fieldDef);
        });
        
        sql += fieldDefinitions.join(',\n');
        sql += '\n)';
        
        // 表选项
        if (targetDbType === 'mysql' && options.charset) {
            sql += ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
        }
        
        sql += ';';
        
        // PostgreSQL的字段注释
        if (targetDbType === 'postgresql' && options.comments) {
            sql += '\n\n';
            entity.fields.forEach(field => {
                const comment = this.generateFieldComment(field.name);
                const columnName = this.convertToColumnName(field.name, tableNaming);
                sql += `COMMENT ON COLUMN ${tableName}.${columnName} IS '${comment}';\n`;
            });
        }
        
        return sql;
    }

    convertToColumnName(fieldName, tableNaming) {
        if (tableNaming === 'snake_case') {
            return fieldName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
        }
        return fieldName;
    }

    generateFieldComment(fieldName) {
        // 字段名到中文注释的映射表
        const commentMap = {
            // 基础字段
            'id': 'ID',
            'userId': '用户ID',
            'orderId': '订单ID',
            'productId': '产品ID',
            'categoryId': '分类ID',
            'deptId': '部门ID',
            'roleId': '角色ID',
            'menuId': '菜单ID',
            'parentId': '父级ID',
            
            // 名称相关
            'name': '名称',
            'title': '标题',
            'username': '用户名',
            'nickname': '昵称',
            'nickName': '昵称',
            'realName': '真实姓名',
            'displayName': '显示名称',
            'productName': '产品名称',
            'categoryName': '分类名称',
            'fileName': '文件名',
            'folderName': '文件夹名称',
            
            // 编码相关
            'code': '编码',
            'productCode': '产品编码',
            'orderNo': '订单号',
            'orderCode': '订单编码',
            'serialNumber': '序列号',
            'barcode': '条形码',
            'qrCode': '二维码',
            
            // 联系方式
            'email': '邮箱',
            'phone': '手机号',
            'telephone': '电话',
            'mobile': '手机',
            'fax': '传真',
            'qq': 'QQ号',
            'wechat': '微信号',
            'address': '地址',
            'zipCode': '邮编',
            
            // 密码相关
            'password': '密码',
            'oldPassword': '旧密码',
            'newPassword': '新密码',
            'salt': '密码盐值',
            'token': '令牌',
            'accessToken': '访问令牌',
            'refreshToken': '刷新令牌',
            
            // 状态相关
            'status': '状态',
            'state': '状态',
            'isActive': '是否激活',
            'isEnabled': '是否启用',
            'isDeleted': '是否删除',
            'isVisible': '是否可见',
            'isPublic': '是否公开',
            'isDefault': '是否默认',
            'delFlag': '删除标志',
            'enableFlag': '启用标志',
            'visibleFlag': '可见标志',
            
            // 数量相关
            'count': '数量',
            'quantity': '数量',
            'amount': '金额',
            'price': '价格',
            'unitPrice': '单价',
            'totalPrice': '总价',
            'totalAmount': '总金额',
            'discount': '折扣',
            'tax': '税费',
            'weight': '重量',
            'length': '长度',
            'width': '宽度',
            'height': '高度',
            'size': '大小',
            'stockQuantity': '库存数量',
            'minStock': '最小库存',
            'maxStock': '最大库存',
            
            // 时间相关
            'createTime': '创建时间',
            'updateTime': '更新时间',
            'deleteTime': '删除时间',
            'createdAt': '创建时间',
            'updatedAt': '更新时间',
            'deletedAt': '删除时间',
            'startTime': '开始时间',
            'endTime': '结束时间',
            'expireTime': '过期时间',
            'loginTime': '登录时间',
            'logoutTime': '登出时间',
            'lastLoginTime': '最后登录时间',
            'birthDate': '出生日期',
            'birthday': '生日',
            'orderDate': '订单日期',
            'publishTime': '发布时间',
            'releaseTime': '发布时间',
            
            // 操作相关
            'createBy': '创建者',
            'updateBy': '更新者',
            'deleteBy': '删除者',
            'createdBy': '创建者',
            'updatedBy': '更新者',
            'deletedBy': '删除者',
            'operator': '操作员',
            'modifier': '修改者',
            
            // 描述相关
            'description': '描述',
            'remark': '备注',
            'note': '备注',
            'comment': '评论',
            'content': '内容',
            'summary': '摘要',
            'detail': '详情',
            'memo': '备忘录',
            
            // 分类相关
            'type': '类型',
            'category': '分类',
            'level': '级别',
            'priority': '优先级',
            'sort': '排序',
            'order': '排序',
            'orderNum': '排序号',
            'sequence': '序号',
            'index': '索引',
            
            // 地理位置
            'country': '国家',
            'province': '省份',
            'city': '城市',
            'district': '区县',
            'street': '街道',
            'longitude': '经度',
            'latitude': '纬度',
            
            // 文件相关
            'url': '链接地址',
            'path': '路径',
            'filePath': '文件路径',
            'fileSize': '文件大小',
            'fileType': '文件类型',
            'mimeType': 'MIME类型',
            'extension': '文件扩展名',
            'avatar': '头像',
            'image': '图片',
            'thumbnail': '缩略图',
            
            // 网络相关
            'ip': 'IP地址',
            'ipAddress': 'IP地址',
            'loginIp': '登录IP',
            'mac': 'MAC地址',
            'domain': '域名',
            'host': '主机',
            'port': '端口',
            
            // 业务相关
            'brand': '品牌',
            'model': '型号',
            'version': '版本',
            'edition': '版本',
            'specification': '规格',
            'unit': '单位',
            'currency': '货币',
            'language': '语言',
            'timezone': '时区',
            'locale': '地区设置',
            
            // 系统相关
            'config': '配置',
            'setting': '设置',
            'parameter': '参数',
            'value': '值',
            'key': '键',
            'label': '标签',
            'tag': '标签',
            'keyword': '关键词',
            'source': '来源',
            'target': '目标',
            'reference': '引用',
            
            // 性别年龄
            'sex': '性别',
            'gender': '性别',
            'age': '年龄',
            
            // 用户类型
            'userType': '用户类型',
            'accountType': '账户类型',
            'memberType': '会员类型',
            
            // 其他常见字段
            'isValid': '是否有效',
            'isLocked': '是否锁定',
            'isOnline': '是否在线',
            'isVip': '是否VIP',
            'score': '评分',
            'rating': '评级',
            'rank': '排名',
            'hits': '点击数',
            'views': '浏览数',
            'downloads': '下载数',
            'likes': '点赞数',
            'shares': '分享数',
            'comments': '评论数'
        };
        
        // 首先尝试精确匹配
        if (commentMap[fieldName]) {
            return commentMap[fieldName];
        }
        
        // 尝试模糊匹配（转换为小写后匹配）
        const lowerFieldName = fieldName.toLowerCase();
        for (const [key, value] of Object.entries(commentMap)) {
            if (key.toLowerCase() === lowerFieldName) {
                return value;
            }
        }
        
        // 尝试包含匹配（字段名包含关键词）
        for (const [key, value] of Object.entries(commentMap)) {
            if (lowerFieldName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerFieldName)) {
                return value;
            }
        }
        
        // 如果都没有匹配到，返回原字段名
        return fieldName;
    }

    highlightDdlCode() {
        if (!this.ddlOutput) return;
        
        let highlighted = this.originalDdlCode;
        
        // 转义HTML特殊字符
        highlighted = highlighted
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // SQL关键字高亮
        highlighted = highlighted.replace(/\b(CREATE|TABLE|IF|NOT|EXISTS|PRIMARY|KEY|AUTO_INCREMENT|NOT|NULL|COMMENT|ENGINE|DEFAULT|CHARSET|COLLATE|VARCHAR|INT|BIGINT|DOUBLE|FLOAT|BOOLEAN|DECIMAL|DATE|TIME|DATETIME|TIMESTAMP)\b/gi, '<span class="keyword">$&</span>');
        
        // 字符串高亮
        highlighted = highlighted.replace(/'[^']*'/g, '<span class="string">$&</span>');
        
        // 注释高亮
        highlighted = highlighted.replace(/--.*$/gm, '<span class="comment">$&</span>');
        
        this.ddlOutput.innerHTML = highlighted;
    }

    clearJavaTab() {
        if (this.javaInputEditor) {
            this.javaInputEditor.setValue('');
        }
        if (this.ddlOutputEditor) {
            this.ddlOutputEditor.setValue('');
        }
        this.originalDdlCode = '';
        this.updateJavaCharCount();
        this.updateDdlOutputStats('');
        this.showStatus('已清空', 'info');
    }

    async copyDdlToClipboard() {
        if (!this.originalDdlCode || !this.originalDdlCode.trim()) {
            this.showStatus('没有可复制的内容', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.originalDdlCode);
            this.showStatus('已复制到剪贴板', 'success');
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = this.originalDdlCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('已复制到剪贴板', 'success');
        }
    }

    downloadDdlFile() {
        if (!this.originalDdlCode || !this.originalDdlCode.trim()) {
            this.showStatus('没有可下载的内容', 'error');
            return;
        }

        const fileName = 'create_tables.sql';
        
        const blob = new Blob([this.originalDdlCode], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus(`已下载 ${fileName}`, 'success');
    }

    loadJavaExample(exampleType) {
        if (!this.javaInput) return;
        
        const examples = {
            'user-entity': `@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, length = 50)
    private String username;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "status")
    private Integer status;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    // getters and setters...
}`,
            'product-entity': `@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_code", unique = true, nullable = false, length = 50)
    private String productCode;
    
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;
    
    @Column(name = "category_id")
    private Integer categoryId;
    
    @Column(name = "brand", length = 100)
    private String brand;
    
    @Column(name = "price", nullable = false)
    private BigDecimal price;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
            'order-entity': `@Entity
@Table(name = "t_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    
    @Column(name = "order_no", nullable = false, length = 32)
    private String orderNo;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;
    
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "order_status", nullable = false)
    private Integer orderStatus;
    
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}`,
            'complex-entity': `@Entity
@Table(name = "sys_user")
public class SysUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(name = "dept_id")
    private Long deptId;
    
    @Column(name = "user_name", nullable = false, length = 30)
    private String userName;
    
    @Column(name = "nick_name", nullable = false, length = 30)
    private String nickName;
    
    @Column(name = "user_type", length = 2)
    private String userType;
    
    @Column(name = "email", length = 50)
    private String email;
    
    @Column(name = "phonenumber", length = 11)
    private String phonenumber;
    
    @Column(name = "sex", length = 1)
    private String sex;
    
    @Column(name = "avatar", length = 100)
    private String avatar;
    
    @Column(name = "password", length = 100)
    private String password;
    
    @Column(name = "status", length = 1)
    private String status;
    
    @Column(name = "del_flag", length = 1)
    private String delFlag;
    
    @Column(name = "login_ip", length = 128)
    private String loginIp;
    
    @Column(name = "login_date")
    private LocalDateTime loginDate;
    
    @Column(name = "create_by", length = 64)
    private String createBy;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    @Column(name = "update_by", length = 64)
    private String updateBy;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    @Column(name = "remark", length = 500)
    private String remark;
}`,
            'blog-entity': `@Entity
@Table(name = "blog_post", indexes = {
    @Index(name = "idx_author_id", columnList = "authorId"),
    @Index(name = "idx_category_id", columnList = "categoryId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_published_at", columnList = "publishedAt")
})
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "slug", unique = true, nullable = false, length = 200)
    private String slug;
    
    @Lob
    @Column(name = "content", nullable = false)
    private String content;
    
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
    
    @Column(name = "author_id", nullable = false)
    private Long authorId;
    
    @Column(name = "category_id")
    private Integer categoryId;
    
    @Column(name = "tags", length = 500)
    private String tags;
    
    @Column(name = "featured_image")
    private String featuredImage;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "comment_count")
    private Integer commentCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PostStatus status = PostStatus.DRAFT;
    
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PostStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }
}`,
            'permission-entity': `@Entity
@Table(name = "sys_permission", indexes = {
    @Index(name = "idx_parent_id", columnList = "parentId"),
    @Index(name = "idx_permission_code", columnList = "permissionCode"),
    @Index(name = "idx_permission_type", columnList = "permissionType")
})
public class SysPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "parent_id")
    private Long parentId = 0L;
    
    @Column(name = "permission_name", nullable = false, length = 50)
    private String permissionName;
    
    @Column(name = "permission_code", unique = true, nullable = false, length = 100)
    private String permissionCode;
    
    @Column(name = "permission_type", nullable = false)
    private Integer permissionType;
    
    @Column(name = "menu_url", length = 200)
    private String menuUrl;
    
    @Column(name = "menu_icon", length = 50)
    private String menuIcon;
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    @Column(name = "is_visible")
    private Boolean isVisible = true;
    
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
            'log-entity': `@Entity
@Table(name = "sys_operation_log", indexes = {
    @Index(name = "idx_user_id", columnList = "userId"),
    @Index(name = "idx_operation_type", columnList = "operationType"),
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_trace_id", columnList = "traceId")
})
public class SysOperationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "trace_id", length = 64)
    private String traceId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "username", length = 50)
    private String username;
    
    @Column(name = "operation_type", nullable = false, length = 20)
    private String operationType;
    
    @Column(name = "operation_name", nullable = false, length = 100)
    private String operationName;
    
    @Column(name = "method_name", length = 200)
    private String methodName;
    
    @Column(name = "request_method", length = 10)
    private String requestMethod;
    
    @Column(name = "request_url", length = 500)
    private String requestUrl;
    
    @Lob
    @Column(name = "request_params")
    private String requestParams;
    
    @Lob
    @Column(name = "response_data")
    private String responseData;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "location", length = 100)
    private String location;
    
    @Column(name = "browser", length = 100)
    private String browser;
    
    @Column(name = "os", length = 100)
    private String os;
    
    @Column(name = "status")
    private Integer status = 1;
    
    @Lob
    @Column(name = "error_msg")
    private String errorMsg;
    
    @Column(name = "cost_time")
    private Integer costTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}`,
            'ecommerce-entity': `@Entity
@Table(name = "product_sku", indexes = {
    @Index(name = "idx_product_id", columnList = "productId"),
    @Index(name = "idx_sku_code", columnList = "skuCode"),
    @Index(name = "idx_sale_price", columnList = "salePrice")
})
public class ProductSku {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "sku_code", unique = true, nullable = false, length = 50)
    private String skuCode;
    
    @Column(name = "sku_name", nullable = false, length = 200)
    private String skuName;
    
    @Column(name = "spec_values", columnDefinition = "JSON")
    private String specValues;
    
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal salePrice;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "warning_stock")
    private Integer warningStock = 10;
    
    @Column(name = "weight", precision = 8, scale = 3)
    private BigDecimal weight;
    
    @Column(name = "volume", precision = 10, scale = 3)
    private BigDecimal volume;
    
    @Column(name = "barcode", length = 50)
    private String barcode;
    
    @Column(name = "images", columnDefinition = "JSON")
    private String images;
    
    @Column(name = "is_default")
    private Boolean isDefault = false;
    
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`
        };
        
        const example = examples[exampleType];
        if (example) {
            this.javaInputEditor.setValue(example);
            this.updateJavaCharCount();
            this.showStatus(`已加载${exampleType}示例`, 'info');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DbToJavaConverter();
});