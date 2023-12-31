import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import "../css/GoodsDetail.css";
import { useParams } from "react-router-dom";
import axios from "../axios";
import GoodsEdit from "../components/GoodsEdit";
import GoodsReview from "../components/GoodsReview";
import { v4 as uuidv4 } from "uuid";
import aws from "aws-sdk";
import { Buffer } from "buffer";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { Rating } from "@mui/material";

const GoodsDetail = () => {
  // 23-11-24 오전 12:20 박지훈 작성
  // aws 연동을 위한 config
  aws.config.update({
    region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });
  // s3 bucket 폴더명으로 사용할 사용자 아이디
  const userId = useSelector((state) => state.session.id);

  // 제품수량 선택을 위한 State
  const [count, setCount] = useState(1);
  // 가격을 나타내기 위한 State
  const [sum, setSum] = useState(0);
  /** 제품의 사이즈 정보및 라디오버튼 */
  const [radioValue, setRadioValue] = useState("L");
  /** 제품 색상정보 저장 state */
  const [color, setColor] = useState("");
  // 색상 명 저장 state
  const [colorName, setColorName] = useState("");
  // 상품별 상세페이지 로딩을 위한 useParams
  const { PROD_ID } = useParams();
  // 장바구니 추가체크를 위한 State
  const [basketCheck, setBasketCheck] = useState(false);
  // 리뷰 데이터 배열 State
  const [reviewArr, setReviewArr] = useState([])
  // 평균 별점 값을 위한 State
  const [value, setValue] = useState(0)

  // 상품 리뷰 개수, 평점 데이터 불러오기
  useEffect(() => { 
    axios.post("/page/review", {prod_id : PROD_ID})
    .then((res) => {
      let data = res.data.reviewArr
      console.log(res.data.reviewArr);
      setReviewArr(data)
      let newArr = res.data.reviewArr.map((item)=>Number(item.REVIEW_RATINGS))
      let sum = 0
      newArr.forEach((data)=>{
        sum += data
      })
      setTimeout(setValue(sum/data.length), 2000)

    })
  }, [PROD_ID])


  // 해당페이지의 상품 ID
  let prd_id = PROD_ID;
  //  굿즈색상정보 끌어오기
  const goods_color = (name, code) => {
    let new_array = [...prd_goods_img];
    const prd_size_filter = new_array.filter(
      (item) => item.COLOR_CODE === code
    );
    setGoodsImgFilter(prd_size_filter);
    setColor(code);
    setColorName(name);
  };

  // 오늘 날짜 추가를 위한 변수선언들
  let today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  let hours = today.getHours(); // 시
  let minutes = today.getMinutes(); // 분
  let seconds = today.getSeconds(); // 초
  let times = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  //23-11-22 오후 15:00 박지훈 작성
  // 굿즈 데이터
  const [prd_info_filter, setPrd_info_filter] = useState(null);
  // 굿즈 색상 데이터
  const [prd_color_filter, setPrd_color_filter] = useState(null);
  // 굿즈 사이즈 데이터
  const [prd_size_filter, setPrd_size_filter] = useState(null);
  // 불러온 굿즈 색상별 이미지 url
  const [prd_goods_img, setPrd_goods_img] = useState(null);
  // 색상별로 필터링 된 굿즈 이미지 url
  const [goodsImgFilter, setGoodsImgFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //  해당제품의 가격 데이터
  let [price, setPrice] = useState(0);
  /** 의류 앞뒤 확인 위한 state */
  const [isFront, setIsFront] = useState("front");

  // 23-11-23 오전 09:40 박지훈 수정
  // 데이터베이스에서 PROD_ID로 상품 데이터 가져오기
  useEffect(() => {
    axios.post("/page/goodProduct", { prodId: prd_id }).then((res) => {
      let data = res.data;
      // 굿즈 데이터(이름, 가격 등)
      setPrd_info_filter(data.prdInfo);
      // 굿즈 색상 데이터
      setPrd_color_filter(data.prdColor);
      // 굿즈 사이즈 데이터
      setPrd_size_filter(data.prdSize);
      // 굿즈 전체(모든색상) 이미지 URL
      setPrd_goods_img(data.prdImg);
      // 굿즈 색상별로 필터링된 URL
      setGoodsImgFilter(data.prdImg);
      // 굿즈 가격
      setPrice(data.prdInfo[0].PROD_PRICE);
      // 굿즈 수량 증가에 따른 가격 증가
      setSum(data.prdInfo[0].PROD_PRICE);
      // 굿즈 데이터 로딩 여부
      setIsLoading(true);
      // 굿즈 기본 색상 설정
      if (data.prdInfo[0].PROD_CATEGORY === "clothes") {
        setColor("#000000");
        setColorName("블랙");
      }
    });
  }, []);
  // 이미지 정보 가져오기 위한 ref
  const getImgDataRef = useRef();
  /**  이미지 정보 가져오는 함수*/
  const getImgData = () => {
    if (typeof getImgDataRef.current === "function") {
      const fnOptionsIfNeededFoundInDocs = {};
      const imageData = getImgDataRef.current(fnOptionsIfNeededFoundInDocs);
      const base64 = imageData.imageData.imageBase64;

      // base64 이미지 데이터에서 데이터URI 스키마부분 제거 (data:[<미디어타입>];base64)
      const base64Data = new Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      // 데이터 URI 스키마 부분에서 파일 형식 추출
      const type = base64.split(";")[0].split("/")[1];

      // s3 버킷에 저장될 경로, 파일명
      // 사용자이름(폴더)/랜덤값.파일형식
      const goods_info = `${userId}/edit_goods/${uuidv4()}.${type}`;

      // aws s3 이미지 업로드 함수
      const upload = new aws.S3.ManagedUpload({
        params: {
          Bucket: process.env.REACT_APP_AWS_BUCKET,
          Key: goods_info,
          Body: base64Data,
          ContentEncoding: "base64",
          ContentType: `image/${type}`,
          CacheControl: "no-store",
        },
      });

      // 이미지 업로드 실행
      const promise = upload.promise();
      promise.then(
        () => {
          moveItemToCart(goods_info);
        },
        (err) => {
          console.error("이미지 업로드 실패", err);
        }
      );
    }
  };
  /** 의류 앞뒤 토글 함수 */
  const clothesToggle = () => {
    isFront === "front" ? setIsFront("back") : setIsFront("front");
  };

  //수량 마이너스 버튼 간단함수
  const subtract = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  // 수량 플러스 버튼 간단함수
  const addtion = () => {
    setCount(count + 1);
  };

  // 제품수량에 따른 가격증감을 위한 useEffect
  useEffect(() => {
    if (count === 0) {
      setCount(1);
      setSum(price * count);
    } else {
      setSum(price * count);
    }
  }, [count]);

  /** 장바구님 담기 알림 창 함수 */
  const basketAlert = () => {
    setBasketCheck(true);
    const timeOutAlert = setTimeout(() => {
      setBasketCheck(false);
    }, 3000); // 5초후 초기화
  };

  /**장바구니에 담기위한 함수 */
  function moveItemToCart(goods_info) {
    //세션 로컬스토리지에 넣기 위해 데이터를 모으는 과정
    let newCartItem = {
      USER_ID: `${userId}`,
      PROD_ID: `${prd_info_filter[0].PROD_ID}`, // 상품 ID
      PROD_NAME: `${prd_info_filter[0].PROD_NAME}`, // 상품명
      PROD_SIZE: `${radioValue}`, // 상품 사이즈
      PROD_COLOR: {
        COLOR_NAME: `${colorName}`,
        COLOR_CODE: `${color}`,
      },
      PROD_COUNT: `${count}`, // 상품 수량
      PROD_PRICE: `${prd_info_filter[0].PROD_PRICE}`, //상품 가격
      CARTED_AT: `${times}`,
      PRICE_SUM: `${parseInt(count) * parseInt(prd_info_filter[0].PROD_PRICE)}`,
      PROD_UUID: uuidv4(),
      PROD_URL: `${process.env.REACT_APP_AWS_BUCKET_URL}/${goods_info}`,
    };

    // 로컬 스토리지에있는 정보를 일단 가져온다.
    let cartItems = sessionStorage.getItem("cartItem");

    if (cartItems) {
      // JSON 형태로 변환하고 새 상품 추가
      cartItems = JSON.parse(cartItems);

      // 중복된 물건이 있을경우 물건ID 를 기준으로 검색후 삭제 그리고 다시추가
      for (let i = 0; i < parseInt(cartItems.length); i++) {
        if (cartItems[i].PROD_UUID === newCartItem.PROD_UUID) {
          // 중복되는 물건ID를 가진 데이터 삭제
          cartItems.pop(newCartItem.PROD_UUID);
          // 중복되는 물건ID를 가진 새로운 데이터
          cartItems.push(newCartItem);
        } else if (
          cartItems[i].PROD_UUID ===
          cartItems[parseInt(cartItems.length) - 1].PROD_UUID
        ) {
          cartItems.push(newCartItem);
        }
      }
    } else {
      // 새 배열 생성
      cartItems = [newCartItem];
    }
    // 업데이트된 장바구니 데이터를 다시 JSON 형태로 변환하여 저장
    sessionStorage.setItem("cartItem", JSON.stringify(cartItems));
    basketAlert();
  }

  return (
    <div
      style={{
        minWidth: "710px",
        margin: "5% 10% ",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="GoodsDetail"
        style={{
          minWidth: "710px",
          height: "650px",
          margin: "50px 10% ",
          display: "flex",
        }}
      >
        {!isLoading ? (
          <h1>굿즈 로딩중</h1>
        ) : (
          <>
            <div
              style={{
                backgroundColor: "green",
                width: "65%",
                position: "relative",
              }}
            >
              {/* 상품 카테고리가 clothes일 때만 출력 앞 뒤 토글 버튼 */}
              {prd_info_filter[0].PROD_CATEGORY === "clothes" ? (
                <div className={`clothes-toggle clothes-${isFront}`}>
                  <button className="toggle-btn" onClick={clothesToggle}>
                    {isFront === "front" ? "앞" : "뒤"}
                  </button>
                </div>
              ) : null}
              <GoodsEdit
                imgData={
                  goodsImgFilter[
                    prd_info_filter[0].PROD_CATEGORY === "clothes"
                      ? isFront === "front"
                        ? 1
                        : 0
                      : 0
                  ].PROD_IMG
                }
                getImgDataRef={getImgDataRef}
                isFront={isFront}
                setIsFront={setIsFront}
              />
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: "0px 20px",
              }}
            >
              {/* 상품명은 DB 에서 연동하여 가져옴 - 품목번호기준 */}
              <h3 className="GoodsDetail-title" style={{ margin: "10px 5px" }}>
                {prd_info_filter[0].PROD_NAME}
              </h3>
              <br />
              <hr className="hr-style" />
              <div style={{ margin: "10px" }}>
                <div style={{ float: "left" }}>
                  {/* 리뷰 개수만 가져오기 - 품목번호기준  */}
                  <h5 style={{ fontWeight: "bold" }}>리뷰</h5>
                </div>
                <div style={{ float: "right" }}>
                  <h5>{reviewArr.length}개</h5>
                </div>
              </div>
              <br />
              <hr className="hr-style" />
              <div className = 'StarRating' style={{ margin: "10px" }}>
                <div style={{ float: "left", display:'flex',flexDirection:'space-between' }}>
                  {/* 평균평점을 가져오기 없을경우 0.0점*/}
                  <h5 style={{ fontWeight: "bold" }}>별점</h5>
                </div>
                {/* 평균평점을 표시해주는 별기능 평균 평균데이터와 연동합니다. */}
                <Rating
                  id="star"
                  classes={{ color: "yellow" }}
                  name="simple-controlled"
                  value={value} // 평점
                  precision={0.5} // 별 반개 출력
                  readOnly={true} // 읽기 전용
                  size="large"
                  className="yellow-star"
                />
              </div>
              <br />
              <hr className="hr-style" />
              <div style={{ textAlign: "center", margin: "10px" }}>
                {/* map 함수로 DB에 있는 색상에 맞게 버튼 및 색상 이름 넣기*/}
                <h5 style={{ fontWeight: "bold" }}>색상</h5>
                <div className="GoodsDetail-radio-flex">
                  {prd_color_filter.map((item) => {
                    return (
                      <div style={{ margin: "0px 10px" }}>
                        <h6
                          style={
                            item.COLOR_CODE === "#FFFFFF"
                              ? { color: "black" }
                              : { color: `${item.COLOR_CODE}` }
                          }
                        >
                          {item.COLOR_NAME}
                        </h6>
                        <button
                          value={item.COLOR_CODE}
                          style={{
                            width: "20px",
                            height: "20px",
                            boxSizing: "border-box",
                            borderRadius: "50%",
                            backgroundColor: `${item.COLOR_CODE}`,
                          }}
                          onClick={() =>
                            goods_color(item.COLOR_NAME, item.COLOR_CODE)
                          }
                        ></button>
                      </div>
                    );
                  })}
                </div>
                <hr className="hr-style" />
              </div>
              <div style={{ textAlign: "center", margin: "10px" }}>
                {/* 사이즈 라디오 버튼으로 */}
                <h5 style={{ fontWeight: "bold" }}>사이즈</h5>
                <div className="GoodsDetail-size-btn">
                  <ButtonGroup>
                    {prd_size_filter.map((item, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`item-${idx}`}
                        type="radio"
                        variant={idx % 1 ? "secondary" : "outline-secondary"}
                        name="radio"
                        value={item.SIZE_NAME}
                        checked={radioValue === item.SIZE_NAME}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                        style={{
                          backgroundColor:
                            radioValue === item.SIZE_NAME ? "#FF7E00" : "white",
                          color:
                            radioValue === item.SIZE_NAME ? "white" : "#453f3f",
                          fontWeight: "bold",
                          border: "1px solid lightgray",
                          // 다른 스타일 속성들도 필요한 경우 여기에 추가할 수 있습니다.
                        }}
                      >
                        {item.SIZE_NAME}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </div>
              </div>
              <hr className="hr-style" />
              <div style={{ textAlign: "center", margin: "10px" }}>
                {/* 제품수량 조절을 위해 버튼과 숫자 */}
                <h5 style={{ float: "left", fontWeight: "bold" }}>수량</h5>
                <div
                  className="count-felx"
                  style={{
                    float: "right",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    className="count-btn same-BTN same-BTN:hover"
                    variant="outline-secondary"
                    onClick={subtract}
                  >
                    -
                  </Button>
                  <h6>{count}</h6>
                  <Button
                    className="count-btn same-BTN same-BTN:hover"
                    variant="outline-secondary"
                    onClick={addtion}
                  >
                    +
                  </Button>
                </div>
              </div>
              <br />
              <hr className="hr-style" />
              <div style={{ textAlign: "center", margin: "10px" }}>
                <h5 style={{ float: "left", fontWeight: "bold" }}>가격</h5>
                <div style={{ float: "right" }}>
                  <h5>
                    {sum
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </h5>
                </div>
              </div>
              <br />
              <hr className="hr-style" />
              {/* 장바구니 담기 버튼 / 클릭시 세션로컬스토리지에 저장됨 */}
              <div
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  margin: "10px  0px 0px 0px",
                }}
              >
                <Button
                  variant="outline-secondary"
                  onClick={getImgData}
                  className="same-BTN same-BTN:hover"
                  style={{ width: "90%", height: "50px", fontSize: "25px" }}
                >
                  장바구니 담기
                </Button>
              </div>
              {basketCheck === true && (
                <Alert severity="success" className="basket-alert">
                  {" "}
                  장바구니 담기 성공!
                </Alert>
              )}
            </div>
          </>
        )}
      </div>
      {/* 상품 리뷰 칸 */}
      <div style={{ margin: "100px" }}>
        <hr></hr>
        <h3>딸깍의 상품 리뷰!</h3>
        <div
          className="GoodsDetail-Reviewdbody"
          style={{ minWidth: "710px", borderRadius: "5px", padding: "20px" }}
        >
          {/* 리뷰가 있을 때 리뷰 컴포넌트 렌더링 */}
          {reviewArr.length !== 0 ? reviewArr.map((data)=> <GoodsReview reviewData={data}/>) : ''}
        </div>
      </div>
    </div>
  );
};

export default GoodsDetail;