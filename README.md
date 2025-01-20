# NewsScraper

**Express.js** 프레임워크, **PostgreSQL** 데이터베이스, 그리고 **Sequelize ORM**을 사용하여 RESTful API를 구축한 프로젝트.

## 기술 스택

- **Express.js**: Node.js 환경에서 웹 서버를 구축하는 프레임워크
- **PostgreSQL**: RDBMS 기반 데이터베이스
- **Sequelize**: Node.js에서 PostgreSQL과 같은 관계형 데이터베이스와 상호작용하기 위한 ORM

## 프로젝트 기능

뉴스 데이터를 크롤링 하는 로직이 있으며, 로그인 기능과 JWT 토큰 기능이 연동되어 안전한 서비스 접근이 가능하게 구현<br>
사용자 별 설정된 검색어가 등록되어 있으며, 검색어의 등록과 삭제가 가능하다.

### 주요 기능:
- 사용자 생성 및 관리
- JWT(AccessToken, RefreshToken) 토큰 기반 인증 시스템
- Sequelize를 사용한 데이터베이스 모델링
- Express.js를 이용한 API 라우팅
- 뉴스 크롤링

## 시작하기

### 요구 사항
- Node.js (최소 v14 이상, 개발자 환경 v23)
- PostgreSQL

### 설치
```bash
1. 프로젝트 클론
git clone https://github.com/sunggyu-jeong/news-scraper-server
cd news-scraper-server

2. 의존성 설치
npm install or npm install --force

3. 환경 변수 설정
.env 파일을 프로젝트 루트에 생성하고, 별도 데이터베이스 연결을 진행한다.:
DATABASE_URL=''

4. 데이터베이스 설정
Sequelize를 사용하여 데이터베이스를 설정해 놓은 쿼리로 생성하게 구현

5. 서버 실행
npm start
서버가 시작되면 http://localhost:3000에서 API 테스트가 가능하다.
```

### API 엔드포인트
뉴스 관련 API
- GET /api/news: 뉴스 정보 조회

사용자 관련 API
- GET /api/users/login: 로그인
- POST /api/user/refresh: 리프래시 토큰으로 엑세스 토큰 갱신

검색어 관련 API
- GET /api/keywords: 검색어 목록 조회
- GET /api/keywords/default: 디폴트로 설정된 검색어 목록 조회(회원가입 시 회원에게 기본으로 들어가는 검색어 목록)
- POST /api/keywords/default: 디폴트 검색어 설정
- POST /api/keywords: 키워드 등록
- DELETE /api/keywords: 키워드 삭제


```bash
폴더 구조

/news-scraper-server
│
├── /comm                  # 프로젝트 유틸 관련 설정
├── /controller            # API 로직 구현
├── /middleware            # Request/Response 간 설정 파일
├── /public                # 환경 설정 파일
│   └── /database          # 데이터베이스 설정파일
│       └── sequelize.js   # sequelize 설정파일(데이터베이스 연결 설정)
│       └── models.js      # 데이터베이스 모델
├── routes                 # 클라이언트 요청을 처리할 설정파일
├── app.js                 # Express 서버 설정
└── package.json           # 프로젝트 의존성 및 스크립트
```
