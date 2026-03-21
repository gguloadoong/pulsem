# PulseM — 디자인 스펙

**버전:** 1.0.0
**최종 수정:** 2026-03-21

---

## 1. 디자인 철학

### 핵심 원칙

**"Dark Pulse"** — 어두운 배경 위에서 투자 데이터가 마치 심전도처럼 생동감 있게 뛰는 경험

1. **몰입감 (Immersion)** — 어두운 환경에서 데이터가 빛나도록. 투자자가 화면에 집중할 수 있는 분위기 조성
2. **즉각성 (Immediacy)** — 중요 정보는 3초 안에 파악 가능. 계층적 정보 구조로 스캐닝 용이
3. **활력 (Vitality)** — 애니메이션과 실시간 업데이트로 살아있는 플랫폼 느낌 전달
4. **보상감 (Reward)** — 게이미피케이션 요소가 자연스럽게 녹아들어 사용 자체가 즐거운 경험

### 무드보드 레퍼런스

- **Bloomberg Terminal** — 정보 밀도, 전문성
- **Robinhood** — 접근성, 클린한 시세 표현
- **Duolingo** — 게이미피케이션 UX 패턴 (스트릭, XP, 레벨)
- **토스** — 한국 금융 UX, 명확한 정보 계층
- **Cyberpunk 2077 UI** — 네온 글로우, 다크 배경

---

## 2. 색상 시스템

### 2.1 기본 팔레트

```css
/* 배경 계층 — 깊이감 표현 */
--color-bg-base:      #0A0E1A;  /* 최심층 배경 (메인 배경) */
--color-bg-surface:   #0F1420;  /* 카드/패널 배경 */
--color-bg-elevated:  #161C2D;  /* 호버, 선택된 카드 */
--color-bg-overlay:   #1E2640;  /* 모달, 드롭다운 배경 */

/* 보더 */
--color-border-subtle:  rgba(255, 255, 255, 0.06);
--color-border-default: rgba(255, 255, 255, 0.12);
--color-border-strong:  rgba(255, 255, 255, 0.24);

/* 텍스트 계층 */
--color-text-primary:   #F0F4FF;  /* 주요 텍스트 */
--color-text-secondary: #8892A4;  /* 보조 텍스트 */
--color-text-muted:     #4A5568;  /* 비활성/힌트 텍스트 */
--color-text-inverse:   #0A0E1A;  /* 밝은 배경 위 텍스트 */
```

### 2.2 브랜드 액센트 — "Pulse Neon"

```css
/* 주 브랜드 색상 — 인디고 네온 */
--color-accent-primary:       #6366F1;  /* Indigo-500 */
--color-accent-primary-light: #818CF8;  /* Indigo-400, 호버 상태 */
--color-accent-primary-glow:  rgba(99, 102, 241, 0.30);

/* 보조 액센트 — 시안 네온 */
--color-accent-cyan:      #22D3EE;  /* Cyan-400 */
--color-accent-cyan-glow: rgba(34, 211, 238, 0.25);

/* 경고/긴급 — 앰버 */
--color-accent-amber:      #F59E0B;
--color-accent-amber-glow: rgba(245, 158, 11, 0.25);
```

### 2.3 투자 데이터 전용 색상

**국내 증권 관행(상승=빨강, 하락=파랑)을 따름.** 설정에서 글로벌 방식(상승=초록)으로 전환 가능.

```css
/* 상승 */
--color-rise:      #FF4757;  /* 강한 상승 빨강 */
--color-rise-soft: #FF6B81;  /* 소폭 상승 */
--color-rise-bg:   rgba(255, 71, 87, 0.12);
--color-rise-glow: rgba(255, 71, 87, 0.30);

/* 하락 */
--color-fall:      #1E90FF;  /* 강한 하락 파랑 */
--color-fall-soft: #5DADE2;  /* 소폭 하락 */
--color-fall-bg:   rgba(30, 144, 255, 0.12);
--color-fall-glow: rgba(30, 144, 255, 0.30);

/* 보합 */
--color-flat:    #8892A4;
--color-flat-bg: rgba(136, 146, 164, 0.12);
```

### 2.4 게이미피케이션 색상

