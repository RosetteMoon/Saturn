# ChachaMoon — Portfolio

Three.js로 구현한 로컬 포트폴리오. 배포하지 않았습니다.

## 실행
프로젝트 폴더에서 `python3 -m http.server 4173 --directory dist` 실행 후 http://localhost:4173 접속.
ES modules를 사용하므로 index.html을 직접 더블클릭하지 말고 HTTP 서버로 실행하세요.

## 수정
- `dist/index.html`: 이름, 소개, 작업 카드 및 연락처 안내
- `dist/main.js`: profile.email, 프로젝트 상세 데이터와 3D 재질/조명/모션
- `dist/style.css`: 색상, 글꼴, 반응형 레이아웃

현재 이름 MOON, 프로젝트 3개, 이메일 hello@example.com은 교체 가능한 샘플입니다. 공개 전 실제 정보와 작업 이미지로 바꾸고 샘플 안내를 제거하세요.

Three.js 0.180.0 패키지가 vendor에 포함되어 런타임 CDN 없이 동작합니다. 글꼴만 Google Fonts에서 로드하며 연결되지 않을 때 시스템 폰트로 표시합니다. 외부 이미지 및 사용자 추적은 없습니다.

접근성: 키보드 내비게이션, 기본 dialog 포커스 관리와 Escape 닫기, 모션 감소 설정, 모션 일시정지, WebGL 실패 메시지. 화면 밖과 비활성 탭에서는 3D 렌더링을 건너뜁니다.

## 중심 한자 오브제
`文讚美`(글월 문 · 기릴 찬 · 아름다울 미)는 이미지가 아닌 Three.js TextGeometry 메시입니다. Noto Sans CJK KR Black의 세 글자 윤곽만 변환한 `dist/fonts/moon-name.json`을 사용하며 OFL 라이선스는 같은 폴더에 포함했습니다. 원본 글꼴을 전달해 `scripts/build-name-font.py`로 재생성할 수 있습니다. `main.js`의 face/metal/darkChrome 재질과 softbox 조명에서 크롬 분위기를 조절합니다.

크롬 수정: CFF 윤곽을 pathops로 합치고 바깥/구멍 winding을 정규화했습니다. 둥근 2D 윤곽과 좁은 베벨을 사용해 안쪽 공간을 보존하며, 뒷면 복제 메시와 screen 합성 및 알파 마스크는 제거했습니다. 폰트 변환에는 fonttools와 skia-pathops가 필요합니다.
