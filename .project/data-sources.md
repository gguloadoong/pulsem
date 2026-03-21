# PulseM — 데이터 소스 분석

**버전:** 1.0.0
**최종 수정:** 2026-03-21

---

## 1. 데이터 소스 전체 목록

| 카테고리 | 필요 데이터 | 갱신 주기 | 우선순위 |
|---------|-----------|---------|---------|
| 국내 주식 | 코스피/코스닥 종목 시세, 거래량, 투자자 동향 | 실시간 (장중) | P0 |
| 암호화폐 | 업비트 KRW 마켓 전종목 시세, 글로벌 BTC/USDT | 실시간 24/7 | P0 |
| 글로벌 지수 | 미국 3대 지수, 주요 환율, 원자재 | 10분 | P1 |
| 뉴스 | 투자 관련 뉴스, 규제/정책 소식 | 실시간~5분 | P0 |
| 부동산 | 아파트 실거래가, 청약 일정, 규제 현황 | 주 1회 | P1 |
| 공포탐욕지수 | CNN Fear & Greed Index | 1시간 | P1 |
| 김치프리미엄 | 업비트 KRW vs 바이낸스 USDT 가격 차 | 실시간 | P1 |

---

## 2. 주식 데이터 소스

### 2.1 한국투자증권 OpenAPI ⭐ 권장

**URL:** https://apiportal.koreainvestment.com/

| 항목 | 내용 |
|------|------|
| 제공 데이터 | 실시간 주식 시세, 호가, 체결 내역, 투자자 동향, 차트 데이터 |
| 연결 방식 | REST API + WebSocket |
| 비용 | 무료 (개인 비상업적 사용) |
| 인증 방식 | OAuth 2.0 (앱키/앱시크릿 발급) |
| Rate Limit | 초당 20회 (REST), WebSocket은 제한 없음 |
| 데이터 지연 | 실시간 (WebSocket) / 폴링 시 최대 20분 지연 선택 가능 |
| 제약 사항 | **증권사 계좌 연동 필요** — MVP에서는 지연 데이터(REST) 사용 |

**활용 API 목록:**
```
[현재가 조회]    GET /uapi/domestic-stock/v1/quotations/inquire-price
[호가 조회]      GET /uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn
[일별 차트]      GET /uapi/domestic-stock/v1/quotations/inquire-daily-chartprice
[투자자 동향]    GET /uapi/domestic-stock/v1/quotations/inquire-investor
[종목 검색]      GET /uapi/domestic-stock/v1/quotations/search-stock-info
[WebSocket 체결] wss://ops.koreainvestment.com:21000
```

**응답 예시 (현재가):**
```json
{
  "output": {
    "stck_prpr": "72800",
    "prdy_vrss": "1200",
    "prdy_ctrt": "1.68",
    "acml_vol": "12345678",
    "hts_kor_isnm": "삼성전자"
  },
  "rt_cd": "0",
  "msg_cd": "MCA00000",
  "msg1": "정상처리 되었습니다."
}
```

### 2.2 KRX 정보데이터시스템 (대안)

**URL:** https://data.krx.co.kr/

| 항목 | 내용 |
|------|------|
| 제공 데이터 | 상장 종목 리스트, 일별 시세, 업종별 현황, 공시 정보 |
| 연결 방식 | REST API / 파일 다운로드 |
| 비용 | 무료 |
| 인증 | API 키 불필요 (일부 데이터) |
| 제약 | 장 마감 후 배치 데이터. 실시간 아님 |

**활용 용도:** 전체 종목 목록 초기 로드, 일별 마감 시세 백업

### 2.3 스크래핑 주의 사항

네이버 금융, 다음 금융 스크래핑은 **이용약관 위반 위험**이 있어 직접 사용 금지. 공식 API 또는 제휴를 통해서만 데이터 수집.

---

## 3. 암호화폐 데이터 소스

### 3.1 업비트 API ⭐ 권장 (국내 원화 시세)

**URL:** https://docs.upbit.com/

| 항목 | 내용 |
|------|------|
| 제공 데이터 | KRW/BTC/USDT 마켓 전종목 시세, 호가, 체결, 캔들 |
| 연결 방식 | REST API + WebSocket |
| 비용 | 무료 |
| 인증 | 공개 조회는 키 불필요. 주문/출금은 API 키 필요 |
| Rate Limit | REST: 분당 600회 (공개), WebSocket: 제한 없음 |
| 데이터 지연 | WebSocket 실시간 (거의 0ms 지연) |

