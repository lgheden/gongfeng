/**
 * Python 快速参考数据
 * 基于 quickref.me 的 Python 参考内容
 */

const PYTHON_CHEATSHEET = {
    id: 'python',
    title: 'Python',
    description: 'Python 是一种高级的、解释型的编程语言',
    icon: '🐍',
    category: 'programming',
    sections: [
        {
            title: '变量和数据类型',
            items: [
                {
                    title: '变量赋值',
                    description: 'Python 变量赋值',
                    code: 'name = "John"\nage = 25\nheight = 5.9'
                },
                {
                    title: '字符串',
                    description: '字符串操作',
                    code: 'text = "Hello World"\nf_string = f"Hello {name}"\nmultiline = """\nThis is a\nmultiline string\n"""'
                },
                {
                    title: '数字',
                    description: '数字类型',
                    code: 'integer = 42\nfloat_num = 3.14\ncomplex_num = 3 + 4j'
                },
                {
                    title: '布尔值',
                    description: '布尔类型',
                    code: 'is_true = True\nis_false = False\nresult = 5 > 3  # True'
                }
            ]
        },
        {
            title: '数据结构',
            items: [
                {
                    title: '列表 (List)',
                    description: '可变有序集合',
                    code: 'fruits = ["apple", "banana", "orange"]\nfruits.append("grape")\nfruits[0] = "pear"'
                },
                {
                    title: '元组 (Tuple)',
                    description: '不可变有序集合',
                    code: 'coordinates = (10, 20)\npoint = (x, y, z) = (1, 2, 3)'
                },
                {
                    title: '字典 (Dict)',
                    description: '键值对集合',
                    code: 'person = {\n    "name": "John",\n    "age": 30,\n    "city": "New York"\n}\nprint(person["name"])'
                },
                {
                    title: '集合 (Set)',
                    description: '无序唯一元素集合',
                    code: 'unique_numbers = {1, 2, 3, 4, 5}\nunique_numbers.add(6)\nunique_numbers.remove(1)'
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数定义',
                    description: '定义和调用函数',
                    code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nresult = greet("Alice")'
                },
                {
                    title: 'Lambda 函数',
                    description: '匿名函数',
                    code: 'square = lambda x: x ** 2\nadd = lambda x, y: x + y\nresult = square(5)  # 25'
                },
                {
                    title: '装饰器',
                    description: '函数装饰器',
                    code: 'def timer(func):\n    def wrapper(*args, **kwargs):\n        # 计时逻辑\n        return func(*args, **kwargs)\n    return wrapper\n\n@timer\ndef my_function():\n    pass'
                }
            ]
        },
        {
            title: '类和对象',
            items: [
                {
                    title: '类定义',
                    description: '定义类和方法',
                    code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f"Hi, I\'m {self.name}"'
                },
                {
                    title: '继承',
                    description: '类继承',
                    code: 'class Student(Person):\n    def __init__(self, name, age, student_id):\n        super().__init__(name, age)\n        self.student_id = student_id'
                },
                {
                    title: '属性装饰器',
                    description: 'property装饰器',
                    code: 'class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    \n    @property\n    def area(self):\n        return 3.14159 * self._radius ** 2'
                }
            ]
        },
        {
            title: '控制流',
            items: [
                {
                    title: '条件语句',
                    description: 'if/elif/else',
                    code: 'if age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teenager")\nelse:\n    print("Child")'
                },
                {
                    title: 'for 循环',
                    description: '遍历序列',
                    code: 'for i in range(5):\n    print(i)\n\nfor item in ["a", "b", "c"]:\n    print(item)\n\nfor i, item in enumerate(["a", "b"]):\n    print(f"{i}: {item}")'
                },
                {
                    title: 'while 循环',
                    description: 'while循环',
                    code: 'count = 0\nwhile count < 5:\n    print(count)\n    count += 1'
                },
                {
                    title: '异常处理',
                    description: 'try/except/finally',
                    code: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nexcept Exception as e:\n    print(f"Error: {e}")\nfinally:\n    print("Cleanup")'
                }
            ]
        },
        {
            title: '列表推导式',
            items: [
                {
                    title: '基本列表推导',
                    description: '创建新列表',
                    code: 'squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]'
                },
                {
                    title: '字典推导',
                    description: '创建字典',
                    code: 'square_dict = {x: x**2 for x in range(5)}\nfiltered = {k: v for k, v in data.items() if v > 10}'
                },
                {
                    title: '集合推导',
                    description: '创建集合',
                    code: 'unique_squares = {x**2 for x in range(-5, 6)}'
                }
            ]
        },
        {
            title: '文件操作',
            items: [
                {
                    title: '读取文件',
                    description: '文件读取',
                    code: 'with open("file.txt", "r") as f:\n    content = f.read()\n    lines = f.readlines()'
                },
                {
                    title: '写入文件',
                    description: '文件写入',
                    code: 'with open("file.txt", "w") as f:\n    f.write("Hello World")\n    f.writelines(["Line 1\\n", "Line 2\\n"])'
                },
                {
                    title: 'JSON 操作',
                    description: 'JSON 读写',
                    code: 'import json\n\n# 读取JSON\nwith open("data.json", "r") as f:\n    data = json.load(f)\n\n# 写入JSON\nwith open("data.json", "w") as f:\n    json.dump(data, f, indent=2)'
                }
            ]
        },
        {
            title: '常用模块',
            items: [
                {
                    title: 'datetime',
                    description: '日期时间处理',
                    code: 'from datetime import datetime, date\n\nnow = datetime.now()\ntoday = date.today()\nformatted = now.strftime("%Y-%m-%d %H:%M:%S")'
                },
                {
                    title: 'os',
                    description: '操作系统接口',
                    code: 'import os\n\ncurrent_dir = os.getcwd()\nfiles = os.listdir(".")\nos.makedirs("new_folder", exist_ok=True)'
                },
                {
                    title: 'random',
                    description: '随机数生成',
                    code: 'import random\n\nrandom_int = random.randint(1, 10)\nrandom_choice = random.choice(["a", "b", "c"])\nrandom.shuffle(my_list)'
                },
                {
                    title: 'requests',
                    description: 'HTTP 请求',
                    code: 'import requests\n\nresponse = requests.get("https://api.example.com")\ndata = response.json()\nstatus = response.status_code'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PYTHON_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.PYTHON_CHEATSHEET = PYTHON_CHEATSHEET;
}