/**
 * Rust 快速参考数据
 * 基于 quickref.me 的 Rust 参考内容
 */

const RUST_CHEATSHEET = {
    id: 'rust',
    title: 'Rust',
    description: 'Rust 是一种系统编程语言，专注于安全、速度和并发',
    icon: '🦀',
    category: 'system',
    sections: [
        {
            title: '基础语法',
            items: [
                {
                    title: 'Hello World',
                    description: 'Rust程序基本结构',
                    code: 'fn main() {\n    println!("Hello, World!");\n}\n\n// 带参数的main函数\nuse std::env;\n\nfn main() {\n    let args: Vec<String> = env::args().collect();\n    println!("参数: {:?}", args);\n}'
                },
                {
                    title: '变量和可变性',
                    description: '变量声明和可变性',
                    code: '// 不可变变量（默认）\nlet x = 5;\nlet name = "Alice";\n\n// 可变变量\nlet mut y = 10;\ny = 20;  // 可以修改\n\n// 常量\nconst MAX_POINTS: u32 = 100_000;\n\n// 变量遮蔽（shadowing）\nlet x = 5;\nlet x = x + 1;  // 新的x遮蔽了旧的x\nlet x = x * 2;  // x现在是12\n\n// 类型注解\nlet guess: u32 = "42".parse().expect("不是数字!");\n\n// 解构赋值\nlet (a, b) = (1, 2);\nlet (x, y, z) = (1, 2, 3);'
                },
                {
                    title: '数据类型',
                    description: 'Rust的基本数据类型',
                    code: '// 整数类型\nlet a: i8 = -128;     // 8位有符号\nlet b: u8 = 255;      // 8位无符号\nlet c: i32 = -2147483648;  // 32位有符号（默认）\nlet d: u64 = 18446744073709551615;\n\n// 浮点类型\nlet x: f32 = 3.14;    // 32位浮点\nlet y: f64 = 2.71828; // 64位浮点（默认）\n\n// 布尔类型\nlet is_true: bool = true;\nlet is_false: bool = false;\n\n// 字符类型\nlet c: char = \'z\';\nlet heart_eyed_cat: char = \'😻\';\n\n// 字符串类型\nlet s1: &str = "hello";        // 字符串字面量\nlet s2: String = String::from("hello");  // 可变字符串\n\n// 数组\nlet arr: [i32; 5] = [1, 2, 3, 4, 5];\nlet zeros = [0; 3];  // [0, 0, 0]\n\n// 元组\nlet tup: (i32, f64, u8) = (500, 6.4, 1);\nlet (x, y, z) = tup;  // 解构\nlet first = tup.0;    // 索引访问'
                },
                {
                    title: '函数',
                    description: '函数定义和调用',
                    code: '// 基本函数\nfn greet() {\n    println!("Hello!");\n}\n\n// 带参数的函数\nfn add(x: i32, y: i32) -> i32 {\n    x + y  // 表达式，没有分号\n}\n\n// 或者使用return\nfn subtract(x: i32, y: i32) -> i32 {\n    return x - y;\n}\n\n// 多个返回值（元组）\nfn calculate(x: i32, y: i32) -> (i32, i32) {\n    (x + y, x - y)\n}\n\n// 使用\nlet (sum, diff) = calculate(10, 5);\n\n// 高阶函数\nfn apply_operation<F>(x: i32, y: i32, op: F) -> i32\nwhere\n    F: Fn(i32, i32) -> i32,\n{\n    op(x, y)\n}\n\nlet result = apply_operation(5, 3, |a, b| a * b);'
                }
            ]
        },
        {
            title: '所有权系统',
            items: [
                {
                    title: '所有权规则',
                    description: 'Rust的核心概念',
                    code: '// 所有权规则：\n// 1. Rust中的每个值都有一个所有者\n// 2. 值在任意时刻只能有一个所有者\n// 3. 当所有者离开作用域，值将被丢弃\n\n// 移动语义\nlet s1 = String::from("hello");\nlet s2 = s1;  // s1的值移动到s2，s1不再有效\n// println!("{}", s1);  // 编译错误！\nprintln!("{}", s2);  // 正确\n\n// 克隆\nlet s1 = String::from("hello");\nlet s2 = s1.clone();  // 深拷贝\nprintln!("{} {}", s1, s2);  // 都有效\n\n// 栈上的数据（实现了Copy trait）\nlet x = 5;\nlet y = x;  // 拷贝，不是移动\nprintln!("{} {}", x, y);  // 都有效'
                },
                {
                    title: '借用和引用',
                    description: '引用而不获取所有权',
                    code: '// 不可变引用\nfn calculate_length(s: &String) -> usize {\n    s.len()\n}  // s离开作用域，但不会丢弃数据\n\nlet s1 = String::from("hello");\nlet len = calculate_length(&s1);\nprintln!("长度: {}", len);\n\n// 可变引用\nfn change(s: &mut String) {\n    s.push_str(", world");\n}\n\nlet mut s = String::from("hello");\nchange(&mut s);\nprintln!("{}", s);\n\n// 引用规则：\n// 1. 在任意给定时间，要么只能有一个可变引用，要么只能有多个不可变引用\n// 2. 引用必须总是有效的\n\nlet mut s = String::from("hello");\nlet r1 = &s;      // 不可变引用\nlet r2 = &s;      // 不可变引用\n// let r3 = &mut s;  // 编译错误！不能同时有可变和不可变引用\nprintln!("{} {}", r1, r2);'
                },
                {
                    title: '切片',
                    description: '对数据的部分引用',
                    code: '// 字符串切片\nlet s = String::from("hello world");\nlet hello = &s[0..5];   // "hello"\nlet world = &s[6..11];  // "world"\nlet hello2 = &s[..5];   // 从开始到索引5\nlet world2 = &s[6..];   // 从索引6到结束\nlet whole = &s[..];     // 整个字符串\n\n// 字符串字面量就是切片\nlet s: &str = "Hello, world!";\n\n// 数组切片\nlet a = [1, 2, 3, 4, 5];\nlet slice = &a[1..3];  // [2, 3]\n\n// 函数参数使用切片更灵活\nfn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &item) in bytes.iter().enumerate() {\n        if item == b\' \' {\n            return &s[0..i];\n        }\n    }\n    &s[..]\n}\n\nlet word = first_word("hello world");  // "hello"'
                }
            ]
        },
        {
            title: '结构体和枚举',
            items: [
                {
                    title: '结构体',
                    description: '自定义数据类型',
                    code: '// 结构体定义\nstruct User {\n    username: String,\n    email: String,\n    sign_in_count: u64,\n    active: bool,\n}\n\n// 创建实例\nlet user1 = User {\n    email: String::from("someone@example.com"),\n    username: String::from("someusername123"),\n    active: true,\n    sign_in_count: 1,\n};\n\n// 访问字段\nprintln!("用户名: {}", user1.username);\n\n// 可变实例\nlet mut user2 = User {\n    email: String::from("another@example.com"),\n    username: String::from("anotherusername567"),\n    active: true,\n    sign_in_count: 1,\n};\nuser2.email = String::from("anotheremail@example.com");\n\n// 结构体更新语法\nlet user3 = User {\n    email: String::from("another@example.com"),\n    username: String::from("anotherusername567"),\n    ..user1  // 其余字段从user1复制\n};'
                },
                {
                    title: '方法和关联函数',
                    description: '为结构体定义方法',
                    code: '#[derive(Debug)]\nstruct Rectangle {\n    width: u32,\n    height: u32,\n}\n\nimpl Rectangle {\n    // 方法（第一个参数是&self）\n    fn area(&self) -> u32 {\n        self.width * self.height\n    }\n    \n    fn can_hold(&self, other: &Rectangle) -> bool {\n        self.width > other.width && self.height > other.height\n    }\n    \n    // 可变方法\n    fn double(&mut self) {\n        self.width *= 2;\n        self.height *= 2;\n    }\n    \n    // 关联函数（类似静态方法）\n    fn square(size: u32) -> Rectangle {\n        Rectangle {\n            width: size,\n            height: size,\n        }\n    }\n}\n\n// 使用\nlet rect1 = Rectangle { width: 30, height: 50 };\nprintln!("面积: {}", rect1.area());\n\nlet square = Rectangle::square(10);\nprintln!("正方形: {:?}", square);'
                },
                {
                    title: '枚举',
                    description: '枚举类型和模式匹配',
                    code: '// 基本枚举\nenum IpAddrKind {\n    V4,\n    V6,\n}\n\nlet four = IpAddrKind::V4;\nlet six = IpAddrKind::V6;\n\n// 带数据的枚举\nenum IpAddr {\n    V4(u8, u8, u8, u8),\n    V6(String),\n}\n\nlet home = IpAddr::V4(127, 0, 0, 1);\nlet loopback = IpAddr::V6(String::from("::1"));\n\n// 复杂枚举\nenum Message {\n    Quit,\n    Move { x: i32, y: i32 },\n    Write(String),\n    ChangeColor(i32, i32, i32),\n}\n\n// 为枚举实现方法\nimpl Message {\n    fn call(&self) {\n        match self {\n            Message::Quit => println!("退出"),\n            Message::Move { x, y } => println!("移动到 ({}, {})", x, y),\n            Message::Write(text) => println!("写入: {}", text),\n            Message::ChangeColor(r, g, b) => println!("颜色: ({}, {}, {})", r, g, b),\n        }\n    }\n}\n\nlet m = Message::Write(String::from("hello"));\nm.call();'
                },
                {
                    title: 'Option和Result',
                    description: 'Rust的错误处理',
                    code: '// Option枚举（处理可能为空的值）\nenum Option<T> {\n    Some(T),\n    None,\n}\n\nfn find_user(id: u32) -> Option<String> {\n    if id == 1 {\n        Some(String::from("Alice"))\n    } else {\n        None\n    }\n}\n\n// 使用Option\nmatch find_user(1) {\n    Some(name) => println!("找到用户: {}", name),\n    None => println!("用户不存在"),\n}\n\n// if let语法糖\nif let Some(name) = find_user(1) {\n    println!("用户: {}", name);\n}\n\n// Result枚举（处理错误）\nenum Result<T, E> {\n    Ok(T),\n    Err(E),\n}\n\nfn divide(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(String::from("除零错误"))\n    } else {\n        Ok(a / b)\n    }\n}\n\n// 使用Result\nmatch divide(10.0, 2.0) {\n    Ok(result) => println!("结果: {}", result),\n    Err(error) => println!("错误: {}", error),\n}\n\n// ?操作符（错误传播）\nfn calculate() -> Result<f64, String> {\n    let result = divide(10.0, 2.0)?;  // 如果是Err，直接返回\n    Ok(result * 2.0)\n}'
                }
            ]
        },
        {
            title: '集合类型',
            items: [
                {
                    title: 'Vector',
                    description: '动态数组',
                    code: '// 创建Vector\nlet mut v: Vec<i32> = Vec::new();\nlet mut v2 = vec![1, 2, 3];  // 宏创建\n\n// 添加元素\nv.push(5);\nv.push(6);\nv.push(7);\nv.push(8);\n\n// 访问元素\nlet third: &i32 = &v[2];  // 可能panic\nmatch v.get(2) {\n    Some(third) => println!("第三个元素: {}", third),\n    None => println!("没有第三个元素"),\n}\n\n// 遍历\nfor i in &v {\n    println!("{}", i);\n}\n\n// 可变遍历\nfor i in &mut v {\n    *i += 50;\n}\n\n// 删除元素\nv.pop();  // 删除最后一个元素\n\n// 存储不同类型（使用枚举）\nenum SpreadsheetCell {\n    Int(i32),\n    Float(f64),\n    Text(String),\n}\n\nlet row = vec![\n    SpreadsheetCell::Int(3),\n    SpreadsheetCell::Text(String::from("blue")),\n    SpreadsheetCell::Float(10.12),\n];'
                },
                {
                    title: 'HashMap',
                    description: '哈希映射',
                    code: 'use std::collections::HashMap;\n\n// 创建HashMap\nlet mut scores = HashMap::new();\nscores.insert(String::from("Blue"), 10);\nscores.insert(String::from("Yellow"), 50);\n\n// 从向量创建\nlet teams = vec![String::from("Blue"), String::from("Yellow")];\nlet initial_scores = vec![10, 50];\nlet scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();\n\n// 访问值\nlet team_name = String::from("Blue");\nlet score = scores.get(&team_name);\nmatch score {\n    Some(s) => println!("分数: {}", s),\n    None => println!("队伍不存在"),\n}\n\n// 遍历\nfor (key, value) in &scores {\n    println!("{}: {}", key, value);\n}\n\n// 更新值\nlet mut scores = HashMap::new();\nscores.insert(String::from("Blue"), 10);\n\n// 覆盖值\nscores.insert(String::from("Blue"), 25);\n\n// 只在键不存在时插入\nscores.entry(String::from("Yellow")).or_insert(50);\nscores.entry(String::from("Blue")).or_insert(50);  // 不会覆盖\n\n// 基于旧值更新\nlet text = "hello world wonderful world";\nlet mut map = HashMap::new();\nfor word in text.split_whitespace() {\n    let count = map.entry(word).or_insert(0);\n    *count += 1;\n}'
                },
                {
                    title: '字符串',
                    description: 'String和&str',
                    code: '// 创建字符串\nlet mut s = String::new();\nlet s2 = String::from("hello");\nlet s3 = "hello".to_string();\n\n// 更新字符串\ns.push_str("bar");  // 添加字符串切片\ns.push(\'!\'\');      // 添加单个字符\n\n// 连接字符串\nlet s1 = String::from("Hello, ");\nlet s2 = String::from("world!");\nlet s3 = s1 + &s2;  // s1被移动，不能再使用\n\n// format!宏\nlet s1 = String::from("tic");\nlet s2 = String::from("tac");\nlet s3 = String::from("toe");\nlet s = format!("{}-{}-{}", s1, s2, s3);  // 不会获取所有权\n\n// 字符串切片\nlet hello = "Здравствуйте";\nlet s = &hello[0..4];  // "Зд"（注意UTF-8编码）\n\n// 遍历字符串\nfor c in "नमस्ते".chars() {\n    println!("{}", c);\n}\n\nfor b in "नमस्ते".bytes() {\n    println!("{}", b);\n}\n\n// 字符串方法\nlet s = String::from("  hello world  ");\nlet trimmed = s.trim();\nlet replaced = s.replace("world", "Rust");\nlet parts: Vec<&str> = s.split_whitespace().collect();'
                }
            ]
        },
        {
            title: '错误处理',
            items: [
                {
                    title: 'panic!和不可恢复错误',
                    description: '程序崩溃处理',
                    code: '// 显式panic\nfn main() {\n    panic!("程序崩溃了!");\n}\n\n// 数组越界会panic\nfn main() {\n    let v = vec![1, 2, 3];\n    v[99];  // 这会panic\n}\n\n// 设置panic时的行为\n// 在Cargo.toml中：\n// [profile.release]\n// panic = "abort"  # 直接终止，不展开栈\n\n// 获取panic的backtrace\n// 设置环境变量：RUST_BACKTRACE=1\n\n// 自定义panic hook\nuse std::panic;\n\nfn main() {\n    panic::set_hook(Box::new(|panic_info| {\n        println!("自定义panic处理: {:?}", panic_info);\n    }));\n    \n    panic!("测试panic");\n}'
                },
                {
                    title: 'Result和可恢复错误',
                    description: '错误处理最佳实践',
                    code: 'use std::fs::File;\nuse std::io::ErrorKind;\n\n// 基本错误处理\nfn main() {\n    let f = File::open("hello.txt");\n    \n    let f = match f {\n        Ok(file) => file,\n        Err(error) => match error.kind() {\n            ErrorKind::NotFound => match File::create("hello.txt") {\n                Ok(fc) => fc,\n                Err(e) => panic!("创建文件失败: {:?}", e),\n            },\n            other_error => panic!("打开文件失败: {:?}", other_error),\n        },\n    };\n}\n\n// 使用unwrap和expect\nlet f = File::open("hello.txt").unwrap();  // 如果失败就panic\nlet f = File::open("hello.txt").expect("无法打开hello.txt");\n\n// 错误传播\nuse std::io;\nuse std::io::Read;\n\nfn read_username_from_file() -> Result<String, io::Error> {\n    let mut f = File::open("hello.txt")?;  // ?操作符\n    let mut s = String::new();\n    f.read_to_string(&mut s)?;\n    Ok(s)\n}\n\n// 更简洁的版本\nfn read_username_from_file() -> Result<String, io::Error> {\n    let mut s = String::new();\n    File::open("hello.txt")?.read_to_string(&mut s)?;\n    Ok(s)\n}\n\n// 最简洁的版本\nuse std::fs;\n\nfn read_username_from_file() -> Result<String, io::Error> {\n    fs::read_to_string("hello.txt")\n}'
                },
                {
                    title: '自定义错误类型',
                    description: '创建自己的错误类型',
                    code: 'use std::fmt;\n\n// 自定义错误类型\n#[derive(Debug)]\nenum CalculatorError {\n    DivisionByZero,\n    NegativeLogarithm,\n    InvalidInput(String),\n}\n\n// 实现Display trait\nimpl fmt::Display for CalculatorError {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            CalculatorError::DivisionByZero => write!(f, "除零错误"),\n            CalculatorError::NegativeLogarithm => write!(f, "负数不能取对数"),\n            CalculatorError::InvalidInput(msg) => write!(f, "无效输入: {}", msg),\n        }\n    }\n}\n\n// 实现Error trait\nimpl std::error::Error for CalculatorError {}\n\n// 使用自定义错误\nfn divide(a: f64, b: f64) -> Result<f64, CalculatorError> {\n    if b == 0.0 {\n        Err(CalculatorError::DivisionByZero)\n    } else {\n        Ok(a / b)\n    }\n}\n\nfn logarithm(x: f64) -> Result<f64, CalculatorError> {\n    if x <= 0.0 {\n        Err(CalculatorError::NegativeLogarithm)\n    } else {\n        Ok(x.ln())\n    }\n}\n\n// 错误转换\nimpl From<std::num::ParseFloatError> for CalculatorError {\n    fn from(error: std::num::ParseFloatError) -> Self {\n        CalculatorError::InvalidInput(error.to_string())\n    }\n}\n\nfn parse_and_divide(input: &str) -> Result<f64, CalculatorError> {\n    let num: f64 = input.parse()?;  // 自动转换ParseFloatError\n    divide(num, 2.0)\n}'
                }
            ]
        },
        {
            title: '泛型和trait',
            items: [
                {
                    title: '泛型',
                    description: '泛型函数、结构体和枚举',
                    code: '// 泛型函数\nfn largest<T: PartialOrd + Copy>(list: &[T]) -> T {\n    let mut largest = list[0];\n    for &item in list.iter() {\n        if item > largest {\n            largest = item;\n        }\n    }\n    largest\n}\n\n// 泛型结构体\nstruct Point<T> {\n    x: T,\n    y: T,\n}\n\nimpl<T> Point<T> {\n    fn x(&self) -> &T {\n        &self.x\n    }\n}\n\n// 为特定类型实现方法\nimpl Point<f32> {\n    fn distance_from_origin(&self) -> f32 {\n        (self.x.powi(2) + self.y.powi(2)).sqrt()\n    }\n}\n\n// 多个泛型参数\nstruct Point2<T, U> {\n    x: T,\n    y: U,\n}\n\nimpl<T, U> Point2<T, U> {\n    fn mixup<V, W>(self, other: Point2<V, W>) -> Point2<T, W> {\n        Point2 {\n            x: self.x,\n            y: other.y,\n        }\n    }\n}\n\n// 使用\nlet integer = Point { x: 5, y: 10 };\nlet float = Point { x: 1.0, y: 4.0 };\nlet mixed = Point2 { x: 5, y: 4.0 };'
                },
                {
                    title: 'Trait',
                    description: '定义共享行为',
                    code: '// 定义trait\ntrait Summary {\n    fn summarize(&self) -> String;\n    \n    // 默认实现\n    fn summarize_author(&self) -> String {\n        String::from("(Read more...)")\n    }\n}\n\n// 为类型实现trait\nstruct NewsArticle {\n    headline: String,\n    location: String,\n    author: String,\n    content: String,\n}\n\nimpl Summary for NewsArticle {\n    fn summarize(&self) -> String {\n        format!("{}, by {} ({})", self.headline, self.author, self.location)\n    }\n}\n\nstruct Tweet {\n    username: String,\n    content: String,\n    reply: bool,\n    retweet: bool,\n}\n\nimpl Summary for Tweet {\n    fn summarize(&self) -> String {\n        format!("{}: {}", self.username, self.content)\n    }\n}\n\n// trait作为参数\nfn notify(item: &impl Summary) {\n    println!("Breaking news! {}", item.summarize());\n}\n\n// trait bound语法\nfn notify2<T: Summary>(item: &T) {\n    println!("Breaking news! {}", item.summarize());\n}\n\n// 多个trait bound\nfn notify3<T: Summary + Display>(item: &T) {\n    // ...\n}\n\n// where子句\nfn some_function<T, U>(t: &T, u: &U) -> i32\nwhere\n    T: Display + Clone,\n    U: Clone + Debug,\n{\n    // ...\n}'
                },
                {
                    title: '生命周期',
                    description: '引用的有效范围',
                    code: '// 生命周期注解\nfn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}\n\n// 结构体中的生命周期\nstruct ImportantExcerpt<\'a> {\n    part: &\'a str,\n}\n\nimpl<\'a> ImportantExcerpt<\'a> {\n    fn level(&self) -> i32 {\n        3\n    }\n    \n    fn announce_and_return_part(&self, announcement: &str) -> &str {\n        println!("Attention please: {}", announcement);\n        self.part\n    }\n}\n\n// 静态生命周期\nlet s: &\'static str = "I have a static lifetime.";\n\n// 生命周期省略规则：\n// 1. 每个引用参数都有自己的生命周期\n// 2. 如果只有一个输入生命周期，它被赋给所有输出生命周期\n// 3. 如果有多个输入生命周期，但其中一个是&self或&mut self，\n//    self的生命周期被赋给所有输出生命周期\n\n// 这些函数不需要显式生命周期注解\nfn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &item) in bytes.iter().enumerate() {\n        if item == b\' \' {\n            return &s[0..i];\n        }\n    }\n    &s[..]\n}'
                }
            ]
        },
        {
            title: '并发编程',
            items: [
                {
                    title: '线程',
                    description: '创建和管理线程',
                    code: 'use std::thread;\nuse std::time::Duration;\n\n// 创建线程\nfn main() {\n    thread::spawn(|| {\n        for i in 1..10 {\n            println!("hi number {} from the spawned thread!", i);\n            thread::sleep(Duration::from_millis(1));\n        }\n    });\n\n    for i in 1..5 {\n        println!("hi number {} from the main thread!", i);\n        thread::sleep(Duration::from_millis(1));\n    }\n}\n\n// 等待线程完成\nfn main() {\n    let handle = thread::spawn(|| {\n        for i in 1..10 {\n            println!("hi number {} from the spawned thread!", i);\n            thread::sleep(Duration::from_millis(1));\n        }\n    });\n\n    for i in 1..5 {\n        println!("hi number {} from the main thread!", i);\n        thread::sleep(Duration::from_millis(1));\n    }\n\n    handle.join().unwrap();\n}\n\n// 在线程中使用move\nfn main() {\n    let v = vec![1, 2, 3];\n\n    let handle = thread::spawn(move || {\n        println!("Here\'s a vector: {:?}", v);\n    });\n\n    handle.join().unwrap();\n}'
                },
                {
                    title: '消息传递',
                    description: '通道（channels）',
                    code: 'use std::sync::mpsc;\nuse std::thread;\n\n// 基本通道\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    thread::spawn(move || {\n        let val = String::from("hi");\n        tx.send(val).unwrap();\n    });\n\n    let received = rx.recv().unwrap();\n    println!("Got: {}", received);\n}\n\n// 发送多个值\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    thread::spawn(move || {\n        let vals = vec![\n            String::from("hi"),\n            String::from("from"),\n            String::from("the"),\n            String::from("thread"),\n        ];\n\n        for val in vals {\n            tx.send(val).unwrap();\n            thread::sleep(Duration::from_secs(1));\n        }\n    });\n\n    for received in rx {\n        println!("Got: {}", received);\n    }\n}\n\n// 多个发送者\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    let tx1 = tx.clone();\n    thread::spawn(move || {\n        let vals = vec![\n            String::from("hi"),\n            String::from("from"),\n            String::from("the"),\n            String::from("thread"),\n        ];\n\n        for val in vals {\n            tx1.send(val).unwrap();\n            thread::sleep(Duration::from_secs(1));\n        }\n    });\n\n    thread::spawn(move || {\n        let vals = vec![\n            String::from("more"),\n            String::from("messages"),\n            String::from("for"),\n            String::from("you"),\n        ];\n\n        for val in vals {\n            tx.send(val).unwrap();\n            thread::sleep(Duration::from_secs(1));\n        }\n    });\n\n    for received in rx {\n        println!("Got: {}", received);\n    }\n}'
                },
                {
                    title: '共享状态',
                    description: 'Mutex和Arc',
                    code: 'use std::sync::{Arc, Mutex};\nuse std::thread;\n\n// 基本Mutex\nfn main() {\n    let m = Mutex::new(5);\n\n    {\n        let mut num = m.lock().unwrap();\n        *num = 6;\n    }\n\n    println!("m = {:?}", m);\n}\n\n// 多线程共享Mutex\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for _ in 0..10 {\n        let counter = Arc::clone(&counter);\n        let handle = thread::spawn(move || {\n            let mut num = counter.lock().unwrap();\n            *num += 1;\n        });\n        handles.push(handle);\n    }\n\n    for handle in handles {\n        handle.join().unwrap();\n    }\n\n    println!("Result: {}", *counter.lock().unwrap());\n}\n\n// RefCell和Rc的线程安全版本\n// Rc<T> -> Arc<T>（原子引用计数）\n// RefCell<T> -> Mutex<T>（互斥锁）\n\n// 死锁示例（避免）\nuse std::sync::{Arc, Mutex};\nuse std::thread;\nuse std::time::Duration;\n\nfn main() {\n    let data1 = Arc::new(Mutex::new(0));\n    let data2 = Arc::new(Mutex::new(0));\n\n    let data1_clone = Arc::clone(&data1);\n    let data2_clone = Arc::clone(&data2);\n\n    let handle1 = thread::spawn(move || {\n        let _lock1 = data1_clone.lock().unwrap();\n        thread::sleep(Duration::from_millis(100));\n        let _lock2 = data2_clone.lock().unwrap();\n    });\n\n    let handle2 = thread::spawn(move || {\n        let _lock2 = data2.lock().unwrap();\n        thread::sleep(Duration::from_millis(100));\n        let _lock1 = data1.lock().unwrap();  // 可能死锁\n    });\n\n    handle1.join().unwrap();\n    handle2.join().unwrap();\n}'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RUST_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.RUST_CHEATSHEET = RUST_CHEATSHEET;
}