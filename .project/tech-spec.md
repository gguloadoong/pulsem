# PulseM — 기술 명세서 (Tech Spec)

**버전:** 1.0.0
**최종 수정:** 2026-03-21

---

## 1. 시스템 아키텍처 개요

### 1.1 아키텍처 패턴

PulseM은 **Next.js 15 App Router 기반 풀스택 웹 애플리케이션**이다. React Server Components(RSC)를 최대한 활용하고, 실시간 데이터가 필요한 부분만 Client Component로 분리하는 하이브리드 아키텍처를 채택한다.

```
┌─────────────────────────────────────────────────────────┐
│                 클라이언트 (Browser)                      │
│   Next.js App (RSC + Client Components + Framer Motion) │
│   TanStack Query (서버 상태) + Zustand (클라이언트 상태)  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS / WebSocket
┌────────────────────▼────────────────────────────────────┐
│                  Vercel Edge Network                     │
│   Edge Functions + CDN + Image Optimization + Cron      │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
┌──────▼──────────┐         ┌─────────▼──────────────────┐
│  Next.js API    │         │       Supabase              │
│  Route Handlers │         │  - PostgreSQL (RLS 적용)    │
│  (서버 로직,     │         │  - Auth (GoTrue/OAuth)      │
│   외부 API 프록시)│         │  - Realtime (WebSocket)    │
└──────┬──────────┘         │  - Storage (아바타 등)      │
       │                    └────────────────────────────┘
┌──────▼───────────────────────────────────────────────┐
│                   외부 데이터 API                      │
│  한국투자증권 OpenAPI  업비트 WebSocket API             │
│  공공데이터포털 (부동산) 네이버 뉴스 검색 API           │
│  Alpha Vantage (글로벌 지수)                           │
└──────────────────────────────────────────────────────┘
```

### 1.2 렌더링 전략

| 페이지 / 컴포넌트 | 렌더링 방식 | 근거 |
|-----------------|------------|------|
| 메인 대시보드 레이아웃 | SSR | SEO + 초기 데이터 포함 |
| 시세 데이터 컴포넌트 | CSR + TanStack Query | 실시간 업데이트 필수 |
| 뉴스 피드 | ISR (5분 revalidate) | 자주 바뀌나 캐싱 가능 |
| 랜딩 / 로그인 페이지 | SSG | 정적 콘텐츠 |
| 프로필 / 게이미피케이션 | SSR | 인증 필요, 사용자별 데이터 |
| API Route Handlers | Serverless Edge Functions | 글로벌 분산, 낮은 지연 |

---

## 2. 기술 스택 상세

### 2.1 프론트엔드

| 기술 | 버전 | 역할 |
|------|------|------|
| Next.js | 15.x | 풀스택 프레임워크 (App Router) |
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안전성 (strict mode) |
| Tailwind CSS | 4.x | 유틸리티 퍼스트 스타일링 |
| Framer Motion | 11.x | 선언적 애니메이션 |
| TanStack Query | 5.x | 서버 상태 관리, 캐싱, 폴링 |
| Zustand | 5.x | 클라이언트 전역 상태 |
| React Hook Form | 7.x | 폼 상태 관리 |
| Zod | 3.x | 런타임 스키마 검증 |
| Lucide React | 최신 | 아이콘 라이브러리 |
| date-fns | 3.x | 날짜/시간 포매팅 |
| Recharts | 2.x | 기본 라인 차트, 파이 차트 |
| Lightweight Charts | 4.x | TradingView 스타일 캔들 차트 |
| Sonner | 최신 | 토스트 알림 |

### 2.2 백엔드 & 인프라

| 기술 | 역할 |
|------|------|
| Supabase | PostgreSQL + Auth + Realtime + Storage |
| Vercel | 배포 + Edge Functions + Analytics + Speed Insights |
| Upstash Redis | Rate limiting + 시세 캐싱 (Phase 2) |
| Resend | 트랜잭션 이메일 |

### 2.3 개발 도구

