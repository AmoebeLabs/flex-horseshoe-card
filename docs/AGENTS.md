Documentation rules

- Write from the user's point of view.
- Do not explain internal implementation.
- Do not document every technically supported path.
- Prefer the simplest normal configuration.
- One page = one user-recognizable feature.
- Start with what the feature does.
- Then show the smallest useful YAML example.
- Add only commonly used options.
- Shared concepts must link to central documentation.
- Legacy, fallback, compatibility, and niche behavior do not belong in the main flow.
- Do not mention classes, internal tools, rendering, processing, normalization, fallback logic, or implementation details unless explicitly requested.
- If two approaches achieve the same result, document only the simpler preferred approach.
- Keep pages scannable and short, similar to Home Assistant documentation.
- Before adding any paragraph, ask:
  "Does the user need this to use the feature?"
  If not, remove it.
