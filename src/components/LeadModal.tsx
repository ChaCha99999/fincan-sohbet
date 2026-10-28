import React, { useState } from 'react';
import { X, CheckCircle2, Coffee, Send, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { APP_CONFIG } from '../lib/config';
import { submitLead } from '../lib/api';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const leadSchema = z.object({
  fullName: z.string().min(2, 'Lütfen adınızı ve soyadınızı girin.'),
  cafeName: z.string().min(2, 'Lütfen kafe / işletme adını girin.'),
  city: z.string().min(2, 'Lütfen bulunduğunuz şehri girin.'),
  contactInfo: z.string().min(5, 'Lütfen geçerli bir telefon veya e-posta adresi girin.'),
  tableCount: z.coerce.number().min(1, 'Masa sayısı en az 1 olmalıdır.').max(500, 'Geçerli bir masa sayısı girin.'),
  note: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    cafeName: '',
    city: '',
    contactInfo: '',
    tableCount: 10,
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        full_name: result.data.fullName,
        cafe_name: result.data.cafeName,
        city: result.data.city,
        contact_info: result.data.contactInfo,
        table_count: result.data.tableCount,
        note: result.data.note || null,
        source: 'landing',
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Başvurunuz iletilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setFormData({
      fullName: '',
      cafeName: '',
      city: '',
      contactInfo: '',
      tableCount: 10,
      note: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-cream-50 rounded-3xl shadow-warm-lg border border-coffee-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-coffee-900 to-coffee-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-500 flex items-center justify-center text-white">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl">Kafen İçin Fincan Sohbet</h3>
              <p className="text-xs text-coffee-300">Masanıza özel QR/NFC kiti ve deneme hesabı</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full text-coffee-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif font-bold text-2xl text-coffee-950">
                Talebiniz Alındı!
              </h4>
              <p className="text-sm text-coffee-700 max-w-sm mx-auto leading-relaxed">
                Teşekkürler! <strong>{formData.cafeName}</strong> için deneme kurulumu ve QR masa kartı tasarımı hakkında ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>
              <div className="pt-4">
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-sm transition-colors"
                >
                  Tamamdır, Teşekkürler
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Örn: Mehmet Yılmaz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Kafe / İşletme Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.cafeName}
                    onChange={e => setFormData({ ...formData, cafeName: e.target.value })}
                    placeholder="Örn: Bahçe Kahvecisi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
                  />
                  {errors.cafeName && <p className="text-[11px] text-red-600 mt-1">{errors.cafeName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Örn: İstanbul / Kadıköy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
                  />
                  {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Yaklaşık Masa Sayısı *
                  </label>
                  <input
                    type="number"
                    value={formData.tableCount}
                    onChange={e => setFormData({ ...formData, tableCount: Number(e.target.value) })}
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
                  />
                  {errors.tableCount && <p className="text-[11px] text-red-600 mt-1">{errors.tableCount}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Telefon veya E-posta *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Örn: 0532 000 00 00 veya info@kafeniz.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
                />
                {errors.contactInfo && <p className="text-[11px] text-red-600 mt-1">{errors.contactInfo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Eklemek İstediğiniz Not (İsteğe bağlı)
                </label>
                <textarea
                  rows={2}
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Mevcut masa düzeniniz veya sormak istediğiniz sorular..."
                  className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-coffee-500">
                  Aylık başlangıç paketi: {APP_CONFIG.pricing.price} {APP_CONFIG.pricing.currency} / {APP_CONFIG.pricing.period}
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-sm shadow-warm transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu İlet'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
