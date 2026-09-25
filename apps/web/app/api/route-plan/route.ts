import { NextResponse } from "next/server";
import {
  aiRoutePlanSchema,
  type GeneratedItinerary,
  type GeneratedStop,
} from "@gezgin/validation";

// Seed places for algorithmic fallback
const SEED_PLACES_BY_CATEGORY: Record<
  string,
  Array<{ name: string; desc: string; duration: number; tip: string; cost: string }>
> = {
  historical: [
    {
      name: "Ayasofya-i Kebîr Câmi-i Şerîfi (Hagia Sophia)",
      desc: "Bizans ve Osmanlı dönemlerinin eşsiz mimari harikası, anıtsal kubbesi ve tarihi mozaikleriyle İstanbul'un kalbi.",
      duration: 90,
      tip: "Sabah saat 09:00 civarında giderseniz giriş sırası daha az olur.",
      cost: "₺250",
    },
    {
      name: "Topkapı Sarayı Müzesi",
      desc: "Osmanlı padişahlarının yüzyıllar boyunca ikamet ettiği, Harem ve Kutsal Emanetler bölümlerini barındıran saray kompleksi.",
      duration: 120,
      tip: "Harem bölümü için ayrı bilet gerektiğini unutmayın.",
      cost: "₺450",
    },
    {
      name: "Galata Kulesi",
      desc: "Haliç ve Boğaz'ın 360 derece panoramik manzarasını sunan Ceneviz dönemi tarihi gözetleme kulesi.",
      duration: 60,
      tip: "Gün batımından 45 dakika önce çıkmanızı öneririz.",
      cost: "₺350",
    },
    {
      name: "Yerebatan Sarnıcı (Basilica Cistern)",
      desc: "Tarihi su sarnıcı; Medusa başlı sütun kaideleri ve büyüleyici atmosferik ışıklandırmasıyla ünlü.",
      duration: 50,
      tip: "MüzeKart geçerli değildir, online hızlı giriş biletini önceden alabilirsiniz.",
      cost: "₺300",
    },
  ],
  restaurant: [
    {
      name: "Tarihi Sultanahmet Köftecisi (1920)",
      desc: "Geleneksel ızgara köfte, piyaz ve irmik helvasıyla bir asırlık klasik lezzet durağı.",
      duration: 60,
      tip: "Geleneksel koyun yoğurdu ve acı biber sosunu mutlaka deneyin.",
      cost: "₺280",
    },
    {
      name: "Çiya Sofrası (Kadıköy)",
      desc: "Anadolu'nun unutulmaya yüz tutmuş geleneksel yöresel lezzetlerini sunan gastronomi cenneti.",
      duration: 75,
      tip: "Günün mevsimsel çorbasını ve ceviz tatlısını tatmayı ihmal etmeyin.",
      cost: "₺420",
    },
    {
      name: "Karaköy Lokantası",
      desc: "Turkuaz çinileri, zengin meze çeşitleri ve taze günlük balıklarıyla modern meyhane klasiği.",
      duration: 80,
      tip: "Akşam için birkaç gün önceden rezervasyon yapmanız tavsiye edilir.",
      cost: "₺650",
    },
    {
      name: "Hafız Mustafa 1864",
      desc: "Tarihi baklava, lokum ve geleneksel Türk kahvesi deneyimi.",
      duration: 40,
      tip: "Fıstıklı sarma ve yanında çifte kavrulmuş Türk kahvesi harika bir ikili.",
      cost: "₺180",
    },
  ],
  nature: [
    {
      name: "Gülhane Parkı & Boğaz Sahil Yürüyüşü",
      desc: "Tarihi yarımadanın asırlık çınar ağaçları altındaki huzurlu yürüyüş parkuru ve Sarayburnu sahil hattı.",
      duration: 60,
      tip: "Parkın Sarayburnu çıkışındaki banklarda Boğaz manzarasını seyredin.",
      cost: "Ücretsiz",
    },
    {
      name: "Yıldız Parkı & Ihlamur Kasrı",
      desc: "Beşiktaş tepelerinde Osmanlı sultanlarının korusu; asırlık ağaçlar, göletler ve köşkler.",
      duration: 75,
      tip: "Kır Kahvesi'nde çay molası verip kuş seslerini dinleyin.",
      cost: "Ücretsiz",
    },
    {
      name: "Emirgan Korusu & Boğaziçi Tepeleri",
      desc: "Boğaz manzarası, köşkler ve rengarenk lale bahçeleriyle doğa içinde dinlenme alanı.",
      duration: 90,
      tip: "Sarı Köşk önündeki seyir terasından fotoğraf çekmeyi unutmayın.",
      cost: "Ücretsiz",
    },
  ],
};

