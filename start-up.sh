#!/bin/bash

# Docker 이미지 빌드
docker build -t news-scraper-server .

# 컨테이너 실행
docker run -it -d \
  -p 3000:3000 \
  --name news-scraper-server-container \
  --restart unless-stopped \
  --log-driver=json-file \
  nginx:1.21.1