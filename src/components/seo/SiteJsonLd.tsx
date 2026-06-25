import { getSiteSettings } from '@/lib/agent-readiness/content';
import { buildSiteGraph } from '@/lib/agent-readiness/structured-data';
import { JsonLd } from './JsonLd';

/**
 * Site-wide Organization + WebSite JSON-LD. Rendered once in the frontend
 * layout so per-page structured data can reference `#organization`/`#website`.
 */
export async function SiteJsonLd() {
  const settings = await getSiteSettings();
  return <JsonLd data={buildSiteGraph(settings ?? {})} />;
}
