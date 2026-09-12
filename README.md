# Our Wedding Invitation

김상호 · 창지윤 모바일 청첩장입니다.
방문자의 대부분이 스마트폰으로 열어보는 것을 전제로 **390 × 844** 화면을 기준으로 디자인했습니다.

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide Icons
- 콘텐츠 폭 최대 520px, PC에서는 중앙 정렬
- 정적 페이지 (QR 코드로 열었을 때 바로 보이도록 / 로그인 없음)

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

## 2. 페이지 구성

```
01 HERO              필기체 제목 + 날짜 + 영문 문구
02 저희 결혼합니다     인사말
03 인용구             사진 + 짧은 글
04 신랑 · 신부        인물 사진 2장 + 혼주 연락처(접기)
05 웨딩 인터뷰        버튼 → 모달 (Q&A 6개, 초안)
06 예식 안내          일시·장소 + 사진 + 달력 + 캘린더에 추가
07 D-DAY             남은 날짜
08 갤러리             3열 그리드 + 전체화면 뷰어(확대 가능)
09 우리의 시간        타임라인 (첫 만남 · 연인이 되던 날)
10 게스트스냅         안내 + 업로드 버튼
11 안내 사항          주차안내 (항목이 2개 이상이면 탭으로 표시)
12 오시는 길          지도 + 지도앱 버튼 + 교통
13 참석 여부 전달      RSVP 폼
14 마음 전하실 곳      신랑측 / 신부측 드롭다운
15 방명록             서버 연결 전까지 자동으로 숨김 (6-1 참고)
16 함께한 시간        2022. 10. 12 부터 흐르는 실시간 카운터
17 맺음말             인사 + 크레딧 + 푸터
```

- 우측 상단: 음악 켜기/끄기
- 우측 하단: 맨 위로 / 공유

각 섹션은 `src/config/wedding.ts` 의 `enabled` 값으로 켜고 끌 수 있습니다.

---

## 3. 내용 수정은 이 파일 하나만 — `src/config/wedding.ts`

컴포넌트 안에는 개인정보를 하드코딩하지 않았습니다.

| 항목 | 위치 | 상태 |
| --- | --- | --- |
| 신랑 / 신부 | `groom.name`, `bride.name` | **김상호 · 창지윤** |
| 부모님 | `groom.father/mother`, `bride.father/mother` | **김영훈 · 원정연 / 창지환 · 유병연** |
| 예식 일시 | `wedding.date`, `wedding.timeLabel` | **2026-12-20(일) 오후 1시** |
| 예식장 / 주소 | `wedding.venue`, `address` | **연세대학교 신촌캠퍼스 동문회관 / 서울 서대문구 연세로 50** |
| 홀 이름 | `wedding.hall` | 비어 있음 (입력하면 표시) |
| 신랑·신부 연락처 | `groom.phone`, `bride.phone` | **교체 필요** |
| 혼주 연락처 | `contacts` | **교체 필요** |
| 계좌번호 | `accounts` | **교체 필요** |
| 교통 안내 | `location.transport` | **예식장 안내로 확인 필요** |
| 생년월일 | `groom.birth`, `bride.birth` | **1990. 08. 13 / 1993. 06. 02** |
| MBTI · 취미 | `groom.keywords`, `bride.keywords` | ENFJ · 신부와 둘만의 시간 보내기 / ISFP (**신부 취미 추가 필요**) |
| 타임라인 | `timeline.items` | 2022. 08 첫 만남 / 2022. 10. 12 연인 (**중간 이야기 추가 가능**) |
| 푸터 크레딧 | `ending.creditLead`(강조), `ending.credit` | 신랑이 직접 만들었다는 인사 (비우면 숨김) |

> `wedding.date` 만 바꾸면 요일 · 달력 · D-day · 영문 날짜가 모두 자동으로 다시 계산됩니다.

---

## 4. 사진

### 이미 들어가 있는 사진

원본 43장 중에서 자리별로 어울리는 컷을 골라 넣었습니다.

```
public/images/wedding/
├─ hero.jpg        첫 화면 (1200×2133)
├─ quote.jpg       인용구
├─ groom.jpg       신랑 카드
├─ bride.jpg       신부 카드
├─ info.jpg        예식 안내
├─ dday.jpg        D-day 배너
├─ guestsnap.jpg   게스트스냅
├─ ending-1.jpg    마무리 1
├─ ending-2.jpg    마무리 2
├─ 01.jpg ~ 15.jpg 갤러리
└─ og.jpg          공유 미리보기 (1200×630)
```

사진을 바꾸려면 `scripts/build-photos.mjs` 의 `PICKS` / `GALLERY` 에서
파일명만 고치고 다시 실행하면 됩니다.
`crop: { left, top, width, height }` 을 지정하면 그 영역만 잘라내므로
인물을 더 크게 보여주고 싶을 때 쓸 수 있습니다. (신랑·신부 카드가 이 방식입니다)

