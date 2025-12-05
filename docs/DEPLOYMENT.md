# 游戏部署指南

## 📦 部署方式

### 1. 静态文件托管（最简单）

#### Vercel

```bash
npm install -g vercel
cd dragon-fish-game
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
cd dragon-fish-game
netlify deploy --prod --dir=public
```

#### GitHub Pages

1. 在 GitHub 创建仓库
2. 推送代码
3. Settings → Pages → Source: public 文件夹
4. 访问 `https://yourusername.github.io/dragon-fish-game/`

### 2. VPS 部署

#### 准备工作

```bash
# 连接服务器
ssh user@your-server-ip

# 安装 Nginx
sudo apt update
sudo apt install nginx
```

#### 上传文件

```bash
# 本地执行
scp -r dragon-fish-game/public user@your-server-ip:/var/www/
```

#### 配置 Nginx

```bash
# 服务器执行
sudo nano /etc/nginx/sites-available/dragon-fish-game

# 粘贴以下内容：
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 启用站点
sudo ln -s /etc/nginx/sites-available/dragon-fish-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Docker 部署

```bash
# 构建镜像
docker build -t dragon-fish-game .

# 运行容器
docker run -d -p 80:80 --name dragon-fish-game dragon-fish-game

# 查看状态
docker ps
```

### 4. 域名配置

#### DNS 设置

```
类型    名称    值
A       @       your-server-ip
CNAME   www     your-domain.com
```

#### SSL 证书（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 环境要求

### 最低配置

- **CPU**: 1 核
- **内存**: 512 MB
- **存储**: 1 GB
- **带宽**: 1 Mbps

### 推荐配置

- **CPU**: 2 核
- **内存**: 2 GB
- **存储**: 10 GB
- **带宽**: 10 Mbps

## ✅ 部署检查清单

- [ ] 确认所有文件已上传
- [ ] 检查文件权限（755 for directories, 644 for files）
- [ ] 测试游戏加载
- [ ] 验证资源文件访问
- [ ] 配置 HTTPS
- [ ] 设置域名解析
- [ ] 添加网站图标（favicon.ico）
- [ ] 配置 CDN（可选）
- [ ] 设置监控告警

## 🌐 访问测试

部署完成后访问：

- http://your-domain.com - 欢迎页
- http://your-domain.com/game-player.html - 直接进入游戏

## 🐛 常见问题

### 1. 404 错误

- 检查 nginx 配置中的 root 路径
- 确认文件权限

### 2. 资源加载失败

- 检查浏览器控制台
- 验证相对路径是否正确

### 3. 游戏不显示

- 清除浏览器缓存
- 检查是否支持 Canvas

## 📊 性能优化

1. **启用 gzip 压缩**（已在 nginx.conf 配置）
2. **使用 CDN** 加速静态资源
3. **图片优化** 压缩游戏图片
4. **缓存策略** 设置合理的缓存时间
5. **HTTP/2** 启用 HTTP/2 协议

## 🔐 安全建议

1. 定期更新服务器
2. 配置防火墙
3. 启用 HTTPS
4. 设置 CSP 头
5. 防止 DDoS 攻击