```css
/* XP / 보상 골드 */
--color-xp:       #FFD700;
--color-xp-glow:  rgba(255, 215, 0, 0.30);
--color-level-bar: linear-gradient(90deg, #6366F1 0%, #22D3EE 100%);

/* 뱃지 등급 */
--color-badge-common:    #8892A4;
--color-badge-rare:      #6366F1;
--color-badge-epic:      #9333EA;
--color-badge-legendary: #F59E0B;

/* 퀘스트 상태 */
--color-quest-active:   #22D3EE;
--color-quest-complete: #10B981;
--color-quest-locked:   #4A5568;
```

### 2.5 시맨틱 색상

```css
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error:   #EF4444;
--color-info:    #6366F1;
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
/* 주 서체 — 한글 가독성 최적화 */
--font-sans: 'Pretendard Variable', 'Pretendard',
             -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* 숫자 전용 모노스페이스 — 시세/XP 데이터 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

### 3.2 타입 스케일

| 변수 | 크기 | 용도 |
|------|------|------|
| `--text-xs` | 12px | 라벨, 캡션, 뱃지 텍스트 |
| `--text-sm` | 14px | 보조 텍스트, 뉴스 출처 |
| `--text-base` | 16px | 본문, 종목명 |
| `--text-lg` | 18px | 강조 본문, 등락금액 |
| `--text-xl` | 20px | 소제목 |
| `--text-2xl` | 24px | 섹션 제목, 주요 시세 |
| `--text-3xl` | 30px | 페이지 제목 |
| `--text-4xl` | 36px | 대형 시세 표시 |
| `--text-5xl` | 48px | 랜딩 히어로 텍스트 |

### 3.3 시세 데이터 타이포그래피 규칙

숫자가 핵심인 데이터는 반드시 `font-mono` 적용으로 자릿수 정렬 보장.

```
현재가 (대형):   font-mono, text-3xl ~ text-4xl, font-bold
현재가 (카드):   font-mono, text-xl ~ text-2xl, font-bold
등락 금액:       font-mono, text-base, font-medium
등락률 (%):      font-mono, text-sm ~ text-base, font-semibold
거래량:          font-mono, text-xs ~ text-sm, color: text-secondary
XP 숫자:         font-mono, color: --color-xp, font-bold
```

---

## 4. 간격 및 레이아웃 시스템

### 4.1 간격 스케일

```
4px  (gap-1)  — 아이콘↔텍스트 최소 간격
8px  (gap-2)  — 인라인 요소 간격
12px (gap-3)  — 카드 내부 요소 간격
16px (gap-4)  — 카드 패딩, 섹션 내 여백
20px (gap-5)  — 컴포넌트 간 기본 간격
24px (gap-6)  — 카드 그리드 간격
32px (gap-8)  — 주요 섹션 간격
48px (gap-12) — 페이지 내 대섹션 간격
64px (gap-16) — 페이지 상하 여백
```

### 4.2 그리드 시스템

```
모바일  (< 768px):    1열, 좌우 패딩 16px
태블릿  (768~1024px): 2열, 좌우 패딩 24px
데스크탑(1024~1280px): 3열, 좌우 패딩 32px
와이드  (> 1280px):   4열, max-width 1440px 중앙 정렬
```

### 4.3 카드 구조 원칙

```
배경:      bg-surface (#0F1420)
보더:      1px solid border-subtle (rgba white 6%)
반경:      rounded-xl (12px) 기본, rounded-2xl (16px) 강조 카드
패딩:      p-4 (16px) 기본, p-6 (24px) 넓은 카드
호버:      bg-elevated + border-default + 미묘한 accent 글로우
그림자:    0 4px 24px rgba(0,0,0,0.4)
```

---

## 5. 글래스모피즘 & 시각 효과

### 5.1 글래스 카드 변형

```css
/* 기본 글래스 카드 */
.glass-card {
  background: rgba(15, 20, 32, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* 강조 글래스 카드 (특별 섹션) */
.glass-card-accent {
  background: rgba(99, 102, 241, 0.08);
  backdrop-filter: blur(16px) saturate(200%);
  border: 1px solid rgba(99, 102, 241, 0.25);
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.12),
              inset 0 1px 0 rgba(255,255,255,0.05);
}

/* 긴급 뉴스 카드 */
.glass-card-urgent {
  background: rgba(255, 71, 87, 0.07);
  border: 1px solid rgba(255, 71, 87, 0.28);
  box-shadow: 0 0 16px rgba(255, 71, 87, 0.10);
}
```

### 5.2 네온 글로우 효과

```css
/* 상승 데이터 글로우 */
.glow-rise {
  text-shadow: 0 0 8px rgba(255, 71, 87, 0.9),
               0 0 20px rgba(255, 71, 87, 0.5);
}

/* 하락 데이터 글로우 */
.glow-fall {
  text-shadow: 0 0 8px rgba(30, 144, 255, 0.9),
               0 0 20px rgba(30, 144, 255, 0.5);
}

/* 브랜드 액센트 박스 글로우 */
.glow-accent {
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5),
              0 0 32px rgba(99, 102, 241, 0.20);
}

/* XP 골드 글로우 */
.glow-xp {
  text-shadow: 0 0 8px rgba(255, 215, 0, 1.0),
               0 0 24px rgba(255, 215, 0, 0.6);
}
```

### 5.3 그라디언트 패턴

```css
/* 브랜드 그라디언트 */
--gradient-brand: linear-gradient(135deg, #6366F1 0%, #22D3EE 100%);

/* 상승 그라디언트 */
--gradient-rise: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);

/* 하락 그라디언트 */
--gradient-fall: linear-gradient(135deg, #1E90FF 0%, #5DADE2 100%);

/* XP 골드 그라디언트 */
--gradient-xp: linear-gradient(90deg, #F59E0B 0%, #FFD700 50%, #FFA500 100%);

/* 배경 앰비언트 조명 효과 */
--gradient-ambient:
  radial-gradient(ellipse 60% 40% at 20% 50%,
    rgba(99, 102, 241, 0.07) 0%, transparent 70%),
  radial-gradient(ellipse 50% 35% at 80% 20%,
    rgba(34, 211, 238, 0.05) 0%, transparent 70%);
```

---

## 6. 애니메이션 시스템 (Framer Motion)

### 6.1 트랜지션 프리셋

```typescript
// src/lib/animations/transitions.ts
export const transitions = {
  fast:    { duration: 0.15, ease: 'easeOut' },
  default: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  smooth:  { duration: 0.40, ease: [0.4, 0, 0.2, 1] },
  spring:  { type: 'spring', stiffness: 300, damping: 25 },
  bouncy:  { type: 'spring', stiffness: 400, damping: 18 },
} as const;
```

### 6.2 공통 Variants

```typescript
// 페이지 진입
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit:    { opacity: 0, y: -8, transition: transitions.fast },
};

// 카드 리스트 stagger
export const listContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
export const listItemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: transitions.default },
};