```bash
PHOTO_SRC=/원본이/있는/폴더 node scripts/build-photos.mjs
```

### 아직 비어 있는 사진 자리

아래 항목에 **경로만 넣으면** 그 자리에 바로 표시됩니다.
비어 있는 동안에는 같은 크기의 "사진 준비 중입니다" 블록이 보이므로 레이아웃이 깨지지 않습니다.

| 자리 | config 위치 | 권장 비율 |
| --- | --- | --- |
| 주차안내 | `infoTabs.items[].image` | 4:3 |
| 지도 | `location.mapImage` | 이미 생성됨 — `node scripts/build-map.mjs` (OpenStreetMap, API 키 불필요). 예식장 약도로 바꾸려면 그 파일 경로를 넣으세요 |
| 타임라인 사진 | `timeline.items[].image` | 1:1 (비워두면 날짜만 표시) |

파일은 `public/images/` 아래에 넣고 `/images/파일명.jpg` 형태로 경로를 적으면 됩니다.

---

## 5. 음악

`public/audio/wedding-theme.mp3` — **신랑이 직접 작곡한 곡**입니다.
(96kbps · 약 2분 56초 · 2.0MB, 끝나면 자동으로 다시 재생)

원곡은 192kbps 4.2MB 였지만, 데이터 환경에서 재생이 늦게 시작되는 걸 막기 위해
클리핑 여유(-1.5dB)를 두고 96kbps 로 다시 인코딩했습니다.
음질을 되돌리고 싶으면 원본을 아래 명령으로 다시 넣으면 됩니다.

다른 곡으로 바꾸려면 같은 경로에 덮어쓰면 됩니다.
파일명을 바꿨다면 `music.src` 도 함께 수정하세요.
음악을 끄려면 `music.enabled` 를 `false` 로 바꾸면 요청 자체를 하지 않습니다.

`.aif` / `.aiff` 는 브라우저에서 재생되지 않으므로 변환이 필요합니다.

```bash
ffmpeg -i 원본.aif -af volume=-1.5dB -codec:a libmp3lame -b:a 96k public/audio/wedding-theme.mp3
```

### 재생 정책

브라우저 정책상 소리가 있는 자동재생은 사용자가 화면을 건드리기 전에는 불가능합니다.
게다가 카카오톡·인스타그램 같은 **인앱 브라우저에서는 첫 시도가 거부되는 일이 잦습니다.**

그래서 "첫 터치에 한 번만" 시도하지 않고, **재생에 성공할 때까지 매 제스처마다 다시 시도**합니다.
(pointerdown · touchstart · touchend · click · keydown · scroll 을 모두 듣습니다.)
사용자가 우측 상단 버튼으로 직접 끈 뒤에는 다시 켜지 않습니다.
다른 앱에 갔다가 돌아오면 끊긴 재생을 이어줍니다.

오디오는 최상위에 한 번만 마운트되므로 스크롤해도 끊기지 않고,
`preload="metadata"` 라 곡 전체는 실제 재생 시점에 내려받습니다.

---

## 6. 아직 연결하지 않은 기능

### 6-1. 참석 여부 · 방명록 (서버 없이 동작하는 방식)

서버(`hasRemoteBackend()`)가 연결되기 전까지는 이렇게 동작합니다.

| 기능 | 서버 없을 때 | Supabase 연결 후 |
| --- | --- | --- |
| 참석 여부 | 하객의 **문자 앱**이 열려 신랑에게 바로 전송 | 서버에 저장 |
| 방명록 | 섹션을 **아예 표시하지 않음** | 목록 + 작성 / 삭제 |

방명록은 서버가 없으면 각자 자기 글만 보이게 되어 기능을 못 하므로 숨깁니다.
참석 여부는 문자로 실제 신랑에게 도착하므로 그대로 켜 두어도 됩니다.

> ⚠️ 문자가 가는 번호는 `groom.phone` 입니다. **실제 번호로 꼭 바꿔주세요.**

### 6-2. Supabase 연결 방법

1. Supabase 프로젝트를 만들고 아래 테이블을 생성합니다.

```sql
create table rsvp (
  id          bigint generated always as identity primary key,
  side        text    not null,          -- 'groom' | 'bride'
  name        text    not null,
  attending   boolean not null,
  headcount   int     not null default 1,
  meal_yn     boolean not null default true,
  message     text,
  created_at  timestamptz not null default now()
);

create table guestbook (
  id          bigint generated always as identity primary key,
  name        text not null,
  message     text not null,
  password    text not null,            -- 삭제 확인용 (해시 저장 권장)
  created_at  timestamptz not null default now()
);
```

2. 패키지를 설치하고 환경변수를 넣습니다.

