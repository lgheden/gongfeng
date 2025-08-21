/**
 * Prompt Library 数据配置
 * 包含所有提示词的分类、语言和具体内容
 */

// 初始化数据变量（在数据文件加载之前）
var CODE_GENERATION_PROMPTS = [];
var CODE_REVIEW_PROMPTS = [];
var DEBUGGING_PROMPTS = [];
var API_DEVELOPMENT_PROMPTS = [];
var API_DOCUMENTATION_PROMPTS = [];
var DATABASE_DESIGN_PROMPTS = [];
var DATABASE_PROMPTS = [];
var MOBILE_DEVELOPMENT_PROMPTS = [];
var AI_ML_PROMPTS = [];
var FRONTEND_PROMPTS = [];
var BACKEND_PROMPTS = [];
var DEVOPS_PROMPTS = [];
var TESTING_PROMPTS = [];
var SECURITY_PERFORMANCE_PROMPTS = [];
var PROJECT_FRAMEWORK_PROMPTS = [];

// 语言特定的数据变量
var PYTHON_PROMPTS = [];
var JAVASCRIPT_PROMPTS = [];
var JAVA_PROMPTS = [];
var CPP_PROMPTS = [];
var GO_PROMPTS = [];

// Node.js环境的处理
if (typeof require !== 'undefined') {
    try {
        CODE_GENERATION_PROMPTS = require('./code-generation-prompts.js');
CODE_REVIEW_PROMPTS = require('./code-review-prompts.js');
DEBUGGING_PROMPTS = require('./debugging-prompts.js');
API_DEVELOPMENT_PROMPTS = require('./api-development-prompts.js');
API_DOCUMENTATION_PROMPTS = require('./api-documentation-prompts.js');
DATABASE_DESIGN_PROMPTS = require('./database-design-prompts.js');
DATABASE_PROMPTS = require('./database-prompts.js');
MOBILE_DEVELOPMENT_PROMPTS = require('./mobile-development-prompts.js');
AI_ML_PROMPTS = require('./ai-ml-prompts.js');
FRONTEND_PROMPTS = require('./frontend-prompts.js');
BACKEND_PROMPTS = require('./backend-prompts.js');
DEVOPS_PROMPTS = require('./devops-prompts.js');
TESTING_PROMPTS = require('./testing-prompts.js');
SECURITY_PERFORMANCE_PROMPTS = require('./security-performance-prompts.js');
PROJECT_FRAMEWORK_PROMPTS = require('./project-framework-prompts.js');
        
        // 语言特定的数据文件
        PYTHON_PROMPTS = require('./python-prompts.js');
JAVASCRIPT_PROMPTS = require('./javascript-prompts.js');
JAVA_PROMPTS = require('./java-prompts.js');
CPP_PROMPTS = require('./cpp-prompts.js');
GO_PROMPTS = require('./go-prompts.js');
    } catch (error) {
        console.warn('Failed to load some prompt data files:', error.message);
    }
}

