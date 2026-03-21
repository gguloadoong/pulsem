# PulseM — API 명세서

**버전:** 1.0.0
**최종 수정:** 2026-03-21
**Base URL:** `https://pulsem.vercel.app/api`

---

## 1. 공통 규약

### 1.1 인증

Supabase Auth의 JWT를 `Authorization` 헤더로 전달.

```http
Authorization: Bearer <supabase_access_token>
```

비로그인 사용자는 시장 데이터·뉴스 조회(GET)만 허용. 게이미피케이션·관심종목·포트폴리오는 인증 필수.

### 1.2 표준 응답 포맷

```typescript
// 성공
{
  "success": true,
  "data": { ... },
  "meta": {              // 페이지네이션 포함 응답에만
    "total": 1234,
    "page": 1,
    "limit": 20,
    "cached_at": "2026-03-21T09:00:00Z"
  }
}

// 에러
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",       // 기계 가독용
    "message": "로그인이 필요합니다."  // 사용자 노출용
  }
}
```

### 1.3 HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 (입력 검증 실패) |
| 401 | 미인증 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 데이터) |
| 429 | Rate Limit 초과 |
| 502 | 외부 API 오류 |
| 500 | 서버 내부 오류 |

### 1.4 Rate Limiting

| 구분 | 제한 |
|------|------|
| 일반 API (비인증) | 30회/분 |
| 일반 API (인증) | 60회/분 |
| 게이미피케이션 API | 10회/분 |
| 뉴스 검색 | 20회/분 |

응답 헤더: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 2. 인증 API

### 2.1 OAuth 콜백

```
GET /auth/callback
```

Supabase OAuth 리다이렉트 콜백 처리. 소셜 로그인(구글/카카오) 완료 후 Supabase가 이 URL로 리다이렉트한다.

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|--------|------|------|
| `code` | string | OAuth 인증 코드 |
| `state` | string | CSRF 방지 state |

**응답:** 대시보드(`/`) 또는 `redirect` 파라미터 경로로 리다이렉트.

---

## 3. 시장 데이터 API

### 3.1 주요 지수 조회

```
GET /market/indices
```

코스피, 코스닥, 달러/원 환율, 미국 3대 지수를 한 번에 반환.

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "indices": [
      {
        "symbol": "KOSPI",
        "name": "코스피",
        "current": 2681.45,
        "change": 18.32,
        "changeRate": 0.69,
        "direction": "rise",
        "updatedAt": "2026-03-21T09:00:00+09:00"
      },
      {
        "symbol": "KOSDAQ",
        "name": "코스닥",
        "current": 876.23,
        "change": -3.11,
        "changeRate": -0.35,
        "direction": "fall",
        "updatedAt": "2026-03-21T09:00:00+09:00"
      },
      {
        "symbol": "USD/KRW",
        "name": "달러/원",
        "current": 1347.50,
        "change": 2.30,
        "changeRate": 0.17,
        "direction": "rise",
        "updatedAt": "2026-03-21T09:00:00+09:00"
      }
    ]
  },
  "meta": { "cached_at": "2026-03-21T09:00:00Z" }
}
```

**캐싱:** `s-maxage=30, stale-while-revalidate=60`

---

### 3.2 주식 목록 조회

```
GET /market/stocks
```

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `market` | `KOSPI` \| `KOSDAQ` | `KOSPI` | 시장 구분 |
| `sort` | `market_cap` \| `change_rate` \| `volume` | `market_cap` | 정렬 기준 |
| `order` | `asc` \| `desc` | `desc` | 정렬 방향 |
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `50` | 페이지당 항목 수 (최대 100) |
| `search` | string | - | 종목명 또는 코드 검색 |

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "symbol": "005930",
        "name": "삼성전자",
        "market": "KOSPI",
        "currentPrice": 72800,
        "change": 1200,
        "changeRate": 1.68,
        "direction": "rise",
        "volume": 12345678,
        "marketCap": 434560000000000,
        "foreignRatio": 52.4
      }
    ]
  },
  "meta": { "total": 910, "page": 1, "limit": 50 }
}
```

---

### 3.3 개별 종목 상세

```
GET /market/stocks/:symbol
```

