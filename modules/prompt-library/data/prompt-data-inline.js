// 临时定义PROMPT_DATA来解决加载问题
window.PROMPT_DATA = {
    categories: [
        { id: 'code-generation', name: '代码生成', icon: '🔧' },
        { id: 'debugging', name: '调试优化', icon: '🐛' },
        { id: 'code-review', name: '代码审查', icon: '👀' },
        { id: 'api-development', name: 'API开发', icon: '🌐' },
        { id: 'database-design', name: '数据库设计', icon: '🗃️' },
        { id: 'frontend', name: '前端开发', icon: '🎨' },
        { id: 'backend', name: '后端开发', icon: '⚙️' },
        { id: 'testing', name: '测试相关', icon: '🧪' },
        { id: 'devops', name: 'DevOps', icon: '🚀' },
        { id: 'security-performance', name: '安全性能', icon: '🔒' }
    ],
    languages: [
        { id: 'all', name: '全部语言' },
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' },
        { id: 'general', name: '通用' }
    ],
    prompts: [
        {
            id: 'test-prompt',
            title: '测试提示词',
            description: '这是一个测试提示词',
            category: 'code-generation',
            language: 'javascript',
            prompt: '请帮我生成一个JavaScript函数',
            code: 'function test() { return "Hello World"; }'
        }
    ]
};