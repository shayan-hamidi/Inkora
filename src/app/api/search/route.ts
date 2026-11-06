import { NextResponse } from "next/server";
import { tattooSearchParamsSchema } from "@/features/tattoos/schemas";
import { listPublishedTattoos } from "@/features/tattoos/server/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = tattooSearchParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid search parameters",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const result = await listPublishedTattoos({
      query: parsed.data.q,
      category: parsed.data.category,
      style: parsed.data.style,
      placement: parsed.data.placement,
      tag: parsed.data.tag,
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
