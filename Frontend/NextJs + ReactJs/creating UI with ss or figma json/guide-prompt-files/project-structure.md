# Project Structure

This guide contains relevant information about project structure. Please note it precisely.
This project follows a **feature-based architecture**.
Generic code lives in global folders, while **feature-specific logic lives inside `src/features`**.

---

# public

Static assets served directly by the browser.

```
public
 ├─ assets
 │   ├─ common
 │   └─ [feature]
 └─ favicons
```

Rules:

- Global assets → `assets/common`
- Feature assets → `assets/[feature]`

---

# src

```
src
 ├─ app
 ├─ components
 ├─ lib
 ├─ services
 ├─ types
 ├─ config
 └─ features
```

---

# app (Next.js routing)

Contains **routes only**.

Rules:

- No business logic
- Only import views from features

Example:

```tsx
import UsersView from "@/features/users/views/users.view";

export default function Page() {
  return <UsersView />;
}
```

---

# components (global components)

```
components
 ├─ ui
 └─ custom
```

### ui

Reusable **design system components**

Examples:

```
Button
Input
Modal
Dropdown
```

Rules:

- No business logic
- Fully reusable

---

### custom

Reusable components used across features but not purely UI.

Examples:

```
DataTable
Pagination
FileUploader
```

---

# lib (global utilities)

Utilities shared across features.

Examples:

```
api-client.ts
date.ts
utils.ts
validators.ts
```

Rule:

If a utility is feature-specific, keep it inside the feature.

---

# config

Application configuration.

Examples:

```
env.ts
routes.ts
constants.ts
```

---

# types (global types)

Global reusable types.

Examples:

```
ApiResponse<T>
PaginatedResponse<T>
ErrorResponse
```

Feature-specific types should stay inside the feature.

---

# services (global API setup)

Shared API configuration.

Examples:

```
http.ts
interceptors.ts
```

Typically includes:

- axios/fetch client
- auth interceptors
- token refresh logic

---

# features (core architecture)

All domain logic lives here.

```
features
 └─ [feature-name]
```

Example:

```
features
 ├─ users
 ├─ auth
 ├─ products
 └─ orders
```

Each feature is **self-contained**.

---

# Feature Structure

```
features
 └─ users
     ├─ views
     ├─ components
     ├─ hooks
     ├─ queries
     ├─ mutations
     ├─ services
     ├─ types
     ├─ utils
     └─ query-keys.ts
```

---

# views

Page-level containers used by `app`.

Example:

```
views
 ├─ UsersView.tsx
 └─ UserDetailsView.tsx
```

---

# components

Components used only inside the feature.

Example:

```
components
 ├─ UserCard.tsx
 ├─ UserTable.tsx
 └─ user-details
```

---

# hooks

Feature-specific React hooks.

Example:

```
hooks
 ├─ useUsers.ts
 └─ useUserDetails.ts
```

Responsibilities:

- state logic
- combine queries
- derived data

---

# queries (TanStack Query)

Responsible only for **fetching data**.

Example:

```ts
export const useUsersQuery = () =>
  useQuery({
    queryKey: usersQueryKeys.list(),
    queryFn: usersService.getUsers
  });
```

---

# mutations (TanStack Query)

Responsible for **creating/updating/deleting data**.

Example:

```ts
export const useCreateUserMutation = () =>
  useMutation({
    mutationFn: usersService.createUser
  });
```

---

# services (feature API layer)

Handles API calls for the feature.

Example:

```ts
export const usersService = {
  getUsers: () => apiClient.get("/users"),
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post("/users", data)
};
```

Purpose:

- keep queries clean
- reuse API logic
- easier testing

---

# types (feature types)

Feature-specific types.

---

# utils

Feature-specific helper functions.

---

# query-keys

Centralized **TanStack Query keys**.

Example:

```ts
export const usersQueryKeys = {
  all: ["users"],
  list: () => [...usersQueryKeys.all, "list"],
  detail: (id: string) => [...usersQueryKeys.all, "detail", id]
};
```

---

# Sub-feature Pattern (optional)

For large features, group logic by sub-feature. Basically implementation of layered structure for each feature inside my root featured structure.

Example:

```
users
 ├─ components
 │   ├─ users-list
 │   └─ user-details
 ├─ queries
 │   ├─ users-list
 │   └─ user-details
```

---

# Data Flow

Typical request flow:

```
View
 → Hook
 → Query / Mutation
 → Service
 → API Client
```

---

# Naming Conventions

Follow these naming rules:

**Components**

```
PascalCase.tsx (e.g. UserCard.tsx)
```

**Functions / utilities**

```
camelCase.ts (e.g. formatUserName.ts)
```

**Hooks**

```
usePascalCase.ts (e.g. useUsers.ts)
```