```bash
npm i @supabase/supabase-js
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. `src/lib/backend.ts` 의 함수 4개(`submitRsvp`, `fetchGuestbook`,
   `addGuestbookEntry`, `deleteGuestbookEntry`) 안의 `TODO(Supabase)` 주석 자리를
   Supabase 호출로 바꾸면 됩니다. **화면 코드는 수정할 필요가 없습니다.**

4. RLS(Row Level Security)를 켜고, `insert`/`select` 만 익명 허용하도록 정책을 넣어주세요.

### 6-3. 게스트스냅 업로드

지금은 버튼을 눌러도 "업로드는 준비 중입니다" 안내만 나옵니다.
Supabase Storage 버킷을 만든 뒤 `src/components/GuestSnap.tsx` 의 `onClick` 에
업로드 로직을 연결하면 됩니다. 사용하지 않으려면 `guestSnap.enabled` 를 `false` 로 두세요.

### 6-4. 카카오톡 공유

1. [Kakao Developers](https://developers.kakao.com) 에서 **JavaScript 키** 발급
2. 플랫폼 → Web 에 배포 도메인 등록
3. `share.kakaoJavascriptKey` 에 키 입력
4. `src/app/layout.tsx` 의 Kakao SDK `<script>` 주석 해제

키가 없으면 공유 버튼은 Web Share / 링크 복사로 자동 대체됩니다.

---

## 7. 구조

```
src/
├─ app/
│  ├─ layout.tsx      폰트 / metadata / OG / 구조화 데이터 / Provider
│  ├─ page.tsx        섹션 순서
│  ├─ globals.css     컬러·타이포 토큰, 버튼/카드 유틸, hero 애니메이션
│  └─ icon.svg        파비콘
├─ components/        섹션별 컴포넌트 (페이지 구성 순서와 동일)
│  ├─ PhotoSlot.tsx      사진 자리 (비어 있으면 안내 블록)
│  ├─ SectionHeading.tsx 국문 세리프 제목 + 본문
│  ├─ Modal.tsx          공통 시트형 모달
│  ├─ Reveal.tsx         스크롤 등장 애니메이션
│  ├─ Toast.tsx          복사 안내 토스트
│  └─ …
├─ config/wedding.ts  ★ 모든 데이터
└─ lib/               date / clipboard / share / backend
```

### 디자인 토큰 (`globals.css`)

| 이름 | 값 | 용도 |
| --- | --- | --- |
| `paper` | `#fbfaf7` | 배경 |
| `ink` | `#2b2925` | 본문 |
| `accent` | `#a68e63` | 섹션 제목 · 아이콘 |
| `accent-soft` | `#b9a684` | 버튼 · 달력 강조 |
| `accent-pale` | `#f3ede2` | 형광펜 강조 · 선택된 항목 |

- 제목: `Noto Serif KR` / 본문: `Noto Sans KR` / 영문: `Cormorant Garamond` / HERO 필기체: `Parisienne`
- 필기체를 바꾸려면 `layout.tsx` 의 `Parisienne` 하나만 교체하면 됩니다.

### 알아두면 좋은 구현 포인트

- **첫 화면은 JS 없이 완성됩니다.** Hero는 CSS 애니메이션으로만 동작하고,
  나머지 섹션도 서버 렌더링 시점에 "보이는 상태"로 출력한 뒤
  화면 아래에 있는 요소만 등장 애니메이션 대상으로 전환합니다.
- 첫 화면 높이는 `92svh`, 노치·홈 인디케이터는 `env(safe-area-inset-*)` 로 처리했습니다.
- 갤러리 뷰어는 **두 번 탭 / 두 손가락으로 확대**할 수 있고(최대 4배),
  확대한 상태에서는 좌우 스와이프가 넘기기 대신 사진 이동으로 바뀝니다.
  사진을 넘기면 확대는 자동으로 풀립니다.
- 갤러리 뷰어와 모달은 열릴 때 body 스크롤을 잠그고 닫을 때 원래 위치로 복원합니다.
- 모든 터치 영역은 44px 이상입니다.

---

## 8. 배포 전 체크리스트

- [ ] 신랑·신부 **연락처** 입력 (참석 여부 문자가 `groom.phone` 으로 갑니다)
- [ ] 혼주 **연락처** 입력
- [ ] **계좌번호** 입력
- [ ] **교통 안내** 확인
- [ ] 비어 있는 **사진 자리** 채우기 (4번 표)
- [ ] 홀 이름이 정해지면 `wedding.hall` 입력
- [ ] `share.url` 을 실제 도메인으로 변경
- [ ] **카카오 JavaScript 키** 입력 (`share.kakaoJavascriptKey`, 6-4 참고)
- [ ] 카카오톡에 링크를 보내 미리보기(og.jpg) 확인
- [ ] **웨딩 인터뷰** 답변을 두 분의 말로 다듬기 (지금은 초안)
- [ ] 캘린더에 추가 버튼 눌러 일정이 바르게 담기는지 확인
- [ ] 아이폰 Safari / 안드로이드 Chrome 에서 직접 열어보기
- [ ] 종이 청첩장 QR 코드 스캔 테스트