| 도구 | 역할 |
|------|------|
| pnpm | 패키지 매니저 (공간 효율, 빠른 설치) |
| ESLint + next/core-web-vitals | 코드 린팅 |
| Prettier | 코드 포매팅 |
| Husky + lint-staged | 커밋 전 자동 린팅/포매팅 |
| Vitest | 단위·통합 테스트 |
| Playwright | E2E 테스트 |
| Storybook | 컴포넌트 문서화 (Phase 2) |

---

## 3. 프로젝트 디렉토리 구조

```
pulsem/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 인증 라우트 그룹
│   │   │   ├── login/page.tsx
│   │   │   └── callback/route.ts     # OAuth 콜백
│   │   ├── (dashboard)/              # 메인 앱 라우트 그룹
│   │   │   ├── layout.tsx            # 사이드바 + 바텀탭 레이아웃
│   │   │   ├── page.tsx              # 대시보드 홈
│   │   │   ├── market/page.tsx       # 시장 페이지
│   │   │   ├── news/page.tsx         # 뉴스 피드
│   │   │   ├── quests/page.tsx       # 퀘스트
│   │   │   └── profile/page.tsx      # 프로필/게이미피케이션
│   │   ├── api/                      # Route Handlers
│   │   │   ├── auth/callback/route.ts
│   │   │   ├── market/
│   │   │   │   ├── stocks/route.ts
│   │   │   │   ├── stocks/[symbol]/route.ts
│   │   │   │   ├── crypto/route.ts
│   │   │   │   └── indices/route.ts
│   │   │   ├── news/
│   │   │   │   ├── feed/route.ts
│   │   │   │   └── search/route.ts
│   │   │   ├── gamification/
│   │   │   │   ├── checkin/route.ts
│   │   │   │   ├── quests/route.ts
│   │   │   │   └── xp/route.ts
│   │   │   ├── user/
│   │   │   │   ├── profile/route.ts
│   │   │   │   ├── watchlist/route.ts
│   │   │   │   └── portfolio/route.ts
│   │   │   └── webhooks/
│   │   │       └── cron/route.ts     # Vercel Cron Jobs
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── globals.css               # 글로벌 스타일 + CSS 변수
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                       # 기본 재사용 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Tabs.tsx
│   │   ├── features/
│   │   │   ├── market/
│   │   │   │   ├── StockCard.tsx
│   │   │   │   ├── IndexCard.tsx
│   │   │   │   ├── MarketTicker.tsx
│   │   │   │   ├── CandleChart.tsx   # dynamic import (CSR only)
│   │   │   │   └── SparkLine.tsx
│   │   │   ├── gamification/
│   │   │   │   ├── XPBar.tsx
│   │   │   │   ├── LevelBadge.tsx
│   │   │   │   ├── XPFloat.tsx       # 플로팅 +XP 텍스트
│   │   │   │   ├── BadgeCard.tsx
│   │   │   │   ├── BadgeCelebration.tsx
│   │   │   │   ├── QuestCard.tsx
│   │   │   │   └── StreakCounter.tsx
│   │   │   ├── news/
│   │   │   │   ├── NewsCard.tsx
│   │   │   │   ├── NewsFeed.tsx
│   │   │   │   └── NewsFilter.tsx
│   │   │   └── portfolio/
│   │   │       ├── PortfolioSummary.tsx
│   │   │       └── HoldingRow.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── BottomNav.tsx
│   │       ├── Header.tsx
│   │       └── PageWrapper.tsx
│   ├── hooks/
│   │   ├── useStockPrice.ts
│   │   ├── useCryptoPrice.ts
│   │   ├── useNewsFeed.ts
│   │   ├── useUserStats.ts
│   │   ├── useRealtimeXP.ts
│   │   └── useWatchlist.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # 브라우저 클라이언트
│   │   │   ├── server.ts             # 서버 클라이언트
│   │   │   └── middleware.ts         # Auth 미들웨어
│   │   ├── api/
│   │   │   ├── kis.ts               # 한국투자증권 클라이언트
│   │   │   ├── upbit.ts             # 업비트 REST 클라이언트
│   │   │   ├── upbit-ws.ts          # 업비트 WebSocket 클라이언트
│   │   │   ├── naver-news.ts        # 네이버 뉴스 클라이언트
│   │   │   └── public-data.ts       # 공공데이터포털 클라이언트
│   │   ├── gamification/
│   │   │   ├── xp.ts                # XP 부여 서버 함수
│   │   │   ├── quests.ts            # 퀘스트 로직
│   │   │   └── levels.ts            # 레벨 계산
│   │   ├── animations/
│   │   │   ├── transitions.ts       # 트랜지션 프리셋
│   │   │   └── variants.ts          # Framer Motion variants
│   │   └── utils/
│   │       ├── format.ts            # 숫자/날짜 포매팅
│   │       ├── cn.ts                # clsx + tailwind-merge
│   │       └── errors.ts            # 에러 처리 유틸
│   ├── store/
│   │   ├── userStore.ts             # 사용자/XP 전역 상태
│   │   ├── marketStore.ts           # 시세 전역 상태
│   │   └── uiStore.ts               # UI 상태 (모달, 탭 등)
│   ├── types/
│   │   ├── market.ts                # 시세 관련 타입
│   │   ├── gamification.ts          # XP, 뱃지, 퀘스트 타입
│   │   ├── news.ts                  # 뉴스 타입
│   │   ├── user.ts                  # 사용자 타입
│   │   └── supabase.ts              # Supabase 생성 타입
│   └── constants/
│       ├── levels.ts                # 레벨 XP 임계값
│       ├── badges.ts                # 뱃지 정의
│       └── routes.ts                # 라우트 상수
├── supabase/
│   ├── migrations/                  # 순서대로 실행될 SQL 마이그레이션
│   │   ├── 001_profiles.sql
│   │   ├── 002_gamification.sql
│   │   ├── 003_watchlist.sql
│   │   └── 004_news_bookmarks.sql
│   ├── functions/                   # Supabase Edge Functions
│   │   └── award-xp/index.ts
│   └── seed.sql                     # 개발용 시드 데이터
├── public/
│   ├── icons/                       # 커스텀 SVG 아이콘
│   └── images/
├── .project/                        # 프로젝트 문서
├── .env.example
├── next.config.ts
├── tailwind.config.ts               # Tailwind v4 설정
├── vitest.config.ts
└── playwright.config.ts
```

