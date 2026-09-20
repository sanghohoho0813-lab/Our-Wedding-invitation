# Our Wedding Invitation

김상호 · 창지윤 모바일 청첩장입니다.
방문자의 대부분이 스마트폰으로 열어보는 것을 전제로 **390 × 844** 화면을 기준으로 디자인했습니다.

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide Icons
- 콘텐츠 폭 최대 520px, PC에서는 중앙 정렬
- 정적 페이지 (QR 코드로 열었을 때 바로 보이도록 / 로그인 없음)
- 도메인: **https://www.sh-jy-wedding.app**
- 연락처 · 계좌번호가 들어가므로 **검색엔진에는 노출되지 않습니다** (noindex, nofollow)

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
00 입장 화면          청첩장 열기 버튼 (이 탭에서 음악이 시작됩니다)
01 HERO              필기체 제목 + 날짜 + 영문 문구
02 저희 결혼합니다     인사말
03 인용구             사진 + 두 사람이 직접 쓴 한 문장
04 신랑 · 신부        인물 사진 2장 + 혼주 연락처(접기)
05 웨딩 인터뷰        버튼 → 모달 (Q&A 5개, 신부 답변 반영)
06 예식 안내          일시·장소 + 사진 + 달력 + 캘린더에 추가
07 D-DAY             남은 날짜
08 웨딩 갤러리        웨딩 화보 15장 + 전체화면 뷰어(확대 가능)
09 우리의 시간        타임라인 (첫 만남 · 연인 · 첫 해외여행)
09-1 우리의 일상      연애하며 찍은 사진 27장 (갤러리와 같은 모양)
09-2 서로에게         신랑·신부가 서로에게 남기는 짧은 편지
10 게스트스냅         하객 참여 안내 (업로드는 예식 당일 오픈)
11 안내 사항          주차 / 식사 / 셔틀버스 탭
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

### 아직 확정되지 않은 내용 표시

두 분이 최종 확정하지 않은 문구는 화면에 작은 표시가 함께 나옵니다.

| config | 화면 | 뜻 |
| --- | --- | --- |
| `draft: "example"` | `[예시]` | 제가 쓴 초안입니다. 두 분의 말로 바꿔주세요 |
| `draft: "needs-confirmation"` | `[확인 필요]` | 사실 확인이 끝나지 않은 정보입니다 |

**확정되면 그 항목의 `draft` 줄만 지우면 표시가 사라집니다.** 내용은 그대로 남습니다.
지금 `[예시]` / `[확인 필요]` 가 남아 있는 곳은 네 군데입니다 —
초대의 글 · 신랑 좋아하는 것 · 상호가 보는 지윤 · 게스트스냅 커피 선물.
셔틀버스는 `[확인 필요]`, 나머지는 모두 확정 내용으로 채워졌습니다.

**신랑 답변이 오면 채울 곳**
`groom.likes` · `bride.partnerQuote` · `interview.qa` 의 각 `answers` 에
`{ who: "groom", text: "..." }` 추가 · `letters.items` 에 신랑 편지 추가 ·
모두 채우면 `interview.pendingNote` 를 빈 문자열로.

### 아직 값이 없는 개인정보

전화번호가 `010-0000-0000`, 계좌가 `000000-00-000000` / 은행명이 `은행명` 인 동안에는
**전화·문자 버튼과 계좌 복사 버튼이 아예 나오지 않고** `[정보 입력 예정]` 으로만 보입니다.
실제 값을 넣으면 코드 수정 없이 자동으로 다시 켜집니다. (`src/lib/placeholder.ts`)

컴포넌트 안에는 개인정보를 하드코딩하지 않았습니다.

