# PulseM — Architecture Decision Records (ADR)

**버전:** 1.0.0
**최종 수정:** 2026-03-21

ADR은 프로젝트에서 내린 중요한 기술/제품 결정과 그 근거를 기록한다. 새로운 결정을 내릴 때마다 이 문서에 추가하며, 상태는 `제안됨 → 승인됨 → 폐기됨` 순으로 변경된다.

---

## ADR-001: 프레임워크 — Next.js 15 App Router 채택

**날짜:** 2026-03-21
**상태:** 승인됨
**결정자:** PulseM 팀

### 배경

PulseM은 실시간 투자 데이터를 다루는 웹 서비스로, 초기 로딩 성능(SEO), 실시간 업데이트, 풀스택 단일 레포 유지가 동시에 필요하다.

### 검토한 대안

| 옵션 | 장점 | 단점 |
|------|------|------|
| Next.js 15 (App Router) | RSC, ISR, Edge Functions, Vercel 최적 통합 | 학습 곡선 (RSC 패턴) |
| React + Vite (SPA) | 단순한 구성, 빠른 개발 | SEO 불리, 별도 백엔드 필요 |
| Remix | 훌륭한 데이터 로딩 패턴 | 커뮤니티/생태계 Next.js보다 작음 |
| Nuxt 3 (Vue) | 좋은 DX | TypeScript 생태계 Next.js보다 약함 |

### 결정 근거

- Vercel 배포 환경과 완벽한 통합 (Edge Functions, ISR, Analytics)
- React Server Components로 서버 렌더링 + 클라이언트 인터랙션 병행 가능
- API Route Handlers로 별도 백엔드 서버 없이 풀스택 구현
- Next.js 15의 Partial Pre-Rendering(PPR)으로 정적+동적 혼합 렌더링 지원

### 결과 및 트레이드오프

- RSC/Client Component 경계를 신중하게 설계해야 함
- `use client` 남용 방지를 위한 코드 리뷰 기준 필요

---

## ADR-002: 백엔드 — Supabase BaaS 채택

**날짜:** 2026-03-21
**상태:** 승인됨

### 배경

별도 백엔드 서버를 운영하지 않고, PostgreSQL + 인증 + 실시간 구독을 한 번에 해결할 BaaS가 필요하다.

### 검토한 대안

| 옵션 | 장점 | 단점 |
|------|------|------|
| **Supabase** | PostgreSQL, Realtime, Auth, Storage, Edge Functions 통합 | 스케일업 비용 |
| Firebase | 성숙한 생태계, 높은 안정성 | NoSQL 구조, 한국 리전 없음 |
| PlanetScale + Clerk | 유연한 MySQL, 강력한 인증 | 두 서비스 관리 복잡도 |
| Prisma + Auth.js | 완전한 제어권 | 별도 DB 호스팅 필요, 운영 부담 |

### 결정 근거

- **Row Level Security(RLS)**: DB 레벨에서 사용자 데이터 격리. 서버 코드에서 별도 인증 체크 최소화
- **Realtime**: XP 변동, 랭킹 업데이트를 WebSocket으로 실시간 반영. 별도 구현 불필요
- **Auth**: 카카오/구글 소셜 로그인을 GoTrue 기반으로 즉시 구현 가능
- **Storage**: 사용자 아바타 이미지를 별도 S3 없이 처리
- **무료 티어**: MAU 50,000 이내 무료. MVP 검증 비용 없음

### 결과 및 트레이드오프

- Supabase 서비스 가용성에 의존 (SLA 99.9%)
- 복잡한 쿼리는 PostgreSQL Function으로 처리하여 N+1 문제 방지 필요
- 장기적으로 MAU 증가 시 비용 재검토 필요

---

## ADR-003: 상태 관리 — TanStack Query + Zustand 이중 전략

**날짜:** 2026-03-21
**상태:** 승인됨

### 배경

PulseM은 두 가지 종류의 상태를 다룬다.
1. **서버 상태**: 시세, 뉴스, 사용자 프로필 (캐싱, 폴링, 실시간 갱신 필요)
2. **클라이언트 상태**: UI 모달 열림/닫힘, 선택된 탭, 토스트 큐

