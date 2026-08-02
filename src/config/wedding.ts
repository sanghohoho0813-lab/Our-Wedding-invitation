/**
 * ─────────────────────────────────────────────────────────────
 *  청첩장 전체 데이터
 * ─────────────────────────────────────────────────────────────
 *  이 파일 하나만 수정하면 청첩장의 모든 내용이 바뀝니다.
 *  컴포넌트 안에는 이름 / 날짜 / 주소 / 계좌번호를 하드코딩하지 않습니다.
 *
 *  ※ image 값이 "" 인 항목은 아직 사진이 준비되지 않은 자리입니다.
 *    경로만 넣으면 그 자리에 바로 표시됩니다. (없으면 안내 블록이 보입니다)
 * ─────────────────────────────────────────────────────────────
 */

export type GalleryImage = {
  /** /public 기준 경로 또는 외부 CDN URL */
  src: string;
  alt: string;
  /** 잘리는 위치 조정 (CSS object-position). 생략하면 "center" */
  objectPosition?: string;
};

export type Account = {
  bank: string;
  holder: string;
  number: string;
  /** 예: "신랑", "아버지", "어머니" */
  relation?: string;
};

export type ContactPerson = {
  role: string;
  name: string;
  phone: string;
};

export type TimelineItem = {
  /** 화면에 표시할 날짜 */
  date: string;
  /** 소제목 — 예: "첫 만남" */
  title: string;
  /** 본문 (highlight 로 지정한 문구는 강조 표시됩니다) */
  body: string;
  highlight?: string;
  image: string;
};

export type InfoTab = {
  key: string;
  label: string;
  image: string;
  imageAlt: string;
  body: string[];
};

