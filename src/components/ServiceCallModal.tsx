import React, { useState } from 'react';
import { 
  Bell, 
  Receipt, 
  X, 
  CreditCard, 
  Banknote, 
  Ticket, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { createServiceRequest } from '../lib/api';
import type { ServiceRequest, ServiceRequestType, PaymentMethod } from '../types';
import { useTranslation } from '../lib/i18n';

interface ServiceCallModalProps {
  isOpen: boolean;
  mode: ServiceRequestType;
  cafeId: string;
  tableId: string;
  tableLabel: string;
  onClose: () => void;
  onSuccess: (req: ServiceRequest) => void;
}

export const ServiceCallModal: React.FC<ServiceCallModalProps> = ({
  isOpen,
  mode,
  cafeId,
  tableId,
  tableLabel,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [selectedQuickReason, setSelectedQuickReason] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [customNote, setCustomNote] = useState<string>('');

  if (!isOpen) return null;

  const quickWaiterReasons = [
    'Sipariş vermek istiyorum',
    'Masaya bakabilir misiniz?',
    'Su rica ediyorum',
    'Peçete / Ekstra bardak',
    'Masayı silebilir misiniz?',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fullNote = [
        mode === 'waiter' && selectedQuickReason ? selectedQuickReason : null,
        customNote.trim() || null,
      ]
        .filter(Boolean)
        .join(' - ');

      const req = await createServiceRequest({
        cafe_id: cafeId,
        table_id: tableId,
        request_type: mode,
        payment_method: mode === 'bill' ? paymentMethod : null,
        note: fullNote || null,
      });

      onSuccess(req);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'İstek iletilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              mode === 'waiter'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {mode === 'waiter' ? <Bell className="w-6 h-6 animate-bounce" /> : <Receipt className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-serif font-black text-xl text-coffee-950">
                {mode === 'waiter' ? t.callWaiter : t.requestBill}
              </h3>
              <p className="text-xs font-semibold text-terracotta-700">
                {tableLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-coffee-400 hover:text-coffee-800 hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'waiter' ? (
            /* GARSON ÇAĞIRMA SEÇENEKLERİ */
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-coffee-600">
                Hızlı Çağrı Nedeni
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickWaiterReasons.map((reason) => {
                  const isSelected = selectedQuickReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setSelectedQuickReason(isSelected ? '' : reason)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                          : 'bg-cream-50 border-coffee-200 text-coffee-800 hover:bg-cream-100'
                      }`}
                    >
                      <span>{reason}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">
                  Özel Not (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Örn: 2 şekerli çay rica ediyoruz..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          ) : (
            /* HESAP İSTEME SEÇENEKLERİ */
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-coffee-600">
                Ödeme Yöntemi Seçin
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-coffee-200 text-coffee-800 hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Kredi / Banka Kartı</p>
                      <p className="text-[11px] text-coffee-600">Masanıza POS cihazı getirilir</p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-coffee-200 text-coffee-800 hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Nakit Ödeme</p>
                      <p className="text-[11px] text-coffee-600">Adisyon fişi masaya getirilir</p>
                    </div>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('meal_card')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'meal_card'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-coffee-200 text-coffee-800 hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Yemek Kartı</p>
                      <p className="text-[11px] text-coffee-600">Multinet, Sodexo, Ticket, Edenred vb.</p>
                    </div>
                  </div>
                  {paymentMethod === 'meal_card' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">
                  Hesap Notu (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Örn: Ayrı ayrı çekeceğiz, şirket faturası rica ediyoruz..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-coffee-600 hover:bg-cream-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-warm flex items-center gap-2 transition-transform active:scale-98 disabled:opacity-50 ${
                mode === 'waiter'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
              }`}
            >
              {mode === 'waiter' ? <Bell className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
              <span>{submitting ? 'İletiliyor...' : (mode === 'waiter' ? 'Garsonu Masaya Çağır' : 'Hesap İste')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
