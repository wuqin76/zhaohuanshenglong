/**
 * 主要脚本
 * 处理页面交互和路由
 */

// 游戏入口
function playGame(mode) {
    if (mode === 'free') {
        // 免费模式直接进入游戏
        window.location.href = './game-player.html';
    } else if (mode === 'competitive') {
        // 竞技模式需要连接钱包
        window.location.href = './game-player.html?mode=competitive';
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐉 召唤神龙 - 游戏已加载');
    console.log('版本: v1.0.0');
    console.log('特色: 特殊金鱼系统已启用');
});