---

## 4. 데이터베이스 스키마

### 4.1 사용자 테이블

```sql
-- 사용자 프로필 (auth.users 확장)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    VARCHAR(20) NOT NULL UNIQUE
              CHECK (nickname ~ '^[가-힣a-zA-Z0-9_-]+$'),
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "프로필 공개 읽기"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "본인 프로필 수정"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "가입 시 프로필 생성" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### 4.2 게이미피케이션 테이블

```sql
-- XP / 레벨 통계
CREATE TABLE public.user_stats (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp      INTEGER      NOT NULL DEFAULT 0,
  current_level SMALLINT     NOT NULL DEFAULT 1,
  streak_days   SMALLINT     NOT NULL DEFAULT 0,
  last_checkin  DATE,
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- XP 트랜잭션 로그 (중복 방지 + 감사 추적)
CREATE TABLE public.xp_transactions (
  id            BIGSERIAL   PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id),
  amount        SMALLINT    NOT NULL,
  action_type   VARCHAR(50) NOT NULL,   -- 'checkin' | 'read_news' | 'quest_complete' 등
  action_ref_id TEXT,                   -- 뉴스 URL, 퀘스트 ID 등
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 일별 동일 액션 중복 방지
CREATE UNIQUE INDEX uq_xp_daily_action
  ON public.xp_transactions (user_id, action_type, action_ref_id, DATE(created_at))
  WHERE action_ref_id IS NOT NULL;

-- 뱃지 정의
CREATE TABLE public.badge_definitions (
  id              VARCHAR(50)  PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  description     TEXT         NOT NULL,
  icon_emoji      VARCHAR(10),
  rarity          VARCHAR(20)  NOT NULL DEFAULT 'common',
  xp_reward       SMALLINT     NOT NULL DEFAULT 0,
  condition_type  VARCHAR(50)  NOT NULL,   -- 'streak', 'news_count', 'login_count' 등
  condition_value INTEGER      NOT NULL
);

-- 사용자 획득 뱃지
CREATE TABLE public.user_badges (
  id        BIGSERIAL   PRIMARY KEY,
  user_id   UUID        NOT NULL REFERENCES auth.users(id),
  badge_id  VARCHAR(50) NOT NULL REFERENCES public.badge_definitions(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

-- 퀘스트 정의
CREATE TABLE public.quest_definitions (
  id           SERIAL       PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  action_type  VARCHAR(50)  NOT NULL,
  target_count SMALLINT     NOT NULL DEFAULT 1,
  xp_reward    SMALLINT     NOT NULL,
  is_active    BOOLEAN      NOT NULL DEFAULT true
);

-- 사용자 퀘스트 진행
CREATE TABLE public.user_quest_progress (
  id            BIGSERIAL   PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id),
  quest_id      INTEGER     NOT NULL REFERENCES public.quest_definitions(id),
  quest_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  current_count SMALLINT    NOT NULL DEFAULT 0,
  is_completed  BOOLEAN     NOT NULL DEFAULT false,
  completed_at  TIMESTAMPTZ,
  UNIQUE (user_id, quest_id, quest_date)
);
```

### 4.3 투자 데이터 테이블

```sql
-- 관심 종목
CREATE TABLE public.watchlist (
  id         BIGSERIAL   PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id),
  asset_type VARCHAR(20) NOT NULL,   -- 'stock' | 'crypto' | 'etf'
  symbol     VARCHAR(20) NOT NULL,
  name       VARCHAR(100),
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, asset_type, symbol)
);

