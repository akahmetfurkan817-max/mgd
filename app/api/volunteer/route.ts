import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";
import { parseVolunteerApplication } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);
    const parsed = parseVolunteerApplication(body);

    if (!parsed || !parsed.fullName || !parsed.phone || !parsed.city) {
      return NextResponse.json(
        { error: "Lütfen zorunlu alanları (Ad Soyad, Telefon, İl) eksiksiz doldurunuz." },
        { status: 400 },
      );
    }

    const application = {
      ...parsed,
      id: parsed.id || `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: "BEKLIYOR" as const,
    };

    const db = getAdminDb();
    if (db) {
      await db.collection(COLLECTIONS.applications).doc(application.id).set(application);
    } else {
      console.log("[Demo Mode] Gönüllü Başvurusu Alındı:", application);
    }

    return NextResponse.json({
      ok: true,
      message: "Başvurunuz başarıyla alındı. Teşkilat sorumlumuz en kısa sürede sizinle iletişime geçecektir.",
      id: application.id,
    });
  } catch (error) {
    console.error("Gönüllü başvuru hatası:", error);
    return NextResponse.json({ error: "Başvuru kaydedilirken bir hata oluştu." }, { status: 500 });
  }
}