function generateFallbackItinerary(
  destination: string,
  categories: string[],
  pace: "relaxed" | "balanced" | "intense",
  budget: "low" | "medium" | "high",
  daysCount: number,
  guestCount: number,
): GeneratedItinerary {
  const stopsPerDay = pace === "relaxed" ? 3 : pace === "balanced" ? 4 : 5;
  const days = [];

  const startHours = [9, 11, 13, 15, 17, 19];

  for (let dayIndex = 1; dayIndex <= daysCount; dayIndex++) {
    const dayStops: GeneratedStop[] = [];

    // Ensure categories chosen by user (Historical, Restaurant, Nature, etc.) are included
    const activeCats =
      categories.length > 0
        ? categories
        : ["historical", "restaurant", "nature"];

    for (let sIdx = 0; sIdx < stopsPerDay; sIdx++) {
      const catKey = activeCats[sIdx % activeCats.length];
      const pool =
        SEED_PLACES_BY_CATEGORY[catKey] || SEED_PLACES_BY_CATEGORY.historical;
      const placeItem = pool[(dayIndex + sIdx) % pool.length];

      const startH = startHours[sIdx % startHours.length];
      const endH = startH + Math.max(1, Math.round(placeItem.duration / 60));
      const timeSlot = `${String(startH).padStart(2, "0")}:30 - ${String(
        endH,
      ).padStart(2, "0")}:00`;

      dayStops.push({
        id: `stop-${dayIndex}-${sIdx + 1}`,
        name: placeItem.name,
        category: catKey,
        description: placeItem.desc,
        timeSlot,
        durationMinutes: placeItem.duration,
        tip: placeItem.tip,
        estimatedCost: placeItem.cost,
      });
    }

    days.push({
      dayNumber: dayIndex,
      title: `${dayIndex}. Gün: ${destination} Keşfi`,
      summary: `${destination} için ${dayStops.length} duraklı, dengeli ve özenle optimize edilmiş seyahat günü.`,
      stops: dayStops,
    });
  }

  const categoryLabels = categories
    .map((c) =>
      c === "historical"
        ? "Tarih"
        : c === "restaurant"
          ? "Gastronomi"
          : c === "nature"
            ? "Doğa"
            : c,
    )
    .join(" & ");

  return {
    id: `itin-${Date.now()}`,
    title: `✨ ${daysCount} Günlük ${destination} ${categoryLabels} Rotası`,
    destination,
    summary: `${guestCount} kişi için ${pace} tempoda ve ${budget} bütçe düzeyinde planlanan rota.`,
    pace,
    budget,
    totalDurationHours: daysCount * (pace === "relaxed" ? 5 : 7),
    days,
    createdAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validationResult = aiRoutePlanSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Geçersiz istek parametreleri",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      destination,
      categories,
      pace,
      budget,
      daysCount,
      guestCount,
    } = validationResult.data;

    // 2. Check for server-side AI API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Sen Türkiye ve dünya şehirlerinde uzman bir seyahat rehberi yapay zekasısın.
Aşağıdaki tercihlere göre Türkçe dilinde tam bir seyahat rotası JSON verisi oluştur:
- Hedef Şehir: ${destination}
- İlgi Alanları/Kategoriler: ${categories.join(", ")}
- Tempo: ${pace} (relaxed: az durak, geniş vakit; balanced: dengeli; intense: yoğun ve çok durak)
- Bütçe: ${budget} (low: ekonomik, medium: dengeli, high: lüks)
- Gün Sayısı: ${daysCount}
- Kişi Sayısı: ${guestCount}

Lütfen YALNIZCA aşağıdaki JSON formatında yanıt ver, markdown backtick veya ek açıklama yazma:
{
  "id": "ai-itin-${Date.now()}",
  "title": "...",
  "destination": "${destination}",
  "summary": "...",
  "pace": "${pace}",
  "budget": "${budget}",
  "totalDurationHours": 6,
  "days": [
    {
      "dayNumber": 1,
      "title": "...",
      "summary": "...",
      "stops": [
        {
          "name": "Mekan Adı",
          "category": "historical | restaurant | nature | viewpoint | culture",
          "description": "Kısa ve çekici açıklama",
          "timeSlot": "09:30 - 11:00",
          "durationMinutes": 90,
          "tip": "Gezginler için özel tüyo",
          "estimatedCost": "₺..."
        }
      ]
    }
  ]
}`;

        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
              },
            }),
            signal: AbortSignal.timeout(12000), // 12s timeout
          },
        );

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const rawJson =
            aiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson) as GeneratedItinerary;
            parsed.createdAt = new Date().toISOString();
            return NextResponse.json(parsed, { status: 200 });
          }
        } else {
          console.warn(
            "Gemini API returned non-200 status, falling back to algorithmic generator.",
            aiResponse.statusText,
          );
        }
      } catch (aiErr) {
        console.warn("AI generation error, using smart fallback:", aiErr);
      }
    }

    // 3. Resilient Fallback Engine
    const fallbackItinerary = generateFallbackItinerary(
      destination,
      categories,
      pace,
      budget,
      daysCount,
      guestCount,
    );

    return NextResponse.json(fallbackItinerary, { status: 200 });
  } catch (error) {
    console.error("Route planning error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Sunucu hatası: Rota oluşturulamadı.",
      },
      { status: 500 },
    );
  }
}
