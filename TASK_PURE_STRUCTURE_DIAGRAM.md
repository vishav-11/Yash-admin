# Pure folder structure (diagram)

> Note: This is based on the visible/known repository structure from the current workspace.

```text
portfolio-admin/
├─ app/
│  ├─ (auth)/
│  │  ├─ layout.tsx
│  │  └─ login/
│  │     └─ page.tsx
│  ├─ (dashboard)/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/
│  │  │  └─ page.tsx
│  │  ├─ projects/
│  │  │  ├─ page.tsx
│  │  │  ├─ create/
│  │  │  │  └─ page.tsx
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx
│  │  │     └─ edit/
│  │  │        └─ page.tsx
│  │  └─ video-projects/
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  ├─ window.svg
│  └─ favicon.ico
├─ src/
│  ├─ app-level (none)
│  ├─ components/
│  │  ├─ feedback/
│  │  │  ├─ index.tsx
│  │  │  └─ LoadingScreen.tsx
│  │  ├─ forms/
│  │  ├─ layout/
│  │  │  ├─ index.tsx
│  │  │  ├─ NavIcon.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ Topbar.tsx
│  │  ├─ providers/
│  │  │  └─ QueryProvider.tsx
│  │  └─ ui/
│  │     ├─ Button.tsx
│  │     ├─ FormField.tsx
│  │     ├─ Input.tsx
│  │     ├─ Label.tsx
│  │     ├─ ToastContainer.tsx
│  │     └─ Login/
│  │        └─ FormField.tsx
│  ├─ config/
│  │  └─ env.config.ts
│  ├─ constants/
│  │  ├─ app.constants.ts
│  │  ├─ media.constants.ts
│  │  ├─ navigation.constants.ts
│  │  ├─ routes.constants.ts
│  │  └─ index.ts
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ index.ts
│  │  │  ├─ components/
│  │  │  │  └─ LoginForm.tsx
│  │  │  ├─ hooks/
│  │  │  │  ├─ useLogin.ts
│  │  │  │  └─ useLogout.ts
│  │  │  ├─ schemas/
│  │  │  │  └─ auth.schema.ts
│  │  │  └─ services/
│  │  │     └─ auth.service.ts
│  │  ├─ dashboard/
│  │  │  ├─ types/dashboard.types.ts
│  │  │  ├─ services/dashboard.service.ts
│  │  │  ├─ hooks/useDashboard.ts
│  │  │  └─ components/
│  │  │     ├─ StatCard.tsx
│  │  │     ├─ RecentActivity.tsx
│  │  │     ├─ StorageWidget.tsx
│  │  │     └─ QuickActions.tsx
│  │  ├─ logos/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ schemas/
│  │  │  └─ services/
│  │  ├─ photos/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ schemas/
│  │  │  ├─ services/
│  │  │  └─ types/
│  │  └─ projects/
│  │     ├─ index.ts
│  │     ├─ components/
│  │     │  ├─ ProjectDeleteDialog.tsx
│  │     │  ├─ ProjectFilters.tsx
│  │     │  ├─ ProjectForm.tsx
│  │     │  ├─ ProjectMediaDeleteDialog.tsx
│  │     │  ├─ ProjectMediaGallery.tsx
│  │     │  ├─ ProjectPagination.tsx
│  │     │  └─ ProjectTable.tsx
│  │     ├─ hooks/
│  │     │  ├─ useCreateProject.ts
│  │     │  ├─ useDeleteProject.ts
│  │     │  ├─ useDeleteProjectMedia.ts
│  │     │  ├─ useProject.ts
│  │     │  ├─ useProjectCategories.ts
│  │     │  ├─ useProjects.ts
│  │     │  └─ useUpdateProject.ts
│  │     ├─ services/project.service.ts
│  │     ├─ types/project.types.ts
│  │     └─ schemas/project.schema.ts
│  ├─ features/videos/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  └─ types/
│  ├─ hooks/
│  │  ├─ index.ts
│  │  ├─ useDebounce.ts
│  │  ├─ useLocalStorage.ts
│  │  ├─ useMediaQuery.ts
│  │  └─ usePagination.ts
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ api.helpers.ts
│  │  │  ├─ axios.instance.ts
│  │  │  └─ endpoints.ts
│  │  ├─ auth/
│  │  │  ├─ auth.guards.ts
│  │  │  └─ token.manager.ts
│  │  └─ query/
│  │     ├─ query.client.ts
│  │     └─ query.keys.ts
│  ├─ stores/
│  │  ├─ auth.store.ts
│  │  ├─ ui.store.ts
│  │  └─ index.ts
│  ├─ types/
│  │  ├─ api.types.ts
│  │  ├─ common.types.ts
│  │  ├─ declarations.d.ts
│  │  └─ index.ts
│  └─ utils/
│     ├─ cn.utils.ts
│     ├─ error.utils.ts
│     ├─ file.utils.ts
│     ├─ format.utils.ts
│     ├─ storage.utils.ts
│     └─ index.ts
├─ AGENTS.md
├─ CLAUDE.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ README.md
└─ tsconfig.json
```

