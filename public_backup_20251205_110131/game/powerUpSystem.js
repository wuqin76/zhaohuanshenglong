/**
 * 道具系统模块
 * 支持加速、无敌等道具功能
 */

(function() {
    'use strict';
    
    console.log('🎁 道具系统开始加载...');
    
    // 道具类型定义
    const POWER_UP_TYPES = {
        SPEED: {
            id: 'speed',
            name: '加速',
            icon: '⚡',
            color: '#FFD700',
            duration: 5000, // 5秒
            description: '速度提升2倍'
        },
        INVINCIBLE: {
            id: 'invincible',
            name: '无敌',
            icon: '🛡️',
            color: '#00FFFF',
            duration: 5000, // 5秒
            description: '大鱼无法吃掉你'
        }
    };
    
    // 道具状态管理
    class PowerUpManager {
        constructor() {
            this.activePowerUps = new Map();
            this.uiElements = new Map();
            this.gameComponent = null;
            this.originalSpeeds = null;
            this.initialized = false;
        }
        
        /**
         * 初始化道具系统
         */
        init() {
            if (this.initialized) return;
            
            this.createUI();
            this.createControlPanel();
            this.setupKeyboardShortcuts();
            this.initialized = true;
            
            console.log('✅ 道具系统已初始化');
        }
        
        /**
         * 创建道具UI显示
         */
        createUI() {
            // 移除旧的UI
            const oldUI = document.getElementById('powerup-ui');
            if (oldUI) oldUI.remove();
            
            // 创建道具状态显示容器
            const container = document.createElement('div');
            container.id = 'powerup-ui';
            container.style.cssText = `
                position: fixed;
                top: 150px;
                right: 10px;
                z-index: 9998;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            
            document.body.appendChild(container);
            console.log('✅ 道具UI已创建');
        }
        
        /**
         * 创建道具控制面板
         */
        createControlPanel() {
            // 移除旧的面板
            const oldPanel = document.getElementById('powerup-panel');
            if (oldPanel) oldPanel.remove();
            
            const panel = document.createElement('div');
            panel.id = 'powerup-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                gap: 15px;
                z-index: 9997;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            `;
            
            // 加速按钮
            const speedBtn = this.createPowerUpButton(POWER_UP_TYPES.SPEED);
            panel.appendChild(speedBtn);
            
            // 无敌按钮
            const invincibleBtn = this.createPowerUpButton(POWER_UP_TYPES.INVINCIBLE);
            panel.appendChild(invincibleBtn);
            
            document.body.appendChild(panel);
            console.log('✅ 道具控制面板已创建');
        }
        
        /**
         * 创建道具按钮
         */
        createPowerUpButton(powerUpType) {
            const button = document.createElement('button');
            button.id = `btn-${powerUpType.id}`;
            button.style.cssText = `
                padding: 12px 20px;
                background: ${powerUpType.color};
                color: black;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            
            button.innerHTML = `
                <span style="font-size: 24px;">${powerUpType.icon}</span>
                <span>${powerUpType.name}</span>
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1)';
                button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            });
            
            button.addEventListener('click', () => {
                this.activatePowerUp(powerUpType.id);
            });
            
            return button;
        }
        
        /**
         * 激活道具
         */
        activatePowerUp(powerUpId) {
            const powerUp = Object.values(POWER_UP_TYPES).find(p => p.id === powerUpId);
            if (!powerUp) return;
            
            // 检查是否已激活
            if (this.activePowerUps.has(powerUpId)) {
                console.log(`⚠️ ${powerUp.name}道具已激活`);
                this.showNotification(`${powerUp.name}道具已激活中`, powerUp.color);
                return;
            }
            
            console.log(`🎁 激活道具: ${powerUp.name}`);
            
            // 应用道具效果
            this.applyPowerUpEffect(powerUpId);
            
            // 显示通知
            this.showNotification(`${powerUp.icon} ${powerUp.name}已激活！`, powerUp.color);
            
            // 显示状态UI
            this.showPowerUpUI(powerUp);
            
            // 设置过期时间
            const endTime = Date.now() + powerUp.duration;
            this.activePowerUps.set(powerUpId, {
                type: powerUp,
                endTime: endTime,
                timer: null
            });
            
            // 启动倒计时
            this.startCountdown(powerUpId);
        }
        
        /**
         * 应用道具效果
         */
        applyPowerUpEffect(powerUpId) {
            try {
                const canvas = window.cc && window.cc.find('Canvas');
                if (!canvas) {
                    console.warn('⚠️ 未找到Canvas节点');
                    return;
                }
                
                const game = canvas.getComponent('MainGameJS');
                if (!game) {
                    console.warn('⚠️ 未找到MainGameJS组件');
                    return;
                }
                
                this.gameComponent = game;
                
                if (powerUpId === 'speed') {
                    // 加速效果
                    if (!this.originalSpeeds) {
                        this.originalSpeeds = {
                            speedNum: game.speedNum
                        };
                    }
                    
                    const multiplier = 2; // 2倍速度
                    game.speedNum = (this.originalSpeeds.speedNum || 400) * multiplier;
                    console.log(`⚡ 速度提升: ${this.originalSpeeds.speedNum} → ${game.speedNum}`);
                    
                    // 显示速度线特效
                    this.showSpeedLines();
                    
                } else if (powerUpId === 'invincible') {
                    // 无敌效果
                    game.isInvincible = true;
                    console.log(`🛡️ 无敌模式已开启`);
                    
                    // 修改碰撞检测逻辑
                    this.hookCollisionForInvincible(game);
                    
                    // 显示护盾特效
                    this.showShield();
                }
                
            } catch (error) {
                console.error('❌ 应用道具效果失败:', error);
            }
        }
        
        /**
         * Hook碰撞检测实现无敌效果
         */
        hookCollisionForInvincible(game) {
            // 保存原始的JudgeSmallFish方法
            if (!game._originalJudgeSmallFish) {
                game._originalJudgeSmallFish = game.JudgeSmallFish;
            }
            
            // 替换为新方法
            game.JudgeSmallFish = function() {
                if (this.isInvincible) {
                    console.log('🛡️ 无敌模式保护中，忽略被吃');
                    return; // 无敌时不执行死亡逻辑
                }
                // 调用原始方法
                if (this._originalJudgeSmallFish) {
                    this._originalJudgeSmallFish.call(this);
                }
            };
        }
        
        /**
         * 移除道具效果
         */
        removePowerUpEffect(powerUpId) {
            try {
                if (!this.gameComponent) return;
                
                if (powerUpId === 'speed') {
                    // 恢复原速度
                    if (this.originalSpeeds && this.originalSpeeds.speedNum !== undefined) {
                        this.gameComponent.speedNum = this.originalSpeeds.speedNum;
                        console.log(`⚡ 速度恢复: ${this.gameComponent.speedNum}`);
                    }
                    
                    // 移除速度线特效
                    this.hideSpeedLines();
                    
                } else if (powerUpId === 'invincible') {
                    // 关闭无敌
                    this.gameComponent.isInvincible = false;
                    console.log(`🛡️ 无敌模式已关闭`);
                    
                    // 恢复原始方法
                    if (this.gameComponent._originalJudgeSmallFish) {
                        this.gameComponent.JudgeSmallFish = this.gameComponent._originalJudgeSmallFish;
                    }
                    
                    // 移除护盾特效
                    this.hideShield();
                }
                
            } catch (error) {
                console.error('❌ 移除道具效果失败:', error);
            }
        }
        
        /**
         * 显示道具状态UI
         */
        showPowerUpUI(powerUp) {
            const container = document.getElementById('powerup-ui');
            if (!container) return;
            
            const uiElement = document.createElement('div');
            uiElement.id = `powerup-${powerUp.id}`;
            uiElement.style.cssText = `
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid ${powerUp.color};
                border-radius: 8px;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
            `;
            
            uiElement.innerHTML = `
                <span style="font-size: 24px;">${powerUp.icon}</span>
                <div style="display: flex; flex-direction: column;">
                    <span style="color: ${powerUp.color}; font-weight: bold; font-size: 14px;">
                        ${powerUp.name}
                    </span>
                    <span id="timer-${powerUp.id}" style="color: white; font-size: 12px;">
                        5.0s
                    </span>
                </div>
            `;
            
            // 添加动画
            if (!document.getElementById('powerup-animation-style')) {
                const style = document.createElement('style');
                style.id = 'powerup-animation-style';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(300px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(300px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            container.appendChild(uiElement);
            this.uiElements.set(powerUp.id, uiElement);
        }
        
        /**
         * 启动倒计时
         */
        startCountdown(powerUpId) {
            const powerUpData = this.activePowerUps.get(powerUpId);
            if (!powerUpData) return;
            
            const updateTimer = () => {
                const remaining = Math.max(0, powerUpData.endTime - Date.now());
                const seconds = (remaining / 1000).toFixed(1);
                
                // 更新UI显示
                const timerElement = document.getElementById(`timer-${powerUpId}`);
                if (timerElement) {
                    timerElement.textContent = `${seconds}s`;
                }
                
                if (remaining <= 0) {
                    this.deactivatePowerUp(powerUpId);
                } else {
                    powerUpData.timer = setTimeout(updateTimer, 100);
                }
            };
            
            updateTimer();
        }
        
        /**
         * 停用道具
         */
        deactivatePowerUp(powerUpId) {
            const powerUpData = this.activePowerUps.get(powerUpId);
            if (!powerUpData) return;
            
            console.log(`⏰ 道具失效: ${powerUpData.type.name}`);
            
            // 清除计时器
            if (powerUpData.timer) {
                clearTimeout(powerUpData.timer);
            }
            
            // 移除效果
            this.removePowerUpEffect(powerUpId);
            
            // 移除UI
            const uiElement = this.uiElements.get(powerUpId);
            if (uiElement) {
                uiElement.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    uiElement.remove();
                    this.uiElements.delete(powerUpId);
                }, 300);
            }
            
            // 从激活列表移除
            this.activePowerUps.delete(powerUpId);
            
            // 显示通知
            this.showNotification(`${powerUpData.type.icon} ${powerUpData.type.name}已失效`, '#888');
        }
        
        /**
         * 显示通知
         */
        showNotification(message, color) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 220px;
                right: 10px;
                background: ${color};
                color: ${this.getContrastColor(color)};
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 10000;
                animation: fadeInOut 2s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            `;
            notification.textContent = message;
            
            // 添加动画
            if (!document.getElementById('notification-animation-style')) {
                const style = document.createElement('style');
                style.id = 'notification-animation-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { transform: translateX(300px); opacity: 0; }
                        20% { transform: translateX(0); opacity: 1; }
                        80% { transform: translateX(0); opacity: 1; }
                        100% { transform: translateX(300px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }
        
        /**
         * 获取对比色
         */
        getContrastColor(hexColor) {
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? 'black' : 'white';
        }
        
        /**
         * 设置键盘快捷键
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // 按 '1' 键激活加速
                if (e.key === '1') {
                    this.activatePowerUp('speed');
                }
                // 按 '2' 键激活无敌
                if (e.key === '2') {
                    this.activatePowerUp('invincible');
                }
            });
            
            console.log('⌨️ 快捷键已设置: 1-加速, 2-无敌');
        }
        
        /**
         * 显示速度线特效
         */
        showSpeedLines() {
            // 移除旧的速度线
            this.hideSpeedLines();
            
            const speedLinesContainer = document.createElement('div');
            speedLinesContainer.id = 'speed-lines-effect';
            speedLinesContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9990;
                overflow: hidden;
            `;
            
            // 创建多条速度线
            for (let i = 0; i < 20; i++) {
                const line = document.createElement('div');
                const yPos = Math.random() * 100;
                const duration = 0.3 + Math.random() * 0.3;
                const delay = Math.random() * 0.2;
                
                line.style.cssText = `
                    position: absolute;
                    top: ${yPos}%;
                    left: 100%;
                    width: ${50 + Math.random() * 100}px;
                    height: 2px;
                    background: linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent);
                    animation: speedLineMove ${duration}s linear ${delay}s infinite;
                `;
                
                speedLinesContainer.appendChild(line);
            }
            
            // 添加动画样式
            if (!document.getElementById('speed-lines-style')) {
                const style = document.createElement('style');
                style.id = 'speed-lines-style';
                style.textContent = `
                    @keyframes speedLineMove {
                        from {
                            transform: translateX(0);
                            opacity: 0;
                        }
                        10% {
                            opacity: 1;
                        }
                        90% {
                            opacity: 1;
                        }
                        to {
                            transform: translateX(-120vw);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(speedLinesContainer);
            console.log('⚡ 速度线特效已显示');
        }
        
        /**
         * 隐藏速度线特效
         */
        hideSpeedLines() {
            const speedLines = document.getElementById('speed-lines-effect');
            if (speedLines) {
                speedLines.remove();
                console.log('⚡ 速度线特效已隐藏');
            }
        }
        
        /**
         * 显示护盾特效
         */
        showShield() {
            // 移除旧的护盾
            this.hideShield();
            
            const shield = document.createElement('div');
            shield.id = 'shield-effect';
            shield.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
                border: 4px solid rgba(0, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9991;
                box-shadow: 
                    0 0 20px rgba(0, 255, 255, 0.6),
                    inset 0 0 20px rgba(0, 255, 255, 0.3);
                animation: shieldPulse 1s ease-in-out infinite;
            `;
            
            // 添加内层护盾
            const innerShield = document.createElement('div');
            innerShield.style.cssText = `
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                border: 2px solid rgba(0, 255, 255, 0.5);
                border-radius: 50%;
                animation: shieldRotate 3s linear infinite;
            `;
            shield.appendChild(innerShield);
            
            // 添加闪光效果
            for (let i = 0; i < 6; i++) {
                const spark = document.createElement('div');
                const angle = (i * 60);
                spark.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 4px;
                    height: 4px;
                    background: rgba(0, 255, 255, 1);
                    border-radius: 50%;
                    transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-100px);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
                    animation: sparkle 1.5s ease-in-out infinite ${i * 0.25}s;
                `;
                shield.appendChild(spark);
            }
            
            // 添加动画样式
            if (!document.getElementById('shield-style')) {
                const style = document.createElement('style');
                style.id = 'shield-style';
                style.textContent = `
                    @keyframes shieldPulse {
                        0%, 100% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 0.8;
                        }
                        50% {
                            transform: translate(-50%, -50%) scale(1.1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes shieldRotate {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                    
                    @keyframes sparkle {
                        0%, 100% {
                            opacity: 0.3;
                            transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(-100px) scale(1);
                        }
                        50% {
                            opacity: 1;
                            transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(-100px) scale(1.5);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(shield);
            console.log('🛡️ 护盾特效已显示');
        }
        
        /**
         * 隐藏护盾特效
         */
        hideShield() {
            const shield = document.getElementById('shield-effect');
            if (shield) {
                shield.remove();
                console.log('🛡️ 护盾特效已隐藏');
            }
        }
        
        /**
         * 重置所有道具
         */
        resetAll() {
            // 停用所有激活的道具
            for (const powerUpId of this.activePowerUps.keys()) {
                this.deactivatePowerUp(powerUpId);
            }
            
            this.activePowerUps.clear();
            this.originalSpeeds = null;
            
            // 清除所有特效
            this.hideSpeedLines();
            this.hideShield();
            
            console.log('🔄 道具系统已重置');
        }
    }
    
    // 创建全局实例
    window.PowerUpManager = new PowerUpManager();
    
    // 等待游戏加载
    function waitForGame() {
        const checkInterval = setInterval(() => {
            if (window.cc && window.cc.director) {
                clearInterval(checkInterval);
                
                // 监听场景加载
                window.cc.director.on(window.cc.Director.EVENT_AFTER_SCENE_LAUNCH, function() {
                    setTimeout(() => {
                        window.PowerUpManager.init();
                    }, 1000);
                });
                
                // 如果场景已加载，直接初始化
                if (window.cc.find('Canvas')) {
                    window.PowerUpManager.init();
                }
            }
        }, 100);
        
        // 超时保护
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForGame);
    } else {
        waitForGame();
    }
    
    console.log('✅ 道具系统模块已加载');
    
})();
