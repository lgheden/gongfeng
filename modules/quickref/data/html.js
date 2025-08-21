/**
 * HTML 快速参考数据
 * 基于 quickref.me 的 HTML 参考内容
 */

const HTML_CHEATSHEET = {
    id: 'html',
    title: 'HTML',
    description: 'HTML 是用于创建网页的标准标记语言',
    icon: '🌐',
    category: 'frontend',
    sections: [
        {
            title: '基本结构',
            items: [
                {
                    title: 'HTML5 文档结构',
                    description: '标准HTML5文档模板',
                    code: '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>页面标题</title>\n</head>\n<body>\n    <!-- 页面内容 -->\n</body>\n</html>'
                },
                {
                    title: 'Head 元素',
                    description: '文档头部信息',
                    code: '<head>\n    <meta charset="UTF-8">\n    <meta name="description" content="页面描述">\n    <meta name="keywords" content="关键词1,关键词2">\n    <meta name="author" content="作者名">\n    <link rel="stylesheet" href="style.css">\n    <script src="script.js"></script>\n</head>'
                }
            ]
        },
        {
            title: '文本标签',
            items: [
                {
                    title: '标题标签',
                    description: 'h1-h6 标题层级',
                    code: '<h1>一级标题</h1>\n<h2>二级标题</h2>\n<h3>三级标题</h3>\n<h4>四级标题</h4>\n<h5>五级标题</h5>\n<h6>六级标题</h6>'
                },
                {
                    title: '段落和文本',
                    description: '段落和文本格式化',
                    code: '<p>这是一个段落</p>\n<br> <!-- 换行 -->\n<hr> <!-- 水平线 -->\n<strong>粗体文本</strong>\n<em>斜体文本</em>\n<mark>高亮文本</mark>\n<small>小号文本</small>'
                },
                {
                    title: '引用和代码',
                    description: '引用和代码显示',
                    code: '<blockquote>这是一个引用块</blockquote>\n<q>这是一个行内引用</q>\n<code>行内代码</code>\n<pre><code>\n代码块\n多行代码\n</code></pre>'
                }
            ]
        },
        {
            title: '链接和媒体',
            items: [
                {
                    title: '链接',
                    description: '超链接标签',
                    code: '<a href="https://example.com">外部链接</a>\n<a href="#section1">页面内锚点</a>\n<a href="mailto:email@example.com">邮件链接</a>\n<a href="tel:+1234567890">电话链接</a>\n<a href="page.html" target="_blank">新窗口打开</a>'
                },
                {
                    title: '图片',
                    description: '图片标签',
                    code: '<img src="image.jpg" alt="图片描述" width="300" height="200">\n<img src="image.jpg" alt="响应式图片" style="max-width: 100%; height: auto;">\n\n<!-- 响应式图片 -->\n<picture>\n    <source media="(min-width: 800px)" srcset="large.jpg">\n    <source media="(min-width: 400px)" srcset="medium.jpg">\n    <img src="small.jpg" alt="响应式图片">\n</picture>'
                },
                {
                    title: '音频和视频',
                    description: '多媒体标签',
                    code: '<audio controls>\n    <source src="audio.mp3" type="audio/mpeg">\n    <source src="audio.ogg" type="audio/ogg">\n    您的浏览器不支持音频播放\n</audio>\n\n<video controls width="400" height="300">\n    <source src="video.mp4" type="video/mp4">\n    <source src="video.webm" type="video/webm">\n    您的浏览器不支持视频播放\n</video>'
                }
            ]
        },
        {
            title: '列表',
            items: [
                {
                    title: '无序列表',
                    description: '项目符号列表',
                    code: '<ul>\n    <li>列表项 1</li>\n    <li>列表项 2</li>\n    <li>列表项 3</li>\n</ul>'
                },
                {
                    title: '有序列表',
                    description: '数字编号列表',
                    code: '<ol>\n    <li>第一项</li>\n    <li>第二项</li>\n    <li>第三项</li>\n</ol>\n\n<!-- 自定义起始数字 -->\n<ol start="5">\n    <li>第五项</li>\n    <li>第六项</li>\n</ol>'
                },
                {
                    title: '描述列表',
                    description: '术语和描述列表',
                    code: '<dl>\n    <dt>术语1</dt>\n    <dd>术语1的描述</dd>\n    <dt>术语2</dt>\n    <dd>术语2的描述</dd>\n</dl>'
                }
            ]
        },
        {
            title: '表格',
            items: [
                {
                    title: '基本表格',
                    description: '表格结构',
                    code: '<table>\n    <thead>\n        <tr>\n            <th>姓名</th>\n            <th>年龄</th>\n            <th>城市</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>张三</td>\n            <td>25</td>\n            <td>北京</td>\n        </tr>\n        <tr>\n            <td>李四</td>\n            <td>30</td>\n            <td>上海</td>\n        </tr>\n    </tbody>\n</table>'
                },
                {
                    title: '表格合并',
                    description: '单元格合并',
                    code: '<table>\n    <tr>\n        <td colspan="2">跨两列的单元格</td>\n        <td>普通单元格</td>\n    </tr>\n    <tr>\n        <td rowspan="2">跨两行的单元格</td>\n        <td>单元格1</td>\n        <td>单元格2</td>\n    </tr>\n    <tr>\n        <td>单元格3</td>\n        <td>单元格4</td>\n    </tr>\n</table>'
                }
            ]
        },
        {
            title: '表单',
            items: [
                {
                    title: '基本表单',
                    description: '表单结构',
                    code: '<form action="/submit" method="post">\n    <label for="name">姓名:</label>\n    <input type="text" id="name" name="name" required>\n    \n    <label for="email">邮箱:</label>\n    <input type="email" id="email" name="email" required>\n    \n    <button type="submit">提交</button>\n</form>'
                },
                {
                    title: '输入类型',
                    description: '各种输入控件',
                    code: '<input type="text" placeholder="文本输入">\n<input type="password" placeholder="密码">\n<input type="email" placeholder="邮箱">\n<input type="number" min="1" max="100">\n<input type="date">\n<input type="time">\n<input type="file" accept=".jpg,.png,.pdf">\n<input type="checkbox" id="agree">\n<input type="radio" name="gender" value="male">\n<input type="range" min="0" max="100" value="50">'
                },
                {
                    title: '选择控件',
                    description: '下拉框和文本域',
                    code: '<select name="city">\n    <option value="">请选择城市</option>\n    <option value="beijing">北京</option>\n    <option value="shanghai">上海</option>\n    <option value="guangzhou">广州</option>\n</select>\n\n<textarea name="message" rows="4" cols="50" placeholder="请输入消息"></textarea>'
                }
            ]
        },
        {
            title: '语义化标签',
            items: [
                {
                    title: 'HTML5 语义标签',
                    description: '页面结构语义化',
                    code: '<header>页面头部</header>\n<nav>导航菜单</nav>\n<main>\n    <article>\n        <header>文章头部</header>\n        <section>文章章节</section>\n        <aside>侧边栏</aside>\n    </article>\n</main>\n<footer>页面底部</footer>'
                },
                {
                    title: '其他语义标签',
                    description: '更多语义化元素',
                    code: '<figure>\n    <img src="chart.png" alt="销售图表">\n    <figcaption>2023年销售数据图表</figcaption>\n</figure>\n\n<details>\n    <summary>点击展开详情</summary>\n    <p>这里是详细内容...</p>\n</details>\n\n<time datetime="2023-12-25">2023年12月25日</time>'
                }
            ]
        },
        {
            title: '全局属性',
            items: [
                {
                    title: '常用属性',
                    description: '通用HTML属性',
                    code: '<div id="unique-id" class="css-class another-class">\n    内容\n</div>\n\n<p title="鼠标悬停提示">悬停查看提示</p>\n\n<div style="color: red; font-size: 16px;">内联样式</div>\n\n<span data-user-id="123" data-role="admin">自定义数据属性</span>'
                },
                {
                    title: '可访问性属性',
                    description: '无障碍访问属性',
                    code: '<img src="logo.png" alt="公司标志">\n\n<button aria-label="关闭对话框">×</button>\n\n<div role="button" tabindex="0">可聚焦的div</div>\n\n<label for="username">用户名:</label>\n<input type="text" id="username" aria-describedby="username-help">\n<div id="username-help">请输入您的用户名</div>'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HTML_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.HTML_CHEATSHEET = HTML_CHEATSHEET;
}