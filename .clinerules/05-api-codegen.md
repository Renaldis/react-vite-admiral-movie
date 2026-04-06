# AI Prototype Project – API Generation Guidelines

This guide provides the structure and standards for generating API definitions in the AI Prototype project. Please follow these conventions strictly to maintain consistency and quality across the codebase.

---

## 1. Before Creating API Definitions

If a resource is part of a **parent menu**, use the following directory structure:

* **Path Format:** `src/api/[parent]/[resource]/index.ts`
* **Example:** `src/api/managements/inventories/index.ts`
* **Important:** 
  * Refer to the existing example files. Do **not** implement extra functions or features that are not explicitly included in the examples.
  * Understand the user request. If user only request for read data, don't create api definition for create and update

---

## 2. Define the Resource API

Defines how the data for a given resource is structured, requested, and handled.

### API Type Definitions

* **Location:** `src/api/[resource]/type.ts`
* **Example Reference:** `src/api/examples/type.ts`

#### Expected Response Shape – List Data

```json
{
  "status_code": 200,
  "data": {
    "items": [
      {
        "id": "1",
        "created_at": "2023-10-01T00:00:00.000Z",
        "updated_at": "2023-10-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "total_page": 1,
      "total": 2,
      "page": 1,
      "per_page": 10
    }
  },
  "version": "1.0.0"
}
```

#### Expected Response Shape – Detail Data

```json
{
  "status_code": 200,
  "data": {
    "id": "1",
    "created_at": "2023-10-01T00:00:00.000Z",
    "updated_at": "2023-10-01T00:00:00.000Z"
  },
  "version": "1.0.0"
}
```

### API Request Implementations

* **Location:** `src/api/[resource]/index.ts`
* **Example Reference:** `src/api/examples/index.ts`

### Naming and Formatting Guidelines

* Use `snake_case` for all API fields (requests and responses).
* Type definitions, request bodies, and responses must be in **English**.
* Use **realistic and meaningful** example data:

  * **Incorrect:** `{ "title": "Song 1", "artist": "Artist 1" }`
  * **Correct:** `{ "title": "Bohemian Rhapsody", "artist": "Queen" }`

---

## 3. Final Notes

Always adhere to the provided structure and examples when introducing a new API resource. Consistency ensures maintainability, readability, and overall quality of the project.

When in doubt, **review the examples before proceeding**.

