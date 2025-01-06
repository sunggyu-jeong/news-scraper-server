@echo off

docker build -t user/news-scraper-server:latest

docker run -d -p 8080:8080 --user news-scraper-server-container news-scraper-server

pause