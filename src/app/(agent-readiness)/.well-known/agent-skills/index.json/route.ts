import { createHash } from 'node:crypto';
import { SITE_SKILL_BODY, SITE_SKILL_NAME } from '@/lib/agent-readiness/skill';
import { getBaseUrl } from '@/utils/getBaseUrl';

/**
 * `/.well-known/agent-skills/index.json` — the Agent Skills discovery index
 * (Cloudflare RFC draft v0.2.0). Each entry's `digest` is a sha256 over the
 * exact bytes served at its `url`, so clients can verify integrity.
 * See https://specification.website/spec/agent-readiness/agent-skills-discovery/.
 */
export async function GET() {
  const baseUrl = getBaseUrl();
  const digest = `sha256:${createHash('sha256')
    .update(SITE_SKILL_BODY, 'utf8')
    .digest('hex')}`;

  const index = {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: SITE_SKILL_NAME,
        type: 'skill-md',
        description:
          'How to read this site via its machine-readable endpoints (llms.txt, feeds, sitemap) and embedded JSON-LD.',
        url: `${baseUrl}/.well-known/agent-skills/${SITE_SKILL_NAME}/SKILL.md`,
        digest,
      },
    ],
  };

  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
