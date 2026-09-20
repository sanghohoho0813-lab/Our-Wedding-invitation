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

/**
 * 아직 확정되지 않은 내용 표시.
 *
 *   "example"            → 화면에 [예시] 로 표시
 *   "needs-confirmation" → 화면에 [확인 필요] 로 표시
 *
 * 내용이 확정되면 해당 항목의 draft 줄만 지우면 표시가 사라집니다.
 */
export type DraftStatus = "example" | "needs-confirmation";

/** 한 줄짜리 소개 문구 (신랑·신부 소개 카드 등) */
export type IntroLine = {
  /** 앞에 붙는 작은 라벨 — 비우면 문구만 표시 */
  label?: string;
  text: string;
  draft?: DraftStatus;
};

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
  draft?: DraftStatus;
  /** 화면에 표시할 날짜 */
  date: string;
  /** 소제목 — 예: "첫 만남" */
  title: string;
  /** 본문 (highlight 로 지정한 문구는 강조 표시됩니다) */
  body: string;
  highlight?: string;
  image: string;
};

/** 인터뷰 한 줄 — 누가 답했는지 함께 표시한다. */
export type InterviewAnswer = {
  who: "groom" | "bride" | "both";
  text: string;
  draft?: DraftStatus;
};

export type InterviewItem = {
  q: string;
  answers: readonly InterviewAnswer[];
};

/** 서로에게 남기는 짧은 편지 */
export type Letter = {
  /** 누가 쓴 편지인지 */
  from: "groom" | "bride";
  label: string;
  body: string[];
  draft?: DraftStatus;
};

export type InfoTab = {
  key: string;
  label: string;
  image: string;
  imageAlt: string;
  /** 본문. 빈 문자열은 한 줄 띄우기로 표시됩니다. */
  body: string[];
  /** 시간표처럼 줄 세워 보여줄 내용 — times 가 비어 있으면 표시되지 않습니다. */
  schedule?: readonly { label: string; times: readonly string[] }[];
  /** 본문 아래 작은 글씨 안내 */
  note?: string;
  draft?: DraftStatus;
};

