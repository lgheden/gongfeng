/**
 * 拼音转换器工具类
 * 支持按优先级查询：成语(4字) -> 三字词 -> 二字词 -> 单字
 */
class PinyinConverterTool {
    constructor() {
        // 初始化配置
        this.config = {
            showTone: true,
            showAllPronunciation: false,
            addSpaces: false,
            mode: 'hanzi-to-pinyin'
        };
        // 字典数据（将通过异步加载填充）
        this.fourCharDict = window.fourCharDict;
        this.threeCharDict = window.threeCharDict;
        this.twoCharDict = window.twoCharDict;
        this.singleCharDict = window.singleCharDict;
        this.allDict = {};

        // 拼音到汉字的反向字典
        this.reversePinyinDict = {};

        // 多音字统计
        this.polyphoneCount = 0;

        // 字典加载状态
        this.dictionariesLoaded = false;

        // 初始化字典
        this.initDictionaries();
    }

    /**
     * 初始化分层字典 - 从独立的JS文件加载
     */
    async initDictionaries() {
        try {

            // 合并字典用于反向查询
            this.allDict = {
                ...window.fourCharDict,
                ...window.threeCharDict,
                ...window.twoCharDict,
                ...window.singleCharDict
            };

            // 初始化反向字典
            this.reversePinyinDict = this.initReversePinyinDict();
            this.dictionariesLoaded = true;

            console.log('拼音字典加载完成');
        } catch (error) {
            console.warn('无法加载独立字典文件，使用内置字典', error);
            this.loadBuiltinDictionaries();
        }
    }

    /**
     * 在浏览器环境中加载字典
     */
    async loadDictionariesInBrowser() {
        // 由于ES模块的限制，我们在这里使用内置字典
        // 在实际部署时，可以通过服务器API或其他方式加载
        this.loadBuiltinDictionaries();
    }

    /**
     * 在Node.js环境中加载字典
     */
    loadDictionariesInNode() {
        try {
            const fs = require('fs');
            const path = require('path');

            const scriptsPath = path.dirname(__filename);

            // 同步读取字典文件
            const fourCharCode = fs.readFileSync(path.join(scriptsPath, 'fourCharDict.js'), 'utf8');
            const threeCharCode = fs.readFileSync(path.join(scriptsPath, 'threeCharDict.js'), 'utf8');
            const twoCharCode = fs.readFileSync(path.join(scriptsPath, 'twoCharDict.js'), 'utf8');
            const singleCharCode = fs.readFileSync(path.join(scriptsPath, 'singleCharDict.js'), 'utf8');

            // 执行代码并提取默认导出
            this.fourCharDict = this.extractDefaultExport(fourCharCode);
            this.threeCharDict = this.extractDefaultExport(threeCharCode);
            this.twoCharDict = this.extractDefaultExport(twoCharCode);
            this.singleCharDict = this.extractDefaultExport(singleCharCode);
        } catch (error) {
            console.warn('Node.js环境加载字典失败，使用内置字典', error);
          //  this.loadBuiltinDictionaries();
        }
    }

    /**
     * 从代码字符串中提取默认导出对象
     */
    extractDefaultExport(code) {
        // 简单的正则提取方式
        const match = code.match(/export\s+default\s+(\{[\s\S]*?\});/);
        if (match) {
            try {
                // 使用Function构造器安全地评估对象
                return new Function('return ' + match[1])();
            } catch (error) {
                console.error('解析字典文件失败:', error);
                return {};
            }
        }
        return {};
    }

