if (typeof chrome !== 'undefined' && chrome.runtime) {
  const url = window.location.href;
  chrome.runtime.sendMessage({ action: 'checkUrlTasks', url: url }, (response) => {
      return true; 
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'injectScreenshotButton') {
      (async () => {
        try {
          chrome.runtime.sendMessage({ action: 'startScreenshot' });
        } catch (error) {
        }
      })();
    } else if (request.action === 'startColorPicker') {
      (async () => {
        chrome.runtime.sendMessage({ action: 'startColorPicker' });
      })();
      return true;
    } else if (request.action === 'startDashboard') {
      (async () => {
        chrome.runtime.sendMessage({ action: 'startDashboard' });
      })();
      return true;
    } else if (request.action === 'getStoredTasks') {
      // 获取存储的用户脚本任务（优先从chrome.storage.local读取）
      (async () => {
        initTask();
      })();
      return true;
    }
  });
} else {
  console.log('Chrome runtime 不可用，无法设置消息监听器');
}



(function () {
  // 配置项
  const CONFIG = {
    MAX_RESPONSE_BODY_LENGTH: 1000,
    MAX_STORED_REQUESTS: 50,
    MAX_STORED_ERRORS: 50,
    MAX_HTML_LENGTH: 10000 // 限制HTML长度为10KB
  };

  // 存储错误和请求
  let errors = [];
  let requests = [];
  let vitals = {
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
    inp: null,
    fcp: null
  };
  let isAnalyzing = false;
  let originalFetch = null;
  let originalXhrOpen = null;
  let originalXhrSend = null;

  // 错误处理
  function handleError(type, message, details = {}) {
    if (errors.length >= CONFIG.MAX_STORED_ERRORS) {
      errors.shift();
    }
    errors.push({
      type,
      message,
      timestamp: performance.now(),
      ...details
    });
    console.log('Error recorded:', { type, message, ...details });
  }

  // 启动性能分析
  function startPerformanceAnalysis() {
    if (isAnalyzing) {
      console.log('Analysis already started');
      return;
    }
    isAnalyzing = true;
    errors = [];
    requests = [];
    vitals = { lcp: null, cls: null, fid: null, ttfb: null, inp: null, fcp: null };

    // 全局错误监听
    window.onerror = (message, source, lineno, colno, error) => {
      handleError('JavaScript', message, {
        filename: source,
        lineno,
        colno,
        stack: error?.stack || '无堆栈信息'
      });
      return false;
    };

    // 资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target.tagName && (event.target.src || event.target.href)) {
        handleError('资源加载', `资源加载失败: ${event.target.src || event.target.href}`, {
          filename: event.target.src || event.target.href,
          tag: event.target.tagName
        });
      }
    }, true);

    // 未捕获的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      handleError('Promise', `未捕获的Promise错误: ${event.reason?.message || event.reason}`, {
        stack: event.reason?.stack || '无堆栈信息'
      });
    });

    // Web Vitals 收集
    if (typeof webVitals !== 'undefined') {
      try {
        webVitals.getLCP((metric) => { vitals.lcp = metric.value; });
        webVitals.getCLS((metric) => { vitals.cls = metric.value; });
        webVitals.getFID((metric) => { vitals.fid = metric.value; });
        webVitals.getTTFB((metric) => { vitals.ttfb = metric.value; });
        webVitals.getINP((metric) => { vitals.inp = metric.value; });
        webVitals.getFCP((metric) => { vitals.fcp = metric.value; });
      } catch (e) {
        handleError('Web Vitals', `Web Vitals 收集失败: ${e.message}`, { stack: e.stack });
      }
    } else {
      console.warn('Web Vitals 库未加载');
      handleError('Web Vitals', 'Web Vitals 库未加载');
    }

    // Fetch 拦截
    if (window.fetch) {
      originalFetch = window.fetch;
      window.fetch = async function (...args) {
        console.log('Fetch intercepted:', args);
        const startTime = performance.now();
        const requestInfo = {
          url: typeof args[0] === 'string' ? args[0] : args[0].url,
          method: args[1]?.method || 'GET',
          requestBody: args[1]?.body ? args[1].body.toString() : '无请求体',
          timestamp: startTime
        };

        try {
          const response = await originalFetch(...args);
          const clonedResponse = response.clone();
          let responseBody;
          try {
            responseBody = await clonedResponse.text();
            try {
              responseBody = JSON.stringify(JSON.parse(responseBody), null, 2);
            } catch (e) {
              // 非JSON，保留文本
            }
            //responseBody = responseBody.substring(0, CONFIG.MAX_RESPONSE_BODY_LENGTH);
          } catch (e) {
            responseBody = '无法读取响应体';
            handleError('Fetch', `无法读取响应体: ${e.message}`, { url: requestInfo.url });
          }

          if (requests.length >= CONFIG.MAX_STORED_REQUESTS) {
            requests.shift();
          }
          requests.push({
            ...requestInfo,
            status: response.status,
            statusText: response.statusText,
            responseBody,
            type: 'fetch'
          });

          return response;
        } catch (error) {
          handleError('Fetch', `请求失败: ${error.message}`, { url: requestInfo.url });
          requests.push({
            ...requestInfo,
            status: null,
            statusText: error.message,
            responseBody: `请求失败: ${error.message}`,
            type: 'fetch'
          });
          throw error;
        }
      };
    } else {
      console.warn('window.fetch 未定义');
      handleError('Fetch', 'window.fetch 未定义');
    }

    // XMLHttpRequest 拦截
    if (window.XMLHttpRequest) {
      originalXhrOpen = XMLHttpRequest.prototype.open;
      originalXhrSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._xhrInfo = {
          url: typeof url === 'string' ? url : url.toString(),
          method,
          timestamp: performance.now()
        };
        console.log('XHR opened:', this._xhrInfo);
        return originalXhrOpen.apply(this, [method, url, ...args]);
      };

      XMLHttpRequest.prototype.send = function (body) {
        const xhrInfo = this._xhrInfo || {};
        xhrInfo.requestBody = body ? body.toString() : '无请求体';

        this.addEventListener('load', () => {
          let responseBody;
          try {
            responseBody = this.responseText.substring(0, CONFIG.MAX_RESPONSE_BODY_LENGTH);
            try {
              responseBody = JSON.stringify(JSON.parse(responseBody), null, 2);
            } catch (e) {
              // 非JSON，保留文本
            }
          } catch (e) {
            responseBody = '无法读取响应体';
            handleError('XHR', `无法读取响应体: ${e.message}`, { url: xhrInfo.url });
          }

          if (requests.length >= CONFIG.MAX_STORED_REQUESTS) {
            requests.shift();
          }
          requests.push({
            ...xhrInfo,
            status: this.status,
            statusText: this.statusText,
            responseBody,
            type: 'xhr'
          });
        });

        this.addEventListener('error', () => {
          handleError('XHR', `请求失败`, { url: xhrInfo.url });
          requests.push({
            ...xhrInfo,
            status: null,
            statusText: '请求失败',
            responseBody: '请求失败',
            type: 'xhr'
          });
        });

        return originalXhrSend.apply(this, [body]);
      };
    } else {
      console.warn('XMLHttpRequest 未定义');
      handleError('XHR', 'XMLHttpRequest 未定义');
    }

    console.log('Performance analysis started');
  }

  // 停止性能分析
  function stopPerformanceAnalysis() {
    if (!isAnalyzing) {
      console.log('Analysis not running');
      return;
    }
    isAnalyzing = false;

    // 恢复原始 fetch 和 XMLHttpRequest
    if (originalFetch) {
      window.fetch = originalFetch;
      originalFetch = null;
    }
    if (originalXhrOpen && originalXhrSend) {
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
      originalXhrOpen = null;
      originalXhrSend = null;
    }

    // 移除错误监听器
    window.onerror = null;
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleError);

    // 清空数据
    errors = [];
    requests = [];
    vitals = { lcp: null, cls: null, fid: null, ttfb: null, inp: null, fcp: null };

    console.log('Performance analysis stopped');
  }

  // 重置分析状态
  function resetAnalyze() {
    stopPerformanceAnalysis();
    console.log('Analysis state reset');
  }

  // 性能指标收集
  function collectPerformanceMetrics() {
    if (!isAnalyzing) {
      console.warn('Analysis not started');
      return { error: '性能分析未启动' };
    }

    const timing = performance.timing || {};
    const resources = performance.getEntriesByType("resource") || [];
    const paints = performance.getEntriesByType("paint") || [];


    let pageHtml = '无法获取HTML';
    try {
      pageHtml = document.documentElement.outerHTML || 'HTML内容为空';
      //      if (pageHtml.length > CONFIG.MAX_HTML_LENGTH) {
      //        pageHtml = pageHtml.substring(0, CONFIG.MAX_HTML_LENGTH) + '...[内容已截断]';
      //      }
    } catch (e) {
      handleError('HTML', `无法获取页面HTML: ${e.message}`, { stack: e.stack });
    }

    const navStart = timing.navigationStart || performance.timeOrigin || 0;
    const loadTime = timing.loadEventEnd > 0 ? timing.loadEventEnd - navStart : 0;
    const domContent = timing.domContentLoadedEventEnd > 0 ? timing.domContentLoadedEventEnd - navStart : 0;

    const metrics = {
      pageUrl: window.location.href || '未知URL',
      pageTitle: document.title || '无标题',
      pageHtml,
      navStart: navStart,
      loadTime: loadTime.toFixed(2),
      domContent: domContent.toFixed(2),
      resourceCount: resources.length,
      totalSize: resources.reduce((sum, resource) => sum + (resource.encodedBodySize || 0), 0) / 1024,
      resources: resources.map(r => ({
        url: r.name,
        type: r.initiatorType,
        size: ((r.encodedBodySize || 0) / 1024).toFixed(2),
        duration: r.duration.toFixed(2)
      })),
      firstPaint: (paints.find(p => p.name === 'first-paint')?.startTime || 0).toFixed(2),
      firstContentfulPaint: (paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0).toFixed(2),
      ttfb: (performance.getEntriesByType("navigation")[0]?.responseStart || 0).toFixed(2),
      errors,
      vitals,
      requests // 包含 fetch 和 xhr 的请求数据，包括 responseBody
    };

    console.log('Analyze metrics:', metrics);
    return metrics;
  }

  // 消息监听
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startAnalyze') {
      startPerformanceAnalysis();
      sendResponse({ status: 'Analysis started' });
    } else if (request.action === 'analyze') {
      sendResponse(collectPerformanceMetrics());
    } else if (request.action === 'stopAnalyze') {
      stopPerformanceAnalysis();
      sendResponse({ status: 'Analysis stopped' });
    } else if (request.action === 'resetAnalyze') {
      resetAnalyze();
      sendResponse({ status: 'Analysis reset' });
    }
    return true;
  });


})();

