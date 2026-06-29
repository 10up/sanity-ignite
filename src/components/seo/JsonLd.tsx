/**
 * Renders a JSON-LD `<script>` block. Server-rendered so the structured data is
 * present in the initial HTML, before any JavaScript runs — which is how agents
 * and search crawlers read it.
 *
 * See https://specification.website/spec/agent-readiness/structured-data-for-agents/.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The `<` escape prevents the JSON payload from breaking out of the
      // <script> element; everything else is already-serialized data.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as text
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