-- 포트폴리오
CREATE TABLE public.portfolio (
  id         BIGSERIAL      PRIMARY KEY,
  user_id    UUID           NOT NULL REFERENCES auth.users(id),
  asset_type VARCHAR(20)    NOT NULL,
  symbol     VARCHAR(20)    NOT NULL,
  name       VARCHAR(100),
  quantity   NUMERIC(18, 8) NOT NULL,
  avg_price  NUMERIC(18, 4) NOT NULL,
  memo       TEXT,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, asset_type, symbol)
);

-- 알림 설정
CREATE TABLE public.notification_settings (
  user_id       UUID      PRIMARY KEY REFERENCES auth.users(id),
  keywords      TEXT[]    NOT NULL DEFAULT '{}',
  categories    TEXT[]    NOT NULL DEFAULT '{}',
  quiet_start   TIME,
  quiet_end     TIME,
  push_enabled  BOOLEAN   NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.4 핵심 Database Function

```sql
-- XP 부여 (서버사이드에서만 SECURITY DEFINER로 호출)
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id     UUID,
  p_amount      SMALLINT,
  p_action_type VARCHAR(50),
  p_action_ref  TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_new_xp     INTEGER;
  v_new_level  SMALLINT;
BEGIN
  -- 중복 체크
  IF p_action_ref IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.xp_transactions
    WHERE user_id = p_user_id
      AND action_type = p_action_type
      AND action_ref_id = p_action_ref
      AND DATE(created_at) = CURRENT_DATE
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'duplicate');
  END IF;

  INSERT INTO public.xp_transactions (user_id, amount, action_type, action_ref_id)
  VALUES (p_user_id, p_amount, p_action_type, p_action_ref);

  UPDATE public.user_stats
  SET total_xp = total_xp + p_amount, updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING total_xp INTO v_new_xp;

  v_new_level := CASE
    WHEN v_new_xp >= 100000 THEN 10
    WHEN v_new_xp >=  60000 THEN  9
    WHEN v_new_xp >=  35000 THEN  8
    WHEN v_new_xp >=  20000 THEN  7
    WHEN v_new_xp >=  12000 THEN  6
    WHEN v_new_xp >=   7000 THEN  5
    WHEN v_new_xp >=   3500 THEN  4
    WHEN v_new_xp >=   1500 THEN  3
    WHEN v_new_xp >=    500 THEN  2
    ELSE 1
  END;

  UPDATE public.user_stats
  SET current_level = v_new_level
  WHERE user_id = p_user_id AND current_level < v_new_level;

  RETURN jsonb_build_object(
    'success', true,
    'xp_awarded', p_amount,
    'total_xp', v_new_xp,
    'new_level', v_new_level
  );
END;
$$;
```

---

## 5. 실시간 데이터 처리

### 5.1 업비트 코인 WebSocket

```typescript
// src/lib/api/upbit-ws.ts
const UPBIT_WS_URL = 'wss://api.upbit.com/websocket/v1';

class UpbitWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnects = 3;
  private subscribers = new Map<string, Set<(data: TickerData) => void>>();

  connect(symbols: string[]): void {
    this.ws = new WebSocket(UPBIT_WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.ws!.send(JSON.stringify([
        { ticket: crypto.randomUUID() },
        { type: 'ticker', codes: symbols.map(s => `KRW-${s}`) },
      ]));
    };

    this.ws.onmessage = async (event) => {
      const buf = await (event.data as Blob).arrayBuffer();
      const data = JSON.parse(new TextDecoder().decode(buf)) as TickerData;
      this.notify(data.code.replace('KRW-', ''), data);
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnects) {
        setTimeout(
          () => this.connect(symbols),
          1500 * ++this.reconnectAttempts,
        );
      }
    };
  }

  subscribe(symbol: string, cb: (d: TickerData) => void): () => void {
    if (!this.subscribers.has(symbol)) this.subscribers.set(symbol, new Set());
    this.subscribers.get(symbol)!.add(cb);
    return () => this.subscribers.get(symbol)?.delete(cb);
  }

  private notify(symbol: string, data: TickerData): void {
    this.subscribers.get(symbol)?.forEach(cb => cb(data));
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}

export const upbitWS = new UpbitWebSocketClient();
```

### 5.2 주식 시세 폴링 (TanStack Query)

```typescript
// src/hooks/useStockPrice.ts
export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ['stock', 'price', symbol],
    queryFn:  () => fetchStockPrice(symbol),  // /api/market/stocks/{symbol}
    staleTime:       25_000,  // 25초
    refetchInterval: 30_000,  // 30초 폴링
    enabled: !!symbol,
  });
}
```

### 5.3 Supabase Realtime (XP 실시간 반영)

```typescript
// src/hooks/useRealtimeXP.ts
export function useRealtimeXP(userId: string) {
  const updateXP = useUserStore(s => s.updateXP);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`user-stats:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        updateXP(payload.new.total_xp, payload.new.current_level);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, updateXP, supabase]);
}
```

---

## 6. 캐싱 전략

### 6.1 TanStack Query 캐싱 정책

| 데이터 | staleTime | gcTime | refetchInterval |
|--------|-----------|--------|-----------------|
| 주식 시세 | 25초 | 5분 | 30초 |
| 코인 시세 | WebSocket 실시간 | - | - |
| 주요 지수 | 25초 | 5분 | 30초 |
| 뉴스 피드 | 3분 | 10분 | 5분 |
| 관심 종목 목록 | 1분 | 10분 | 없음 |
| 사용자 프로필 | 5분 | 30분 | 없음 |
| 주간 랭킹 | 1분 | 5분 | 1분 |

### 6.2 Next.js 라우트 캐싱

```typescript
// 뉴스 피드 (5분 ISR)
export const revalidate = 300;

