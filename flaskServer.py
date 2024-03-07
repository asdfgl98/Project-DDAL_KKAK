from flask import Flask, request, jsonify, send_file
import requests
from flask_cors import CORS
import os
import time
from threading import Thread
import threading
import json
from PIL import Image
import urllib.request
import time

# env 파일 사용
from dotenv import load_dotenv
load_dotenv('./python/.env')
# 이미지 파일명 생성을 위한 랜덤 값 생성
import uuid
# stable diffusion
import torch
# from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler, DiffusionPipeline
# S3 버킷에 업로드
import boto3

# env 파일에서 환경변수 가져오기
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.environ.get('AWS_DEFAULT_REGION')

# aws 연동을 위한 client 생성
client = boto3.client('s3',
                      aws_access_key_id=AWS_ACCESS_KEY_ID,
                      aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                      region_name=AWS_DEFAULT_REGION
                      )

# 번역 라이브러리
from googletrans import Translator

# 번역기 생성
translator = Translator()

# Flask 서버 생성
app = Flask(__name__)
UPLOAD_FOLDER = 'img'

# CORS 설정
CORS(app, resources={r'*': {'origins': 'http://localhost:3001'}},
    supports_credentials=True)


# 카카오 REST API 키
REST_API_KEY = os.environ.get('REST_API_KEY')

