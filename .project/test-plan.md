# PulseM — 테스트 계획

**버전:** 1.0.0
**최종 수정:** 2026-03-21

---

## 1. 테스트 전략 개요

### 1.1 테스트 피라미드

```
         ┌─────────────────┐
         │   E2E (소수)    │  Playwright — 핵심 사용자 플로우
         ├─────────────────┤
         │   통합 테스트    │  Vitest + Supabase 로컬
         ├─────────────────┤
         │   단위 테스트    │  Vitest — 유틸, 훅, 순수 로직
         ├─────────────────┤
         │   정적 분석      │  TypeScript strict + ESLint
         └─────────────────┘
```

### 1.2 도구 및 범위

| 테스트 유형 | 도구 | 범위 | 목표 커버리지 |
|-----------|------|------|-------------|
| 정적 분석 | TypeScript 5 strict + ESLint | 전체 코드 | 100% (빌드 통과) |
| 단위 테스트 | Vitest + Testing Library | 유틸 함수, 게이미피케이션 로직 | 80%+ |
| 컴포넌트 테스트 | Vitest + React Testing Library | 핵심 UI 컴포넌트 | 주요 컴포넌트 |
| 통합 테스트 | Vitest + Supabase 로컬 | API Route Handlers | 모든 엔드포인트 |
| E2E 테스트 | Playwright | 핵심 사용자 플로우 5개 | - |
| 성능 테스트 | Lighthouse CI | Core Web Vitals | LCP < 2.5s |
| 접근성 테스트 | axe-core + Playwright | 모든 페이지 | WCAG AA |
| 보안 테스트 | 수동 + npm audit | XP 어뷰징, XSS, CSRF | - |

---

## 2. 단위 테스트

### 2.1 유틸리티 함수 테스트

```typescript
// src/lib/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import {
  formatKRW,
  formatChangeRate,
  formatVolume,
  formatRelativeTime,
} from '@/lib/utils/format';

describe('formatKRW', () => {
  it('양수 금액을 올바르게 포매팅한다', () => {
    expect(formatKRW(72800)).toBe('72,800원');
    expect(formatKRW(1234567890)).toBe('1,234,567,890원');
  });

  it('소수점 가격을 올바르게 처리한다 (코인)', () => {
    expect(formatKRW(0.0045, { decimals: 4 })).toBe('0.0045원');
    expect(formatKRW(124500000)).toBe('124,500,000원');
  });

  it('0원을 처리한다', () => {
    expect(formatKRW(0)).toBe('0원');
  });
});

describe('formatChangeRate', () => {
  it('양수 등락률에 + 기호를 붙인다', () => {
    expect(formatChangeRate(1.68)).toBe('+1.68%');
  });

  it('음수 등락률은 - 기호만 유지한다', () => {
    expect(formatChangeRate(-1.73)).toBe('-1.73%');
  });

  it('0%를 처리한다', () => {
    expect(formatChangeRate(0)).toBe('0.00%');
  });
});

describe('formatVolume', () => {
  it('억 단위를 변환한다', () => {
    expect(formatVolume(1234567890)).toBe('12.3억');
  });

  it('조 단위를 변환한다', () => {
    expect(formatVolume(12345678900000)).toBe('12.3조');
  });
});

describe('formatRelativeTime', () => {
  it('1분 이내는 "방금 전"을 반환한다', () => {
    const now = new Date();
    const thirtySecsAgo = new Date(now.getTime() - 30_000);
    expect(formatRelativeTime(thirtySecsAgo.toISOString())).toBe('방금 전');
  });

  it('1시간 이내는 N분 전을 반환한다', () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60_000);
    expect(formatRelativeTime(fiveMinsAgo.toISOString())).toBe('5분 전');
  });
});
```

### 2.2 게이미피케이션 로직 테스트