// 종목 상세 (30초 ISR)
export const revalidate = 30;

// 사용자별 데이터 (캐시 없음)
export const dynamic = 'force-dynamic';
```

### 6.3 API 응답 HTTP 캐싱 (Edge)

```typescript
// /api/market/indices — 지수 데이터 (30초 Edge 캐시)
export const runtime = 'edge';
return NextResponse.json(data, {
  headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
});

// /api/news/feed — 뉴스 (5분 캐시)
headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' }
```

---

## 7. 보안 구현

### 7.1 미들웨어 인증 체크

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/profile', '/api/gamification', '/api/user'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie 헬퍼 */ } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isProtected = PROTECTED_PREFIXES.some(p =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 7.2 Zod 입력 검증 패턴

```typescript
// 모든 Route Handler에 적용
const WatchlistAddSchema = z.object({
  symbol:     z.string().min(1).max(20).regex(/^[A-Z0-9]+$/),
  asset_type: z.enum(['stock', 'crypto', 'etf']),
  name:       z.string().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const parsed = WatchlistAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: '입력값이 올바르지 않습니다.' } },
      { status: 400 },
    );
  }
  // ...
}
```

### 7.3 Rate Limiting (Upstash Redis)

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimits = {
  // 일반 API: 분당 60회
  default: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, '1 m'),
  }),
  // 게이미피케이션 API: 분당 10회 (XP 어뷰징 방지)
  gamification: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
  }),
};
```

