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
  tableToken: string;
  tableLabel: string;
  onClose: () => void;
  onSuccess: (req: ServiceRequest) => void;
}

export const ServiceCallModal: React.FC<ServiceCallModalProps> = ({
  isOpen,
  mode,
  tableToken,
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
        tableToken,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="max-w-md w-full bg-cream-50 rounded-4xl p-6 sm:p-7 shadow-print border-2 border-coffee-950 space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-coffee-950 shadow-xs ${
              mode === 'waiter'
                ? 'bg-pistachio-500 text-coffee-950'
                : 'bg-terracotta-600 text-cream-50'
            }`}>
              {mode === 'waiter' ? <Bell className="w-6 h-6 animate-bounce" /> : <Receipt className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-serif font-black text-xl text-coffee-950">
                {mode === 'waiter' ? t.callWaiter : t.requestBill}
              </h3>
              <p className="text-xs font-bold text-terracotta-700 uppercase tracking-wider">
                {tableLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-coffee-600 hover:text-coffee-950 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-100 border-2 border-red-900 text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'waiter' ? (
            /* GARSON ÇAĞIRMA SEÇENEKLERİ */
            <div className="space-y-3">
              <label className="eyebrow text-coffee-600">
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
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-pistachio-200 border-coffee-950 text-coffee-950 shadow-xs'
                          : 'bg-cream-100 border-coffee-950/20 text-coffee-800 hover:bg-cream-200'
                      }`}
                    >
                      <span>{reason}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-pistachio-800 shrink-0 ml-1" />}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-coffee-950/20 bg-cream-100 text-xs text-coffee-950 focus:outline-none focus:border-coffee-950"
                />
              </div>
            </div>
          ) : (
            /* HESAP İSTEME SEÇENEKLERİ */
            <div className="space-y-3">
              <label className="eyebrow text-coffee-600">
                Ödeme Yöntemi Seçin
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-cream-200/80 border-coffee-950 text-coffee-950 shadow-xs ring-1 ring-coffee-950'
                      : 'bg-cream-100 border-coffee-950/20 text-coffee-800 hover:bg-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream-50 border border-coffee-950/20 text-coffee-900 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Kredi / Banka Kartı</p>
                      <p className="text-[11px] text-coffee-600">Masanıza POS cihazı getirilir</p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-terracotta-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-cream-200/80 border-coffee-950 text-coffee-950 shadow-xs ring-1 ring-coffee-950'
                      : 'bg-cream-100 border-coffee-950/20 text-coffee-800 hover:bg-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream-50 border border-coffee-950/20 text-coffee-900 flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Nakit Ödeme</p>
                      <p className="text-[11px] text-coffee-600">Adisyon fişi masaya getirilir</p>
                    </div>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle2 className="w-4 h-4 text-terracotta-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('meal_card')}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'meal_card'
                      ? 'bg-cream-200/80 border-coffee-950 text-coffee-950 shadow-xs ring-1 ring-coffee-950'
                      : 'bg-cream-100 border-coffee-950/20 text-coffee-800 hover:bg-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream-50 border border-coffee-950/20 text-coffee-900 flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Yemek Kartı</p>
                      <p className="text-[11px] text-coffee-600">Multinet, Sodexo, Ticket, Edenred vb.</p>
                    </div>
                  </div>
                  {paymentMethod === 'meal_card' && <CheckCircle2 className="w-4 h-4 text-terracotta-600" />}
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
                  placeholder="Örn: Ayrı ayrı ödeyeceğiz..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-coffee-950/20 bg-cream-100 text-xs text-coffee-950 focus:outline-none focus:border-coffee-950"
                />
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-coffee-700 hover:bg-cream-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-2xl text-cream-50 font-bold text-xs border-2 border-coffee-950 shadow-print-sm flex items-center gap-2 transition-transform active:translate-y-0.5 disabled:opacity-50 ${
                mode === 'waiter'
                  ? 'bg-pistachio-600 hover:bg-pistachio-700 !text-coffee-950'
                  : 'bg-terracotta-600 hover:bg-terracotta-700 !text-cream-50'
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