// XP 획득 플로팅 텍스트
export const xpFloatVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: {
    opacity: 0, y: -44, scale: 1.25,
    transition: { duration: 1.2, ease: [0.0, 0.0, 0.2, 1] },
  },
};

// 뱃지 획득 전체화면 축하
export const badgeCelebrationVariants = {
  initial: { scale: 0, rotate: -12, opacity: 0 },
  animate: {
    scale: 1, rotate: 0, opacity: 1,
    transition: transitions.bouncy,
  },
  exit:    { scale: 0.8, opacity: 0, transition: transitions.fast },
};

// 레벨업 펄스
export const levelUpVariants = {
  animate: {
    scale: [1, 1.35, 1],
    filter: [
      'brightness(1)',
      'brightness(2.2) drop-shadow(0 0 16px #6366F1)',
      'brightness(1)',
    ],
    transition: { duration: 0.9, ease: 'easeInOut' },
  },
};
```

### 6.3 특수 효과

```typescript
// 실시간 업데이트 펄스 링
export const pulseRingVariants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(99, 102, 241, 0.5)',
      '0 0 0 10px rgba(99, 102, 241, 0)',
    ],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeOut' },
  },
};

// 시세 틱 업데이트 배경 깜빡임
export const priceTickVariants = {
  rise:    { backgroundColor: ['rgba(255,71,87,0.25)', 'rgba(255,71,87,0)'] },
  fall:    { backgroundColor: ['rgba(30,144,255,0.25)', 'rgba(30,144,255,0)'] },
};
// transition: { duration: 0.5, ease: 'easeOut' }

