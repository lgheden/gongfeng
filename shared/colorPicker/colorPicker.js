
// 启动取色器
initColorPicker();

// 初始化取色器
function initColorPicker() {
  const startPicker = createColorPickerUI(saveColor);
  startPicker.addEventListener('click', () => {
    if (window.EyeDropper) {
      useEyeDropper();
    } else {
      useFallbackPicker();
    }
  });
}


// 保存和更新颜色框
let currentBoxIndex = 0;
function saveColor(hex) {
  const box = document.getElementById(`colorBox${(currentBoxIndex % 6) + 1}`);
  box.style.backgroundColor = hex;
  box.textContent = hex;
  box.style.color = getContrastColor(hex);
  currentBoxIndex++;
}

// 使用EyeDropper API
function useEyeDropper() {
  if (!window.EyeDropper) {
    console.warn('EyeDropper API不可用，切换到备用方案');
    useFallbackPicker();
    return;
  }
  const eyeDropper = new EyeDropper();
  eyeDropper
    .open()
    .then((result) => {
      const hex = result.sRGBHex;
      saveColor(hex);
    })
    .catch((err) => {
      console.error('取色失败:', err);
      alert('取色失败，请重试');
    });
}

// 备用方案：使用本地 html2canvas
function useFallbackPicker() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('lib/html2canvas.min.js');
  script.onerror = () => {
    alert('无法加载 html2canvas，请检查扩展文件');
  };
  script.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      alert('无法初始化 Canvas 上下文');
      return;
    }

    html2canvas(document.body, {
      useCORS: true,
      logging: false,
      allowTaint: false
    }).then((renderedCanvas) => {
      canvas.width = renderedCanvas.width;
      canvas.height = renderedCanvas.height;
      ctx.drawImage(renderedCanvas, 0, 0);

      const onClick = (e) => {
        if (e.target.closest('#MFcolor')) return;
        const x = Math.floor(e.clientX);
        const y = Math.floor(e.clientY);
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
          alert('点击位置超出有效区域，请在页面内点击');
          return;
        }
        try {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
          saveColor(hex);
        } catch (err) {
          console.error('getImageData 错误:', err);
          alert('无法获取颜色，页面可能包含跨域资源，请在同源环境测试');
        }
      };

      document.body.addEventListener('click', onClick);
      document.getElementById('startPicker').addEventListener('click', () => {
        document.body.removeEventListener('click', onClick);
      }, { once: true });
    }).catch((err) => {
      console.error('html2canvas 渲染失败:', err);
      alert('页面渲染失败，可能包含跨域资源，请在同源环境测试');
    });
  };
  document.head.appendChild(script);
}

function removeColorPickerUI() {
  const pickerUI = document.getElementById('MFColorPicker');
  if (pickerUI) pickerUI.remove();
}

// 创建漂浮取色器UI，仅包含开始取色按钮和6个颜色框，所有样式内联
function createColorPickerUI(saveColorCallback) {
  if (document.getElementById('MFcolor')) return;
  const pickerUI = document.createElement('div');
  pickerUI.id = 'MFcolor';
  pickerUI.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 16px;
      z-index: 10000;
      width: 220px;
      max-width: 100%;
      transition: all 0.3s ease;
      cursor: move;
      user-select: none;
  `;
  pickerUI.innerHTML = `
      <div id="MFcolor-inner" style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <button id="startPicker" style="width: 100%; background: linear-gradient(to right, #3b82f6, #4f46e5); color: #ffffff; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; transition: background 0.2s ease; outline: none;">开始取色</button>
          <div id="colorHistory" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%;">
              <div id="colorBox1" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
              <div id="colorBox2" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
              <div id="colorBox3" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
              <div id="colorBox4" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
              <div id="colorBox5" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
              <div id="colorBox6" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #e5e7eb; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4b5563; text-align: center; cursor: pointer; transition: transform 0.2s ease;">未选择</div>
          </div>
      </div>
  `;
  document.body.appendChild(pickerUI);

  // 按钮悬浮和聚焦样式
  const startPicker = pickerUI.querySelector('#startPicker');
  startPicker.addEventListener('mouseenter', () => {
    startPicker.style.background = 'linear-gradient(to right, #2563eb, #4338ca)';
  });
  startPicker.addEventListener('mouseleave', () => {
    startPicker.style.background = 'linear-gradient(to right, #3b82f6, #4f46e5)';
  });
  startPicker.addEventListener('focus', () => {
    startPicker.style.boxShadow = '0 0 0 2px #93c5fd';
  });
  startPicker.addEventListener('blur', () => {
    startPicker.style.boxShadow = 'none';
  });

  // 颜色框点击复制和悬浮效果
  const colorBoxes = Array.from(pickerUI.querySelectorAll('#colorHistory > div'));
  colorBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      const hex = box.textContent.startsWith('#') ? box.textContent : '';
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => {
          alert(`已复制颜色: ${hex}`);
        });
      }
    });
    box.addEventListener('mouseenter', () => {
      box.style.transform = 'scale(1.1)';
    });
    box.addEventListener('mouseleave', () => {
      box.style.transform = 'scale(1)';
    });
  });

  // 拖拽功能
  let isDragging = false;
  let currentX;
  let initialX;
  let initialY;

  pickerUI.addEventListener('mousedown', (e) => {
    if (e.target.id === 'startPicker' || e.target.closest('#colorHistory > div')) return;
    isDragging = true;
    initialX = e.clientX - (currentX || 0);
    initialY = e.clientY - (currentY || 0);
    pickerUI.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      pickerUI.style.left = `${currentX}px`;
      pickerUI.style.top = `${currentY}px`;
      pickerUI.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    pickerUI.style.cursor = 'move';
  });

  // 初始化位置
  currentX = window.innerWidth - pickerUI.offsetWidth - 16;
  currentY = 16;
  pickerUI.style.left = `${currentX}px`;
  pickerUI.style.top = `${currentY}px`;

  // 返回按钮供 colorPicker.js 使用
  return startPicker;
}

// 转换为HEX格式
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// HEX转RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// 计算对比色以确保文字可读
function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#1f2937' : '#ffffff';
}