# Karlo API 호출 이미지 생성 함수
# 이미지 생성하기 요청
def makeImg(prompt, negative_prompt):
    r = requests.post(
        'https://api.kakaobrain.com/v2/inference/karlo/t2i',
        json = {
            'prompt': prompt,
            'negative_prompt': negative_prompt,
            'image_quality' : 100,
            'samples' : 3,
            'nsfw_checker' : True
        },
        headers = {
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    # 응답 JSON 형식으로 변환
    response = json.loads(r.content)
    return response

@app.route('/', methods=['GET'])
def home():
    return 'hello'

# Kalro 라우터 ----------------------------------------------------------------------------------
@app.route('/kalro', methods=['POST', 'GET'])
def test():
    # 전달받은 프롬프트
    req_data = request.json.get('data')

    # 유저 아이디(S3 폴더명에 사용)
    user_id = request.json.get('userId')
    # 생성할 이미지 개수
    img_count = req_data['countImg']
    # 긍정 프롬프트
    prompt = req_data['positivePrompt']
    # 부정 프롬프트
    negative_prompt = req_data['negativePrompt']


    prompt = translator.translate(prompt, dest='en', src='ko').text # 한글로 번역
    prompt = "((best quality)), ((masterpiece)), ((detailed)), Intricate, ((Captivating)), ((Magnificent)),  white background, Sunlight, Soft natural light, " + prompt
    negative_prompt =  translator.translate(negative_prompt, dest='en', src='ko').text
    negative_prompt = '(worst quality, low quality:1.4), ugly, tiling, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, overexposed, bad art, beginner, amateur, '+ negative_prompt
    print('입력된 프롬프트 :', prompt)
    print('입력된 부정 프롬프트 :',negative_prompt)
    print('생성할 이미지 수 :', img_count)

    # 이미지 생성 함수
    response = makeImg(prompt, negative_prompt)

    # 응답의 첫 번째 이미지 생성 결과 출력하기
    img_data = []
    for i in range(int(img_count)):
        image = Image.open(urllib.request.urlopen(response.get("images")[i].get("image")))
        # img_data.append(response.get("images")[i].get("image"))

        random_name = uuid.uuid1()

        image.save(f'{random_name}.png')      # 생성된 이미지 저장

        file_name = f'{random_name}.png'              # 업로드할 파일
        bucket = 'final-project-s3bucket'             # 버켓 주소
        key = f'{user_id}/new_img/{file_name}'        # s3 업로드 경로 (사용자이름(폴더)/new_img(폴더)/파일이름)

        try:                                                    # ContentType = 이미지 저장 형태(defalut로 설정하면 url로 접근시 다운로드 됨)
                                                                # Cache-Control = 이미지가 브라우저에 캐시로 저장되어 cors 에러가 발생하기 때문에 Cache에 저장되지 않도록 설정
            client.upload_file(file_name, bucket, key, ExtraArgs={'ContentType': 'image/png', 'CacheControl' : 'no-store'})
            print(f"{file_name}가 {bucket} 버킷에 업로드되었습니다.")
            img_data.append(key)
            os.remove(file_name)
        except:
            print('생성된 이미지 S3 업로드 중 에러 발생')

    

    return jsonify({'img_data' : img_data})

# Stable diffusion 라우터-------------------------------------------------------------------------
@app.route('/stable', methods=['POST','GET'])
def stable():

    # 모델 URL 가져오기
    url = "https://github.com/facebookresearch/stable-diffusion/releases/download/v1.5.0/diffusion-1024.pth"

    # 모델을 다운로드
    response = requests.get(url)

    # 모델을 저장
    with open("diffusion-1024.pth", "wb") as f:
        f.write(response.content)

    # 다운로드한 파일의 경로를 가져오기
    path = os.path.abspath("diffusion-1024.pth")

    # 전달받은 프롬프트
    req_data = request.json.get('data')

    # 유저 아이디(S3 폴더명에 사용)
    user_id = request.json.get('userId')
    # 생성할 이미지 개수
    img_count = req_data['countImg']
    # 긍정 프롬프트
    prompt = req_data['positivePrompt']
    # 부정 프롬프트
    negative_prompt = req_data['negativePrompt']


    prompt = translator.translate(prompt, dest='en', src='ko').text # 한글로 번역
    prompt = "((best quality)), ((masterpiece)), ((detailed)), Intricate, ((Captivating)), ((Magnificent)),  white background, Sunlight, Soft natural light, " + prompt
    negative_prompt =  translator.translate(negative_prompt, dest='en', src='ko').text
    negative_prompt = '(worst quality, low quality:1.4), ugly, tiling, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, overexposed, bad art, beginner, amateur, '+ negative_prompt
    print('입력된 프롬프트 :', prompt)
    print('입력된 부정 프롬프트 :',negative_prompt)
    print('생성할 이미지 수 :', img_count)

    # 일반 GPU 사용할 때
    # Stable diffusion 모델 선택
    # model_id = "stabilityai/stable-diffusion-2-1"
    model_id = "runwayml/stable-diffusion-v1-5"

    # Stable diffusion 모델 생성
    # Use the DPMSolverMultistepScheduler (DPM-Solver++) scheduler here instead
    pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
    pipe = pipe.to("cuda")

    # A100 GPU만 사용 가능
    # lora 적용된 모델(SDXL)
    # pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0")
    # pipe.load_lora_weights("artificialguybr/LogoRedmond-LogoLoraForSDXL-V2")
    # pipe = pipe.to("cuda")

    image_data = []
    for i in range(img_count):
      # 랜덤한 파일 이름 생성
      random_name = uuid.uuid1()
      image = pipe(prompt=prompt, negative_prompt=negative_prompt).images[0]
      image.save(f'{random_name}.png')      # 생성된 이미지 저장

      file_name = f'{random_name}.png'              # 업로드할 파일
      bucket = 'final-project-s3bucket'             # 버켓 주소
      key = f'{user_id}/new_img/{file_name}'        # s3 업로드 경로 (사용자이름(폴더)/new_img(폴더)/파일이름)

      try:                                                    # ContentType = 이미지 저장 형태(defalut로 설정하면 url로 접근시 다운로드 됨)
                                                              # Cache-Control = 이미지가 브라우저에 캐시로 저장되어 cors 에러가 발생하기 때문에 Cache에 저장되지 않도록 설정
          client.upload_file(file_name, bucket, key, ExtraArgs={'ContentType': 'image/png', 'CacheControl' : 'no-store'})
          print(f"{file_name}가 {bucket} 버킷에 업로드되었습니다.")
          image_data.append(key)
      except:
          print('생성된 이미지 S3 업로드 중 에러 발생')

    return jsonify({'img_data' : image_data})


# 사용하지 않는 이미지 삭제
@app.route('/imageChoice', methods=['POST','GET'])
def imageChoice():
  data = request.json.get('data') # 삭제 안할 데이터(배열)
  userId = request.json.get('id') # 사용자 ID
  prefix = f'{userId}/new_img'  # 폴더 경로
  bucket = 'final-project-s3bucket'

  response = client.list_objects(Bucket=bucket, Prefix=prefix)
  object_list = response['Contents'] # 객체 리스트(딕셔너리) -> 필요한 값을 추출해서 리스트 형태로 변환해야함
  list = [] # 객체 리스트(딕셔너리)에서 Key값을 추출하여 담을 리스트

  for ob in object_list:   # Key값 추출
    list.append(ob['Key'])

  for i in list:
    if i not in data:
      client.delete_object(Bucket=bucket, Key=i)

  print('사용 안하는 이미지 삭제 완료, 사용하는 데이터 :', data)

  return jsonify({'choice_data' : '사용 안하는 이미지 삭제 완료'})

if __name__ == '__main__':
  app.run(debug=True)