export const wedding = {
  /* ── 신랑 ─────────────────────────────────────────────── */
  groom: {
    name: "김상호",
    firstName: "상호",
    lastName: "김",
    englishName: "Sangho",
    /** TODO: 실제 번호로 교체. placeholder 인 동안에는 전화·문자 버튼이 나오지 않습니다. */
    phone: "010-0000-0000",
    /** COUPLE 섹션에 표시할 생년월일 — 비우면("") 표시되지 않습니다. */
    birth: "1990. 08. 13",
    mbti: "ENFJ",
    /** 소개 카드에 한 줄씩 들어갑니다. 확정되면 draft 줄만 지우세요. */
    likes: {
      label: "좋아하는 것",
      text: "지윤이와 둘만의 시간 · 여행 · 맛있는 음식",
      draft: "example",
    } satisfies IntroLine,
    /** 상대가 본 나 — 신부가 직접 써주면 가장 좋습니다. */
    partnerQuote: {
      label: "지윤이 보는 상호",
      text: "너무 귀엽고 깜찍하지만 한편으로는 듬직한 아기강아지",
    } satisfies IntroLine,
    photo: "/images/wedding/groom.jpg",
    photoAlt: "부케를 든 신랑 김상호",
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
    /** TODO: 실제 번호로 교체. placeholder 인 동안에는 전화·문자 버튼이 나오지 않습니다. */
    phone: "010-0000-0000",
    birth: "1993. 06. 02",
    mbti: "ISFP",
    likes: {
      label: "좋아하는 것",
      text: "인형뽑기 · 산책",
    } satisfies IntroLine,
    partnerQuote: {
      label: "상호가 보는 지윤",
      text: "함께 있으면 가장 편안한 사람",
      draft: "example",
    } satisfies IntroLine,
    photo: "/images/wedding/bride.jpg",
    photoAlt: "꽃밭에 선 신부 창지윤",
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
    /** 청첩장 화면에 보여줄 장소명 */
    venue: "연세대학교 신촌캠퍼스 동문회관",
    /** 예식이 열리는 층 — 비우면 표시되지 않습니다. */
    ceremonyFloor: "2층",
    /** 정확한 홀 이름이 정해지면 입력하세요. 비워두면 표시되지 않습니다. */
    hall: "",
    address: "서울 서대문구 연세로 50",
    /** 지도 앱 검색에 쓰는 실제 등록 상호 (화면에는 보이지 않습니다) */
    mapQuery: "연세동문회관예식장",
    /** 네이버지도 확정 장소 링크 — 비우면 mapQuery 검색으로 대체됩니다. */
    naverMapUrl: "https://naver.me/5xgOX94G",
    /** 예식장 대표번호 — 비우면 표시되지 않습니다. */
    tel: "",
    /** 예식 안내 섹션 사진 */
    image: "/images/wedding/info.jpg",
    imageAlt: "장미 부케를 들고 마주 안은 신랑과 신부",
  },

  /* ── HERO ─────────────────────────────────────────────── */
  hero: {
    /** 큰 필기체 제목 (줄바꿈은 배열로) */
    title: ["our", "wedding", "day"],
    image: "/images/wedding/hero.jpg",
    imageAlt: "노을빛 들판에서 서로를 안은 신랑과 신부",
    imagePosition: "50% 45%",
    /** 사진 아래쪽 영문 문구 */
    caption: ["Forever begins with a single step,", "And love guides us every step of the way."],
  },

  /* ── 초대의 글 ────────────────────────────────────────── */
  invitation: {
    heading: "저희 결혼합니다",
    /** 확정되면 draft 줄만 지우세요. */
    draft: "example" as DraftStatus | undefined,
    body: [
      "서로의 가장 편한 사람이 되어",
      "평범한 날들을 오래 함께",
      "살아가기로 했습니다.",
      "",
      "저희 두 사람의 새로운 시작을",
      "소중한 분들과 함께하고 싶습니다.",
      "",
      "편한 마음으로 오셔서",
      "따뜻하게 축하해 주시면 감사하겠습니다.",
    ],
  },

  /* ── 인용구 ───────────────────────────────────────────── */
  quote: {
    enabled: true,
    image: "/images/wedding/quote.jpg",
    imageAlt: "면사포 아래에서 마주 본 신랑과 신부",
    /** 영문 문구가 필요 없으면 빈 배열로 두세요. */
    en: [] as string[],
    ko: ["닮은 점은 함께 웃고,", "다른 점은 서로 채워주는 사이."],
    source: "",
  },

  /* ── 웨딩 인터뷰 ──────────────────────────────────────── */
  interview: {
    enabled: true,
    heading: "웨딩 인터뷰",
    intro: ["두 사람이 직접 답한", "짧은 인터뷰입니다."],
    buttonLabel: "인터뷰 읽어보기",
    /**
     * 신랑 답변이 도착하면
     *   1) 각 질문의 answers 에 { who: "groom", text: "..." } 를 추가하고
     *   2) 아래 pendingNote 를 빈 문자열로 두세요.
     */
    pendingNote: "신랑의 답변은 곧 더해집니다.",
    qa: [
      {
        q: "두 분은 어떻게 만나셨나요?",
        answers: [
          {
            who: "both",
            text: "2022년 8월, 신랑이 운영하던 사교모임에서 처음 만났어요. 두 달 뒤인 10월 12일에 연인이 되었습니다.",
          },
        ],
      },
      {
        q: "서로의 첫인상은 어땠나요?",
        answers: [
          {
            who: "bride",
            text: "멋진 모임장이라고 생각했어요. 그런데 몸이 크고 너무 어른 같아서, 처음엔 말 걸기가 쉽지 않았어요.",
          },
        ],
      },
      {
        q: "지금 서로에게 어떤 사람인가요?",
        answers: [
          {
            who: "bride",
            text: "너무 귀엽고 깜찍한데, 한편으로는 듬직한 아기강아지 같아요.",
          },
        ],
      },
      {
        q: "둘이 함께 있을 때 가장 좋아하는 시간은?",
        answers: [
          {
            who: "bride",
            text: "같이 맛있는 거 먹으면서 반주하는 시간이요. 여행 가서 멋진 풍경을 보고, 새로운 걸 함께 해보는 것도 좋아해요.",
          },
        ],
      },
      {
        q: "결혼을 결심하게 된 순간이 있나요?",
        answers: [
          {
            who: "bride",
            text: "어떤 상황에서도 저부터 챙겨주는 모습이요. 제가 예민할 때도 휩쓸리지 않고 차분히 들어줘요. 좋은 남편, 좋은 아빠가 될 것 같은 가정적인 모습에 마음이 놓였습니다.",
          },
        ],
      },
    ] satisfies InterviewItem[],
  },

  /* ── D-DAY 배너 ───────────────────────────────────────── */
  ddayBanner: {
    enabled: true,
    image: "/images/wedding/dday.jpg",
    imageAlt: "노을빛 들판에서 입맞추는 신랑과 신부",
  },

  /* ── 갤러리 ───────────────────────────────────────────── */
  gallery: [
    { src: "/images/wedding/01.jpg", alt: "호숫가에서 입맞추는 신랑과 신부" },
    { src: "/images/wedding/02.jpg", alt: "면사포를 쓰고 이마를 맞댄 두 사람" },
    { src: "/images/wedding/03.jpg", alt: "다리를 배경으로 손을 맞잡은 신랑과 신부" },
    { src: "/images/wedding/04.jpg", alt: "강가에서 마주 안은 신랑과 신부" },
    { src: "/images/wedding/05.jpg", alt: "계단에 나란히 앉은 신랑과 신부" },
    { src: "/images/wedding/06.jpg", alt: "부케를 건네는 신랑과 웃는 신부" },
    { src: "/images/wedding/07.jpg", alt: "잔디밭 돗자리에 누워 마주 보는 두 사람" },
    { src: "/images/wedding/08.jpg", alt: "붉은 꽃밭을 함께 걷는 신랑과 신부" },
    { src: "/images/wedding/09.jpg", alt: "나무가 늘어선 길을 함께 걷는 두 사람" },
    { src: "/images/wedding/10.jpg", alt: "단풍나무 아래 나란히 앉은 두 사람" },
    { src: "/images/wedding/11.jpg", alt: "장미 부케를 들고 나란히 선 신랑과 신부" },
    { src: "/images/wedding/12.jpg", alt: "하늘을 배경으로 서로를 안은 두 사람" },
    { src: "/images/wedding/13.jpg", alt: "마주 보며 활짝 웃는 신랑과 신부" },
    { src: "/images/wedding/14.jpg", alt: "면사포 아래에서 마주 안은 두 사람" },
    { src: "/images/wedding/15.jpg", alt: "노을빛 들판에서 입맞추는 신랑과 신부" },

    /* 연애 중 휴대폰으로 찍은 일상 사진 — scripts/build-daily.mjs 로 만듭니다 */
    { src: "/images/daily/01.jpg", alt: "벚꽃 아래에서 볼을 맞댄 두 사람" },
    { src: "/images/daily/02.jpg", alt: "숲이 보이는 난간에서 함께 웃는 두 사람" },
    { src: "/images/daily/03.jpg", alt: "꽃밭을 배경으로 나란히 선 두 사람" },
    { src: "/images/daily/04.jpg", alt: "마주 앉아 함께 저녁을 먹는 두 사람" },
    { src: "/images/daily/05.jpg", alt: "인형뽑기장 불빛 아래에서 웃는 두 사람" },
    { src: "/images/daily/06.jpg", alt: "강가 노을을 배경으로 안은 두 사람" },
    { src: "/images/daily/07.jpg", alt: "물 위에서 손으로 하트를 만든 두 사람" },
    { src: "/images/daily/08.jpg", alt: "모래언덕에서 함께 뛰어오른 두 사람" },
    { src: "/images/daily/09.jpg", alt: "모래언덕에서 마주 본 두 사람" },
    { src: "/images/daily/10.jpg", alt: "야자수가 보이는 창가에서 웃는 두 사람" },
    { src: "/images/daily/11.jpg", alt: "양이 있는 초원에 나란히 선 두 사람" },
    { src: "/images/daily/12.jpg", alt: "겨울 바다에서 볼에 입맞추는 두 사람" },
  ] satisfies GalleryImage[],

  /* ── 우리의 시간 (타임라인) ───────────────────────────── */
  timeline: {
    enabled: true,
    heading: "우리의 시간",
    /**
     * 사이사이에 기념일을 계속 추가하면 됩니다. (위에서 아래로 시간순)
     * image 를 비워두면 "사진 준비 중" 자리로 표시됩니다.
     */
    items: [
      {
        date: "2022. 08",
        title: "첫 만남",
        body: "신랑이 운영하던 사교모임에서 처음 만났어요.",
        highlight: "처음 만났어요",
        image: "",
      },
      {
        date: "2022. 10. 12",
        title: "연인이 되던 날",
        body: "친구에서 연인으로, 함께 걷기 시작했어요.",
        highlight: "연인으로",
        image: "",
      },
      {
        date: "2024. 04",
        title: "함께 떠난 첫 해외여행",
        body: "태국에서 보낸 닷새. 둘이서만 떠난 첫 여행이었어요.",
        highlight: "둘이서만 떠난",
        image: "/images/daily/thailand.jpg",
      },
    ] satisfies TimelineItem[],
  },

  /* ── 서로에게 (짧은 편지) ────────────────────────────────
     신랑 편지가 오면 items 에 { from: "groom", label: "신랑이 신부에게", body: [...] }
     를 추가하세요. 순서는 배열 순서 그대로입니다. */
  letters: {
    enabled: true,
    heading: "서로에게",
    items: [
      {
        from: "bride",
        label: "신부가 신랑에게",
        body: [
          "내가 항상 오빠에게 하는 말,",
          "나에게로 와줘서 정말 고맙다는 말~ 알지?",
          "",
          "힘든 일이 있어도 서로에게 의지하면서",
          "잘 살아보자 ❤️",
        ],
      },
    ] satisfies Letter[],
  },

  /* ── 함께한 시간 (실시간 카운터) ──────────────────────── */
  togetherTime: {
    enabled: true,
    heading: "함께한 시간",
    /** 연인이 된 날 */
    startDate: "2022-10-12",
  },

  /* ── 게스트스냅 ───────────────────────────────────────── */
  guestSnap: {
    enabled: true,
    heading: "우리의 사진작가가 되어주세요",
    subheading: "여러분의 시선으로 남겨주신 순간을 오래 간직하겠습니다.",
    image: "/images/wedding/guestsnap.jpg",
    imageAlt: "잔디밭에서 카메라로 서로를 담는 신랑과 신부",
    notes: [
      "저희가 미처 보지 못한 순간까지",
      "여러분의 시선으로 남겨주세요.",
      "",
      "신랑·신부의 모습은 물론,",
      "함께 웃고 있는 가족과 친구들,",
      "예식장의 분위기와 짧은 영상까지 모두 좋아요.",
      "",
      "보내주신 사진과 영상은",
      "저희 두 사람이 평생 간직할",
      "결혼 기록으로 소중히 보관하겠습니다.",
    ],
    /** 커피 선물 안내 — 방식이 확정되면 draft 줄을 지우세요. 필요 없으면 enabled: false */
    reward: {
      enabled: true,
      text: "사진이나 영상을 보내주신 분들께 작은 커피 선물을 준비했습니다. ☕",
      draft: "example" as DraftStatus | undefined,
    },
    buttonLabel: "사진 · 영상 보내기",
    /**
     * 업로드 저장소를 아직 연결하지 않았습니다.
     * 연결 전까지는 버튼이 눌리지 않고 아래 문구만 보여줍니다.
     * (Supabase Storage 등을 붙이면 uploadReady 를 true 로 바꾸세요)
     */
    uploadReady: false,
    pendingLabel: "예식 당일 오픈됩니다",
    archiveNote: "보내주신 사진과 영상은 신랑·신부의 개인 웨딩 아카이브에 보관됩니다.",
  },

  /* ── 셔틀버스 ─────────────────────────────────────────────
     운행 시간이 확정되면 toVenue / fromVenue 에 시간을 넣어주세요.
     비어 있는 동안에는 화면에 시간표가 나오지 않습니다. */
  shuttle: {
    /** 예식장으로 갈 때 타는 곳 */
    pickup: "이대역 3번 출구 부근",
    /** 집으로 돌아갈 때 타는 곳 */
    returnPickup: "동문회관 지하 1층 던킨도너츠 앞",
    toVenue: [] as readonly string[],
    fromVenue: [] as readonly string[],
    note: "정확한 운행 시간은 예식장 최종 확인 후 안내 예정입니다.",
  },

  /* ── 안내 (주차 · 식사 · 셔틀) ───────────────────────────
     항목이 하나면 탭 없이 제목으로만 표시되고,
     둘 이상이면 자동으로 탭 UI 가 됩니다. */
  infoTabs: {
    enabled: true,
    items: [
      {
        key: "parking",
        label: "주차",
        image: "",
        imageAlt: "예식장 주차장",
        body: [
          "하객 차량은 2시간 무료 주차가 가능합니다.",
          "",
          "동문회관 주차장이 만차일 경우",
          "연세대학교 치과병원 주차장을",
          "이용하실 수 있습니다.",
          "",
          "주차 지원은 차량 1대당",
          "1회 입·출차에 한해 적용됩니다.",
        ],
      },
      {
        key: "meal",
        label: "식사",
        image: "",
        imageAlt: "피로연장",
        body: [
          "예식 후 같은 층인 2층 피로연장에서",
          "뷔페 식사가 준비되어 있습니다.",
          "",
          "피로연장은 저희 예식 하객분들을 위한",
          "단독 연회 공간으로 운영됩니다.",
          "",
          "하객이 많이 몰리는 경우",
          "3층 연회장도 함께 이용하실 수 있습니다.",
        ],
      },
      {
        key: "shuttle",
        label: "셔틀버스",
        image: "",
        imageAlt: "셔틀버스",
        body: [
          "이대역 3번 출구 부근에서",
          "동문회관까지 셔틀버스가 운행됩니다.",
          "",
          "귀가 셔틀은 동문회관 지하 1층",
          "던킨도너츠 앞에서 탑승합니다.",
        ],
        /** 시간이 확정되면 config 의 shuttle 에 넣어주세요. */
        schedule: [
          { label: "이대역 → 동문회관", times: [] },
          { label: "동문회관 → 이대역", times: [] },
        ],
        note: "정확한 운행 시간은 예식장 최종 확인 후 안내 예정입니다.",
        draft: "needs-confirmation",
      },
    ] satisfies InfoTab[],
  },

  /* ── 오시는 길 ────────────────────────────────────────── */
  location: {
    heading: "오시는 길",
    /**
     * 지도 이미지. scripts/build-map.mjs 로 만들어집니다.
     * 예식장에서 받은 약도로 바꾸고 싶으면 그 파일 경로를 넣으세요.
     */
    mapImage: "/images/wedding/map.jpg",
    /**
     * 오시는 길에는 큰 줄기만 적습니다.
     * 주차 · 식사 · 셔틀 상세 안내는 infoTabs 에서 보여줍니다.
     */
    transport: [
      {
        icon: "subway",
        label: "지하철",
        lines: ["2호선 신촌역 · 2호선 이대역에서 가까운 거리에 있습니다.", "이대역에서는 셔틀버스를 이용하실 수 있습니다."],
      },
      { icon: "bus", label: "버스", lines: ["연세대학교 · 신촌역 정류장에서 하차하세요."] },
      { icon: "car", label: "자가용", lines: ["내비게이션에 \"연세동문회관예식장\" 을 검색하세요.", "주차 안내는 위쪽 안내의 주차 탭을 참고해 주세요."] },
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

  /* ── 입장 화면 ────────────────────────────────────────────
     브라우저는 하객이 화면을 한 번 건드리기 전에는 소리를 내지 못하게 막습니다.
     그래서 청첩장을 여는 그 탭을 제스처로 삼아, 열리는 순간 음악이 함께 시작되게 합니다.
     이 화면이 필요 없으면 enabled 를 false 로 바꾸세요.
     (그 경우 음악은 하객이 화면을 처음 건드릴 때 켜집니다) */
  entry: {
    enabled: true,
    buttonLabel: "청첩장 열기",
    note: "음악과 함께 준비했습니다.",
  },

  /* ── 음악 ─────────────────────────────────────────────── */
  music: {
    enabled: true,
    src: "/audio/wedding-theme.mp3",
    /** 신랑이 직접 작곡한 곡 */
    title: "Romantic Wedding Invitation",
    /**
     * 브라우저 정책상 소리 있는 자동재생은 불가능합니다.
     * 대신 들어오자마자 음소거로 재생을 시작해 두고,
     * 하객이 화면을 처음 건드리는 순간 소리를 켭니다.
     */
    playOnFirstInteraction: true,
    /** 소리가 아직 꺼져 있을 때 음악 버튼 옆에 잠깐 보여줄 안내. 비우면 표시되지 않습니다. */
    hint: "음악 켜기",
  },

  /* ── 마무리 ───────────────────────────────────────────── */
  ending: {
    /** 마지막에 크게 보여줄 사진 (비우면 문구만 표시) */
    images: [
      { src: "/images/wedding/ending-1.jpg", alt: "면사포를 날리며 웃는 신랑과 신부" },
      { src: "/images/wedding/ending-2.jpg", alt: "노을빛 들판을 함께 걷는 신랑과 신부" },
    ] satisfies GalleryImage[],
    signature: "Thank you",
    message: "우리의 시작을\n함께해 주세요.",
    /**
     * 하객분들께 드리는 마지막 인사.
     * 확정되면 farewellDraft 줄만 지우세요. 비우면 표시되지 않습니다.
     */
    farewellDraft: undefined as DraftStatus | undefined,
    farewell: [
      "소중한 주말에 저희의 결혼식을",
      "축하해 주러 오셔서 정말 감사합니다.",
      "",
      "축하해 주신 만큼",
      "행복하게 잘 살겠습니다!",
    ],
    farewellSign: "상호 · 지윤 드림",
    /**
     * 푸터에 들어가는 짧은 인사.
     * creditLead 는 강조(베이지)로, creditBody 는 작은 회색으로 표시됩니다.
     * 필요 없으면 빈 문자열 / 빈 배열로 두세요.
     */
    creditLead: "화면 구성부터 배경음악까지, 신랑이 직접 만들었습니다.",
    credit: ["신부와 하객분들을 생각하며 한 장 한 장 담았습니다.", "함께해 주셔서 감사합니다."],
  },

  /* ── 공유 / SEO ───────────────────────────────────────── */
  share: {
    /** 최종 도메인 */
    url: "https://www.sh-jy-wedding.app",
    title: "김상호 ♥ 창지윤 결혼합니다",
    description:
      "2026년 12월 20일 일요일 오후 1시, 연세대학교 신촌캠퍼스 동문회관에서 저희 두 사람의 새로운 시작에 초대합니다.",
    ogImage: "/images/wedding/og.jpg",
    kakaoJavascriptKey: "",
  },
} as const;

export type WeddingConfig = typeof wedding;