```typescript
// src/lib/gamification/__tests__/levels.test.ts
import { describe, it, expect } from 'vitest';
import { getLevelFromXP, getLevelName, getXPForNextLevel } from '@/lib/gamification/levels';

describe('getLevelFromXP', () => {
  it.each([
    [0, 1],
    [499, 1],
    [500, 2],
    [1499, 2],
    [1500, 3],
    [99999, 9],
    [100000, 10],
    [200000, 10],  // 최대 레벨 초과 시 10 유지
  ])('XP %i → 레벨 %i', (xp, expectedLevel) => {
    expect(getLevelFromXP(xp)).toBe(expectedLevel);
  });
});

describe('getXPForNextLevel', () => {
  it('레벨 9에서 다음 레벨까지 필요 XP를 반환한다', () => {
    expect(getXPForNextLevel(9, 60000)).toBe(40000);
  });

  it('최대 레벨(10)에서는 0을 반환한다', () => {
    expect(getXPForNextLevel(10, 100000)).toBe(0);
  });
});

describe('getLevelName', () => {
  it.each([
    [1, '투자 입문자'],
    [5, '트렌드 분석가'],
    [10, 'PulseM 마스터'],
  ])('레벨 %i → 이름 %s', (level, name) => {
    expect(getLevelName(level)).toBe(name);
  });
});
```

### 2.3 뉴스 분류 로직 테스트

```typescript
// src/lib/news/__tests__/classifier.test.ts
import { describe, it, expect } from 'vitest';
import { classifyNewsImpact } from '@/lib/news/classifier';

describe('classifyNewsImpact', () => {
  it('기준금리 관련 뉴스는 urgent를 반환한다', () => {
    expect(classifyNewsImpact('한국은행, 기준금리 0.25%p 인상', '한국은행')).toBe('urgent');
  });

  it('금융위원회 뉴스는 major를 반환한다', () => {
    expect(classifyNewsImpact('금융위원회, ETF 규제 완화 방안 발표', '금융위원회')).toBe('major');
  });

  it('일반 주식 뉴스는 normal을 반환한다', () => {
    expect(classifyNewsImpact('삼성전자 3분기 실적 호조', '조선일보')).toBe('normal');
  });
});
```

### 2.4 데이터 검증 유틸 테스트

```typescript
// src/lib/utils/__tests__/validate-market-data.test.ts
import { describe, it, expect } from 'vitest';
import { isValidStockPrice, isValidCryptoPrice } from '@/lib/utils/validate-market-data';

describe('isValidStockPrice', () => {
  it('전일 대비 30% 이내 변동은 유효하다', () => {
    expect(isValidStockPrice(72800, 70000)).toBe(true);  // 4% 상승
  });

  it('30% 초과 변동은 의심 데이터로 처리한다', () => {
    expect(isValidStockPrice(100000, 70000)).toBe(false);  // 42.8% 상승
  });

  it('0 이하 가격은 무효다', () => {
    expect(isValidStockPrice(0, 70000)).toBe(false);
    expect(isValidStockPrice(-1, 70000)).toBe(false);
  });
});
```

---

## 3. 컴포넌트 테스트

### 3.1 XP 진행바 컴포넌트

```typescript
// src/components/features/gamification/__tests__/XPBar.test.tsx
import { render, screen } from '@testing-library/react';
import { XPBar } from '../XPBar';

describe('XPBar', () => {
  it('현재 XP와 다음 레벨 XP를 올바르게 표시한다', () => {
    render(<XPBar currentXP={1520} currentLevel={3} />);
    expect(screen.getByText(/1,520/)).toBeInTheDocument();
    expect(screen.getByText(/3,500/)).toBeInTheDocument();  // 레벨 4 임계값
  });

  it('진행바의 width가 퍼센트에 따라 올바르게 설정된다', () => {
    render(<XPBar currentXP={2000} currentLevel={3} />);
    // 레벨 3: 1500~3500, (2000-1500)/(3500-1500) = 25%
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '25%' });
  });

  it('최대 레벨(10)에서는 "MAX LEVEL" 텍스트를 표시한다', () => {
    render(<XPBar currentXP={100000} currentLevel={10} />);
    expect(screen.getByText('MAX LEVEL')).toBeInTheDocument();
  });
});
```