export const wedding = {
  /* ── 신랑 ─────────────────────────────────────────────── */
  groom: {
    name: "김상호",
    firstName: "상호",
    lastName: "김",
    englishName: "Sangho",
    /** TODO: 실제 번호로 교체 */
    phone: "010-0000-0000",
    /** COUPLE 섹션에 표시할 생년월일 — 비우면 표시되지 않습니다. */
    birth: "",
    /** 성격·취향 키워드 (레퍼런스처럼 4~5줄 권장). 비우면 표시되지 않습니다. */
    keywords: [] as string[],
    /** 인물 사진 — TODO: 준비되면 경로 입력 */
    photo: "",
    photoAlt: "신랑 김상호",
    father: "김영훈",
    mother: "원정연",
    /** 부모님 성함 앞 고인 표기가 필요할 때 사용 (예: "故") */
    fatherPrefix: "",
    motherPrefix: "",
    relation: "장남",
  },

  /* ── 신부 ─────────────────────────────────────────────── */
  bride: {
    name: "창지윤",
    firstName: "지윤",
    lastName: "창",
    englishName: "Jiyoon",
    /** TODO: 실제 번호로 교체 */
    phone: "010-0000-0000",
    birth: "",
    keywords: [] as string[],
    photo: "",
    photoAlt: "신부 창지윤",
    father: "창지환",
    mother: "유병연",
    fatherPrefix: "",
    motherPrefix: "",
    relation: "장녀",
  },

  /* ── 예식 정보 ────────────────────────────────────────── */
  wedding: {
    /** YYYY-MM-DD (요일·달력·D-day가 이 값에서 자동 계산됩니다) */
    date: "2026-12-20",
    /** HH:mm — 24시간 표기 */
    time: "13:00",
    /** 화면에 보여줄 시간 문구 */
    timeLabel: "오후 1시",
    venue: "연세대학교 신촌캠퍼스 동문회관",
    /** 홀 이름이 정해지면 입력하세요. 비워두면 표시되지 않습니다. */
    hall: "",
    address: "서울 서대문구 연세로 50",
    /** 지도 앱 버튼이 이 검색어로 열립니다. */
    mapQuery: "연세대학교 동문회관",
    /** 예식장 대표번호 — 비우면 표시되지 않습니다. */
    tel: "",
    /** 예식 안내 섹션 사진 */
    image: "",
    imageAlt: "신랑 신부의 웨딩 사진",
  },

  /* ── HERO ─────────────────────────────────────────────── */
  hero: {
    /** 큰 필기체 제목 (줄바꿈은 배열로) */
    title: ["our", "wedding", "day"],
    image: "/images/wedding/hero.jpg",
    imageAlt: "노을빛 잔디밭에서 입맞추는 신랑과 신부",
    imagePosition: "50% 42%",
    /** 사진 아래쪽 영문 문구 */
    caption: ["Forever begins with a single step,", "And love guides us every step of the way."],
  },

  /* ── 초대의 글 ────────────────────────────────────────── */
  invitation: {
    heading: "저희 결혼합니다",
    body: [
      "저희의 결혼 소식이",
      "부담스럽지 않게 다가가길 바라며,",
      "편한 마음으로 오셔서",
      "축하해주시면 감사하겠습니다.",
      "",
      "혹여 참석이 어려우시더라도 부담 갖지 마시고,",
      "마음으로 축하해주시면 감사하겠습니다.",
    ],
  },

  /* ── 인용구 ───────────────────────────────────────────── */
  quote: {
    enabled: true,
    image: "",
    imageAlt: "신랑 신부의 웨딩 사진",
    en: ["You can not be happy every day.", "But there are happy things every day."],
    ko: ["매일 행복할 순 없지만,", "행복한 것들은 매일 있어."],
    source: "〈월트 디즈니〉, 곰돌이 푸 中",
  },

  /* ── 웨딩 인터뷰 ──────────────────────────────────────── */
  interview: {
    /** 준비되면 true 로 바꾸세요. */
    enabled: false,
    heading: "웨딩 인터뷰",
    intro: ["두 분의 인터뷰를 준비했습니다.", "인터뷰를 확인해보세요."],
    buttonLabel: "인터뷰 읽어보기",
    /** TODO: 질문과 답변을 채워주세요. */
    qa: [] as { q: string; a: string }[],
  },

  /* ── D-DAY 배너 ───────────────────────────────────────── */
  ddayBanner: {
    enabled: true,
    image: "",
    imageAlt: "신랑 신부의 웨딩 사진",
  },

  /* ── 갤러리 ───────────────────────────────────────────── */
  gallery: [
    { src: "/images/wedding/01.jpg", alt: "호숫가에서 입맞추는 신랑과 신부" },
    { src: "/images/wedding/02.jpg", alt: "면사포를 쓰고 이마를 맞댄 두 사람" },
    { src: "/images/wedding/03.jpg", alt: "다리를 배경으로 마주 안은 신랑과 신부" },
    { src: "/images/wedding/04.jpg", alt: "부케를 든 신랑과 면사포를 쓴 신부" },
    { src: "/images/wedding/05.jpg", alt: "계단에 나란히 앉은 신랑과 신부" },
    { src: "/images/wedding/06.jpg", alt: "잔디밭에 누워 마주 보는 두 사람" },
    { src: "/images/wedding/07.jpg", alt: "꽃밭에서 뒤돌아보며 웃는 신부" },
    { src: "/images/wedding/08.jpg", alt: "잔디밭에 앉아 서로를 담는 신랑과 신부" },
    { src: "/images/wedding/09.jpg", alt: "나무가 늘어선 길을 함께 걷는 두 사람" },
    { src: "/images/wedding/10.jpg", alt: "붉은 장미 부케를 든 신부의 옆모습" },
    { src: "/images/wedding/11.jpg", alt: "단풍나무 아래 나란히 앉은 두 사람" },
    { src: "/images/wedding/12.jpg", alt: "하늘을 배경으로 신부를 안아 올린 신랑" },
    { src: "/images/wedding/13.jpg", alt: "장미 부케를 들고 마주 보며 웃는 두 사람" },
    { src: "/images/wedding/14.jpg", alt: "면사포 너머로 장미 부케를 든 신부" },
    { src: "/images/wedding/15.jpg", alt: "손하트 너머로 바라본 신부" },
    { src: "/images/wedding/16.jpg", alt: "잔디밭에서 마주 안은 신랑과 신부" },
    { src: "/images/wedding/17.jpg", alt: "손하트 너머로 바라본 신랑" },
  ] satisfies GalleryImage[],

  /* ── 우리의 시간 (타임라인) ───────────────────────────── */
  timeline: {
    /** 사진과 내용이 준비되면 true 로 바꾸세요. */
    enabled: false,
    heading: "우리의 시간",
    /** TODO: 실제 날짜와 이야기로 교체 */
    items: [] as TimelineItem[],
  },

  /* ── 함께한 시간 (실시간 카운터) ──────────────────────── */
  togetherTime: {
    /** 처음 만난 날이 정해지면 true 로 바꾸세요. */
    enabled: false,
    heading: "함께한 시간",
    /** TODO: 처음 만난 날 (YYYY-MM-DD) */
    startDate: "",
  },

  /* ── 게스트스냅 ───────────────────────────────────────── */
  guestSnap: {
    /** 업로드 저장소를 연결하기 전까지 버튼은 "준비 중" 안내만 띄웁니다. */
    enabled: true,
    heading: "게스트스냅",
    subheading: "신랑·신부의 행복한 순간을 담아주세요",
    image: "",
    imageAlt: "사진을 찍는 신랑과 신부",
    notes: [
      "저희의 스냅 작가님이 되어주세요!",
      "",
      "[이런 순간들을 담아주세요!]",
      "1. 행복한 신랑&신부 사진",
      "2. 신랑&신부 행진",
      "3. 가족&친구들과 함께한 순간",
      "4. 여러분들의 사진",
      "",
      "당일날, 아래 버튼을 통해 올려주세요!",
      "많은 참여 부탁드려요!",
    ],
    buttonLabel: "사진 및 영상 업로드",
  },

  /* ── 안내 탭 (포토부스 / 주차안내 / 답례품) ───────────── */
  infoTabs: {
    enabled: true,
    items: [
      {
        key: "parking",
        label: "주차안내",
        image: "",
        imageAlt: "예식장 주차장",
        body: ["주차 안내는 예식장에서 확인 후 업데이트할 예정입니다."],
      },
      {
        key: "photobooth",
        label: "포토부스",
        image: "",
        imageAlt: "포토부스",
        body: ["포토부스 운영 여부가 정해지면 안내드리겠습니다."],
      },
      {
        key: "gift",
        label: "답례품",
        image: "",
        imageAlt: "답례품",
        body: ["답례품 안내가 정해지면 업데이트할 예정입니다."],
      },
    ] satisfies InfoTab[],
  },

  /* ── 오시는 길 ────────────────────────────────────────── */
  location: {
    heading: "오시는 길",
    /** 지도 캡처 이미지를 넣으면 그 자리에 표시됩니다. */
    mapImage: "",
    /** TODO: 예식장에서 안내받은 실제 정보로 확인 후 교체하세요. */
    transport: [
      { icon: "subway", label: "지하철", lines: ["2호선 신촌역에서 도보 약 10분"] },
      { icon: "bus", label: "버스", lines: ["연세대학교 · 신촌역 정류장 하차"] },
      { icon: "car", label: "주차", lines: ["교내 주차장 이용", "예식 당일 주차 안내는 예식장에 문의해 주세요."] },
    ],
  },

  /* ── 참석 여부 전달 (RSVP) ────────────────────────────── */
  rsvp: {
    /**
     * ⚠️ 지금은 응답이 방문자의 브라우저에만 저장됩니다.
     *    하객에게 링크를 보내기 전에 Supabase 를 연결하거나 false 로 꺼주세요.
     */
    enabled: true,
    heading: "참석 여부 전달",
    body: [
      "소중한 시간을 내어 결혼식에",
      "참석해주시는 모든 분들께 감사드립니다.",
      "참석 여부를 회신해 주시면",
      "더욱 감사하겠습니다.",
    ],
    buttonLabel: "참석 여부 전달",
  },

  /* ── 마음 전하실 곳 ───────────────────────────────────── */
  /** TODO: 실제 계좌번호로 교체 */
  accounts: {
    heading: "마음 전하실 곳",
    body: [
      "멀리서도 축하의 마음을",
      "전하고 싶으신 분들을 위해",
      "계좌번호를 안내드립니다.",
      "",
      "소중한 축하를 보내주셔서 감사드리며,",
      "따뜻한 마음에 깊이 감사드립니다.",
    ],
    groom: [
      { bank: "은행명", holder: "김상호", number: "000000-00-000000", relation: "신랑" },
      { bank: "은행명", holder: "김영훈", number: "000-000-000000", relation: "아버지" },
      { bank: "은행명", holder: "원정연", number: "000-0000-0000-00", relation: "어머니" },
    ] satisfies Account[],
    bride: [
      { bank: "은행명", holder: "창지윤", number: "0000-000-000000", relation: "신부" },
      { bank: "은행명", holder: "창지환", number: "000-000000-000", relation: "아버지" },
      { bank: "은행명", holder: "유병연", number: "0000-00-0000000", relation: "어머니" },
    ] satisfies Account[],
  },

  /* ── 방명록 ───────────────────────────────────────────── */
  guestbook: {
    /**
     * ⚠️ 지금은 글이 작성자 본인의 브라우저에만 저장됩니다.
     *    하객에게 링크를 보내기 전에 Supabase 를 연결하거나 false 로 꺼주세요.
     */
    enabled: true,
    heading: "방명록",
    /** 목록에 한 번에 보여줄 개수 */
    pageSize: 3,
  },

  /* ── 혼주 연락처 ──────────────────────────────────────── */
  contacts: {
    groom: [
      { role: "신랑 아버지", name: "김영훈", phone: "010-0000-0000" },
      { role: "신랑 어머니", name: "원정연", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
    bride: [
      { role: "신부 아버지", name: "창지환", phone: "010-0000-0000" },
      { role: "신부 어머니", name: "유병연", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
  },

  /* ── 음악 ─────────────────────────────────────────────── */
  music: {
    enabled: true,
    src: "/audio/wedding-theme.mp3",
    title: "Our Theme",
    playOnFirstInteraction: true,
  },

  /* ── 마무리 ───────────────────────────────────────────── */
  ending: {
    /** 마지막에 크게 보여줄 사진 (비우면 문구만 표시) */
    images: [] as GalleryImage[],
    signature: "Thank you",
    message: "우리의 시작을\n함께해 주세요.",
  },

  /* ── 공유 / SEO ───────────────────────────────────────── */
  share: {
    /** 배포 후 실제 도메인으로 바꿔주세요. */
    url: "https://our-wedding-invitation.vercel.app",
    title: "김상호 ♥ 창지윤 결혼합니다",
    description:
      "2026년 12월 20일 일요일 오후 1시, 연세대학교 신촌캠퍼스 동문회관에서 저희 두 사람의 새로운 시작에 초대합니다.",
    ogImage: "/images/wedding/og.jpg",
    kakaoJavascriptKey: "",
  },
} as const;

export type WeddingConfig = typeof wedding;
