# Our Wedding Invitation

모바일 우선(mobile-first)으로 만든 개인 모바일 청첩장입니다.
방문자의 대부분이 스마트폰으로 열어보는 것을 전제로, **390 × 844** 화면을 기준으로 디자인했습니다.

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide Icons
- 콘텐츠 폭 최대 520px, PC에서는 중앙 정렬
- 백엔드 없음 / 로그인 없음 / 정적 페이지 (QR 코드로 열었을 때 바로 보이도록)

---

## 1. 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 프로덕션 빌드
npm start          # 빌드 결과 실행
npm run typecheck  # 타입 검사
npm run lint       # ESLint
```

배포는 Vercel 기준입니다. GitHub 저장소를 연결하면 별도 설정 없이 배포됩니다.

---

## 2. 내용 수정은 이 파일 하나만 — `src/config/wedding.ts`

이름, 날짜, 장소, 주소, 계좌번호, 연락처, 사진 목록, 공유 문구까지
**모든 텍스트와 경로가 `src/config/wedding.ts` 한 곳에** 있습니다.
컴포넌트 안에는 개인정보를 하드코딩하지 않았습니다.

이름 · 부모님 성함 · 예식 일시 · 예식장 · 사진 · 음악은 실제 정보가 들어가 있습니다.
**연락처(전화번호)와 계좌번호, 교통 안내**만 아직 임시값입니다.

| 항목 | 위치 | 지금 값 |
| --- | --- | --- |
| 신랑 / 신부 | `groom.name`, `bride.name` | **김상호 · 창지윤** |
| 신랑 부모님 | `groom.father/mother` | **김영훈 · 원정연** |
| 신부 부모님 | `bride.father/mother` | **창지환 · 유병연** |
| 예식 일시 | `wedding.date`, `wedding.timeLabel` | **2026-12-20(일) 오후 1시** |
| 예식장 / 주소 | `wedding.venue`, `address` | **연세대학교 신촌캠퍼스 동문회관 / 서울 서대문구 연세로 50** |
| 홀 이름 | `wedding.hall` | 비어 있음 (입력하면 화면에 표시됩니다) |
| 신랑·신부 연락처 | `groom.phone`, `bride.phone` | 010-0000-0000 — **교체 필요** |
| 혼주 연락처 | `contacts.groom`, `contacts.bride` | 010-0000-0000 — **교체 필요** |
| 계좌번호 | `accounts.groom`, `accounts.bride` | 은행명/000000 — **교체 필요** |
| 교통 안내 | `transportation` | 신촌역 기준 — **예식장 안내로 확인 필요** |
| 초대 문구 | `invitation.body` | 배열의 각 항목이 한 줄입니다 (`""`는 빈 줄) |
| 갤러리 사진 | `gallery` | 실제 웨딩 사진 17장 |
| 음악 | `music` | `enabled: true` — 자체 제작 곡 재생 중 |
| 배포 주소 / 공유 문구 | `share` | **배포 후 `share.url` 을 실제 도메인으로 꼭 바꿔주세요** |

> `wedding.date` 만 바꾸면 요일, 달력, D-day가 모두 자동으로 다시 계산됩니다.

---

## 3. 사진

Google Drive 원본(2026-05-22 촬영, 18장)을 웹용으로 변환해 넣어두었습니다.
EXIF 회전을 적용하면 17장이 **세로 2:3**, 1장이 가로 3:2 입니다.

### 파일 위치

```
public/images/wedding/
├─ hero.jpg          첫 화면 (1200×2133, 9:16 으로 미리 크롭)
├─ 01.jpg ~ 17.jpg   갤러리 (긴 변 1600px, 원본 프레임 그대로)
└─ og.jpg            카카오톡·문자 공유 미리보기 (1200×630)
```

웨딩 사진은 **Hero 1장 + GALLERY 17장** 두 곳에만 들어갑니다.
갤러리 카드는 3:4 로 통일되어 있고(세로 원본이라 위아래만 살짝 잘림),
**전체화면 뷰어에서는 잘리지 않은 원본 프레임**이 보입니다.

### 원본에서 다시 만들기

원본을 `scripts/` 옆의 작업 폴더에 받아두고 경로를 맞춘 뒤 실행하면
hero / og / 갤러리를 한 번에 다시 만들 수 있습니다.

```bash
node scripts/build-photos.mjs
```

사진을 바꾸거나 순서를 바꾸려면 이 스크립트의 `HERO`, `GALLERY` 배열을 수정하고
다시 실행한 뒤, `src/config/wedding.ts` 의 `gallery` 배열(설명 문구)도 맞춰주세요.

### 사진이 잘리는 위치 조정

카드에서 인물이 잘리면 `objectPosition` 으로 보여줄 부분을 지정할 수 있습니다.

```ts
{ src: "/images/wedding/03.jpg", alt: "…", objectPosition: "center 30%" }
```

### Google Drive / 외부 CDN을 직접 참조하는 경우

`gallery[].src` 에 절대 URL을 넣고, `next.config.ts` 의 `images.remotePatterns` 에 호스트를 추가하세요.
다만 Drive 링크는 만료·권한 이슈가 있어 **지금처럼 저장소에 넣어두는 편**이 안전합니다.

---

## 4. 음악

`public/audio/wedding-theme.mp3` 에 **직접 만든 배경음악**이 들어가 있습니다.
(D major · 66BPM · 72초 · 오르골 + 패드 + 단순한 멜로디, 끊김 없이 반복 재생)

코드로 합성한 곡이라 `scripts/make-music.mjs` 를 고치면 분위기를 바꿀 수 있습니다.

```bash
npm i -D @breezystack/lamejs
node scripts/make-music.mjs
```

- 화음 진행: `PROG` (지금은 D – A/C# – Bm7 – G)
- 멜로디: `MELODY` (마디별 `[음이름, 시작 박, 길이]`)
- 빠르기: `BPM`, 길이: `BARS`

### 다른 곡으로 교체하려면

1. 웹용 파일을 `public/audio/wedding-theme.mp3` 로 덮어씁니다.
2. 파일명을 바꿨다면 `music.src` 도 함께 수정하세요.
3. 음악을 아예 끄려면 `music.enabled` 를 `false` 로 바꾸면 됩니다.
   (요청 자체를 하지 않고 컨트롤도 사라집니다.)

`.aif` / `.aiff` 원본은 브라우저에서 재생되지 않으므로 변환이 필요합니다.

```bash
ffmpeg -i wedding-theme.aif -codec:a libmp3lame -b:a 192k public/audio/wedding-theme.mp3
```

용량은 3~5MB 이내를 권합니다. (현재 파일은 1.1MB)

### 재생 정책

브라우저 정책상 소리가 있는 자동재생은 막혀 있습니다.
이 청첩장은 **사용자가 화면을 처음 터치하는 순간 한 번만** 재생을 시도하고,
막히면 조용히 넘어갑니다. 언제든 우측 상단 버튼으로 켜고 끌 수 있으며,
오디오는 최상위에 한 번만 마운트되므로 스크롤해도 재생이 끊기지 않습니다.

---

## 5. 아직 연결하지 않은 외부 기능

### 카카오톡 공유

인터페이스는 `src/lib/share.ts` 에 준비되어 있고, 키만 넣으면 동작합니다.

1. [Kakao Developers](https://developers.kakao.com) 에서 앱 생성 → **JavaScript 키** 발급
2. 플랫폼 → Web 에 배포 도메인 등록
3. `src/config/wedding.ts` 의 `share.kakaoJavascriptKey` 에 키 입력
4. `src/app/layout.tsx` 의 Kakao SDK `<script>` 주석을 해제

키가 없으면 카카오톡 버튼은 아예 표시되지 않고, 링크 복사 · Web Share만 노출됩니다.

### 지도

지금은 네이버지도 / 카카오맵 **앱·웹으로 바로 여는 버튼**만 제공합니다(별도 키 불필요).
지도를 페이지 안에 이미지로 보여주고 싶다면 캡처 이미지를 `public/images/` 에 넣고
`wedding.mapImage` 에 경로를 지정하면 그 자리에 표시됩니다.

---

## 6. 구조

```
src/
├─ app/
│  ├─ layout.tsx      폰트 / metadata / OG / 구조화 데이터 / Provider
│  ├─ page.tsx        섹션 순서
│  ├─ globals.css     컬러·타이포 토큰, hero CSS 애니메이션
│  └─ icon.svg        파비콘
├─ components/
│  ├─ Hero.tsx            01 첫 화면 (JS 없이 CSS만으로 완성)
│  ├─ Invitation.tsx      02 초대의 글
│  ├─ Couple.tsx          03 신랑·신부 (이름 + 전화/문자)
│  ├─ WeddingInfo.tsx     04 예식 정보 + 달력 + D-day (한 섹션)
│  ├─ Gallery.tsx         05 가로 스와이프 갤러리
│  ├─ GalleryViewer.tsx      전체화면 뷰어 (스와이프/키보드/ESC/배경 탭)
│  ├─ Location.tsx        06 오시는 길 + 교통 (한 섹션)
│  ├─ Accounts.tsx        07 마음 전하실 곳 (Accordion)
│  ├─ Contact.tsx         08 혼주 연락처 + 공유 (한 섹션)
│  ├─ Ending.tsx          09 맺음말 (사진 없음)
│  ├─ AudioProvider.tsx      전역 오디오
│  ├─ MusicToggle.tsx        음악 컨트롤
│  ├─ Reveal.tsx             스크롤 등장 애니메이션
│  └─ Toast.tsx              복사 안내 토스트
├─ config/wedding.ts   ★ 모든 데이터
└─ lib/                date / clipboard / share
```

### 페이지가 짧은 이유 (2차 개선)

모바일에서 "끝없이 내려가는" 느낌을 없애기 위해 이렇게 정리했습니다.

- 웨딩 사진을 **GALLERY 한 곳**으로 모으고, 세로로 길게 늘어놓던 배치를
  **가로 스와이프**로 바꿨습니다. (사진 17장이 세로 한 화면 안에 들어옵니다)
- 페이지 중간·마지막에 있던 큰 장식 사진 2장을 없앴습니다.
- `예식 정보 + 달력 + D-day`, `오시는 길 + 교통`, `연락처 + 공유` 를 각각 한 섹션으로 합쳤습니다.
- 신랑·신부 연락처(COUPLE)와 혼주 연락처(CONTACT)가 겹치지 않도록 나눴습니다.

### 디자인 원칙 (수정할 때 참고)

- 카드 · 그림자 · 테두리를 쓰지 않고 **타이포그래피와 여백**으로 구분합니다.
- 강한 색을 쓰지 않습니다. 화면에서 가장 강한 색은 항상 **사진**입니다.
- 본문 한글은 16px 이상, 터치 영역은 44px 이상을 유지합니다.
- 애니메이션은 `opacity` + 12~20px 상승만 사용합니다 (0.5~0.9초).
- `prefers-reduced-motion` 을 켠 사용자에게는 모션을 끕니다.

### 알아두면 좋은 구현 포인트

- **첫 화면은 JS 없이 완성됩니다.** Hero는 CSS 애니메이션으로만 동작하고,
  나머지 섹션도 서버 렌더링 시점에 "보이는 상태"로 출력한 뒤
  화면 아래에 있는 요소만 등장 애니메이션 대상으로 전환합니다.
  (JS 로딩이 느리거나 실패해도 청첩장 내용은 항상 읽힙니다.)
- 첫 화면 높이는 `88svh` 를 사용하고, 노치·홈 인디케이터 영역은 `env(safe-area-inset-*)` 로 처리했습니다.
- 갤러리는 CSS `scroll-snap` 기반이라 손가락 관성 스크롤이 그대로 살아 있고,
  스크롤바는 숨겨져 있습니다. 사진을 누르면 전체화면 뷰어가 열립니다.
- 갤러리 뷰어는 열릴 때 body 스크롤을 잠그고, 닫을 때 원래 스크롤 위치로 복원합니다.
  좌우 스와이프 · 화살표 키 · ESC · 사진 바깥 여백 탭으로 조작할 수 있습니다.

---

## 7. 배포 전 체크리스트

- [ ] 신랑·신부 **연락처** 입력 (`groom.phone`, `bride.phone`)
- [ ] 혼주 **연락처** 입력 (`contacts`)
- [ ] **계좌번호** 입력 (`accounts`)
- [ ] **교통 안내**를 예식장에서 받은 실제 정보로 확인 (`transportation`)
- [ ] 홀 이름이 정해지면 `wedding.hall` 입력
- [ ] 배포 후 `share.url` 을 실제 도메인으로 변경
- [ ] 카카오톡에 링크를 보내 미리보기(og.jpg) 확인
- [ ] 아이폰 Safari / 안드로이드 Chrome 에서 직접 열어보기
- [ ] 종이 청첩장에 넣을 QR 코드 생성 후 스캔 테스트