**Path Parameters:**
| 파라미터 | 설명 |
|--------|------|
| `symbol` | 종목 코드 (예: `005930`) |

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `period` | `1d` | 차트 기간: `1d` \| `1w` \| `1m` \| `3m` \| `1y` |

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "symbol": "005930",
    "name": "삼성전자",
    "market": "KOSPI",
    "sector": "반도체",
    "currentPrice": 72800,
    "openPrice": 71600,
    "highPrice": 73200,
    "lowPrice": 71400,
    "prevClosePrice": 71600,
    "change": 1200,
    "changeRate": 1.68,
    "direction": "rise",
    "volume": 12345678,
    "tradingValue": 899000000000,
    "marketCap": 434560000000000,
    "per": 18.4,
    "pbr": 1.2,
    "foreignRatio": 52.4,
    "institutionNet": 45000000000,
    "foreignNet": -12000000000,
    "individualNet": -33000000000,
    "chart": [
      { "time": "2026-03-21T09:00:00+09:00", "open": 71600, "high": 72100, "low": 71400, "close": 72000, "volume": 1234567 }
    ]
  }
}
```

---

### 3.4 코인 목록 조회 (업비트 KRW 마켓)

```
GET /market/crypto
```

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `sort` | `acc_trade_price_24h` | 정렬: `acc_trade_price_24h` \| `change_rate` \| `market_cap` |
| `order` | `desc` | 정렬 방향 |
| `limit` | `50` | 최대 200 |

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "coins": [
      {
        "symbol": "BTC",
        "name": "비트코인",
        "market": "KRW-BTC",
        "currentPrice": 124500000,
        "change24h": 3200000,
        "changeRate24h": 2.64,
        "direction": "rise",
        "high24h": 125800000,
        "low24h": 121000000,
        "volume24h": 89234567890,
        "kimchiPremium": 1.23
      }
    ],
    "globalBtcUsdt": 92450.30,
    "fearGreedIndex": 72,
    "fearGreedLabel": "탐욕"
  }
}
```

---

## 4. 뉴스 API

### 4.1 뉴스 피드

```
GET /news/feed
```

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `category` | `all` | `stock` \| `crypto` \| `realestate` \| `regulation` \| `macro` \| `all` |
| `impact` | `all` | `urgent` \| `major` \| `normal` \| `all` |
| `page` | `1` | 페이지 번호 |
| `limit` | `20` | 페이지당 항목 (최대 50) |

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "abc123",
        "title": "금융위원회, 코인 현물 ETF 심사 기준 공개",
        "summary": "금융위원회가 비트코인 및 이더리움 현물 ETF 승인을 위한 심사 기준 초안을 공개했다...",
        "url": "https://example.com/news/abc123",
        "source": "연합뉴스",
        "category": "crypto",
        "impact": "urgent",
        "publishedAt": "2026-03-21T08:30:00+09:00",
        "relatedSymbols": ["BTC", "ETH"],
        "imageUrl": "https://..."
      }
    ]
  },
  "meta": { "total": 847, "page": 1, "limit": 20 }
}
```

**캐싱:** `s-maxage=300, stale-while-revalidate=600`

---

### 4.2 뉴스 검색

```
GET /news/search
```

**Query Parameters:**
| 파라미터 | 필수 | 설명 |
|--------|------|------|
| `q` | 필수 | 검색 키워드 (최소 2자) |
| `page` | - | 기본값 1 |
| `limit` | - | 기본값 20 |

---

### 4.3 뉴스 북마크 추가

```
POST /news/bookmarks
Authorization: Bearer {token}
```

**요청 바디:**
```json
{
  "newsUrl": "https://example.com/news/abc123",
  "newsTitle": "금융위원회, 코인 현물 ETF 심사 기준 공개",
  "newsSource": "연합뉴스"
}
```

**응답 (201):**
```json
{
  "success": true,
  "data": { "id": 42, "bookmarked_at": "2026-03-21T09:15:00Z" }
}
```

---

### 4.4 북마크 목록 조회

```
GET /news/bookmarks
Authorization: Bearer {token}
```

---

### 4.5 북마크 삭제

```
DELETE /news/bookmarks/:id
Authorization: Bearer {token}
```

---

## 5. 게이미피케이션 API

### 5.1 출석 체크인

```
POST /gamification/checkin
Authorization: Bearer {token}
```

요청 바디 없음. 서버에서 오늘 날짜 기준으로 중복 체크.

**응답 (200):**
```json
{
  "success": true,
  "data": {
    "already_checked": false,
    "xp_awarded": 10,
    "bonus_xp": 0,
    "streak_days": 7,
    "streak_bonus": true,
    "total_xp": 1520,
    "current_level": 3,
    "leveled_up": false
  }
}
```

**응답 — 이미 체크인한 경우 (200):**
```json
{
  "success": true,
  "data": {
    "already_checked": true,
    "streak_days": 7
  }
}
```

---

### 5.2 XP 부여 (내부 전용)

```
POST /gamification/xp
Authorization: Bearer {token}
```

클라이언트에서 특정 행동 완료 후 XP 적립 요청.

**요청 바디:**
```json
{
  "action_type": "read_news",
  "action_ref_id": "https://example.com/news/abc123"
}
```

**지원 action_type:**

| action_type | XP | 중복 방지 |
|-------------|-----|---------|
| `checkin` | 10 | 일 1회 |
| `read_news` | 5 | 뉴스 URL당 일 1회 |
| `read_regulation_news` | 15 | 뉴스 URL당 일 1회 |
| `view_stock` | 3 | 종목당 일 1회 |
| `quiz_correct` | 20 | 퀴즈 ID당 1회 |
| `quest_complete` | 50 | 퀘스트 ID+날짜당 1회 |

**응답 (200):**
```json
{
  "success": true,
  "data": {
    "xp_awarded": 5,
    "total_xp": 1525,
    "current_level": 3,
    "leveled_up": false,
    "new_badges": []
  }
}
```

**응답 — 중복 (200, XP 미부여):**
```json
{
  "success": true,
  "data": { "xp_awarded": 0, "reason": "duplicate" }
}
```

---

### 5.3 사용자 통계 조회

```
GET /gamification/stats
Authorization: Bearer {token}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "total_xp": 1525,
    "current_level": 3,
    "level_name": "정보 수집가",
    "next_level_xp": 3500,
    "streak_days": 7,
    "last_checkin": "2026-03-21",
    "news_read_count": 143,
    "quests_completed": 28,
    "badges_count": 6,
    "weekly_xp": 320,
    "rank": {
      "total": 1247,
      "weekly": 89
    }
  }
}
```

---

### 5.4 퀘스트 목록 조회

```
GET /gamification/quests
Authorization: Bearer {token}
```

오늘 날짜 기준 할당된 퀘스트 및 진행 상황 반환.

**응답:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-21",
    "quests": [
      {
        "id": 1,
        "title": "오늘 코스피 지수 확인하기",
        "description": "코스피 지수 카드를 클릭해 오늘 시장을 확인하세요",
        "action_type": "view_index",
        "xp_reward": 50,
        "target_count": 1,
        "current_count": 1,
        "is_completed": true,
        "completed_at": "2026-03-21T07:42:00Z"
      },
      {
        "id": 2,
        "title": "규제 뉴스 2건 읽기",
        "description": "투자 규제/정책 관련 뉴스를 2건 이상 읽으세요",
        "action_type": "read_regulation_news",
        "xp_reward": 80,
        "target_count": 2,
        "current_count": 1,
        "is_completed": false,
        "completed_at": null
      }
    ],
    "all_completed": false,
    "total_reward_xp": 180
  }
}
```

