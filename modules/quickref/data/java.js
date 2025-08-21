/**
 * Java 快速参考数据
 * 基于 quickref.me 的 Java 参考内容
 */

const JAVA_CHEATSHEET = {
    id: 'java',
    title: 'Java',
    description: 'Java 是一种面向对象的编程语言',
    icon: '☕',
    category: 'backend',
    sections: [
        {
            title: '基础语法',
            items: [
                {
                    title: 'Hello World',
                    description: 'Java程序基本结构',
                    code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
                },
                {
                    title: '变量声明',
                    description: '基本数据类型',
                    code: '// 整数类型\nint age = 25;\nlong population = 7800000000L;\nshort year = 2023;\nbyte level = 100;\n\n// 浮点类型\nfloat price = 19.99f;\ndouble pi = 3.14159;\n\n// 字符和布尔\nchar grade = \'A\';\nboolean isActive = true;\n\n// 字符串\nString name = "John Doe";'
                },
                {
                    title: '常量',
                    description: 'final关键字',
                    code: '// 常量声明\nfinal int MAX_SIZE = 100;\nfinal double PI = 3.14159;\nfinal String APP_NAME = "MyApp";\n\n// 静态常量\npublic static final int DEFAULT_TIMEOUT = 30;'
                },
                {
                    title: '运算符',
                    description: '算术、比较、逻辑运算符',
                    code: '// 算术运算符\nint a = 10, b = 3;\nint sum = a + b;        // 13\nint diff = a - b;       // 7\nint product = a * b;    // 30\nint quotient = a / b;   // 3\nint remainder = a % b;  // 1\n\n// 比较运算符\nboolean equal = (a == b);     // false\nboolean notEqual = (a != b);  // true\nboolean greater = (a > b);    // true\n\n// 逻辑运算符\nboolean and = true && false;  // false\nboolean or = true || false;   // true\nboolean not = !true;          // false'
                }
            ]
        },
        {
            title: '控制结构',
            items: [
                {
                    title: '条件语句',
                    description: 'if-else语句',
                    code: '// if-else\nint score = 85;\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else if (score >= 70) {\n    System.out.println("C");\n} else {\n    System.out.println("F");\n}\n\n// 三元运算符\nString result = (score >= 60) ? "Pass" : "Fail";'
                },
                {
                    title: 'Switch语句',
                    description: '多分支选择',
                    code: 'int day = 3;\nswitch (day) {\n    case 1:\n        System.out.println("Monday");\n        break;\n    case 2:\n        System.out.println("Tuesday");\n        break;\n    case 3:\n        System.out.println("Wednesday");\n        break;\n    default:\n        System.out.println("Other day");\n        break;\n}\n\n// Java 14+ Switch表达式\nString dayName = switch (day) {\n    case 1 -> "Monday";\n    case 2 -> "Tuesday";\n    case 3 -> "Wednesday";\n    default -> "Other day";\n};'
                },
                {
                    title: '循环语句',
                    description: 'for、while、do-while循环',
                    code: '// for循环\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n\n// 增强for循环\nint[] numbers = {1, 2, 3, 4, 5};\nfor (int num : numbers) {\n    System.out.println(num);\n}\n\n// while循环\nint i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n    i++;\n}\n\n// do-while循环\nint j = 0;\ndo {\n    System.out.println(j);\n    j++;\n} while (j < 5);'
                }
            ]
        },
        {
            title: '数组',
            items: [
                {
                    title: '数组声明和初始化',
                    description: '一维和多维数组',
                    code: '// 一维数组\nint[] numbers = new int[5];\nint[] values = {1, 2, 3, 4, 5};\nString[] names = new String[]{"Alice", "Bob", "Charlie"};\n\n// 多维数组\nint[][] matrix = new int[3][4];\nint[][] grid = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\n// 数组长度\nint length = numbers.length;\nint rows = grid.length;\nint cols = grid[0].length;'
                },
                {
                    title: '数组操作',
                    description: '遍历和操作数组',
                    code: 'int[] arr = {1, 2, 3, 4, 5};\n\n// 遍历数组\nfor (int i = 0; i < arr.length; i++) {\n    System.out.println(arr[i]);\n}\n\n// 增强for循环\nfor (int value : arr) {\n    System.out.println(value);\n}\n\n// 数组工具类\nimport java.util.Arrays;\n\n// 排序\nArrays.sort(arr);\n\n// 查找\nint index = Arrays.binarySearch(arr, 3);\n\n// 转换为字符串\nString str = Arrays.toString(arr);\n\n// 复制数组\nint[] copy = Arrays.copyOf(arr, arr.length);'
                }
            ]
        },
        {
            title: '字符串',
            items: [
                {
                    title: '字符串基础',
                    description: 'String类基本操作',
                    code: '// 字符串创建\nString str1 = "Hello";\nString str2 = new String("World");\nString str3 = String.valueOf(123);\n\n// 字符串连接\nString result = str1 + " " + str2;\nString formatted = String.format("Hello %s, age %d", "John", 25);\n\n// 字符串比较\nboolean equal = str1.equals(str2);\nboolean equalIgnoreCase = str1.equalsIgnoreCase(str2);\nint comparison = str1.compareTo(str2);'
                },
                {
                    title: '字符串方法',
                    description: '常用字符串方法',
                    code: 'String text = "  Hello World  ";\n\n// 长度和字符\nint length = text.length();\nchar ch = text.charAt(2);\n\n// 查找\nint index = text.indexOf("World");\nboolean contains = text.contains("Hello");\nboolean startsWith = text.startsWith("Hello");\nboolean endsWith = text.endsWith("World");\n\n// 转换\nString upper = text.toUpperCase();\nString lower = text.toLowerCase();\nString trimmed = text.trim();\n\n// 替换\nString replaced = text.replace("World", "Java");\nString regex = text.replaceAll("\\\\s+", " ");\n\n// 分割\nString[] parts = text.split(" ");'
                },
                {
                    title: 'StringBuilder',
                    description: '可变字符串',
                    code: '// StringBuilder创建\nStringBuilder sb = new StringBuilder();\nStringBuilder sb2 = new StringBuilder("Initial");\n\n// 添加内容\nsb.append("Hello");\nsb.append(" ");\nsb.append("World");\nsb.append(123);\n\n// 插入和删除\nsb.insert(5, " Java");\nsb.delete(0, 5);\nsb.deleteCharAt(0);\n\n// 反转\nsb.reverse();\n\n// 转换为String\nString result = sb.toString();'
                }
            ]
        },
        {
            title: '面向对象',
            items: [
                {
                    title: '类和对象',
                    description: '类的定义和实例化',
                    code: '// 类定义\npublic class Person {\n    // 字段\n    private String name;\n    private int age;\n    \n    // 构造方法\n    public Person() {\n        this("Unknown", 0);\n    }\n    \n    public Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    // Getter和Setter\n    public String getName() {\n        return name;\n    }\n    \n    public void setName(String name) {\n        this.name = name;\n    }\n    \n    // 方法\n    public void introduce() {\n        System.out.println("Hi, I\'m " + name);\n    }\n}\n\n// 对象创建\nPerson person = new Person("Alice", 25);\nperson.introduce();'
                },
                {
                    title: '继承',
                    description: '类的继承和方法重写',
                    code: '// 父类\npublic class Animal {\n    protected String name;\n    \n    public Animal(String name) {\n        this.name = name;\n    }\n    \n    public void makeSound() {\n        System.out.println("Some sound");\n    }\n}\n\n// 子类\npublic class Dog extends Animal {\n    private String breed;\n    \n    public Dog(String name, String breed) {\n        super(name);  // 调用父类构造方法\n        this.breed = breed;\n    }\n    \n    @Override\n    public void makeSound() {\n        System.out.println("Woof!");\n    }\n    \n    public void wagTail() {\n        System.out.println(name + " is wagging tail");\n    }\n}'
                },
                {
                    title: '接口',
                    description: '接口定义和实现',
                    code: '// 接口定义\npublic interface Drawable {\n    // 常量（默认public static final）\n    int MAX_SIZE = 100;\n    \n    // 抽象方法（默认public abstract）\n    void draw();\n    \n    // 默认方法（Java 8+）\n    default void print() {\n        System.out.println("Printing...");\n    }\n    \n    // 静态方法（Java 8+）\n    static void info() {\n        System.out.println("Drawable interface");\n    }\n}\n\n// 接口实现\npublic class Circle implements Drawable {\n    @Override\n    public void draw() {\n        System.out.println("Drawing a circle");\n    }\n}'
                },
                {
                    title: '抽象类',
                    description: '抽象类和抽象方法',
                    code: '// 抽象类\npublic abstract class Shape {\n    protected String color;\n    \n    public Shape(String color) {\n        this.color = color;\n    }\n    \n    // 抽象方法\n    public abstract double getArea();\n    \n    // 具体方法\n    public void setColor(String color) {\n        this.color = color;\n    }\n}\n\n// 继承抽象类\npublic class Rectangle extends Shape {\n    private double width, height;\n    \n    public Rectangle(String color, double width, double height) {\n        super(color);\n        this.width = width;\n        this.height = height;\n    }\n    \n    @Override\n    public double getArea() {\n        return width * height;\n    }\n}'
                }
            ]
        },
        {
            title: '集合框架',
            items: [
                {
                    title: 'List集合',
                    description: 'ArrayList和LinkedList',
                    code: 'import java.util.*;\n\n// ArrayList\nList<String> list = new ArrayList<>();\nlist.add("Apple");\nlist.add("Banana");\nlist.add(1, "Orange");  // 插入到指定位置\n\n// 访问元素\nString first = list.get(0);\nint size = list.size();\nboolean contains = list.contains("Apple");\n\n// 遍历\nfor (String item : list) {\n    System.out.println(item);\n}\n\n// 使用Iterator\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n    System.out.println(it.next());\n}\n\n// 删除元素\nlist.remove("Banana");\nlist.remove(0);\nlist.clear();'
                },
                {
                    title: 'Set集合',
                    description: 'HashSet和TreeSet',
                    code: 'import java.util.*;\n\n// HashSet - 无序，不重复\nSet<Integer> hashSet = new HashSet<>();\nhashSet.add(3);\nhashSet.add(1);\nhashSet.add(2);\nhashSet.add(1);  // 重复元素不会添加\n\n// TreeSet - 有序，不重复\nSet<Integer> treeSet = new TreeSet<>();\ntreeSet.add(3);\ntreeSet.add(1);\ntreeSet.add(2);\n\n// 集合操作\nboolean contains = hashSet.contains(2);\nint size = hashSet.size();\nboolean isEmpty = hashSet.isEmpty();\n\n// 遍历\nfor (Integer num : treeSet) {\n    System.out.println(num);  // 输出: 1, 2, 3\n}'
                },
                {
                    title: 'Map集合',
                    description: 'HashMap和TreeMap',
                    code: 'import java.util.*;\n\n// HashMap\nMap<String, Integer> map = new HashMap<>();\nmap.put("Alice", 25);\nmap.put("Bob", 30);\nmap.put("Charlie", 35);\n\n// 访问元素\nInteger age = map.get("Alice");\nInteger defaultAge = map.getOrDefault("David", 0);\n\n// 检查\nboolean hasKey = map.containsKey("Alice");\nboolean hasValue = map.containsValue(25);\n\n// 遍历\nfor (Map.Entry<String, Integer> entry : map.entrySet()) {\n    System.out.println(entry.getKey() + ": " + entry.getValue());\n}\n\n// 只遍历键或值\nfor (String key : map.keySet()) {\n    System.out.println(key);\n}\n\nfor (Integer value : map.values()) {\n    System.out.println(value);\n}'
                }
            ]
        },
        {
            title: '异常处理',
            items: [
                {
                    title: 'try-catch',
                    description: '异常捕获和处理',
                    code: '// 基本异常处理\ntry {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("除零错误: " + e.getMessage());\n} catch (Exception e) {\n    System.out.println("其他错误: " + e.getMessage());\n} finally {\n    System.out.println("总是执行");\n}\n\n// 多个异常类型\ntry {\n    String str = null;\n    int length = str.length();\n} catch (NullPointerException | IllegalArgumentException e) {\n    System.out.println("错误: " + e.getMessage());\n}'
                },
                {
                    title: '抛出异常',
                    description: 'throw和throws',
                    code: '// 抛出异常\npublic void validateAge(int age) throws IllegalArgumentException {\n    if (age < 0 || age > 150) {\n        throw new IllegalArgumentException("年龄必须在0-150之间");\n    }\n}\n\n// 自定义异常\npublic class CustomException extends Exception {\n    public CustomException(String message) {\n        super(message);\n    }\n}\n\npublic void doSomething() throws CustomException {\n    throw new CustomException("自定义错误");\n}\n\n// 使用\ntry {\n    validateAge(-5);\n} catch (IllegalArgumentException e) {\n    System.out.println(e.getMessage());\n}'
                }
            ]
        },
        {
            title: '文件操作',
            items: [
                {
                    title: '文件读写',
                    description: '文件的读取和写入',
                    code: 'import java.io.*;\nimport java.nio.file.*;\n\n// 读取文件\ntry {\n    // 方法1: Files类（推荐）\n    String content = Files.readString(Paths.get("file.txt"));\n    List<String> lines = Files.readAllLines(Paths.get("file.txt"));\n    \n    // 方法2: BufferedReader\n    try (BufferedReader reader = Files.newBufferedReader(Paths.get("file.txt"))) {\n        String line;\n        while ((line = reader.readLine()) != null) {\n            System.out.println(line);\n        }\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}'
                },
                {
                    title: '文件写入',
                    description: '写入文件内容',
                    code: 'import java.io.*;\nimport java.nio.file.*;\n\n// 写入文件\ntry {\n    // 方法1: Files类\n    Files.writeString(Paths.get("output.txt"), "Hello World");\n    \n    List<String> lines = Arrays.asList("Line 1", "Line 2", "Line 3");\n    Files.write(Paths.get("output.txt"), lines);\n    \n    // 方法2: BufferedWriter\n    try (BufferedWriter writer = Files.newBufferedWriter(Paths.get("output.txt"))) {\n        writer.write("Hello");\n        writer.newLine();\n        writer.write("World");\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}'
                }
            ]
        },
        {
            title: 'Lambda表达式',
            items: [
                {
                    title: 'Lambda基础',
                    description: 'Lambda表达式语法',
                    code: 'import java.util.*;\nimport java.util.function.*;\n\n// 基本语法\n// (参数) -> 表达式\n// (参数) -> { 语句; }\n\n// 示例\nList<String> names = Arrays.asList("Alice", "Bob", "Charlie");\n\n// 遍历\nnames.forEach(name -> System.out.println(name));\nnames.forEach(System.out::println);  // 方法引用\n\n// 排序\nnames.sort((a, b) -> a.compareTo(b));\nnames.sort(String::compareTo);  // 方法引用\n\n// 过滤\nList<String> filtered = names.stream()\n    .filter(name -> name.startsWith("A"))\n    .collect(Collectors.toList());'
                },
                {
                    title: 'Stream API',
                    description: '流式处理',
                    code: 'import java.util.*;\nimport java.util.stream.*;\n\nList<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\n// 过滤和映射\nList<Integer> evenSquares = numbers.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .collect(Collectors.toList());\n\n// 查找\nOptional<Integer> first = numbers.stream()\n    .filter(n -> n > 5)\n    .findFirst();\n\n// 聚合操作\nint sum = numbers.stream()\n    .mapToInt(Integer::intValue)\n    .sum();\n\nOptionalDouble average = numbers.stream()\n    .mapToInt(Integer::intValue)\n    .average();\n\n// 分组\nMap<Boolean, List<Integer>> partitioned = numbers.stream()\n    .collect(Collectors.partitioningBy(n -> n % 2 == 0));'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JAVA_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.JAVA_CHEATSHEET = JAVA_CHEATSHEET;
}