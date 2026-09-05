import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/actions/guards";
import { env } from "@/lib/env";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Image file is required." }, { status: 400 });
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ message: "Only JPG, PNG, and WebP images are allowed." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Images must be 5MB or smaller." }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), bytes);
    return NextResponse.json({ url: `/uploads/${fileName}`, storage: "local" });
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "serenestay/rooms" }, (error, upload) => {
      if (error || !upload) reject(error);
      else resolve({ secure_url: upload.secure_url });
    }).end(bytes);
  });
  return NextResponse.json({ url: result.secure_url });
}