| 항목 | 위치 | 상태 |
| --- | --- | --- |
| 신랑 / 신부 | `groom.name`, `bride.name` | **김상호 · 창지윤** |
| 부모님 | `groom.father/mother`, `bride.father/mother` | **김영훈 · 원정연 / 창지환 · 유병연** |
| 예식 일시 | `wedding.date`, `wedding.timeLabel` | **2026-12-20(일) 오후 1시** |
| 예식장 (화면 표시용) | `wedding.venue` | **연세대학교 신촌캠퍼스 동문회관** |
| 예식 층 | `wedding.ceremonyFloor` | **2층** — 장소명 뒤에 자동으로 붙습니다 |
| 주소 | `wedding.address` | **서울 서대문구 연세로 50** |
| 지도 검색용 상호 | `wedding.mapQuery` | **연세동문회관예식장** (화면에는 보이지 않음) |
| 네이버지도 링크 | `wedding.naverMapUrl` | **https://naver.me/5xgOX94G** |
| 홀 이름 | `wedding.hall` | 비어 있음 (입력하면 층 뒤에 표시) |
| 신랑·신부 연락처 | `groom.phone`, `bride.phone` | **교체 필요** |
| 혼주 연락처 | `contacts` | **교체 필요** |
| 계좌번호 | `accounts` | **교체 필요** |
| 교통 안내 | `location.transport` | **예식장 안내로 확인 필요** |
| 생년월일 | `groom.birth`, `bride.birth` | **1990. 08. 13 / 1993. 06. 02** |
| MBTI | `groom.mbti`, `bride.mbti` | ENFJ / ISFP |
| 좋아하는 것 | `bride.likes` | 인형뽑기 · 산책 (확정) |
| 좋아하는 것 | `groom.likes` | `[예시]` — **신랑 답변 필요** |
| 지윤이 보는 상호 | `groom.partnerQuote` | 확정 |
| 상호가 보는 지윤 | `bride.partnerQuote` | `[예시]` — **신랑 답변 필요** |
| 초대의 글 | `invitation.body` | `[예시]` — **최종 문구 확인 필요** |
| 인용구 | `quote` | 곰돌이 푸 문장 |
| 웨딩 인터뷰 | `interview.qa` | 신부 답변 확정 / **신랑 답변 대기** (`interview.pendingNote`) |
| 서로에게 | `letters.items` | 신부 편지 확정 / **신랑 편지 대기** |
| 타임라인 | `timeline.items` | 2022. 08 · 2022. 10. 12 · 2024. 04 베트남 (모두 확정) |
| 우리의 일상 | `dailyGallery.images` | 27장 (확정) |
| 게스트스냅 커피 선물 | `guestSnap.reward` | `[예시]` — 지급 방식 확정 후 교체 |
| 셔틀버스 시간표 | `shuttle.toVenue`, `shuttle.fromVenue` | `[확인 필요]` — 비어 있으면 화면에 시간표가 나오지 않습니다 |
| 맺음말 인사 | `ending.farewell` | 확정 |
| 푸터 크레딧 | `ending.creditLead`(강조), `ending.credit` | 신랑이 직접 만들었다는 인사 (비우면 숨김) |

> `wedding.date` 만 바꾸면 요일 · 달력 · D-day · 영문 날짜가 모두 자동으로 다시 계산됩니다.

---

## 4. 사진

### 일상 사진

연애 중 휴대폰으로 찍은 사진은 `public/images/daily/` 에 있고,
웨딩 화보와 섞이지 않게 **"우리의 일상"** 섹션에 따로 모여 있습니다.
사진을 더하거나 순서를 바꾸려면 `scripts/build-daily.mjs` 의 `PHOTOS` 만 고치고
다시 실행하면 config 에 붙여넣을 배열이 출력됩니다.

```bash
PHOTO_SRC=/원본폴더 node scripts/build-daily.mjs
```

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

### 재생 정책 — 어떻게 자동으로 나오게 했는가

**소리가 나는 자동재생은 브라우저가 정책으로 막습니다.**
Chrome · Safari · 삼성인터넷 · 카카오톡 인앱 브라우저 모두 같고, 어떤 코드로도 우회할 수 없습니다.
하객이 화면을 **한 번 건드려야** 소리가 납니다. PC도 마찬가지입니다.

그래서 **청첩장을 여는 동작 자체를 그 한 번의 터치로** 삼았습니다.

1. 링크를 열면 입장 화면이 먼저 뜹니다. (사진 + 이름 + 일시 + `청첩장 열기`)
2. 그 사이 곡을 **음소거 상태로 미리 재생**해 둡니다. (음소거 재생은 허용됩니다)
3. `청첩장 열기` 를 누르는 순간 — 이것이 브라우저가 요구하는 제스처입니다 —
   음소거가 풀리고 **곡이 처음부터** 흐르면서 청첩장이 나타납니다.

하객 입장에서는 "열었더니 음악이 나온다" 가 됩니다. 음악 버튼을 따로 누를 필요가 없습니다.

한 번 입장한 뒤에는 같은 브라우저 세션 안에서 다시 묻지 않습니다.
(지도 앱에 갔다가 돌아오거나 새로고침해도 또 열라고 하지 않고, 첫 터치에서 음악이 이어집니다)

입장 화면이 필요 없으면 `entry.enabled` 를 `false` 로 바꾸세요.
그 경우 음악은 하객이 화면을 처음 건드릴 때 켜지고,
2.2초가 지나도 소리가 없으면 음악 버튼 옆에 `음악 켜기` 안내가 잠깐 나옵니다.

그 밖에 유지되는 동작:
소리 켜기가 거부되면 다음 제스처에서 다시 시도 /
하객이 직접 끄면 다시 켜지 않음 / 다른 앱에 갔다 오면 이어재생.

