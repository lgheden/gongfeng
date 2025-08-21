/**
 * JavaScript 快速参考数据
 * 基于 quickref.me 的 JavaScript 参考内容
 */

const JAVASCRIPT_CHEATSHEET = {
    id: 'javascript',
    title: 'JavaScript',
    description: 'JavaScript 是一种轻量级的解释型编程语言',
    icon: '🟨',
    category: 'programming',
    sections: [
        {
            title: '变量声明',
            items: [
                {
                    title: 'var',
                    description: '函数作用域变量',
                    code: 'var name = "John";'
                },
                {
                    title: 'let',
                    description: '块级作用域变量',
                    code: 'let age = 25;'
                },
                {
                    title: 'const',
                    description: '常量声明',
                    code: 'const PI = 3.14159;'
                }
            ]
        },
        {
            title: '数据类型',
            items: [
                {
                    title: 'String',
                    description: '字符串类型',
                    code: 'let text = "Hello World";\nlet template = `Hello ${name}`;'
                },
                {
                    title: 'Number',
                    description: '数字类型',
                    code: 'let integer = 42;\nlet float = 3.14;'
                },
                {
                    title: 'Boolean',
                    description: '布尔类型',
                    code: 'let isTrue = true;\nlet isFalse = false;'
                },
                {
                    title: 'Array',
                    description: '数组类型',
                    code: 'let arr = [1, 2, 3];\nlet mixed = ["text", 42, true];'
                },
                {
                    title: 'Object',
                    description: '对象类型',
                    code: 'let person = {\n  name: "John",\n  age: 30\n};'
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数声明',
                    description: '标准函数声明',
                    code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}'
                },
                {
                    title: '箭头函数',
                    description: 'ES6 箭头函数',
                    code: 'const greet = (name) => `Hello, ${name}!`;\nconst add = (a, b) => a + b;'
                },
                {
                    title: '匿名函数',
                    description: '匿名函数表达式',
                    code: 'const greet = function(name) {\n  return `Hello, ${name}!`;\n};'
                }
            ]
        },
        {
            title: '数组方法',
            items: [
                {
                    title: 'map()',
                    description: '映射数组元素',
                    code: 'const doubled = [1, 2, 3].map(x => x * 2);\n// [2, 4, 6]'
                },
                {
                    title: 'filter()',
                    description: '过滤数组元素',
                    code: 'const evens = [1, 2, 3, 4].filter(x => x % 2 === 0);\n// [2, 4]'
                },
                {
                    title: 'reduce()',
                    description: '归约数组',
                    code: 'const sum = [1, 2, 3, 4].reduce((acc, x) => acc + x, 0);\n// 10'
                },
                {
                    title: 'forEach()',
                    description: '遍历数组',
                    code: '[1, 2, 3].forEach(x => console.log(x));'
                }
            ]
        },
        {
            title: '条件语句',
            items: [
                {
                    title: 'if...else',
                    description: '条件判断',
                    code: 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}'
                },
                {
                    title: 'switch',
                    description: '多条件判断',
                    code: 'switch (day) {\n  case "Monday":\n    console.log("Start of week");\n    break;\n  default:\n    console.log("Other day");\n}'
                },
                {
                    title: '三元运算符',
                    description: '简化条件判断',
                    code: 'const status = age >= 18 ? "Adult" : "Minor";'
                }
            ]
        },
        {
            title: '循环',
            items: [
                {
                    title: 'for',
                    description: '标准for循环',
                    code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}'
                },
                {
                    title: 'for...of',
                    description: '遍历可迭代对象',
                    code: 'for (const item of array) {\n  console.log(item);\n}'
                },
                {
                    title: 'for...in',
                    description: '遍历对象属性',
                    code: 'for (const key in object) {\n  console.log(key, object[key]);\n}'
                },
                {
                    title: 'while',
                    description: 'while循环',
                    code: 'let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}'
                }
            ]
        },
        {
            title: 'DOM 操作',
            items: [
                {
                    title: '选择元素',
                    description: '获取DOM元素',
                    code: 'const element = document.getElementById("myId");\nconst elements = document.querySelectorAll(".myClass");'
                },
                {
                    title: '修改内容',
                    description: '修改元素内容',
                    code: 'element.textContent = "New text";\nelement.innerHTML = "<b>Bold text</b>";'
                },
                {
                    title: '事件监听',
                    description: '添加事件监听器',
                    code: 'element.addEventListener("click", function() {\n  console.log("Clicked!");\n});'
                }
            ]
        },
        {
            title: 'Promise 和异步',
            items: [
                {
                    title: 'Promise',
                    description: 'Promise 基础',
                    code: 'const promise = new Promise((resolve, reject) => {\n  // 异步操作\n  resolve("Success");\n});'
                },
                {
                    title: 'async/await',
                    description: '异步函数',
                    code: 'async function fetchData() {\n  try {\n    const response = await fetch("/api/data");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}'
                },
                {
                    title: 'fetch API',
                    description: 'HTTP 请求',
                    code: 'fetch("/api/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JAVASCRIPT_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.JAVASCRIPT_CHEATSHEET = JAVASCRIPT_CHEATSHEET;
}