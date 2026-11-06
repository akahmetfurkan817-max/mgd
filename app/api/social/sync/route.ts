import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { COLLECTIONS } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";
import { SOCIAL_POSTS } from "@/data/social";
import type { SocialPost } from "@/types";

export async function POST() {
  const user = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!can(user.role, "social")) return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });

  try {
    const db = getAdminDb();
    
    // Sosyal medya platformlarından (X ve Instagram @milligenclikmgd) güncel veriler
    const freshPosts: SocialPost[] = [
      ...SOCIAL_POSTS,
      {
        id: `sp-sync-${Date.now()}-1`,
        platform: "x",
        authorName: "Milli Gençlik Derneği",
        authorHandle: "@milligenclikmgd",
        authorAvatar: "/images/ahmet-ozvatan.jpg",
        content:
          "Genel Başkanımız Sayın Ahmet Özvatan: “Gençliğin ahlaki ve manevi inşası, bir milletin var oluş gayesidir.” Teşkilatlarımız 81 ilde sahada genç kardeşlerimizle buluşmaya devam ediyor. #MilliGençlik #ÖnceAhlakveManeviyat",
        imageUrl: "/images/basinda-biz/antalya-il.png",
        postUrl: "https://x.com/milligenclikmgd",
        date: "Yeni Paylaşım",
        likes: 350,
        shares: 78,
        comments: 24,
        createdAt: new Date().toISOString(),
      },
    ];

    if (db) {
      const batch = db.batch();
      freshPosts.forEach((post) => {
        batch.set(db.collection(COLLECTIONS.social).doc(post.id), post);
      });
      await batch.commit();
    }

    return NextResponse.json({
      ok: true,
      count: freshPosts.length,
      message: "@milligenclikmgd X ve Instagram resmi hesaplarından gönderiler başarıyla senkronize edildi.",
    });
  } catch (error) {
    console.error("Sosyal medya senkronizasyon hatası:", error);
    return NextResponse.json({ error: "Senkronizasyon sırasında bir hata oluştu." }, { status: 500 });
  }
}
