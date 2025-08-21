/**
 * C++ 快速参考数据
 * 基于 quickref.me 的 C++ 参考内容
 */

const CPP_CHEATSHEET = {
    id: 'cpp',
    title: 'C++',
    description: 'C++ 是一种通用的编程语言，支持面向对象、泛型和过程化编程',
    icon: '⚡',
    category: 'system',
    sections: [
        {
            title: '基础语法',
            items: [
                {
                    title: 'Hello World',
                    description: 'C++程序基本结构',
                    code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n\n// 使用命名空间\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
                },
                {
                    title: '变量和数据类型',
                    description: '基本数据类型和变量声明',
                    code: '// 整数类型\nint age = 25;\nshort year = 2023;\nlong population = 7800000000L;\nlong long bigNumber = 9223372036854775807LL;\n\n// 无符号整数\nunsigned int count = 100;\nunsigned short port = 8080;\n\n// 浮点类型\nfloat price = 19.99f;\ndouble pi = 3.14159265359;\nlong double precision = 3.141592653589793238L;\n\n// 字符类型\nchar grade = \'A\';\nwchar_t unicode = L\'中\';\n\n// 布尔类型\nbool isActive = true;\nbool isComplete = false;\n\n// 字符串\nstd::string name = "John Doe";\nchar cstr[] = "C-style string";'
                },
                {
                    title: '常量和宏',
                    description: 'const、constexpr和宏定义',
                    code: '// const常量\nconst int MAX_SIZE = 100;\nconst double PI = 3.14159;\n\n// constexpr常量（编译时计算）\nconstexpr int BUFFER_SIZE = 1024;\nconstexpr double SQRT_2 = 1.41421356;\n\n// 宏定义\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define SQUARE(x) ((x) * (x))\n\n// 枚举\nenum Color {\n    RED,\n    GREEN,\n    BLUE\n};\n\n// 强类型枚举（C++11）\nenum class Status {\n    PENDING,\n    RUNNING,\n    COMPLETED\n};\n\nStatus status = Status::PENDING;'
                },
                {
                    title: '运算符',
                    description: '算术、比较、逻辑运算符',
                    code: '// 算术运算符\nint a = 10, b = 3;\nint sum = a + b;        // 13\nint diff = a - b;       // 7\nint product = a * b;    // 30\nint quotient = a / b;   // 3\nint remainder = a % b;  // 1\n\n// 自增自减\nint x = 5;\nint y = ++x;  // 前缀：x先增加，y = 6\nint z = x++;  // 后缀：z = 6，然后x增加\n\n// 比较运算符\nbool equal = (a == b);     // false\nbool notEqual = (a != b);  // true\nbool greater = (a > b);    // true\n\n// 逻辑运算符\nbool and_result = true && false;  // false\nbool or_result = true || false;   // true\nbool not_result = !true;          // false\n\n// 位运算符\nint mask = 0xFF;\nint shifted = mask << 2;   // 左移\nint anded = a & b;         // 按位与\nint ored = a | b;          // 按位或\nint xored = a ^ b;         // 按位异或'
                }
            ]
        },
        {
            title: '控制结构',
            items: [
                {
                    title: '条件语句',
                    description: 'if-else语句',
                    code: '// if-else\nint score = 85;\nif (score >= 90) {\n    std::cout << "A" << std::endl;\n} else if (score >= 80) {\n    std::cout << "B" << std::endl;\n} else if (score >= 70) {\n    std::cout << "C" << std::endl;\n} else {\n    std::cout << "F" << std::endl;\n}\n\n// 三元运算符\nstd::string result = (score >= 60) ? "Pass" : "Fail";\n\n// C++17 if语句初始化\nif (auto it = map.find(key); it != map.end()) {\n    std::cout << "Found: " << it->second << std::endl;\n}'
                },
                {
                    title: 'Switch语句',
                    description: '多分支选择',
                    code: 'int day = 3;\nswitch (day) {\n    case 1:\n        std::cout << "Monday" << std::endl;\n        break;\n    case 2:\n        std::cout << "Tuesday" << std::endl;\n        break;\n    case 3:\n        std::cout << "Wednesday" << std::endl;\n        break;\n    default:\n        std::cout << "Other day" << std::endl;\n        break;\n}\n\n// 多个case共享代码\nswitch (grade) {\n    case \'A\':\n    case \'B\':\n        std::cout << "Good" << std::endl;\n        break;\n    case \'C\':\n        std::cout << "Average" << std::endl;\n        break;\n    default:\n        std::cout << "Poor" << std::endl;\n        break;\n}'
                },
                {
                    title: '循环语句',
                    description: 'for、while、do-while循环',
                    code: '// for循环\nfor (int i = 0; i < 5; i++) {\n    std::cout << i << std::endl;\n}\n\n// 范围for循环（C++11）\nstd::vector<int> numbers = {1, 2, 3, 4, 5};\nfor (const auto& num : numbers) {\n    std::cout << num << std::endl;\n}\n\n// while循环\nint i = 0;\nwhile (i < 5) {\n    std::cout << i << std::endl;\n    i++;\n}\n\n// do-while循环\nint j = 0;\ndo {\n    std::cout << j << std::endl;\n    j++;\n} while (j < 5);\n\n// 循环控制\nfor (int i = 0; i < 10; i++) {\n    if (i == 3) continue;  // 跳过当前迭代\n    if (i == 7) break;     // 退出循环\n    std::cout << i << std::endl;\n}'
                }
            ]
        },
        {
            title: '数组和指针',
            items: [
                {
                    title: '数组',
                    description: '静态和动态数组',
                    code: '// 静态数组\nint arr[5];\nint numbers[5] = {1, 2, 3, 4, 5};\nint values[] = {10, 20, 30};  // 自动推断大小\n\n// 多维数组\nint matrix[3][4];\nint grid[2][3] = {{1, 2, 3}, {4, 5, 6}};\n\n// 访问数组元素\nint first = numbers[0];\nnumbers[1] = 100;\n\n// 数组大小\nint size = sizeof(numbers) / sizeof(numbers[0]);\n\n// 遍历数组\nfor (int i = 0; i < 5; i++) {\n    std::cout << numbers[i] << std::endl;\n}\n\n// 范围for循环\nfor (const auto& num : numbers) {\n    std::cout << num << std::endl;\n}'
                },
                {
                    title: '指针',
                    description: '指针的声明和使用',
                    code: '// 指针声明\nint x = 42;\nint* ptr = &x;        // ptr指向x的地址\nint* p = nullptr;     // 空指针（C++11）\n\n// 解引用\nint value = *ptr;     // 获取ptr指向的值\n*ptr = 100;           // 修改ptr指向的值\n\n// 指针运算\nint arr[] = {1, 2, 3, 4, 5};\nint* p1 = arr;        // 指向数组第一个元素\nint* p2 = arr + 2;    // 指向数组第三个元素\nint diff = p2 - p1;   // 指针差值：2\n\n// 指针和数组\nfor (int* p = arr; p < arr + 5; p++) {\n    std::cout << *p << std::endl;\n}\n\n// 动态内存分配\nint* dynamic = new int(42);\nint* array = new int[10];\ndelete dynamic;       // 释放单个对象\ndelete[] array;       // 释放数组'
                },
                {
                    title: '引用',
                    description: 'C++引用类型',
                    code: '// 引用声明\nint x = 42;\nint& ref = x;         // ref是x的别名\n\n// 引用必须初始化，不能重新绑定\nref = 100;            // 修改x的值\nstd::cout << x;       // 输出100\n\n// 函数参数引用\nvoid increment(int& value) {\n    value++;\n}\n\nint num = 5;\nincrement(num);       // num变为6\n\n// const引用\nconst int& cref = x;  // 只读引用\n\n// 右值引用（C++11）\nint&& rref = 42;      // 绑定到临时对象\nstd::string&& str_rref = std::string("Hello");\n\n// 引用vs指针\nint* ptr = &x;        // 指针可以为空，可以重新赋值\nint& ref2 = x;        // 引用不能为空，不能重新绑定'
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数定义',
                    description: '函数的声明和定义',
                    code: '// 函数声明\nint add(int a, int b);\n\n// 函数定义\nint add(int a, int b) {\n    return a + b;\n}\n\n// 默认参数\nvoid greet(const std::string& name = "World") {\n    std::cout << "Hello, " << name << "!" << std::endl;\n}\n\n// 函数重载\nint multiply(int a, int b) {\n    return a * b;\n}\n\ndouble multiply(double a, double b) {\n    return a * b;\n}\n\n// 内联函数\ninline int square(int x) {\n    return x * x;\n}\n\n// 递归函数\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
                },
                {
                    title: '函数指针和Lambda',
                    description: '函数指针和Lambda表达式',
                    code: '// 函数指针\nint add(int a, int b) { return a + b; }\nint subtract(int a, int b) { return a - b; }\n\nint (*operation)(int, int) = add;\nint result = operation(5, 3);  // 8\n\noperation = subtract;\nresult = operation(5, 3);      // 2\n\n// Lambda表达式（C++11）\nauto lambda = [](int x, int y) { return x + y; };\nint sum = lambda(3, 4);        // 7\n\n// 捕获变量\nint multiplier = 10;\nauto multiply = [multiplier](int x) { return x * multiplier; };\nint result2 = multiply(5);     // 50\n\n// 捕获方式\nauto by_value = [=](int x) { return x + multiplier; };     // 按值捕获\nauto by_ref = [&](int x) { return x + multiplier; };       // 按引用捕获\nauto mixed = [=, &multiplier](int x) { return x + multiplier; };  // 混合捕获'
                },
                {
                    title: '模板函数',
                    description: '函数模板',
                    code: '// 函数模板\ntemplate<typename T>\nT max(T a, T b) {\n    return (a > b) ? a : b;\n}\n\n// 使用\nint maxInt = max(10, 20);\ndouble maxDouble = max(3.14, 2.71);\nstd::string maxStr = max(std::string("hello"), std::string("world"));\n\n// 多个模板参数\ntemplate<typename T, typename U>\nauto add(T a, U b) -> decltype(a + b) {\n    return a + b;\n}\n\n// 模板特化\ntemplate<>\nconst char* max<const char*>(const char* a, const char* b) {\n    return (strcmp(a, b) > 0) ? a : b;\n}\n\n// 可变参数模板（C++11）\ntemplate<typename... Args>\nvoid print(Args... args) {\n    ((std::cout << args << " "), ...);  // C++17折叠表达式\n    std::cout << std::endl;\n}'
                }
            ]
        },
        {
            title: '面向对象',
            items: [
                {
                    title: '类和对象',
                    description: '类的定义和使用',
                    code: '// 类定义\nclass Person {\nprivate:\n    std::string name;\n    int age;\n\npublic:\n    // 构造函数\n    Person() : name("Unknown"), age(0) {}\n    Person(const std::string& n, int a) : name(n), age(a) {}\n    \n    // 拷贝构造函数\n    Person(const Person& other) : name(other.name), age(other.age) {}\n    \n    // 析构函数\n    ~Person() {\n        std::cout << "Person destroyed" << std::endl;\n    }\n    \n    // 成员函数\n    void setName(const std::string& n) { name = n; }\n    std::string getName() const { return name; }\n    \n    void setAge(int a) { age = a; }\n    int getAge() const { return age; }\n    \n    void introduce() const {\n        std::cout << "Hi, I\'m " << name << ", " << age << " years old." << std::endl;\n    }\n};\n\n// 对象创建\nPerson person1;\nPerson person2("Alice", 25);\nPerson* person3 = new Person("Bob", 30);\ndelete person3;'
                },
                {
                    title: '继承',
                    description: '类的继承和多态',
                    code: '// 基类\nclass Animal {\nprotected:\n    std::string name;\n\npublic:\n    Animal(const std::string& n) : name(n) {}\n    \n    virtual void makeSound() const {\n        std::cout << "Some sound" << std::endl;\n    }\n    \n    virtual ~Animal() = default;  // 虚析构函数\n};\n\n// 派生类\nclass Dog : public Animal {\nprivate:\n    std::string breed;\n\npublic:\n    Dog(const std::string& n, const std::string& b) \n        : Animal(n), breed(b) {}\n    \n    void makeSound() const override {\n        std::cout << "Woof!" << std::endl;\n    }\n    \n    void wagTail() const {\n        std::cout << name << " is wagging tail" << std::endl;\n    }\n};\n\n// 多态使用\nAnimal* animal = new Dog("Buddy", "Golden Retriever");\nanimal->makeSound();  // 输出"Woof!"\ndelete animal;'
                },
                {
                    title: '运算符重载',
                    description: '重载运算符',
                    code: 'class Vector2D {\nprivate:\n    double x, y;\n\npublic:\n    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}\n    \n    // 加法运算符\n    Vector2D operator+(const Vector2D& other) const {\n        return Vector2D(x + other.x, y + other.y);\n    }\n    \n    // 赋值运算符\n    Vector2D& operator=(const Vector2D& other) {\n        if (this != &other) {\n            x = other.x;\n            y = other.y;\n        }\n        return *this;\n    }\n    \n    // 比较运算符\n    bool operator==(const Vector2D& other) const {\n        return x == other.x && y == other.y;\n    }\n    \n    // 输出运算符（友元函数）\n    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v) {\n        os << "(" << v.x << ", " << v.y << ")";\n        return os;\n    }\n    \n    // 下标运算符\n    double& operator[](int index) {\n        return (index == 0) ? x : y;\n    }\n};'
                }
            ]
        },
        {
            title: 'STL容器',
            items: [
                {
                    title: 'vector',
                    description: '动态数组',
                    code: '#include <vector>\n\n// 创建vector\nstd::vector<int> vec;\nstd::vector<int> vec2(5);        // 5个元素，默认值0\nstd::vector<int> vec3(5, 10);    // 5个元素，值为10\nstd::vector<int> vec4 = {1, 2, 3, 4, 5};\n\n// 添加元素\nvec.push_back(10);\nvec.push_back(20);\nvec.emplace_back(30);  // C++11，就地构造\n\n// 访问元素\nint first = vec[0];\nint second = vec.at(1);  // 带边界检查\nint last = vec.back();\nint* data = vec.data();  // 获取底层数组指针\n\n// 大小和容量\nsize_t size = vec.size();\nsize_t capacity = vec.capacity();\nbool empty = vec.empty();\n\n// 遍历\nfor (size_t i = 0; i < vec.size(); i++) {\n    std::cout << vec[i] << " ";\n}\n\nfor (const auto& item : vec) {\n    std::cout << item << " ";\n}'
                },
                {
                    title: 'map和unordered_map',
                    description: '关联容器',
                    code: '#include <map>\n#include <unordered_map>\n\n// map（有序）\nstd::map<std::string, int> ages;\nages["Alice"] = 25;\nages["Bob"] = 30;\nages.insert({"Charlie", 35});\n\n// 查找\nauto it = ages.find("Alice");\nif (it != ages.end()) {\n    std::cout << it->first << ": " << it->second << std::endl;\n}\n\n// 遍历\nfor (const auto& pair : ages) {\n    std::cout << pair.first << ": " << pair.second << std::endl;\n}\n\n// unordered_map（哈希表）\nstd::unordered_map<std::string, int> scores;\nscores["Math"] = 95;\nscores["English"] = 87;\n\n// 检查键是否存在\nif (scores.count("Math") > 0) {\n    std::cout << "Math score: " << scores["Math"] << std::endl;\n}\n\n// 删除元素\nages.erase("Bob");\nscores.clear();'
                },
                {
                    title: 'set和list',
                    description: '集合和链表',
                    code: '#include <set>\n#include <list>\n\n// set（有序，唯一）\nstd::set<int> numbers;\nnumbers.insert(3);\nnumbers.insert(1);\nnumbers.insert(2);\nnumbers.insert(1);  // 重复元素不会插入\n\n// 查找\nif (numbers.find(2) != numbers.end()) {\n    std::cout << "Found 2" << std::endl;\n}\n\n// 遍历（自动排序）\nfor (const auto& num : numbers) {\n    std::cout << num << " ";  // 输出: 1 2 3\n}\n\n// list（双向链表）\nstd::list<std::string> names;\nnames.push_back("Alice");\nnames.push_front("Bob");\nnames.insert(names.begin(), "Charlie");\n\n// 排序\nnames.sort();\n\n// 删除\nnames.remove("Bob");\nnames.pop_front();\nnames.pop_back();'
                }
            ]
        },
        {
            title: 'STL算法',
            items: [
                {
                    title: '查找和排序',
                    description: '常用算法',
                    code: '#include <algorithm>\n#include <vector>\n\nstd::vector<int> vec = {5, 2, 8, 1, 9, 3};\n\n// 排序\nstd::sort(vec.begin(), vec.end());\nstd::sort(vec.begin(), vec.end(), std::greater<int>());  // 降序\n\n// 查找\nauto it = std::find(vec.begin(), vec.end(), 5);\nif (it != vec.end()) {\n    std::cout << "Found at position: " << std::distance(vec.begin(), it) << std::endl;\n}\n\n// 二分查找（需要有序）\nbool found = std::binary_search(vec.begin(), vec.end(), 5);\n\n// 计数\nint count = std::count(vec.begin(), vec.end(), 5);\n\n// 最大最小值\nauto minIt = std::min_element(vec.begin(), vec.end());\nauto maxIt = std::max_element(vec.begin(), vec.end());\n\n// 累加\nint sum = std::accumulate(vec.begin(), vec.end(), 0);'
                },
                {
                    title: '变换和操作',
                    description: '元素变换',
                    code: '#include <algorithm>\n#include <vector>\n#include <functional>\n\nstd::vector<int> vec = {1, 2, 3, 4, 5};\nstd::vector<int> result(vec.size());\n\n// 变换\nstd::transform(vec.begin(), vec.end(), result.begin(), \n               [](int x) { return x * x; });\n\n// 复制\nstd::vector<int> copy(vec.size());\nstd::copy(vec.begin(), vec.end(), copy.begin());\n\n// 填充\nstd::fill(vec.begin(), vec.end(), 0);\nstd::fill_n(vec.begin(), 3, 42);\n\n// 条件操作\nstd::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n\n// 查找满足条件的元素\nauto it = std::find_if(numbers.begin(), numbers.end(), \n                       [](int x) { return x > 5; });\n\n// 计算满足条件的元素数量\nint evenCount = std::count_if(numbers.begin(), numbers.end(), \n                              [](int x) { return x % 2 == 0; });\n\n// 检查是否所有元素都满足条件\nbool allPositive = std::all_of(numbers.begin(), numbers.end(), \n                               [](int x) { return x > 0; });'
                }
            ]
        },
        {
            title: '内存管理',
            items: [
                {
                    title: '智能指针',
                    description: 'C++11智能指针',
                    code: '#include <memory>\n\n// unique_ptr（独占所有权）\nstd::unique_ptr<int> ptr1 = std::make_unique<int>(42);\nstd::unique_ptr<int> ptr2 = std::move(ptr1);  // 转移所有权\n\n// shared_ptr（共享所有权）\nstd::shared_ptr<int> sptr1 = std::make_shared<int>(100);\nstd::shared_ptr<int> sptr2 = sptr1;  // 共享所有权\nstd::cout << "引用计数: " << sptr1.use_count() << std::endl;\n\n// weak_ptr（弱引用）\nstd::weak_ptr<int> wptr = sptr1;\nif (auto locked = wptr.lock()) {\n    std::cout << "值: " << *locked << std::endl;\n}\n\n// 自定义删除器\nauto deleter = [](int* p) {\n    std::cout << "删除: " << *p << std::endl;\n    delete p;\n};\nstd::unique_ptr<int, decltype(deleter)> ptr3(new int(200), deleter);\n\n// 数组智能指针\nstd::unique_ptr<int[]> arr = std::make_unique<int[]>(10);'
                },
                {
                    title: 'RAII和异常安全',
                    description: '资源管理',
                    code: '// RAII类示例\nclass FileHandler {\nprivate:\n    FILE* file;\n\npublic:\n    FileHandler(const char* filename, const char* mode) {\n        file = fopen(filename, mode);\n        if (!file) {\n            throw std::runtime_error("无法打开文件");\n        }\n    }\n    \n    ~FileHandler() {\n        if (file) {\n            fclose(file);\n        }\n    }\n    \n    // 禁止拷贝\n    FileHandler(const FileHandler&) = delete;\n    FileHandler& operator=(const FileHandler&) = delete;\n    \n    // 允许移动\n    FileHandler(FileHandler&& other) noexcept : file(other.file) {\n        other.file = nullptr;\n    }\n    \n    FILE* get() const { return file; }\n};\n\n// 使用\ntry {\n    FileHandler fh("data.txt", "r");\n    // 使用文件...\n} catch (const std::exception& e) {\n    std::cerr << "错误: " << e.what() << std::endl;\n}\n// 文件自动关闭'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CPP_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.CPP_CHEATSHEET = CPP_CHEATSHEET;
}