// 스트릭 불꽃 흔들림
export const streakFireVariants = {
  animate: {
    scaleY: [1, 1.12, 0.94, 1.06, 1],
    scaleX: [1, 0.94, 1.06, 0.97, 1],
    transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
  },
};

// 마켓 티커 무한 스크롤
export const tickerVariants = {
  animate: {
    x: ['0%', '-50%'],
    transition: { duration: 30, repeat: Infinity, ease: 'linear' },
  },
};
```

---

## 7. 컴포넌트 디자인 스펙

### 7.1 네비게이션

#### 사이드바 (데스크탑 lg+)
```
너비:         240px (확장) / 68px (아이콘만, 축소)
배경:         bg-surface + 우측 border-subtle
로고 영역:    64px 높이, PulseM 브랜드 그라디언트 텍스트
네비 아이템:  높이 44px, px-3, rounded-lg
  활성:       bg-accent-primary/10, border-l-2 border-accent-primary, text-accent-primary-light
  비활성:     text-secondary, hover: bg-white/5 text-primary
하단 고정:    사용자 레벨+닉네임 + 설정 아이콘
```

#### 바텀 탭 (모바일, md 미만)
```
높이:         64px + safe-area-inset-bottom
배경:         glass-card (blur 16px)
상단 보더:    border-t border-subtle
탭 구성:      홈 / 시장 / 뉴스 / 퀘스트 / 프로필 (5탭)
아이콘:       24px Lucide React
  활성:       accent-primary + 상단 2px accent 인디케이터 + scale-110
  비활성:     text-muted
레이블:       text-xs, 아이콘 하단 4px
```

### 7.2 시세 카드

#### 종목 카드 (기본, 목록 내)
```
높이:        min 72px
패딩:        px-4 py-3
좌측:        종목코드(text-xs text-muted) + 종목명(text-sm font-medium)
우측:        현재가(font-mono text-lg font-bold) + 등락률(font-mono text-sm)
등락 색상:   상승=#FF4757 / 하락=#1E90FF / 보합=#8892A4
업데이트:    가격 변경 시 배경 priceTickVariants 0.5초 애니메이션
관심 버튼:   우측 끝 ♥ 아이콘, 활성=accent-primary
```

#### 주요 지수 카드 (대형 히어로 영역)
```
크기:        min-w 160px, h 100px
배경:        glass-card-accent (지수별 색상)
  코스피:    indigo accent
  코스닥:    cyan accent
  비트코인:  amber accent
  달러:      green-teal accent
지수명:      text-xs text-muted 상단 좌측
현재값:      font-mono text-2xl font-bold 중앙
등락률:      text-sm 하단, 상승/하락 색상
실시간 점:   우상단 2px 펄스 링 (연결 상태 표시)
```

### 7.3 XP 및 레벨 UI

#### 레벨 배지
```
형태:        원형 (border-radius 50%)
크기:        32px (인라인) / 48px (카드) / 72px (프로필 대형)
배경:        브랜드 그라디언트
테두리:      2px solid rgba(255,215,0,0.6) + glow-xp
숫자:        font-mono font-bold text-inverse
```

#### XP 진행 바
```
트랙 높이:   6px (컴팩트) / 10px (기본)
트랙 배경:   bg-overlay, rounded-full
채움:        브랜드 그라디언트 (인디고→시안)
채움 끝단:   2px blur 글로우
퍼센트 텍스트: 우측 text-xs text-muted
애니메이션: XP 획득 시 width 트랜지션 0.7s spring
```

#### XP 플로팅 텍스트 컴포넌트
```
텍스트:      "+{n} XP" 형식
색상:        --color-xp + glow-xp
크기:        text-sm font-bold font-mono
위치:        트리거 요소 기준 절대 위치, 위로 44px 이동 후 사라짐
지속:        1.2초
z-index:     toast 레이어 (z-50)
```

### 7.4 뱃지 카드

```
형태:        육각형 SVG 클립 또는 rounded-2xl 정사각
크기:        80×96px (그리드) / 48×48px (컴팩트 목록)
아이콘:      48px 이모지 또는 커스텀 SVG (가운데 정렬)
뱃지명:      text-xs text-center 하단, 2줄 이내
등급 테두리: 등급별 색상 2px solid
미획득:      filter: grayscale(1) brightness(0.4)
획득:        등급별 색상 글로우 + 획득일 툴팁
전설 뱃지:   골드 글로우 + 2초 주기 회전 광택 애니메이션 (Framer shimmer)
```

### 7.5 퀘스트 카드

```
배경:        glass-card
레이아웃:    grid grid-cols-[40px_1fr_auto] gap-3 items-center
아이콘 영역: 40px 원형, quest-active/10 배경, 이모지/아이콘
중앙:        퀘스트 제목(text-sm font-medium) + 진행바(h-1.5 rounded-full)
우측:        XP 보상(text-xs font-mono text-xp) + 완료 체크(text-quest-complete)
완료:        체크마크 스프링 애니메이션 + 카드 배경 quest-complete/5 변경
```

### 7.6 뉴스 카드

```
레이아웃:    수직 flex, gap-2
중요도 뱃지: rounded-full text-xs px-2 py-0.5
  긴급:     bg-rise/15 text-rise border border-rise/35
  주요:     bg-amber/15 text-amber border border-amber/35
  일반:     bg-white/5 text-secondary
