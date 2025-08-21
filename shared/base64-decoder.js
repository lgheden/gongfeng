
// Base64解码函数
function decodeBase64Content(content) {
    if (typeof content === 'string' && content.startsWith('__BASE64_ENCODED__:')) {
        try {
            const encoded = content.substring('__BASE64_ENCODED__:'.length);
            return atob(encoded);
        } catch (e) {
            console.error('Base64解码失败:', e);
            return content;
        }
    }
    return content;
}

// 处理prompt对象中的编码内容
function decodePromptContent(prompt) {
    if (!prompt) return prompt;
    
    // 解码prompt字段中的代码块
    if (prompt.prompt) {
        prompt.prompt = prompt.prompt.replace(/```([a-zA-Z]*?)\n__BASE64_ENCODED__:([^\n]+)\n```/g, 
            function(match, language, encoded) {
                try {
                    const decoded = atob(encoded);
                    return `\`\`\`${language}\n${decoded}\n\`\`\``;
                } catch (e) {
                    console.error('代码块解码失败:', e);
                    return match;
                }
            }
        );
    }
    
    // 解码examples中的代码
    if (prompt.examples && Array.isArray(prompt.examples)) {
        prompt.examples.forEach(example => {
            if (example.code) {
                example.code = decodeBase64Content(example.code);
            }
        });
    }
    
    return prompt;
}

// 批量处理prompt数组
function decodePromptArray(prompts) {
    if (!Array.isArray(prompts)) return prompts;
    return prompts.map(decodePromptContent);
}
