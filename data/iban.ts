import type { IbanInfo } from "@/types";

// ÖRNEK VERİ — gerçek IBAN bilgilerini Yönetim Paneli > IBAN Ayarları'ndan / buradan güncelleyin.
export const IBAN_LIST: IbanInfo[] = [
  {
    bank: "Ziraat Bankası",
    accountHolder: "Milli Gençlik Derneği",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    note: "Açıklama kısmına “Bağış” yazınız.",
  },
  {
    bank: "VakıfBank",
    accountHolder: "Milli Gençlik Derneği",
    iban: "TR00 0000 0000 0000 0000 0000 01",
    note: "Açıklama kısmına “Bağış” yazınız.",
  },
];
