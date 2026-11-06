"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, HeartHandshake, Loader2, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { MAP_PROVINCES } from "@/data/turkey-map";

interface VolunteerModalProps {
  open: boolean;
  onClose: () => void;
}

const COMMISSIONS = [
  "Üniversiteliler Teşkilatı",
  "Liseler & Ortaöğretim Birimi",
  "Hanımlar Gençlik Birimi",
  "Medya, İletişim ve Tasarım",
  "Kültür, Sanat ve Edebiyat",
  "Ar-Ge, Teknoloji ve Bilişim",
  "Spor ve Doğa Faaliyetleri",
  "Sosyal Sorumluluk ve İnsani Yardım",
  "Teşkilatlanma ve Saha",
];

export default function VolunteerModal({ open, onClose }: VolunteerModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Ankara");
  const [university, setUniversity] = useState("");
  const [commission, setCommission] = useState(COMMISSIONS[0]);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setCity("Ankara");
    setUniversity("");
    setCommission(COMMISSIONS[0]);
    setNotes("");
    setSuccess(false);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          city,
          university,
          commission,
          notes,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Başvuru gönderilirken bir hata oluştu.");
      }
    } catch {
      setLoading(false);
      setError("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="MGD Gönüllüsü Ol">
      {success ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-ink">Başvurunuz Alındı!</h3>
          <p className="mt-2 text-sm text-slate-600">
            Milli Gençlik Derneği ailemize katılma talebiniz teşkilat birimimize ulaştı. İl sorumlumuz en kısa sürede sizinle iletişime geçecektir.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="btn-primary mt-6 w-full"
          >
            Tamam
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            İnancımız, vatanımız ve milletimiz için birlikte üretelim. Bilgilerinizi doldurarak ilk adımı atın.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Ahmet Yılmaz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Telefon Numarası <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                E-posta Adresi
              </label>
              <input
                type="email"
                placeholder="ornek@posta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Bulunduğunuz İl <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none"
              >
                {MAP_PROVINCES.map((p) => (
                  <option key={p.plate} value={p.name}>
                    {p.plate} - {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Üniversite / Okul / Fakülte
              </label>
              <input
                type="text"
                placeholder="Örn: Gazi Ünv. İİBF"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Görev Almak İstediğiniz Birim / Alan <span className="text-red-500">*</span>
            </label>
            <select
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none"
            >
              {COMMISSIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Eklemek İstedikleriniz / İlgi Alanlarınız
            </label>
            <textarea
              rows={2}
              placeholder="Yetenekleriniz, daha önce yer aldığınız çalışmalar..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Gönderiliyor...
              </>
            ) : (
              <>
                <Send size={16} /> Başvuruyu Tamamla
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
