/**
 * Go 快速参考数据
 * 基于 quickref.me 的 Go 参考内容
 */

const GO_CHEATSHEET = {
    id: 'go',
    title: 'Go',
    description: 'Go 是一种开源的编程语言，由Google开发',
    icon: '🐹',
    category: 'backend',
    sections: [
        {
            title: '基础语法',
            items: [
                {
                    title: 'Hello World',
                    description: 'Go程序基本结构',
                    code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}'
                },
                {
                    title: '变量声明',
                    description: '变量的声明和初始化',
                    code: '// 变量声明\nvar name string\nvar age int\nvar isActive bool\n\n// 初始化\nvar name string = "John"\nvar age int = 25\n\n// 类型推断\nvar name = "John"\nvar age = 25\n\n// 短变量声明\nname := "John"\nage := 25\n\n// 多变量声明\nvar (\n    name string = "John"\n    age  int    = 25\n)\n\n// 多变量赋值\nname, age := "John", 25'
                },
                {
                    title: '常量',
                    description: 'const关键字',
                    code: '// 常量声明\nconst PI = 3.14159\nconst AppName = "MyApp"\n\n// 常量组\nconst (\n    StatusOK = 200\n    StatusNotFound = 404\n    StatusError = 500\n)\n\n// iota枚举\nconst (\n    Sunday = iota    // 0\n    Monday           // 1\n    Tuesday          // 2\n    Wednesday        // 3\n)\n\nconst (\n    _ = iota         // 跳过0\n    KB = 1 << (10 * iota)  // 1024\n    MB                     // 1048576\n    GB                     // 1073741824\n)'
                },
                {
                    title: '基本数据类型',
                    description: 'Go的基本类型',
                    code: '// 整数类型\nvar i8 int8 = 127\nvar i16 int16 = 32767\nvar i32 int32 = 2147483647\nvar i64 int64 = 9223372036854775807\nvar ui8 uint8 = 255\nvar ui16 uint16 = 65535\n\n// 浮点类型\nvar f32 float32 = 3.14\nvar f64 float64 = 3.141592653589793\n\n// 布尔类型\nvar isTrue bool = true\nvar isFalse bool = false\n\n// 字符串类型\nvar str string = "Hello, Go!"\n\n// 字节类型\nvar b byte = 65  // byte是uint8的别名\nvar r rune = \'A\'  // rune是int32的别名，表示Unicode码点'
                }
            ]
        },
        {
            title: '控制结构',
            items: [
                {
                    title: '条件语句',
                    description: 'if-else语句',
                    code: '// 基本if语句\nif age >= 18 {\n    fmt.Println("成年人")\n}\n\n// if-else\nif score >= 90 {\n    fmt.Println("优秀")\n} else if score >= 80 {\n    fmt.Println("良好")\n} else {\n    fmt.Println("需要努力")\n}\n\n// if语句中的初始化\nif num := getNumber(); num > 0 {\n    fmt.Println("正数:", num)\n} else {\n    fmt.Println("非正数:", num)\n}\n// num在if语句外不可见'
                },
                {
                    title: 'Switch语句',
                    description: '多分支选择',
                    code: '// 基本switch\nswitch day {\ncase "Monday":\n    fmt.Println("周一")\ncase "Tuesday":\n    fmt.Println("周二")\ndefault:\n    fmt.Println("其他")\n}\n\n// 多值case\nswitch day {\ncase "Saturday", "Sunday":\n    fmt.Println("周末")\ndefault:\n    fmt.Println("工作日")\n}\n\n// 无表达式switch\nswitch {\ncase age < 18:\n    fmt.Println("未成年")\ncase age < 60:\n    fmt.Println("成年人")\ndefault:\n    fmt.Println("老年人")\n}\n\n// 类型switch\nswitch v := interface{}(x).(type) {\ncase int:\n    fmt.Println("整数:", v)\ncase string:\n    fmt.Println("字符串:", v)\ndefault:\n    fmt.Println("未知类型")\n}'
                },
                {
                    title: '循环语句',
                    description: 'for循环的各种形式',
                    code: '// 基本for循环\nfor i := 0; i < 10; i++ {\n    fmt.Println(i)\n}\n\n// while风格\ni := 0\nfor i < 10 {\n    fmt.Println(i)\n    i++\n}\n\n// 无限循环\nfor {\n    // 无限循环\n    if condition {\n        break\n    }\n}\n\n// range遍历\nslice := []int{1, 2, 3, 4, 5}\nfor index, value := range slice {\n    fmt.Printf("索引: %d, 值: %d\\n", index, value)\n}\n\n// 只要值\nfor _, value := range slice {\n    fmt.Println(value)\n}\n\n// 只要索引\nfor index := range slice {\n    fmt.Println(index)\n}'
                }
            ]
        },
        {
            title: '数据结构',
            items: [
                {
                    title: '数组',
                    description: '固定长度的数组',
                    code: '// 数组声明\nvar arr [5]int\nvar names [3]string = [3]string{"Alice", "Bob", "Charlie"}\n\n// 数组字面量\nnumbers := [5]int{1, 2, 3, 4, 5}\nauto := [...]int{1, 2, 3}  // 自动推断长度\n\n// 指定索引初始化\nsparse := [10]int{2: 20, 5: 50}\n\n// 访问元素\nfirst := numbers[0]\nlast := numbers[len(numbers)-1]\n\n// 遍历数组\nfor i, v := range numbers {\n    fmt.Printf("索引: %d, 值: %d\\n", i, v)\n}'
                },
                {
                    title: '切片',
                    description: '动态数组',
                    code: '// 切片声明\nvar slice []int\nslice = make([]int, 5)      // 长度为5\nslice = make([]int, 5, 10)  // 长度5，容量10\n\n// 切片字面量\nnumbers := []int{1, 2, 3, 4, 5}\n\n// 从数组创建切片\narr := [5]int{1, 2, 3, 4, 5}\nslice1 := arr[1:4]  // [2, 3, 4]\nslice2 := arr[:3]   // [1, 2, 3]\nslice3 := arr[2:]   // [3, 4, 5]\n\n// 切片操作\nslice = append(slice, 6)           // 添加元素\nslice = append(slice, 7, 8, 9)     // 添加多个元素\nslice = append(slice, other...)    // 添加另一个切片\n\n// 复制切片\ncopy(dest, src)\n\n// 删除元素\nslice = append(slice[:i], slice[i+1:]...)  // 删除索引i的元素'
                },
                {
                    title: '映射',
                    description: 'Map键值对',
                    code: '// 映射声明\nvar m map[string]int\nm = make(map[string]int)\n\n// 映射字面量\nages := map[string]int{\n    "Alice":   25,\n    "Bob":     30,\n    "Charlie": 35,\n}\n\n// 操作映射\nages["David"] = 28        // 添加/更新\nage := ages["Alice"]      // 获取值\nage, ok := ages["Eve"]    // 检查键是否存在\ndelete(ages, "Bob")       // 删除键\n\n// 遍历映射\nfor name, age := range ages {\n    fmt.Printf("%s: %d\\n", name, age)\n}\n\n// 只遍历键\nfor name := range ages {\n    fmt.Println(name)\n}'
                },
                {
                    title: '结构体',
                    description: '自定义类型',
                    code: '// 结构体定义\ntype Person struct {\n    Name string\n    Age  int\n    Email string\n}\n\n// 创建结构体\nvar p1 Person\np1.Name = "Alice"\np1.Age = 25\n\n// 结构体字面量\np2 := Person{\n    Name: "Bob",\n    Age:  30,\n    Email: "bob@example.com",\n}\n\n// 简短形式（按字段顺序）\np3 := Person{"Charlie", 35, "charlie@example.com"}\n\n// 指针\np4 := &Person{"David", 28, "david@example.com"}\n\n// 匿名结构体\npoint := struct {\n    X, Y int\n}{10, 20}'
                }
            ]
        },
        {
            title: '函数',
            items: [
                {
                    title: '函数定义',
                    description: '函数的声明和调用',
                    code: '// 基本函数\nfunc greet(name string) {\n    fmt.Printf("Hello, %s!\\n", name)\n}\n\n// 带返回值\nfunc add(a, b int) int {\n    return a + b\n}\n\n// 多个返回值\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, fmt.Errorf("除零错误")\n    }\n    return a / b, nil\n}\n\n// 命名返回值\nfunc calculate(a, b int) (sum, product int) {\n    sum = a + b\n    product = a * b\n    return  // 裸返回\n}\n\n// 可变参数\nfunc sum(numbers ...int) int {\n    total := 0\n    for _, num := range numbers {\n        total += num\n    }\n    return total\n}\n\n// 调用\nresult := sum(1, 2, 3, 4, 5)\nslice := []int{1, 2, 3}\nresult = sum(slice...)  // 展开切片'
                },
                {
                    title: '方法',
                    description: '结构体方法',
                    code: '// 结构体定义\ntype Rectangle struct {\n    Width, Height float64\n}\n\n// 值接收者方法\nfunc (r Rectangle) Area() float64 {\n    return r.Width * r.Height\n}\n\n// 指针接收者方法\nfunc (r *Rectangle) Scale(factor float64) {\n    r.Width *= factor\n    r.Height *= factor\n}\n\n// 使用方法\nrect := Rectangle{Width: 10, Height: 5}\narea := rect.Area()\nrect.Scale(2)\n\n// 方法值和方法表达式\nf1 := rect.Area          // 方法值\nf2 := Rectangle.Area     // 方法表达式\narea1 := f1()\narea2 := f2(rect)'
                },
                {
                    title: '接口',
                    description: '接口定义和实现',
                    code: '// 接口定义\ntype Shape interface {\n    Area() float64\n    Perimeter() float64\n}\n\n// 实现接口（隐式）\ntype Circle struct {\n    Radius float64\n}\n\nfunc (c Circle) Area() float64 {\n    return math.Pi * c.Radius * c.Radius\n}\n\nfunc (c Circle) Perimeter() float64 {\n    return 2 * math.Pi * c.Radius\n}\n\n// 使用接口\nfunc printShapeInfo(s Shape) {\n    fmt.Printf("面积: %.2f\\n", s.Area())\n    fmt.Printf("周长: %.2f\\n", s.Perimeter())\n}\n\ncircle := Circle{Radius: 5}\nprintShapeInfo(circle)\n\n// 空接口\nvar anything interface{}\nanything = 42\nanything = "hello"\nanything = []int{1, 2, 3}'
                },
                {
                    title: '错误处理',
                    description: 'error接口',
                    code: '// 错误处理\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("除零错误")\n    }\n    return a / b, nil\n}\n\n// 使用\nresult, err := divide(10, 0)\nif err != nil {\n    fmt.Println("错误:", err)\n    return\n}\nfmt.Println("结果:", result)\n\n// 自定义错误类型\ntype ValidationError struct {\n    Field string\n    Message string\n}\n\nfunc (e ValidationError) Error() string {\n    return fmt.Sprintf("%s: %s", e.Field, e.Message)\n}\n\n// defer语句\nfunc readFile(filename string) error {\n    file, err := os.Open(filename)\n    if err != nil {\n        return err\n    }\n    defer file.Close()  // 函数返回前执行\n    \n    // 读取文件...\n    return nil\n}'
                }
            ]
        },
        {
            title: '并发编程',
            items: [
                {
                    title: 'Goroutines',
                    description: '轻量级线程',
                    code: '// 启动goroutine\ngo func() {\n    fmt.Println("在goroutine中执行")\n}()\n\n// 带参数的goroutine\ngo func(name string) {\n    fmt.Printf("Hello, %s!\\n", name)\n}("World")\n\n// 等待goroutine完成\nimport "sync"\n\nvar wg sync.WaitGroup\n\nfor i := 0; i < 5; i++ {\n    wg.Add(1)\n    go func(id int) {\n        defer wg.Done()\n        fmt.Printf("Goroutine %d\\n", id)\n    }(i)\n}\n\nwg.Wait()  // 等待所有goroutine完成'
                },
                {
                    title: 'Channels',
                    description: 'goroutine间通信',
                    code: '// 创建channel\nch := make(chan int)\nbuffered := make(chan int, 10)  // 带缓冲\n\n// 发送和接收\ngo func() {\n    ch <- 42  // 发送\n}()\n\nvalue := <-ch  // 接收\n\n// 关闭channel\nclose(ch)\n\n// 检查channel是否关闭\nvalue, ok := <-ch\nif !ok {\n    fmt.Println("Channel已关闭")\n}\n\n// range遍历channel\ngo func() {\n    for i := 0; i < 5; i++ {\n        ch <- i\n    }\n    close(ch)\n}()\n\nfor value := range ch {\n    fmt.Println(value)\n}'
                },
                {
                    title: 'Select语句',
                    description: '多路复用',
                    code: '// select语句\nch1 := make(chan string)\nch2 := make(chan string)\n\ngo func() {\n    time.Sleep(1 * time.Second)\n    ch1 <- "来自ch1"\n}()\n\ngo func() {\n    time.Sleep(2 * time.Second)\n    ch2 <- "来自ch2"\n}()\n\nselect {\ncase msg1 := <-ch1:\n    fmt.Println(msg1)\ncase msg2 := <-ch2:\n    fmt.Println(msg2)\ncase <-time.After(3 * time.Second):\n    fmt.Println("超时")\ndefault:\n    fmt.Println("没有准备好的channel")\n}\n\n// 非阻塞发送/接收\nselect {\ncase ch <- value:\n    fmt.Println("发送成功")\ndefault:\n    fmt.Println("channel满了")\n}'
                }
            ]
        },
        {
            title: '包和模块',
            items: [
                {
                    title: '包声明',
                    description: '包的定义和导入',
                    code: '// 包声明（文件开头）\npackage main\n\n// 导入包\nimport "fmt"\nimport "math"\n\n// 批量导入\nimport (\n    "fmt"\n    "math"\n    "strings"\n)\n\n// 别名导入\nimport (\n    f "fmt"\n    m "math"\n)\n\n// 点导入（不推荐）\nimport . "fmt"\n\n// 空白导入（只执行init函数）\nimport _ "database/sql/driver"'
                },
                {
                    title: '可见性',
                    description: '大小写控制可见性',
                    code: '// 公开的（首字母大写）\ntype Person struct {\n    Name string    // 公开字段\n    Age  int       // 公开字段\n    email string   // 私有字段\n}\n\n// 公开方法\nfunc (p Person) GetName() string {\n    return p.Name\n}\n\n// 私有方法\nfunc (p Person) getEmail() string {\n    return p.email\n}\n\n// 公开函数\nfunc NewPerson(name string, age int) Person {\n    return Person{Name: name, Age: age}\n}\n\n// 私有函数\nfunc validateAge(age int) bool {\n    return age >= 0 && age <= 150\n}'
                },
                {
                    title: 'init函数',
                    description: '包初始化',
                    code: '// init函数在包被导入时自动执行\nfunc init() {\n    fmt.Println("包初始化")\n    // 初始化代码...\n}\n\n// 可以有多个init函数\nfunc init() {\n    fmt.Println("第二个init函数")\n}\n\n// 执行顺序：\n// 1. 包级别变量初始化\n// 2. init函数（按声明顺序）\n// 3. main函数（如果是main包）\n\nvar globalVar = initGlobalVar()\n\nfunc initGlobalVar() string {\n    fmt.Println("初始化全局变量")\n    return "initialized"\n}'
                }
            ]
        },
        {
            title: '常用标准库',
            items: [
                {
                    title: 'fmt包',
                    description: '格式化输入输出',
                    code: 'import "fmt"\n\n// 打印\nfmt.Print("Hello")\nfmt.Println("Hello")\nfmt.Printf("Hello, %s!\\n", "World")\n\n// 格式化字符串\nstr := fmt.Sprintf("年龄: %d", 25)\n\n// 扫描输入\nvar name string\nvar age int\nfmt.Scan(&name, &age)\nfmt.Scanf("%s %d", &name, &age)\nfmt.Scanln(&name, &age)\n\n// 常用格式化动词\n// %v  默认格式\n// %+v 带字段名的结构体\n// %#v Go语法表示\n// %T  类型\n// %d  十进制整数\n// %s  字符串\n// %f  浮点数\n// %t  布尔值'
                },
                {
                    title: 'strings包',
                    description: '字符串操作',
                    code: 'import "strings"\n\nstr := "Hello, World!"\n\n// 查找\ncontains := strings.Contains(str, "World")\nindex := strings.Index(str, "World")\ncount := strings.Count(str, "l")\n\n// 转换\nupper := strings.ToUpper(str)\nlower := strings.ToLower(str)\ntrimmed := strings.TrimSpace("  hello  ")\n\n// 分割和连接\nparts := strings.Split("a,b,c", ",")\njoined := strings.Join([]string{"a", "b", "c"}, ",")\n\n// 替换\nreplaced := strings.Replace(str, "World", "Go", 1)\nreplaceAll := strings.ReplaceAll(str, "l", "L")\n\n// 前缀和后缀\nhasPrefix := strings.HasPrefix(str, "Hello")\nhasSuffix := strings.HasSuffix(str, "!")'
                },
                {
                    title: 'time包',
                    description: '时间处理',
                    code: 'import "time"\n\n// 当前时间\nnow := time.Now()\n\n// 创建时间\nt := time.Date(2023, 12, 25, 15, 30, 0, 0, time.UTC)\n\n// 解析时间\nlayout := "2006-01-02 15:04:05"\nparsed, err := time.Parse(layout, "2023-12-25 15:30:00")\n\n// 格式化时间\nformatted := now.Format("2006-01-02 15:04:05")\nformatted2 := now.Format(time.RFC3339)\n\n// 时间运算\ntomorrow := now.Add(24 * time.Hour)\nyesterday := now.Add(-24 * time.Hour)\nduration := tomorrow.Sub(now)\n\n// 睡眠\ntime.Sleep(1 * time.Second)\ntime.Sleep(500 * time.Millisecond)\n\n// 定时器\ntimer := time.NewTimer(5 * time.Second)\n<-timer.C  // 等待定时器触发'
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GO_CHEATSHEET;
} else if (typeof window !== 'undefined') {
    window.GO_CHEATSHEET = GO_CHEATSHEET;
}