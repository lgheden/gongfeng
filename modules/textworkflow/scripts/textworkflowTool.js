/**
 * 文本处理工作流工具类
 */
class TextWorkflowTool {
    constructor() {
        this.stepTypes = {
            case: { name: '大小写转换', description: '转换文本的大小写格式' },
            replace: { name: '文本替换', description: '替换文本中的指定内容' },
            regex: { name: '正则替换', description: '使用正则表达式替换文本' },
            prefix: { name: '增加前缀', description: '为每行添加指定前缀' },
            suffix: { name: '增加后缀', description: '为每行添加指定后缀' },
            linebreak: { name: '换行符转换', description: '转换不同系统的换行符' },
            removeEmpty: { name: '删除空行', description: '删除文本中的空行' },
            removeChars: { name: '删除字符', description: '删除指定的字符' },
            addLineNumbers: { name: '增加行号', description: '为每行添加行号' },
            removeLineNumbers: { name: '删除行号', description: '删除行首的行号' },
            deduplicate: { name: '项目去重', description: '删除重复的行或项目' },
            trimLines: { name: '修剪行空格', description: '删除行首行尾的空格' },
            repeatText: { name: '重复文本', description: '重复文本内容' },
            reverse: { name: '翻转内容', description: '翻转文本或行的顺序' },
            sort: { name: '修改顺序', description: '对行进行排序' },
            encode: { name: '编码解码', description: '进行编码或解码操作' },
            fullwidth: { name: '全角半角', description: '转换全角和半角字符' }
        };
    }