---

## 8. 에러 처리

### 8.1 에러 계층 및 HTTP 상태코드

| 상황 | HTTP 코드 | 에러 코드 |
|------|----------|---------|
| Zod 검증 실패 | 400 | `VALIDATION_ERROR` |
| 미인증 | 401 | `UNAUTHORIZED` |
| RLS 위반 / 권한 없음 | 403 | `FORBIDDEN` |
| 리소스 없음 | 404 | `NOT_FOUND` |
| 중복 XP (중복 액션) | 409 | `DUPLICATE_ACTION` |
| Rate limit 초과 | 429 | `RATE_LIMITED` |
| 외부 API 오류 | 502 | `UPSTREAM_ERROR` |
| 서버 에러 | 500 | `INTERNAL_ERROR` |

### 8.2 외부 API 폴백 전략

```typescript
export async function fetchStockPrice(symbol: string): Promise<StockQuote> {
  try {
    const data = await kisApi.getQuote(symbol);
    await redis.setex(`stock:${symbol}`, 60, JSON.stringify(data));
    return data;
  } catch {
    const cached = await redis.get<StockQuote>(`stock:${symbol}`);
    if (cached) return { ...cached, isStale: true };
    throw new ApiError('UPSTREAM_ERROR', '시세 데이터를 일시적으로 사용할 수 없습니다.');
  }
}
```

### 8.3 클라이언트 에러 바운더리

- `src/app/error.tsx` — 라우트별 에러 UI
- `src/app/global-error.tsx` — 루트 에러 폴백
- Sonner `toast.error()` — API 에러 알림
- TanStack Query `onError` 콜백 — 쿼리 에러 토스트

---

## 9. 성능 최적화

### 9.1 번들 최적화

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: {
    ppr: true,               // Partial Pre-Rendering (Next.js 15)
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { hostname: 'static.upbit.com' },
      { hostname: 'assets.coingecko.com' },
    ],
  },
};
```

### 9.2 Dynamic Import

```typescript
// 무거운 차트 컴포넌트 — CSR only, lazy load
const CandleChart = dynamic(
  () => import('@/components/features/market/CandleChart'),
  { loading: () => <ChartSkeleton />, ssr: false },
);

// 뱃지 축하 오버레이 — 필요할 때만
const BadgeCelebration = dynamic(
  () => import('@/components/features/gamification/BadgeCelebration'),
  { ssr: false },
);
```

### 9.3 목록 가상화

업비트 코인 (200+종목), KRX 주식 (3000+종목) 목록은 `@tanstack/virtual` 로 가상화 처리하여 DOM 노드 수 최소화.

---

## 10. CI/CD 파이프라인

### 10.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test --run
      - run: pnpm build
```

### 10.2 Vercel 배포 설정

```json
// vercel.json
{
  "crons": [
    { "path": "/api/webhooks/cron", "schedule": "0 21 * * *" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 10.3 환경별 구성

| 환경 | 브랜치 | Supabase | 비고 |
|------|--------|---------|------|
| development | 로컬 | `supabase start` 로컬 인스턴스 | Mock 데이터 지원 |
| preview | feature/* | 스테이징 프로젝트 | PR Preview URL |
| production | main | 프로덕션 프로젝트 | 실제 외부 API |

---

## 11. 모니터링

| 도구 | 지표 |
|------|------|
| Vercel Analytics | 페이지별 LCP, FID, CLS |
| Vercel Speed Insights | 실 사용자 Web Vitals |
| Supabase Dashboard | DB 쿼리 성능, API 사용량 |
| UptimeRobot | 5분 간격 가용성 체크 |
| Sentry (Phase 2) | 에러 추적, 알림 |

**성능 목표:**

| 지표 | 목표 |
|------|------|
| LCP | < 2.5초 |
| FID | < 100ms |
| CLS | < 0.1 |
| 초기 번들 크기 | < 200KB gzip |
| API 응답 (P95) | < 500ms |
| 가용성 | 99.5% |