**활용 API:**
```
[마켓 목록]   GET  https://api.upbit.com/v1/market/all
[현재가 목록] GET  https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH
[일봉 캔들]  GET  https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200
[WebSocket]  wss://api.upbit.com/websocket/v1
```

**WebSocket 구독 예시:**
```json
[
  { "ticket": "unique-ticket-id" },
  {
    "type": "ticker",
    "codes": ["KRW-BTC", "KRW-ETH", "KRW-SOL"],
    "isOnlyRealtime": true
  }
]
```

**WebSocket 응답 주요 필드:**
```
trade_price        현재가
signed_change_rate 전일 대비 변동률
acc_trade_price_24 24시간 거래대금
high_price         당일 고가
low_price          당일 저가
trade_volume       최근 체결량
```

### 3.2 바이낸스 API (글로벌 BTC/USDT — 김치프리미엄 계산용)

**URL:** https://binance-docs.github.io/

```
GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
GET https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT
```

김치프리미엄 계산:
```
업비트 BTC/KRW ÷ (바이낸스 BTC/USDT × USD/KRW 환율) - 1 × 100 (%)
```

### 3.3 CoinGecko API (글로벌 시총, 공포탐욕지수)

**URL:** https://www.coingecko.com/api/documentation

| 항목 | 내용 |
|------|------|
| 무료 플랜 | 분당 30회, 글로벌 시총/도미넌스/코인 목록 조회 가능 |
| 유료 플랜 | 분당 500회, 실시간 시세, 과거 데이터 |

**활용 API:**
```
[글로벌 시총]  GET /api/v3/global
[코인 목록]   GET /api/v3/coins/markets?vs_currency=krw&order=market_cap_desc
[코인 로고]   GET /api/v3/coins/{id} (이미지 URL 캐싱)
```

### 3.4 Alternative.me API (공포탐욕지수)

```
GET https://api.alternative.me/fng/
```

응답: `value` (0-100), `value_classification` ("Extreme Fear" ~ "Extreme Greed")
비용: 무료, Rate Limit 없음 (일별 업데이트)

---

## 4. 뉴스 데이터 소스

### 4.1 네이버 뉴스 검색 API ⭐ 권장

**URL:** https://developers.naver.com/docs/serviceapi/search/news/

| 항목 | 내용 |
|------|------|
| 제공 데이터 | 뉴스 제목, 요약, URL, 출처, 발행일시 |
| 연결 방식 | REST API |
| 비용 | 무료 (일 25,000회) |
| 인증 | 네이버 앱 클라이언트 ID/시크릿 |
| 제약 | 실시간성 낮음 (검색 인덱싱 지연), 원문 본문 미제공 |

**활용 방식:**
- 키워드별 정기 폴링 (5분 간격)
- 주요 키워드: "주식", "코인", "부동산", "금융위원회", "한국은행", "기준금리", "ETF"
- 결과 중 publishedAt 기준 최신 기사만 필터링

```
GET https://openapi.naver.com/v1/search/news.json
  ?query=금융위원회&display=10&start=1&sort=date
Headers:
  X-Naver-Client-Id: {client_id}
  X-Naver-Client-Secret: {client_secret}
```

### 4.2 공공기관 RSS (규제/정책 — 최고 신뢰성)

| 기관 | RSS URL | 업데이트 |
|------|---------|---------|
| 금융위원회 | https://www.fsc.go.kr/rss/press | 발표 즉시 |
| 한국은행 | https://www.bok.or.kr/portal/bbs/B0000245/rss.do | 발표 즉시 |
| 기획재정부 | https://www.moef.go.kr/com/rss/news.do | 발표 즉시 |
| 금융감독원 | https://www.fss.or.kr/fss/kr/rss/press_rss.jsp | 발표 즉시 |
| 국토교통부 | https://www.molit.go.kr/rss/press.do | 발표 즉시 |

**처리 방식:** Vercel Cron으로 10분마다 RSS 파싱 → 신규 항목 Supabase 저장 → 중요도 분류 → 푸시 알림 트리거

### 4.3 뉴스 중요도 분류 로직

```typescript
// src/lib/news/classifier.ts

const URGENT_KEYWORDS = [
  '기준금리', '금리 인상', '금리 인하', 'FOMC', '긴급', '비상',
  '거래 중단', '서킷브레이커', '코인 규제', '암호화폐 금지',
];

const MAJOR_KEYWORDS = [
  '금융위원회', '한국은행', '기획재정부', '공시', 'ETF',
  '부동산 규제', '청약', '대출 한도', 'PF',
];

export function classifyNewsImpact(title: string, source: string): NewsImpact {
  const text = title.toLowerCase();
  if (URGENT_KEYWORDS.some(kw => title.includes(kw))) return 'urgent';
  if (MAJOR_KEYWORDS.some(kw => title.includes(kw))) return 'major';
  if (['금융위원회', '한국은행', '기재부', '금감원'].includes(source)) return 'major';
  return 'normal';
}
```

