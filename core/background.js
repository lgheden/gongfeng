
// 页面分析器
let navigationStartTime = 0;
let webRequests = [];
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0) {
        navigationStartTime = details.timeStamp;
        webRequests = [];
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
            return;
        }
        console.log('Navigation started:', details.url, details.timeStamp);

        // 通知内容脚本重置分析状态
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'resetAnalyze' });
            }
        });
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.frameId === 0) {
            const requestInfo = {
                url: details.url,
                method: details.method,
                requestBody: details.requestBody ? JSON.stringify(details.requestBody) : '无请求体',
                timeStamp: details.timeStamp
            };
            webRequests.push(requestInfo);
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (details.frameId === 0) {
            const request = webRequests.find(req => req.url === details.url);
            if (request) {
                request.statusCode = details.statusCode;
                request.responseHeaders = JSON.stringify(details.responseHeaders);
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(
    (details) => {
        if (details.frameId === 0) {
            const request = webRequests.find(req => req.url === details.url);
            if (request) {
                request.error = details.error;
            }
        }
    },
    { urls: ["<all_urls>"] }
);


// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    const defaultOptions = {
        captureScreenshot: { type: 'visible', quality: 100, format: 'png' }
    };

    const actionHandlers = {
        captureScreenshot: async () => {
            const options = { ...defaultOptions.captureScreenshot, ...request.options };
            const dataUrl = await captureCurrentTab(sender.tab.id, options);
            return { success: true, dataUrl };
        },
        checkUrlTasks: async () => {
            return await checkAndExecuteUrlTasks(request.url, sender.tab.id);
        },
        updateContextMenus: () => {
            updateContextMenusFromConfig(request.modules || []);
            return { success: true };
        },
        updatePopupModules: () => {
            chrome.runtime.sendMessage({ action: 'updatePopupModules', modules: request.modules || [] });
            return { success: true };
        },
        startColorPicker: () => {
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['shared/colorPicker/colorPicker.js']
            });
            return { success: true };
        },
        startScreenshot: () => {
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['shared/screenshot/screenshot.js']
            });
            return { success: true };
        },
        startDashboard: () => {
            startAndAnalyze(sender.tab.id, sendResponse);
            return { success: true };
        },
        initTasks: () => {
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['shared/tasks/tasks.js']
            });
            return { success: true };
        }
    };

    // Handle the request if action exists
    if (actionHandlers[request.action]) {
        try {
            actionHandlers[request.action]()
                .then(result => sendResponse(result || { success: true }))
                .catch(error => sendResponse({ success: false, error: error.message }));
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        return true; // Keep message channel open for async responses
    }

    // Handle unknown actions
    sendResponse({ success: false, error: `Unknown action: ${request.action}` });
    return true;
});


// 检查URL并自动执行匹配的任务脚本
async function checkAndExecuteUrlTasks(currentUrl, tabId) {
    try {
        console.log('开始检查URL任务:', currentUrl, 'tabId:', tabId);

        const tasksDataStr = localStorage.getItem('userscript_tasks');
        const tasksData = tasksDataStr ? JSON.parse(tasksDataStr) : [];

        for (let task of tasksData) {
            if (matchUrl(task.scriptConfig.matchRules, currentUrl, task.status)) {
                await sendMessageToTab(tabId, {
                    action: 'getStoredTasks',
                    success: true
                });
                return true;
            }
        }

        // 所有任务都未匹配
         await sendMessageToTab(tabId, {
            action: 'getStoredTasks',
            success: false
        });
        return false;
    } catch (error) {
         await sendMessageToTab(tabId, {
            action: 'getStoredTasks',
            success: false
        });
        return false;
    }
}

function sendMessageToTab(tabId, message) {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}


