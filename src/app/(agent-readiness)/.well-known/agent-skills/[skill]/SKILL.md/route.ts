import { SITE_SKILL_BODY, SITE_SKILL_NAME } from '@/lib/agent-readiness/skill';

/**
 * `/.well-known/agent-skills/<name>/SKILL.md` — serves the published Agent
 * Skill as `text/markdown` with CORS open so browser-based agents can fetch it.
 * The bytes here must match the digest in the discovery index.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ skill: string }> }
) {
  const { skill } = await params;

  if (skill !== SITE_SKILL_NAME) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(SITE_SKILL_BODY, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