### 3.2 종목 카드 컴포넌트

```typescript
// src/components/features/market/__tests__/StockCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StockCard } from '../StockCard';
import type { StockQuote } from '@/types/market';

const mockStock: StockQuote = {
  symbol: '005930', name: '삼성전자', market: 'KOSPI',
  currentPrice: 72800, change: 1200, changeRate: 1.68,
  direction: 'rise', volume: 12345678, marketCap: 434560000000000,
};

describe('StockCard', () => {
  it('종목명과 현재가를 표시한다', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('삼성전자')).toBeInTheDocument();
    expect(screen.getByText('72,800원')).toBeInTheDocument();
  });

  it('상승 시 빨간색 텍스트를 적용한다', () => {
    render(<StockCard stock={mockStock} />);
    const changeText = screen.getByText('+1.68%');
    expect(changeText).toHaveClass('text-rise');
  });

  it('하락 시 파란색 텍스트를 적용한다', () => {
    const fallingStock = { ...mockStock, direction: 'fall' as const, change: -1200, changeRate: -1.73 };
    render(<StockCard stock={fallingStock} />);
    const changeText = screen.getByText('-1.73%');
    expect(changeText).toHaveClass('text-fall');
  });
});
```

### 3.3 퀘스트 카드 컴포넌트

```typescript
// src/components/features/gamification/__tests__/QuestCard.test.tsx
import { render, screen } from '@testing-library/react';
import { QuestCard } from '../QuestCard';

describe('QuestCard', () => {
  const baseQuest = {
    id: 1, title: '규제 뉴스 2건 읽기',
    description: '규제/정책 뉴스를 2건 읽으세요',
    action_type: 'read_regulation_news', xp_reward: 80,
    target_count: 2, current_count: 1,
    is_completed: false, completed_at: null,
  };

  it('퀘스트 제목과 XP 보상을 표시한다', () => {
    render(<QuestCard quest={baseQuest} />);
    expect(screen.getByText('규제 뉴스 2건 읽기')).toBeInTheDocument();
    expect(screen.getByText('+80 XP')).toBeInTheDocument();
  });

  it('진행률을 올바르게 표시한다 (1/2 = 50%)', () => {
    render(<QuestCard quest={baseQuest} />);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('완료 시 체크마크를 표시한다', () => {
    const completedQuest = { ...baseQuest, is_completed: true, current_count: 2, completed_at: new Date().toISOString() };
    render(<QuestCard quest={completedQuest} />);
    expect(screen.getByRole('img', { name: '완료' })).toBeInTheDocument();
  });
});
```

---

## 4. API 통합 테스트

### 4.1 출석 체크인 API

```typescript
// src/app/api/gamification/checkin/__tests__/route.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../route';

describe('POST /api/gamification/checkin', () => {
  it('인증되지 않은 요청은 401을 반환한다', async () => {
    const req = new Request('http://localhost/api/gamification/checkin', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('오늘 첫 체크인 시 XP를 지급하고 streak을 업데이트한다', async () => {
    // Mock Supabase auth + DB
    // ...
    const res = await POST(authenticatedReq);
    const body = await res.json();
    expect(body.data.xp_awarded).toBe(10);
    expect(body.data.already_checked).toBe(false);
  });

  it('오늘 두 번째 체크인 시 already_checked: true를 반환한다', async () => {
    // ...
    const body = await res.json();
    expect(body.data.already_checked).toBe(true);
    expect(body.data.xp_awarded).toBe(0);
  });
});
```

### 4.2 관심 종목 추가 API

