export type WebsiteLlmResponse = {
  message?: string;
  code: string;
};

const CODE_BLOCK_OPEN_RE = /^```(?:json)?/i;
const CODE_BLOCK_CLOSE_RE = /```$/i;

export function extractJsonPayload(raw: string): string {
  const trimmed = raw
    .replace(CODE_BLOCK_OPEN_RE, "")
    .replace(CODE_BLOCK_CLOSE_RE, "")
    .trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in LLM response");
  }

  return trimmed.slice(start, end + 1).trim();
}

export function parseWebsiteResponse(raw: string): WebsiteLlmResponse {
  const cleaned = extractJsonPayload(raw);
  const parsed = JSON.parse(cleaned) as WebsiteLlmResponse | null;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("LLM returned non-object JSON");
  }

  if (!parsed.code || typeof parsed.code !== "string") {
    throw new Error("LLM response missing code");
  }

  return parsed;
}