---

## 5. 부동산 데이터 소스

### 5.1 국토교통부 실거래가 API ⭐ 권장

**URL:** https://www.data.go.kr/data/15058747/openapi.do

| 항목 | 내용 |
|------|------|
| 제공 데이터 | 아파트 매매 실거래가 (지역코드, 단지명, 거래금액, 면적, 층수, 계약일) |
| 연결 방식 | REST API (공공데이터포털) |
| 비용 | 무료 (공공누리 제1유형) |
| 인증 | 공공데이터포털 서비스 키 |
| 갱신 주기 | 월 1~2회 배치 (실거래 신고 기준, 30일 이내 신고 의무) |
| 제약 | 거의 실시간 아님. 최신 거래는 1~2달 후 반영 |

**활용 API:**
```
GET http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev
  ?serviceKey={key}
  &LAWD_CD=11110      # 지역코드 (서울 종로구)
  &DEAL_YMD=202603    # 조회 연월
```

### 5.2 한국부동산원 통계 API

**URL:** https://www.reb.or.kr/

- 주간 아파트 가격 동향, 전세 동향
- 지역별 매매/전세 지수
- 가입 후 API 키 신청 필요

### 5.3 청약홈 RSS

**URL:** https://www.applyhome.co.kr/

- 아파트 청약 공고 정보 RSS 제공
- 청약 일정 캘린더에 활용

---

## 6. 환율 / 글로벌 지수

### 6.1 Alpha Vantage (글로벌 지수)

**URL:** https://www.alphavantage.co/

| 항목 | 내용 |
|------|------|
| 제공 데이터 | 미국 주식/ETF/지수, 환율, 원자재 |
| 무료 플랜 | 분당 5회, 일 500회 |
| 유료 플랜 | 분당 75회~ |

**활용 API:**
```
[S&P 500]  GET /query?function=GLOBAL_QUOTE&symbol=SPY
[나스닥]    GET /query?function=GLOBAL_QUOTE&symbol=QQQ
[금]        GET /query?function=GLOBAL_QUOTE&symbol=GLD
[USD/KRW]  GET /query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KRW
```

### 6.2 한국은행 경제통계시스템 (ECOS)

**URL:** https://ecos.bok.or.kr/api/

- 기준금리, 환율 공식 데이터
- 거시경제 지표 (GDP, 물가지수, 무역수지)
- 무료, API 키 신청 필요

---

## 7. 데이터 파이프라인 설계

### 7.1 실시간 데이터 흐름

```
업비트 WebSocket ──────────────────────────────► 클라이언트 직접 구독
                                                  (브라우저 WebSocket)

한국투자증권 API ──► /api/market/stocks (Edge) ──► TanStack Query 30초 폴링
                      [s-maxage=30 캐시]

네이버 뉴스 API  ──► Vercel Cron (5분) ──► Supabase DB ──► /api/news/feed
공공기관 RSS     ──► Vercel Cron (10분) ──► 중요도 분류 ──► 푸시 알림 트리거

국토부 실거래가  ──► Vercel Cron (주 1회) ──► Supabase DB ──► /api/market/realestate
```

### 7.2 데이터 수집 스케줄 (Vercel Cron)

```json
// vercel.json crons 섹션
[
  { "path": "/api/webhooks/cron/news",      "schedule": "*/5 * * * *"   },
  { "path": "/api/webhooks/cron/rss",       "schedule": "*/10 * * * *"  },
  { "path": "/api/webhooks/cron/realestate","schedule": "0 2 * * 1"     },
  { "path": "/api/webhooks/cron/quests",    "schedule": "0 21 * * *"    }
]
```

---

## 8. 법적·라이선스 고려사항

| 데이터 소스 | 라이선스 | 상업적 사용 | 출처 표시 | 주의사항 |
|------------|---------|-----------|---------|---------|
| 한국투자증권 OpenAPI | 개인 무료 | 별도 계약 필요 | 불필요 | 상업적 서비스 시 제휴 계약 필요 |
| 업비트 API | 이용약관 | 조건부 허용 | 불필요 | 과도한 요청 금지, 재판매 금지 |
| 공공데이터포털 | 공공누리 1유형 | 가능 | 필수 | "출처: 국토교통부" 표시 |
| 네이버 뉴스 검색 | 네이버 API 이용약관 | 조건부 허용 | 불필요 | 뉴스 본문 전문 재제공 금지 |
| Alpha Vantage | API 이용약관 | 유료 플랜 필요 | 불필요 | 무료 플랜은 개인/비상업용 |
| CoinGecko API | 이용약관 | 유료 플랜 필요 | 권장 | 무료: 비상업, 유료: 상업 허용 |
| Alternative.me | 공개 | 허용 | 권장 | 비공식 API, 장애 리스크 존재 |

