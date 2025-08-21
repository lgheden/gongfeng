const kotlinQuickRef = {
    title: 'Kotlin 快速参考',
    description: 'Kotlin 编程语言快速参考指南',
    sections: [
        {
            title: '基本语法',
            items: [
                {
                    title: '变量声明',
                    code: `// 可变变量
var name = "John"
var age: Int = 25
var price: Double = 19.99

// 不可变变量
val pi = 3.14159
val maxCount = 100

// 类型推断
val message = "Hello" // String
val number = 42       // Int`
                },
                {
                    title: '基本数据类型',
                    code: `// 数字类型
val byte: Byte = 127
val short: Short = 32767
val int: Int = 2147483647
val long: Long = 9223372036854775807L
val float: Float = 3.14f
val double: Double = 3.141592653589793

// 其他类型
val char: Char = 'A'
val boolean: Boolean = true
val string: String = "Hello, Kotlin!"`
                },
                {
                    title: '字符串操作',
                    code: `val str = "Hello, World!"

// 字符串模板
val name = "Kotlin"
val greeting = "Hello, $name!"
val expression = "Result: ${2 + 3}"

// 字符串方法
val length = str.length
val uppercase = str.uppercase()
val lowercase = str.lowercase()
val startsWith = str.startsWith("Hello")
val endsWith = str.endsWith("World!")`
                }
            ]
        },
        {
            title: '控制流',
            items: [
                {
                    title: '条件语句',
                    code: `// if表达式
val max = if (a > b) a else b

// when表达式
val result = when (x) {
    1 -> "One"
    2, 3 -> "Two or Three"
    in 4..10 -> "Four to Ten"
    is String -> "It's a string"
    else -> "Other"
}

// when作为语句
when (day) {
    "Monday" -> println("Start of work week")
    "Friday" -> println("TGIF!")
    "Saturday", "Sunday" -> println("Weekend!")
    else -> println("Midweek")
}`
                },
                {
                    title: '循环',
                    code: `// for循环
for (i in 1..5) {
    println(i)
}

// 遍历集合
val items = listOf("apple", "banana", "cherry")
for (item in items) {
    println(item)
}

// 带索引遍历
for ((index, value) in items.withIndex()) {
    println("$index: $value")
}

// while循环
while (condition) {
    // code
}

// do-while循环
do {
    // code
} while (condition)`
                }
            ]
        },
        {
            title: '集合',
            items: [
                {
                    title: 'List',
                    code: `// 不可变列表
val readOnlyList = listOf("a", "b", "c")
val numbers = listOf(1, 2, 3, 4, 5)

// 可变列表
val mutableList = mutableListOf("a", "b", "c")
mutableList.add("d")
mutableList.remove("a")

// 列表操作
val first = numbers.first()
val last = numbers.last()
val size = numbers.size
val contains = numbers.contains(3)`
                },
                {
                    title: 'Map',
                    code: `// 不可变映射
val readOnlyMap = mapOf("key1" to "value1", "key2" to "value2")
val scores = mapOf("Alice" to 95, "Bob" to 87)

// 可变映射
val mutableMap = mutableMapOf("key1" to "value1")
mutableMap["key2"] = "value2"
mutableMap.remove("key1")

// 映射操作
val value = scores["Alice"]
val keys = scores.keys
val values = scores.values`
                },
                {
                    title: 'Set',
                    code: `// 不可变集合
val readOnlySet = setOf("a", "b", "c")
val uniqueNumbers = setOf(1, 2, 3, 4, 5)

// 可变集合
val mutableSet = mutableSetOf("a", "b", "c")
mutableSet.add("d")
mutableSet.remove("a")

// 集合操作
val size = uniqueNumbers.size
val contains = uniqueNumbers.contains(3)`
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数定义',
                    code: `// 基本函数
fun greet(name: String): String {
    return "Hello, $name!"
}

// 单表达式函数
fun add(a: Int, b: Int) = a + b

// 无返回值函数
fun printMessage(message: String): Unit {
    println(message)
}

// 默认参数
fun greetWithDefault(name: String = "World") = "Hello, $name!"

// 命名参数
fun createUser(name: String, age: Int, email: String) { }
val user = createUser(name = "John", email = "john@example.com", age = 25)`
                },
                {
                    title: '高阶函数和Lambda',
                    code: `// Lambda表达式
val sum = { a: Int, b: Int -> a + b }
val result = sum(5, 3)

// 高阶函数
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val addResult = calculate(5, 3) { x, y -> x + y }
val multiplyResult = calculate(5, 3) { x, y -> x * y }

// 集合操作
val numbers = listOf(1, 2, 3, 4, 5)
val doubled = numbers.map { it * 2 }
val filtered = numbers.filter { it > 2 }
val sum = numbers.reduce { acc, n -> acc + n }`
                }
            ]
        },
        {
            title: '面向对象编程',
            items: [
                {
                    title: '类和对象',
                    code: `// 基本类
class Person(val name: String, var age: Int) {
    fun introduce() {
        println("Hi, I'm $name, $age years old")
    }
}

// 创建对象
val person = Person("John", 25)
person.introduce()

// 数据类
data class User(val id: Int, val name: String, val email: String)

val user = User(1, "Alice", "alice@example.com")
println(user) // 自动生成toString()`
                },
                {
                    title: '继承',
                    code: `// 开放类（可被继承）
open class Animal(val name: String) {
    open fun makeSound() {
        println("$name makes a sound")
    }
}

// 继承
class Dog(name: String, val breed: String) : Animal(name) {
    override fun makeSound() {
        println("$name barks")
    }
    
    fun wagTail() {
        println("$name wags tail")
    }
}`
                },
                {
                    title: '接口',
                    code: `// 接口定义
interface Drawable {
    fun draw()
    fun getArea(): Double
}

// 实现接口
class Circle(val radius: Double) : Drawable {
    override fun draw() {
        println("Drawing a circle")
    }
    
    override fun getArea(): Double {
        return Math.PI * radius * radius
    }
}`
                }
            ]
        },
        {
            title: '空安全',
            items: [
                {
                    title: '可空类型',
                    code: `// 可空类型声明
var nullableName: String? = "John"
nullableName = null

// 安全调用操作符
val length = nullableName?.length

// Elvis操作符
val displayName = nullableName ?: "Unknown"

// 非空断言
val definitelyNotNull = nullableName!!

// 安全转换
val stringValue: String? = value as? String`
                },
                {
                    title: '空检查',
                    code: `// if检查
if (nullableName != null) {
    println(nullableName.length) // 智能转换
}

// let函数
nullableName?.let {
    println("Name is $it")
    println("Length is \${it.length}")
}

// 安全链式调用
val result = person?.address?.street?.length`
                }
            ]
        },
        {
            title: '扩展函数',
            items: [
                {
                    title: '扩展函数定义',
                    code: `// 为String添加扩展函数
fun String.isPalindrome(): Boolean {
    return this == this.reversed()
}

// 使用扩展函数
val text = "racecar"
val result = text.isPalindrome() // true

// 为List添加扩展函数
fun <T> List<T>.secondOrNull(): T? {
    return if (this.size >= 2) this[1] else null
}

val numbers = listOf(1, 2, 3)
val second = numbers.secondOrNull() // 2`
                },
                {
                    title: '扩展属性',
                    code: `// 为String添加扩展属性
val String.lastChar: Char?
    get() = if (isEmpty()) null else this[length - 1]

// 使用扩展属性
val text = "Hello"
val lastChar = text.lastChar // 'o'

// 为List添加扩展属性
val <T> List<T>.penultimate: T
    get() = this[size - 2]

val items = listOf("a", "b", "c")
val penultimate = items.penultimate // "b"`
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = kotlinQuickRef;
}