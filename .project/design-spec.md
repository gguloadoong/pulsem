# PulseM — Design Specification

## 1. 디자인 방향
- **컨셉**: "어둠 속의 맥박" — 다크 배경 위에 네온 컬러가 실시간 데이터의 생동감을 전달
- **톤앤매너**: 프리미엄 핀테크 + 게이미피케이션의 재미 요소가 결합된 하이브리드 스타일
- **레퍼런스**: Robinhood(간결한 투자 UX), Duolingo(게이미피케이션), Bloomberg Terminal(데이터 밀도)

## 2. 색상 시스템
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-bg` | `#0a0a0f` | 메인 배경 |
| `--color-surface` | `#12121a` | 카드/섹션 배경 |
| `--color-border` | `#1e1e2e` | 구분선/테두리 |
| `--color-primary` | `#6c5ce7` | 브랜드 퍼플 |
| `--color-primary-light` | `#a29bfe` | 호버/활성 상태 |
| `--color-accent` | `#00cec9` | 강조 틸 |
| `--color-accent-warm` | `#fdcb6e` | XP/보상 골드 |
| `--color-up` | `#00b894` | 상승 그린 |
| `--color-down` | `#ff6b6b` | 하락 레드 |
| `--color-text` | `#e8e8f0` | 본문 텍스트 |
| `--color-text-muted` | `#8888a0` | 보조 텍스트 |

- 접근성: 모든 텍스트-배경 조합 WCAG AA 이상 대비율 확보
- 상승/하락 색상은 한국 주식 관행(빨강=상승)과 다르지만 글로벌 표준(초록=상승)을 채택 — 설정에서 변경 가능하도록 계획

## 3. 타이포그래피 & 아이콘
- **주 서체**: Inter (400/500/600/700/800/900)
- **숫자**: tabular-nums로 정렬, 가격 변동 시 slide-up 애니메이션
- **아이콘**: 이모지 기반 (초기 MVP), 추후 Lucide React로 마이그레이션
- **폰트 크기 체계**: 8px(캡션) / 10px(라벨) / 12px(보조) / 14px(본문) / 18px(제목) / 24px(대제목)

## 4. 화면 목록 & 사용자 흐름
### 핵심 화면 (5탭)
1. **홈**: 출석 체크인 → 게이미피케이션 패널 → 트렌딩 → 시장현황 → 뉴스
2. **시장**: 카테고리별 전체 종목 목록, 정렬/필터 기능
3. **뉴스**: 실시간 뉴스 피드, 영향도/카테고리 필터
4. **퀘스트**: 일일/주간/업적 퀘스트, 배지 컬렉션
5. **MY**: 프로필, 통계, 관심종목 관리, 설정

### 사용자 플로우
```
앱 진입 → 출석 체크인(+20XP) → 홈 대시보드 탐색
→ 관심 종목 확인 → 뉴스 읽기(+50XP 퀘스트) → 퀘스트 완료 확인
```

## 5. 컴포넌트 & 애니메이션
### 글래스모피즘 카드
- `backdrop-filter: blur(12px)`, 반투명 배경, 1px 보더
- hover: scale(1.02), y(-2px), 보더 색상 primary로 변경

### 애니메이션 (Framer Motion)
- **페이지 전환**: fade + slide (0.3s ease)
- **카드 진입**: stagger(0.05s), y(20→0) + fade
- **스파크라인**: SVG polyline + gradient fill
- **XP 보상**: scale bounce + y(-40px) float up + fade out
- **체크인 버튼**: shimmer gradient sweep(2s infinite)
- **하단 탭**: layoutId spring 전환, 아이콘 scale bounce
- **마켓 티커**: infinite horizontal scroll(30s linear)

## 6. 접근성 & 반응성
- 모바일 퍼스트: 기본 1컬럼, sm(640px)부터 2컬럼 그리드
- iOS safe area 대응: `env(safe-area-inset-bottom)`
- 터치 타겟: 최소 44px
- 리듀스드 모션 지원 예정

## 7. 디자인 레퍼런스
- **Robinhood**: 깔끔한 가격 표시, 스파크라인 차트
- **Duolingo**: 스트릭, XP, 레벨, 배지 시스템
- **Coinbase**: 다크 모드 색상 체계, 카드 레이아웃
- **토스**: 한국어 금융 UX, 간결한 정보 계층

## 8. 디자인 QA 체크리스트
- [ ] 모든 카드 모서리 radius 통일 (2xl = 16px)
- [ ] 간격 체계 일관성 (gap-1 ~ gap-4)
- [ ] 텍스트 대비율 AA 이상
- [ ] 빈 상태(empty state) 처리
- [ ] 에러 상태 UI
- [ ] 로딩 스켈레톤
- [ ] 다크 모드 전용 (라이트 모드는 Phase 2)