    /**
     * 加载内置字典数据（作为备用方案）
     */
    loadBuiltinDictionaries() {
        // 四字成语字典
        this.fourCharDict = {
            '踉踉跄跄': 'liàng liàng qiàng qiàng',
            '以古为鉴': 'yǐ gǔ wéi jiàn',
            '称心如意': 'chèn xīn rú yì',
            '稻荷寿司': 'dào hè shòu sī',
            '繁花似锦': 'fán huā sì jǐn',
            '你好世界': 'nǐ hǎo shì jiè',
            '心想事成': 'xīn xiǎng shì chéng',
            '一帆风顺': 'yī fān fēng shùn',
            '恭喜发财': 'gōng xǐ fā cái',
            '万事如意': 'wàn shì rú yì',
            '身体健康': 'shēn tǐ jiàn kāng',
            '工作顺利': 'gōng zuò shùn lì',
            '学习进步': 'xué xí jìn bù',
            '事业成功': 'shì yè chéng gōng'
        };

        // 三字词语字典
        this.threeCharDict = {
            '一场空': 'yī cháng kōng',
            '星相图': 'xīng xiàng tú',
            '金山屯': 'jīn shān zhūn',
            '计算机': 'jì suàn jī',
            '程序员': 'chéng xù yuán',
            '互联网': 'hù lián wǎng',
            '大数据': 'dà shù jù',
            '云计算': 'yún jì suàn',
            '新时代': 'xīn shí dài',
            '好朋友': 'hǎo péng yǒu'
        };

        // 二字词语字典
        this.twoCharDict = {
            '倒下': 'dǎo xià',
            '奇零': 'jī líng',
            '你好': 'nǐ hǎo',
            '世界': 'shì jiè',
            '拼音': 'pīn yīn',
            '汉字': 'hàn zì',
            '转换': 'zhuǎn huàn',
            '工具': 'gōng jù',
            '程序': 'chéng xù',
            '开发': 'kāi fā',
            '工作': 'gōng zuò',
            '学习': 'xué xí',
            '生活': 'shēng huó',
            '朋友': 'péng yǒu',
            '音乐': 'yīn yuè',
            '银行': 'yín háng'
        };

        // 单字字典
        this.singleCharDict = {
            '缕': 'lǚ', '缓': 'huǎn', '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
            '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí', '人': 'rén', '我': 'wǒ',
            '你': 'nǐ', '他': 'tā', '她': 'tā', '的': 'de', '了': 'le', '在': 'zài', '有': 'yǒu',
            '是': 'shì', '不': 'bù', '这': 'zhè', '那': 'nà', '个': 'gè', '上': 'shàng', '下': 'xià',
            '来': 'lái', '去': 'qù', '会': 'huì', '要': 'yào', '可': 'kě', '大': 'dà', '小': 'xiǎo',
            '多': 'duō', '少': 'shǎo', '好': 'hǎo', '新': 'xīn', '老': 'lǎo', '高': 'gāo',
            '长': 'cháng', '短': 'duǎn', '看': 'kàn', '听': 'tīng', '说': 'shuō', '做': 'zuò',
            '行': 'xíng', '走': 'zǒu', '家': 'jiā', '学': 'xué', '校': 'xiào', '工': 'gōng',
            '年': 'nián', '月': 'yuè', '日': 'rì', '天': 'tiān', '爱': 'ài', '心': 'xīn',
            '生': 'shēng', '活': 'huó', '世': 'shì', '界': 'jiè', '中': 'zhōng', '国': 'guó',
            '银': 'yín', '音': 'yīn', '乐': 'lè', '和': 'hé', '得': 'dé', '过': 'guò',
            '还': 'hái', '都': 'dōu', '为': 'wéi', '把': 'bǎ', '被': 'bèi', '给': 'gěi',
            '对': 'duì', '与': 'yǔ', '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '书': 'shū',
            '车': 'chē', '电': 'diàn', '话': 'huà', '吃': 'chī', '喝': 'hē', '穿': 'chuān',
            '住': 'zhù', '红': 'hóng', '白': 'bái', '黑': 'hēi', '绿': 'lǜ', '里': 'lǐ',
            '外': 'wài', '前': 'qián', '后': 'hòu', '左': 'zuǒ', '右': 'yòu', '东': 'dōng',
            '西': 'xī', '南': 'nán', '北': 'běi', '问': 'wèn', '答': 'dá', '知': 'zhī',
            '道': 'dào', '想': 'xiǎng', '找': 'zhǎo', '买': 'mǎi', '卖': 'mài', '钱': 'qián',
            '元': 'yuán', '时': 'shí', '候': 'hòu', '早': 'zǎo', '晚': 'wǎn', '今': 'jīn',
            '明': 'míng', '昨': 'zuó', '开': 'kāi', '关': 'guān', '门': 'mén', '窗': 'chuāng',
            '房': 'fáng', '手': 'shǒu', '脚': 'jiǎo', '头': 'tóu', '眼': 'yǎn', '鼻': 'bí',
            '口': 'kǒu', '耳': 'ěr', '身': 'shēn', '男': 'nán', '女': 'nǚ', '孩': 'hái',
            '子': 'zi', '父': 'fù', '母': 'mǔ', '哥': 'gē', '弟': 'dì', '姐': 'jiě',
            '妹': 'mèi', '朋': 'péng', '友': 'yǒu', '师': 'shī', '同': 'tóng', '事': 'shì'
        };

        // 合并字典
        this.allDict = {
            ...this.fourCharDict,
            ...this.threeCharDict,
            ...this.twoCharDict,
            ...this.singleCharDict
        };

        // 初始化反向字典
        this.reversePinyinDict = this.initReversePinyinDict();
        this.dictionariesLoaded = true;
    }