헤드라인:   text-sm font-medium line-clamp-2
메타:       text-xs text-muted (출처 · 시간)
읽음 처리:  opacity-60, 헤드라인 text-muted
북마크:     우측 하단 아이콘 버튼
```

### 7.7 버튼 시스템

```
Primary (브랜드):
  bg: 브랜드 그라디언트  text: text-inverse font-semibold
  패딩: px-6 py-3  반경: rounded-xl
  hover: brightness-110 + shadow-lg shadow-accent-primary/30
  active: scale-95 spring

Secondary (보조):
  bg: bg-white/8  border: border-default
  text: text-primary  hover: bg-white/14

Ghost (고스트):
  bg: transparent  hover: bg-white/6
  text: text-secondary  hover: text-primary

Danger (위험):
  bg: bg-error/10  border: border-error/35  text: text-error

Icon Button:
  크기: 36×36 (sm) / 44×44 (md)
  배경: bg-white/5  hover: bg-white/10  active: bg-white/15
  반경: rounded-xl  hover: scale-105 spring
```

---

## 8. 페이지별 레이아웃

### 8.1 메인 대시보드

```
[헤더 바]  h-16  logo | 검색 | 알림(뱃지) | 아바타
   ↓
[마켓 티커 배너]  h-10  무한 스크롤 종목 리스트
   ↓
[4대 지수 히어로 그리드]  2×2 (모바일) / 1×4 (데스크탑)
  코스피 / 코스닥 / BTC / USD/KRW
   ↓
[오늘의 XP 현황 카드]
  레벨 배지 + 진행바 + 오늘 +XP + 스트릭 🔥N일
   ↓
[오늘의 퀘스트]  3개 퀘스트 카드 (수직 스택)
   ↓
[관심 종목]  종목 카드 리스트 (최대 5개) + 더보기 링크
   ↓
[오늘의 주요 뉴스]  뉴스 카드 3개 + 전체 보기
   ↓
[코인 TOP 5]  업비트 거래대금 기준
```

### 8.2 시장 페이지

```
[카테고리 탭]  국내주식 | 코인 | 글로벌 | 부동산
   ↓
[탭 1 — 국내주식]
  코스피/코스닥 지수 카드 (2열)
  [검색 바]
  [정렬/필터] 시총순 | 등락률순 | 거래량순
  [종목 리스트] 가상화 목록 (최대 3000종목)

[탭 2 — 코인]
  글로벌 시총 + BTC 도미넌스 + 공포탐욕지수
  김치 프리미엄 실시간
  업비트 KRW 마켓 전종목

[탭 3 — 글로벌]
  미국 3대 지수 (다우/S&P 500/나스닥)
  주요 환율 (USD/EUR/JPY/CNY)
  원자재 (금/은/원유)

[탭 4 — 부동산]
  지역 선택 드롭다운
  아파트 실거래가 목록
  규제 현황 배지
  청약 캘린더
