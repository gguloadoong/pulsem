# PulseM — 제품 백로그

**버전:** 1.0.0
**최종 수정:** 2026-03-21

> **태그:** `[FEAT]` 새 기능 | `[FIX]` 버그 수정 | `[UX]` UX 개선 | `[PERF]` 성능 | `[TEST]` 테스트 | `[DOCS]` 문서 | `[INFRA]` 인프라
>
> **우선순위:** `P1` 이번 스프린트 필수 | `P2` 다음 스프린트 예정 | `P3` 백로그 보류

---

## P1 — 이번 스프린트 (Phase 1 MVP 필수)

### 인프라 & 설정

- `[INFRA]` **P1** Next.js 15 + TypeScript strict 프로젝트 초기화
  - pnpm, ESLint, Prettier, Husky, lint-staged 설정
  - `.env.example` 작성

- `[INFRA]` **P1** Tailwind CSS v4 + CSS 변수 기반 다크 테마 설정
  - `globals.css`에 색상 변수 전체 정의 (design-spec.md 기준)
  - `<html class="dark">` 고정 설정

- `[INFRA]` **P1** Supabase 프로젝트 생성 + 초기 스키마 마이그레이션
  - `profiles`, `user_stats`, `xp_transactions`, `watchlist`, `badge_definitions`, `user_badges`, `quest_definitions`, `user_quest_progress` 테이블
  - RLS 정책 전체 적용
  - `award_xp()` Database Function 구현

- `[INFRA]` **P1** Vercel 프로젝트 연결 + GitHub Actions CI 파이프라인
  - `type-check → lint → test → build` 순서
  - PR Preview 자동 배포 확인

### 인증

- `[FEAT]` **P1** 구글 소셜 로그인 (Supabase Auth OAuth)
- `[FEAT]` **P1** 카카오 소셜 로그인 (Supabase Auth OAuth)
- `[FEAT]` **P1** 온보딩 플로우 — 닉네임 설정
  - 2~20자, 한글/영문/숫자/`_-` 허용, 중복 체크
- `[FEAT]` **P1** 온보딩 플로우 — 관심 자산 선택 (국내주식/코인/부동산/ETF 복수 선택)
- `[FEAT]` **P1** 온보딩 완료 시 웰컴 XP 50 지급

### 레이아웃 & 내비게이션

- `[FEAT]` **P1** 루트 레이아웃 — 헤더 (로고 + 검색 + 알림 + 아바타)
- `[FEAT]` **P1** 모바일 바텀 탭 내비게이션 (홈/시장/뉴스/퀘스트/프로필 5탭)
- `[FEAT]` **P1** 데스크탑 사이드바 내비게이션 (lg+ 화면)
- `[UX]` **P1** 페이지 전환 애니메이션 (Framer Motion pageVariants)

### 메인 대시보드

- `[FEAT]` **P1** 4대 지수 히어로 카드 (코스피/코스닥/BTC/달러) — 목 데이터
- `[FEAT]` **P1** 마켓 티커 배너 (무한 스크롤 애니메이션)
- `[FEAT]` **P1** 관심 종목 빠른 조회 (최대 5개)
- `[FEAT]` **P1** 오늘의 퀘스트 3개 카드 (홈 하단)
- `[FEAT]` **P1** 오늘의 주요 뉴스 3건

### 시장 페이지

- `[FEAT]` **P1** 시장 탭 구조 (국내주식 / 코인 / 글로벌 / 부동산)
- `[FEAT]` **P1** 주식 종목 카드 목록 (목 데이터 20개)
- `[FEAT]` **P1** 코인 종목 카드 목록 (목 데이터 10개)
- `[FEAT]` **P1** 종목명/코드 검색 (로컬 필터링)
- `[FEAT]` **P1** 정렬 옵션 (시총순/등락률순/거래량순)
- `[FEAT]` **P1** 관심 종목 추가/삭제 (Supabase watchlist 연동)

### 실제 API 연동

- `[FEAT]` **P1** 업비트 REST API 코인 목록 + 시세 연동
- `[FEAT]` **P1** 업비트 WebSocket 실시간 시세 클라이언트 구현
  - 자동 재연결 (최대 3회, 지수 백오프)
  - 가격 변동 시 틱 애니메이션 (priceTickVariants)
- `[FEAT]` **P1** 한국투자증권 OpenAPI 주식 시세 30초 폴링 연동
- `[FEAT]` **P1** 4대 지수 실제 데이터 연동 (코스피/코스닥/BTC/달러)

### 게이미피케이션 핵심

- `[FEAT]` **P1** 일일 출석 체크인 API + 서버사이드 XP 지급 (중복 방지)
- `[FEAT]` **P1** XP 진행바 컴포넌트 + 레벨 배지
- `[FEAT]` **P1** XP 획득 플로팅 텍스트 애니메이션 (+10 XP)
- `[FEAT]` **P1** Supabase Realtime XP/레벨 실시간 동기화
- `[FEAT]` **P1** 레벨업 전체화면 애니메이션 (Framer Motion)
- `[FEAT]` **P1** 연속 출석 스트릭 카운터 + 7일 보너스 (+100 XP)

