// ── 시장 데이터 (Mock) ──────────────────────────────────────────

export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  category: "stock" | "crypto" | "realestate";
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sparkline: number[];
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: "regulation" | "market" | "analysis" | "breaking";
  source: string;
  timeAgo: string;
  impact: "high" | "medium" | "low";
  relatedAssets: string[];
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  totalCheckins: number;
  badges: Badge[];
  rank: string;
  rankIcon: string;
  weeklyXp: number[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  type: "daily" | "weekly" | "achievement";
  icon: string;
}

export const marketData: MarketItem[] = [
  {
    id: "samsung",
    name: "삼성전자",
    symbol: "005930",
    category: "stock",
    price: 82400,
    change: 1200,
    changePercent: 1.48,
    volume: "14.2M",
    sparkline: [80200, 80800, 81100, 80600, 81500, 82000, 82400],
    icon: "📱",
  },
  {
    id: "sk-hynix",
    name: "SK하이닉스",
    symbol: "000660",
    category: "stock",
    price: 178500,
    change: -2300,
    changePercent: -1.27,
    volume: "5.8M",
    sparkline: [182000, 181200, 180500, 179800, 179000, 178800, 178500],
    icon: "💾",
  },
  {
    id: "naver",
    name: "NAVER",
    symbol: "035420",
    category: "stock",
    price: 214000,
    change: 3500,
    changePercent: 1.66,
    volume: "2.1M",
    sparkline: [209000, 210500, 211000, 212500, 213000, 213500, 214000],
    icon: "🟢",
  },
  {
    id: "btc",
    name: "비트코인",
    symbol: "BTC",
    category: "crypto",
    price: 134250000,
    change: 2150000,
    changePercent: 1.63,
    volume: "₩2.8T",
    sparkline: [131000000, 131500000, 132000000, 133000000, 133500000, 134000000, 134250000],
    icon: "₿",
  },
  {
    id: "eth",
    name: "이더리움",
    symbol: "ETH",
    category: "crypto",
    price: 4820000,
    change: -65000,
    changePercent: -1.33,
    volume: "₩1.2T",
    sparkline: [4900000, 4880000, 4860000, 4850000, 4840000, 4830000, 4820000],
    icon: "⟠",
  },
  {
    id: "sol",
    name: "솔라나",
    symbol: "SOL",
    category: "crypto",
    price: 245000,
    change: 12500,
    changePercent: 5.38,
    volume: "₩890B",
    sparkline: [228000, 230000, 235000, 238000, 240000, 243000, 245000],
    icon: "◎",
  },
  {
    id: "gangnam-apt",
    name: "강남구 아파트",
    symbol: "GANGNAM",
    category: "realestate",
    price: 2450000000,
    change: 25000000,
    changePercent: 1.03,
    volume: "142건",
    sparkline: [2400, 2410, 2420, 2430, 2435, 2440, 2450],
    icon: "🏢",
  },
  {
    id: "songpa-apt",
    name: "송파구 아파트",
    symbol: "SONGPA",
    category: "realestate",
    price: 1850000000,
    change: -15000000,
    changePercent: -0.8,
    volume: "98건",
    sparkline: [1870, 1865, 1860, 1858, 1855, 1852, 1850],
    icon: "🏠",
  },
];

export const newsData: NewsItem[] = [
  {
    id: "n1",
    title: "금융위, 가상자산 과세 2027년까지 재유예 검토",
    summary: "금융위원회가 가상자산 소득에 대한 과세를 당초 2026년에서 2027년으로 추가 유예하는 방안을 검토 중입니다.",
    category: "regulation",
    source: "한국경제",
    timeAgo: "12분 전",
    impact: "high",
    relatedAssets: ["BTC", "ETH", "SOL"],
  },
  {
    id: "n2",
    title: "삼성전자, AI 반도체 HBM4 양산 6개월 앞당긴다",
    summary: "삼성전자가 차세대 고대역폭메모리 HBM4의 양산 시점을 기존 계획보다 6개월 앞당겨 하반기 중 양산에 돌입합니다.",
    category: "breaking",
    source: "매일경제",
    timeAgo: "28분 전",
    impact: "high",
    relatedAssets: ["005930", "000660"],
  },
  {
    id: "n3",
    title: "서울 아파트 매매가 15주 연속 상승… 강남 3구 주도",
    summary: "서울 아파트 매매가격이 15주 연속 상승세를 이어가고 있으며, 강남·서초·송파 3구가 상승을 주도하고 있습니다.",
    category: "market",
    source: "조선일보",
    timeAgo: "1시간 전",
    impact: "medium",
    relatedAssets: ["GANGNAM", "SONGPA"],
  },
  {
    id: "n4",
    title: "美 Fed 금리 동결… 하반기 2회 인하 시사",
    summary: "미국 연방준비제도가 기준금리를 동결하면서도 하반기 중 2회 인하를 시사해 글로벌 증시에 호재로 작용할 전망입니다.",
    category: "market",
    source: "Bloomberg",
    timeAgo: "2시간 전",
    impact: "high",
    relatedAssets: ["005930", "BTC", "035420"],
  },
  {
    id: "n5",
    title: "국토부, 수도권 그린벨트 해제 추가 검토 지역 발표",
    summary: "국토교통부가 수도권 그린벨트 해제를 추가로 검토할 지역 목록을 발표했습니다. 신규 택지 공급 확대 기대.",
    category: "regulation",
    source: "연합뉴스",
    timeAgo: "3시간 전",
    impact: "medium",
    relatedAssets: ["GANGNAM", "SONGPA"],
  },
  {
    id: "n6",
    title: "솔라나 기반 DEX 거래량 이더리움 추월… 역대 최고치",
    summary: "솔라나 네트워크의 탈중앙화 거래소(DEX) 일일 거래량이 이더리움을 추월하며 역대 최고치를 기록했습니다.",
    category: "analysis",
    source: "코인데스크",
    timeAgo: "4시간 전",
    impact: "medium",
    relatedAssets: ["SOL", "ETH"],
  },
];

