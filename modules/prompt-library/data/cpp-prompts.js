/**
 * C++编程语言专用Prompt数据
 * 包含C++系统级开发中最常用的提示词模板
 */

var CPP_PROMPTS = [
    {
        id: 'cpp-class-generator',
        title: 'C++类生成器',
        description: '生成标准C++类，支持构造函数、析构函数、拷贝构造和移动语义',
        category: 'code-generation',
        language: 'cpp',
        difficulty: '中级',
        tags: ['C++', '类设计', 'RAII', '移动语义'],
        prompt: "6K+35L2g5biu5oiR55Sf5oiQ5LiA5LiqQysr6K+t6KGo5qCH5YeG55qE57G75a6a5LmJ77yM6KaB5rGC5aaC5LiL77yaCgoqKuWKn+iDvemcgOaxgu+8mioqClvmj4/ov7DnlKjmiLfnmoTnsbvlkI3np7BdCgoqKuWunueOsOimgeaxgu+8mioqCjEuIOWunueOsOaehOmAoOWHveaVsOOAgeaehOmAoOWHveaVsOOAgeaLt+i0neaehOmAoOWHveaVsOWSjOenu+WKqOaehOmAoOWHveaVsAoyLiDlrp7njrDmi7/otJ3mnoTpgKDlh73mlbDlkozmi7/otJ3otYvlgLzmk43kvZwKMy4g5a6e546w6YeN6L295a6a5LmJ5Ye95pWw5ZKM6L+Q566X56ym6YeN6L295a6a5LmJ5Ye95pWwCjQuIOWunueOsOaIkOWRmOWHveaVsOWSjOi/kOeul+WKn+iDvQo1LiDlrp7njrDlhazmnInmiJDlkZjlh73mlbDlkozlhazmnInotYvlgLzlh73mlbAKNi4g5pSv5oyBUkFJSeWOn+WImOWSjOi1hOa6kOeuoeeQhgo3LiDlrp7njrDlvILluLjlpITnkIblkozlhajlsYDlvILluLjlpITnkIYKOC4g5pSv5oyBc21hcnRfcHRy5ZKMdW5pcXVlX3B0cuetieaZuuiDveaMh+mSiAo5LiDmj5DkvpvlpJrnur/nqIvmlK/mjIEKCioq5L2/55So56S65L6LKioKYGBgY3BwCmNsYXNzIE15Q2xhc3MgewpwdWJsaWM6CiAgICAvLyDpu5jorqTmnoTpgKDlh73mlbAKICAgIE15Q2xhc3MoKTsKICAgIC8vIOWPguaVsOaehOmAoOWHveaVsAogICAgZXhwbGljaXQgTXlDbGFzcyhpbnQgdmFsdWUpOwogICAgCiAgICAvLyDmi7/otJ3mnoTpgKDlh73mlbAKICAgIE15Q2xhc3MoY29uc3QgTXlDbGFzcyYgb3RoZXIpOwogICAgTXlDbGFzcyYgb3BlcmF0b3I9KGNvbnN0IE15Q2xhc3MmIG90aGVyKTsKICAgIAogICAgLy8g56e75Yqo5p6E6YCg5Ye95pWwCiAgICBNeUNsYXNzKE15Q2xhc3MmJiBvdGhlcikgbm9leGNlcHQ7CiAgICBNeUNsYXNzJiBvcGVyYXRvcj0oTXlDbGFzcyYmIG90aGVyKSBub2V4Y2VwdDsKICAgIAogICAgLy8g5p6E6YCg5Ye95pWwCiAgICB+TXlDbGFzcygpOwogICAgCnByaXZhdGU6CiAgICBpbnQqIGRhdGE7CiAgICBzaXplX3Qgc2l6ZTsKfTsKYGBg",
        examples: [
            {
                title: 'C++类设计示例',
                code: "I2luY2x1ZGUgPGlvc3RyZWFtPgojaW5jbHVkZSA8bWVtb3J5PgojaW5jbHVkZSA8dXRpbGl0eT4KCmNsYXNzIFJlc291cmNlTWFuYWdlciB7CnByaXZhdGU6CiAgICBpbnQqIGRhdGE7CiAgICBzaXplX3Qgc2l6ZTsKCnB1YmxpYzoKICAgIC8vIOm7mOiupOaehOmAoOWHveaVsAogICAgUmVzb3VyY2VNYW5hZ2VyKCkgOiBkYXRhKG51bGxwdHIpLCBzaXplKDApIHsKICAgICAgICBzdGQ6OmNvdXQgPDwgIuWIm+W7uuS6huWvueixoSAiIDw8IHRoaXMgPDwgc3RkOjplbmRsOwogICAgfQoKICAgIC8vIOWPguaVsOaehOmAoOWHveaVsAogICAgZXhwbGljaXQgUmVzb3VyY2VNYW5hZ2VyKHNpemVfdCBzKSA6IHNpemUocykgewogICAgICAgIGRhdGEgPSBuZXcgaW50W3NpemVdOwogICAgICAgIHN0ZDo6Y291dCA8PCAi5Yib5bu65LqG5a+56LGhICIgPDwgdGhpcyA8PCAiLCDlpKflsI/vvJoiIDw8IHNpemUgPDwgc3RkOjplbmRsOwogICAgfQoKICAgIC8vIOaehOmAoOWHveaVsAogICAgflJlc291cmNlTWFuYWdlcigpIHsKICAgICAgICBkZWxldGVbXSBkYXRhOwogICAgICAgIHN0ZDo6Y291dCA8PCAi6ZSA5q+B5LqG5a+56LGhICIgPDwgdGhpcyA8PCAiLCDlpKflsI/vvJoiIDw8IHNpemUgPDwgc3RkOjplbmRsOwogICAgfQp9Ow=="
            }
        ]
    },
    {
        id: 'cpp-stl-algorithms',
        title: 'C++ STL算法生成器',
        description: '生成C++ STL算法代码，支持容器操作、迭代器和函数对象',
        category: 'code-generation',
        language: 'cpp',
        difficulty: '中级',
        tags: ['STL', '算法', '容器', '迭代器'],
        prompt: "6K+35L2g5biu5oiR55Sf5oiQ5LiA5LiqQysrIFNUTOeul+azleS7o+egge+8jOimgeaxguWmguS4i++8mgoKKirlip/og73pnIDmsYLvvJoqKgpb5o+P6L+w55So5oi35omA6ZyA55qEU1RM566X5rOV5ZKM5a655Zmo5pON5L2cXQoKKirlrp7njrDnmoTlip/og73vvJoqKgoxLiDlrp7njrDmlbDmja7nu5/orqHjgIHmjpLluo/jgIHmn6Xmib7jgIHnrZvpgInmk43kvZwKMi4g5pSv5oyBdmVjdG9y44CBbGlzdOOAgWRlcXVl44CBc2V044CBbWFw562J5a655ZmoCjMuIOWunueOsOi/reS7o+WZqOOAgeeUn+aIkOWZqOOAgeWHveaVsOWvueixoeaTjeS9nAo0LiDlrp7njrDnrZvpgInlkozmlbDmja7lpITnkIbmk43kvZwKNS4g5pSv5oyBbGFtYmRh6KGo6L6+5byP5ZKM5Ye95pWw5a+56LGhCjYuIOWunueOsOaAp+iDveS8mOWMluWSjOW5tuWPkeaTjeS9nAo3LiDmj5DkvpvlpJrnur/nqIvmlK/mjIEKOC4g5L2/55So5LiA6Ie055qE5Luj56CB57uT5p6ECjkuIOWunueOsOW8guW4uOWkhOeQhuWSjOWFqOWxgOW8guW4uOWkhOeQhgoKKirkvb/nlKjnpLrkvosqKgpgYGBjcHAKI2luY2x1ZGUgPGFsZ29yaXRobT4KI2luY2x1ZGUgPHZlY3Rvcj4KI2luY2x1ZGUgPGlvc3RyZWFtPgoKaW50IG1haW4oKSB7CiAgICBzdGQ6OnZlY3RvcjxpbnQ+IHZlYyA9IHsxLCAyLCAzLCA0LCA1fTsKICAgIAogICAgLy8g5L2/55SoU1RM566X5rOVCiAgICBzdGQ6OmZvcl9lYWNoKHZlYy5iZWdpbigpLCB2ZWMuZW5kKCksIFtdKGludCBuKSB7CiAgICAgICAgc3RkOjpjb3V0IDw8IG4gPDwgIiAiOwogICAgfSk7CiAgICAKICAgIHJldHVybiAwOwp9CmBgYA==",
        examples: [
            {
                title: 'C++ STL算法示例',
                code: "I2luY2x1ZGUgPGFsZ29yaXRobT4KI2luY2x1ZGUgPHZlY3Rvcj4KI2luY2x1ZGUgPGlvc3RyZWFtPgojaW5jbHVkZSA8bnVtZXJpYz4KI2luY2x1ZGUgPGZ1bmN0aW9uYWw+CgppbnQgbWFpbigpIHsKICAgIHN0ZDo6dmVjdG9yPGludD4gdmVjID0gezEsIDIsIDMsIDQsIDV9OwoKICAgIC8vIOmBjeWOhue7j+WFuOe0oAogICAgc3RkOjpmb3JfZWFjaCh2ZWMuYmVnaW4oKSwgdmVjLmVuZCgpLCBbXShpbnQgbikgewogICAgICAgIHN0ZDo6Y291dCA8PCBuIDw8ICIgIjsKICAgIH0pOwogICAgc3RkOjpjb3V0IDw8IHN0ZDo6ZW5kbDsKCiAgICAvLyDmn6Xmib7lhYPntKAKICAgIGF1dG8gaXQgPSBzdGQ6OmZpbmQodmVjLmJlZ2luKCksIHZlYy5lbmQoKSwgMyk7CiAgICBpZiAoaXQgIT0gdmVjLmVuZCgpKSB7CiAgICAgICAgc3RkOjpjb3V0IDw8ICLmib7liLDlhYPntKAzIiA8PCBzdGQ6OmVuZGw7CiAgICB9CgogICAgLy8g5o6S5bqPCiAgICBzdGQ6OnNvcnQodmVjLmJlZ2luKCksIHZlYy5lbmQoKSwgc3RkOjpncmVhdGVyPGludD4oKSk7CgogICAgLy8g57Sv6K6hCiAgICBpbnQgc3VtID0gc3RkOjphY2N1bXVsYXRlKHZlYy5iZWdpbigpLCB2ZWMuZW5kKCksIDApOwogICAgc3RkOjpjb3V0IDw8ICLmgLvlkozvvJoiIDw8IHN1bSA8PCBzdGQ6OmVuZGw7CgogICAgcmV0dXJuIDA7Cn0="
            }
        ]
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CPP_PROMPTS;
}