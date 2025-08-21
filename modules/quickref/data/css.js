// CSS 快速参考数据
window.CSS_CHEATSHEET = {
    title: 'CSS 快速参考',
    description: 'CSS 选择器、属性和布局的完整参考手册',
    sections: [
        {
            title: '基本选择器',
            items: [
                {
                    name: '元素选择器',
                    syntax: 'element',
                    example: 'p { color: red; }'
                },
                {
                    name: '类选择器',
                    syntax: '.class',
                    example: '.highlight { background: yellow; }'
                },
                {
                    name: 'ID选择器',
                    syntax: '#id',
                    example: '#header { font-size: 24px; }'
                },
                {
                    name: '通配符选择器',
                    syntax: '*',
                    example: '* { margin: 0; padding: 0; }'
                },
                {
                    name: '属性选择器',
                    syntax: '[attribute]',
                    example: '[type="text"] { border: 1px solid; }'
                }
            ]
        },
        {
            title: '组合选择器',
            items: [
                {
                    name: '后代选择器',
                    syntax: 'parent child',
                    example: 'div p { margin: 10px; }'
                },
                {
                    name: '子选择器',
                    syntax: 'parent > child',
                    example: 'ul > li { list-style: none; }'
                },
                {
                    name: '相邻兄弟选择器',
                    syntax: 'element + sibling',
                    example: 'h1 + p { margin-top: 0; }'
                },
                {
                    name: '通用兄弟选择器',
                    syntax: 'element ~ sibling',
                    example: 'h1 ~ p { color: gray; }'
                }
            ]
        },
        {
            title: '伪类选择器',
            items: [
                {
                    name: ':hover',
                    description: '鼠标悬停状态',
                    example: 'a:hover { color: blue; }'
                },
                {
                    name: ':focus',
                    description: '获得焦点状态',
                    example: 'input:focus { border-color: blue; }'
                },
                {
                    name: ':active',
                    description: '激活状态',
                    example: 'button:active { background: gray; }'
                },
                {
                    name: ':first-child',
                    description: '第一个子元素',
                    example: 'li:first-child { font-weight: bold; }'
                },
                {
                    name: ':last-child',
                    description: '最后一个子元素',
                    example: 'li:last-child { border-bottom: none; }'
                },
                {
                    name: ':nth-child(n)',
                    description: '第n个子元素',
                    example: 'tr:nth-child(even) { background: #f0f0f0; }'
                }
            ]
        },
        {
            title: '伪元素选择器',
            items: [
                {
                    name: '::before',
                    description: '在元素内容前插入内容',
                    example: 'p::before { content: "→ "; }'
                },
                {
                    name: '::after',
                    description: '在元素内容后插入内容',
                    example: 'p::after { content: " ←"; }'
                },
                {
                    name: '::first-line',
                    description: '选择第一行',
                    example: 'p::first-line { font-weight: bold; }'
                },
                {
                    name: '::first-letter',
                    description: '选择第一个字母',
                    example: 'p::first-letter { font-size: 2em; }'
                }
            ]
        },
        {
            title: '盒模型属性',
            items: [
                {
                    name: 'width',
                    description: '设置元素宽度',
                    example: 'width: 300px;'
                },
                {
                    name: 'height',
                    description: '设置元素高度',
                    example: 'height: 200px;'
                },
                {
                    name: 'margin',
                    description: '外边距',
                    example: 'margin: 10px 20px;'
                },
                {
                    name: 'padding',
                    description: '内边距',
                    example: 'padding: 15px;'
                },
                {
                    name: 'border',
                    description: '边框',
                    example: 'border: 1px solid #ccc;'
                },
                {
                    name: 'box-sizing',
                    description: '盒模型计算方式',
                    example: 'box-sizing: border-box;'
                }
            ]
        },
        {
            title: '文本属性',
            items: [
                {
                    name: 'color',
                    description: '文字颜色',
                    example: 'color: #333;'
                },
                {
                    name: 'font-size',
                    description: '字体大小',
                    example: 'font-size: 16px;'
                },
                {
                    name: 'font-family',
                    description: '字体族',
                    example: 'font-family: Arial, sans-serif;'
                },
                {
                    name: 'font-weight',
                    description: '字体粗细',
                    example: 'font-weight: bold;'
                },
                {
                    name: 'text-align',
                    description: '文本对齐',
                    example: 'text-align: center;'
                },
                {
                    name: 'text-decoration',
                    description: '文本装饰',
                    example: 'text-decoration: underline;'
                },
                {
                    name: 'line-height',
                    description: '行高',
                    example: 'line-height: 1.5;'
                },
                {
                    name: 'letter-spacing',
                    description: '字母间距',
                    example: 'letter-spacing: 2px;'
                }
            ]
        },
        {
            title: '背景属性',
            items: [
                {
                    name: 'background-color',
                    description: '背景颜色',
                    example: 'background-color: #f0f0f0;'
                },
                {
                    name: 'background-image',
                    description: '背景图片',
                    example: 'background-image: url("image.jpg");'
                },
                {
                    name: 'background-repeat',
                    description: '背景重复',
                    example: 'background-repeat: no-repeat;'
                },
                {
                    name: 'background-position',
                    description: '背景位置',
                    example: 'background-position: center;'
                },
                {
                    name: 'background-size',
                    description: '背景大小',
                    example: 'background-size: cover;'
                },
                {
                    name: 'background',
                    description: '背景简写',
                    example: 'background: #fff url("bg.jpg") no-repeat center;'
                }
            ]
        },
        {
            title: '定位属性',
            items: [
                {
                    name: 'position',
                    description: '定位方式',
                    example: 'position: relative;'
                },
                {
                    name: 'top',
                    description: '距离顶部',
                    example: 'top: 10px;'
                },
                {
                    name: 'right',
                    description: '距离右边',
                    example: 'right: 20px;'
                },
                {
                    name: 'bottom',
                    description: '距离底部',
                    example: 'bottom: 15px;'
                },
                {
                    name: 'left',
                    description: '距离左边',
                    example: 'left: 25px;'
                },
                {
                    name: 'z-index',
                    description: '层级',
                    example: 'z-index: 100;'
                }
            ]
        },
        {
            title: 'Flexbox 布局',
            items: [
                {
                    name: 'display: flex',
                    description: '启用弹性布局',
                    example: 'display: flex;'
                },
                {
                    name: 'flex-direction',
                    description: '主轴方向',
                    example: 'flex-direction: row;'
                },
                {
                    name: 'justify-content',
                    description: '主轴对齐',
                    example: 'justify-content: center;'
                },
                {
                    name: 'align-items',
                    description: '交叉轴对齐',
                    example: 'align-items: center;'
                },
                {
                    name: 'flex-wrap',
                    description: '换行设置',
                    example: 'flex-wrap: wrap;'
                },
                {
                    name: 'flex',
                    description: '弹性项目属性',
                    example: 'flex: 1;'
                },
                {
                    name: 'align-self',
                    description: '单个项目对齐',
                    example: 'align-self: flex-end;'
                }
            ]
        },
        {
            title: 'Grid 布局',
            items: [
                {
                    name: 'display: grid',
                    description: '启用网格布局',
                    example: 'display: grid;'
                },
                {
                    name: 'grid-template-columns',
                    description: '定义列',
                    example: 'grid-template-columns: 1fr 2fr 1fr;'
                },
                {
                    name: 'grid-template-rows',
                    description: '定义行',
                    example: 'grid-template-rows: auto 1fr auto;'
                },
                {
                    name: 'gap',
                    description: '网格间距',
                    example: 'gap: 20px;'
                },
                {
                    name: 'grid-column',
                    description: '项目列位置',
                    example: 'grid-column: 1 / 3;'
                },
                {
                    name: 'grid-row',
                    description: '项目行位置',
                    example: 'grid-row: 2 / 4;'
                },
                {
                    name: 'grid-area',
                    description: '网格区域',
                    example: 'grid-area: header;'
                }
            ]
        },
        {
            title: '动画和过渡',
            items: [
                {
                    name: 'transition',
                    description: '过渡效果',
                    example: 'transition: all 0.3s ease;'
                },
                {
                    name: 'transform',
                    description: '变换',
                    example: 'transform: rotate(45deg);'
                },
                {
                    name: 'animation',
                    description: '动画',
                    example: 'animation: fadeIn 2s ease-in-out;'
                },
                {
                    name: '@keyframes',
                    description: '关键帧',
                    example: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
                },
                {
                    name: 'opacity',
                    description: '透明度',
                    example: 'opacity: 0.8;'
                }
            ]
        },
        {
            title: '响应式设计',
            items: [
                {
                    name: '@media',
                    description: '媒体查询',
                    example: '@media (max-width: 768px) { ... }'
                },
                {
                    name: 'max-width',
                    description: '最大宽度查询',
                    example: '@media (max-width: 1200px)'
                },
                {
                    name: 'min-width',
                    description: '最小宽度查询',
                    example: '@media (min-width: 768px)'
                },
                {
                    name: 'orientation',
                    description: '屏幕方向',
                    example: '@media (orientation: landscape)'
                },
                {
                    name: 'viewport',
                    description: '视口单位',
                    example: 'width: 100vw; height: 100vh;'
                }
            ]
        },
        {
            title: '常用单位',
            items: [
                {
                    name: 'px',
                    description: '像素（绝对单位）',
                    example: 'font-size: 16px;'
                },
                {
                    name: 'em',
                    description: '相对于父元素字体大小',
                    example: 'margin: 1.5em;'
                },
                {
                    name: 'rem',
                    description: '相对于根元素字体大小',
                    example: 'padding: 2rem;'
                },
                {
                    name: '%',
                    description: '百分比',
                    example: 'width: 50%;'
                },
                {
                    name: 'vw/vh',
                    description: '视口宽度/高度',
                    example: 'width: 100vw; height: 100vh;'
                },
                {
                    name: 'fr',
                    description: 'Grid布局分数单位',
                    example: 'grid-template-columns: 1fr 2fr;'
                }
            ]
        }
    ]
};