> **왜 `<audio>` 가 아니라 `<video>` 인가**
> 브라우저가 음소거 자동재생을 허용하는 것은 `<video>` 뿐입니다.
> `<audio>` 는 음소거여도 `NotAllowedError` 로 막힙니다. (실제로 확인했습니다)
> 그래서 mp3 를 화면에 보이지 않는 1px `<video>` 로 재생합니다.
> 터치를 가로채지 않고 레이아웃에도 영향을 주지 않습니다.

자바스크립트가 꺼져 있으면 입장 화면은 아예 그려지지 않고 청첩장이 그대로 보입니다.

---

## 6. 아직 연결하지 않은 기능

### 6-1. 참석 여부 · 방명록 (서버 없이 동작하는 방식)

서버(`hasRemoteBackend()`)가 연결되기 전까지는 이렇게 동작합니다.

| 기능 | 서버 없을 때 | Supabase 연결 후 |
| --- | --- | --- |
| 참석 여부 | 하객의 **문자 앱**이 열려 신랑·신부에게 바로 전송 | 서버에 저장 |
| 방명록 | 섹션을 **아예 표시하지 않음** | 목록 + 작성 / 삭제 |

방명록은 서버가 없으면 각자 자기 글만 보이게 되어 기능을 못 하므로 숨깁니다.
참석 여부는 문자로 실제 신랑에게 도착하므로 그대로 켜 두어도 됩니다.

문자는 하객이 고른 쪽으로 갑니다.

| 하객 선택 | 받는 사람 |
| --- | --- |
| 신랑측 | `groom.phone` |
| 신부측 | `bride.phone` |

> ⚠️ 해당 번호가 아직 `010-0000-0000` 이면 **문자 앱을 열지 않고** 안내만 띄웁니다.
> 두 번호 모두 실제 번호로 바꿔주세요.

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

업로드 저장소는 아직 연결하지 않았습니다.
되는 것처럼 보이면 안 되므로 버튼을 누를 수 없게 두고 `예식 당일 오픈됩니다` 만 보여줍니다.

저장소를 붙인 뒤 `guestSnap.uploadReady` 를 `true` 로 바꾸면 버튼이 활성화됩니다.
안내 문구(`guestSnap.notes`), 커피 선물 문구(`guestSnap.reward`), 보관 안내(`guestSnap.archiveNote`)
는 모두 config 에서 바꿀 수 있습니다.

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

### 성능 · 보안 메모

- 한글 폰트는 실제로 쓰는 굵기(400 · 500)만 싣습니다. 굵기 하나가 @font-face 100여 개라
  굵기를 늘리면 렌더링을 막는 CSS 가 수십 KB 씩 늘어납니다.
- 모든 응답에 `X-Content-Type-Options` · `X-Frame-Options` · `Referrer-Policy` ·
  `Permissions-Policy` · `X-Robots-Tag: noindex` 헤더가 붙습니다. (`next.config.ts`)
- `/manifest.webmanifest` — "홈 화면에 추가" 시 이름 · 아이콘 · 배경색.
- 잘못된 주소(404) 와 예기치 못한 오류 화면도 청첩장과 같은 톤으로 안내합니다.
- Lighthouse(모바일) 접근성 100 · 권장사항 100. 검색 노출은 의도적으로 막았습니다.

### 알아두면 좋은 구현 포인트

- 사진을 바꾼 뒤에는 **두 가지**를 하세요.
  1. `node scripts/build-blur.mjs` — 로딩 중에 깔리는 흐릿한 미리보기를 다시 만듭니다.
  2. `rm -rf .next/cache/images` — 파일 이름이 같으면 예전 사진이 그대로 나옵니다.
- 신랑·신부 소개는 카드를 따로 두지 않고 **한 격자 안에서 행 단위로** 배치합니다.
  두 사람의 줄 수가 달라도 같은 항목이 항상 같은 높이에 옵니다.
- 모든 섹션 제목에 `id` 가 붙어 있어 `aria-labelledby` 가 실제로 이름을 읽어옵니다.

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
- [ ] 화면에 남은 `[예시]` · `[확인 필요]` 표시 모두 정리 (해당 항목의 `draft` 줄 삭제)
- [ ] 셔틀버스 운행 시간 확인 후 `shuttle.toVenue` / `shuttle.fromVenue` 입력
- [ ] **카카오 JavaScript 키** 입력 (`share.kakaoJavascriptKey`, 6-4 참고)
- [ ] 카카오톡에 링크를 보내 미리보기(og.jpg) 확인
- [ ] **웨딩 인터뷰** 답변을 두 분의 말로 다듬기 (지금은 초안)
- [ ] 캘린더에 추가 버튼 눌러 일정이 바르게 담기는지 확인
- [ ] 아이폰 Safari / 안드로이드 Chrome 에서 직접 열어보기
- [ ] 종이 청첩장 QR 코드 스캔 테스트