function matchUrl(matchRules, currentUrl, status) {
    const rulesStatus = matchRules.some(rule => {
        let pattern = rule;

        try {
            // 处理 /正则表达式/ 形式
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
                const matched = pattern.match(/^\/(.*)\/([gimuy]*)$/);
                if (matched) {
                    const regex = new RegExp(matched[1], matched[2]);
                    return regex.test(currentUrl);
                }
            }

            // 通配符处理（* => .*）
            pattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '\\?');

            const regex = new RegExp('^' + pattern + '$');
            return regex.test(currentUrl);
        } catch (e) {
            console.warn(`规则解析错误：${pattern}`, e);
            return false;
        }
    });
    return rulesStatus && status === 'running';
}


// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener(() => {
    initializeContextMenus();
});

// 截取当前标签页
async function captureCurrentTab(tabId, options) {
    try {
        // 获取标签页信息
        const tab = await chrome.tabs.get(tabId);

        if (options.type === 'fullpage') {
            // 全屏截图
            return await captureFullPage(tabId, options);
        } else {
            // 可见区域截图
            const captureOptions = {
                format: options.format,
                quality: options.format === 'jpeg' ? options.quality : undefined
            };

            const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, captureOptions);
            return dataUrl;
        }
    } catch (error) {
        throw new Error('截图失败: ' + error.message);
    }
}


// 全屏截图功能
async function captureFullPage(tabId, options) {
    try {
        // 注入脚本获取页面尺寸
        const [result] = await chrome.scripting.executeScript({
            target: { tabId },
            function: () => {
                const devicePixelRatio = window.devicePixelRatio || 1;
                return {
                    scrollWidth: Math.max(
                        document.body.scrollWidth,
                        document.body.offsetWidth,
                        document.documentElement.clientWidth,
                        document.documentElement.scrollWidth,
                        document.documentElement.offsetWidth
                    ),
                    scrollHeight: Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.clientHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight
                    ),
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    originalScrollX: window.scrollX,
                    originalScrollY: window.scrollY,
                    devicePixelRatio: devicePixelRatio
                };
            }
        });

        const pageInfo = result.result;
        const screenshots = [];

        // 计算需要截图的次数
        const cols = Math.ceil(pageInfo.scrollWidth / pageInfo.viewportWidth);
        const rows = Math.ceil(pageInfo.scrollHeight / pageInfo.viewportHeight);

        // 限制最大截图数量以避免API限制
        const maxScreenshots = 20;
        const totalScreenshots = cols * rows;

        if (totalScreenshots > maxScreenshots) {
            throw new Error(`页面过大，需要${totalScreenshots}次截图，超出限制(${maxScreenshots})。请尝试缩小浏览器窗口或使用可见区域截图。`);
        }

        // 获取标签页信息
        const tab = await chrome.tabs.get(tabId);

        // 分块截图
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // 计算滚动位置，确保最后一行和最后一列不会超出页面边界
                let x = col * pageInfo.viewportWidth;
                let y = row * pageInfo.viewportHeight;

                // 如果是最后一列，调整x位置以避免超出页面宽度
                if (col === cols - 1 && x + pageInfo.viewportWidth > pageInfo.scrollWidth) {
                    x = Math.max(0, pageInfo.scrollWidth - pageInfo.viewportWidth);
                }

                // 如果是最后一行，调整y位置以避免超出页面高度
                if (row === rows - 1 && y + pageInfo.viewportHeight > pageInfo.scrollHeight) {
                    y = Math.max(0, pageInfo.scrollHeight - pageInfo.viewportHeight);
                }

                // 滚动到指定位置
                await chrome.scripting.executeScript({
                    target: { tabId },
                    function: (scrollX, scrollY) => {
                        window.scrollTo(scrollX, scrollY);
                    },
                    args: [x, y]
                });

                // 等待滚动完成
                await new Promise(resolve => setTimeout(resolve, 300));

                // 截图（带重试机制）
                const captureOptions = {
                    format: options.format,
                    quality: options.format === 'jpeg' ? options.quality : undefined
                };

                let dataUrl;
                let retryCount = 0;
                const maxRetries = 3;

                while (retryCount < maxRetries) {
                    try {
                        dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, captureOptions);
                        break;
                    } catch (error) {
                        retryCount++;
                        if (error.message.includes('MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND')) {
                            // API频率限制，等待更长时间后重试
                            const waitTime = 1000 * retryCount;
                            console.log(`API频率限制，等待${waitTime}ms后重试 (${retryCount}/${maxRetries})`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                        } else {
                            throw error;
                        }
                    }
                }

                if (!dataUrl) {
                    throw new Error(`截图失败，已重试${maxRetries}次`);
                }

                screenshots.push({
                    dataUrl,
                    x,
                    y,
                    row,
                    col
                });

                // 避免API频率限制，每次截图后等待
                if (row < rows - 1 || col < cols - 1) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }
        }

        // 恢复原始滚动位置
        await chrome.scripting.executeScript({
            target: { tabId },
            function: (scrollX, scrollY) => {
                window.scrollTo(scrollX, scrollY);
            },
            args: [pageInfo.originalScrollX, pageInfo.originalScrollY]
        });

        // 如果只有一张截图，直接返回
        if (screenshots.length === 1) {
            return screenshots[0].dataUrl;
        }

        // 合并多张截图
        return await mergeScreenshots(screenshots, pageInfo, options, tabId);

    } catch (error) {
        //console.error('全屏截图失败:', error);
        throw new Error('全屏截图失败: ' + error.message);
    }
}

