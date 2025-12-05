/**
 * 鱼类计数器模块
 * 统计玩家吃掉的各种鱼的数量
 */

// 创建全局命名空间
window.FishCounter = window.FishCounter || {};

(function() {
    'use strict';
    
    // 鱼的类型定义
    const FISH_TYPES = {
        1: { name: '蝌蚪', color: '#90EE90' },
        2: { name: '青蛙', color: '#32CD32' },
        3: { name: '海龟', color: '#4682B4' },
        4: { name: '小金鱼', color: '#FFD700' },
        5: { name: '锦鲤', color: '#FF6347' },
        6: { name: '电鳗', color: '#9370DB' },
        7: { name: '鲨鱼', color: '#708090' },
        8: { name: '鲸鱼', color: '#4169E1' },
        9: { name: '蛟龙', color: '#DC143C' },
        10: { name: '神龙', color: '#FF4500' }
    };
    
    // 统计数据存储
    let fishCountData = {};
    let totalFishEaten = 0;
    let uiElement = null;
    let detailElement = null;
    
    /**
     * 初始化计数器
     */
    function init() {
        // 重置所有计数
        fishCountData = {};
        totalFishEaten = 0;
        
        // 初始化每种鱼的计数为0
        for (let type in FISH_TYPES) {
            fishCountData[type] = 0;
        }
        
        // 创建UI显示元素
        createUI();
        
        console.log('🐟 鱼类计数器已初始化');
    }
    
    /**
     * 创建UI显示界面
     */
    function createUI() {
        // 如果已存在，先移除
        if (uiElement) {
            uiElement.remove();
        }
        if (detailElement) {
            detailElement.remove();
        }
        
        // 创建主计数显示（右上角）
        uiElement = document.createElement('div');
        uiElement.id = 'fish-counter-ui';
        uiElement.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        uiElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🐟 吃鱼统计</div>
            <div id="total-fish-count" style="font-size: 24px; color: #FFD700;">0</div>
            <div style="font-size: 12px; color: #aaa; margin-top: 3px;">点击查看详情</div>
        `;
        
        // 创建详细统计面板（默认隐藏）
        detailElement = document.createElement('div');
        detailElement.id = 'fish-counter-detail';
        detailElement.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.7);
            display: none;
            min-width: 250px;
            max-height: 500px;
            overflow-y: auto;
        `;
        
        // 点击切换详细面板
        uiElement.addEventListener('click', toggleDetail);
        
        // 添加到页面
        document.body.appendChild(uiElement);
        document.body.appendChild(detailElement);
        
        // 更新显示
        updateUI();
    }
    
    /**
     * 切换详细统计面板
     */
    function toggleDetail() {
        if (detailElement.style.display === 'none') {
            detailElement.style.display = 'block';
            uiElement.style.display = 'none';
        } else {
            detailElement.style.display = 'none';
            uiElement.style.display = 'block';
        }
    }
    
    /**
     * 记录吃掉一条鱼
     * @param {number} fishType - 鱼的类型ID (1-10)
     */
    function addFish(fishType) {
        if (!FISH_TYPES[fishType]) {
            console.warn('⚠️ 未知的鱼类型:', fishType);
            return;
        }
        
        // 增加计数
        fishCountData[fishType]++;
        totalFishEaten++;
        
        // 更新UI
        updateUI();
        
        // 显示吃鱼动画提示
        showEatAnimation(fishType);
        
        console.log(`🎣 吃掉了 ${FISH_TYPES[fishType].name}! 总计: ${totalFishEaten} 条`);
    }
    
    /**
     * 更新UI显示
     */
    function updateUI() {
        // 更新总数
        const totalElement = document.getElementById('total-fish-count');
        if (totalElement) {
            totalElement.textContent = totalFishEaten;
            
            // 添加动画效果
            totalElement.style.transform = 'scale(1.3)';
            totalElement.style.color = '#FFD700';
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        // 更新详细统计
        updateDetailPanel();
    }
    
    /**
     * 更新详细统计面板
     */
    function updateDetailPanel() {
        if (!detailElement) return;
        
        let html = `
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #FFD700; padding-bottom: 5px;">
                🐟 详细统计
            </div>
            <div style="margin-bottom: 10px;">
                <strong>总计:</strong> <span style="color: #FFD700; font-size: 20px;">${totalFishEaten}</span> 条
            </div>
        `;
        
        // 按类型显示
        for (let type in FISH_TYPES) {
            const count = fishCountData[type];
            const fishInfo = FISH_TYPES[type];
            const percentage = totalFishEaten > 0 ? ((count / totalFishEaten) * 100).toFixed(1) : 0;
            
            if (count > 0) {
                html += `
                    <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; border-left: 3px solid ${fishInfo.color};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: ${fishInfo.color}; font-weight: bold;">${fishInfo.name}</span>
                            <span style="font-size: 18px; color: #FFD700;">${count}</span>
                        </div>
                        <div style="font-size: 12px; color: #aaa; margin-top: 3px;">
                            占比: ${percentage}%
                        </div>
                        <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 5px; overflow: hidden;">
                            <div style="background: ${fishInfo.color}; height: 100%; width: ${percentage}%;"></div>
                        </div>
                    </div>
                `;
            }
        }
        
        // 添加关闭按钮
        html += `
            <button id="close-detail-btn" style="
                width: 100%;
                margin-top: 15px;
                padding: 10px;
                background: #FFD700;
                border: none;
                border-radius: 5px;
                color: black;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
            ">关闭详情</button>
        `;
        
        detailElement.innerHTML = html;
        
        // 绑定关闭按钮事件
        const closeBtn = document.getElementById('close-detail-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleDetail);
        }
    }
    
    /**
     * 显示吃鱼动画提示
     */
    function showEatAnimation(fishType) {
        const fishInfo = FISH_TYPES[fishType];
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 10px;
            background: ${fishInfo.color};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 10001;
            animation: slideInOut 2s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;
        notification.textContent = `+1 ${fishInfo.name}`;
        
        // 添加动画样式
        if (!document.getElementById('fish-counter-animation-style')) {
            const style = document.createElement('style');
            style.id = 'fish-counter-animation-style';
            style.textContent = `
                @keyframes slideInOut {
                    0% { transform: translateX(300px); opacity: 0; }
                    20% { transform: translateX(0); opacity: 1; }
                    80% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(300px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // 2秒后移除
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    /**
     * 获取统计数据
     */
    function getStats() {
        return {
            total: totalFishEaten,
            byType: { ...fishCountData },
            types: FISH_TYPES
        };
    }
    
    /**
     * 重置统计
     */
    function reset() {
        fishCountData = {};
        totalFishEaten = 0;
        
        for (let type in FISH_TYPES) {
            fishCountData[type] = 0;
        }
        
        updateUI();
        console.log('🔄 鱼类计数器已重置');
    }
    
    // 导出公共API
    window.FishCounter = {
        init: init,
        addFish: addFish,
        getStats: getStats,
        reset: reset,
        FISH_TYPES: FISH_TYPES
    };
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

console.log('✅ FishCounter 模块已加载');
