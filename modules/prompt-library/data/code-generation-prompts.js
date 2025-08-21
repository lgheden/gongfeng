/**
 * 代码生成类Prompt数据
 * 包含各种编程语言的代码生成相关Prompt模板
 */

var CODE_GENERATION_PROMPTS = [
    // Python通用提示词
    {
        id: 'python-class-generator',
        title: 'Python类生成器',
        description: '生成符合PEP8规范的Python类，包含完整的方法和文档字符串',
        category: 'code-generation',
        language: 'python',
        difficulty: '中级',
        tags: ['类设计', 'PEP8', '面向对象'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqUHl0aG9u57G777yM6KaB5rGC5aaC5LiL77yaCgoqKuWKn+iDvemcgOaxgu+8mioqClvlnKjov5nph4zmj4/ov7DnsbvnmoTlhbfkvZPlip/og71dCgoqKuexu+iuvuiuoeimgeaxgu+8mioqCjEuIOmBteW+qlBFUDjlkb3lkI3op4TojIMKMi4g5YyF5ZCr5a6M5pW055qEZG9jc3RyaW5n5paH5qGjCjMuIOWunueOsF9faW5pdF9f44CBX19zdHJfX+OAgV9fcmVwcl9f562J6a2U5rOV5pa55rOVCjQuIOa3u+WKoOWxnuaAp+mqjOivgeWSjOexu+Wei+aPkOekugo1LiDljIXlkKvljZXlhYPmtYvor5XnpLrkvosKNi4g5L2/55SoZGF0YWNsYXNz6KOF6aWw5Zmo77yI5aaC6YCC55So77yJCgoqKui+k+WHuuagvOW8j++8mioqCi0g5a6M5pW055qE57G75a6a5LmJCi0g5L2/55So56S65L6LCi0g566A5Y2V55qE5Y2V5YWD5rWL6K+V",
        examples: [
            {
                title: 'Python类定义示例',
                code: "ZnJvbSBkYXRhY2xhc3NlcyBpbXBvcnQgZGF0YWNsYXNzCmZyb20gdHlwaW5nIGltcG9ydCBPcHRpb25hbCwgTGlzdAoKQGRhdGFjbGFzcwpjbGFzcyBFeGFtcGxlQ2xhc3M6CiAgICAiIiLnpLrkvovnsbvnmoTmlofmoaPlrZfnrKbkuLIiIiIKICAgIG5hbWU6IHN0cgogICAgdmFsdWU6IGludCA9IDAKICAgIAogICAgZGVmIF9fcG9zdF9pbml0X18oc2VsZik6CiAgICAgICAgaWYgc2VsZi52YWx1ZSA8IDA6CiAgICAgICAgICAgIHJhaXNlIFZhbHVlRXJyb3IoIlZhbHVlIG11c3QgYmUgbm9uLW5lZ2F0aXZlIikKICAgIAogICAgZGVmIHByb2Nlc3Moc2VsZikgLT4gc3RyOgogICAgICAgICIiIuWkhOeQhuaVsOaNruW5tui/lOWbnue7k+aenCIiIgogICAgICAgIHJldHVybiBmIlByb2Nlc3Npbmcge3NlbGYubmFtZX0gd2l0aCB2YWx1ZSB7c2VsZi52YWx1ZX0i"
            }
        ]
    },
    {
        id: 'python-data-processor',
        title: 'Python数据处理器',
        description: '生成高效的数据处理函数，支持pandas、numpy等常用库',
        category: 'code-generation',
        language: 'python',
        difficulty: '高级',
        tags: ['数据处理', 'pandas', 'numpy'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqUHl0aG9u5pWw5o2u5aSE55CG5Ye95pWw77yM6KaB5rGC5aaC5LiL77yaCgoqKuaVsOaNruWkhOeQhumcgOaxgu+8mioqClvmj4/ov7DlhbfkvZPnmoTmlbDmja7lpITnkIbku7vliqFdCgoqKuaKgOacr+imgeaxgu+8mioqCjEuIOS9v+eUqHBhbmRhcy9udW1weei/m+ihjOmrmOaViOWkhOeQhgoyLiDljIXlkKvmlbDmja7pqozor4HlkozmuIXmtJcKMy4g5re75Yqg6ZSZ6K+v5aSE55CG5ZKM5pel5b+X6K6w5b2VCjQuIOaUr+aMgeWkmuenjeaVsOaNruagvOW8j+i+k+WFpQo1LiDmj5Dkvpvov5vluqbmmL7npLrvvIjlpITnkIblpKfmlbDmja7ml7bvvIkKNi4g5YyF5ZCr5oCn6IO95LyY5YyWCgoqKui+k+WHuuimgeaxgu+8mioqCi0g5a6M5pW055qE5aSE55CG5Ye95pWwCi0g5pWw5o2u6aqM6K+B6YC76L6RCi0g5L2/55So56S65L6L5ZKM5rWL6K+V5pWw5o2u",
        examples: [
            {
                title: 'Python数据处理函数示例',
                code: "aW1wb3J0IHBhbmRhcyBhcyBwZAppbXBvcnQgbnVtcHkgYXMgbnAKZnJvbSB0eXBpbmcgaW1wb3J0IFVuaW9uLCBEaWN0LCBBbnkKaW1wb3J0IGxvZ2dpbmcKCmRlZiBwcm9jZXNzX2RhdGEoZGF0YTogVW5pb25bcGQuRGF0YUZyYW1lLCBzdHJdLCAKICAgICAgICAgICAgICAgIGNvbmZpZzogRGljdFtzdHIsIEFueV0gPSBOb25lKSAtPiBwZC5EYXRhRnJhbWU6CiAgICAiIiLpgJrnlKjmlbDmja7lpITnkIblh73mlbAiIiIKICAgIGlmIGlzaW5zdGFuY2UoZGF0YSwgc3RyKToKICAgICAgICBkYXRhID0gcGQucmVhZF9jc3YoZGF0YSkKICAgIAogICAgIyDmlbDmja7pqozor4EKICAgIGlmIGRhdGEuZW1wdHk6CiAgICAgICAgcmFpc2UgVmFsdWVFcnJvcigiSW5wdXQgZGF0YSBpcyBlbXB0eSIpCiAgICAKICAgICMg5pWw5o2u5riF5rSX5ZKM5aSE55CGCiAgICBwcm9jZXNzZWRfZGF0YSA9IGRhdGEuY29weSgpCiAgICAKICAgIHJldHVybiBwcm9jZXNzZWRfZGF0YQ=="
            }
        ]
    },
    // Java通用提示词
    {
        id: 'java-class-generator',
        title: 'Java类生成器',
        description: '生成标准的Java类，包含getter/setter、构造函数和常用方法',
        category: 'code-generation',
        language: 'java',
        difficulty: '中级',
        tags: ['类设计', 'JavaBean', '面向对象'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqSmF2Yeexu++8jOimgeaxguWmguS4i++8mgoKKirlip/og73pnIDmsYLvvJoqKgpb5Zyo6L+Z6YeM5o+P6L+w57G755qE5YW35L2T5Yqf6IO9XQoKKirnsbvorr7orqHopoHmsYLvvJoqKgoxLiDpgbXlvqpKYXZh5ZG95ZCN6KeE6IyDCjIuIOWMheWQq+WujOaVtOeahEphdmFEb2Pms6jph4oKMy4g5a6e546wZ2V0dGVy5ZKMc2V0dGVy5pa55rOVCjQuIOmHjeWGmWVxdWFscygp44CBaGFzaENvZGUoKeWSjHRvU3RyaW5nKCnmlrnms5UKNS4g5re75Yqg5Y+C5pWw6aqM6K+BCjYuIOS9v+eUqOmAguW9k+eahOiuv+mXruS/rumlsOespgo3LiDmlK/mjIFCdWlsZGVy5qih5byP77yI5aaC6YCC55So77yJCgoqKui+k+WHuuagvOW8j++8mioqCi0g5a6M5pW055qE57G75a6a5LmJCi0g5L2/55So56S65L6LCi0g5Y2V5YWD5rWL6K+V56S65L6L",
        examples: [
            {
                title: 'Java类定义示例',
                code: "LyoqCiAqIOekuuS+i0phdmHnsbsKICogQGF1dGhvciBHZW5lcmF0ZWQKICogQHZlcnNpb24gMS4wCiAqLwpwdWJsaWMgY2xhc3MgRXhhbXBsZUNsYXNzIHsKICAgIHByaXZhdGUgU3RyaW5nIG5hbWU7CiAgICBwcml2YXRlIGludCB2YWx1ZTsKICAgIAogICAgcHVibGljIEV4YW1wbGVDbGFzcygpIHt9CiAgICAKICAgIHB1YmxpYyBFeGFtcGxlQ2xhc3MoU3RyaW5nIG5hbWUsIGludCB2YWx1ZSkgewogICAgICAgIHRoaXMubmFtZSA9IG5hbWU7CiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOwogICAgfQogICAgCiAgICAvLyBHZXR0ZXJzIGFuZCBTZXR0ZXJzCiAgICBwdWJsaWMgU3RyaW5nIGdldE5hbWUoKSB7IHJldHVybiBuYW1lOyB9CiAgICBwdWJsaWMgdm9pZCBzZXROYW1lKFN0cmluZyBuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWU7IH0KICAgIAogICAgQE92ZXJyaWRlCiAgICBwdWJsaWMgU3RyaW5nIHRvU3RyaW5nKCkgewogICAgICAgIHJldHVybiAiRXhhbXBsZUNsYXNze25hbWU9JyIgKyBuYW1lICsgIicsIHZhbHVlPSIgKyB2YWx1ZSArICJ9IjsKICAgIH0KfQ=="
            }
        ]
    },
    {
        id: 'java-spring-controller',
        title: 'Spring Boot控制器生成器',
        description: '生成标准的Spring Boot REST控制器，包含CRUD操作',
        category: 'code-generation',
        language: 'java',
        difficulty: '高级',
        tags: ['Spring Boot', 'REST API', 'Controller'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqU3ByaW5nIEJvb3QgUkVTVOaOp+WItuWZqO+8jOimgeaxguWmguS4i++8mgoKKipBUEnpnIDmsYLvvJoqKgpb5o+P6L+w5YW35L2T55qEQVBJ5Yqf6IO9XQoKKirmioDmnK/opoHmsYLvvJoqKgoxLiDkvb/nlKhTcHJpbmcgQm9vdOazqOinowoyLiDljIXlkKvlrozmlbTnmoRDUlVE5pON5L2cCjMuIOa3u+WKoOWPguaVsOmqjOivgeWSjOW8guW4uOWkhOeQhgo0LiDkvb/nlKhSZXNwb25zZUVudGl0eei/lOWbnue7k+aenAo1LiDmt7vliqBTd2FnZ2Vy5paH5qGj5rOo6KejCjYuIOWMheWQq+aXpeW/l+iusOW9lQo3LiDmlK/mjIHliIbpobXlkozmjpLluo8KCioq6L6T5Ye66KaB5rGC77yaKioKLSDlrozmlbTnmoRDb250cm9sbGVy57G7Ci0gRFRP57G75a6a5LmJCi0g5byC5bi45aSE55CG5Zmo",
        examples: [
            {
                title: 'Spring Boot控制器示例',
                code: "QFJlc3RDb250cm9sbGVyCkBSZXF1ZXN0TWFwcGluZygiL2FwaS92MS9leGFtcGxlcyIpCkBTbGY0agpwdWJsaWMgY2xhc3MgRXhhbXBsZUNvbnRyb2xsZXIgewogICAgCiAgICBAQXV0b3dpcmVkCiAgICBwcml2YXRlIEV4YW1wbGVTZXJ2aWNlIGV4YW1wbGVTZXJ2aWNlOwogICAgCiAgICBAR2V0TWFwcGluZwogICAgcHVibGljIFJlc3BvbnNlRW50aXR5PExpc3Q8RXhhbXBsZURUTz4+IGdldEFsbEV4YW1wbGVzKCkgewogICAgICAgIExpc3Q8RXhhbXBsZURUTz4gZXhhbXBsZXMgPSBleGFtcGxlU2VydmljZS5maW5kQWxsKCk7CiAgICAgICAgcmV0dXJuIFJlc3BvbnNlRW50aXR5Lm9rKGV4YW1wbGVzKTsKICAgIH0KICAgIAogICAgQFBvc3RNYXBwaW5nCiAgICBwdWJsaWMgUmVzcG9uc2VFbnRpdHk8RXhhbXBsZURUTz4gY3JlYXRlRXhhbXBsZShAVmFsaWQgQFJlcXVlc3RCb2R5IEV4YW1wbGVEVE8gZHRvKSB7CiAgICAgICAgRXhhbXBsZURUTyBjcmVhdGVkID0gZXhhbXBsZVNlcnZpY2UuY3JlYXRlKGR0byk7CiAgICAgICAgcmV0dXJuIFJlc3BvbnNlRW50aXR5LnN0YXR1cyhIdHRwU3RhdHVzLkNSRUFURUQpLmJvZHkoY3JlYXRlZCk7CiAgICB9Cn0="
            }
        ]
    },
    {
        id: 'js-function-generator',
        title: 'JavaScript函数生成器',
        description: '根据需求生成高质量的JavaScript函数，包含错误处理和类型检查',
        category: 'code-generation',
        language: 'javascript',
        difficulty: '中级',
        tags: ['函数', '错误处理', 'ES6+'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqSmF2YVNjcmlwdOWHveaVsO+8jOimgeaxguWmguS4i++8mgoKKirlip/og73pnIDmsYLvvJoqKgpb5Zyo6L+Z6YeM5o+P6L+w5YW35L2T5Yqf6IO96ZyA5rGCXQoKKirlh73mlbDopoHmsYLvvJoqKgoxLiDkvb/nlKjnjrDku6NFUzYr6K+t5rOVCjIuIOWMheWQq+WujOaVtOeahOWPguaVsOmqjOivgQozLiDmt7vliqDpgILlvZPnmoTplJnor6/lpITnkIYKNC4g5o+Q5L6b6K+m57uG55qESlNEb2Pms6jph4oKNS4g5pSv5oyB5byC5q2l5pON5L2c77yI5aaC6ZyA6KaB77yJCjYuIOmBteW+quWHveaVsOW8j+e8lueoi+WOn+WImQoKKirovpPlh7rmoLzlvI/vvJoqKgotIOWujOaVtOeahOWHveaVsOS7o+eggQotIOS9v+eUqOekuuS+iwotIOWNleWFg+a1i+ivleeUqOS+iwotIOaAp+iDveS8mOWMluW7uuiurg==",
        examples: [
            {
                title: '数组去重函数示例',
                code: "LyoqCiAqIOaVsOe7hOWOu+mHjeWHveaVsO+8jOaUr+aMgeWvueixoeaVsOe7hOaMieaMh+WumumUruWOu+mHjQogKiBAcGFyYW0ge0FycmF5fSBhcnIgLSDpnIDopoHljrvph43nmoTmlbDnu4QKICogQHBhcmFtIHtzdHJpbmd8RnVuY3Rpb259IFtrZXldIC0g5a+56LGh5pWw57uE55qE5Y676YeN6ZSu5oiW6Ieq5a6a5LmJ5q+U6L6D5Ye95pWwCiAqIEByZXR1cm5zIHtBcnJheX0g5Y676YeN5ZCO55qE5pWw57uECiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5b2T5Y+C5pWw57G75Z6L5LiN5q2j56Gu5pe25oqb5Ye66ZSZ6K+vCiAqLwpmdW5jdGlvbiB1bmlxdWVBcnJheShhcnIsIGtleSA9IG51bGwpIHsKICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7CiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcign56ys5LiA5Liq5Y+C5pWw5b+F6aG75piv5pWw57uEJyk7CiAgICB9CiAgICAKICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSByZXR1cm4gW107CiAgICAKICAgIC8vIOWfuuacrOexu+Wei+aVsOe7hOWOu+mHjQogICAgaWYgKGtleSA9PT0gbnVsbCkgewogICAgICAgIHJldHVybiBbLi4ubmV3IFNldChhcnIpXTsKICAgIH0KICAgIAogICAgLy8g5a+56LGh5pWw57uE5oyJ6ZSu5Y676YeNCiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHsKICAgICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpOwogICAgICAgIHJldHVybiBhcnIuZmlsdGVyKGl0ZW0gPT4gewogICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW0/LltrZXldOwogICAgICAgICAgICBpZiAoc2Vlbi5oYXModmFsdWUpKSByZXR1cm4gZmFsc2U7CiAgICAgICAgICAgIHNlZW4uYWRkKHZhbHVlKTsKICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgfSk7CiAgICB9CiAgICAKICAgIC8vIOiHquWumuS5ieavlOi+g+WHveaVsAogICAgaWYgKHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpIHsKICAgICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpOwogICAgICAgIHJldHVybiBhcnIuZmlsdGVyKGl0ZW0gPT4gewogICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGtleShpdGVtKTsKICAgICAgICAgICAgaWYgKHNlZW4uaGFzKHZhbHVlKSkgcmV0dXJuIGZhbHNlOwogICAgICAgICAgICBzZWVuLmFkZCh2YWx1ZSk7CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgIH0pOwogICAgfQogICAgCiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdrZXnlj4LmlbDlv4XpobvmmK/lrZfnrKbkuLLmiJblh73mlbAnKTsKfQoKLy8g5L2/55So56S65L6LCmNvbnN0IG51bWJlcnMgPSBbMSwgMiwgMiwgMywgNCwgNCwgNV07CmNvbnNvbGUubG9nKHVuaXF1ZUFycmF5KG51bWJlcnMpKTsgLy8gWzEsIDIsIDMsIDQsIDVdCgpjb25zdCB1c2VycyA9IFsKICAgIHsgaWQ6IDEsIG5hbWU6ICdBbGljZScgfSwKICAgIHsgaWQ6IDIsIG5hbWU6ICdCb2InIH0sCiAgICB7IGlkOiAxLCBuYW1lOiAnQWxpY2UnIH0KXTsKY29uc29sZS5sb2codW5pcXVlQXJyYXkodXNlcnMsICdpZCcpKTsgLy8gW3sgaWQ6IDEsIG5hbWU6ICdBbGljZScgfSwgeyBpZDogMiwgbmFtZTogJ0JvYicgfV0="
            }
        ]
    },
    {
        id: 'react-component-generator',
        title: 'React组件生成器',
        description: '生成现代React函数组件，包含hooks和TypeScript支持',
        category: 'code-generation',
        language: 'javascript',
        difficulty: '高级',
        tags: ['React', 'Hooks', 'TypeScript'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqUmVhY3Tnu4Tku7bvvIzopoHmsYLlpoLkuIvvvJoKCioq57uE5Lu26ZyA5rGC77yaKioKW+aPj+i/sOe7hOS7tueahOWFt+S9k+WKn+iDvV0KCioq5oqA5pyv6KaB5rGC77yaKioKMS4g5L2/55SoUmVhY3Tlh73mlbDnu4Tku7blkoxIb29rcwoyLiDljIXlkKtUeXBlU2NyaXB057G75Z6L5a6a5LmJCjMuIOa3u+WKoFByb3BUeXBlc+aIluaOpeWPo+mqjOivgQo0LiDkvb/nlKjnjrDku6NDU1MtaW4tSlPmiJZDU1PmqKHlnZcKNS4g5YyF5ZCr6ZSZ6K+v6L6555WM5aSE55CGCjYuIOa3u+WKoOWPr+iuv+mXruaAp+aUr+aMgQo3LiDljIXlkKvljZXlhYPmtYvor5UKCioq6L6T5Ye66KaB5rGC77yaKioKLSDlrozmlbTnmoTnu4Tku7bku6PnoIEKLSDmoLflvI/mlofku7YKLSDkvb/nlKjnpLrkvos=",
        examples: [
            {
                title: 'React组件示例',
                code: "aW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7CmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7CgppbnRlcmZhY2UgRXhhbXBsZUNvbXBvbmVudFByb3BzIHsKICB0aXRsZTogc3RyaW5nOwogIG9uQWN0aW9uPzogKGRhdGE6IGFueSkgPT4gdm9pZDsKfQoKY29uc3QgRXhhbXBsZUNvbXBvbmVudDogUmVhY3QuRkM8RXhhbXBsZUNvbXBvbmVudFByb3BzPiA9ICh7IHRpdGxlLCBvbkFjdGlvbiB9KSA9PiB7CiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSgnJyk7CiAgCiAgdXNlRWZmZWN0KCgpID0+IHsKICAgIC8vIOe7hOS7tumAu+i+kQogIH0sIFtdKTsKICAKICByZXR1cm4gKAogICAgPGRpdiBjbGFzc05hbWU9ImV4YW1wbGUtY29tcG9uZW50Ij4KICAgICAgPGgyPnt0aXRsZX08L2gyPgogICAgICB7Lyog57uE5Lu25YaF5a65ICovfQogICAgPC9kaXY+CiAgKTsKfTsKCkV4YW1wbGVDb21wb25lbnQucHJvcFR5cGVzID0gewogIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsCiAgb25BY3Rpb246IFByb3BUeXBlcy5mdW5jCn07CgpleHBvcnQgZGVmYXVsdCBFeGFtcGxlQ29tcG9uZW50Ow=="
            }
        ]
    },
    {
        id: 'typescript-interface-generator',
        title: 'TypeScript接口生成器',
        description: '生成完整的TypeScript接口和类型定义',
        category: 'code-generation',
        language: 'typescript',
        difficulty: '中级',
        tags: ['TypeScript', '接口', '类型定义'],
        prompt: "6K+35biu5oiR55Sf5oiQVHlwZVNjcmlwdOaOpeWPo+WSjOexu+Wei+WumuS5ie+8jOimgeaxguWmguS4i++8mgoKKirnsbvlnovpnIDmsYLvvJoqKgpb5o+P6L+w6ZyA6KaB5a6a5LmJ55qE5pWw5o2u57uT5p6EXQoKKirmioDmnK/opoHmsYLvvJoqKgoxLiDkvb/nlKjkuKXmoLznmoRUeXBlU2NyaXB057G75Z6LCjIuIOWMheWQq+WujOaVtOeahEpTRG9j5rOo6YeKCjMuIOaUr+aMgeazm+Wei++8iOWmgumAgueUqO+8iQo0LiDmt7vliqDlj6/pgInlsZ7mgKflkozpu5jorqTlgLwKNS4g5L2/55So6IGU5ZCI57G75Z6L5ZKM5Lqk5Y+J57G75Z6LCjYuIOWMheWQq+exu+Wei+WuiOWNq+WHveaVsAo3LiDmj5Dkvpvkvb/nlKjnpLrkvosKCioq6L6T5Ye66KaB5rGC77yaKioKLSDlrozmlbTnmoTmjqXlj6PlrprkuYkKLSDnm7jlhbPnmoTnsbvlnovliKvlkI0KLSDnsbvlnovlrojljavlkozlt6Xlhbflh73mlbA=",
        examples: [
            {
                title: 'TypeScript接口定义示例',
                code: "LyoqCiAqIOekuuS+i+aOpeWPo+WumuS5iQogKi8KZXhwb3J0IGludGVyZmFjZSBFeGFtcGxlSW50ZXJmYWNlIHsKICBpZDogc3RyaW5nOwogIG5hbWU6IHN0cmluZzsKICB2YWx1ZT86IG51bWJlcjsKICBtZXRhZGF0YTogUmVjb3JkPHN0cmluZywgYW55PjsKfQoKLyoqCiAqIOexu+Wei+WIq+WQjQogKi8KZXhwb3J0IHR5cGUgRXhhbXBsZVN0YXR1cyA9ICdwZW5kaW5nJyB8ICdjb21wbGV0ZWQnIHwgJ2ZhaWxlZCc7CgovKioKICog5rOb5Z6L5o6l5Y+jCiAqLwpleHBvcnQgaW50ZXJmYWNlIEFwaVJlc3BvbnNlPFQ+IHsKICBkYXRhOiBUOwogIHN0YXR1czogbnVtYmVyOwogIG1lc3NhZ2U6IHN0cmluZzsKfQoKLyoqCiAqIOexu+Wei+WuiOWNq+WHveaVsAogKi8KZXhwb3J0IGZ1bmN0aW9uIGlzRXhhbXBsZUludGVyZmFjZShvYmo6IGFueSk6IG9iaiBpcyBFeGFtcGxlSW50ZXJmYWNlIHsKICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmouaWQgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBvYmoubmFtZSA9PT0gJ3N0cmluZyc7Cn0="
            }
        ]
    },
    // C#通用提示词
    {
        id: 'csharp-class-generator',
        title: 'C#类生成器',
        description: '生成标准的C#类，包含属性、方法和完整的文档',
        category: 'code-generation',
        language: 'csharp',
        difficulty: '中级',
        tags: ['类设计', '属性', '面向对象'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqQyPnsbvvvIzopoHmsYLlpoLkuIvvvJoKCioq5Yqf6IO96ZyA5rGC77yaKioKW+WcqOi/memHjOaPj+i/sOexu+eahOWFt+S9k+WKn+iDvV0KCioq57G76K6+6K6h6KaB5rGC77yaKioKMS4g6YG15b6qQyPlkb3lkI3op4TojIMKMi4g5YyF5ZCr5a6M5pW055qEWE1M5paH5qGj5rOo6YeKCjMuIOS9v+eUqOWxnuaAp+iAjOmdnuWFrOWFseWtl+autQo0LiDlrp7njrBJRXF1YXRhYmxlPFQ+5o6l5Y+j77yI5aaC6YCC55So77yJCjUuIOmHjeWGmUVxdWFsc+OAgUdldEhhc2hDb2Rl5ZKMVG9TdHJpbmfmlrnms5UKNi4g5re75Yqg5pWw5o2u6aqM6K+B5ZKM5byC5bi45aSE55CGCjcuIOaUr+aMgeW6j+WIl+WMlu+8iOWmgumcgOimge+8iQoKKirovpPlh7rmoLzlvI/vvJoqKgotIOWujOaVtOeahOexu+WumuS5iQotIOS9v+eUqOekuuS+iwotIOWNleWFg+a1i+ivleekuuS+iw==",
        examples: [
            {
                title: 'C#类定义示例',
                code: "dXNpbmcgU3lzdGVtOwp1c2luZyBTeXN0ZW0uQ29tcG9uZW50TW9kZWwuRGF0YUFubm90YXRpb25zOwoKLy8vIDxzdW1tYXJ5PgovLy8g56S65L6LQyPnsbsKLy8vIDwvc3VtbWFyeT4KcHVibGljIGNsYXNzIEV4YW1wbGVDbGFzcyA6IElFcXVhdGFibGU8RXhhbXBsZUNsYXNzPgp7CiAgICAvLy8gPHN1bW1hcnk+CiAgICAvLy8g6I635Y+W5oiW6K6+572u5ZCN56ewCiAgICAvLy8gPC9zdW1tYXJ5PgogICAgW1JlcXVpcmVkXQogICAgcHVibGljIHN0cmluZyBOYW1lIHsgZ2V0OyBzZXQ7IH0KICAgIAogICAgLy8vIDxzdW1tYXJ5PgogICAgLy8vIOiOt+WPluaIluiuvue9ruWAvAogICAgLy8vIDwvc3VtbWFyeT4KICAgIFtSYW5nZSgwLCBpbnQuTWF4VmFsdWUpXQogICAgcHVibGljIGludCBWYWx1ZSB7IGdldDsgc2V0OyB9CiAgICAKICAgIC8vLyA8c3VtbWFyeT4KICAgIC8vLyDliJ3lp4vljJZFeGFtcGxlQ2xhc3PnmoTmlrDlrp7kvosKICAgIC8vLyA8L3N1bW1hcnk+CiAgICBwdWJsaWMgRXhhbXBsZUNsYXNzKCkgeyB9CiAgICAKICAgIC8vLyA8c3VtbWFyeT4KICAgIC8vLyDliJ3lp4vljJZFeGFtcGxlQ2xhc3PnmoTmlrDlrp7kvosKICAgIC8vLyA8L3N1bW1hcnk+CiAgICAvLy8gPHBhcmFtIG5hbWU9Im5hbWUiPuWQjeensDwvcGFyYW0+CiAgICAvLy8gPHBhcmFtIG5hbWU9InZhbHVlIj7lgLw8L3BhcmFtPgogICAgcHVibGljIEV4YW1wbGVDbGFzcyhzdHJpbmcgbmFtZSwgaW50IHZhbHVlKQogICAgewogICAgICAgIE5hbWUgPSBuYW1lID8/IHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24obmFtZW9mKG5hbWUpKTsKICAgICAgICBWYWx1ZSA9IHZhbHVlOwogICAgfQogICAgCiAgICBwdWJsaWMgYm9vbCBFcXVhbHMoRXhhbXBsZUNsYXNzIG90aGVyKQogICAgewogICAgICAgIHJldHVybiBvdGhlciAhPSBudWxsICYmIE5hbWUgPT0gb3RoZXIuTmFtZSAmJiBWYWx1ZSA9PSBvdGhlci5WYWx1ZTsKICAgIH0KICAgIAogICAgcHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpCiAgICB7CiAgICAgICAgcmV0dXJuICQiRXhhbXBsZUNsYXNzIHt7IE5hbWUgPSB7TmFtZX0sIFZhbHVlID0ge1ZhbHVlfSB9fSI7CiAgICB9Cn0="
            }
        ]
    },
    {
        id: 'csharp-api-controller',
        title: 'ASP.NET Core控制器生成器',
        description: '生成标准的ASP.NET Core Web API控制器',
        category: 'code-generation',
        language: 'csharp',
        difficulty: '高级',
        tags: ['ASP.NET Core', 'Web API', 'Controller'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqQVNQLk5FVCBDb3JlIFdlYiBBUEnmjqfliLblmajvvIzopoHmsYLlpoLkuIvvvJoKCioqQVBJ6ZyA5rGC77yaKioKW+aPj+i/sOWFt+S9k+eahEFQSeWKn+iDvV0KCioq5oqA5pyv6KaB5rGC77yaKioKMS4g5L2/55SoQVNQLk5FVCBDb3Jl5bGe5oCn6Lev55SxCjIuIOWMheWQq+WujOaVtOeahENSVUTmk43kvZwKMy4g5re75Yqg5qih5Z6L6aqM6K+B5ZKM5byC5bi45aSE55CGCjQuIOS9v+eUqOS+nei1luazqOWFpQo1LiDov5Tlm57pgILlvZPnmoRIVFRQ54q25oCB56CBCjYuIOa3u+WKoFN3YWdnZXLmlofmoaPms6jop6MKNy4g5YyF5ZCr5pel5b+X6K6w5b2VCjguIOaUr+aMgeW8guatpeaTjeS9nAoKKirovpPlh7ropoHmsYLvvJoqKgotIOWujOaVtOeahENvbnRyb2xsZXLnsbsKLSBEVE/mqKHlnovlrprkuYkKLSDlvILluLjlpITnkIbkuK3pl7Tku7Y=",
        examples: [
            {
                title: 'ASP.NET Core控制器示例',
                code: "dXNpbmcgTWljcm9zb2Z0LkFzcE5ldENvcmUuTXZjOwp1c2luZyBNaWNyb3NvZnQuRXh0ZW5zaW9ucy5Mb2dnaW5nOwp1c2luZyBTeXN0ZW0uQ29tcG9uZW50TW9kZWwuRGF0YUFubm90YXRpb25zOwoKW0FwaUNvbnRyb2xsZXJdCltSb3V0ZSgiYXBpL1tjb250cm9sbGVyXSIpXQpwdWJsaWMgY2xhc3MgRXhhbXBsZUNvbnRyb2xsZXIgOiBDb250cm9sbGVyQmFzZQp7CiAgICBwcml2YXRlIHJlYWRvbmx5IElMb2dnZXI8RXhhbXBsZUNvbnRyb2xsZXI+IF9sb2dnZXI7CiAgICBwcml2YXRlIHJlYWRvbmx5IElFeGFtcGxlU2VydmljZSBfZXhhbXBsZVNlcnZpY2U7CiAgICAKICAgIHB1YmxpYyBFeGFtcGxlQ29udHJvbGxlcihJTG9nZ2VyPEV4YW1wbGVDb250cm9sbGVyPiBsb2dnZXIsIElFeGFtcGxlU2VydmljZSBleGFtcGxlU2VydmljZSkKICAgIHsKICAgICAgICBfbG9nZ2VyID0gbG9nZ2VyOwogICAgICAgIF9leGFtcGxlU2VydmljZSA9IGV4YW1wbGVTZXJ2aWNlOwogICAgfQogICAgCiAgICAvLy8gPHN1bW1hcnk+CiAgICAvLy8g6I635Y+W5omA5pyJ56S65L6LCiAgICAvLy8gPC9zdW1tYXJ5PgogICAgW0h0dHBHZXRdCiAgICBwdWJsaWMgYXN5bmMgVGFzazxBY3Rpb25SZXN1bHQ8SUVudW1lcmFibGU8RXhhbXBsZUR0bz4+PiBHZXRBbGxBc3luYygpCiAgICB7CiAgICAgICAgdHJ5CiAgICAgICAgewogICAgICAgICAgICB2YXIgZXhhbXBsZXMgPSBhd2FpdCBfZXhhbXBsZVNlcnZpY2UuR2V0QWxsQXN5bmMoKTsKICAgICAgICAgICAgcmV0dXJuIE9rKGV4YW1wbGVzKTsKICAgICAgICB9CiAgICAgICAgY2F0Y2ggKEV4Y2VwdGlvbiBleCkKICAgICAgICB7CiAgICAgICAgICAgIF9sb2dnZXIuTG9nRXJyb3IoZXgsICJFcnJvciBnZXR0aW5nIGV4YW1wbGVzIik7CiAgICAgICAgICAgIHJldHVybiBTdGF0dXNDb2RlKDUwMCwgIkludGVybmFsIHNlcnZlciBlcnJvciIpOwogICAgICAgIH0KICAgIH0KICAgIAogICAgLy8vIDxzdW1tYXJ5PgogICAgLy8vIOWIm+W7uuaWsOekuuS+iwogICAgLy8vIDwvc3VtbWFyeT4KICAgIFtIdHRwUG9zdF0KICAgIHB1YmxpYyBhc3luYyBUYXNrPEFjdGlvblJlc3VsdDxFeGFtcGxlRHRvPj4gQ3JlYXRlQXN5bmMoW0Zyb21Cb2R5XSBDcmVhdGVFeGFtcGxlRHRvIGR0bykKICAgIHsKICAgICAgICBpZiAoIU1vZGVsU3RhdGUuSXNWYWxpZCkKICAgICAgICAgICAgcmV0dXJuIEJhZFJlcXVlc3QoTW9kZWxTdGF0ZSk7CiAgICAgICAgICAgIAogICAgICAgIHZhciBjcmVhdGVkID0gYXdhaXQgX2V4YW1wbGVTZXJ2aWNlLkNyZWF0ZUFzeW5jKGR0byk7CiAgICAgICAgcmV0dXJuIENyZWF0ZWRBdEFjdGlvbihuYW1lb2YoR2V0QnlJZEFzeW5jKSwgbmV3IHsgaWQgPSBjcmVhdGVkLklkIH0sIGNyZWF0ZWQpOwogICAgfQp9"
            }
        ]
    },
    // Go通用提示词
    {
        id: 'go-struct-generator',
        title: 'Go结构体生成器',
        description: '生成标准的Go结构体，包含方法和JSON标签',
        category: 'code-generation',
        language: 'go',
        difficulty: '中级',
        tags: ['结构体', 'JSON', '方法'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqR2/nu5PmnoTkvZPvvIzopoHmsYLlpoLkuIvvvJoKCioq5Yqf6IO96ZyA5rGC77yaKioKW+WcqOi/memHjOaPj+i/sOe7k+aehOS9k+eahOWFt+S9k+WKn+iDvV0KCioq6K6+6K6h6KaB5rGC77yaKioKMS4g6YG15b6qR2/lkb3lkI3op4TojIMKMi4g5YyF5ZCr5a6M5pW055qE5rOo6YeK5paH5qGjCjMuIOa3u+WKoOmAguW9k+eahEpTT07moIfnrb4KNC4g5a6e546wU3RyaW5nKCnmlrnms5UKNS4g5re75Yqg5p6E6YCg5Ye95pWwCjYuIOWMheWQq+mqjOivgeaWueazlQo3LiDmlK/mjIHluo/liJfljJblkozlj43luo/liJfljJYKCioq6L6T5Ye65qC85byP77yaKioKLSDlrozmlbTnmoTnu5PmnoTkvZPlrprkuYkKLSDnm7jlhbPmlrnms5Xlrp7njrAKLSDkvb/nlKjnpLrkvos=",
        examples: [
            {
                title: 'Go结构体定义示例',
                code: "cGFja2FnZSBtYWluCgppbXBvcnQgKAoJImVuY29kaW5nL2pzb24iCgkiZm10IgoJImVycm9ycyIKKQoKLy8gRXhhbXBsZVN0cnVjdCDnpLrkvovnu5PmnoTkvZMKdHlwZSBFeGFtcGxlU3RydWN0IHN0cnVjdCB7CglJRCAgICBpbnQgICAgXGBqc29uOiJpZCJcYAoJTmFtZSAgc3RyaW5nIFxganNvbjoibmFtZSJcYAoJVmFsdWUgaW50ICAgIFxganNvbjoidmFsdWUiXGAKfQoKLy8gTmV3RXhhbXBsZVN0cnVjdCDliJvlu7rmlrDnmoRFeGFtcGxlU3RydWN05a6e5L6LCmZ1bmMgTmV3RXhhbXBsZVN0cnVjdChpZCBpbnQsIG5hbWUgc3RyaW5nLCB2YWx1ZSBpbnQpICpFeGFtcGxlU3RydWN0IHsKCXJldHVybiAmRXhhbXBsZVN0cnVjdHsKCQlJRDogICAgaWQsCgkJTmFtZTogIG5hbWUsCgkJVmFsdWU6IHZhbHVlLAoJfQp9CgovLyBTdHJpbmcg6L+U5Zue57uT5p6E5L2T55qE5a2X56ym5Liy6KGo56S6CmZ1bmMgKGUgKkV4YW1wbGVTdHJ1Y3QpIFN0cmluZygpIHN0cmluZyB7CglyZXR1cm4gZm10LlNwcmludGYoIkV4YW1wbGVTdHJ1Y3R7SUQ6ICVkLCBOYW1lOiAlcywgVmFsdWU6ICVkfSIsIGUuSUQsIGUuTmFtZSwgZS5WYWx1ZSkKfQoKLy8gVmFsaWRhdGUg6aqM6K+B57uT5p6E5L2T5pWw5o2uCmZ1bmMgKGUgKkV4YW1wbGVTdHJ1Y3QpIFZhbGlkYXRlKCkgZXJyb3IgewoJaWYgZS5OYW1lID09ICIiIHsKCQlyZXR1cm4gZXJyb3JzLk5ldygibmFtZSBjYW5ub3QgYmUgZW1wdHkiKQoJfQoJaWYgZS5WYWx1ZSA8IDAgewoJCXJldHVybiBlcnJvcnMuTmV3KCJ2YWx1ZSBtdXN0IGJlIG5vbi1uZWdhdGl2ZSIpCgl9CglyZXR1cm4gbmlsCn0="
            }
        ]
    },
    {
        id: 'go-http-handler',
        title: 'Go HTTP处理器生成器',
        description: '生成标准的Go HTTP处理器，包含路由和中间件',
        category: 'code-generation',
        language: 'go',
        difficulty: '高级',
        tags: ['HTTP', '路由', '中间件'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqR28gSFRUUOWkhOeQhuWZqO+8jOimgeaxguWmguS4i++8mgoKKipBUEnpnIDmsYLvvJoqKgpb5o+P6L+w5YW35L2T55qESFRUUCBBUEnlip/og71dCgoqKuaKgOacr+imgeaxgu+8mioqCjEuIOS9v+eUqOagh+WHhuW6k+aIlua1geihjOahhuaetu+8iOWmgkdpbu+8iQoyLiDljIXlkKvlrozmlbTnmoRDUlVE5pON5L2cCjMuIOa3u+WKoOivt+axgumqjOivgeWSjOmUmeivr+WkhOeQhgo0LiDkvb/nlKjnu5PmnoTljJbml6Xlv5cKNS4g6L+U5Zue6YCC5b2T55qESFRUUOeKtuaAgeeggQo2LiDmlK/mjIFKU09O5bqP5YiX5YyWCjcuIOWMheWQq+S4remXtOS7tuaUr+aMgQo4LiDmt7vliqDljZXlhYPmtYvor5UKCioq6L6T5Ye66KaB5rGC77yaKioKLSDlrozmlbTnmoTlpITnkIblmajlh73mlbAKLSDot6/nlLHphY3nva4KLSDkuK3pl7Tku7blrp7njrA=",
        examples: [
            {
                title: 'Go HTTP处理器示例',
                code: "cGFja2FnZSBtYWluCgppbXBvcnQgKAoJImVuY29kaW5nL2pzb24iCgkibG9nIgoJIm5ldC9odHRwIgoJInN0cmNvbnYiCgkiZ2l0aHViLmNvbS9nb3JpbGxhL211eCIKKQoKdHlwZSBFeGFtcGxlSGFuZGxlciBzdHJ1Y3QgewoJbG9nZ2VyICpsb2cuTG9nZ2VyCn0KCmZ1bmMgTmV3RXhhbXBsZUhhbmRsZXIobG9nZ2VyICpsb2cuTG9nZ2VyKSAqRXhhbXBsZUhhbmRsZXIgewoJcmV0dXJuICZFeGFtcGxlSGFuZGxlcntsb2dnZXI6IGxvZ2dlcn0KfQoKLy8gR2V0RXhhbXBsZXMg6I635Y+W5omA5pyJ56S65L6LCmZ1bmMgKGggKkV4YW1wbGVIYW5kbGVyKSBHZXRFeGFtcGxlcyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCkgewoJdy5IZWFkZXIoKS5TZXQoIkNvbnRlbnQtVHlwZSIsICJhcHBsaWNhdGlvbi9qc29uIikKCQoJLy8g5Lia5Yqh6YC76L6RCglleGFtcGxlcyA6PSBbXUV4YW1wbGVTdHJ1Y3R7fQoJCglpZiBlcnIgOj0ganNvbi5OZXdFbmNvZGVyKHcpLkVuY29kZShleGFtcGxlcyk7IGVyciAhPSBuaWwgewoJCWgubG9nZ2VyLlByaW50ZigiRXJyb3IgZW5jb2RpbmcgcmVzcG9uc2U6ICV2IiwgZXJyKQoJCWh0dHAuRXJyb3IodywgIkludGVybmFsIHNlcnZlciBlcnJvciIsIGh0dHAuU3RhdHVzSW50ZXJuYWxTZXJ2ZXJFcnJvcikKCQlyZXR1cm4KCX0KfQoKLy8gQ3JlYXRlRXhhbXBsZSDliJvlu7rmlrDnpLrkvosKZnVuYyAoaCAqRXhhbXBsZUhhbmRsZXIpIENyZWF0ZUV4YW1wbGUodyBodHRwLlJlc3BvbnNlV3JpdGVyLCByICpodHRwLlJlcXVlc3QpIHsKCXZhciBleGFtcGxlIEV4YW1wbGVTdHJ1Y3QKCQoJaWYgZXJyIDo9IGpzb24uTmV3RGVjb2RlcihyLkJvZHkpLkRlY29kZSgmZXhhbXBsZSk7IGVyciAhPSBuaWwgewoJCWh0dHAuRXJyb3IodywgIkludmFsaWQgSlNPTiIsIGh0dHAuU3RhdHVzQmFkUmVxdWVzdCkKCQlyZXR1cm4KCX0KCQoJaWYgZXJyIDo9IGV4YW1wbGUuVmFsaWRhdGUoKTsgZXJyICE9IG5pbCB7CgkJaHR0cC5FcnJvcih3LCBlcnIuRXJyb3IoKSwgaHR0cC5TdGF0dXNCYWRSZXF1ZXN0KQoJCXJldHVybgoJfQoJCgl3LkhlYWRlcigpLlNldCgiQ29udGVudC1UeXBlIiwgImFwcGxpY2F0aW9uL2pzb24iKQoJdy5Xcml0ZUhlYWRlcihodHRwLlN0YXR1c0NyZWF0ZWQpCglqc29uLk5ld0VuY29kZXIodykuRW5jb2RlKGV4YW1wbGUpCn0="
            }
        ]
    },
    // SQL通用提示词
    {
        id: 'sql-table-generator',
        title: 'SQL表结构生成器',
        description: '生成标准的SQL表结构，包含索引、约束和触发器',
        category: 'code-generation',
        language: 'sql',
        difficulty: '中级',
        tags: ['表设计', '索引', '约束'],
        prompt: "6K+35biu5oiR55Sf5oiQU1FM6KGo57uT5p6E77yM6KaB5rGC5aaC5LiL77yaCgoqKuihqOiuvuiuoemcgOaxgu+8mioqClvmj4/ov7DooajnmoTlhbfkvZPlip/og73lkozmlbDmja7nu5PmnoRdCgoqKuaKgOacr+imgeaxgu+8mioqCjEuIOS9v+eUqOmAguW9k+eahOaVsOaNruexu+WeiwoyLiDmt7vliqDkuLvplK7lkozlpJbplK7nuqbmnZ8KMy4g5Yib5bu65b+F6KaB55qE57Si5byVCjQuIOWMheWQq+aVsOaNrumqjOivgee6puadnwo1LiDmt7vliqDms6jph4ror7TmmI4KNi4g6ICD6JmR5oCn6IO95LyY5YyWCjcuIOaUr+aMgeW4uOingeaVsOaNruW6k++8iE15U1FML1Bvc3RncmVTUUwvU1FMIFNlcnZlcu+8iQoKKirovpPlh7ropoHmsYLvvJoqKgotIOWujOaVtOeahENSRUFURSBUQUJMReivreWPpQotIOe0ouW8leWIm+W7uuivreWPpQotIOekuuS+i+aVsOaNruaPkuWFpeivreWPpQ==",
        examples: [
            {
                title: 'SQL表结构设计示例',
                code: "LS0g56S65L6L6KGo57uT5p6ECkNSRUFURSBUQUJMRSBleGFtcGxlX3RhYmxlICgKICAgIGlkIEJJR0lOVCBQUklNQVJZIEtFWSBBVVRPX0lOQ1JFTUVOVCwKICAgIG5hbWUgVkFSQ0hBUigyNTUpIE5PVCBOVUxMIENPTU1FTlQgJ+WQjeensCcsCiAgICBlbWFpbCBWQVJDSEFSKDI1NSkgVU5JUVVFIE5PVCBOVUxMIENPTU1FTlQgJ+mCrueuseWcsOWdgCcsCiAgICBzdGF0dXMgRU5VTSgnYWN0aXZlJywgJ2luYWN0aXZlJywgJ3BlbmRpbmcnKSBERUZBVUxUICdwZW5kaW5nJyBDT01NRU5UICfnirbmgIEnLAogICAgY3JlYXRlZF9hdCBUSU1FU1RBTVAgREVGQVVMVCBDVVJSRU5UX1RJTUVTVEFNUCBDT01NRU5UICfliJvlu7rml7bpl7QnLAogICAgdXBkYXRlZF9hdCBUSU1FU1RBTVAgREVGQVVMVCBDVVJSRU5UX1RJTUVTVEFNUCBPTiBVUERBVEUgQ1VSUkVOVF9USU1FU1RBTVAgQ09NTUVOVCAn5pu05paw5pe26Ze0JywKICAgIAogICAgSU5ERVggaWR4X25hbWUgKG5hbWUpLAogICAgSU5ERVggaWR4X3N0YXR1cyAoc3RhdHVzKSwKICAgIElOREVYIGlkeF9jcmVhdGVkX2F0IChjcmVhdGVkX2F0KQopIEVOR0lORT1Jbm5vREIgREVGQVVMVCBDSEFSU0VUPXV0ZjhtYjQgQ09NTUVOVD0n56S65L6L6KGoJzsKCi0tIOekuuS+i+aVsOaNrgpJTlNFUlQgSU5UTyBleGFtcGxlX3RhYmxlIChuYW1lLCBlbWFpbCwgc3RhdHVzKSBWQUxVRVMKKCflvKDkuIknLCAnemhhbmdzYW5AZXhhbXBsZS5jb20nLCAnYWN0aXZlJyksCign5p2O5ZubJywgJ2xpc2lAZXhhbXBsZS5jb20nLCAncGVuZGluZycpOw=="
            }
        ]
    },
    {
        id: 'sql-query-generator',
        title: 'SQL查询生成器',
        description: '生成复杂的SQL查询语句，包含联表、聚合和优化',
        category: 'code-generation',
        language: 'sql',
        difficulty: '高级',
        tags: ['查询优化', '联表', '聚合'],
        prompt: "6K+35biu5oiR55Sf5oiQU1FM5p+l6K+i6K+t5Y+l77yM6KaB5rGC5aaC5LiL77yaCgoqKuafpeivoumcgOaxgu+8mioqClvmj4/ov7DlhbfkvZPnmoTmn6Xor6LpnIDmsYJdCgoqKuaKgOacr+imgeaxgu+8mioqCjEuIOS9v+eUqOmAguW9k+eahEpPSU7nsbvlnosKMi4g5re75Yqg5b+F6KaB55qEV0hFUkXmnaHku7YKMy4g5YyF5ZCr6IGa5ZCI5Ye95pWw5ZKM5YiG57uECjQuIOiAg+iZkeafpeivouaAp+iDveS8mOWMlgo1LiDmt7vliqDms6jph4ror7TmmI4KNi4g5pSv5oyB5YiG6aG15ZKM5o6S5bqPCjcuIOWMheWQq+mUmeivr+WkhOeQhgoKKirovpPlh7ropoHmsYLvvJoqKgotIOWujOaVtOeahFNFTEVDVOivreWPpQotIOafpeivouaJp+ihjOiuoeWIkuWIhuaekAotIOaAp+iDveS8mOWMluW7uuiurg==",
        examples: [
            {
                title: 'SQL复杂查询示例',
                code: "LS0g5aSN5p2C5p+l6K+i56S65L6LClNFTEVDVCAKICAgIHUuaWQsCiAgICB1Lm5hbWUsCiAgICB1LmVtYWlsLAogICAgQ09VTlQoby5pZCkgYXMgb3JkZXJfY291bnQsCiAgICBTVU0oby50b3RhbF9hbW91bnQpIGFzIHRvdGFsX3NwZW50LAogICAgQVZHKG8udG90YWxfYW1vdW50KSBhcyBhdmdfb3JkZXJfdmFsdWUsCiAgICBNQVgoby5jcmVhdGVkX2F0KSBhcyBsYXN0X29yZGVyX2RhdGUKRlJPTSB1c2VycyB1CkxFRlQgSk9JTiBvcmRlcnMgbyBPTiB1LmlkID0gby51c2VyX2lkIAogICAgQU5EIG8uc3RhdHVzID0gJ2NvbXBsZXRlZCcKICAgIEFORCBvLmNyZWF0ZWRfYXQgPj0gREFURV9TVUIoTk9XKCksIElOVEVSVkFMIDEgWUVBUikKV0hFUkUgdS5zdGF0dXMgPSAnYWN0aXZlJwogICAgQU5EIHUuY3JlYXRlZF9hdCA+PSAnMjAyMy0wMS0wMScKR1JPVVAgQlkgdS5pZCwgdS5uYW1lLCB1LmVtYWlsCkhBVklORyBDT1VOVChvLmlkKSA+IDAKT1JERVIgQlkgdG90YWxfc3BlbnQgREVTQywgdS5uYW1lIEFTQwpMSU1JVCAyMCBPRkZTRVQgMDsKCi0tIOaAp+iDveS8mOWMlue0ouW8leW7uuiurgotLSBDUkVBVEUgSU5ERVggaWR4X3VzZXJzX3N0YXR1c19jcmVhdGVkIE9OIHVzZXJzKHN0YXR1cywgY3JlYXRlZF9hdCk7Ci0tIENSRUFURSBJTkRFWCBpZHhfb3JkZXJzX3VzZXJfc3RhdHVzX2NyZWF0ZWQgT04gb3JkZXJzKHVzZXJfaWQsIHN0YXR1cywgY3JlYXRlZF9hdCk7"
            }
        ]
    },
    {
        id: 'python-class-generator',
        title: 'Python类生成器',
        description: '生成符合Python最佳实践的类定义，包含数据验证和文档字符串',
        category: 'code-generation',
        language: 'python',
        difficulty: '中级',
        tags: ['类', '数据验证', 'Python'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqUHl0aG9u57G777yM6KaB5rGC5aaC5LiL77yaCgoqKuexu+WKn+iDvemcgOaxgu+8mioqClvlnKjov5nph4zmj4/ov7DnsbvnmoTlhbfkvZPlip/og73pnIDmsYJdCgoqKuexu+iuvuiuoeimgeaxgu+8mioqCjEuIOmBteW+qlBFUCA457yW56CB6KeE6IyDCjIuIOWMheWQq+WujOaVtOeahGRvY3N0cmluZ+aWh+ahowozLiDlrp7njrDpgILlvZPnmoTprZTms5Xmlrnms5XvvIhfX3N0cl9fLCBfX3JlcHJfXywgX19lcV9f562J77yJCjQuIOa3u+WKoOWxnuaAp+mqjOivgeWSjOexu+Wei+aPkOekugo1LiDljIXlkKvplJnor6/lpITnkIbmnLrliLYKNi4g5pSv5oyB5bqP5YiX5YyWL+WPjeW6j+WIl+WMlu+8iOWmgumcgOimge+8iQoKKirovpPlh7rlhoXlrrnvvJoqKgotIOWujOaVtOeahOexu+WumuS5iQotIOS9v+eUqOekuuS+i+S7o+eggQotIOWNleWFg+a1i+ivleeUqOS+iwotIOiuvuiuoeivtOaYjuaWh+ahow==",
        examples: [
            {
                title: '用户信息类示例',
                code: "ZnJvbSB0eXBpbmcgaW1wb3J0IE9wdGlvbmFsLCBEaWN0LCBBbnkKZnJvbSBkYXRldGltZSBpbXBvcnQgZGF0ZXRpbWUKaW1wb3J0IGpzb24KCmNsYXNzIFVzZXI6CiAgICAiIiIKICAgIOeUqOaIt+S/oeaBr+exuwogICAgCiAgICDnlKjkuo7nrqHnkIbnlKjmiLfnmoTln7rmnKzkv6Hmga/vvIzljIXmi6zlp5PlkI3jgIHpgq7nrrHjgIHlubTpvoTnrYnlsZ7mgKfjgIIKICAgIOaUr+aMgeaVsOaNrumqjOivgeOAgeW6j+WIl+WMluWSjOWfuuacrOeahOeUqOaIt+aTjeS9nOOAggogICAgCiAgICBBdHRyaWJ1dGVzOgogICAgICAgIG5hbWUgKHN0cik6IOeUqOaIt+Wnk+WQjQogICAgICAgIGVtYWlsIChzdHIpOiDnlKjmiLfpgq7nrrEKICAgICAgICBhZ2UgKGludCk6IOeUqOaIt+W5tOm+hAogICAgICAgIGNyZWF0ZWRfYXQgKGRhdGV0aW1lKTog5Yib5bu65pe26Ze0CiAgICAiIiIKICAgIAogICAgZGVmIF9faW5pdF9fKHNlbGYsIG5hbWU6IHN0ciwgZW1haWw6IHN0ciwgYWdlOiBpbnQpOgogICAgICAgICIiIgogICAgICAgIOWIneWni+WMlueUqOaIt+WvueixoQogICAgICAgIAogICAgICAgIEFyZ3M6CiAgICAgICAgICAgIG5hbWUgKHN0cik6IOeUqOaIt+Wnk+WQje+8jOS4jeiDveS4uuepugogICAgICAgICAgICBlbWFpbCAoc3RyKTog55So5oi36YKu566x77yM5b+F6aG75YyF5ZCrQOespuWPtwogICAgICAgICAgICBhZ2UgKGludCk6IOeUqOaIt+W5tOm+hO+8jOW/hemhu+WcqDAtMTUw5LmL6Ze0CiAgICAgICAgICAgIAogICAgICAgIFJhaXNlczoKICAgICAgICAgICAgVmFsdWVFcnJvcjog5b2T5Y+C5pWw5LiN56ym5ZCI6KaB5rGC5pe25oqb5Ye6CiAgICAgICAgICAgIFR5cGVFcnJvcjog5b2T5Y+C5pWw57G75Z6L5LiN5q2j56Gu5pe25oqb5Ye6CiAgICAgICAgIiIiCiAgICAgICAgc2VsZi5uYW1lID0gbmFtZQogICAgICAgIHNlbGYuZW1haWwgPSBlbWFpbAogICAgICAgIHNlbGYuYWdlID0gYWdlCiAgICAgICAgc2VsZi5jcmVhdGVkX2F0ID0gZGF0ZXRpbWUubm93KCkKICAgIAogICAgQHByb3BlcnR5CiAgICBkZWYgbmFtZShzZWxmKSAtPiBzdHI6CiAgICAgICAgcmV0dXJuIHNlbGYuX25hbWUKICAgIAogICAgQG5hbWUuc2V0dGVyCiAgICBkZWYgbmFtZShzZWxmLCB2YWx1ZTogc3RyKSAtPiBOb25lOgogICAgICAgIGlmIG5vdCBpc2luc3RhbmNlKHZhbHVlLCBzdHIpOgogICAgICAgICAgICByYWlzZSBUeXBlRXJyb3IoIuWnk+WQjeW/hemhu+aYr+Wtl+espuS4suexu+WeiyIpCiAgICAgICAgaWYgbm90IHZhbHVlLnN0cmlwKCk6CiAgICAgICAgICAgIHJhaXNlIFZhbHVlRXJyb3IoIuWnk+WQjeS4jeiDveS4uuepuiIpCiAgICAgICAgc2VsZi5fbmFtZSA9IHZhbHVlLnN0cmlwKCkKICAgIAogICAgQHByb3BlcnR5CiAgICBkZWYgZW1haWwoc2VsZikgLT4gc3RyOgogICAgICAgIHJldHVybiBzZWxmLl9lbWFpbAogICAgCiAgICBAZW1haWwuc2V0dGVyCiAgICBkZWYgZW1haWwoc2VsZiwgdmFsdWU6IHN0cikgLT4gTm9uZToKICAgICAgICBpZiBub3QgaXNpbnN0YW5jZSh2YWx1ZSwgc3RyKToKICAgICAgICAgICAgcmFpc2UgVHlwZUVycm9yKCLpgq7nrrHlv4XpobvmmK/lrZfnrKbkuLLnsbvlnosiKQogICAgICAgIGlmICdAJyBub3QgaW4gdmFsdWU6CiAgICAgICAgICAgIHJhaXNlIFZhbHVlRXJyb3IoIumCrueuseagvOW8j+S4jeato+ehriIpCiAgICAgICAgc2VsZi5fZW1haWwgPSB2YWx1ZS5sb3dlcigpLnN0cmlwKCkKICAgIAogICAgQHByb3BlcnR5CiAgICBkZWYgYWdlKHNlbGYpIC0+IGludDoKICAgICAgICByZXR1cm4gc2VsZi5fYWdlCiAgICAKICAgIEBhZ2Uuc2V0dGVyCiAgICBkZWYgYWdlKHNlbGYsIHZhbHVlOiBpbnQpIC0+IE5vbmU6CiAgICAgICAgaWYgbm90IGlzaW5zdGFuY2UodmFsdWUsIGludCk6CiAgICAgICAgICAgIHJhaXNlIFR5cGVFcnJvcigi5bm06b6E5b+F6aG75piv5pW05pWw57G75Z6LIikKICAgICAgICBpZiBub3QgMCA8PSB2YWx1ZSA8PSAxNTA6CiAgICAgICAgICAgIHJhaXNlIFZhbHVlRXJyb3IoIuW5tOm+hOW/hemhu+WcqDAtMTUw5LmL6Ze0IikKICAgICAgICBzZWxmLl9hZ2UgPSB2YWx1ZQogICAgCiAgICBkZWYgX19zdHJfXyhzZWxmKSAtPiBzdHI6CiAgICAgICAgcmV0dXJuIGYiVXNlcihuYW1lPSd7c2VsZi5uYW1lfScsIGVtYWlsPSd7c2VsZi5lbWFpbH0nLCBhZ2U9e3NlbGYuYWdlfSkiCiAgICAKICAgIGRlZiBfX3JlcHJfXyhzZWxmKSAtPiBzdHI6CiAgICAgICAgcmV0dXJuIGYiVXNlcihuYW1lPSd7c2VsZi5uYW1lfScsIGVtYWlsPSd7c2VsZi5lbWFpbH0nLCBhZ2U9e3NlbGYuYWdlfSkiCiAgICAKICAgIGRlZiBfX2VxX18oc2VsZiwgb3RoZXIpIC0+IGJvb2w6CiAgICAgICAgaWYgbm90IGlzaW5zdGFuY2Uob3RoZXIsIFVzZXIpOgogICAgICAgICAgICByZXR1cm4gRmFsc2UKICAgICAgICByZXR1cm4gc2VsZi5lbWFpbCA9PSBvdGhlci5lbWFpbAogICAgCiAgICBkZWYgdG9fZGljdChzZWxmKSAtPiBEaWN0W3N0ciwgQW55XToKICAgICAgICAiIiLlsIbnlKjmiLflr7nosaHovazmjaLkuLrlrZflhbgiIiIKICAgICAgICByZXR1cm4gewogICAgICAgICAgICAnbmFtZSc6IHNlbGYubmFtZSwKICAgICAgICAgICAgJ2VtYWlsJzogc2VsZi5lbWFpbCwKICAgICAgICAgICAgJ2FnZSc6IHNlbGYuYWdlLAogICAgICAgICAgICAnY3JlYXRlZF9hdCc6IHNlbGYuY3JlYXRlZF9hdC5pc29mb3JtYXQoKQogICAgICAgIH0KICAgIAogICAgQGNsYXNzbWV0aG9kCiAgICBkZWYgZnJvbV9kaWN0KGNscywgZGF0YTogRGljdFtzdHIsIEFueV0pIC0+ICdVc2VyJzoKICAgICAgICAiIiLku47lrZflhbjliJvlu7rnlKjmiLflr7nosaEiIiIKICAgICAgICByZXR1cm4gY2xzKAogICAgICAgICAgICBuYW1lPWRhdGFbJ25hbWUnXSwKICAgICAgICAgICAgZW1haWw9ZGF0YVsnZW1haWwnXSwKICAgICAgICAgICAgYWdlPWRhdGFbJ2FnZSddCiAgICAgICAgKQogICAgCiAgICBkZWYgdG9fanNvbihzZWxmKSAtPiBzdHI6CiAgICAgICAgIiIi5bCG55So5oi35a+56LGh6L2s5o2i5Li6SlNPTuWtl+espuS4siIiIgogICAgICAgIHJldHVybiBqc29uLmR1bXBzKHNlbGYudG9fZGljdCgpLCBlbnN1cmVfYXNjaWk9RmFsc2UsIGluZGVudD0yKQoKIyDkvb/nlKjnpLrkvosKdXNlciA9IFVzZXIoIuW8oOS4iSIsICJ6aGFuZ3NhbkBleGFtcGxlLmNvbSIsIDI1KQpwcmludCh1c2VyKSAgIyBVc2VyKG5hbWU9J+W8oOS4iScsIGVtYWlsPSd6aGFuZ3NhbkBleGFtcGxlLmNvbScsIGFnZT0yNSkKcHJpbnQodXNlci50b19qc29uKCkp"
            }
        ]
    },
    {
        id: 'java-spring-controller',
        title: 'Java Spring Controller生成器',
        description: '生成标准的Spring Boot REST Controller，包含CRUD操作和异常处理',
        category: 'code-generation',
        language: 'java',
        difficulty: '高级',
        tags: ['Spring Boot', 'REST API', 'CRUD'],
        prompt: "6K+35biu5oiR55Sf5oiQ5LiA5LiqSmF2YSBTcHJpbmcgQm9vdCBDb250cm9sbGVy77yM6KaB5rGC5aaC5LiL77yaCgoqKkNvbnRyb2xsZXLpnIDmsYLvvJoqKgpb5o+P6L+w5YW35L2T55qE5Lia5Yqh6ZyA5rGC5ZKM5a6e5L2T5L+h5oGvXQoKKirmioDmnK/opoHmsYLvvJoqKgoxLiDkvb/nlKhTcHJpbmcgQm9vdCAyLngvMy545pyA5L2z5a6e6Le1CjIuIOWunueOsOWujOaVtOeahENSVUTmk43kvZwKMy4g5YyF5ZCr6K+35rGC5Y+C5pWw6aqM6K+BCjQuIOa3u+WKoOe7n+S4gOW8guW4uOWkhOeQhgo1LiDmj5DkvpvlrozmlbTnmoRBUEnmlofmoaPms6jop6MKNi4g5pSv5oyB5YiG6aG15ZKM5o6S5bqPCjcuIOWMheWQq+aXpeW/l+iusOW9lQoKKirovpPlh7rlhoXlrrnvvJoqKgotIENvbnRyb2xsZXLnsbvlrozmlbTku6PnoIEKLSDnm7jlhbPnmoREVE8vVk/nsbsKLSDlvILluLjlpITnkIbnsbsKLSDljZXlhYPmtYvor5Xku6PnoIEKLSBBUEnmlofmoaPnpLrkvos=",
        examples: [
            {
                title: '用户管理Controller示例',
                code: "cGFja2FnZSBjb20uZXhhbXBsZS5jb250cm9sbGVyOwoKaW1wb3J0IGNvbS5leGFtcGxlLmR0by5Vc2VyQ3JlYXRlRFRPOwppbXBvcnQgY29tLmV4YW1wbGUuZHRvLlVzZXJVcGRhdGVEVE87CmltcG9ydCBjb20uZXhhbXBsZS5kdG8uVXNlclJlc3BvbnNlRFRPOwppbXBvcnQgY29tLmV4YW1wbGUuc2VydmljZS5Vc2VyU2VydmljZTsKaW1wb3J0IGlvLnN3YWdnZXIudjMub2FzLmFubm90YXRpb25zLk9wZXJhdGlvbjsKaW1wb3J0IGlvLnN3YWdnZXIudjMub2FzLmFubm90YXRpb25zLnRhZ3MuVGFnOwppbXBvcnQgbG9tYm9rLlJlcXVpcmVkQXJnc0NvbnN0cnVjdG9yOwppbXBvcnQgbG9tYm9rLmV4dGVybi5zbGY0ai5TbGY0ajsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuZGF0YS5kb21haW4uUGFnZTsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuZGF0YS5kb21haW4uUGFnZWFibGU7CmltcG9ydCBvcmcuc3ByaW5nZnJhbWV3b3JrLmh0dHAuSHR0cFN0YXR1czsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsuaHR0cC5SZXNwb25zZUVudGl0eTsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsudmFsaWRhdGlvbi5hbm5vdGF0aW9uLlZhbGlkYXRlZDsKaW1wb3J0IG9yZy5zcHJpbmdmcmFtZXdvcmsud2ViLmJpbmQuYW5ub3RhdGlvbi4qOwoKaW1wb3J0IGphdmF4LnZhbGlkYXRpb24uVmFsaWQ7CmltcG9ydCBqYXZheC52YWxpZGF0aW9uLmNvbnN0cmFpbnRzLk1pbjsKCkBTbGY0agpAUmVzdENvbnRyb2xsZXIKQFJlcXVlc3RNYXBwaW5nKCIvYXBpL3YxL3VzZXJzIikKQFJlcXVpcmVkQXJnc0NvbnN0cnVjdG9yCkBWYWxpZGF0ZWQKQFRhZyhuYW1lID0gIueUqOaIt+euoeeQhiIsIGRlc2NyaXB0aW9uID0gIueUqOaIt+ebuOWFs+eahENSVUTmk43kvZwiKQpwdWJsaWMgY2xhc3MgVXNlckNvbnRyb2xsZXIgewoKICAgIHByaXZhdGUgZmluYWwgVXNlclNlcnZpY2UgdXNlclNlcnZpY2U7CgogICAgQE9wZXJhdGlvbihzdW1tYXJ5ID0gIuWIm+W7uueUqOaItyIsIGRlc2NyaXB0aW9uID0gIuWIm+W7uuaWsOeahOeUqOaIt+i0puaItyIpCiAgICBAUG9zdE1hcHBpbmcKICAgIHB1YmxpYyBSZXNwb25zZUVudGl0eTxVc2VyUmVzcG9uc2VEVE8+IGNyZWF0ZVVzZXIoCiAgICAgICAgICAgIEBWYWxpZCBAUmVxdWVzdEJvZHkgVXNlckNyZWF0ZURUTyBjcmVhdGVEVE8pIHsKICAgICAgICBsb2cuaW5mbygi5Yib5bu655So5oi36K+35rGCOiB7fSIsIGNyZWF0ZURUTyk7CiAgICAgICAgVXNlclJlc3BvbnNlRFRPIHJlc3BvbnNlID0gdXNlclNlcnZpY2UuY3JlYXRlVXNlcihjcmVhdGVEVE8pOwogICAgICAgIGxvZy5pbmZvKCLnlKjmiLfliJvlu7rmiJDlip/vvIxJRDoge30iLCByZXNwb25zZS5nZXRJZCgpKTsKICAgICAgICByZXR1cm4gUmVzcG9uc2VFbnRpdHkuc3RhdHVzKEh0dHBTdGF0dXMuQ1JFQVRFRCkuYm9keShyZXNwb25zZSk7CiAgICB9CgogICAgQE9wZXJhdGlvbihzdW1tYXJ5ID0gIuiOt+WPlueUqOaIt+ivpuaDhSIsIGRlc2NyaXB0aW9uID0gIuagueaNrueUqOaIt0lE6I635Y+W55So5oi36K+m57uG5L+h5oGvIikKICAgIEBHZXRNYXBwaW5nKCIve2lkfSIpCiAgICBwdWJsaWMgUmVzcG9uc2VFbnRpdHk8VXNlclJlc3BvbnNlRFRPPiBnZXRVc2VyQnlJZCgKICAgICAgICAgICAgQFBhdGhWYXJpYWJsZSBATWluKDEpIExvbmcgaWQpIHsKICAgICAgICBsb2cuaW5mbygi6I635Y+W55So5oi36K+m5oOF77yMSUQ6IHt9IiwgaWQpOwogICAgICAgIFVzZXJSZXNwb25zZURUTyByZXNwb25zZSA9IHVzZXJTZXJ2aWNlLmdldFVzZXJCeUlkKGlkKTsKICAgICAgICByZXR1cm4gUmVzcG9uc2VFbnRpdHkub2socmVzcG9uc2UpOwogICAgfQoKICAgIEBPcGVyYXRpb24oc3VtbWFyeSA9ICLojrflj5bnlKjmiLfliJfooagiLCBkZXNjcmlwdGlvbiA9ICLliIbpobXojrflj5bnlKjmiLfliJfooagiKQogICAgQEdldE1hcHBpbmcKICAgIHB1YmxpYyBSZXNwb25zZUVudGl0eTxQYWdlPFVzZXJSZXNwb25zZURUTz4+IGdldFVzZXJzKAogICAgICAgICAgICBQYWdlYWJsZSBwYWdlYWJsZSwKICAgICAgICAgICAgQFJlcXVlc3RQYXJhbShyZXF1aXJlZCA9IGZhbHNlKSBTdHJpbmcgbmFtZSwKICAgICAgICAgICAgQFJlcXVlc3RQYXJhbShyZXF1aXJlZCA9IGZhbHNlKSBTdHJpbmcgZW1haWwpIHsKICAgICAgICBsb2cuaW5mbygi6I635Y+W55So5oi35YiX6KGo77yM5YiG6aG15Y+C5pWwOiB7fSwg562b6YCJ5p2h5Lu2OiBuYW1lPXt9LCBlbWFpbD17fSIsIAogICAgICAgICAgICAgICAgcGFnZWFibGUsIG5hbWUsIGVtYWlsKTsKICAgICAgICBQYWdlPFVzZXJSZXNwb25zZURUTz4gcmVzcG9uc2UgPSB1c2VyU2VydmljZS5nZXRVc2VycyhwYWdlYWJsZSwgbmFtZSwgZW1haWwpOwogICAgICAgIHJldHVybiBSZXNwb25zZUVudGl0eS5vayhyZXNwb25zZSk7CiAgICB9CgogICAgQE9wZXJhdGlvbihzdW1tYXJ5ID0gIuabtOaWsOeUqOaItyIsIGRlc2NyaXB0aW9uID0gIuabtOaWsOeUqOaIt+S/oeaBryIpCiAgICBAUHV0TWFwcGluZygiL3tpZH0iKQogICAgcHVibGljIFJlc3BvbnNlRW50aXR5PFVzZXJSZXNwb25zZURUTz4gdXBkYXRlVXNlcigKICAgICAgICAgICAgQFBhdGhWYXJpYWJsZSBATWluKDEpIExvbmcgaWQsCiAgICAgICAgICAgIEBWYWxpZCBAUmVxdWVzdEJvZHkgVXNlclVwZGF0ZURUTyB1cGRhdGVEVE8pIHsKICAgICAgICBsb2cuaW5mbygi5pu05paw55So5oi36K+35rGC77yMSUQ6IHt9LCDmlbDmja46IHt9IiwgaWQsIHVwZGF0ZURUTyk7CiAgICAgICAgVXNlclJlc3BvbnNlRFRPIHJlc3BvbnNlID0gdXNlclNlcnZpY2UudXBkYXRlVXNlcihpZCwgdXBkYXRlRFRPKTsKICAgICAgICBsb2cuaW5mbygi55So5oi35pu05paw5oiQ5Yqf77yMSUQ6IHt9IiwgaWQpOwogICAgICAgIHJldHVybiBSZXNwb25zZUVudGl0eS5vayhyZXNwb25zZSk7CiAgICB9CgogICAgQE9wZXJhdGlvbihzdW1tYXJ5ID0gIuWIoOmZpOeUqOaItyIsIGRlc2NyaXB0aW9uID0gIuagueaNrueUqOaIt0lE5Yig6Zmk55So5oi3IikKICAgIEBEZWxldGVNYXBwaW5nKCIve2lkfSIpCiAgICBwdWJsaWMgUmVzcG9uc2VFbnRpdHk8Vm9pZD4gZGVsZXRlVXNlcihAUGF0aFZhcmlhYmxlIEBNaW4oMSkgTG9uZyBpZCkgewogICAgICAgIGxvZy5pbmZvKCLliKDpmaTnlKjmiLfor7fmsYLvvIxJRDoge30iLCBpZCk7CiAgICAgICAgdXNlclNlcnZpY2UuZGVsZXRlVXNlcihpZCk7CiAgICAgICAgbG9nLmluZm8oIueUqOaIt+WIoOmZpOaIkOWKn++8jElEOiB7fSIsIGlkKTsKICAgICAgICByZXR1cm4gUmVzcG9uc2VFbnRpdHkubm9Db250ZW50KCkuYnVpbGQoKTsKICAgIH0KfQ=="
            }
        ]
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CODE_GENERATION_PROMPTS;
} else if (typeof window !== 'undefined') {
    window.CODE_GENERATION_PROMPTS = CODE_GENERATION_PROMPTS;
}