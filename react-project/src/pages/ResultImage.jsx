import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/ImageResult.css";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { ProgressReducerActions } from "../redux/reducers/progressSlice";
import { useDispatch } from "react-redux";

const ResultImage = () => {
  const location = useLocation();
  const navi = useNavigate();
  const dispatch = useDispatch()
  dispatch(ProgressReducerActions.resetProgress())

  // 23-11-16 오후 14:30 박지훈 작성
  // S3 버킷 기본 주소 값
  const s3Url = process.env.REACT_APP_AWS_BUCKET_URL;
  const imgData = location.state.imgData;

  //이미지를 선택하면 그림자 값 유지
  const [selectedImage, setSelectedImage] = useState(null);

  // 선택한 이미지
  const [imgClick, setImgClick] = useState([]);
  const positive = location.state.positivePrompt;

  // 부정프롬프트
  const negative = location.state.negativePrompt;

  const countImg = location.state?.countImg || 1;
  // const countImg = 3;

  const containerClass =
    countImg === 4 ? "four-images" : countImg === 5 ? "five-images" : "";
  // 출력 이미지가 4개인 경우와 5개인 경우의 개별 레이아웃 생성

  // imageCount 만큼의 <li> 요소를 생성하는 함수
  const renderImageList = () => {
    return Array.from(imgData, (img, index) => {
      const isSelected = img === selectedImage;
      const cardClass = isSelected ? "card-active" : "card";

      return (
        <li key={index} className="imageresult">
          <div className={cardClass} id={img} onClick={choiceImg}>
            <img src={`${s3Url}/${img}`} alt={`Image ${index + 1}`} id={img} />
          </div>
        </li>
      );
    });
  };

  // 23-11-16 오후 14:30 박지훈 작성
  // 이미지 선택
  const choiceImg = (e) => {
    let check = e.target.id;
    setImgClick([check]);
    setSelectedImage(check);
  };

  // 이미지 선택 버튼
  const choiceImgBtn = () => {
    if (imgClick.length > 0) {
      axios.post("/imgCreate/choiceImg", imgClick).then((response) => {
        if (response.data.choiceImg) {
          navi(`/image-edit/?img=${imgClick[0]}`, {
            state: {
              positivePrompt: positive,
              negativePrompt : negative
            },
          });
        }
      });
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  return (
    <div className={`result-body `}>
      <div className="result-containor">
        <div>
        <h4 > 편집하고 싶은 이미지를 선택하세요!</h4>
        </div>
        <div className="input-area">
          <div className="keyword-area">
            <span className="keyword-label">keyword</span>
            <span className="keyword-content">{positive}</span>
          </div>
        </div>
        <ul className={`${containerClass}`}>{renderImageList()}</ul>
        
      </div>
      <button className="choice-img same-BTN" onClick={choiceImgBtn}>
          이미지 선택
        </button>{" "}
    </div>
  );
};

export default ResultImage;