export const userStats: UserStats = {
  level: 12,
  xp: 2840,
  xpToNext: 3500,
  streak: 7,
  totalCheckins: 45,
  rank: "실버 트레이더",
  rankIcon: "🥈",
  weeklyXp: [120, 200, 180, 350, 280, 420, 310],
  badges: [
    { id: "b1", name: "첫 출석", icon: "🌟", description: "첫 번째 출석 체크인", earned: true, earnedDate: "2026-03-14" },
    { id: "b2", name: "7일 연속", icon: "🔥", description: "7일 연속 출석 달성", earned: true, earnedDate: "2026-03-21" },
    { id: "b3", name: "뉴스헌터", icon: "📰", description: "뉴스 100개 읽기", earned: true, earnedDate: "2026-03-18" },
    { id: "b4", name: "분석왕", icon: "📊", description: "시장 분석 50회 확인", earned: false },
    { id: "b5", name: "얼리버드", icon: "🐦", description: "오전 7시 이전 출석 10회", earned: false },
    { id: "b6", name: "풀하우스", icon: "🃏", description: "주식·코인·부동산 모두 관심 등록", earned: true, earnedDate: "2026-03-16" },
    { id: "b7", name: "30일 연속", icon: "💎", description: "30일 연속 출석 달성", earned: false },
    { id: "b8", name: "트렌드세터", icon: "🚀", description: "급등 종목 3개 사전 포착", earned: false },
  ],
};

export const quests: Quest[] = [
  { id: "q1", title: "오늘의 뉴스 3개 읽기", description: "투자 관련 뉴스를 3개 이상 확인하세요", xpReward: 50, progress: 1, total: 3, type: "daily", icon: "📰" },
  { id: "q2", title: "관심 종목 확인하기", description: "등록된 관심 종목의 변동을 확인하세요", xpReward: 30, progress: 0, total: 1, type: "daily", icon: "👀" },
  { id: "q3", title: "출석 체크인", description: "오늘의 출석 체크인을 완료하세요", xpReward: 20, progress: 1, total: 1, type: "daily", icon: "✅" },
  { id: "q4", title: "주간 시장 리포트 확인", description: "이번 주 시장 동향 리포트를 확인하세요", xpReward: 150, progress: 3, total: 5, type: "weekly", icon: "📈" },
  { id: "q5", title: "3개 카테고리 탐색", description: "주식·코인·부동산 모두 확인하기", xpReward: 100, progress: 2, total: 3, type: "weekly", icon: "🔍" },
];

export const formatPrice = (price: number, category: string): string => {
  if (category === "realestate") {
    const billions = price / 100000000;
    return `${billions.toFixed(0)}억`;
  }
  if (category === "crypto" && price >= 1000000) {
    return `₩${(price / 10000).toFixed(0)}만`;
  }
  return price.toLocaleString("ko-KR");
};

export const formatChange = (change: number, category: string): string => {
  const sign = change >= 0 ? "+" : "";
  if (category === "realestate") {
    const millions = change / 10000;
    return `${sign}${millions.toFixed(0)}만`;
  }
  if (category === "crypto" && Math.abs(change) >= 10000) {
    return `${sign}${(change / 10000).toFixed(1)}만`;
  }
  return `${sign}${change.toLocaleString("ko-KR")}`;
};