```typescript
// src/app/api/user/watchlist/__tests__/route.test.ts
describe('POST /api/user/watchlist', () => {
  it('유효한 종목을 추가한다', async () => {
    const res = await POST(req, { body: { symbol: '005930', asset_type: 'stock', name: '삼성전자' } });
    expect(res.status).toBe(201);
  });

  it('잘못된 symbol 형식은 400을 반환한다', async () => {
    const res = await POST(req, { body: { symbol: 'invalid!', asset_type: 'stock' } });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('50개 초과 시 400을 반환한다', async () => {
    // 이미 50개 등록된 상태에서 추가 시도
    const res = await POST(req, { body: { symbol: '000660', asset_type: 'stock' } });
    expect(res.status).toBe(400);
    expect(body.error.code).toBe('LIMIT_EXCEEDED');
  });

  it('중복 종목 추가 시 409를 반환한다', async () => {
    const res = await POST(req, { body: { symbol: '005930', asset_type: 'stock' } });
    expect(res.status).toBe(409);
  });
});
```

---

## 5. E2E 테스트 (Playwright)

### 5.1 테스트 환경 설정

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.2 핵심 E2E 시나리오

#### E2E-001: 신규 가입 → 온보딩 → 대시보드 진입

```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('신규 사용자 온보딩 플로우', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/login');

  // 구글 로그인 버튼 확인
  await expect(page.getByRole('button', { name: /구글로 시작하기/ })).toBeVisible();

  // 테스트용 이메일 로그인 (E2E용 테스트 계정)
  await page.getByRole('link', { name: /이메일로 계속/ }).click();
  await page.fill('[name=email]', 'test@pulsem.app');
  await page.fill('[name=password]', process.env.E2E_TEST_PASSWORD!);
  await page.getByRole('button', { name: '로그인' }).click();

  // 온보딩 — 닉네임 설정
  await expect(page).toHaveURL('/onboarding/nickname');
  await page.fill('[name=nickname]', `테스터${Date.now()}`);
  await page.getByRole('button', { name: '다음' }).click();

  // 온보딩 — 관심 자산 선택
  await expect(page).toHaveURL('/onboarding/interests');
  await page.getByLabel('국내주식').click();
  await page.getByLabel('코인').click();
  await page.getByRole('button', { name: '시작하기' }).click();

  // 대시보드 진입 확인
  await expect(page).toHaveURL('/');
  await expect(page.getByText('웰컴 보너스')).toBeVisible();  // +50 XP 웰컴 토스트
  await expect(page.getByText('코스피')).toBeVisible();
});
```

#### E2E-002: 출석 체크인 → XP 획득 → 스트릭 증가

```typescript
// e2e/checkin.spec.ts
test('일일 출석 체크인 플로우', async ({ page, context }) => {
  await loginAsTestUser(page);
  await page.goto('/');

  // 출석 체크인 버튼 확인
  const checkinCard = page.getByTestId('checkin-card');
  await expect(checkinCard).toBeVisible();

  // 오늘 첫 체크인인지 확인 (체크인 버튼이 활성화)
  const checkinButton = checkinCard.getByRole('button', { name: /출석 체크/ });
  await expect(checkinButton).toBeEnabled();
  await checkinButton.click();

  // XP 플로팅 텍스트 확인
  await expect(page.getByText('+10 XP')).toBeVisible();

  // 스트릭 카운터 업데이트 확인
  const streakText = page.getByTestId('streak-counter');
  await expect(streakText).toContainText('일 연속');

  // 재클릭 시 "이미 체크인" 메시지
  await checkinButton.click();
  await expect(page.getByText(/이미 오늘 출석/)).toBeVisible();
});
```

#### E2E-003: 시세 조회 → 관심 종목 추가