// 合并截图
async function mergeScreenshots(screenshots, pageInfo, options, tabId) {
    try {
        // 在content script中执行合并操作
        const [result] = await chrome.scripting.executeScript({
            target: { tabId },
            function: (screenshotsData, pageInfoData, optionsData) => {
                return new Promise((resolve) => {
                    try {
                        // 首先加载第一张图片来获取实际的截图尺寸
                        const firstImg = new Image();
                        firstImg.onload = () => {
                            const screenshotWidth = firstImg.width;
                            const screenshotHeight = firstImg.height;
                            const devicePixelRatio = pageInfoData.devicePixelRatio || 1;

                            // 计算实际需要的Canvas尺寸
                            const cols = Math.ceil(pageInfoData.scrollWidth / pageInfoData.viewportWidth);
                            const rows = Math.ceil(pageInfoData.scrollHeight / pageInfoData.viewportHeight);

                            // Canvas尺寸应该精确匹配页面内容尺寸
                            // 使用页面的实际尺寸，避免多余的空白区域
                            const canvasWidth = pageInfoData.scrollWidth * devicePixelRatio;
                            const canvasHeight = pageInfoData.scrollHeight * devicePixelRatio;

                            // 创建canvas元素
                            const canvas = document.createElement('canvas');
                            canvas.width = canvasWidth;
                            canvas.height = canvasHeight;
                            const ctx = canvas.getContext('2d');

                            // 设置白色背景
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            let loadedCount = 0;
                            const totalImages = screenshotsData.length;

                            // 加载并绘制每张截图
                            screenshotsData.forEach((screenshot) => {
                                const img = new Image();
                                img.onload = () => {
                                    // 对于最后一行和最后一列，使用实际滚动位置，否则使用理论位置
                                    let positionX, positionY;

                                    // 检查是否为最后一列
                                    if (screenshot.col === cols - 1 &&
                                        (screenshot.col * pageInfoData.viewportWidth + pageInfoData.viewportWidth) > pageInfoData.scrollWidth) {
                                        positionX = screenshot.x; // 使用实际滚动位置
                                    } else {
                                        positionX = screenshot.col * pageInfoData.viewportWidth; // 使用理论位置
                                    }

                                    // 检查是否为最后一行
                                    if (screenshot.row === rows - 1 &&
                                        (screenshot.row * pageInfoData.viewportHeight + pageInfoData.viewportHeight) > pageInfoData.scrollHeight) {
                                        positionY = screenshot.y; // 使用实际滚动位置
                                    } else {
                                        positionY = screenshot.row * pageInfoData.viewportHeight; // 使用理论位置
                                    }

                                    // 在高DPI环境下，需要调整绘制位置
                                    const drawX = positionX * devicePixelRatio;
                                    const drawY = positionY * devicePixelRatio;

                                    // 确保不超出Canvas边界
                                    const finalDrawX = Math.min(drawX, canvasWidth - img.width);
                                    const finalDrawY = Math.min(drawY, canvasHeight - img.height);

                                    // 计算绘制尺寸，确保不超出Canvas边界
                                    const drawWidth = Math.min(img.width, canvasWidth - finalDrawX);
                                    const drawHeight = Math.min(img.height, canvasHeight - finalDrawY);

                                    if (drawWidth > 0 && drawHeight > 0) {
                                        ctx.drawImage(img, 0, 0, drawWidth, drawHeight, finalDrawX, finalDrawY, drawWidth, drawHeight);
                                    }

                                    loadedCount++;

                                    // 所有图片加载完成后转换为数据URL
                                    if (loadedCount === totalImages) {
                                        const quality = optionsData.format === 'jpeg' ? optionsData.quality / 100 : undefined;
                                        const dataUrl = canvas.toDataURL(`image/${optionsData.format}`, quality);
                                        resolve(dataUrl);
                                    }
                                };
                                img.onerror = () => {
                                    //console.error('图片加载失败:', screenshot.dataUrl.substring(0, 50));
                                    loadedCount++;
                                    if (loadedCount === totalImages) {
                                        const quality = optionsData.format === 'jpeg' ? optionsData.quality / 100 : undefined;
                                        const dataUrl = canvas.toDataURL(`image/${optionsData.format}`, quality);
                                        resolve(dataUrl);
                                    }
                                };
                                img.src = screenshot.dataUrl;
                            });
                        };

                        firstImg.onerror = () => {
                            //console.error('无法加载第一张截图');
                            resolve(screenshotsData[0]?.dataUrl || null);
                        };

                        // 如果没有截图，返回空白canvas
                        if (screenshotsData.length === 0) {
                            const canvas = document.createElement('canvas');
                            canvas.width = pageInfoData.viewportWidth;
                            canvas.height = pageInfoData.viewportHeight;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            const quality = optionsData.format === 'jpeg' ? optionsData.quality / 100 : undefined;
                            const dataUrl = canvas.toDataURL(`image/${optionsData.format}`, quality);
                            resolve(dataUrl);
                            return;
                        }

                        // 加载第一张图片来获取尺寸
                        firstImg.src = screenshotsData[0].dataUrl;

                    } catch (error) {
                        //console.error('Canvas合并失败:', error);
                        resolve(screenshotsData[0]?.dataUrl || null);
                    }
                });
            },
            args: [screenshots, pageInfo, options]
        });

        return result.result;

    } catch (error) {
        //console.error('合并截图失败:', error);
        // 如果合并失败，返回第一张截图
        return screenshots[0]?.dataUrl || null;
    }
}

