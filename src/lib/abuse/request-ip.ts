export function getRequestIpFromHeaders(
  headersLike: Pick<Headers, "get">,
): string | null {
  const xff = headersLike.get("x-forwarded-for")?.trim();
  if (xff) {
    // May be a list: client, proxy1, proxy2
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headersLike.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return null;
}

