document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const websitesContainer = document.getElementById('websitesContainer');

    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const websiteModal = document.getElementById('websiteModal');
    const modalClose = document.querySelector('.close');

    // 统计元素
    const totalCategories = document.getElementById('totalCategories');
    const totalWebsites = document.getElementById('totalWebsites');
    const favoritesCount = document.getElementById('favoritesCount');
    const loadTime = document.getElementById('loadTime');

    // 初始化状态
    let navigationData = [];
    let filteredData = [];
    let favorites = [];
    let currentView = 'grid';
    let currentModalWebsite = null;

    // API配置
    const API_URL = 'https://xmf.anyitv.com/WebStackData';

    // 初始化
    init();

    function init() {
        loadFavorites();
        loadNavigationData();
        bindEvents();
        showStatus('模块初始化完成', 'success');
    }

    // 绑定事件
    function bindEvents() {
        // 搜索相关
        searchBtn.addEventListener('click', performSearch);
        clearSearchBtn.addEventListener('click', clearSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 筛选相关
        categoryFilter.addEventListener('change', filterData);
        sortFilter.addEventListener('change', sortData);

        // 视图切换
        gridViewBtn.addEventListener('click', () => switchView('grid'));
        listViewBtn.addEventListener('click', () => switchView('list'));

        // 工具栏
        exportBtn.addEventListener('click', exportFavorites);
        importBtn.addEventListener('click', importFavorites);

        // 模态框
        modalClose.addEventListener('click', closeModal);
        window.addEventListener('click', function (e) {
            if (e.target === websiteModal) {
                closeModal();
            }
        });

        // 监听网站网格滚动事件，自动高亮对应分类
        websitesContainer.addEventListener('scroll', debounce(updateActiveCategoryOnScroll, 100));

        // 使用IntersectionObserver优化滚动检测
        // 延迟执行，确保DOM完全加载
       // setTimeout(setupIntersectionObserver, 500);
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 使用IntersectionObserver优化滚动检测
    let categoryObserver = null;

    function setupIntersectionObserver() {
        // 清理之前的observer
        if (categoryObserver) {
            categoryObserver.disconnect();
        }

        const observerOptions = {
            root: websitesContainer,
            rootMargin: '0px 0px -90% 0px',
            threshold: 0
        };

        categoryObserver = new IntersectionObserver((entries) => {
            if (categoryFilter.value) return; // 如果有筛选，不自动更新

            let visibleHeaders = [];

            const containerRect = websitesContainer.getBoundingClientRect();
            entries.forEach(entry => {
                if (entry.target.classList.contains('category-header')) {
                    const categoryName = entry.target.querySelector('h4').textContent;
                    // const rect = entry.target.getBoundingClientRect();

                    // 计算与容器顶部的距离和交集比例
                    // const distance = Math.abs(rect.top - containerRect.top);
                    // const intersectionRatio = entry.intersectionRatio;

                    visibleHeaders.push({
                        name: categoryName,
                        // distance: distance,
                        //  top: rect.top,
                        //  intersectionRatio: intersectionRatio,
                        //  isIntersecting: entry.isIntersecting
                    });
                }
            });

            // 找到当前应该激活的分类（基于视口位置）
            let activeCategory = null;
            
            // 找到第一个标题顶部在容器顶部或下方的分类
            let closestBelow = null;
            let minDistance = Infinity;
            
            visibleHeaders.forEach(header => {
                const distance = header.top - containerRect.top;
                if (distance >= 0 && distance < minDistance) {
                    minDistance = distance;
                    closestBelow = header;
                }
            });
            
            // 如果没有在容器下方的标题，找最后一个在容器上方的标题
            if (!closestBelow) {
                let closestAbove = null;
                let maxTop = -Infinity;
                
                visibleHeaders.forEach(header => {
                    if (header.top <= containerRect.top && header.top > maxTop) {
                        maxTop = header.top;
                        closestAbove = header;
                    }
                });
                activeCategory = closestAbove ? closestAbove.name : null;
            } else {
                activeCategory = closestBelow.name;
            }
            
            if (activeCategory) {
                document.querySelectorAll('.category-card').forEach(card => {
                    if (card.getAttribute('data-category') === activeCategory) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }, observerOptions);

        // 观察所有分类标题
        setTimeout(() => {
            const headers = document.querySelectorAll('.category-header');
            headers.forEach(header => {
                if (categoryObserver) {
                    categoryObserver.observe(header);
                }
            });
        }, 100); // 减少等待时间
    }

    // 根据滚动位置更新活跃分类（基于视口位置）
    function updateActiveCategoryOnScroll() {
        if (categoryFilter.value) return; // 如果有筛选，不自动更新

        const categoryHeaders = document.querySelectorAll('.category-header');
        const containerRect = websitesContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        
        let activeCategory = null;
        
        // 收集所有可见的标题信息
        const headers = [];
        for (let header of categoryHeaders) {

            const headerRect = header.getBoundingClientRect();

            console.info("【"+header.querySelector('h4').textContent+"】元素："+headerRect.top+"+"+headerRect.bottom)
            console.info("【父元素】："+containerRect.top+"+"+containerRect.bottom)

            
            if (headerRect.top <= containerRect.top + 30) {
                headers.push({
                    element: header,
                    top: headerRect.top,
                    name: header.querySelector('h4').textContent
                });
                activeCategory = header.querySelector('h4').textContent;
            }

        }
        

        if (activeCategory) {
            document.querySelectorAll('.category-card').forEach(card => {
                if (card.getAttribute('data-category') === activeCategory) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }
    }

    // 加载导航数据
    async function loadNavigationData() {
        const startTime = performance.now();
        showStatus('正在加载数据...', 'info');

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigationData = await response.json();
            filteredData = [...navigationData];

            updateStatistics();
            renderCategories();
            renderWebsites();
            updateCategoryFilter();

            const endTime = performance.now();
            // const loadDuration = Math.round(endTime - startTime);
            //loadTime.textContent = loadDuration + 'ms';

            showStatus(`数据加载完成，共 ${navigationData.length} 个分类`, 'success');
        } catch (error) {
            console.error('加载数据失败:', error);
            showStatus('数据加载失败: ' + error.message, 'error');

            // 使用示例数据作为备用
            loadFallbackData();
        }
    }

    // 备用数据
    function loadFallbackData() {
        navigationData = [
            {
                "name": "常用推荐",
                "en_name": "Recommended",
                "icon": "linecons-star",
                "web": [
                    {
                        "url": "https://dribbble.com/",
                        "logo": "assets/images/logos/dribbble.png",
                        "title": "Dribbble",
                        "desc": "全球UI设计师作品分享平台。"
                    },
                    {
                        "url": "https://behance.net/",
                        "logo": "assets/images/logos/behance.png",
                        "title": "Behance",
                        "desc": "Adobe旗下的设计师交流平台，来自世界各地的设计师在这里分享自己的作品。"
                    }
                ]
            }
        ];
        filteredData = [...navigationData];
        updateStatistics();
        renderCategories();
        renderWebsites();
        updateCategoryFilter();
    }

    // 更新统计信息
    function updateStatistics() {
        const totalCats = navigationData.length;
        const totalSites = navigationData.reduce((sum, category) => sum + category.web.length, 0);
        const favCount = favorites.length;

        // totalCategories.textContent = totalCats;
        totalWebsites.textContent = totalSites;
        favoritesCount.textContent = favCount;
    }

    // 渲染分类
    function renderCategories() {
        categoriesContainer.innerHTML = '';

        navigationData.forEach((category, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.setAttribute('data-category', category.name);
            categoryCard.innerHTML = `
                <div class="category-icon">${getCategoryIcon(category.icon)}</div>
                <div class="category-info">
                    <h4>${category.name}</h4>
                    <span class="site-count">${category.web.length} 个网站</span>
                </div>
            `;

            categoryCard.addEventListener('click', () => {
                // 移除所有分类的active状态
                document.querySelectorAll('.category-card').forEach(card => {
                    card.classList.remove('active');
                });

                // 添加当前分类的active状态
                categoryCard.classList.add('active');

                // 设置筛选器并筛选数据
                categoryFilter.value = category.name;
                filterData();

                // 滚动到对应的分类区域
                scrollToCategory(category.name);
            });

            categoriesContainer.appendChild(categoryCard);
        });
    }

    // 滚动到指定分类
    function scrollToCategory(categoryName) {
        const categoryHeaders = document.querySelectorAll('.category-header');
        for (let header of categoryHeaders) {
            if (header.querySelector('h4').textContent === categoryName) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    }

    // 渲染网站列表
    function renderWebsites() {
        websitesContainer.innerHTML = '';

        filteredData.forEach(category => {
            if (category.web.length > 0) {
                // 创建分类标题
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category-header';
                categoryHeader.innerHTML = `
                    <h4>${category.name}</h4>
                    <span class="category-count">${category.web.length} 个网站</span>
                `;

                // 创建分类网站容器
                const categoryWebsites = document.createElement('div');
                categoryWebsites.className = `category-websites ${currentView === 'list' ? 'list-view' : ''}`;

                // 添加网站卡片
                category.web.forEach(website => {
                    const websiteCard = createWebsiteCard(website, category.name);
                    categoryWebsites.appendChild(websiteCard);
                });

                // 添加到主容器
                websitesContainer.appendChild(categoryHeader);
                websitesContainer.appendChild(categoryWebsites);
            }
        });

        // 重新设置IntersectionObserver

    }

    function createWebsiteCard(website, categoryName) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('data-url', website.url);

        const isFavorite = favorites.some(fav => fav.url === website.url);

        card.innerHTML = `
        <div class="website-logo">
            <img src="${website.logo}" alt="${website.title}" onerror="this.src='../../shared/images/default-logo.png'">
        </div>
        <div class="website-info">
            <h4>${website.title}</h4>
            <p>${website.desc}</p>
        </div>
        <div class="website-actions">
            <span class="favorite-btn ${isFavorite ? 'favorited' : ''}" title="${isFavorite ? '取消收藏' : '收藏'}">
                ${isFavorite ? '❤️' : '🤍'}
            </span>
        </div>`;

        // 为收藏按钮添加事件
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(website, categoryName);
        });

        // 为卡片添加点击跳转事件
        card.addEventListener('click', () => visitWebsite(website.url));

        return card;
    }

    // 搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (!searchTerm) {
            filteredData = [...navigationData];
        } else {
            filteredData = navigationData.map(category => ({
                ...category,
                web: category.web.filter(website =>
                    website.title.toLowerCase().includes(searchTerm) ||
                    website.desc.toLowerCase().includes(searchTerm) ||
                    category.name.toLowerCase().includes(searchTerm)
                )
            })).filter(category => category.web.length > 0);
        }

        renderWebsites();
        showStatus(`搜索完成，找到 ${filteredData.reduce((sum, cat) => sum + cat.web.length, 0)} 个结果`, 'success');
    }

    // 清空搜索
    function clearSearch() {
        searchInput.value = '';
        categoryFilter.value = '';
        filteredData = [...navigationData];

        // 移除所有分类的active状态
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });

        renderWebsites();
        showStatus('搜索已清空', 'info');
    }

    // 筛选数据
    function filterData() {
        const selectedCategory = categoryFilter.value;

        if (!selectedCategory) {
            filteredData = [...navigationData];
            // 移除所有分类的active状态
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
        } else {
            filteredData = navigationData.filter(category => category.name === selectedCategory);
            // 更新左侧分类网格的选中状态
            document.querySelectorAll('.category-card').forEach(card => {
                if (card.getAttribute('data-category') === selectedCategory) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // 滚动到对应的分类区域
            scrollToCategory(selectedCategory);
        }

        renderWebsites();
    }

    // 排序数据
    function sortData() {
        const sortType = sortFilter.value;

        filteredData.forEach(category => {
            category.web.sort((a, b) => {
                switch (sortType) {
                    case 'name':
                        return a.title.localeCompare(b.title);
                    case 'category':
                        return category.name.localeCompare(category.name);
                    case 'recent':
                        return 0; // 这里可以根据实际需求实现
                    default:
                        return 0;
                }
            });
        });

        renderWebsites();
    }

    // 切换视图
    function switchView(viewType) {
        currentView = viewType;

        if (viewType === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }

        renderWebsites();
    }

    // 更新分类筛选器
    function updateCategoryFilter() {
        categoryFilter.innerHTML = '<option value="">全部分类</option>';
        navigationData.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    // 访问网站
    function visitWebsite(url) {
        window.open(url, '_blank');
        showStatus('正在打开网站...', 'info');
    }

    // 显示网站详情
    function showWebsiteDetail(website, categoryName) {
        currentModalWebsite = { ...website, category: categoryName };

        document.getElementById('modalTitle').textContent = website.title;
        document.getElementById('modalLogo').src = website.logo;
        document.getElementById('modalName').textContent = website.title;
        document.getElementById('modalDesc').textContent = website.desc;
        document.getElementById('modalUrl').textContent = website.url;
        document.getElementById('modalCategory').textContent = categoryName;

        const isFavorite = favorites.some(fav => fav.url === website.url);
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.textContent = isFavorite ? '取消收藏' : '收藏';
        favoriteBtn.className = `btn ${isFavorite ? 'btn-danger' : 'btn-outline'}`;

        // 绑定模态框按钮事件
        document.getElementById('visitBtn').onclick = () => visitWebsite(website.url);
        document.getElementById('favoriteBtn').onclick = () => toggleFavorite(website, categoryName);
        document.getElementById('copyUrlBtn').onclick = () => copyToClipboard(website.url);

        websiteModal.style.display = 'block';
    }

    // 关闭模态框
    function closeModal() {
        websiteModal.style.display = 'none';
        currentModalWebsite = null;
    }

    // 切换收藏状态
    function toggleFavorite(website, categoryName) {
        const websiteData = { ...website, category: categoryName };
        const existingIndex = favorites.findIndex(fav => fav.url === website.url);

        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            showStatus('已取消收藏', 'info');
        } else {
            favorites.push(websiteData);
            showStatus('已添加到收藏', 'success');
        }

        saveFavorites();
        updateStatistics();
        renderWebsites();

        // 如果模态框打开，更新模态框状态
        if (currentModalWebsite && currentModalWebsite.url === website.url) {
            const favoriteBtn = document.getElementById('favoriteBtn');
            const isFavorite = favorites.some(fav => fav.url === website.url);
            favoriteBtn.textContent = isFavorite ? '取消收藏' : '收藏';
            favoriteBtn.className = `btn ${isFavorite ? 'btn-danger' : 'btn-outline'}`;
        }
    }

    // 保存收藏
    function saveFavorites() {
        localStorage.setItem('webNavigationFavorites', JSON.stringify(favorites));
    }

    // 加载收藏
    function loadFavorites() {
        const saved = localStorage.getItem('webNavigationFavorites');
        favorites = saved ? JSON.parse(saved) : [];
    }

    // 导出收藏
    function exportFavorites() {
        if (favorites.length === 0) {
            showStatus('没有收藏的网站', 'warning');
            return;
        }

        const dataStr = JSON.stringify(favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'web-navigation-favorites.json';
        link.click();
        URL.revokeObjectURL(url);

        showStatus('收藏已导出', 'success');
    }

    // 导入收藏
    function importFavorites() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const importedFavorites = JSON.parse(e.target.result);
                        favorites = [...favorites, ...importedFavorites];
                        saveFavorites();
                        updateStatistics();
                        renderWebsites();
                        showStatus(`成功导入 ${importedFavorites.length} 个收藏`, 'success');
                    } catch (error) {
                        showStatus('导入失败：文件格式错误', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showStatus('链接已复制到剪贴板', 'success');
        }).catch(() => {
            showStatus('复制失败', 'error');
        });
    }

    // 获取分类图标
    function getCategoryIcon(iconClass) {
        const iconMap = {
            'linecons-star': '⭐',
            'linecons-heart': '❤️',
            'linecons-cog': '⚙️',
            'linecons-diamond': '💎',
            'linecons-fire': '🔥',
            'linecons-rocket': '🚀',
            'linecons-lightbulb': '💡',
            'linecons-graduation-cap': '🎓',
            'linecons-briefcase': '💼',
            'linecons-gamepad': '🎮',
            'linecons-music': '🎵',
            'linecons-camera': '📷',
            'linecons-car': '🚗',
            'linecons-plane': '✈️',
            'linecons-home': '🏠',
            'linecons-coffee': '☕',
            'linecons-gift': '🎁',
            'linecons-trophy': '🏆',
            'linecons-medal': '🥇',
            'linecons-crown': '👑'
        };

        return iconMap[iconClass] || '📁';
    }

    // 显示状态信息
    function showStatus(message, type = 'info') {
        // statusBar.textContent = message;
        // statusBar.className = `status-bar ${type}`;
        // setTimeout(() => {
        //    statusBar.textContent = '';
        //    statusBar.className = 'status-bar';
        //}, 3000);
    }
});