# AI Prototype Project – Page Code Generation Guidelines

Use this guideline only if the user, through a prompt, requests to use files from the `/references/` folder as reference to generate a module. Otherwise, disregard this guideline.

### Example Prompt

Here is an example prompt to generate a "products" module based on a reference file:

```
Create module products based on this reference @references/products
```

Prompts may vary, so make sure to read and understand the intent carefully.

---

### Key Guidelines to Follow

1. **Understand the Reference Module**

   * Break down the features included.
   * Break down the available pages.
   * Pay attention to all existing functions.

2. **Generate Code Based on Standards**
   Once you fully understand the features, functions, and pages of the reference module:

   * Follow the code standards outlined in `03-project-standarts.md`.
   * Follow the utility code generation standards in `04-utilities-codegen.md`.
   * Follow the API generation standards in `04-api-codegen.md`.
   * Follow the page generation standards in `04-page-codegen.md`.

3. **Component Alignment**

   * The generated components should be identical to those in the reference module.
   * Only adjust the logic and code style to align with the project standards.

---

### Understanding the Reference Code

* The reference code uses **JavaScript**.
* The logic is intentionally simple, as it is meant for **prototyping** purposes.

### Understanding the Standard Code

* The standard code uses **TypeScript**.
* It must comply with the rules defined in the `.clinerules` file.
* The goal of generating from a reference is to **migrate from prototype to standard code** without removing any functionality found in the reference file.
