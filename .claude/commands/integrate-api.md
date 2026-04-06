---
description: Integrate API for a module from MIGRATION.md
---

# Integrate API Command

Scans `MIGRATION.md` to display all modules and their API integration status, then guides the user to integrate a selected module.

## Workflow

### Step 1: Scan MIGRATION.md

Read `MIGRATION.md` and parse the **Modules** table.

### Step 2: Display ALL Modules

Show ALL modules from the table with columns:
- Module Name
- Migration status
- API Integration status
- API Type
- API Doc File

Include a legend explaining:
- `API Doc File = -` means no API documentation available
- `API Type = Local` means using local mock data
- `API Integration = N/A` means cannot integrate (no API doc)

### Step 3: Ask User to Select Module

Prompt: "Which module do you want to integrate? (enter number or name)"

Allow multiple selection (e.g., "1, 3, 5" or "data-uploads, descriptions").

### Step 4: Ask API Type

Prompt: "Which API type do you want to use?"

Options:
1. **Real** - Use `api` from `@/libs/axios/api` (production endpoint with auth)
2. **Mock** - Use `apiMock` from `@/libs/axios/api` (BE mock endpoint, no auth)

### Step 5: Execute Integration Agent

For **EACH** selected module, use Task tool with these EXACT parameters:

```
Task(
  subagent_type: "api-integration-agent",
  run_in_background: false,  // IMPORTANT: Run in FOREGROUND
  description: "Integrate API for [module-name]",
  prompt: "Read and follow ALL instructions in .claude/agents/api-integration-agent.md

Execute the integration with these inputs:
- MODULE_PATH: src/api/[module-name]
- API_DOC_PATH: docs/api/modules/[API Doc File]
- FETCHER: [api|apiMock]

You MUST complete ALL 10 steps in the agent instructions."
)
```

The agent will:
1. Read API documentation and schemas
2. Update `type.ts` with exact API types
3. Update `index.ts` with real API calls (no transformation)
4. Find and update ALL dependent files (components, pages, hooks)
5. Update form schemas to match API
6. Update table columns with API field names
7. Run `tsc` and `lint` to verify

### Step 6: Update MIGRATION.md

After successful integration:
1. Set `API Integration` to `Done`
2. Set `API Type` to `Real` or `Mock`
3. Add log entry with date

### Step 7: Summary

Show integration summary from agent:
- Module name
- Endpoints integrated
- Files updated
- Field mappings
- Verification result

## Module Path Mapping

| Module Name | API Path | App Path |
|-------------|----------|----------|
| data-uploads | src/api/data-uploads | src/app/(protected)/data-uploads |
| data-uploads-files | src/api/data-uploads-files | src/app/(protected)/data-uploads-files |
| descriptions | src/api/descriptions | src/app/(protected)/descriptions |

## API Type Reference

| Type | Constant | Import | Description |
|------|----------|--------|-------------|
| Real | `api` | `@/libs/axios/api` | Production BE endpoint (with auth interceptor) |
| Mock | `apiMock` | `@/libs/axios/api` | BE mock endpoint (no auth interceptor) |
| Local | - | - | No endpoint, data in `index.ts` (fallback) |

## Notes

- **Re-integration**: Selecting a module with `API Integration = Done` means re-integration is needed, typically due to:
  - API documentation updates (new fields, changed endpoints, etc.)
  - Switching from Mock to Real API (or vice versa)
  - Bug fixes in the generated API layer
- Re-running will overwrite the existing implementation with the latest API doc
- Always verify the module works after integration

## Parallel Integration

- **1 module = 1 agent**: Each module integration runs in its own agent (FOREGROUND)
- **Multiple modules**: If user selects 5 modules, spawn 5 agents in parallel
- Example: User selects modules 1, 3, 5 → Launch 3 agents simultaneously in single message
- All agents follow `api-integration-agent.md` instructions independently
- After all agents complete, show combined summary of integration results
- **IMPORTANT**: Use `run_in_background: false` for all agents
