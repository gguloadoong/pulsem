# PulseM — API Specification

## 1. 도메인 모델
```
User { id, email, nickname, level, xp, streak, createdAt }
Watchlist { id, userId, assetId, category, addedAt }
Checkin { id, userId, date, xpEarned }
Quest { id, type, title, xpReward, targetCount }
UserQuest { id, userId, questId, progress, completedAt }
Badge { id, name, icon, description, condition }
UserBadge { id, userId, badgeId, earnedAt }
News { id, title, summary, category, impact, source, publishedAt }
MarketData { id, symbol, name, category, price, change, volume, updatedAt }
```

## 2. REST API 설계
### 인증
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/social` | 소셜 로그인 (카카오/구글) |

### 시장 데이터
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/market?category=stock` | 카테고리별 시장 데이터 |
| GET | `/api/market/:symbol` | 개별 종목 상세 |
| GET | `/api/market/trending` | 트렌딩 키워드 |

### 뉴스
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/news?impact=high` | 뉴스 목록 (필터) |
| GET | `/api/news/:id` | 뉴스 상세 |

### 게이미피케이션
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/checkin` | 출석 체크인 |
| GET | `/api/user/stats` | 사용자 통계 |
| GET | `/api/quests` | 퀘스트 목록 |
| POST | `/api/quests/:id/progress` | 퀘스트 진행 |
| GET | `/api/badges` | 배지 목록 |

### 관심종목
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/watchlist` | 관심종목 목록 |
| POST | `/api/watchlist` | 관심종목 추가 |
| DELETE | `/api/watchlist/:id` | 관심종목 삭제 |

## 3. 인증·인가
- Supabase Auth (이메일/비밀번호 + 카카오/구글 소셜)
- JWT 토큰 (Access: 1시간, Refresh: 7일)
- 익명 모드: 비로그인 상태에서 시장 데이터/뉴스 조회 가능

## 4. 실시간 기능
- Supabase Realtime: 시장 데이터 변동 실시간 구독
- 뉴스 알림: 고임팩트 뉴스 발생 시 푸시 알림

## 5. Rate Limiting & 보안
- API Rate Limit: 100 req/min (인증), 30 req/min (비인증)
- CORS: 허용 도메인 화이트리스트
- 입력 데이터: Zod 스키마 검증

## 6. 외부 데이터 연동
- 한국투자증권 Open API: 주식 실시간 시세
- 업비트 API: 코인 시세
- 공공데이터포털: 부동산 실거래가
- 네이버 금융 RSS: 뉴스 피드

## 7. 목데이터 전략
- MVP 단계: `src/data/mock.ts`에서 정적 데이터 제공
- Phase 2: Supabase seed 데이터 + 실 API 연동