    /**
     * 等待字典加载完成
     */
    async waitForDictionaries() {
        if (this.dictionariesLoaded) return;

        // 等待字典加载
        let attempts = 0;
        while (!this.dictionariesLoaded && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!this.dictionariesLoaded) {
            throw new Error('字典加载超时');
        }
    }

    /**
     * 按优先级查找拼音
     * 查询顺序：四字成语 -> 三字词 -> 二字词 -> 单字
     */
    findPinyinByPriority(text, startIndex) {
        const remainingLength = text.length - startIndex;

        // 1. 优先匹配四字成语
        if (remainingLength >= 4) {
            const fourChar = text.substr(startIndex, 4);
            if (window.fourCharDict[fourChar]) {
                return {
                    text: fourChar,
                    pinyin: window.fourCharDict[fourChar],
                    length: 4
                };
            }
        }

        // 2. 匹配三字词语
        if (remainingLength >= 3) {
            const threeChar = text.substr(startIndex, 3);
            if (window.threeCharDict[threeChar]) {
                return {
                    text: threeChar,
                    pinyin: window.threeCharDict[threeChar],
                    length: 3
                };
            }
        }

        // 3. 匹配二字词语
        if (remainingLength >= 2) {
            const twoChar = text.substr(startIndex, 2);
            if (window.twoCharDict[twoChar]) {
                return {
                    text: twoChar,
                    pinyin: window.twoCharDict[twoChar],
                    length: 2
                };
            }
        }

        // 4. 匹配单字
        const singleChar = text.charAt(startIndex);
        if (window.singleCharDict[singleChar]) {
            return {
                text: singleChar,
                pinyin: window.singleCharDict[singleChar],
                length: 1
            };
        }

        // 未找到匹配
        return null;
    }

    /**
     * 初始化反向拼音字典
     */
    initReversePinyinDict() {
        const reverseDict = {};

        for (const [text, pinyin] of Object.entries(this.allDict)) {
            const cleanPinyin = pinyin.toLowerCase().replace(/\s+/g, '');
            const noTonePinyin = this.removeTone(cleanPinyin);

            // 原始拼音（带声调）
            if (!reverseDict[cleanPinyin]) {
                reverseDict[cleanPinyin] = [];
            }
            if (!reverseDict[cleanPinyin].includes(text)) {
                reverseDict[cleanPinyin].push(text);
            }

            // 无声调拼音
            if (!reverseDict[noTonePinyin]) {
                reverseDict[noTonePinyin] = [];
            }
            if (!reverseDict[noTonePinyin].includes(text)) {
                reverseDict[noTonePinyin].push(text);
            }
        }

        return reverseDict;
    }

