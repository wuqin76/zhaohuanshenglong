/**
 * 游戏集成脚本
 * 将鱼类计数器集成到游戏中
 */

(function() {
    'use strict';
    
    console.log('🎮 游戏集成脚本开始加载...');
    
    // 等待游戏和计数器都加载完成
    function waitForDependencies(callback) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            const hasFishCounter = !!window.FishCounter;
            const hasCC = !!window.cc;
            const hasCCDirector = !!(window.cc && window.cc.director);
            
            if (attempts % 10 === 0) {
                console.log(`⏳ 等待依赖加载... (${attempts/10}秒) FishCounter:${hasFishCounter} cc:${hasCC} director:${hasCCDirector}`);
            }
            
            // 只需要 FishCounter 和 cc.director 即可
            if (hasFishCounter && hasCC && hasCCDirector) {
                clearInterval(checkInterval);
                console.log('✅ 依赖加载完成，开始集成');
                callback();
            }
        }, 100);
        
        // 超时保护（20秒）
        setTimeout(() => {
            clearInterval(checkInterval);
            const hasAll = window.FishCounter && window.cc && window.cc.director;
            if (hasAll) {
                console.log('✅ 超时后检测到依赖已加载，开始集成');
                callback();
            } else {
                console.warn('⚠️ 依赖加载超时，某些功能可能不可用');
                console.warn('依赖状态:', {
                    FishCounter: !!window.FishCounter,
                    cc: !!window.cc,
                    'cc.director': !!(window.cc && window.cc.director)
                });
            }
        }, 20000);
    }
    
    /**
     * 集成计数器到游戏中
     */
    function integrateCounter() {
        try {
            // 保存原始的吃鱼方法
            let originalEatSmallAction = null;
            let originalOnCollisionEnter = null;
            
            // 监听游戏场景加载
            if (window.cc && window.cc.director) {
                window.cc.director.on(window.cc.Director.EVENT_AFTER_SCENE_LAUNCH, function() {
                    console.log('🎬 游戏场景已加载');
                    hookGameMethods();
                });
            }
            
            /**
             * Hook 游戏方法
             */
            function hookGameMethods() {
                setTimeout(() => {
                    try {
                        // 查找主游戏组件
                        const canvas = window.cc.find('Canvas');
                        if (!canvas) {
                            console.warn('⚠️ 未找到 Canvas 节点');
                            return;
                        }
                        
                        const mainGameComponent = canvas.getComponent('MainGameJS');
                        if (!mainGameComponent) {
                            console.warn('⚠️ 未找到 MainGameJS 组件');
                            return;
                        }
                        
                        console.log('✅ 找到主游戏组件，开始 Hook');
                        
                        // Hook EatSmallAction 方法（吃小鱼）
                        originalEatSmallAction = mainGameComponent.EatSmallAction;
                        mainGameComponent.EatSmallAction = function(fishNode, targetNode) {
                            // 调用原始方法
                            if (originalEatSmallAction) {
                                originalEatSmallAction.call(this, fishNode, targetNode);
                            }
                            
                            // 记录吃鱼统计
                            if (fishNode && fishNode.typeID) {
                                window.FishCounter.addFish(fishNode.typeID);
                            }
                        };
                        
                        console.log('✅ EatSmallAction 方法已 Hook');
                        
                        // 重置计数器（新游戏开始时）
                        const originalPlay = mainGameComponent.play;
                        if (originalPlay) {
                            mainGameComponent.play = function() {
                                window.FishCounter.reset();
                                console.log('🔄 新游戏开始，计数器已重置');
                                return originalPlay.call(this);
                            };
                        }
                        
                    } catch (err) {
                        console.error('❌ Hook 失败:', err);
                    }
                }, 1000);
            }
            
            // 添加快捷键支持（方便测试）
            document.addEventListener('keydown', function(e) {
                // 按 'C' 键显示统计
                if (e.key === 'c' || e.key === 'C') {
                    const stats = window.FishCounter.getStats();
                    console.log('📊 当前统计:', stats);
                }
                
                // 按 'R' 键重置统计
                if (e.key === 'r' || e.key === 'R') {
                    window.FishCounter.reset();
                    console.log('🔄 统计已重置');
                }
            });
            
            console.log('✅ 游戏集成完成');
            console.log('💡 提示: 按 C 键查看统计，按 R 键重置统计');
            
        } catch (error) {
            console.error('❌ 集成失败:', error);
        }
    }
    
    // 等待依赖加载后开始集成
    waitForDependencies(integrateCounter);
    
})();
