const swiftQuickRef = {
    title: 'Swift 快速参考',
    description: 'Swift 编程语言快速参考指南',
    sections: [
        {
            title: '基本语法',
            items: [
                {
                    title: '变量和常量',
                    code: `// 变量
var name = "John"
var age = 25
var price: Double = 19.99

// 常量
let pi = 3.14159
let maxCount = 100

// 类型注解
var message: String = "Hello"
var numbers: [Int] = [1, 2, 3]`
                },
                {
                    title: '基本数据类型',
                    code: `// 整数
let smallNumber: Int8 = 127
let bigNumber: Int64 = 9223372036854775807

// 浮点数
let floatNumber: Float = 3.14
let doubleNumber: Double = 3.141592653589793

// 布尔值
let isTrue: Bool = true
let isFalse: Bool = false

// 字符和字符串
let character: Character = "A"
let string: String = "Hello, Swift!"`
                },
                {
                    title: '字符串操作',
                    code: `let str = "Hello, World!"

// 字符串插值
let name = "Swift"
let greeting = "Hello, \(name)!"

// 字符串方法
let length = str.count
let uppercase = str.uppercased()
let lowercase = str.lowercased()
let hasPrefix = str.hasPrefix("Hello")
let hasSuffix = str.hasSuffix("World!")`
                }
            ]
        },
        {
            title: '控制流',
            items: [
                {
                    title: '条件语句',
                    code: `// if-else
if condition {
    // code
} else if anotherCondition {
    // code
} else {
    // code
}

// switch
switch value {
case 1:
    print("One")
case 2, 3:
    print("Two or Three")
case 4...10:
    print("Four to Ten")
default:
    print("Other")
}`
                },
                {
                    title: '循环',
                    code: `// for-in循环
for i in 1...5 {
    print(i)
}

// 遍历数组
let names = ["Alice", "Bob", "Charlie"]
for name in names {
    print(name)
}

// while循环
while condition {
    // code
}

// repeat-while循环
repeat {
    // code
} while condition`
                }
            ]
        },
        {
            title: '集合类型',
            items: [
                {
                    title: '数组',
                    code: `// 数组声明
var numbers: [Int] = [1, 2, 3, 4, 5]
var names = ["Alice", "Bob", "Charlie"]
var emptyArray: [String] = []

// 数组操作
numbers.append(6)
numbers.insert(0, at: 0)
numbers.remove(at: 1)
let first = numbers.first
let count = numbers.count`
                },
                {
                    title: '字典',
                    code: `// 字典声明
var scores: [String: Int] = ["Alice": 95, "Bob": 87]
var emptyDict: [String: Int] = [:]

// 字典操作
scores["Charlie"] = 92
scores.updateValue(90, forKey: "Alice")
scores.removeValue(forKey: "Bob")
let aliceScore = scores["Alice"]`
                },
                {
                    title: '集合',
                    code: `// Set声明
var uniqueNumbers: Set<Int> = [1, 2, 3, 4, 5]
var colors: Set = ["red", "green", "blue"]

// Set操作
uniqueNumbers.insert(6)
uniqueNumbers.remove(1)
let contains = uniqueNumbers.contains(3)
let count = uniqueNumbers.count`
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数定义',
                    code: `// 基本函数
func greet(name: String) -> String {
    return "Hello, \(name)!"
}

// 无返回值函数
func printMessage(_ message: String) {
    print(message)
}

// 多参数函数
func add(_ a: Int, to b: Int) -> Int {
    return a + b
}

// 调用函数
let greeting = greet(name: "Swift")
printMessage("Hello")
let sum = add(5, to: 3)`
                },
                {
                    title: '闭包',
                    code: `// 闭包语法
let multiply = { (a: Int, b: Int) -> Int in
    return a * b
}

// 简化闭包
let numbers = [1, 2, 3, 4, 5]
let doubled = numbers.map { $0 * 2 }
let filtered = numbers.filter { $0 > 2 }
let sum = numbers.reduce(0) { $0 + $1 }`
                }
            ]
        },
        {
            title: '面向对象编程',
            items: [
                {
                    title: '类和结构体',
                    code: `// 结构体
struct Point {
    var x: Double
    var y: Double
    
    func distance(to other: Point) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        return sqrt(dx*dx + dy*dy)
    }
}

// 类
class Person {
    var name: String
    var age: Int
    
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    
    func introduce() {
        print("Hi, I'm \(name), \(age) years old")
    }
}`
                },
                {
                    title: '继承',
                    code: `class Student: Person {
    var school: String
    
    init(name: String, age: Int, school: String) {
        self.school = school
        super.init(name: name, age: age)
    }
    
    override func introduce() {
        print("Hi, I'm \(name), \(age) years old, studying at \(school)")
    }
}`
                },
                {
                    title: '协议',
                    code: `protocol Drawable {
    func draw()
    var area: Double { get }
}

struct Circle: Drawable {
    var radius: Double
    
    func draw() {
        print("Drawing a circle")
    }
    
    var area: Double {
        return Double.pi * radius * radius
    }
}`
                }
            ]
        },
        {
            title: '可选类型',
            items: [
                {
                    title: '可选值',
                    code: `// 可选类型声明
var optionalName: String? = "John"
var optionalAge: Int? = nil

// 强制解包
if optionalName != nil {
    print(optionalName!)
}

// 可选绑定
if let name = optionalName {
    print("Name is \(name)")
}

// 空合并运算符
let displayName = optionalName ?? "Unknown"`
                },
                {
                    title: '隐式解包可选类型',
                    code: `// 隐式解包可选类型
var implicitlyUnwrapped: String! = "Hello"
print(implicitlyUnwrapped) // 自动解包

// guard语句
func processName(_ name: String?) {
    guard let validName = name else {
        print("Name is nil")
        return
    }
    print("Processing \(validName)")
}`
                }
            ]
        },
        {
            title: '错误处理',
            items: [
                {
                    title: '错误定义和抛出',
                    code: `// 定义错误类型
enum ValidationError: Error {
    case tooShort
    case tooLong
    case invalidCharacter
}

// 抛出错误的函数
func validatePassword(_ password: String) throws {
    if password.count < 6 {
        throw ValidationError.tooShort
    }
    if password.count > 20 {
        throw ValidationError.tooLong
    }
}`
                },
                {
                    title: '错误处理',
                    code: `// do-catch处理错误
do {
    try validatePassword("123")
    print("Password is valid")
} catch ValidationError.tooShort {
    print("Password is too short")
} catch ValidationError.tooLong {
    print("Password is too long")
} catch {
    print("Unknown error: \(error)")
}

// try?和try!
let result = try? validatePassword("password")
let forceResult = try! validatePassword("validpassword")`
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = swiftQuickRef;
}