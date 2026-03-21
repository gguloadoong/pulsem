# PulseM — Technical Specification

## 1. 기술 스택
| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 15 (App Router) | SSR/SSG, 파일 기반 라우팅, React 19 |
| 언어 | TypeScript 5 | 타입 안전성, DX 향상 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 퍼스트, 빠른 프로토타이핑 |
| 애니메이션 | Framer Motion 12 | 선언적 애니메이션, layout 전환 |
| 아이콘 | Lucide React | 트리쉐이킹, 일관된 스타일 |
| BaaS | Supabase (Phase 2) | PostgreSQL, Realtime, Auth |
| 배포 | Vercel | Next.js 최적 호스팅, Edge Functions |

## 2. 시스템 아키텍처
```
[클라이언트 (Next.js)]
    ↓ SSR/CSR
[Vercel Edge Network]
    ↓ API Routes
[Supabase] ← PostgreSQL + Realtime + Auth
    ↓
[외부 API] ← 한국투자증권, 업비트, 부동산 공공데이터
```

## 3. 디렉토리 구조
```
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # 글로벌 스타일
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈 대시보드
├── components/           # UI 컴포넌트
│   ├── Header.tsx        # 헤더 + 카테고리 탭
│   ├── BottomNav.tsx     # 하단 네비게이션
│   ├── MarketCard.tsx    # 종목 카드 + 스파크라인
│   ├── MarketTicker.tsx  # 실시간 티커 배너
│   ├── NewsCard.tsx      # 뉴스 카드
│   ├── GamificationPanel.tsx  # XP/스트릭/퀘스트/배지
│   ├── CheckinButton.tsx # 출석 체크인
│   └── TrendingSection.tsx # 트렌딩 키워드
├── data/
│   └── mock.ts           # 목 데이터 + 타입 정의
├── lib/                  # 유틸리티 (Phase 2)
└── hooks/                # 커스텀 훅 (Phase 2)
```

## 4. 성능 전략
- **렌더링**: CSR 기반 (실시간 데이터 업데이트에 유리)
- **메모이제이션**: `useMemo`로 필터링된 목록 캐싱
- **이미지**: Next.js Image 컴포넌트 + WebP (Phase 2)
- **번들**: 동적 import로 탭별 코드 분리 (Phase 2)
- **애니메이션**: GPU 가속 (transform, opacity만 사용)

## 5. 상태 관리
- **현재**: React useState (로컬 상태)
- **Phase 2**: Zustand (전역 상태) + React Query (서버 상태)
- **Phase 3**: Supabase Realtime 구독

## 6. CI/CD 및 배포
- GitHub Actions: lint → build 파이프라인
- Vercel: main 브랜치 자동 배포, PR 프리뷰 배포
- PR 리뷰: Qodo PR Agent + Copilot + CodeRabbit + Gemini

## 7. 개발 도구 및 Lint
- ESLint: next/core-web-vitals 룰셋
- TypeScript: strict mode
- Prettier: 자동 포맷팅 (Phase 2)

## 8. 오픈 소스·라이선스
- MIT 라이선스
- 주요 의존성 라이선스 호환성 확인 완료
