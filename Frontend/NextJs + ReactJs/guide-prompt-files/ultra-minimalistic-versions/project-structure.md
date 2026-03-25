# Project Structure

Feature-based architecture. All domain logic lives in `src/features/[feature]`. Generic/shared code lives in top-level `src/` folders. Feature-specific types, utils, and services always stay inside the feature — never in global folders.

```
src/
├─ app/              # Routes only — no logic, import views from features
├─ components/
│   ├─ ui/           # Pure design-system components (no business logic)
│   └─ custom/       # Reusable cross-feature components
├─ lib/              # Shared utilities
├─ config/           # Env, routes, constants
├─ types/            # Global types only
├─ services/         # Shared API setup (http client, interceptors)
└─ features/
    └─ [feature]/
        ├─ views/        components/    hooks/
        ├─ queries/      mutations/     services/
        ├─ types/        utils/         styles/
        └─ query-keys.ts
```

Flow: `View → Hook → Query/Mutation → Service → API Client`  
Naming: `PascalCase.tsx` components · `usePascalCase.ts` hooks · `camelCase.ts` utils/services  
Sub-features: for large features, nest sub-folders inside `queries/`, `components/`, etc.
