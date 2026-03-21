# Skill: safety-guardrails — 파괴적 명령어 보호

**트리거:** 위험 명령 실행/중요 파일 수정 시 자동 호출
- Step 1: rm -rf, DROP TABLE 등 감지 → 경고
- Step 2: 필요 시 파일 수정 잠금
- Step 3: 보호 상태 유지, 완료 후 해제
*규칙:* 안전 모드 기본 활성화. override 시 사전 승인 필수.
