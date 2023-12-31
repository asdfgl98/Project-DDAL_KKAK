import React, { useEffect, useState } from "react";
import "../css/Mypage.css";
import "../css/UserInfo.css";
import UserInfo from "../components/UserInfo";
import { useSelector } from "react-redux";
import SaveImage from "../components/SaveImage";
import axios from "../axios";
import DeleteModal from "../components/DeleteModal";
import delete_user_icon from "../img/delete-user.png"
import image_icon from "../img/image-icon.png"
import order_icon from "../img/order-list.png"
import user_icon from "../img/user-icon.png"
import BoughtScript from "../components/BoughtScript";



const Mypage = () => {
  // 231114 14:05 임휘훈 작성 redux, props, useEffect
  const name = useSelector((state) => state.session.name) // redux에 저장된 회원 이름
  const isLogin = useSelector((state) => state.session.isLogin) // redux에 저장된 로그인 유무
  const loginType = useSelector((state) => state.session.loginType) // redux에 저장된 로그인 타입
  const id = useSelector((state) => state.session.id) // redux에 저장된 회원 아이디
  const [delete_user, setdelete_user] = useState(false); // 회원탈퇴 모달창 활성화 state

  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const [postNum, setPostNum] = useState(null) // 우편번호
  const [address, setAddress] = useState(null); // 주소
  const [addressDetail, setAddressDetail] = useState(null); // 상세주소

  const [pageState, setpageState] = useState("user_info");

  useEffect(() => {
    if(isLogin){
      axios.post("/user/mypage", {userID : id})
      .then((res) => {
        if (res.data.member_email !== '0'){
          setEmail(res.data.member_email) // DB에서 가져온 Email을 state에 저장
        }
        if (res.data.member_phone !== '0') {
          setPhone(res.data.member_phone) // DB에서 가져온 전화번호를 state에 저장
        }
        if (res.data.post_number !== "0"){
          setPostNum(res.data.post_number) // DB에서 가져온 우편번호를 state에 저장
        }
        if (res.data.addr_1 !== "0"){
          setAddress(res.data.addr_1) // DB에서 가져온 주소를 state에 저장
        }
        if(res.data.addr_2 !== "0"){
          setAddressDetail(res.data.addr_2) // DB에서 가져온 상세주소를 state에 저장
        }
      })
    }
  }, [isLogin])

  /**내 정보 컴포넌트 호출*/
  const user_infoPage = () => {
    setpageState("user_info");
  };

  /**내 저장 이미지 컴포넌트 호출*/
  const Save_Image = () => {
    setpageState("Save_Image");
  };

  //  주문 내역 컴포넌트 호출 
  const Order_List = () => {
    setpageState("BoughtScript")
  }

  /**회원 탈퇴 모달창*/
  const delete_Modal = () => {
    // setdelete_user의 상태를 변경하는 메소드를 구현
    setdelete_user(!delete_user);
  };

  return (
    <div className="MyConatainer">
      <div className="Container">
        <div className="user-side">
          {/* 삼항 연산자로 className을 변경하여 css 적용 및 컴포넌트 호출 */}
          <div className={`user-box ${pageState==='user_info'? 'box-current' : null}`} onClick={ user_infoPage }>
            <span className="Side-text">내 정보</span>
            <img src={user_icon} alt="user_icon" />
          </div>
          <div className={`user-box ${pageState==='Save_Image'? 'box-current' : null}`} onClick={ Save_Image }>
            <span>내 저장 이미지</span>
            <img src={image_icon} alt="image_icon" />
          </div>
          <div className={`user-box ${pageState==='BoughtScript'? 'box-current' : null}`} onClick={ Order_List }>
            <span>주문 내역</span>
            <img src={order_icon} alt="order_icon" />
          </div>
          <div className="user-box">
            <span  onClick={delete_Modal}>회원탈퇴</span>
            <img onClick={delete_Modal} className="delete-icon-img" src={delete_user_icon} alt="delete_user_icon" />
          </div>
        </div>
      </div>
      {pageState === "user_info" && <UserInfo userName ={name} loginType={loginType} id={id} email={email} phone={phone} postNumber={postNum} address={address} addressDetail={addressDetail} />}
      {pageState === "Save_Image" && <SaveImage />}
      {pageState === "BoughtScript" && <BoughtScript id={id}/>}
      <DeleteModal delete_user={delete_user} delete_Modal={delete_Modal}/>
    </div>
  );
};

export default Mypage;
