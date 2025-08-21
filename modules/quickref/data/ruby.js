const rubyQuickRef = {
    title: 'Ruby 快速参考',
    description: 'Ruby 编程语言快速参考指南',
    sections: [
        {
            title: '基本语法',
            items: [
                {
                    title: '变量和常量',
                    code: `# 变量
name = "John"
age = 25
price = 19.99

# 常量
PI = 3.14159
MAX_COUNT = 100

# 全局变量
$global_var = "I'm global"

# 实例变量
@instance_var = "I'm an instance variable"

# 类变量
@@class_var = "I'm a class variable"`
                },
                {
                    title: '基本数据类型',
                    code: `# 数字
integer = 42
float = 3.14
big_number = 123_456_789

# 字符串
single_quoted = 'Hello'
double_quoted = "World"
multiline = <<~TEXT
  This is a
  multiline string
TEXT

# 布尔值
is_true = true
is_false = false

# 符号
symbol = :name
another_symbol = :"with spaces"`
                },
                {
                    title: '字符串操作',
                    code: `str = "Hello, World!"

# 字符串插值
name = "Ruby"
greeting = "Hello, #{name}!"
expression = "Result: #{2 + 3}"

# 字符串方法
length = str.length
uppercase = str.upcase
lowercase = str.downcase
reversed = str.reverse
starts_with = str.start_with?("Hello")
ends_with = str.end_with?("World!")
substring = str[0, 5]`
                }
            ]
        },
        {
            title: '控制流',
            items: [
                {
                    title: '条件语句',
                    code: `# if-elsif-else
if condition
  # code
elsif another_condition
  # code
else
  # code
end

# 单行if
puts "Hello" if condition

# unless
unless condition
  # code when condition is false
end

# case-when
case value
when 1
  puts "One"
when 2, 3
  puts "Two or Three"
when 4..10
  puts "Four to Ten"
else
  puts "Other"
end`
                },
                {
                    title: '循环',
                    code: `# times循环
5.times do |i|
  puts i
end

# each循环
[1, 2, 3, 4, 5].each do |num|
  puts num
end

# for循环
for i in 1..5
  puts i
end

# while循环
while condition
  # code
end

# until循环
until condition
  # code
end

# loop循环
loop do
  # code
  break if condition
end`
                }
            ]
        },
        {
            title: '数据结构',
            items: [
                {
                    title: '数组',
                    code: `# 数组创建
numbers = [1, 2, 3, 4, 5]
names = %w[Alice Bob Charlie]
mixed = [1, "hello", 3.14, true]

# 数组操作
numbers << 6              # 添加元素
numbers.push(7)           # 添加元素
first = numbers.first     # 第一个元素
last = numbers.last       # 最后一个元素
length = numbers.length   # 数组长度
contains = numbers.include?(3)  # 是否包含

# 数组方法
doubled = numbers.map { |n| n * 2 }
filtered = numbers.select { |n| n > 2 }
sum = numbers.reduce(:+)`
                },
                {
                    title: '哈希',
                    code: `# 哈希创建
scores = { "Alice" => 95, "Bob" => 87 }
symbols = { alice: 95, bob: 87 }
empty_hash = {}

# 哈希操作
scores["Charlie"] = 92    # 添加键值对
alice_score = scores["Alice"]  # 获取值
scores.delete("Bob")      # 删除键值对
has_key = scores.key?("Alice")  # 是否有键

# 哈希方法
keys = scores.keys
values = scores.values
scores.each do |name, score|
  puts "#{name}: #{score}"
end`
                },
                {
                    title: '范围',
                    code: `# 范围创建
range1 = 1..10      # 包含10
range2 = 1...10     # 不包含10
char_range = 'a'..'z'

# 范围操作
array = (1..5).to_a     # [1, 2, 3, 4, 5]
includes = range1.include?(5)  # true
range1.each { |i| puts i }

# 范围用于case
case age
when 0..12
  "Child"
when 13..19
  "Teenager"
else
  "Adult"
end`
                }
            ]
        },
        {
            title: '方法',
            items: [
                {
                    title: '方法定义',
                    code: `# 基本方法
def greet(name)
  "Hello, #{name}!"
end

# 带默认参数的方法
def greet_with_default(name = "World")
  "Hello, #{name}!"
end

# 可变参数
def sum(*numbers)
  numbers.reduce(:+)
end

# 关键字参数
def create_user(name:, age:, email: nil)
  { name: name, age: age, email: email }
end

# 调用方法
greeting = greet("Ruby")
user = create_user(name: "John", age: 25)`
                },
                {
                    title: '块和迭代器',
                    code: `# 块语法
[1, 2, 3].each { |num| puts num }

[1, 2, 3].each do |num|
  puts "Number: #{num}"
end

# 自定义方法接受块
def my_method
  yield if block_given?
end

my_method { puts "Hello from block!" }

# 块参数
def repeat(times)
  times.times { |i| yield(i) }
end

repeat(3) { |i| puts "Iteration #{i}" }`
                }
            ]
        },
        {
            title: '面向对象编程',
            items: [
                {
                    title: '类和对象',
                    code: `# 类定义
class Person
  # 类变量
  @@count = 0
  
  # 初始化方法
  def initialize(name, age)
    @name = name  # 实例变量
    @age = age
    @@count += 1
  end
  
  # 实例方法
  def introduce
    "Hi, I'm #{@name}, #{@age} years old"
  end
  
  # 类方法
  def self.count
    @@count
  end
  
  # 访问器方法
  attr_reader :name
  attr_writer :age
  attr_accessor :email
end

# 创建对象
person = Person.new("John", 25)
puts person.introduce`
                },
                {
                    title: '继承',
                    code: `# 继承
class Student < Person
  def initialize(name, age, school)
    super(name, age)  # 调用父类构造方法
    @school = school
  end
  
  def introduce
    "#{super} I study at #{@school}"
  end
  
  def study
    "#{@name} is studying"
  end
end

student = Student.new("Alice", 20, "MIT")
puts student.introduce`
                },
                {
                    title: '模块',
                    code: `# 模块定义
module Greetings
  def say_hello
    "Hello!"
  end
  
  def say_goodbye
    "Goodbye!"
  end
end

# 包含模块
class Person
  include Greetings
end

person = Person.new
puts person.say_hello

# 扩展模块
class Person
  extend Greetings
end

puts Person.say_hello`
                }
            ]
        },
        {
            title: '异常处理',
            items: [
                {
                    title: '异常处理',
                    code: `# begin-rescue-end
begin
  # 可能出错的代码
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Cannot divide by zero: #{e.message}"
rescue StandardError => e
  puts "An error occurred: #{e.message}"
ensure
  puts "This always executes"
end

# 方法中的异常处理
def safe_divide(a, b)
  a / b
rescue ZeroDivisionError
  "Cannot divide by zero"
end`
                },
                {
                    title: '抛出异常',
                    code: `# 抛出异常
def validate_age(age)
  raise ArgumentError, "Age must be positive" if age < 0
  raise "Age cannot be greater than 150" if age > 150
end

# 自定义异常
class CustomError < StandardError
end

def risky_method
  raise CustomError, "Something went wrong"
end`
                }
            ]
        },
        {
            title: '文件操作',
            items: [
                {
                    title: '文件读写',
                    code: `# 读取文件
content = File.read("file.txt")

# 逐行读取
File.foreach("file.txt") do |line|
  puts line
end

# 写入文件
File.write("output.txt", "Hello, World!")

# 打开文件
File.open("file.txt", "r") do |file|
  content = file.read
end

# 追加到文件
File.open("file.txt", "a") do |file|
  file.puts "New line"
end`
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = rubyQuickRef;
}