### 결정

- **서버 상태 → TanStack Query v5**: 캐싱, staleTime, refetchInterval, 무한 스크롤, 옵티미스틱 업데이트
- **클라이언트 상태 → Zustand v5**: 작은 번들, 단순한 API, 보일러플레이트 없음

### 안티패턴 금지

```typescript
// 금지: 서버 상태를 Zustand에 저장
const useMarketStore = create(set => ({
  stocks: [],
  fetchStocks: async () => { /* ... */ }, // ❌ TanStack Query로 처리해야 함
}));

// 권장: TanStack Query로 서버 상태 관리
const { data: stocks } = useQuery({
  queryKey: ['stocks', market],
  queryFn: () => fetchStocks(market),
  staleTime: 25_000,
  refetchInterval: 30_000,
});
```

---

## ADR-004: 스타일링 — Tailwind CSS v4 (다크 테마 전용)

**날짜:** 2026-03-21
**상태:** 승인됨

### 결정

- Tailwind CSS v4를 다크 테마 전용으로 사용
- `<html class="dark">` 고정 적용. 라이트 모드 지원 불필요 (Phase 2 계획)
- CSS 변수 기반 색상 시스템으로 디자인 토큰 중앙화

### 근거

- 투자 앱 사용자 대다수 다크 모드 선호 (업비트, 증권사 앱 트렌드)
- 다크 전용으로 개발 리소스 절반으로 집중
- Tailwind v4의 CSS-first 설정으로 `@theme` 블록에서 커스텀 색상 정의

### 결과

- Phase 2에서 라이트 모드 추가 시 CSS 변수 기반이므로 전환 용이
- 이미지/아이콘은 다크 배경에서의 가독성 검증 필수

---

## ADR-005: 애니메이션 — Framer Motion 채택

**날짜:** 2026-03-21
**상태:** 승인됨

### 검토한 대안

| 옵션 | 장점 | 단점 |
|------|------|------|
| **Framer Motion** | 선언적 API, layout 애니메이션, AnimatePresence | 번들 크기 (~50KB gzip) |
| CSS Transitions | 번들 크기 0, 빠름 | 복잡한 시퀀스 구현 어려움 |
| GSAP | 강력한 타임라인, 성숙함 | 유료 플러그인, React 통합 불편 |
| React Spring | 물리 기반 자연스러운 애니메이션 | API 복잡성 |

### 결정 근거

- **게이미피케이션 UX**에 복잡한 애니메이션 필수: 뱃지 축하, XP 플로팅, 레벨업 연출
- `layout` prop으로 목록 재정렬 시 자연스러운 애니메이션
- `AnimatePresence`로 페이지 전환, 모달 마운트/언마운트 애니메이션
- `variants` 패턴으로 stagger 애니메이션을 선언적으로 표현

### 성능 주의사항

- 모든 애니메이션은 `transform`, `opacity`만 사용 (GPU 가속)
- `layout` 애니메이션 남용 금지 (비싼 레이아웃 재계산)
- `prefers-reduced-motion` 지원 필수

---

## ADR-006: 국내 주식 색상 관행 — 상승=빨강, 하락=파랑

**날짜:** 2026-03-21
**상태:** 승인됨

### 배경

글로벌 표준(NYSE, NASDAQ)은 상승=초록, 하락=빨강을 사용하나, 국내 증권 앱(키움, HTS, 카카오페이증권)은 상승=빨강, 하락=파랑을 사용한다.

### 결정