```typescript
// e2e/watchlist.spec.ts
test('종목 검색 후 관심 종목 추가', async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto('/market');

  // 국내주식 탭
  await page.getByRole('tab', { name: '국내주식' }).click();

  // 검색
  await page.getByPlaceholder(/종목 검색/).fill('삼성전자');
  await expect(page.getByText('삼성전자')).toBeVisible();

  // 관심 종목 추가
  const card = page.getByTestId('stock-card-005930');
  await card.getByRole('button', { name: /관심 추가/ }).click();

  // 성공 토스트 확인
  await expect(page.getByText('관심 종목에 추가되었습니다.')).toBeVisible();

  // 관심 종목 목록에서 확인
  await page.goto('/profile');
  await expect(page.getByText('삼성전자')).toBeVisible();
});
```

#### E2E-004: 뉴스 읽기 → XP 획득 → 퀘스트 진행

```typescript
// e2e/news-quest.spec.ts
test('뉴스 읽기로 XP 획득 및 퀘스트 진행', async ({ page }) => {
  await loginAsTestUser(page);

  // 현재 XP 확인
  const initialXP = await page.getByTestId('total-xp').textContent();

  // 뉴스 페이지 이동
  await page.goto('/news');
  await expect(page.getByTestId('news-feed')).toBeVisible();

  // 뉴스 카드 클릭 (외부 링크 — 새 탭 처리)
  const newsCard = page.getByTestId('news-card').first();
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    newsCard.click(),
  ]);
  await newPage.close();

  // XP 증가 확인 (+5 XP)
  await page.goto('/');
  const newXP = await page.getByTestId('total-xp').textContent();
  expect(parseInt(newXP ?? '0')).toBeGreaterThan(parseInt(initialXP ?? '0'));

  // 퀘스트 진행률 업데이트 확인
  const questCard = page.getByTestId('quest-read-news');
  await expect(questCard).toBeVisible();
});
```

#### E2E-005: 바텀 탭 내비게이션 (모바일)

```typescript
// e2e/navigation.mobile.spec.ts
test('모바일 바텀 탭 내비게이션', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await loginAsTestUser(page);

  const tabs = [
    { name: '홈', url: '/', content: '코스피' },
    { name: '시장', url: '/market', content: '국내주식' },
    { name: '뉴스', url: '/news', content: '뉴스 피드' },
    { name: '퀘스트', url: '/quests', content: '오늘의 퀘스트' },
    { name: '프로필', url: '/profile', content: '레벨' },
  ];

  for (const tab of tabs) {
    await page.getByRole('link', { name: tab.name }).click();
    await expect(page).toHaveURL(tab.url);
    await expect(page.getByText(tab.content)).toBeVisible();
  }
});
```

---

## 6. 성능 테스트

### 6.1 Lighthouse CI 설정

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/market',
        'http://localhost:3000/news',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 6.2 성능 목표

| 지표 | 경고 임계값 | 실패 임계값 |
|------|-----------|-----------|
| LCP | 2.0초 | 2.5초 |
| FID/INP | 75ms | 100ms |
| CLS | 0.05 | 0.10 |
| FCP | 1.5초 | 2.0초 |
| TBT | 150ms | 200ms |
| 초기 JS 번들 | 180KB | 200KB (gzip) |

### 6.3 렌더링 성능 (애니메이션)

- Chrome DevTools Performance 탭에서 60fps 유지 확인
- 마켓 티커 무한 스크롤: GPU 합성 레이어 확인 (`transform: translateX`)
- 뱃지 축하 애니메이션: 프레임 드랍 없음 확인 (Framer Motion `will-change`)
- 200개 코인 목록 스크롤: 가상화로 1,000개 DOM 노드 이하 유지

---

## 7. 보안 테스트

### 7.1 XP 어뷰징 방지 테스트

```
시나리오 1: 동일 뉴스 URL 반복 제출
  - /api/gamification/xp를 같은 action_ref_id로 10회 연속 호출
  - 기대: 첫 번째만 XP 지급, 나머지는 { xp_awarded: 0, reason: "duplicate" } 반환

시나리오 2: 날짜 조작 시도
  - 클라이언트 시스템 날짜를 변경 후 체크인 시도
  - 기대: 서버의 CURRENT_DATE 기준으로 중복 체크, 조작 불가

시나리오 3: 직접 Supabase DB 조작 시도
  - Supabase anon key로 xp_transactions INSERT 직접 시도
  - 기대: RLS 정책으로 거부 (SECURITY DEFINER Function만 쓰기 가능)
```