---

### 5.5 뱃지 목록 조회

```
GET /gamification/badges
Authorization: Bearer {token}
```

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `filter` | `all` | `earned` \| `unearned` \| `all` |

**응답:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "first_login",
        "name": "첫 발걸음",
        "description": "PulseM에 처음 로그인했습니다",
        "icon_emoji": "👣",
        "rarity": "common",
        "xp_reward": 20,
        "earned": true,
        "earned_at": "2026-02-01T10:00:00Z"
      },
      {
        "id": "streak_7",
        "name": "7일의 약속",
        "description": "7일 연속 출석 체크인을 달성했습니다",
        "icon_emoji": "🔥",
        "rarity": "rare",
        "xp_reward": 100,
        "earned": true,
        "earned_at": "2026-02-08T08:00:00Z"
      },
      {
        "id": "streak_30",
        "name": "30일의 습관",
        "description": "30일 연속 출석 체크인을 달성했습니다",
        "icon_emoji": "🏆",
        "rarity": "epic",
        "xp_reward": 500,
        "earned": false,
        "earned_at": null
      }
    ],
    "earned_count": 6,
    "total_count": 30
  }
}
```

---

### 5.6 랭킹 조회

```
GET /gamification/ranking
Authorization: Bearer {token}
```

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `type` | `total` | `total` \| `weekly` |
| `limit` | `100` | 상위 N명 (최대 100) |

**응답:**
```json
{
  "success": true,
  "data": {
    "type": "weekly",
    "period": "2026-03-17 ~ 2026-03-21",
    "top": [
      {
        "rank": 1,
        "user_id": "uuid...",
        "nickname": "투자왕민준",
        "level": 7,
        "xp": 2340,
        "badge_count": 18
      }
    ],
    "my_rank": {
      "rank": 89,
      "xp": 320,
      "nickname": "내닉네임"
    }
  }
}
```

---

## 6. 사용자 API

### 6.1 프로필 조회

```
GET /user/profile
Authorization: Bearer {token}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "nickname": "투자입문자준호",
    "avatar_url": "https://...",
    "bio": "주식 3년차 직장인",
    "created_at": "2026-02-01T10:00:00Z"
  }
}
```

---

### 6.2 프로필 수정

```
PATCH /user/profile
Authorization: Bearer {token}
```

**요청 바디:**
```json
{
  "nickname": "새닉네임",
  "bio": "코인도 시작한 직장인"
}
```

**검증 규칙:**
- `nickname`: 2~20자, 한글/영문/숫자/`_-` 허용, 중복 불가
- `bio`: 최대 100자

---

### 6.3 관심 종목 목록 조회

```
GET /user/watchlist
Authorization: Bearer {token}
```

**Query Parameters:**
| 파라미터 | 기본값 | 설명 |
|--------|--------|------|
| `asset_type` | `all` | `stock` \| `crypto` \| `etf` \| `all` |

---

### 6.4 관심 종목 추가

```
POST /user/watchlist
Authorization: Bearer {token}
```

**요청 바디:**
```json
{
  "symbol": "005930",
  "asset_type": "stock",
  "name": "삼성전자"
}
```

**응답 (201):**
```json
{
  "success": true,
  "data": { "id": 123, "added_at": "2026-03-21T09:00:00Z" }
}
```

**에러 — 최대 50개 초과 (400):**
```json
{
  "success": false,
  "error": { "code": "LIMIT_EXCEEDED", "message": "관심 종목은 최대 50개까지 등록할 수 있습니다." }
}
```

---

### 6.5 관심 종목 삭제

```
DELETE /user/watchlist/:id
Authorization: Bearer {token}
```

---

### 6.6 포트폴리오 조회

```
GET /user/portfolio
Authorization: Bearer {token}
```

---

### 6.7 포트폴리오 종목 추가/수정

```
PUT /user/portfolio
Authorization: Bearer {token}
```

**요청 바디:**
```json
{
  "asset_type": "stock",
  "symbol": "005930",
  "name": "삼성전자",
  "quantity": 10,
  "avg_price": 71500,
  "memo": "장기보유 목적"
}
```

---

### 6.8 알림 설정 조회/수정

```
GET  /user/notifications
PATCH /user/notifications
Authorization: Bearer {token}
```

**PATCH 요청 바디:**
```json
{
  "keywords": ["삼성전자", "비트코인", "기준금리"],
  "categories": ["regulation", "macro"],
  "quiet_start": "23:00",
  "quiet_end": "07:00",
  "push_enabled": true
}
```

---

## 7. Webhook / Cron API

### 7.1 일일 퀘스트 갱신

```
POST /webhooks/cron
X-Vercel-Cron-Signature: {signature}
```

Vercel Cron이 매일 KST 06:00 (UTC 21:00)에 호출. 퀘스트 풀에서 무작위 3개 선택하여 활성 사용자에게 할당.

**인증:** Vercel Cron Signature 헤더 검증. 외부 직접 호출 불가.

---

## 8. 타입 정의 (TypeScript)

```typescript
// src/types/market.ts

