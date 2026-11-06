import type { Province } from "@/types";
import { MAP_PROVINCES } from "@/data/turkey-map";

// ÖRNEK VERİ — 81 il için yer tutucu kayıtlar üretilir. Gerçek bilgiler OVERRIDES içinde
// ya da Yönetim Paneli > 81 İl Bilgisi bölümünde güncellenmelidir.
const OVERRIDES: Partial<Record<number, Partial<Province>>> = {
  6: { address: "Örnek Mah. Örnek Cad. No:1 Çankaya / Ankara" },
  34: { address: "Örnek Mah. Örnek Sok. No:1 Fatih / İstanbul" },
  35: { address: "Örnek Mah. Örnek Cad. No:1 Konak / İzmir" },
};

export const PROVINCES: Province[] = MAP_PROVINCES.map(({ plate, name }) => ({
  plate,
  name,
  chairName: "İl Başkanı Adı Soyadı",
  chairPhoto: "",
  address: `Örnek Mah. Örnek Cad. No:1 Merkez / ${name}`,
  phone: "+90 (000) 000 00 00",
  email: `${name.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g, "")}@mgd.org.tr`,
  ...OVERRIDES[plate],
}));
