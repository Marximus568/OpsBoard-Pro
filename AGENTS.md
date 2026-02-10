# OpsBoard Pro – AI Development Rules (Enterprise Edition)

## 1. Business Context (Highest Priority)
OpsBoard Pro is a professional-grade internal operations console.
- **Goal**: Auditability, Traceability, and strict RBAC.
- **Rule**: Business requirements ALWAYS override technical convenience.
- **Traceability**: Every critical state change MUST be auditable.

---

## 2. Core Architecture: Enterprise & Clean
We follow a strict mandatory architecture based on Clean Architecture and Atomic Design.

### Mandatory Directory Structure
```
src/app/
├── core/        (Singleton services, interceptors, guards, global config, auth services, logging)
├── shared/      (Atomic Design UI + reusable utilities)
│   └── ui/
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       └── templates/
├── features/    (Lazy-loaded features: auth, dashboard, incidents, deployments, logs, admin, audit)
├── layouts/     (Global layout components: shell, sidenav, topbar, footer)
└── assets/
    └── styles/  (Global design tokens, variables, base themes)
```

### Strategic Dependencies
- **Core**: Only imported by `AppModule`/`app.config.ts`.
- **Shared**: Imported by features as needed.
- **Features**: MUST be lazy-loaded. No cross-feature dependencies.
- **Direction**: Presentation → Application (Facades) → Domain.
- **Infrastructure**: Outer layer implementing Domain interfaces. Invisible to the UI.

---

## 3. Presentation Layer: Atomic Design & Smart/Dumb
We follow a strict **Smart vs Dumb** and **Atomic Design** pattern.

### Smart Components (Pages & Containers)
- **Location**: `features/feature-name/presentation/pages/`
- **Responsibility**: Orchestration.
- **Actions**: Inject Facades, handle routing, manage complex state transitions.
- **Naming**: `*-page.ts` or `*-container.ts`.

### Dumb Components (Atoms, Molecules, Organisms)
- **Location**: `shared/ui/` (global) or `features/feature-name/presentation/components/` (local).
- **Rules**: 
  - NO service injection. 
  - Data via `@Input`. Events via `@Output`.
  - MUST be stateless and reusable.
- **Naming**: Standard `*.component.ts`.

### Strategic Rules
- **Change Detection**: MUST use `ChangeDetectionStrategy.OnPush` everywhere.
- **Performance**: Use `@defer` for non-critical sections and prefetching for heavy routes.
- **Templates**: No inline templates/styles (use `.html` and `.scss`).

---

## 4. State Management (Application Layer)
State lives exclusively in the Application layer, accessed only via **Facades**.

- **Preferred Stack**: `NgRx SignalStore` or `NgRx Global Store`.
- **Facade Pattern**: Each feature MUST expose exactly one facade (e.g., `IncidentsFacade`).
- **Mappers**: Dedicated mappers `DTO ↔ Domain` MUST be used to isolate the UI from the API.

---

## 5. Infrastructure & Critical Concerns

### Centralized Error Handling
- Errors MUST be normalized in the Infrastructure layer.
- UI reacts to error states via Facades/Signals, never via raw HTTP error objects.

### Mandatory Interceptors
- **AuthInterceptor**: Injects tokens into outgoing requests.
- **CorrelationIdInterceptor**: Adds `X-Correlation-Id` for end-to-end traceability.
- **RetryInterceptor**: Implements exponential backoff for transient failures.
- **ErrorNormalizationInterceptor**: Standardizes API errors into domain-friendly types.

### Guards & Security
- **AuthGuard**: Enforces login status.
- **RoleGuard**: Enforces RBAC permissions.
- **FeatureGuard**: Enforces feature flag availability.
- **Location**: All global guards live in `core/guards/`.

---

## 6. Styling & Design Tokens
We use a **Double-Layer Styling** approach.

### Global Layer (`src/assets/styles/`)
- Contains all base design tokens (colors, spacing, shadows, typography).
- Defines the core design system that ensures consistency across the whole app.
- **Note**: Use SCSS variables and CSS variables for tokens.

### Feature Layer (Specialization)
- Each feature component may have its own `.scss` file to *specialize* core tokens.
- **Rule**: Regional styling MUST NOT break global consistency.
- **Pro Style**: Use premium aesthetics (glassmorphism, micro-animations, curated palettes).

---

## 7. Testing Standards
- **Domain**: 100% logic coverage without `TestBed`.
- **Application**: Test facades via mocked repository implementations.
- **Component**: Assert `@Input`/`@Output` contracts and basic rendering.
