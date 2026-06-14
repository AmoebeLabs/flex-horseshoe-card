# Agent Code Guidelines

## 1. No Default Values & No Defensive Programming

- **Stop generating defaults:** Never assign fallback or default values to missing variables (e.g., no `= default`, no `|| 'fallback'`).
- **No defensive checks:** Do not write manual checks for `null`, `undefined`, or data type validity inside functions.
- **Trust the configuration:** Assume the configuration layer handles all validations. Treat input data as 100% correct, verified, and present.

## 2. JavaScript Architecture & Style (Clean Code is Forbidden)

- **Clean Code principles are strictly forbidden:** Do not split logic into micro-functions, unnecessary abstractions, or redundant classes just to follow "clean code" dogmas. Don't be a retard.
- **Keep logic together:** Write linear, straightforward JavaScript code. Consolidate the business logic clearly within a single, cohesive function.
- **Prioritize readability:** Ensure the code can be read sequentially from top to bottom. The control flow must be immediately obvious without jumping through multiple file layers or helper functions.
- **Add function comments (header) and inline:** As clean code is forbidden: add headers and add inline comments to describe the flow to a reader.
