// 2023-11-28 박지훈 모듈화 진행
// DB 연결
const db = require("../config/database");
let conn = db.init();

/* 이미지 생성 페이지 대기열 불러오기 */
const createList = async()=>{
    let selectSql = 'SELECT WAIT_ID AS CNT FROM TB_WAIT;'
    try{
        let conn = await db.init();
        const result = await conn.query(selectSql)
        return result[0]
    }
    catch(err){
        console.error('이미지 생성 대기열 SELECT 에러',err)
    }
    finally {
        // DB 연결 해제
        (await conn).release()
      }

}


/* 이미지 생성 대기열 등록(인큐) */ 
const enQueue = async(userId)=>{
    let insertSql = `INSERT INTO TB_WAIT (MEMBER_ID, WAIT_AT) VALUES (?, DATE_ADD(NOW(), INTERVAL 9 HOUR))`
    let selectSql = `SELECT MEMBER_ID FROM TB_WAIT ORDER BY WAIT_AT`
    try{
        let conn = await db.init();
        let result = await conn.query(insertSql, [userId])
        try{
            let selectResult = await conn.query(selectSql)          
            return {selectResult : true, data : selectResult[0]}
        }
        catch(err){
            console.error('이미지 생성 대기 리스트 select 에러', err)
        }
        finally {
            // DB 연결 해제
            (await conn).release()
          }       
    }
    catch(err){
        console.error('이미지 생성 인큐 에러', err)
    }
    finally {
        // DB 연결 해제
        (await conn).release()
      }        
}

/* 이미지 생성 대기열 삭제(디큐) */
const deQueue = async(userId)=>{
    let sql = `DELETE FROM TB_WAIT WHERE MEMBER_ID = ?`
    let selectSql = `SELECT MEMBER_ID FROM TB_WAIT ORDER BY WAIT_AT`
    try{
        let conn = await db.init();
        let result = await conn.query(sql, [userId])
        let selectResult = await conn.query(selectSql)
        return {selectResult : true, data : selectResult[0]}
    }
    catch(err){
        console.error('이미지 생성 디큐 에러', err)
    }
    finally {
        // DB 연결 해제
        (await conn).release()
      }
}




module.exports = {createList,enQueue,deQueue}