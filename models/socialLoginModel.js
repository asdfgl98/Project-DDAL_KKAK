// 2023-11-28 박지훈 모듈화 진행
// DB 연결
const db = require("../config/database");
let conn = db.init();

/* 소셜 로그인 함수 */
const socialLogin = async(userData, loginType)=>{
    try{
        let conn = await db.init();
        // 로그인 타입이 Kakao 라면
        if(loginType === 'K'){
            let selectSQL = `SELECT COUNT(MEMBER_ID) AS CNT FROM TB_MEMBER WHERE MEMBER_ID = ? AND MEMBER_PW = SHA('?')`
            let joinSQL = `INSERT INTO TB_MEMBER (MEMBER_ID, MEMBER_PW, MEMBER_LOGIN_TYPE, JOINED_AT, MEMBER_NAME) VALUES ('?' ,SHA('?'),?, DATE_ADD(NOW(), INTERVAL 9 HOUR) ,?);`
            // 카카오 계정으로 회원가입 여부 쿼리문
            const selectResult = await conn.query(selectSQL, [userData.id, userData.id])
            // 회원가입이 되어있지 않다면
            if(selectResult[0][0].CNT == 0){
            const joinResult = await conn.query(joinSQL, [String(userData.id), userData.id, loginType, userData.properties.nickname])
                return {socialResult : true}
                
            }
            else{
                return {socialResult : true}
            }
        }
        // 로그인 타입이 Google 이라면
        else if(loginType === 'G'){
            let selectSQL = `SELECT COUNT(MEMBER_ID) AS CNT FROM TB_MEMBER WHERE MEMBER_ID = ? AND MEMBER_PW = SHA(?)`
            let joinSQL = `INSERT INTO TB_MEMBER (MEMBER_ID, MEMBER_PW, MEMBER_EMAIL, MEMBER_LOGIN_TYPE, JOINED_AT, MEMBER_NAME) VALUES (?, SHA(?), ?,?, DATE_ADD(NOW(), INTERVAL 9 HOUR), ?);`
            // 구글 계정으로 회원가입 여부 쿼리문
            const selectResult = await conn.query(selectSQL, [userData.id, userData.id])
            // 회원가입이 되어있지 않다면
            if(selectResult[0][0].CNT == 0){
            const joinResult = await conn.query(joinSQL, [userData.id, userData.id, userData.email, loginType, userData.name])
                return {socialResult : true}
            }
            else{
                return {socialResult : true}
            }
        }
        // 로그인 타입이 Naver 라면
        else if(loginType === 'N'){
            let selectSQL = `SELECT COUNT(MEMBER_ID) AS CNT FROM TB_MEMBER WHERE MEMBER_ID = ? AND MEMBER_PW = SHA(?)`
            let joinSQL = `INSERT INTO TB_MEMBER (MEMBER_ID, MEMBER_PW, MEMBER_EMAIL, MEMBER_PHONE, MEMBER_LOGIN_TYPE, JOINED_AT, MEMBER_NAME) VALUES (?, SHA(?),?,?,?,DATE_ADD(NOW(), INTERVAL 9 HOUR),?);`
            // 네이버 계정으로 회원가입 여부 쿼리문
            const selectResult = await conn.query(selectSQL, [userData.id, userData.id])
            // 회원가입이 되어있지 않다면
            if(selectResult[0][0].CNT == 0){
            const joinResult = await conn.query(joinSQL, [userData.id, userData.id, userData.email, userData.mobile.replace(/-/g,''), 'N', userData.name])
                return {socialResult : true}
            }
            else{
                return {socialResult : true}
            }
        }
    }
    catch(error){
        console.error(`${loginType} SELECT 에러 발생',`, error)
        return {socialResult : false}
    }
    finally {
        // DB 연결 해제
        (await conn).release()
      }
}


module.exports = {socialLogin}