import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("targetPath") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let relativeUrl = "";

    if (targetPath && targetPath.startsWith("/images/")) {
      // Mevcut fotoğrafın yerine kaydet (üzerine yaz)
      const cleanTarget = targetPath.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", cleanTarget);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, buffer);
      relativeUrl = `${targetPath.split("?")[0]}?t=${Date.now()}`;
    } else {
      // Yeni yüklenen görsel olarak public/uploads altına kaydet
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase();
      const fileName = `${Date.now()}-${safeName}`;
      const fullPath = path.join(uploadsDir, fileName);

      await writeFile(fullPath, buffer);
      relativeUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({ ok: true, url: relativeUrl });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}