```

### 8.3 프로필 페이지

```
[프로필 헤더]
  아바타(64px) + 닉네임 + 레벨 배지(48px)
  총 XP | 랭킹 | 가입일

[레벨 진행 카드]
  현재 레벨명 + XP 진행바 + 다음 레벨까지 N XP

[스트릭 카드]
  🔥 연속 출석 N일 + 주간 달력 히트맵

[통계 그리드]  2×2
  뉴스 읽기 수 | 퀘스트 완료 | 뱃지 획득 | 관심 종목 수

[뱃지 컬렉션]
  획득 뱃지 그리드 6열 + 미획득 잠금
  [더 보기] → 전체 뱃지 목록

[주간 활동 히트맵]
  52주 × 7일 잔디 형태 (GitHub 스타일, 다크 테마)

[랭킹 카드]
  전체 순위 | 주간 순위 탭
  TOP 10 리스트 + 내 순위 고정 표시
```

---

## 9. 반응형 전략

### 9.1 브레이크포인트

```
sm:  640px   태블릿 소형
md:  768px   태블릿
lg:  1024px  노트북 (사이드바 전환)
xl:  1280px  데스크탑
2xl: 1536px  와이드 모니터
```

### 9.2 모바일 퍼스트 원칙

- 기본 스타일 = 375px 기준 1열 레이아웃
- `md:` 이상에서 멀티컬럼 그리드 전환
- `lg:` 이상에서 바텀탭 → 사이드바 전환
- 카드 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### 9.3 터치 인터랙션

- 모든 터치 타겟: 최소 44×44px
- 스와이프: 탭 전환, 카드 관심 추가/삭제
- 풀 투 리프레시 (PTR): 시세 페이지
- 피드백: 클릭 시 scale-95 spring 애니메이션

---

## 10. 아이콘 & 이미지 가이드

### 10.1 아이콘 시스템

- **라이브러리:** Lucide React (일관된 선형 스타일, 트리쉐이킹)
- **크기:** 16px (xs) / 20px (sm) / 24px (md) / 32px (lg)
- **컬러:** 컨텍스트에 따라 `text-muted` / `text-secondary` / `text-primary` / `accent` 색상
- **투자 전용:** 커스텀 SVG (`/public/icons/`) — 캔들차트, 코인, 아파트 등

### 10.2 이미지 최적화

- Next.js `<Image>` 컴포넌트 필수 사용
- 포맷: WebP 우선, PNG 폴백
- lazy loading 기본, critical 이미지 priority 속성
- 아바타: 32px / 48px / 64px 3가지 규격만 사용
- 코인 로고: CoinGecko 이미지 URL + 로컬 fallback SVG

---

## 11. 디자인 QA 체크리스트

### 컴포넌트 품질
- [ ] 모든 카드 border-radius 통일 (12px 또는 16px)
- [ ] 간격 체계 일관성 (8의 배수 원칙 준수)
- [ ] 텍스트 대비율 WCAG AA 이상 (4.5:1)
- [ ] 빈 상태 (empty state) UI 모든 목록에 구현
- [ ] 로딩 스켈레톤 모든 비동기 컴포넌트에 구현
- [ ] 에러 상태 UI (네트워크 오류, 데이터 없음)

### 애니메이션 품질
- [ ] `prefers-reduced-motion` 미디어 쿼리 대응
- [ ] 모든 애니메이션 GPU 가속 속성만 사용 (transform, opacity)
- [ ] 60fps 유지 확인 (Chrome DevTools Performance 탭)
- [ ] 애니메이션 지속 시간 > 400ms 없도록 제한 (XP 플로팅 제외)

### 모바일 품질
- [ ] iOS safe area 대응 (`env(safe-area-inset-*)`)
- [ ] 키보드 팝업 시 레이아웃 붕괴 없음
- [ ] 폰트 최소 12px 이상 (모바일 가독성)
- [ ] 이미지 깨짐 없이 반응형 조정

### 다크 테마 전용 확인
- [ ] `<html class="dark">` 고정 설정 확인
- [ ] 라이트 배경색이 노출되는 엣지케이스 없음
- [ ] 이미지/아이콘 밝기 다크 배경에서 자연스러움