// 右键菜单点击事件
// 右键菜单点击事件监听器
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    // 定义模块处理配置
    const handlers = {
        'module-manager': () => {
            // 打开模块管理页面
            chrome.tabs.create({
                url: chrome.runtime.getURL('core/module-manager/module-manager.html')
            });
        },
        'page-screenshot': async (tabId) => {
            // 注入页面截图按钮
            await chrome.tabs.sendMessage(tabId, { action: 'injectScreenshotButton' }, (response) => {
                if (chrome.runtime.lastError) {
                    //console.error('发送消息失败:', chrome.runtime.lastError.message);
                } else {
                    //console.log('截图按钮注入成功:', response);
                }
            });
        },
        'get-color': async (tabId) => {
            // 执行取色器脚本
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['shared/colorPicker/colorPicker.js']
            });
        },
        'dashboard': async (tabId) => {
            // 启动分析仪表盘
            await startAndAnalyze(tabId);
        }
    };

    try {
        // 获取当前活动标签
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab) {
            //console.error('未找到活动标签');
            return;
        }

        // 处理模块管理器
        if (info.menuItemId === 'module-manager') {
            handlers['module-manager']();
            return;
        }

        // 处理模块执行
        if (info.menuItemId.startsWith('module-')) {
            const moduleId = info.menuItemId.replace('module-', '');

            // 如果有特定处理器，执行对应逻辑
            if (handlers[moduleId]) {
                await handlers[moduleId](activeTab.id);
            } else {
                // 默认打开模块页面
                chrome.tabs.create({
                    url: chrome.runtime.getURL(`modules/${moduleId}/${moduleId}.html`)
                });
            }
        }
    } catch (error) {
        //console.error(`处理右键菜单 ${info.menuItemId} 失败:`, error);
    }
});

