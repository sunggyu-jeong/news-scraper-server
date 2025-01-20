# node version 설정
FROM node:23.0.0

# 앱 디렉토리 생성
WORKDIR /usr/app

# 앱 의존성 복사
COPY package*.json ./

# 앱 의존성 설치
RUN npm install

# 앱 소스 복사
COPY . ./

# 앱 통신 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "run", "start"]
