---
title: qa-browser
description: 브라우저 기반 QA 테스트 실행 (수동 + Playwright 자동화)
triggers:
  - "qa 테스트"
  - "qa-browser"
  - "브라우저 테스트"
  - "수동 테스트"
  - "playwright"
---

# QA 브라우저 테스트 스킬

## 목적
스테이징 환경에서 기능 테스트, 크로스 브라우저 테스트, 반응형 테스트를 체계적으로 수행하고 결과를 기록한다.

## 트리거 조건
- 스프린트 QA 단계 진입 (스테이징 배포 완료 후)
- 핫픽스 배포 전 스모크 테스트
- 디자인 QA (구현 vs 디자인 비교)
- 프로덕션 배포 후 검증 테스트

---

## 실행 순서

### Step 1: 테스트 환경 준비

**환경 확인:**
```
스테이징 URL: [환경에 따라 설정]
테스트 계정:
  - 일반 유저: test-user@pulsem.io
  - 프리미엄 유저: test-premium@pulsem.io
  - 신규 가입 유저: 매 테스트 시 신규 생성
```

**테스트 기기/브라우저 매트릭스:**
```
데스크톱:
  - Chrome (최신) — macOS
  - Safari (최신) — macOS
  - Chrome (최신) — Windows

모바일 (실기기 우선, 없으면 DevTools):
  - iPhone 14 — Safari iOS
  - Galaxy S23 — Chrome Android
  - iPad Air — Safari iPadOS
```

**사전 체크:**
- [ ] 스테이징 서버 정상 동작 확인
- [ ] 테스트 계정 로그인 가능 확인
- [ ] 테스트 데이터 시드 완료 확인 (BE 확인)
- [ ] PRD 수용 기준 문서 열어두기

### Step 2: 스모크 테스트 (배포 직후, 10분)
핵심 기능만 빠르게 검증:
- [ ] 앱 로딩 정상 (콘솔 에러 없음)
- [ ] 로그인/로그아웃 정상
- [ ] 메인 피드 로딩 정상
- [ ] 실시간 데이터 업데이트 정상
- [ ] 게임화 요소 표시 정상 (XP, 레벨, 배지)

### Step 3: 기능 테스트 (테스트 케이스 기반)

**테스트 케이스 실행 순서:**
1. Happy Path (정상 시나리오) 먼저
2. Negative Test (비정상 입력, 에러 상황)
3. Edge Case (경계값, 특수 상황)
4. 게임화 로직 (XP 지급, 레벨업, 배지 발급)

**각 테스트 케이스 실행 시:**
```
결과 기록:
  - PASS: 기대 결과와 일치
  - FAIL: 기대 결과와 불일치 → 즉시 버그 리포트 작성
  - BLOCK: 선행 조건 미충족으로 실행 불가
  - N/A: 해당 환경에서 적용 불가
```

### Step 4: 반응형 테스트

**각 뷰포트에서 확인:**
- 360px (모바일 소형): 레이아웃 깨짐 없음
- 390px (iPhone 14): 핵심 화면 전체 확인
- 768px (태블릿): 그리드 변환 정상
- 1280px (데스크톱): 풀 레이아웃 정상

**반응형 체크포인트:**
- [ ] 텍스트 잘림(truncation) 없음
- [ ] 버튼/터치 타겟 44px 이상
- [ ] 가로 스크롤 발생 없음
- [ ] 이미지 비율 유지
- [ ] 폰트 크기 읽기 적합 (최소 14px)

### Step 5: 접근성 테스트

**키보드 네비게이션:**
- [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
- [ ] Enter/Space로 버튼 실행 가능
- [ ] Escape로 모달/드롭다운 닫기 가능
- [ ] 포커스 인디케이터 시각적으로 확인 가능

**스크린 리더 (VoiceOver/TalkBack):**
- [ ] 이미지에 alt 텍스트 존재
- [ ] 아이콘 버튼에 레이블 존재
- [ ] 폼 입력 필드에 레이블 연결

### Step 6: 성능 체크
```bash
# Lighthouse CI 실행
npx lighthouse [스테이징 URL] --output=json --output-path=./lighthouse-report.json

# 목표 점수
Performance: 85+
Accessibility: 95+
Best Practices: 90+
SEO: 85+
```

### Step 7: 결과 보고 및 버그 등록
- 발견된 버그 즉시 GitHub Issue 등록
- 심각도(P0~P3) 라벨 부착
- 스크린샷/영상 첨부
- 담당 개발자 멘션

### Step 8: QA 완료 판정
- P0, P1 버그 0개 확인
- 크리티컬 패스 테스트 케이스 100% PASS
- Lighthouse Performance 85+ 확인
- QA 승인 → PM에게 배포 가능 통보

---

## Playwright 자동화 실행

```bash
# 전체 E2E 테스트 실행
npx playwright test

# 특정 스펙만 실행
npx playwright test tests/e2e/auth.spec.ts

# UI 모드로 실행 (디버깅)
npx playwright test --ui

# 크로스 브라우저 실행
npx playwright test --project=chromium --project=firefox --project=webkit

# 리포트 생성
npx playwright show-report
```

---

## 출력 형식

```markdown
# QA 테스트 결과: [스프린트 N / 기능명]
**테스트 일시:** YYYY-MM-DD
**테스터:** 한소희
**환경:** 스테이징 / 프로덕션

## 테스트 실행 결과
| 구분 | 전체 | PASS | FAIL | BLOCK | N/A |
|------|------|------|------|-------|-----|
| 기능 테스트 | X | X | X | X | X |
| 반응형 테스트 | X | X | X | X | X |
| 접근성 테스트 | X | X | X | X | X |
| Playwright E2E | X | X | X | - | - |

## 발견된 버그
| 이슈 | 심각도 | 담당 | 상태 |
|------|--------|------|------|
| #XXX [버그명] | P1 | 정민우 | 수정 중 |

## Lighthouse 점수
Performance: XX / Accessibility: XX / Best Practices: XX / SEO: XX

## 배포 가능 여부
**GO ✅ / NO-GO ❌**
사유: [이유]
```

---

## 규칙
- QA 없이는 프로덕션 배포 승인 불가
- P0 버그 발견 즉시 개발자 + PM에게 Slack DM
- 버그 리포트에 재현 절차 없으면 GitHub 이슈 반려
- 자동화 테스트 실패 시 수동 재현 후 판단