// 定义基础结构
var PROMPT_DATA = {
    // 分类定义
    categories: [
        { id: 'code-generation', name: '代码生成', icon: '🔧' },
        { id: 'debugging', name: '调试优化', icon: '🐛' },
        { id: 'code-review', name: '代码审查', icon: '👀' },
        { id: 'api-development', name: 'API开发', icon: '🌐' },
        { id: 'api-design', name: 'API设计', icon: '🔗' },
        { id: 'database-design', name: '数据库设计', icon: '🗃️' },
        { id: 'database-optimization', name: '数据库优化', icon: '⚡' },
        { id: 'mobile-development', name: '移动开发', icon: '📱' },
        { id: 'ai-ml', name: 'AI/机器学习', icon: '🤖' },
        { id: 'frontend', name: '前端开发', icon: '🎨' },
        { id: 'backend', name: '后端开发', icon: '⚙️' },
        { id: 'testing', name: '测试相关', icon: '🧪' },
        { id: 'devops', name: 'DevOps', icon: '🚀' },
        { id: 'security', name: '安全相关', icon: '🔒' },
        { id: 'performance', name: '性能优化', icon: '⚡' },
        { id: 'documentation', name: '文档编写', icon: '📝' },
        { id: 'architecture', name: '架构设计', icon: '🏗️' },
        { id: 'learning', name: '学习指导', icon: '📚' }
    ],

    // 编程语言定义
    languages: [
        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'typescript', name: 'TypeScript', icon: '🔷' },
        { id: 'react', name: 'React', icon: '⚛️' },
        { id: 'vue', name: 'Vue.js', icon: '💚' },
        { id: 'node', name: 'Node.js', icon: '💚' },
        { id: 'go', name: 'Go', icon: '🐹' },
        { id: 'rust', name: 'Rust', icon: '🦀' },
        { id: 'cpp', name: 'C++', icon: '⚙️' },
        { id: 'csharp', name: 'C#', icon: '🔵' },
        { id: 'php', name: 'PHP', icon: '🐘' },
        { id: 'sql', name: 'SQL', icon: '🗃️' },
        { id: 'docker', name: 'Docker', icon: '🐳' },
        { id: 'kubernetes', name: 'Kubernetes', icon: '☸️' },
        { id: 'yaml', name: 'YAML', icon: '📄' },
        { id: 'aws', name: 'AWS', icon: '☁️' },
        { id: 'multiple', name: '多语言', icon: '🌐' }
    ],

    // 初始化为空数组
    prompts: []
};

