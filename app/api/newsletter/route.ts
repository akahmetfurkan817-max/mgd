import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { email?: string } | null;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Lütfen geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const db = getAdminDb();
    if (db) {
      const id = email.replace(/[^a-z0-9]/g, "_").slice(0, 80);
      await db.collection("ebulten").doc(id).set(
        {
          id,
          email,
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("E-bülten kayıt hatası:", error);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