export type Direction = 'rise' | 'fall' | 'flat';

export interface StockQuote {
  symbol:       string;
  name:         string;
  market:       'KOSPI' | 'KOSDAQ';
  currentPrice: number;
  change:       number;
  changeRate:   number;
  direction:    Direction;
  volume:       number;
  marketCap:    number;
  isStale?:     boolean;  // 캐시 폴백 시 true
}

export interface CryptoQuote {
  symbol:        string;
  name:          string;
  market:        string;
  currentPrice:  number;
  change24h:     number;
  changeRate24h: number;
  direction:     Direction;
  high24h:       number;
  low24h:        number;
  volume24h:     number;
  kimchiPremium: number;
}

export interface NewsItem {
  id:             string;
  title:          string;
  summary:        string;
  url:            string;
  source:         string;
  category:       'stock' | 'crypto' | 'realestate' | 'regulation' | 'macro';
  impact:         'urgent' | 'major' | 'normal';
  publishedAt:    string;
  relatedSymbols: string[];
  imageUrl?:      string;
}

// src/types/gamification.ts

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id:          string;
  name:        string;
  description: string;
  icon_emoji:  string;
  rarity:      BadgeRarity;
  xp_reward:   number;
  earned:      boolean;
  earned_at:   string | null;
}

export interface Quest {
  id:            number;
  title:         string;
  description:   string;
  action_type:   string;
  xp_reward:     number;
  target_count:  number;
  current_count: number;
  is_completed:  boolean;
  completed_at:  string | null;
}

export interface UserStats {
  total_xp:       number;
  current_level:  number;
  level_name:     string;
  next_level_xp:  number;
  streak_days:    number;
  last_checkin:   string;
  news_read_count: number;
  quests_completed: number;
  badges_count:   number;
}
```