    processWorkflow(text, steps) {
        let result = text;
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            try {
                result = this.executeStep(result, step);
            } catch (error) {
                throw new Error(`步骤 ${i + 1} (${step.type}) 执行失败: ${error.message}`);
            }
        }
        return result;
    }

    executeStep(text, step) {
        const method = `process${this.capitalizeFirst(step.type)}`;
        if (typeof this[method] === 'function') {
            return this[method](text, step.params);
        } else {
            throw new Error(`未知的处理类型: ${step.type}`);
        }
    }

    processCase(text, params) {
        const { caseType } = params;
        switch (caseType) {
            case 'uppercase': return text.toUpperCase();
            case 'lowercase': return text.toLowerCase();
            case 'capitalize': return text.replace(/\b\w/g, l => l.toUpperCase());
            case 'titlecase': return text.replace(/\b\w+/g, word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            default: return text;
        }
    }

    processReplace(text, params) {
        const { searchText, replaceText, caseSensitive } = params;
        if (!searchText) return text;
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(this.escapeRegex(searchText), flags);
        return text.replace(regex, replaceText || '');
    }

    processRegex(text, params) {
        const { pattern, replacement, flags } = params;
        if (!pattern) return text;
        try {
            const regex = new RegExp(pattern, flags || 'g');
            return text.replace(regex, replacement || '');
        } catch (error) {
            throw new Error(`正则表达式错误: ${error.message}`);
        }
    }

    processPrefix(text, params) {
        const { prefix } = params;
        if (!prefix) return text;
        return text.split('\n').map(line => prefix + line).join('\n');
    }

    processSuffix(text, params) {
        const { suffix } = params;
        if (!suffix) return text;
        return text.split('\n').map(line => line + suffix).join('\n');
    }

    processLinebreak(text, params) {
        const { targetFormat } = params;
        let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        switch (targetFormat) {
            case 'unix': return normalized;
            case 'windows': return normalized.replace(/\n/g, '\r\n');
            case 'mac': return normalized.replace(/\n/g, '\r');
            default: return normalized;
        }
    }

    processRemoveEmpty(text, params) {
        const { removeWhitespaceOnly } = params;
        const lines = text.split('\n');
        const filtered = lines.filter(line => {
            if (removeWhitespaceOnly) {
                return line.trim().length > 0;
            }
            return line.length > 0;
        });
        return filtered.join('\n');
    }

    processRemoveChars(text, params) {
        const { chars, mode } = params;
        if (!chars) return text;
        switch (mode) {
            case 'all':
                return text.split('').filter(char => !chars.includes(char)).join('');
            case 'start':
                return text.replace(new RegExp(`^[${this.escapeRegex(chars)}]+`), '');
            case 'end':
                return text.replace(new RegExp(`[${this.escapeRegex(chars)}]+$`), '');
            default:
                return text;
        }
    }

    processAddLineNumbers(text, params) {
        const { startNumber = 1, format = 'number', separator = ' ' } = params;
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const lineNumber = startNumber + index;
            let prefix = lineNumber.toString();
            if (format === 'zero_padded') {
                prefix = lineNumber.toString().padStart(3, '0');
            }
            return `${prefix}${separator}${line}`;
        }).join('\n');
    }

    processRemoveLineNumbers(text, params) {
        const { pattern = '^\\d+\\s*' } = params;
        try {
            const regex = new RegExp(pattern, 'gm');
            return text.replace(regex, '');
        } catch (error) {
            throw new Error(`行号删除模式错误: ${error.message}`);
        }
    }

    processDeduplicate(text, params) {
        const { mode = 'lines', caseSensitive = false } = params;
        if (mode === 'lines') {
            const lines = text.split('\n');
            const seen = new Set();
            const result = [];
            for (const line of lines) {
                const key = caseSensitive ? line : line.toLowerCase();
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(line);
                }
            }
            return result.join('\n');
        }
        return text;
    }

    processTrimLines(text, params) {
        const { trimStart = true, trimEnd = true } = params;
        return text.split('\n').map(line => {
            if (trimStart && trimEnd) {
                return line.trim();
            } else if (trimStart) {
                return line.trimStart();
            } else if (trimEnd) {
                return line.trimEnd();
            }
            return line;
        }).join('\n');
    }

    processRepeatText(text, params) {
        const { times = 2, separator = '\n' } = params;
        if (times <= 1) return text;
        const parts = [];
        for (let i = 0; i < times; i++) {
            parts.push(text);
        }
        return parts.join(separator);
    }

    processReverse(text, params) {
        const { mode = 'text' } = params;
        switch (mode) {
            case 'text': return text.split('').reverse().join('');
            case 'lines': return text.split('\n').reverse().join('\n');
            case 'words': return text.split(/\s+/).reverse().join(' ');
            default: return text;
        }
    }

    processSort(text, params) {
        const { sortType = 'alphabetical', reverse = false } = params;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        let sorted = lines.sort((a, b) => {
            let comparison = 0;
            switch (sortType) {
                case 'alphabetical': comparison = a.localeCompare(b); break;
                case 'length': comparison = a.length - b.length; break;
                case 'numerical':
                    const numA = parseFloat(a) || 0;
                    const numB = parseFloat(b) || 0;
                    comparison = numA - numB; break;
                default: comparison = a.localeCompare(b);
            }
            return reverse ? -comparison : comparison;
        });
        return sorted.join('\n');
    }

    processEncode(text, params) {
        const { operation } = params;
        try {
            switch (operation) {
                case 'base64_encode':
                    return btoa(unescape(encodeURIComponent(text)));
                case 'base64_decode':
                    return decodeURIComponent(escape(atob(text)));
                case 'url_encode':
                    return encodeURIComponent(text);
                case 'url_decode':
                    return decodeURIComponent(text);
                default:
                    return text;
            }
        } catch (error) {
            throw new Error(`编码/解码失败: ${error.message}`);
        }
    }

    processFullwidth(text, params) {
        const { direction = 'to_halfwidth' } = params;
        if (direction === 'to_halfwidth') {
            return text.replace(/[\uFF01-\uFF5E]/g, char =>
                String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
            ).replace(/\u3000/g, ' ');
        } else {
            return text.replace(/[\u0021-\u007E]/g, char =>
                String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
            ).replace(/ /g, '\u3000');
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getStepParamsConfig(stepType) {
        const configs = {
            case: {
                caseType: {
                    type: 'select',
                    label: '转换类型',
                    options: [
                        { value: 'uppercase', label: '全部大写' },
                        { value: 'lowercase', label: '全部小写' },
                        { value: 'capitalize', label: '首字母大写' },
                        { value: 'titlecase', label: '标题格式' }
                    ]
                }
            },
            replace: {
                searchText: { type: 'text', label: '查找文本' },
                replaceText: { type: 'text', label: '替换文本' },
                caseSensitive: { type: 'checkbox', label: '区分大小写' }
            },
            regex: {
                pattern: { type: 'text', label: '正则表达式' },
                replacement: { type: 'text', label: '替换内容' },
                flags: { type: 'text', label: '标志位' }
            },
            prefix: { prefix: { type: 'text', label: '前缀内容' } },
            suffix: { suffix: { type: 'text', label: '后缀内容' } },
            linebreak: {
                targetFormat: {
                    type: 'select',
                    label: '目标格式',
                    options: [
                        { value: 'unix', label: 'Unix (LF)' },
                        { value: 'windows', label: 'Windows (CRLF)' },
                        { value: 'mac', label: 'Mac (CR)' }
                    ]
                }
            },
            removeEmpty: {
                removeWhitespaceOnly: { type: 'checkbox', label: '仅删除空白行' }
            },
            removeChars: {
                chars: { type: 'text', label: '要删除的字符' },
                mode: {
                    type: 'select',
                    label: '删除模式',
                    options: [
                        { value: 'all', label: '删除所有匹配字符' },
                        { value: 'start', label: '删除行首字符' },
                        { value: 'end', label: '删除行尾字符' }
                    ]
                }
            },
            addLineNumbers: {
                startNumber: { type: 'number', label: '起始行号', value: 1 },
                format: {
                    type: 'select',
                    label: '行号格式',
                    options: [
                        { value: 'number', label: '数字' },
                        { value: 'zero_padded', label: '补零' }
                    ]
                },
                separator: { type: 'text', label: '分隔符', value: ' ' }
            },
            removeLineNumbers: {
                pattern: { type: 'text', label: '行号模式', value: '^\\d+\\s*' }
            },
            deduplicate: {
                mode: {
                    type: 'select',
                    label: '去重模式',
                    options: [
                        { value: 'lines', label: '按行去重' },
                        { value: 'words', label: '按词去重' }
                    ]
                },
                caseSensitive: { type: 'checkbox', label: '区分大小写' }
            },
            trimLines: {
                trimStart: { type: 'checkbox', label: '删除行首空格', value: true },
                trimEnd: { type: 'checkbox', label: '删除行尾空格', value: true }
            },
            repeatText: {
                times: { type: 'number', label: '重复次数', value: 2 },
                separator: { type: 'text', label: '分隔符', value: '\\n' }
            },
            reverse: {
                mode: {
                    type: 'select',
                    label: '翻转模式',
                    options: [
                        { value: 'text', label: '翻转文本' },
                        { value: 'lines', label: '翻转行序' },
                        { value: 'words', label: '翻转词序' }
                    ]
                }
            },
            sort: {
                sortType: {
                    type: 'select',
                    label: '排序类型',
                    options: [
                        { value: 'alphabetical', label: '字母顺序' },
                        { value: 'length', label: '长度顺序' },
                        { value: 'numerical', label: '数字顺序' }
                    ]
                },
                reverse: { type: 'checkbox', label: '倒序排列' }
            },
            encode: {
                operation: {
                    type: 'select',
                    label: '操作类型',
                    options: [
                        { value: 'base64_encode', label: 'Base64编码' },
                        { value: 'base64_decode', label: 'Base64解码' },
                        { value: 'url_encode', label: 'URL编码' },
                        { value: 'url_decode', label: 'URL解码' }
                    ]
                }
            },
            fullwidth: {
                direction: {
                    type: 'select',
                    label: '转换方向',
                    options: [
                        { value: 'to_halfwidth', label: '全角转半角' },
                        { value: 'to_fullwidth', label: '半角转全角' }
                    ]
                }
            }
        };
        return configs[stepType] || {};
    }
}

window.TextWorkflowTool = TextWorkflowTool;
