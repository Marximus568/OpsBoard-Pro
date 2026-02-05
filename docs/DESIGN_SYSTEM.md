# Design System - OpsBoard Pro

## Philosophy
We use **Atomic Design** to build a scalable and consistent UI. Components are categorized by their complexity and responsibility.

## Atomic Hierarchy

### 1. Atoms
Smallest functional units.
- **Examples**: `BadgeComponent`, `Button`, `Icon`, `Typography`.
- **Constraint**: Must not have external dependencies or state.

### 2. Molecules
Groups of atoms working together.
- **Examples**: `IncidentCardComponent` (Badge + Text).

### 3. Organisms
Complex UI sections composed of molecules and atoms.
- **Examples**: `TopBar`, `Sidebar`, `IncidentListView`.

### 4. Pages
Context-specific templates that combine organisms to form a view.
- **Examples**: `LoginPage`, `IncidentsListPage`.

## Design Tokens
Tokens are managed via CSS variables in `src/styles.scss` and specific files in `assets/styles/`.

### Colors
- `--color-primary-*`: Main brand colors.
- `--bg-primary / --bg-secondary`: Surface colors for dark/light modes.
- `--text-primary / --text-secondary`: Typography colors.

### Spacing & Grid
- Standardized spacing scale: `xs`, `sm`, `md`, `lg`, `xl`.
- Global grid system for responsive layouts.

## Theme Strategy
OpsBoard Pro supports dynamic themes via data-attributes on the `<body>` element.
- Default: **Dark Mode** (Ops-oriented).