// 更新prompts数据的函数
function updatePromptData() {
    console.log('updatePromptData called');
    
    // 在浏览器环境中，数据文件会通过window对象更新变量
    if (typeof window !== 'undefined') {
        // 检查全局变量是否已定义
        if (typeof window.CODE_GENERATION_PROMPTS !== 'undefined') {
            CODE_GENERATION_PROMPTS = window.CODE_GENERATION_PROMPTS;
        }
        if (typeof window.CODE_REVIEW_PROMPTS !== 'undefined') {
            CODE_REVIEW_PROMPTS = window.CODE_REVIEW_PROMPTS;
        }
        if (typeof window.DEBUGGING_PROMPTS !== 'undefined') {
            DEBUGGING_PROMPTS = window.DEBUGGING_PROMPTS;
        }
        if (typeof window.API_DEVELOPMENT_PROMPTS !== 'undefined') {
            API_DEVELOPMENT_PROMPTS = window.API_DEVELOPMENT_PROMPTS;
        }
        if (typeof window.API_DOCUMENTATION_PROMPTS !== 'undefined') {
            API_DOCUMENTATION_PROMPTS = window.API_DOCUMENTATION_PROMPTS;
        }
        if (typeof window.DATABASE_DESIGN_PROMPTS !== 'undefined') {
            DATABASE_DESIGN_PROMPTS = window.DATABASE_DESIGN_PROMPTS;
        }
        if (typeof window.DATABASE_PROMPTS !== 'undefined') {
            DATABASE_PROMPTS = window.DATABASE_PROMPTS;
        }
        if (typeof window.MOBILE_DEVELOPMENT_PROMPTS !== 'undefined') {
            MOBILE_DEVELOPMENT_PROMPTS = window.MOBILE_DEVELOPMENT_PROMPTS;
        }
        if (typeof window.AI_ML_PROMPTS !== 'undefined') {
            AI_ML_PROMPTS = window.AI_ML_PROMPTS;
        }
        if (typeof window.FRONTEND_PROMPTS !== 'undefined') {
            FRONTEND_PROMPTS = window.FRONTEND_PROMPTS;
        }
        if (typeof window.BACKEND_PROMPTS !== 'undefined') {
            BACKEND_PROMPTS = window.BACKEND_PROMPTS;
        }
        if (typeof window.DEVOPS_PROMPTS !== 'undefined') {
            DEVOPS_PROMPTS = window.DEVOPS_PROMPTS;
        }
        if (typeof window.TESTING_PROMPTS !== 'undefined') {
            TESTING_PROMPTS = window.TESTING_PROMPTS;
        }
        if (typeof window.SECURITY_PERFORMANCE_PROMPTS !== 'undefined') {
            SECURITY_PERFORMANCE_PROMPTS = window.SECURITY_PERFORMANCE_PROMPTS;
        }
        
        // 检查语言特定的数据变量
        if (typeof window.PYTHON_PROMPTS !== 'undefined') {
            PYTHON_PROMPTS = window.PYTHON_PROMPTS;
        }
        if (typeof window.JAVASCRIPT_PROMPTS !== 'undefined') {
            JAVASCRIPT_PROMPTS = window.JAVASCRIPT_PROMPTS;
        }
        if (typeof window.JAVA_PROMPTS !== 'undefined') {
            JAVA_PROMPTS = window.JAVA_PROMPTS;
        }
        if (typeof window.CPP_PROMPTS !== 'undefined') {
            CPP_PROMPTS = window.CPP_PROMPTS;
        }
        if (typeof window.GO_PROMPTS !== 'undefined') {
            GO_PROMPTS = window.GO_PROMPTS;
        }
        
        console.log('Data arrays lengths:', {
            CODE_GENERATION_PROMPTS: CODE_GENERATION_PROMPTS.length,
            CODE_REVIEW_PROMPTS: CODE_REVIEW_PROMPTS.length,
            DEBUGGING_PROMPTS: DEBUGGING_PROMPTS.length,
            API_DEVELOPMENT_PROMPTS: API_DEVELOPMENT_PROMPTS.length,
            API_DOCUMENTATION_PROMPTS: API_DOCUMENTATION_PROMPTS.length,
            DATABASE_DESIGN_PROMPTS: DATABASE_DESIGN_PROMPTS.length,
            DATABASE_PROMPTS: DATABASE_PROMPTS.length,
            MOBILE_DEVELOPMENT_PROMPTS: MOBILE_DEVELOPMENT_PROMPTS.length,
            AI_ML_PROMPTS: AI_ML_PROMPTS.length,
            FRONTEND_PROMPTS: FRONTEND_PROMPTS.length,
            BACKEND_PROMPTS: BACKEND_PROMPTS.length,
            DEVOPS_PROMPTS: DEVOPS_PROMPTS.length,
            TESTING_PROMPTS: TESTING_PROMPTS.length,
            SECURITY_PERFORMANCE_PROMPTS: SECURITY_PERFORMANCE_PROMPTS.length,
            PYTHON_PROMPTS: PYTHON_PROMPTS.length,
            JAVASCRIPT_PROMPTS: JAVASCRIPT_PROMPTS.length,
            JAVA_PROMPTS: JAVA_PROMPTS.length,
            CPP_PROMPTS: CPP_PROMPTS.length,
            GO_PROMPTS: GO_PROMPTS.length
        });
    }
    
    PROMPT_DATA.prompts = [
        ...CODE_GENERATION_PROMPTS,
        ...CODE_REVIEW_PROMPTS,
        ...DEBUGGING_PROMPTS,
        ...API_DEVELOPMENT_PROMPTS,
        ...API_DOCUMENTATION_PROMPTS,
        ...DATABASE_DESIGN_PROMPTS,
        ...DATABASE_PROMPTS,
        ...MOBILE_DEVELOPMENT_PROMPTS,
        ...AI_ML_PROMPTS,
        ...FRONTEND_PROMPTS,
        ...BACKEND_PROMPTS,
        ...DEVOPS_PROMPTS,
        ...TESTING_PROMPTS,
        ...SECURITY_PERFORMANCE_PROMPTS,
        ...PROJECT_FRAMEWORK_PROMPTS,
        ...PYTHON_PROMPTS,
        ...JAVASCRIPT_PROMPTS,
        ...JAVA_PROMPTS,
        ...CPP_PROMPTS,
        ...GO_PROMPTS
    ];
    
    console.log('PROMPT_DATA updated, total prompts:', PROMPT_DATA.prompts.length);
}

// 在浏览器环境中，等待所有脚本加载完成后再更新数据
if (typeof window !== 'undefined') {
    // 使用window.onload确保所有脚本都已加载
    if (document.readyState === 'complete') {
        updatePromptData();
    } else {
        window.addEventListener('load', updatePromptData);
    }
} else {
    // Node.js环境中立即更新
    updatePromptData();
}

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROMPT_DATA };
} else if (typeof window !== 'undefined') {
    window.PROMPT_DATA = PROMPT_DATA;
}