    /**
     * 核心处理方法
     */
    async process(input, options = {}) {
        try {
            // 等待字典加载完成
            await this.waitForDictionaries();

            this.config = { ...this.config, ...options };
            this.polyphoneCount = 0;

            this.validateInput(input);

            let result;
            if (this.config.mode === 'hanzi-to-pinyin') {
                result = this.hanziToPinyin(input);
            } else {
                result = this.pinyinToHanzi(input);
            }

            return this.formatOutput(result, this.config);
        } catch (error) {
            throw new Error(`转换失败: ${error.message}`);
        }
    }

    /**
     * 汉字转拼音（使用优先级匹配）
     */
    hanziToPinyin(input) {
        const results = [];
        let i = 0;

        while (i < input.length) {
            const char = input.charAt(i);

            if (this.isHanzi(char)) {
                // 使用优先级查找
                const match = this.findPinyinByPriority(input, i);

                if (match) {
                    let pinyin = match.pinyin;

                    // 处理声调显示
                    if (!this.config.showTone) {
                        pinyin = this.removeTone(pinyin);
                    }

                    results.push(pinyin);
                    i += match.length; // 跳过已匹配的字符
                } else {
                    // 未找到匹配，保持原字符
                    results.push(char);
                    i++;
                }
            } else {
                // 非汉字字符，保持原样
                results.push(char);
                i++;
            }
        }

        return results.join(this.config.addSpaces ? ' ' : '');
    }

    /**
     * 拼音转汉字
     */
    pinyinToHanzi(input) {
        const pinyins = this.splitPinyinInput(input);
        const results = [];

        for (const pinyin of pinyins) {
            const cleanPinyin = pinyin.trim().toLowerCase();
            if (cleanPinyin) {
                const hanziList = this.reversePinyinDict[cleanPinyin];
                if (hanziList && hanziList.length > 0) {
                    if (this.config.showAllPronunciation && hanziList.length > 1) {
                        results.push(hanziList.slice(0, 5).join('|'));
                    } else {
                        // 按优先级返回：优先返回长词组
                        const sortedList = hanziList.sort((a, b) => b.length - a.length);
                        results.push(sortedList[0]);
                    }
                } else {
                    results.push(pinyin);
                }
            }
        }

        return results.join(this.config.addSpaces ? ' ' : '');
    }

    /**
     * 分割拼音输入
     */
    splitPinyinInput(input) {
        return input.split(/[\s,;，；]+/).filter(p => p.trim());
    }

    /**
     * 验证输入
     */
    validateInput(input) {
        if (!input || typeof input !== 'string') {
            throw new Error('输入内容无效');
        }

        if (input.trim().length === 0) {
            throw new Error('输入内容不能为空');
        }

        return true;
    }

    /**
     * 格式化输出
     */
    formatOutput(result, options) {
        if (!result) return '';
        return result.toString();
    }

    /**
     * 判断是否为汉字
     */
    isHanzi(char) {
        const code = char.charCodeAt(0);
        return code >= 0x4e00 && code <= 0x9fff;
    }

    /**
     * 去除拼音声调
     */
    removeTone(pinyin) {
        const toneMap = {
            'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
            'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
            'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
            'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
            'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
            'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü', 'ü': 'v'
        };

        return pinyin.split('').map(char => toneMap[char] || char).join('');
    }

    /**
     * 获取多音字数量
     */
    getPolyphoneCount() {
        return this.polyphoneCount;
    }

    /**
     * 统计汉字数量
     */
    countHanzi(text) {
        let count = 0;
        for (const char of text) {
            if (this.isHanzi(char)) {
                count++;
            }
        }
        return count;
    }

    /**
     * 加载示例文本
     */
    getSampleText(mode = 'hanzi-to-pinyin') {
        if (mode === 'hanzi-to-pinyin') {
            return '你好世界！程序员在计算机前工作。心想事成，万事如意！';
        } else {
            return 'ni hao shi jie cheng xu yuan zai ji suan ji qian gong zuo';
        }
    }
}
