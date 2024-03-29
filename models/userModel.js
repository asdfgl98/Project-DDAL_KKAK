// 2023-11-28  오전 10:20 박지훈 모듈화 진행
const db = require("../config/database");
let conn = db.init();


/* 일반 회원가입 */
const userNormalJoin = async (userData)=>{
  let data = userData
  let userId = data.userId; // 사용자가 입력한 ID, name 속성
  let useremail = data.useremail; // 사용자가 입력한 email
  let userPw = data.userPw; // 사용자가 입력한 PW
  let checkPw = data.checkPw; // 비밀번호 확인
  let userName = data.userName; // 사용자 이름
  let phone = data.phone; // 사용자 휴대전화
  let postNumber = data.postNumber; // 우편번호
  let doro = data.doro; // 도로명 주소 add1
  let detailAddress = data.detailAddress; // 상세주소 add2

  // 회원가입 쿼리문
  // SHA2(?, 256) : 비밀번호 256 비트 암호화
  let joinQuery =
    'INSERT INTO TB_MEMBER (MEMBER_ID, MEMBER_PW, MEMBER_NAME, MEMBER_EMAIL, MEMBER_PHONE, MEMBER_POST, MEMBER_ADDR1, MEMBER_ADDR2, MEMBER_LOGIN_TYPE, JOINED_AT) VALUES (?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, "M", DATE_ADD(NOW(), INTERVAL 9 HOUR))';
  try{
      // 비밀번호 확인 조건문
      if (userPw == checkPw) {
        // DB 연결
        let conn = await db.init();
        const result = await conn.query(
          joinQuery,
          [userId, userPw, userName, useremail, phone, postNumber, doro, detailAddress]);
        if(result){
            return {joinResult : true}
        }
        else{
            return {joinResult : false}
        }
      } else {
        return {joinResult : false}
      }
  }
  catch (err){
    console.error('일반 회원가입 에러',err.message)
    return {joinResult : false}
  }
  finally {
    // DB 연결 해제
    (await conn).release()
  }
}

/* 일반 회원가입 아이디 중복체크 */
const userIdCheck = async(id)=>{
  let query = "SELECT MEMBER_ID FROM TB_MEMBER WHERE MEMBER_ID = ?";
  try{
    let conn = await db.init();
    const result = await conn.query(query, [id])
    if (result[0].length == 0) {
        // 아이디 조회결과 0개 사용가능
        return {loginCheck : true}
    } else { // 이미 존재하는 아이디
        return {loginCheck : false}
    }      
  }
  catch(err){
    console.error('아이디 체크 쿼리문 에러',err)
  }
  finally {
    // DB 연결 해제
    (await conn).release()
  }
  
}

/* 일반 유저 로그인 DB 함수 */
const userLogin = async(id, hash)=>{
    // 로그인 쿼리문
  let idQuery =
  "SELECT MEMBER_ID, MEMBER_PW, MEMBER_NAME, MEMBER_LOGIN_TYPE FROM TB_MEMBER WHERE MEMBER_ID = ?";
    // DB 연결
    try {
        let conn = await db.init();
        let result = await conn.query(idQuery, [id]);
        result = result[0]      
        // 아무것도 조회 되지 않으면
        if (result.length == 0) {
        return {loginResult : 'IDError'}
        } else {
        if (result[0].MEMBER_ID == id && result[0].MEMBER_PW == hash) {
            let userName = result[0].MEMBER_NAME;
            let isLogin = true
            let userId = result[0].MEMBER_ID
            let loginType = result[0].MEMBER_LOGIN_TYPE
            return {loginResult : "success", userName : userName, isLogin : isLogin, userId : userId, loginType : loginType}  

        } else {
            return {loginResult : 'PwError'}
        }}
    } catch(err){
        console.error('일반회원 로그인 쿼리문 에러', err)
        return {loginResult : "serverError"}
      }
      finally {
        // DB 연결 해제
        (await conn).release()
      }
}

/* 소셜, 일반 유저 회원탈퇴 쿼리문 */
const deleteUser =  async(userId)=>{
    let deleteUserSQL = `DELETE FROM TB_MEMBER WHERE MEMBER_ID = ?`
    try{
      let conn = await db.init();
        let result = await conn.query(deleteUserSQL, [String(userId)])
        return {deleteResult : true}
    } catch(err) {
        console.error('회원탈퇴 쿼리문 에러', err)
    }
    finally {
      // DB 연결 해제
      (await conn).release()
    }

}

const dbServer = async()=>{
  let sql = 'SELECT 1 FROM DUAL'
  try{
    let conn = await db.init();
    let result = await conn.query(sql)
    console.log(result)
    return {dbResult : true}
  }
  catch(err){
    console.error('DB 서버 유지 더미 쿼리문 에러', err)
  }
  finally {
    // DB 연결 해제
    (await conn).release()
  }
}



module.exports = {userNormalJoin, userIdCheck, userLogin, deleteUser, dbServer}