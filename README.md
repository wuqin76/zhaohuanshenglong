# 🐉 召唤神龙 - 吃鱼大作战

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Game Engine](https://img.shields.io/badge/engine-Cocos%20Creator%202.4.5-orange.svg)](https://www.cocos.com/)

一款基于 Cocos Creator 开发的 Web3 链游，支持免费体验和竞技模式。

## ✨ 游戏特色

### 🎮 特殊金鱼系统

- 不同等级的鱼都有概率出现金色特殊鱼
- 特殊鱼拥有精美的视觉标记（圆形光晕+旋转星星）
- 根据鱼类大小提供不同的积分奖励（100-5000 分）
- 小鱼：30px 淡黄色标记 + 1 星 ⭐
- 中等鱼：45px 金黄色标记 + 2 星 ⭐⭐
- 大鱼：60px 橙金色标记 + 3 星 ⭐⭐⭐
- 巨型鱼：80px 红金色标记 + 4 星 ⭐⭐⭐⭐

### 🎁 道具系统

- **加速道具**：速度提升 2 倍，持续 10 秒
- **无敌道具**：免疫碰撞伤害，持续 10 秒
- 快捷键操作（1-加速，2-无敌）
- 精美的视觉特效

### 🎰 抽奖系统

- 积累 10000 分解锁抽奖转盘
- 在游戏大厅进行抽奖
- 丰厚的奖励等你来拿

### 💰 双模式玩法

1. **免费体验模式**

   - 完全免费，无需支付
   - 体验所有游戏玩法
   - 适合新手练习

2. **竞技模式**
   - 门票：1 USDT/次
   - 高分获得 USDT 奖励
   - 区块链保证公平透明

## 📁 项目结构

```
dragon-fish-game/
├── public/                    # 静态资源目录
│   ├── index.html            # 欢迎页面（模式选择）
│   ├── game-player.html      # 游戏播放器
│   ├── game/                 # Cocos Creator 游戏核心
│   │   ├── assets/          # 游戏资源（图片、音频、配置）
│   │   ├── *.js             # 游戏脚本
│   │   └── src/             # 游戏设置
│   ├── scripts/             # 前端脚本
│   │   └── main.js          # 主要交互逻辑
│   └── styles/              # 样式文件
│       └── welcome.css      # 欢迎页样式
├── src/                      # 源代码（未来扩展）
├── docs/                     # 文档
├── config/                   # 配置文件
└── README.md                # 本文件
```

## 🚀 快速开始

### 方式一：本地开发

1. 克隆项目

```bash
git clone <repository-url>
cd dragon-fish-game
```

2. 启动本地服务器

```bash
cd public
python3 -m http.server 8080
```

3. 打开浏览器访问

```
http://localhost:8080
```

### 方式二：Nginx 部署（推荐）

1. 安装 Nginx

```bash
sudo apt install nginx  # Ubuntu/Debian
# 或
sudo yum install nginx  # CentOS/RHEL
```

2. 配置 Nginx

```bash
sudo cp config/nginx.conf /etc/nginx/sites-available/dragon-fish-game
sudo ln -s /etc/nginx/sites-available/dragon-fish-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. 访问游戏

```
http://your-domain.com
```

### 方式三：Docker 部署

```bash
docker build -t dragon-fish-game .
docker run -p 80:80 dragon-fish-game
```

## 🎮 游戏玩法

### 基础操作

- **移动**：鼠标/触摸屏控制鱼的方向
- **吃鱼**：碰到比自己小的鱼即可吃掉
- **成长**：吃鱼后会逐渐变大
- **道具**：按键盘 1（加速）或 2（无敌）

### 特殊鱼识别

- 带有彩色圆形光晕的就是特殊鱼
- 上方有旋转的星星标记
- 吃掉后会显示精美的积分动画

### 积分系统

- 普通鱼：无积分
- 特殊鱼：100-5000 分（根据大小）
- 10000 分解锁抽奖转盘

## 🛠️ 技术栈

- **游戏引擎**：Cocos Creator 2.4.5
- **前端**：原生 HTML/CSS/JavaScript
- **后端**（未来）：Node.js + Express
- **区块链**（未来）：Web3.js + Smart Contracts
- **部署**：Nginx / Docker

## 📝 开发计划

- [x] 基础游戏玩法
- [x] 特殊金鱼系统
- [x] 道具系统
- [x] 项目结构优化
- [ ] 抽奖转盘实现
- [ ] 区块链集成
- [ ] 用户系统
- [ ] 排行榜
- [ ] 多人对战

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- Issue: [GitHub Issues](issues)
- Email: your-email@example.com

---

**享受游戏，祝你好运！🐉**
