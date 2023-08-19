import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("image") as unknown as File;
  if (
    !request.headers
      .get("x-feel-api")
      ?.includes(`${process.env.NEXT_PUBLIC_KEYs}`)
  ) {
    return NextResponse.json({
      success: true,
      message:
        "Hahaha!!! This is not a free api oo. We have limited resource here.",
    });
  }
  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `./public/f1s-image/${Date.now()}-${file.name.replaceAll(
    " ",
    "-"
  )}`;
  await writeFile(path, buffer);
  //   console.log(`open ${path} to see the uploaded file`);
  const uri = request.nextUrl.origin;

  //   console.log(`${uri}${path.replace("./public", "")}`);
  return NextResponse.json({
    success: true,
    message: "Image Uploaded Sucessfully",
    imageUrl: `${uri}${path.replace("./public", "")}`,
  });
}
