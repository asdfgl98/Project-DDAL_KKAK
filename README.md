# 광주인공지능사관학교4기 JS 특화과정 실전역량프로젝트
# TeamProject-DDAL KKAK
생성형AI 활용 사용자 맞춤 이미지 및 굿즈 제작 웹서비스

<br/>



## ✏️ 프로젝트 소개
생성형 AI 모델(Stable Diffusion)을 사용하여 사용자가 입력한 프롬프트를 바탕으로 이미지를 생성,
생성된 이미지를 filerobot-image-editor를 이용하여 사용자가 쉽게 이미지를 편집할 수 있는 서비스를 제공합니다.<br/>
생성 및 편집된 이미지를 로고나 포스터에서 활용할 수 있도록 다운로드 기능을 제공하고, 추가로 티셔츠나 머그컵과 같은
굿즈 제작에 활용할 수 있도록 서비스를 개발 하였습니다.



<br/>

## ⏱️ 프로젝트 기간(기획 ~ 발표)
* 23.10.24 ~ 23.12.5 (43일)

<br/>

## 🧑‍🤝‍🧑 팀원 및 역할
* 팀원 : **박지훈(BE)** : 메인서버(Node.js) 구축, 인공지능 모델 구동을 위한 Flask 서버 구축, 소셜 로그인(Kakao, Google, Naver) 구현,Socket.io 활용 이미지 생성 대기열 구현, AWS S3 활용 데이터 엑세스, AWS EC2 활용 서버 배포
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

#### 소셜 로그인 - <a href="" target="_blank">상세보기</a>
- Kakao, Google, Naver에서 제공하는 REST API를 활용한 소셜 로그인 구현

#### 생성형 AI 활용 이미지 생성 및 활용 - <a href="" target="_blank">상세보기</a>
- 모델 구동을 위한 Flask 서버 구축
- 메인서버(Node.js)에서 이미지 생성을 위한 프롬프트를 포함하여 Flask 서버로 REQUEST
- 전송받은 프롬프트를 입력해서 이미지 생성모델(Stable Diffusion) 실행
- 생성된 이미지를 AWS S3 버킷에 업로드 후, 이미지 URL 메인서버로 RESPONSE

#### 생성된 이미지 선택 및 편집 - <a href="" target="_blank">상세보기</a>
- RESPONSE 받은 이미지 중 원하는 이미지 선택
- 선택한 이미지를 filerobot-image-editor를 사용하여 편집 및 저장

#### 생성된 이미지와 굿즈 이미지 편집 - <a href="" target="_blank">상세보기</a>
- filerobot-image-editor를 사용해서 생성한 이미지 불러온 후 굿즈이미지에 삽입 및 편집
- 편집된 굿즈 장바구니에 담기
