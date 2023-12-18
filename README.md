# 광주인공지능사관학교4기 JS 특화과정 실전역량프로젝트
# TeamProject-DDAL KKAK
생성형AI 활용 사용자 맞춤 이미지 및 굿즈 제작 웹서비스

<br/>



## ✏️ 프로젝트 소개
생성형 AI 모델(Stable Diffusion)을 사용하여 사용자가 입력한 프롬프트를 바탕으로 이미지를 생성,
생성된 이미지를 filerobot-image-editor를 이용하여 사용자가 쉽게 이미지를 편집할 수 있는 서비스를 제공합니다.<br/>
생성 및 편집된 이미지를 로고나 포스터에서 활용할 수 있도록 다운로드 기능을 제공하고, 추가로 티셔츠나 머그컵과 같은
굿즈 제작에 활용할 수 있도록 서비스를 개발 하였습니다.

![DDAL_KKAK](https://github.com/asdfgl98/Project-DDAL_KKAK/assets/83624652/814e4fa9-2e5d-4315-96e1-bd58f05492ce)


<br/>

## ⏱️ 프로젝트 기간(기획 ~ 발표)
* 23.10.24 ~ 23.12.5 (43일)

<br/>

## 🧑‍🤝‍🧑 팀원 및 역할
* 팀원 : **박지훈(BE)** : 메인서버(Node.js) 구축, 인공지능 모델 구동을 위한 Flask 서버 구축, 소셜 로그인(Kakao, Google, Naver) 구현, Socket.io 활용 이미지 생성 대기열 구현, AWS S3 활용 데이터 엑세스, AWS EC2 활용 서버 배포
* 팀원 : 임휘훈(BE) : 메인서버(Node.js) 구축, 인공지능 모델 구동을 위한 Flask 서버 구축, 프롬프트 연구, 일반로그인 및 회원가입 구현, Socket.io 활용 이미지 생성 대기열 구현
* 팀장 : 김지원(PM) : 프로젝트 총괄, DB 설계 및 구현, filerobot-image-editor 적용
* 팀원 : 김형균(FE) : 로그인 및 회원가입 페이지 구현, 메인페이지, 마이페이지, 이미지모음페이지, 굿즈페이지 구현
* 팀원 : 나범수(FE) : 이미지 생성, 선택, 편집 페이지 구현
* 팀원 : 조성민(FE) : 굿즈 상세, 장바구니, 주문서작성 페이지 구현

<br/>

## ⚙️ 개발 환경
- **FE** : `React.js`
- **BE** : `Node.js` `Python`
- **Server** : AWS EC2, AWS S3
- **IDE** : Visual Studio
- **Framework** : Express.js, Flask
- **Database** : MySQL
- **Model** : StableDiffusion
- **주요 Library** : filerobot-image-editor, aws-sdk/client-s3, axios, bootstrap

<br/>

## 📌 구현 기능

#### 소셜 로그인 - <a href="https://github.com/asdfgl98/Project-DDAL_KKAK/wiki/1.-%EC%86%8C%EC%85%9C%EB%A1%9C%EA%B7%B8%EC%9D%B8" target="_blank">상세보기</a>
- Kakao, Google, Naver에서 제공하는 REST API를 활용한 소셜 로그인 구현

#### 생성형 AI 활용 이미지 생성 및 활용 - <a href="https://github.com/asdfgl98/Project-DDAL_KKAK/wiki/2.-%EC%83%9D%EC%84%B1%ED%98%95-AI-%ED%99%9C%EC%9A%A9-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%83%9D%EC%84%B1-%EB%B0%8F-%ED%99%9C%EC%9A%A9" target="_blank">상세보기</a>
- 모델 구동을 위한 Flask 서버 구축
- 메인서버(Node.js)에서 이미지 생성을 위한 프롬프트를 포함하여 Flask 서버로 REQUEST
- 전송받은 프롬프트를 입력해서 이미지 생성모델(Stable Diffusion) 실행
- 생성된 이미지를 AWS S3 버킷에 업로드 후, 이미지 URL 메인서버로 RESPONSE

#### 생성된 이미지 선택 및 편집 - <a href="https://github.com/asdfgl98/Project-DDAL_KKAK/wiki/3.-%EC%83%9D%EC%84%B1%EB%90%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%84%A0%ED%83%9D-%EB%B0%8F-%ED%8E%B8%EC%A7%91" target="_blank">상세보기</a>
- RESPONSE 받은 이미지 중 원하는 이미지 선택
- 선택한 이미지를 filerobot-image-editor를 사용하여 편집 및 저장

#### 생성한 이미지와 굿즈 이미지 편집 - <a href="https://github.com/asdfgl98/Project-DDAL_KKAK/wiki/4.-%EC%83%9D%EC%84%B1%ED%95%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%99%80-%EA%B5%BF%EC%A6%88-%EC%9D%B4%EB%AF%B8%EC%A7%80-%ED%8E%B8%EC%A7%91" target="_blank">상세보기</a>
- filerobot-image-editor를 사용해서 생성한 이미지 불러온 후 굿즈이미지에 삽입 및 편집
- 편집된 굿즈 장바구니에 담기


## 🚫트러블슈팅
#### <a href="https://github.com/asdfgl98/Project-DDAL_KKAK/wiki/5.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85" target="_blank">상세보기</a>
### #1 
- 문제#1 : 다수의 사용자가 이밎 생성 시도 시 서버 과부화 발생
- 원인#1 : 동시에 이미지를 생성하게 되면 서버의 GPU RAM 자원 부족으로 인해 OutOfMemoryError 발생
- 해결#1 : socket.io 라이브러리 활용 이미지 생성 대기열을 구축하여 순서대로 이미지를 생성하게 수정

### #2
- 문제#2 : filerobot-image_editor API를 사용해 AWS S3에 있는 이미지 접근 시 CORS 에러 발생
- 원인#2 : 브라우저 로컬 캐시가 활성화되어 이미지 요청 시, CORS 헤더가 없는 브라우저 캐시를 재사용
- 해결#2 : AWS S3에 이미지 업로드 시 로컬 캐시를 사용하지 않도록 HTTP 헤더 설정을 해줌 ("Cache-Control : no-store")
