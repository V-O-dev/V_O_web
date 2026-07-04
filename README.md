<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
=======
# V_O Web

## 👥 Member

| 돌돌 | 시소 | 이브 |
|------|------|------|
| [최서정](https://github.com/bum22) | [민선희](https://github.com/seonhi) | [사석훈](https://github.com/sukhoon912) |

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React, TypeScript |
| Build Tool | Vite |
| 상태 관리 | Zustand |
| HTTP 클라이언트 | Axios |
| 코드 컨벤션 | Biome |

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

>>>>>>> 453a74956a9e863661804da672b2835625c2a824
