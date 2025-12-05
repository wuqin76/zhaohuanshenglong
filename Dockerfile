# Dockerfile for Dragon Fish Game
FROM nginx:alpine

# 复制游戏文件到 nginx 目录
COPY public/ /usr/share/nginx/html/

# 复制 nginx 配置
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