### 7.2 XSS 방지 테스트

```
시나리오: 닉네임에 스크립트 태그 입력
  - 닉네임 입력: <script>alert('xss')</script>
  - 기대: Zod 검증으로 거부 (정규식 `^[가-힣a-zA-Z0-9_-]+$`에 불일치)

시나리오: 뉴스 제목에 HTML 삽입
  - 뉴스 제목이 React 컴포넌트에서 textContent로 렌더링되는지 확인
  - 기대: innerHTML 사용 없음, React 자동 이스케이핑
```

### 7.3 인증 테스트

```
시나리오: JWT 만료 후 API 호출
  - Access token 만료 후 /api/gamification/checkin 호출
  - 기대: Supabase가 자동으로 refresh token으로 갱신 또는 401 반환

시나리오: 다른 사용자 관심 종목 삭제 시도
  - 타인의 watchlist ID로 DELETE /api/user/watchlist/{id} 시도
  - 기대: Supabase RLS로 0 rows affected, 404 반환
```

---

## 8. 에지 케이스 테스트

| 케이스 | 기대 동작 |
|--------|---------|
| 네트워크 오프라인 시 앱 접속 | 캐시된 관심 종목 + "오프라인 모드" 배너 표시 |
| 장 마감 시간(15:30) 이후 주식 시세 | "장 마감" 배지 표시, 전일 종가 기준 데이터 |
| 코인 가격 0.0001원 이하 소수점 | 적절한 소수점 자리수로 포매팅 |
| 관심 종목 0개인 상태 | "관심 종목을 추가해보세요" empty state 표시 |
| 뉴스 0건인 상태 | "현재 뉴스가 없습니다" empty state 표시 |
| 등락률 ±99% 극단값 | UI 깨짐 없이 정상 표시 |
| 스트릭 365일 이상 | "🔥 365일+" 표시, UI 깨짐 없음 |
| XP 100,000 초과 (최대 레벨 후) | 레벨 10 유지, XP 계속 누적 표시 |
| 동시 다중 탭 출석 체크인 | 서버 중복 방지로 XP 중복 지급 없음 |
| 모바일 가로 모드 (landscape) | 레이아웃 정상 표시 |

---

## 9. 테스트 실행 가이드

### 9.1 로컬 개발

```bash
# 단위/통합 테스트 (watch 모드)
pnpm test

# 단위/통합 테스트 (1회 실행)
pnpm test --run

# 커버리지 리포트
pnpm test --coverage

# E2E 테스트 (개발 서버 실행 후)
pnpm dev &
pnpm e2e

# E2E 테스트 UI 모드 (시각적 디버깅)
pnpm e2e --ui

# Lighthouse 성능 측정
pnpm lhci autorun
```

### 9.2 CI (GitHub Actions)

```yaml
# 자동 실행 조건
on:
  push:    { branches: [main] }
  pull_request: { branches: [main] }

# 실행 순서
1. TypeScript 타입 검사 (pnpm type-check)
2. ESLint 린팅 (pnpm lint)
3. 단위/통합 테스트 (pnpm test --run)
4. Next.js 빌드 (pnpm build)
5. Playwright E2E (pnpm e2e, CI 환경)
6. Lighthouse CI (pnpm lhci autorun, main 브랜치만)
```

### 9.3 주간 정기 테스트

```yaml
# .github/workflows/weekly-e2e.yml
on:
  schedule:
    - cron: '0 20 * * 0'  # 매주 일요일 오전 5시 KST
```

전체 E2E 회귀 테스트 + Lighthouse 리포트 자동 생성.
