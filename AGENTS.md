# OpsBoard Pro – AI Development Rules

## 1. Business Context (Highest Priority)

OpsBoard Pro is an internal operations console for managing:
- Incidents
- Deployments
- Logs
- Role-Based Access Control (RBAC)
- Audit trails

The application is authenticated, role-based, and not SEO-oriented.

All features MUST respect:
- Auditability
- Traceability
- Access control

Business rules always override technical or stylistic rules.

---

## 2. System Architecture (Non-Negotiable)

- The application follows Clean Architecture adapted for Angular.
- Dependency direction is strict and unidirectional:

  Presentation → Application → Domain

- Infrastructure is an outer layer and must NEVER be referenced by UI.

### Forbidden Dependencies
- Domain importing:
  - Angular
  - RxJS
  - HttpClient
  - Browser APIs
  - Any framework-specific code
- Cross-feature imports
- Presentation importing Infrastructure directly

---

## 3. Domain Rules

- Domain code MUST be framework-agnostic.
- Domain MUST NOT depend on Angular, RxJS, HTTP, or browser APIs.

The Domain layer defines ONLY:
- Business models
- Business rules
- Use cases
- Repository interfaces (ports)

The Domain layer contains NO state management and NO side effects.

---

## 4. Feature Architecture (Bounded Contexts)

- Each feature is a bounded context.
- Each feature MUST expose exactly ONE Facade.
- Features MUST be lazy-loaded.
- No feature may depend on another feature directly.

### Mandatory Feature Structure

feature-x/
├── domain/
├── application/
├── presentation/
├── feature-x.routes.ts
└── feature-x.providers.ts


---

## 5. Application Layer

- Each feature exposes a single Facade.
- State management lives exclusively in this layer.
- DTO ↔ Domain mapping MUST occur here.
- Application orchestrates:
  - Use cases
  - State transitions
  - Security decisions (but not enforcement)

The Application layer depends on Domain, never the inverse.

---

## 6. Infrastructure Layer

- All I/O logic lives here:
  - HTTP
  - APIs
  - Storage
  - External services
- Infrastructure implements Domain repository interfaces.
- NO business rules allowed.
- NO UI imports allowed.

Infrastructure is replaceable without affecting Domain or UI.

---

## 7. Presentation Layer

- Pages and containers are smart.
- UI components are dumb by default.
- UI communicates with the Application layer ONLY via Facades.
- UI MUST NOT contain business logic.

Presentation depends on Application, never on Infrastructure.

---

## 8. UI Architecture

- Atomic Design is mandatory.
- Atoms and Molecules:
  - MUST NOT inject services
  - MUST be stateless and reusable
- Organisms and Pages may interact with Facades.

---

## 9. Styling Rules

- Use SCSS and CSS Variables.
- All colors, spacing, and typography use design tokens.
- No inline styles.
- Tailwind is NOT allowed as a base styling solution.

---

## 10. State and Security

- State is feature-scoped.
- Global mutable state is forbidden.
- RBAC and feature flags MUST be enforced via guards.
- All critical actions MUST generate an `AuditEvent`.

Security is enforced at:
- Route level
- Application level
- Never in the Domain

---

## 11. Structure Rules

- No cross-feature imports.
- Shared code lives ONLY in `shared/`.
- Feature folders MUST follow:
  - domain/
  - application/
  - presentation/

Violations of structure are considered architectural defects.

---

## 12. Testing Rules

- Tests must verify behavior, not implementation details.
- Domain logic MUST be tested without Angular TestBed.
- Application logic may be tested with mocked ports.
- UI tests assert inputs, outputs, and accessibility only.