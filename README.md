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

지금 들어있는 값은 전부 임시(placeholder)입니다. 아래 항목을 실제 정보로 바꿔주세요.

| 항목 | 위치 | 지금 값 |
| --- | --- | --- |
| 신랑 이름 / 연락처 / 부모님 | `groom` | 김민준, 010-0000-0000, 김○○ · 박○○ |
| 신부 이름 / 연락처 / 부모님 | `bride` | 이서연, 010-0000-0000, 이○○ · 최○○ |
| 예식 날짜 / 시간 | `wedding.date`, `wedding.time`, `wedding.timeLabel` | 2026-12-20, 14:00, 오후 2시 |
| 예식장 / 홀 / 주소 / 대표번호 | `wedding.venue`, `hall`, `address`, `tel` | 그랜드 하우스, 3층 그랜드홀 … |
| 지도 검색어 | `wedding.mapQuery` | 네이버지도 · 카카오맵 버튼이 이 검색어로 열립니다 |
| 초대 문구 | `invitation.body` | 배열의 각 항목이 한 줄입니다 (`""`는 빈 줄) |
| 커플 사진 / 문구 | `couple` | `/images/wedding/couple.jpg` |
| 갤러리 사진 목록 | `gallery` | 9장 (placeholder) |
| 교통 안내 | `transportation` | 지하철 / 버스 / 주차 / 기타 |
| 계좌번호 | `accounts.groom`, `accounts.bride` | 각 3개 (placeholder) |
| 연락처 목록 | `contacts.groom`, `contacts.bride` | 신랑측 / 신부측 각 3명 |
| 음악 | `music` | `enabled: false` — 음원을 넣은 뒤 `true` 로 |
| 배포 주소 / 공유 문구 / OG | `share` | **배포 후 `share.url` 을 실제 도메인으로 꼭 바꿔주세요** |

> `wedding.date` 만 바꾸면 요일, 달력, D-day가 모두 자동으로 다시 계산됩니다.

---

## 3. 사진 교체

현재는 실제 사진 대신 **로컬 placeholder 이미지**가 들어가 있습니다.
외부(Unsplash 등) 이미지를 런타임에 불러오지 않습니다.

### 파일 위치

```
public/images/wedding/
├─ hero.jpg      첫 화면 (4:5, 세로) ★ 가장 중요
├─ couple.jpg    신랑·신부 소개 (4:5, 세로)
├─ ending.jpg    마지막 사진 (4:5, 세로)
├─ 01.jpg ~ 09.jpg  갤러리
└─ og.jpg        카카오톡·문자 공유 미리보기 (1200×630)
```

### 교체 방법

1. 같은 파일명으로 덮어쓰면 코드 수정 없이 바로 반영됩니다.
2. 파일명을 바꾸고 싶다면 `src/config/wedding.ts` 의 `images`, `couple.image`, `gallery` 경로를 수정하세요.
3. 사진 장수를 늘리거나 줄이려면 `gallery` 배열만 수정하면 됩니다.
   갤러리는 `큰 사진 → 두 장 → 세로 컷 → 가로 컷 → …` 패턴이 장수에 맞춰 자동으로 반복됩니다.

### 권장 비율

| 용도 | 비율 | 권장 크기 |
| --- | --- | --- |
| hero / couple / ending | 4:5 또는 3:4 | 1200 × 1500 |
| `orientation: "portrait"` | 2:3 ~ 3:4 | 1000 × 1500 |
| `orientation: "landscape"` | 3:2 | 1500 × 1000 |
| `orientation: "square"` | 1:1 | 1000 × 1000 |
| og.jpg | 1.91:1 | 1200 × 630 |

원본 촬영본(수천 px)을 그대로 올려도 `next/image` 가 WebP/AVIF로 리사이즈해 내려보내지만,
첫 화면 로딩을 위해 **긴 변 2000px 내외, 장당 500KB 이하**로 줄여서 올리는 것을 권합니다.

### Google Drive / 외부 CDN을 쓰는 경우

`gallery[].src` 에 절대 URL을 넣고, `next.config.ts` 의 `images.remotePatterns` 에 해당 호스트를 추가하세요
(파일 안에 주석으로 예시를 남겨두었습니다).

### placeholder 다시 만들기

```bash
node scripts/generate-placeholders.mjs
```

---

## 4. 음악 교체

1. 웹용 파일을 `public/audio/wedding-theme.mp3` 에 넣습니다.
2. `src/config/wedding.ts` 의 `music.enabled` 를 `true` 로 바꿉니다.
   → 우측 상단에 작은 음악 컨트롤이 나타납니다. (`false` 면 오디오 요청 자체를 하지 않습니다.)

### `.aif` / `.aiff` 원본을 쓰는 경우

브라우저는 AIFF를 제대로 재생하지 못합니다. mp3 또는 m4a로 변환해서 넣어주세요.

```bash
# mp3 (호환성 가장 좋음)
ffmpeg -i wedding-theme.aif -codec:a libmp3lame -b:a 192k public/audio/wedding-theme.mp3

# m4a (같은 용량에서 음질이 더 좋음)
ffmpeg -i wedding-theme.aif -codec:a aac -b:a 160k public/audio/wedding-theme.m4a
```

파일 확장자를 바꿨다면 `music.src` 경로도 함께 수정하세요.
용량은 3~5MB 이내를 권합니다.

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
│  ├─ Hero.tsx            첫 화면 (JS 없이 CSS만으로 완성)
│  ├─ Invitation.tsx      초대의 글
│  ├─ Couple.tsx          신랑·신부
│  ├─ WeddingInfo.tsx     예식 정보
│  ├─ WeddingCalendar.tsx 달력 + D-day
│  ├─ Gallery.tsx         에디토리얼 갤러리
│  ├─ GalleryViewer.tsx   전체화면 뷰어 (스와이프/키보드/ESC)
│  ├─ Location.tsx        오시는 길
│  ├─ Transportation.tsx  교통
│  ├─ Accounts.tsx        마음 전하실 곳
│  ├─ Contact.tsx         연락처
│  ├─ Share.tsx           공유
│  ├─ Ending.tsx          마무리
│  ├─ AudioProvider.tsx   전역 오디오
│  ├─ MusicToggle.tsx     음악 컨트롤
│  ├─ Reveal.tsx          스크롤 등장 애니메이션
│  └─ Toast.tsx           복사 안내 토스트
├─ config/wedding.ts   ★ 모든 데이터
└─ lib/                date / clipboard / share
```

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
- 높이는 `100svh` 를 사용하고, 노치·홈 인디케이터 영역은 `env(safe-area-inset-*)` 로 처리했습니다.
- 갤러리 뷰어는 열릴 때 body 스크롤을 잠그고, 닫을 때 원래 스크롤 위치로 복원합니다.

---

## 7. 배포 후 체크리스트

- [ ] `share.url` 을 실제 도메인으로 변경
- [ ] 실제 사진으로 교체 (`hero.jpg` 부터)
- [ ] `og.jpg` 교체 후 카카오톡에 링크를 보내 미리보기 확인
- [ ] 음원 업로드 + `music.enabled: true`
- [ ] 이름 · 날짜 · 장소 · 계좌번호 · 연락처 실제 값 확인
- [ ] 아이폰 Safari / 안드로이드 Chrome 에서 직접 열어보기
- [ ] 종이 청첩장에 넣을 QR 코드 생성 후 스캔 테스트
