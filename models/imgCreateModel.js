// 2023-11-28  오전 11:50 임휘훈 모듈화 진행
// 이미지 생성 후 저장 페이지
const db = require("../config/database");
let conn = db.init();

/** 생성된 이미지 저장 함수*/
const imgSave = async (userId, positive, negative, img_info, imgName) => {

    let insertQuery =
        `INSERT INTO TB_GEN_IMG (MEMBER_ID, IMG_PROMPT, IMG_NE_PROMPT, IMG_URL, GENERATED_AT, IMG_NAME)
        VALUES (?, ?, ?, ?,  DATE_ADD(NOW(), INTERVAL 9 HOUR), ?)`;

    try{
        // DB 연결
        let conn = await db.init();
        const result = await conn.query(
          insertQuery,
          [userId, positive, negative, img_info, imgName]);
        if (result) {
            return {saveResult : true}
        }
    }
    catch(err){
        console.error("이미지 저장 쿼리 에러", err.message);
        return {saveResult : false}
    }
    finally{
        // DB 연결 해제
        (await conn).release()
    }
}



module.exports = {imgSave}