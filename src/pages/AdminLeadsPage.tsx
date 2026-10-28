import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Phone,
  Mail,
  MapPin,
  Users,
  RefreshCw,
  CheckCircle2,
  Archive,
  Store,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { getLeads, updateLeadStatus, createCafe } from '../lib/api';
import { useAdminAuth } from '../hooks/useAdminAuth';
import type { Lead, LeadStatus } from '../types';

const STATUS_LABELS: Record<LeadStatus | 'all', string> = {
  all: 'Tümü',
  new: 'Yeni',
  contacted: 'İletişimde',
  converted: 'Dönüştürüldü',
  archived: 'Arşiv',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const formatDate = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
};

const isEmail = (value: string) => value.includes('@');

export const AdminLeadsPage: React.FC = () => {
  const { isPlatformAdmin } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      setLeads(await getLeads());
    } catch (err: any) {
      setError(err?.message || 'Başvurular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatus = async (lead: Lead, status: LeadStatus) => {
    setBusyId(lead.id);
    setError(null);
    try {
      const updated = await updateLeadStatus(lead.id, status);
      setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, ...updated } : l)));
    } catch (err: any) {
      setError(err?.message || 'Başvuru güncellenemedi.');
    } finally {
      setBusyId(null);
    }
  };

  const handleConvert = async (lead: Lead) => {
    if (!window.confirm(`"${lead.cafe_name}" adıyla yeni bir kafe oluşturulsun mu?`)) return;

    setBusyId(lead.id);
    setError(null);
    try {
      const baseSlug = slugify(lead.cafe_name) || `kafe-${Date.now()}`;
      let created = false;
      let lastError: any = null;

      for (let attempt = 0; attempt < 3 && !created; attempt++) {
        const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
        try {
          await createCafe(lead.cafe_name, slug, {
            wifi_name: null,
            wifi_password: null,
            instagram: null,
          });
          created = true;
        } catch (err: any) {
          lastError = err;
          if (!String(err?.message || '').toLowerCase().includes('duplicate')) {
            throw err;
          }
        }
      }

      if (!created) throw lastError || new Error('Kafe oluşturulamadı.');

      const updated = await updateLeadStatus(lead.id, 'converted');
      setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, ...updated } : l)));
      alert(`"${lead.cafe_name}" kafesi oluşturuldu. Masaları Kafeler & Masalar bölümünden ekleyebilirsiniz.`);
    } catch (err: any) {
      setError(err?.message || 'Kafe oluşturulamadı.');
    } finally {
      setBusyId(null);
    }
  };

  const visibleLeads = leads.filter(l => statusFilter === 'all' || l.status === statusFilter);

  if (!isPlatformAdmin) {
    return (
      <AdminLayout title="Başvurular" subtitle="Self-servis kafe başvuruları">
        <div className="bg-white rounded-3xl p-8 text-center border border-coffee-200 space-y-2">
          <AlertCircle className="w-8 h-8 text-coffee-400 mx-auto" />
          <p className="text-sm font-semibold text-coffee-800">Bu bölüm platform yöneticilerine aittir.</p>
          <Link to="/admin/dashboard" className="text-xs text-terracotta-700 underline">
            Genel Bakışa Dön
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Başvurular"
      subtitle="Landing sayfasından gelen kafe başvurularını takip edin ve kafeye dönüştürün"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(Object.keys(STATUS_LABELS) as Array<LeadStatus | 'all'>).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors ${
                  statusFilter === status
                    ? 'bg-coffee-900 text-white border-coffee-900'
                    : 'bg-white text-coffee-700 border-coffee-200 hover:bg-cream-100'
                }`}
              >
                {STATUS_LABELS[status]}
                {status !== 'all' && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    {leads.filter(l => l.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={loadLeads}
            className="px-3.5 py-2 rounded-xl bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : visibleLeads.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-coffee-200 space-y-2">
            <Inbox className="w-9 h-9 text-coffee-400 mx-auto" />
            <p className="text-sm font-semibold text-coffee-800">Bu filtrede başvuru yok.</p>
            <p className="text-xs text-coffee-500">
              Landing sayfasındaki "Kafen İçin Fincan Sohbet" formundan gelen kayıtlar burada listelenir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visibleLeads.map(lead => {
              const isBusy = busyId === lead.id;
              const isClosed = lead.status === 'converted' || lead.status === 'archived';

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl p-5 border border-coffee-200 shadow-warm-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-cream-100 text-coffee-800 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-coffee-950 truncate">{lead.cafe_name}</h3>
                        <p className="text-xs text-coffee-600 truncate">{lead.full_name}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        lead.status === 'new'
                          ? 'bg-amber-100 text-amber-800'
                          : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'converted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-coffee-100 text-coffee-700'
                      }`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-coffee-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-coffee-400" />
                      {lead.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-coffee-400" />
                      {lead.table_count ? `${lead.table_count} masa` : 'Masa sayısı belirtilmedi'}
                    </span>
                    <span className="flex items-center gap-1.5 sm:col-span-2">
                      {isEmail(lead.contact_info) ? (
                        <Mail className="w-3.5 h-3.5 text-coffee-400" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-coffee-400" />
                      )}
                      <a
                        href={isEmail(lead.contact_info)
                          ? `mailto:${lead.contact_info}`
                          : `tel:${lead.contact_info.replace(/\s/g, '')}`}
                        className="hover:text-terracotta-700 underline-offset-2 hover:underline truncate"
                      >
                        {lead.contact_info}
                      </a>
                    </span>
                  </div>

                  {lead.note && (
                    <p className="text-xs text-coffee-600 bg-cream-50 border border-coffee-100 rounded-xl p-2.5 leading-relaxed">
                      {lead.note}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-coffee-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(lead.created_at)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isClosed && (
                        <>
                          {lead.status === 'new' && (
                            <button
                              onClick={() => handleStatus(lead, 'contacted')}
                              disabled={isBusy}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold disabled:opacity-50"
                            >
                              İletişimde
                            </button>
                          )}
                          <button
                            onClick={() => handleConvert(lead)}
                            disabled={isBusy}
                            className="px-2.5 py-1.5 rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white text-[11px] font-bold disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Kafeye Dönüştür
                          </button>
                          <button
                            onClick={() => handleStatus(lead, 'archived')}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg text-coffee-500 hover:text-coffee-800 hover:bg-cream-100 disabled:opacity-50"
                            title="Arşivle"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {lead.status === 'archived' && (
                        <button
                          onClick={() => handleStatus(lead, 'new')}
                          disabled={isBusy}
                          className="px-2.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-coffee-800 text-[11px] font-bold disabled:opacity-50"
                        >
                          Arşivden Çıkar
                        </button>
                      )}

                      {lead.status === 'converted' && (
                        <Link
                          to="/admin/cafes"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold"
                        >
                          Kafelere Git
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
