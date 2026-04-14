import { NextResponse } from "next/server";

import { buildPublicTestimonialsJsonV1 } from "@/lib/public-testimonials-json";
import { getPublicWallBySlug } from "@/server/public-wall";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

type RouteCtx = { params: Promise<{ slug: string }> };

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...corsHeaders } });
}

export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const trimmed = slug.trim();
  if (!trimmed) {
    return NextResponse.json(
      { error: "Invalid slug." },
      { status: 400, headers: { ...corsHeaders } },
    );
  }

  const wall = await getPublicWallBySlug(trimmed);
  if (!wall) {
    return NextResponse.json(
      { error: "Campaign not found." },
      { status: 404, headers: { ...corsHeaders } },
    );
  }

  const body = buildPublicTestimonialsJsonV1(trimmed, wall);
  return NextResponse.json(body, {
    status: 200,
    headers: { ...corsHeaders, ...cacheHeaders },
  });
}