// 初始化右键菜单
async function initializeContextMenus() {
    try {
        // 清除所有现有的右键菜单
        await chrome.contextMenus.removeAll();

        // 创建主菜单
        chrome.contextMenus.create({
            id: 'xiaomifeng-tools',
            title: '小蜜蜂工具箱',
            contexts: ['all']
        });

        // 添加模块管理入口
        chrome.contextMenus.create({
            id: 'module-manager',
            parentId: 'xiaomifeng-tools',
            title: '⚙️ 模块管理',
            contexts: ['all']
        });

    } catch (error) {
        //console.error('初始化右键菜单失败:', error);
    }
}

// 根据配置更新右键菜单
async function updateContextMenusFromConfig(modules) {
    try {
        // 清除所有现有的右键菜单
        await chrome.contextMenus.removeAll();

        if (modules && modules.length > 0) {
            // 重新创建主菜单
            chrome.contextMenus.create({
                id: 'xiaomifeng-tools',
                title: '小蜜蜂工具箱',
                contexts: ['all']
            });

            // 添加模块管理入口
            chrome.contextMenus.create({
                id: 'module-manager',
                parentId: 'xiaomifeng-tools',
                title: '⚙️ 模块管理',
                contexts: ['all']
            });

            // 添加分隔符
            chrome.contextMenus.create({
                id: 'separator-1',
                parentId: 'xiaomifeng-tools',
                type: 'separator',
                contexts: ['all']
            });

            // 添加模块
            modules.forEach(module => {
                chrome.contextMenus.create({
                    id: `module-${module.id}`,
                    parentId: 'xiaomifeng-tools',
                    title: `${module.icon || '🔧'} ${module.name}`,
                    contexts: ['all']
                });
            });
        }

    } catch (error) {
        //console.error('更新右键菜单失败:', error);
        throw error;
    }
}


// 封装分析逻辑
function startAndAnalyze(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "startAnalyze" }, (startResponse) => {
        if (chrome.runtime.lastError || !startResponse || startResponse.error) {
            //console.error('Start analysis failed:', chrome.runtime.lastError || startResponse.error);
            return;
        }
        if (startResponse.status === 'Analysis started') {
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { action: 'analyze' }, (analyzeResponse) => {
                    if (chrome.runtime.lastError || !analyzeResponse || analyzeResponse.error) {
                        // console.error('无法执行性能分析:', chrome.runtime.lastError || analyzeResponse.error);
                        return;
                    }
                    chrome.storage.local.set({ analysisData: analyzeResponse }, () => {
                        chrome.tabs.create({ url: chrome.runtime.getURL('modules/dashboard/dashboard.html') });
                    });
                });
            }, 1000);
        } else {
            // console.error('无法启动性能分析:', startResponse.error);
        }
    });
}
