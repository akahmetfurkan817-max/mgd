// GeoJSON (tr-cities) -> SVG path verisi. Kullanım: node scripts/build-map.mjs
import fs from "node:fs";

const plates = `Adana,Adıyaman,Afyon,Ağrı,Amasya,Ankara,Antalya,Artvin,Aydın,Balıkesir,Bilecik,Bingöl,Bitlis,Bolu,Burdur,Bursa,Çanakkale,Çankırı,Çorum,Denizli,Diyarbakır,Edirne,Elazığ,Erzincan,Erzurum,Eskişehir,Gaziantep,Giresun,Gümüşhane,Hakkari,Hatay,Isparta,Mersin,İstanbul,İzmir,Kars,Kastamonu,Kayseri,Kırklareli,Kırşehir,Kocaeli,Konya,Kütahya,Malatya,Manisa,Kahramanmaraş,Mardin,Muğla,Muş,Nevşehir,Niğde,Ordu,Rize,Sakarya,Samsun,Siirt,Sinop,Sivas,Tekirdağ,Tokat,Trabzon,Tunceli,Şanlıurfa,Uşak,Van,Yozgat,Zonguldak,Aksaray,Bayburt,Karaman,Kırıkkale,Batman,Şırnak,Bartın,Ardahan,Iğdır,Yalova,Karabük,Kilis,Osmaniye,Düzce`.split(",");

const geo = JSON.parse(fs.readFileSync("scratch/tr.json", "utf8"));
const K = Math.cos((39 * Math.PI) / 180);
const minLon = 25.6, maxLon = 44.9, minLat = 35.8, maxLat = 42.2;
const scale = 1000 / ((maxLon - minLon) * K);
const W = 1000, H = Math.round((maxLat - minLat) * scale);
const proj = ([lon, lat]) => [(lon - minLon) * K * scale, (maxLat - lat) * scale];

const out = [];
for (const f of geo.features) {
  const name = f.properties.name;
  const plate = plates.indexOf(name) + 1;
  if (!plate) throw new Error("plaka yok: " + name);
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = "";
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  let best = 0, cx = 0, cy = 0;
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = [];
      let last = null;
      for (const c of ring) {
        const p = proj(c).map((v) => Math.round(v * 10) / 10);
        if (last && Math.abs(p[0] - last[0]) < 0.6 && Math.abs(p[1] - last[1]) < 0.6) continue;
        pts.push(p); last = p;
      }
      if (pts.length < 4) continue;
      let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
      for (const [x, y] of pts) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
      const area = (maxx - minx) * (maxy - miny);
      if (area < 4) continue;
      if (area > best) { best = area; cx = (minx + maxx) / 2; cy = (miny + maxy) / 2; }
      d += "M" + pts.map((p) => p.join(" ")).join("L") + "Z";
    }
  }
  out.push({ plate, name, d, cx: Math.round(cx), cy: Math.round(cy) });
}
out.sort((a, b) => a.plate - b.plate);

const ts = `// Otomatik üretildi: scripts/build-map.mjs
export interface MapProvince {
  plate: number;
  name: string;
  d: string;
  cx: number;
  cy: number;
}

export const MAP_VIEWBOX = "0 0 ${W} ${H}";

export const MAP_PROVINCES: MapProvince[] = ${JSON.stringify(out)};
`;
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/turkey-map.ts", ts);
console.log("OK", out.length, W, H, (ts.length / 1024).toFixed(0) + "KB");