- 기본값: **국내 관행 (상승=빨강 #FF4757, 하락=파랑 #1E90FF)**
- 사용자 설정에서 글로벌 방식 (상승=초록, 하락=빨강)으로 전환 가능
- 코인 시세도 동일 방식 적용 (업비트 앱과 일관성)

### 결과

국내 투자자에게 즉시 친숙한 UI 제공. 글로벌 주식(미국 시장)을 주로 보는 사용자를 위해 설정 전환 제공.

---

## ADR-007: XP 부여 서버사이드 전용 처리

**날짜:** 2026-03-21
**상태:** 승인됨

### 배경

XP는 게이미피케이션의 핵심 화폐다. 클라이언트에서 XP를 계산하거나 직접 DB에 쓸 수 있다면 어뷰징이 발생한다.

### 결정

XP 부여는 **반드시 서버사이드에서만** 처리한다.

```
클라이언트 행동 발생
  ↓
POST /api/gamification/xp (인증 토큰 필수)
  ↓
서버: Supabase award_xp() Function 호출
  ↓ (SECURITY DEFINER — RLS 우회하여 서버만 실행 가능)
DB: 중복 체크 → XP 기록 → 레벨 재계산
  ↓
Supabase Realtime → 클라이언트 XP 업데이트
```

### 중복 방지

`xp_transactions` 테이블의 UNIQUE INDEX로 동일 날짜 + 동일 액션 + 동일 참조 ID 조합의 중복 XP 방지.

### 결과

클라이언트 조작으로 XP를 늘리거나, 뉴스 URL을 반복 제출하는 방식의 어뷰징 차단.

---

## ADR-008: 코인 시세 — 업비트 WebSocket 직접 구독 (클라이언트)

**날짜:** 2026-03-21
**상태:** 승인됨

### 검토한 옵션

A. **클라이언트에서 업비트 WebSocket 직접 연결**
B. 서버(Next.js Route Handler)에서 업비트를 구독하고 SSE로 클라이언트에 전달

### 결정: 옵션 A (클라이언트 직접 연결)

**이유:**
- 업비트 WebSocket은 CORS 없이 브라우저에서 직접 연결 가능
- 서버 경유 시 레이턴시 +50~100ms 추가
- Route Handler를 WebSocket 프록시로 사용하면 Vercel Serverless 시간 초과 문제
- 코인 시세는 민감한 데이터가 아니므로 클라이언트 노출 문제 없음

**트레이드오프:**
- 사용자 수 증가 시 업비트 서버에 직접 연결이 집중됨 → Rate limit 우려 있으나, 업비트 정책상 개별 클라이언트 연결은 제한 없음

---

## ADR-009: 뉴스 수집 — 네이버 API + 공공기관 RSS 이중화

**날짜:** 2026-03-21
**상태:** 승인됨

### 결정

단일 뉴스 소스 의존을 피하기 위해 두 경로를 병행한다.

1. **네이버 뉴스 검색 API** — 일반 투자 뉴스 (주식, 코인, 부동산 키워드 검색)
2. **공공기관 RSS** — 금융위원회, 한국은행, 기재부, 금감원, 국토부

공공기관 RSS는 정책/규제 뉴스의 가장 신뢰할 수 있는 1차 소스. 네이버 API만으로는 긴급 규제 뉴스 발생 직후 5분 이내 인덱싱이 되지 않을 수 있어 이중화 필요.

---

## ADR-010: MVP — 정적 목 데이터 우선 개발

**날짜:** 2026-03-21
**상태:** 승인됨

### 결정

MVP 초기 2주는 `src/data/mock.ts`의 정적 데이터로 UI/UX를 완성하고, 이후 실제 API 연동으로 교체한다.

### 근거

- 외부 API 키 발급/심사에 1~2주 소요 (한국투자증권, 공공데이터포털)
- UI/UX 검증을 API 연동과 분리하여 병렬 진행
- 인터페이스(타입)를 먼저 정의하면 컴포넌트 코드 변경 없이 API 교체 가능

### 교체 조건

Phase 2 시작 시 (`src/data/mock.ts` 삭제, 실제 API 클라이언트로 교체).

---

## ADR-011: 패키지 매니저 — pnpm 채택

**날짜:** 2026-03-21
**상태:** 승인됨

### 결정

npm 대신 pnpm을 패키지 매니저로 사용.

### 근거

- **디스크 공간**: 심링크 기반 글로벌 스토어로 중복 패키지 없음 (~40% 공간 절약)
- **설치 속도**: npm 대비 2~3배 빠른 설치
- **보안**: 엄격한 패키지 격리 (`node_modules` 플랫 구조 방지)
- **Vercel 지원**: `packageManager` 필드로 자동 감지

```json
// package.json
{
  "packageManager": "pnpm@9.0.0"
}
```
