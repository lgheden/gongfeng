// 统一入口文件，引入所有用户脚本示例
import baiduLogoReplace from './baidu-logo-replace.js';
import autoRefresh from './auto-refresh.js';
import githubEnhancer from './github-enhancer.js';
import autoLogin from './auto-login.js';
import adBlocker from './ad-blocker.js';
import darkMode from './dark-mode.js';
import pageTranslator from './page-translator.js';
import downloadHelper from './download-helper.js';

// 统一导出所有脚本示例
const userScriptExamples = {
    'baidu-logo-replace': {
        name: '百度Logo替换为Google',
        description: '将百度首页的Logo替换为Google Logo',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://www.baidu.com/*'],
        scriptCode: baiduLogoReplace
    },
    'auto-refresh': {
        name: '网页自动刷新器',
        description: '为网页添加自动刷新功能，可自定义刷新间隔',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: autoRefresh
    },
    'github-enhancer': {
        name: 'GitHub增强器',
        description: '为GitHub添加便捷功能，如一键复制仓库地址等',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://github.com/*'],
        scriptCode: githubEnhancer
    },
    'auto-login': {
        name: '自动登录助手',
        description: '自动填充登录表单并提交（需要预先配置账号信息）',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: autoLogin
    },
    'ad-blocker': {
        name: '智能广告屏蔽',
        description: '智能识别并屏蔽网页中的广告内容',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: adBlocker
    },
    'dark-mode': {
        name: '万能夜间模式',
        description: '为任何网站添加夜间模式，保护眼睛',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: darkMode
    },
    'page-translator': {
        name: '网页翻译器',
        description: '一键翻译网页内容，支持多种语言',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: pageTranslator
    },
    'download-helper': {
        name: '下载助手',
        description: '增强下载功能，支持批量下载和下载管理',
        author: 'UserScript Manager',
        version: '1.0',
        match: ['*://*/*'],
        scriptCode: downloadHelper
    }
};

// 将userScriptExamples导出到全局变量
window.userScriptExamples = userScriptExamples;

export default userScriptExamples;