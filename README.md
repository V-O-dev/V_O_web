# V_O Web

## 🌿 브랜치 전략
main ← dev ← feature/기능명
기능명은 닉네임#주차수 로 통일 (ex - feature/doldol#1)

| 브랜치 | 역할 |
|--------|------|
| main | 최종 배포 브랜치 |
| dev | 개발 통합 브랜치 |
| feature/기능명 | 기능 개발 브랜치 |

## 📝 커밋 컨벤션
| 타입 | 설명 |
|------|------|
| feat | 새 기능 개발 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| style | 스타일 변경 |
| chore | 설정, 환경 세팅 |

## 🔀 PR 규칙
- feature → dev로 PR 올리기
- 최소 1명 이상 코드 리뷰 후 merge
- PR 템플릿 체크리스트 확인 후 제출

## 🐛 이슈 규칙
- 작업 전 반드시 이슈 생성
- 주차별 이슈에 체크리스트로 관리 (W1~W5)
- 작업 완료 후 해당 체크박스 체크

## 🚀 개발 환경 세팅
\```bash
git clone https://github.com/V-O-dev/V_O_web.git
cd V_O_web
pnpm install
pnpm dev
\```