### 뉴스 피드

- `[FEAT]` **P1** Vercel Cron 뉴스 수집 파이프라인 (네이버 뉴스 5분 폴링)
- `[FEAT]` **P1** 공공기관 RSS 수집 (금융위원회, 한국은행, 기재부, 금감원)
- `[FEAT]` **P1** 뉴스 중요도 자동 분류 (긴급/주요/일반)
- `[FEAT]` **P1** 뉴스 피드 페이지 (카테고리 필터: 주식/코인/부동산/규제/거시)
- `[FEAT]` **P1** 뉴스 읽기 시 XP 지급 (+5 XP, 규제 뉴스 +15 XP)
- `[FEAT]` **P1** 뉴스 북마크 추가/삭제

### UI 품질

- `[UX]` **P1** 스켈레톤 로딩 UI — 모든 비동기 컴포넌트에 적용
- `[UX]` **P1** 빈 상태 (empty state) UI — 모든 목록에 적용
- `[UX]` **P1** Sonner 토스트 알림 전역 설정
- `[UX]` **P1** 에러 바운더리 + 에러 페이지 (`error.tsx`, `not-found.tsx`)
- `[UX]` **P1** 모바일 반응형 최종 점검 (375px, 390px, 428px)

---

## P2 — 다음 스프린트 (Phase 2 핵심)

### 게이미피케이션 고도화

- `[FEAT]` **P2** 뱃지 시스템 30개 구현 (Supabase Trigger 기반 자동 달성)
- `[FEAT]` **P2** 뱃지 획득 전체화면 축하 오버레이 (Framer Motion badgeCelebrationVariants)
- `[FEAT]` **P2** 일일 퀘스트 시스템 — 오전 6시 갱신 (Vercel Cron)
- `[FEAT]` **P2** 퀘스트 진행률 실시간 업데이트 (Supabase Realtime)
- `[FEAT]` **P2** 전체/주간 랭킹 페이지 (내 순위 고정 표시)
- `[FEAT]` **P2** 프로필 페이지 뱃지 컬렉션 그리드 (6열)
- `[FEAT]` **P2** 주간 활동 히트맵 (GitHub 잔디 스타일)
- `[FEAT]` **P2** 경제 퀴즈 기능 (+20 XP, 일일 5문제)

### 포트폴리오

- `[FEAT]` **P2** 포트폴리오 종목 입력 (종목명, 수량, 평단가)
- `[FEAT]` **P2** 현재가 기준 평가손익 자동 계산
- `[FEAT]` **P2** 자산 배분 파이 차트 (Recharts)
- `[FEAT]` **P2** 포트폴리오 수정/삭제

### 상세 차트

- `[FEAT]` **P2** Lightweight Charts 캔들차트 (일봉/주봉/월봉)
- `[FEAT]` **P2** 이동평균선 오버레이 (5일, 20일, 60일)
- `[FEAT]` **P2** 거래량 바 차트
- `[FEAT]` **P2** 종목 상세 페이지 (차트 + 관련 뉴스 5건)
- `[FEAT]` **P2** 스파크라인 차트 (종목 카드 내 소형 차트)

### 알림

- `[FEAT]` **P2** Web Push Notification 구현 (Service Worker + VAPID)
- `[FEAT]` **P2** 알림 설정 페이지 (키워드 최대 20개, 방해금지 시간)
- `[FEAT]` **P2** 긴급 뉴스 푸시 알림 자동 발송
- `[FEAT]` **P2** 관심 종목 가격 알림 (목표가 설정)

### 부동산

- `[FEAT]` **P2** 공공데이터포털 아파트 실거래가 API 연동
- `[FEAT]` **P2** 지역 선택 드롭다운 (시/구 단위)
- `[FEAT]` **P2** 청약 일정 캘린더 (청약홈 RSS)
- `[FEAT]` **P2** 부동산 규제 현황 요약 카드

### 글로벌 시장

- `[FEAT]` **P2** 미국 3대 지수 실제 연동 (Alpha Vantage)
- `[FEAT]` **P2** 주요 환율 (USD/EUR/JPY/CNY)
- `[FEAT]` **P2** 원자재 시세 (금, 원유)
- `[FEAT]` **P2** 공포탐욕지수 (Alternative.me)
- `[FEAT]` **P2** 김치프리미엄 실시간 계산

### 성능 & 품질

- `[PERF]` **P2** @tanstack/virtual 목록 가상화 (코인 200+, 주식 3,000+)
- `[PERF]` **P2** Dynamic import 코드 스플리팅 (차트 컴포넌트)
- `[TEST]` **P2** Vitest 단위 테스트 — 유틸/게이미피케이션 로직 (80%+ 커버리지)
- `[TEST]` **P2** Playwright E2E 핵심 플로우 5개 자동화
- `[INFRA]` **P2** Lighthouse CI GitHub Actions 연동
- `[INFRA]` **P2** Sentry 에러 추적 설정

