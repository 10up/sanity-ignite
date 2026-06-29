# Ignite for Sanity

## Philosophy

This is a scaffold. Every pattern, abstraction, and architectural choice exists to be cloned, read, and replicated by project teams. Prioritize:

- **Idiomatic code** — follow Next.js, React, and Sanity conventions as they're documented. Don't invent project-specific idioms when the framework already has one.
- **Clarity over cleverness** — a developer new to the codebase should be able to read any file and understand what it does, why, and how to replicate the pattern for their own use case. If a pattern needs a README section to explain, it's too complex for a scaffold.
- **Straight-line patterns** — data flows, component composition, and fetch/cache/revalidate paths should be easy to follow top-to-bottom. Minimize indirection. A `grep` for a query name should lead you from route to fetch to transform to render without jumping through abstractions.
- **Reference implementations, not frameworks** — provide concrete examples (the blog, the page builder, the DTL - Data Transformation Layer) that teams copy and adapt. Don't build internal mini-frameworks that teams have to learn before they can build.

When in doubt, write the version a mid-level developer would thank you for inheriting.
