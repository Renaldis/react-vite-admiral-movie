---
description: Migrate all modules from repomix to the src directory
---

# Migrate Modules Command

This command orchestrates the migration of all modules found in the `repomix` directory.

## Repomix Module Structure

Each module in `repomix/modules/<name>/` contains up to 3 files:

| File | Type | Purpose |
|------|------|---------|
| `meta.xml` | metadata | Module info, directory structure, generation order, endpoints, conventions. **Not migrated as code.** |
| `01_<name>.xml` | `root` | Main source code: pages, components, hooks (JSX/JS prototype) |
| `02_<name>_mirage.xml` | `mirage` | MirageJS mock: route handlers (`src/mirage/routes/`) + seed/dummy data (`src/mirage/seeds/`) |

### Mirage XML Content (`_mirage.xml`) — Reference Only

The `_mirage.xml` files are **NOT migrated as code**. They are read as a **reference** to extract:

1. **Route handlers** → API endpoints (method + path) used to build `src/api/[module]/index.ts`
2. **Seed data** → field names, types, and sample values used to build `src/api/[module]/type.ts`, form fields, and table columns

## Steps

1.  **Sync Backlog (`MIGRATION.md`)**:
    -   Check if `MIGRATION.md` exists in the project root.
    -   Scan `repomix/modules/` for subdirectories containing `*.xml` files.
    -   Group files by module (folder name). Each module can have multiple XML bundles.
    -   **If `MIGRATION.md` is missing**:
        -   Create it with the header `# Migration Backlog`.
        -   Add a table with columns: `Status`, `Module Name`, `File Path`.
        -   Populate with one row per module using the root XML path (`01_<name>.xml`), default status: `[ ] Pending`.
        -   Exclude `meta.xml` and `_mirage.xml` from the table (mirage is read as reference automatically).
    -   **If `MIGRATION.md` exists**:
        -   Parse it to find which modules/files are already listed.
        -   Append any newly found XML files that are not yet in the backlog as `[ ] Pending`.
    -   *Display the current backlog status to the user.*

2.  **Process Modules**:
    -   Iterate through the modules listed in `MIGRATION.md`.
    -   **Filter** for modules with status `[ ] Pending` (or allow user to select specific ones).
    -   For **EACH** selected module:
        -   **Update Status**: Mark the module as `[/] Migrating` in `MIGRATION.md`.
        -   **Execute Agent**: Run the `migration-agent` (@[.claude/agents/migration-agent.md]) with the root XML file path (`01_<name>.xml`).
            -   If a companion `02_<name>_mirage.xml` exists, the agent reads it as **reference** to extract API endpoints, field types, and sample data — but does NOT create mirage files.
        -   **Completion**:
            -   If successful, update `MIGRATION.md` status to `[x] Done`.
            -   If failed, update `MIGRATION.md` status to `[!] Failed` or revert to Pending.