### 랜딩 페이지 & SEO

- `[FEAT]` **P2** 서비스 소개 랜딩 페이지 (로그아웃 상태 `/` 경로)
- `[FEAT]` **P2** OG 이미지 + SEO 메타데이터 전체 페이지
- `[FEAT]` **P2** robots.txt + sitemap.xml 생성
- `[DOCS]` **P2** README.md 작성 (설치/실행/기여 가이드)

---

## P3 — 백로그 보류 (Phase 3 이후)

### 소셜 & 바이럴

- `[FEAT]` **P3** 공개 프로필 페이지 (`/profile/{nickname}`) — URL 공유 가능
- `[FEAT]` **P3** 친구 초대 코드 시스템 (양쪽 +100 XP 보너스)
- `[FEAT]` **P3** 종목별 토론방 (댓글, 좋아요, 신고)
- `[FEAT]` **P3** 뱃지/레벨 SNS 공유 카드 (동적 OG 이미지 생성)
- `[FEAT]` **P3** 주간 랭킹 변동 알림 (매주 월요일)

### AI 기능 (Claude API)

- `[FEAT]` **P3** 관심 종목 관련 뉴스 AI 자동 요약 (Claude API)
- `[FEAT]` **P3** 오늘의 시장 AI 분석 요약 리포트 (1일 1회)
- `[FEAT]` **P3** 포트폴리오 리스크 AI 분석
- `[FEAT]` **P3** 경제 퀴즈 자동 생성 (Claude API 일일 갱신)

### 투자 캘린더

- `[FEAT]` **P3** FOMC 회의 일정 표시
- `[FEAT]` **P3** 국내 주요 경제지표 발표 일정 (GDP, CPI 등)
- `[FEAT]` **P3** 기업 실적 발표 일정 (DART 연동)
- `[FEAT]` **P3** 개인 투자 메모 캘린더

### 수익화

- `[FEAT]` **P3** 프리미엄 구독 플랜 설계 + Stripe 연동
- `[FEAT]` **P3** 구독 관리 페이지 (업그레이드/취소/영수증)
- `[FEAT]` **P3** 프리미엄 기능 잠금/해제 미들웨어

### 글로벌 확장

- `[FEAT]` **P3** 미국 개별 주식 조회 (AAPL, TSLA, NVDA 등)
- `[FEAT]` **P3** 미국 주식 뉴스 한국어 요약 (Claude API)
- `[FEAT]` **P3** 국제화 (i18n) 기반 구조 설정

### PWA & 모바일

- `[FEAT]` **P3** PWA 설정 (Service Worker, manifest.json, 앱 설치)
- `[FEAT]` **P3** 오프라인 모드 (관심 종목 캐시 표시)
- `[FEAT]` **P3** iOS 홈 화면 추가 최적화 (apple-touch-icon, splash screen)

### UX 고도화

- `[UX]` **P3** 라이트 모드 지원 (테마 전환 설정)
- `[UX]` **P3** 상승/하락 색상 글로벌 방식 전환 옵션 (초록=상승)
- `[UX]` **P3** 키보드 단축키 (검색 `/`, 관심 추가 `f`)
- `[UX]` **P3** 드래그 앤 드롭 관심 종목 순서 변경

### 접근성

- `[UX]` **P3** WCAG 2.1 AA 전체 감사 + 수정
- `[UX]` **P3** 스크린 리더 완전 지원 (ARIA 라벨 전수 검토)
- `[UX]` **P3** `prefers-reduced-motion` 모든 애니메이션에 적용

### 데이터 & 분석

- `[INFRA]` **P3** Upstash Redis Rate Limiting 적용
- `[INFRA]` **P3** 내부 사용자 행동 분석 대시보드
- `[INFRA]` **P3** A/B 테스트 플래그 시스템
- `[INFRA]` **P3** 이탈 사용자 재유입 이메일 자동화 (Resend)

---

## 완료된 항목

> 작업 완료 후 이 섹션으로 이동

- `[DOCS]` **완료** `CLAUDE.md` 프로젝트 지침 문서 작성
- `[DOCS]` **완료** `.project/PRD.md` 제품 요구사항 문서 작성
- `[DOCS]` **완료** `.project/design-spec.md` 디자인 스펙 작성
- `[DOCS]` **완료** `.project/tech-spec.md` 기술 명세 작성
- `[DOCS]` **완료** `.project/api-spec.md` API 명세 작성
- `[DOCS]` **완료** `.project/data-sources.md` 데이터 소스 분석 작성
- `[DOCS]` **완료** `.project/github-guidelines.md` GitHub 운용 지침 작성
- `[DOCS]` **완료** `.project/test-plan.md` 테스트 계획 작성
- `[DOCS]` **완료** `.project/decisions.md` ADR 초기 결정 기록
- `[DOCS]` **완료** `.project/roadmap.md` 제품 로드맵 작성
- `[DOCS]` **완료** `.project/backlog.md` 백로그 작성