### 8.1 필수 준수 사항

1. **업비트 API:** `robots.txt` 준수, 초당 요청 제한 준수, 시세 데이터 재판매 절대 금지
2. **공공데이터:** 모든 화면에 "출처: {기관명}" 표시 의무
3. **네이버 뉴스:** 헤드라인+요약만 표시, 원문 링크로 연결. 전문 게재 금지
4. **금융 정보 면책조항:** 모든 시세/뉴스 페이지에 "본 서비스는 투자 정보 제공 목적이며, 투자 권유가 아닙니다. 투자 판단의 책임은 투자자 본인에게 있습니다." 문구 표시

---

## 9. 데이터 품질 관리

### 9.1 이상치 탐지 규칙

```typescript
// src/lib/utils/validate-market-data.ts

export function isValidStockPrice(
  current: number,
  prevClose: number
): boolean {
  if (current <= 0) return false;
  const changeRate = Math.abs((current - prevClose) / prevClose);
  // 전일 대비 ±30% 초과 시 의심 데이터
  return changeRate <= 0.30;
}

export function isValidCryptoPrice(
  current: number,
  prev: number
): boolean {
  if (current <= 0) return false;
  const changeRate = Math.abs((current - prev) / prev);
  // 코인은 ±50% 초과 시 의심 (코인은 변동성 큼)
  return changeRate <= 0.50;
}
```

### 9.2 데이터 신선도 표시

- API 응답에 `updatedAt` 타임스탬프 포함
- 데이터가 5분 이상 갱신 안 된 경우 UI에 "⚠️ 데이터가 오래되었을 수 있습니다." 배너 표시
- 장 마감 시간(15:30) 이후에는 "장 마감" 배지 표시

### 9.3 장애 대응 (Fallback 전략)

| 장애 상황 | 대응 방법 |
|---------|---------|
| 한국투자증권 API 다운 | Redis 캐시 데이터 반환 + isStale 플래그 |
| 업비트 WebSocket 끊김 | 자동 재연결 (최대 3회, 지수 백오프) |
| 네이버 뉴스 API 오류 | 공공기관 RSS 단독 표시 |
| Supabase 장애 | Vercel KV 임시 캐시로 읽기 전용 서비스 |
| 공공데이터 API 오류 | 마지막 성공 응답 캐시 유지 (최대 7일) |

---

## 10. MVP 단계 데이터 전략

MVP 초기에는 외부 API 연동 없이 **정적 목 데이터**로 UI/UX를 먼저 검증한다.

```typescript
// src/data/mock.ts — MVP 목 데이터

export const mockStocks: StockQuote[] = [
  { symbol: '005930', name: '삼성전자', market: 'KOSPI',
    currentPrice: 72800, change: 1200, changeRate: 1.68, direction: 'rise',
    volume: 12345678, marketCap: 434560000000000 },
  { symbol: '000660', name: 'SK하이닉스', market: 'KOSPI',
    currentPrice: 198500, change: -3500, changeRate: -1.73, direction: 'fall',
    volume: 4567890, marketCap: 144450000000000 },
  // ... 20개 종목
];

export const mockCryptos: CryptoQuote[] = [
  { symbol: 'BTC', name: '비트코인', market: 'KRW-BTC',
    currentPrice: 124500000, change24h: 3200000, changeRate24h: 2.64,
    direction: 'rise', volume24h: 89234567890, kimchiPremium: 1.23 },
  // ... 10개 코인
];

export const mockNews: NewsItem[] = [
  { id: '1', title: '금융위원회, 코인 현물 ETF 심사 기준 공개',
    summary: '금융위원회가 비트코인 및 이더리움 현물 ETF 승인을 위한 심사 기준 초안을 공개했다.',
    url: 'https://example.com/news/1', source: '연합뉴스',
    category: 'crypto', impact: 'urgent',
    publishedAt: '2026-03-21T08:30:00+09:00', relatedSymbols: ['BTC', 'ETH'] },
  // ... 15개 뉴스
];
```

**Phase 2 전환 시:** 목 데이터 파일을 삭제하고 실제 API 클라이언트로 교체. 컴포넌트 코드 변경 불필요 (인터페이스 일치).
