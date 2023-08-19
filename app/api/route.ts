import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  res: NextResponse,
  next: NextMiddleware
) {
  // return NextResponse.json([{}]);

  return new NextResponse(JSON.stringify([{ message: "Hello" }]), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
