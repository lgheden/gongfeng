const csharpQuickRef = {
    title: 'C# 快速参考',
    description: 'C# 编程语言快速参考指南',
    sections: [
        {
            title: '基本语法',
            items: [
                {
                    title: '变量声明',
                    code: `// 基本类型
int number = 42;
string text = "Hello";
bool isTrue = true;
double price = 19.99;

// 类型推断
var name = "John"; // string
var age = 25;      // int`
                },
                {
                    title: '常量',
                    code: `const int MAX_SIZE = 100;
readonly string connectionString = "...";`
                },
                {
                    title: '字符串操作',
                    code: `string str = "Hello World";
string upper = str.ToUpper();
string lower = str.ToLower();
string sub = str.Substring(0, 5);
bool contains = str.Contains("World");
string[] parts = str.Split(' ');`
                }
            ]
        },
        {
            title: '控制结构',
            items: [
                {
                    title: '条件语句',
                    code: `// if-else
if (condition) {
    // code
} else if (otherCondition) {
    // code
} else {
    // code
}

// switch
switch (value) {
    case 1:
        // code
        break;
    case 2:
        // code
        break;
    default:
        // code
        break;
}`
                },
                {
                    title: '循环',
                    code: `// for循环
for (int i = 0; i < 10; i++) {
    Console.WriteLine(i);
}

// foreach循环
foreach (var item in collection) {
    Console.WriteLine(item);
}

// while循环
while (condition) {
    // code
}

// do-while循环
do {
    // code
} while (condition);`
                }
            ]
        },
        {
            title: '数组和集合',
            items: [
                {
                    title: '数组',
                    code: `// 数组声明
int[] numbers = new int[5];
string[] names = {"Alice", "Bob", "Charlie"};

// 访问元素
int first = numbers[0];
numbers[1] = 42;

// 数组属性
int length = numbers.Length;`
                },
                {
                    title: 'List集合',
                    code: `List<string> list = new List<string>();
list.Add("item1");
list.Add("item2");
list.Remove("item1");
int count = list.Count;
bool contains = list.Contains("item2");`
                },
                {
                    title: 'Dictionary字典',
                    code: `Dictionary<string, int> dict = new Dictionary<string, int>();
dict["key1"] = 100;
dict.Add("key2", 200);
int value = dict["key1"];
bool hasKey = dict.ContainsKey("key1");`
                }
            ]
        },
        {
            title: '面向对象编程',
            items: [
                {
                    title: '类定义',
                    code: `public class Person {
    // 字段
    private string name;
    
    // 属性
    public int Age { get; set; }
    public string Name {
        get { return name; }
        set { name = value; }
    }
    
    // 构造函数
    public Person(string name, int age) {
        Name = name;
        Age = age;
    }
    
    // 方法
    public void SayHello() {
        Console.WriteLine($"Hello, I'm {Name}");
    }
}`
                },
                {
                    title: '继承',
                    code: `public class Student : Person {
    public string School { get; set; }
    
    public Student(string name, int age, string school) 
        : base(name, age) {
        School = school;
    }
    
    public override void SayHello() {
        Console.WriteLine($"Hi, I'm {Name}, student at {School}");
    }
}`
                },
                {
                    title: '接口',
                    code: `public interface IDrawable {
    void Draw();
    int Width { get; set; }
}

public class Circle : IDrawable {
    public int Width { get; set; }
    
    public void Draw() {
        Console.WriteLine("Drawing a circle");
    }
}`
                }
            ]
        },
        {
            title: '异常处理',
            items: [
                {
                    title: 'try-catch-finally',
                    code: `try {
    // 可能抛出异常的代码
    int result = 10 / 0;
} catch (DivideByZeroException ex) {
    Console.WriteLine($"Error: {ex.Message}");
} catch (Exception ex) {
    Console.WriteLine($"General error: {ex.Message}");
} finally {
    // 总是执行的代码
    Console.WriteLine("Cleanup");
}`
                },
                {
                    title: '抛出异常',
                    code: `public void ValidateAge(int age) {
    if (age < 0) {
        throw new ArgumentException("Age cannot be negative");
    }
}`
                }
            ]
        },
        {
            title: 'LINQ',
            items: [
                {
                    title: '查询语法',
                    code: `var numbers = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 过滤
var evenNumbers = numbers.Where(n => n % 2 == 0);

// 映射
var squares = numbers.Select(n => n * n);

// 排序
var sorted = numbers.OrderByDescending(n => n);

// 聚合
int sum = numbers.Sum();
int max = numbers.Max();
double average = numbers.Average();`
                },
                {
                    title: '复杂查询',
                    code: `var people = new List<Person>();

// 链式查询
var result = people
    .Where(p => p.Age > 18)
    .OrderBy(p => p.Name)
    .Select(p => new { p.Name, p.Age })
    .ToList();

// 分组
var grouped = people
    .GroupBy(p => p.Age)
    .Select(g => new { Age = g.Key, Count = g.Count() });`
                }
            ]
        },
        {
            title: '异步编程',
            items: [
                {
                    title: 'async/await',
                    code: `public async Task<string> GetDataAsync() {
    using (var client = new HttpClient()) {
        string result = await client.GetStringAsync("https://api.example.com");
        return result;
    }
}

// 调用异步方法
public async Task ProcessDataAsync() {
    string data = await GetDataAsync();
    Console.WriteLine(data);
}`
                },
                {
                    title: 'Task操作',
                    code: `// 创建Task
Task task = Task.Run(() => {
    // 后台工作
    Thread.Sleep(1000);
});

// 等待完成
await task;

// 并行执行
Task[] tasks = {
    Task.Run(() => Method1()),
    Task.Run(() => Method2())
};
await Task.WhenAll(tasks);`
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = csharpQuickRef;
}