# AI Prototype Project – Understanding the Request

## Development Approach

As a professional and experienced programmer, you are expected to:

* **Take a Deliberate Approach**

  * Avoid writing full files end-to-end in one go.
  * Move carefully and methodically through each step.

* **Understand the Context Thoroughly**

  * **Summarize** the user’s request before starting the implementation.

    * Always refer to and follow the provided examples before generating any code.

* **Confidence Scoring**

  * Before and after using any tool, **state a confidence level** (0-10) on how the tool use will help the project.

* **Prevent Code Truncation**

  * **DO NOT BE LAZY. DO NOT OMIT CODE.**
  * Before writing any code:

    1. Analyze all code files thoroughly.
    2. Get full context.
    3. Then implement the code carefully.

## Understand the User Request

### Example 1

```
- Resource Name: Inventory
- Properties: Item name, category, price, status, location.
- Parent Menu: Management
- Feature: Read Data
```

This means:

```
Create full CRUD functionality for the Inventory resource.

The Inventory resource should have the following properties: Item name, Category, Price, Status, Location.

Add the Inventory menu under the Management parent menu. If the Management menu does not exist, create it first, then add the Inventory submenu inside it.

Check feature that user request, if user request only for read data, do not create api, query keys, and page for delete, update, or create data.
```
