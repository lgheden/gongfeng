class QuickReference {
    constructor() {
        this.cheatsheets = [
            {
                id: 'javascript',
                title: 'JavaScript',
                description: 'JavaScript 语法和常用方法',
                category: 'programming',
                icon: '🟨',
                contentMethod: 'getJavaScriptContent'
            },
            {
                id: 'python',
                title: 'Python',
                description: 'Python 语法和常用库',
                category: 'programming',
                icon: '🐍',
                contentMethod: 'getPythonContent'
            },
            {
                id: 'java',
                title: 'Java',
                description: 'Java 语法和核心概念',
                category: 'programming',
                icon: '☕',
                contentMethod: 'getJavaContent'
            },
            {
                id: 'go',
                title: 'Go',
                description: 'Go 语言语法和特性',
                category: 'programming',
                icon: '🔵',
                contentMethod: 'getGoContent'
            },
            {
                id: 'cpp',
                title: 'C++',
                description: 'C++ 语法和标准库',
                category: 'programming',
                icon: '⚡',
                contentMethod: 'getCppContent'
            },
            {
                id: 'csharp',
                title: 'C#',
                description: 'C# 语法和 .NET 框架',
                category: 'programming',
                icon: '🔷',
                contentMethod: 'getCSharpContent'
            },
            {
                id: 'rust',
                title: 'Rust',
                description: 'Rust 语法和内存管理',
                category: 'programming',
                icon: '🦀',
                contentMethod: 'getRustContent'
            },
            {
                id: 'php',
                title: 'PHP',
                description: 'PHP 语法和 Web 开发',
                category: 'programming',
                icon: '🐘',
                contentMethod: 'getPHPContent'
            },
            {
                id: 'kotlin',
                title: 'Kotlin',
                description: 'Kotlin 语法和 Android 开发',
                category: 'programming',
                icon: '🟣',
                contentMethod: 'getKotlinContent'
            },
            {
                id: 'swift',
                title: 'Swift',
                description: 'Swift 语法和 iOS 开发',
                category: 'programming',
                icon: '🍎',
                contentMethod: 'getSwiftContent'
            },
            {
                id: 'ruby',
                title: 'Ruby',
                description: 'Ruby 语法和 Rails 框架',
                category: 'programming',
                icon: '💎',
                contentMethod: 'getRubyContent'
            },
            {
                id: 'typescript',
                title: 'TypeScript',
                description: 'TypeScript 类型系统和语法',
                category: 'programming',
                icon: '🔷',
                contentMethod: 'getTypeScriptContent'
            },
            {
                id: 'html',
                title: 'HTML',
                description: 'HTML 标签和语义化',
                category: 'web',
                icon: '🌐',
                contentMethod: 'getHTMLContent'
            },
            {
                id: 'css',
                title: 'CSS',
                description: 'CSS 选择器和样式属性',
                category: 'web',
                icon: '🎨',
                contentMethod: 'getCSSContent'
            },
            {
                id: 'c',
                title: 'C',
                description: 'C 语言基础语法',
                category: 'programming',
                icon: '⚙️',
                content: this.getCContent()
            },
            {
                id: 'git',
                title: 'Git',
                description: 'Git 版本控制命令',
                category: 'tools',
                icon: '📝',
                content: this.getGitContent()
            },
            {
                id: 'docker',
                title: 'Docker',
                description: 'Docker 容器化命令',
                category: 'tools',
                icon: '🐳',
                content: this.getDockerContent()
            },
            {
                id: 'kubernetes',
                title: 'Kubernetes',
                description: 'K8s 集群管理命令',
                category: 'tools',
                icon: '☸️',
                content: this.getKubernetesContent()
            },
            {
                id: 'vscode',
                title: 'VS Code',
                description: 'VS Code 快捷键',
                category: 'tools',
                icon: '💻',
                content: this.getVSCodeContent()
            },
            {
                id: 'vim',
                title: 'Vim',
                description: 'Vim 编辑器命令',
                category: 'tools',
                icon: '📝',
                content: this.getVimContent()
            },
            {
                id: 'regex',
                title: 'Regex',
                description: '正则表达式语法',
                category: 'tools',
                icon: '🔍',
                content: this.getRegexContent()
            }
        ];

        this.filteredCheatsheets = [...this.cheatsheets];
        this.dataCache = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCheatsheets();
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const modal = document.getElementById('fullscreen-content');
        const closeBtn = document.querySelector('.close-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCheatsheets(e.target.value, categoryFilter?.value || 'all');
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterCheatsheets(searchInput?.value || '', e.target.value);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                modal.style.display = 'none';
            }
        });
    }

    filterCheatsheets(searchTerm, category) {
        this.filteredCheatsheets = this.cheatsheets.filter(sheet => {
            const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sheet.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'all' || sheet.category === category;
            return matchesSearch && matchesCategory;
        });
        this.renderCheatsheets();
    }

    renderCheatsheets() {
        const container = document.getElementById('contentGrid');
        if (!container) {
            console.error('Content grid container not found');
            return;
        }

        if (this.filteredCheatsheets.length === 0) {
            container.innerHTML = '<div class="no-results"><p>没有找到匹配的快速参考</p></div>';
            return;
        }

        // Render the cheatsheet cards
        container.innerHTML = this.filteredCheatsheets.map(sheet => `
        <div class="cheatsheet-card" data-id="${sheet.id}">
            <div class="card-icon">${sheet.icon}</div>
            <div class="card-content">
                <h3>${sheet.title}</h3>
                <p>${sheet.description}</p>
            </div>
        </div>
    `).join('');

        // Attach event listeners to each card
        const cards = container.querySelectorAll('.cheatsheet-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                this.openCheatsheet(id);
            });
        });
    }

    async openCheatsheet(id) {
        const sheet = this.cheatsheets.find(s => s.id === id);
        if (!sheet) return;

        const modal = document.getElementById('fullscreen-content');
        const title = document.getElementById('fullscreen-title');
        const content = document.getElementById('fullscreen-body');

        if (!modal || !title || !content) return;

        title.textContent = sheet.title;

        // 显示加载状态
        content.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>正在加载...</p></div>';
        modal.style.display = 'block';

        try {
            let htmlContent;
            debugger

            if (sheet.contentMethod) {
                // 异步加载内容
                htmlContent = await this[sheet.contentMethod]();
            } else if (sheet.content) {
                // 使用静态内容
                htmlContent = sheet.content;
            } else {
                htmlContent = '<div class="cheatsheet-content"><p>内容暂未提供</p></div>';
            }

            content.innerHTML = htmlContent;
        } catch (error) {
            console.error('Error loading cheatsheet content:', error);
            content.innerHTML = '<div class="cheatsheet-content"><p>加载失败，请刷新页面重试</p></div>';
        }
    }

    // 数据文件加载方法
    async loadDataFile(language) {
        if (this.dataCache.has(language)) {
            return this.dataCache.get(language);
        }

        try {

            // 根据语言获取对应的全局变量
            let data;
            switch (language) {
                case 'javascript':
                    data = window.JAVASCRIPT_CHEATSHEET;
                    break;
                case 'python':
                    data = window.PYTHON_CHEATSHEET;
                    break;
                case 'java':
                    data = window.JAVA_CHEATSHEET;
                    break;
                case 'go':
                    data = window.GO_CHEATSHEET;
                    break;
                case 'cpp':
                    data = window.CPP_CHEATSHEET;
                    break;
                case 'csharp':
                    data = window.CSHARP_CHEATSHEET;
                    break;
                case 'rust':
                    data = window.RUST_CHEATSHEET;
                    break;
                case 'php':
                    data = window.PHP_CHEATSHEET;
                    break;
                case 'kotlin':
                    data = window.KOTLIN_CHEATSHEET;
                    break;
                case 'swift':
                    data = window.SWIFT_CHEATSHEET;
                    break;
                case 'ruby':
                    data = window.RUBY_CHEATSHEET;
                    break;
                case 'typescript':
                    data = window.TYPESCRIPT_CHEATSHEET;
                    break;
                case 'html':
                    data = window.HTML_CHEATSHEET;
                    break;
                case 'css':
                    data = window.CSS_CHEATSHEET;
                    break;
                default:
                    throw new Error(`Unknown language: ${language}`);
            }
            this.dataCache.set(language, data);
            return data;
        } catch (error) {
            console.error(`Error loading ${language} data:`, error);
            throw error;
        }
    }

    // 将数据转换为HTML
    convertDataToHTML(data) {
        if (!data || !data.sections) {
            return '<div class="cheatsheet-content"><p>数据格式错误</p></div>';
        }

        let html = '<div class="cheatsheet-content">';

        data.sections.forEach(section => {
            html += `<div class="cheatsheet-section">`;
            html += `<h3>${section.title}</h3>`;

            if (section.items && section.items.length > 0) {
                html += '<table class="cheatsheet-table">';

                // 添加表头
                if (section.items[0].syntax && section.items[0].code) {
                    html += '<tr><th>概念</th><th>语法</th><th>示例</th></tr>';
                } else if (section.items[0].description && section.items[0].code) {
                    html += '<tr><th>方法/属性</th><th>说明</th><th>示例</th></tr>';
                } else if (section.items[0].description) {
                    html += '<tr><th>项目</th><th>说明</th></tr>';
                }

                debugger
                section.items.forEach(item => {
                    html += '<tr>';
                    html += `<td><code>${item.name || item.concept || item.item || item.title}</code></td>`;

                    if (item.syntax) {
                        html += `<td>${item.syntax}</td>`;
                    }

                    if (item.description) {
                        html += `<td>${item.description}</td>`;
                    }

                    if (item.code) {
                        html += `<td><code>${item.code}</code></td>`;
                    }

                    html += '</tr>';
                });

                html += '</table>';
            }

            if (section.code) {
                html += '<div class="code-block">';
                html += `<code>${section.code}</code>`;
                html += '</div>';
            }

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    // JavaScript 内容获取方法
    async getJavaScriptContent() {
        try {
            const data = await this.loadDataFile('javascript');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading JavaScript data:', error);
            return '<div class="cheatsheet-content"><p>JavaScript 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Python 内容获取方法
    async getPythonContent() {
        try {
            const data = await this.loadDataFile('python');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Python data:', error);
            return '<div class="cheatsheet-content"><p>Python 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Java 内容获取方法
    async getJavaContent() {
        try {
            const data = await this.loadDataFile('java');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Java data:', error);
            return '<div class="cheatsheet-content"><p>Java 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Go 内容获取方法
    async getGoContent() {
        try {
            const data = await this.loadDataFile('go');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Go data:', error);
            return '<div class="cheatsheet-content"><p>Go 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // C++ 内容获取方法
    async getCppContent() {
        try {
            const data = await this.loadDataFile('cpp');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading C++ data:', error);
            return '<div class="cheatsheet-content"><p>C++ 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // C# 内容获取方法
    async getCSharpContent() {
        try {
            const data = await this.loadDataFile('csharp');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading C# data:', error);
            return '<div class="cheatsheet-content"><p>C# 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Rust 内容获取方法
    async getRustContent() {
        try {
            const data = await this.loadDataFile('rust');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Rust data:', error);
            return '<div class="cheatsheet-content"><p>Rust 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // PHP 内容获取方法
    async getPHPContent() {
        try {
            const data = await this.loadDataFile('php');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading PHP data:', error);
            return '<div class="cheatsheet-content"><p>PHP 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Kotlin 内容获取方法
    async getKotlinContent() {
        try {
            const data = await this.loadDataFile('kotlin');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Kotlin data:', error);
            return '<div class="cheatsheet-content"><p>Kotlin 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // HTML 内容获取方法
    async getHTMLContent() {
        try {
            const data = await this.loadDataFile('html');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading HTML data:', error);
            return '<div class="cheatsheet-content"><p>HTML 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // CSS 内容获取方法
    async getCSSContent() {
        try {
            const data = await this.loadDataFile('css');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading CSS data:', error);
            return '<div class="cheatsheet-content"><p>CSS 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Swift 内容获取方法
    async getSwiftContent() {
        try {
            const data = await this.loadDataFile('swift');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Swift data:', error);
            return '<div class="cheatsheet-content"><p>Swift 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // Ruby 内容获取方法
    async getRubyContent() {
        try {
            const data = await this.loadDataFile('ruby');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading Ruby data:', error);
            return '<div class="cheatsheet-content"><p>Ruby 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    // TypeScript 内容获取方法
    async getTypeScriptContent() {
        try {
            const data = await this.loadDataFile('typescript');
            return this.convertDataToHTML(data);
        } catch (error) {
            console.error('Error loading TypeScript data:', error);
            return '<div class="cheatsheet-content"><p>TypeScript 数据加载失败，请刷新页面重试。</p></div>';
        }
    }

    getCContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>基本语法</h3>
                    <table class="cheatsheet-table">
                        <tr><th>概念</th><th>语法</th><th>示例</th></tr>
                        <tr><td>变量声明</td><td>type name;</td><td><code>int x; char c;</code></td></tr>
                        <tr><td>数组</td><td>type name[size];</td><td><code>int arr[10];</code></td></tr>
                        <tr><td>指针</td><td>type *name;</td><td><code>int *ptr;</code></td></tr>
                        <tr><td>函数</td><td>type name(params)</td><td><code>int add(int a, int b)</code></td></tr>
                    </table>
                </div>
                
                <div class="cheatsheet-section">
                    <h3>控制结构</h3>
                    <div class="code-block">
                        <code>// if-else
if (condition) {
    // code
} else if (condition2) {
    // code
} else {
    // code
}

// for 循环
for (int i = 0; i < n; i++) {
    // code
}

// while 循环
while (condition) {
    // code
}

// switch
switch (variable) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // code
}</code>
                    </div>
                </div>
                
                <div class="cheatsheet-section">
                    <h3>常用函数</h3>
                    <table class="cheatsheet-table">
                        <tr><th>函数</th><th>头文件</th><th>说明</th></tr>
                        <tr><td>printf()</td><td>stdio.h</td><td>格式化输出</td></tr>
                        <tr><td>scanf()</td><td>stdio.h</td><td>格式化输入</td></tr>
                        <tr><td>malloc()</td><td>stdlib.h</td><td>动态内存分配</td></tr>
                        <tr><td>free()</td><td>stdlib.h</td><td>释放内存</td></tr>
                        <tr><td>strlen()</td><td>string.h</td><td>字符串长度</td></tr>
                        <tr><td>strcpy()</td><td>string.h</td><td>字符串复制</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getGitContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>基本命令</h3>
                    <table class="cheatsheet-table">
                        <tr><th>命令</th><th>说明</th></tr>
                        <tr><td><code>git init</code></td><td>初始化仓库</td></tr>
                        <tr><td><code>git clone &lt;url&gt;</code></td><td>克隆仓库</td></tr>
                        <tr><td><code>git add &lt;file&gt;</code></td><td>添加文件到暂存区</td></tr>
                        <tr><td><code>git commit -m "message"</code></td><td>提交更改</td></tr>
                        <tr><td><code>git push</code></td><td>推送到远程仓库</td></tr>
                        <tr><td><code>git pull</code></td><td>从远程仓库拉取</td></tr>
                    </table>
                </div>
                
                <div class="cheatsheet-section">
                    <h3>分支操作</h3>
                    <table class="cheatsheet-table">
                        <tr><th>命令</th><th>说明</th></tr>
                        <tr><td><code>git branch</code></td><td>列出分支</td></tr>
                        <tr><td><code>git branch &lt;name&gt;</code></td><td>创建分支</td></tr>
                        <tr><td><code>git checkout &lt;branch&gt;</code></td><td>切换分支</td></tr>
                        <tr><td><code>git merge &lt;branch&gt;</code></td><td>合并分支</td></tr>
                        <tr><td><code>git branch -d &lt;branch&gt;</code></td><td>删除分支</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getDockerContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>基本命令</h3>
                    <table class="cheatsheet-table">
                        <tr><th>命令</th><th>说明</th></tr>
                        <tr><td><code>docker run &lt;image&gt;</code></td><td>运行容器</td></tr>
                        <tr><td><code>docker ps</code></td><td>列出运行中的容器</td></tr>
                        <tr><td><code>docker images</code></td><td>列出镜像</td></tr>
                        <tr><td><code>docker build -t &lt;name&gt; .</code></td><td>构建镜像</td></tr>
                        <tr><td><code>docker stop &lt;container&gt;</code></td><td>停止容器</td></tr>
                        <tr><td><code>docker rm &lt;container&gt;</code></td><td>删除容器</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getKubernetesContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>kubectl 基本命令</h3>
                    <table class="cheatsheet-table">
                        <tr><th>命令</th><th>说明</th></tr>
                        <tr><td><code>kubectl get pods</code></td><td>列出 Pod</td></tr>
                        <tr><td><code>kubectl describe pod &lt;name&gt;</code></td><td>查看 Pod 详情</td></tr>
                        <tr><td><code>kubectl apply -f &lt;file&gt;</code></td><td>应用配置</td></tr>
                        <tr><td><code>kubectl delete pod &lt;name&gt;</code></td><td>删除 Pod</td></tr>
                        <tr><td><code>kubectl logs &lt;pod&gt;</code></td><td>查看日志</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getVSCodeContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>常用快捷键</h3>
                    <table class="cheatsheet-table">
                        <tr><th>快捷键</th><th>功能</th></tr>
                        <tr><td><code>Ctrl+Shift+P</code></td><td>命令面板</td></tr>
                        <tr><td><code>Ctrl+P</code></td><td>快速打开文件</td></tr>
                        <tr><td><code>Ctrl+\`</code></td><td>打开终端</td></tr>
                        <tr><td><code>Ctrl+/</code></td><td>切换注释</td></tr>
                        <tr><td><code>Alt+↑/↓</code></td><td>移动行</td></tr>
                        <tr><td><code>Shift+Alt+↑/↓</code></td><td>复制行</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getVimContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>基本操作</h3>
                    <table class="cheatsheet-table">
                        <tr><th>命令</th><th>说明</th></tr>
                        <tr><td><code>i</code></td><td>进入插入模式</td></tr>
                        <tr><td><code>Esc</code></td><td>退出插入模式</td></tr>
                        <tr><td><code>:w</code></td><td>保存文件</td></tr>
                        <tr><td><code>:q</code></td><td>退出</td></tr>
                        <tr><td><code>:wq</code></td><td>保存并退出</td></tr>
                        <tr><td><code>dd</code></td><td>删除当前行</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    getRegexContent() {
        return `
            <div class="cheatsheet-content">
                <div class="cheatsheet-section">
                    <h3>基本语法</h3>
                    <table class="cheatsheet-table">
                        <tr><th>符号</th><th>说明</th></tr>
                        <tr><td>.</td><td>匹配任意字符</td></tr>
                        <tr><td>*</td><td>匹配0次或多次</td></tr>
                        <tr><td>+</td><td>匹配1次或多次</td></tr>
                        <tr><td>?</td><td>匹配0次或1次</td></tr>
                        <tr><td>^</td><td>行开始</td></tr>
                        <tr><td>$</td><td>行结束</td></tr>
                        <tr><td>\\d</td><td>匹配数字</td></tr>
                        <tr><td>\\w</td><td>匹配单词字符</td></tr>
                        <tr><td>\\s</td><td>匹配空白字符</td></tr>
                    </table>
                </div>
            </div>
        `;
    }
}

// 初始化应用
let quickRef;
document.addEventListener('DOMContentLoaded', () => {
    quickRef = new QuickReference();
});