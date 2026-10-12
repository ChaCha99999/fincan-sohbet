import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Radio, 
  X, 
  Coffee, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { AdminLayout } from '../components/AdminLayout';
import { getCafes, getTablesByCafe, createTable, toggleTableStatus } from '../lib/api';
import { getTableUrl, APP_CONFIG } from '../lib/config';
import type { Cafe, Table } from '../types';

export const AdminTablesPage: React.FC = () => {
  const { id: cafeId } = useParams<{ id: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTableLabel, setNewTableLabel] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Selected table for QR & Print preview
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [nfcModalOpen, setNfcModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);


  const loadData = useCallback(async () => {
    if (!cafeId) return;
    setLoading(true);
    const [allCafes, cafeTables] = await Promise.all([
      getCafes(),
      getTablesByCafe(cafeId),
    ]);
    const current = allCafes.find(c => c.id === cafeId) || null;
    setCafe(current);
    setTables(cafeTables);
    setLoading(false);
  }, [cafeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeId || !newTableLabel.trim()) {
      setAddError('Lütfen masa etiketini girin.');
      return;
    }

    setSubmitting(true);
    setAddError(null);
    try {
      await createTable(cafeId, newTableLabel.trim());
      setNewTableLabel('');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      setAddError(err.message || 'Masa oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTable = async (table: Table) => {
    const nextState = !table.is_active;
    await toggleTableStatus(table.id, nextState);
    loadData();
  };

  const handleCopyLink = (token: string) => {
    const url = getTableUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const downloadPNG = (token: string, label: string) => {
    const canvas = document.getElementById(`qr-canvas-${token}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${cafe?.slug || 'kafe'}-${label.replace(/\s+/g, '-')}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const downloadSVG = (token: string, label: string) => {
    const svg = document.getElementById(`qr-svg-${token}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${cafe?.slug || 'kafe'}-${label.replace(/\s+/g, '-')}-qr.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  return (
    <AdminLayout
      title={cafe ? `${cafe.name} • Masalar` : 'Masa Yönetimi'}
      subtitle="QR kodları ve NFC bağlantılarını yönetin, yüksek çözünürlüklü baskı kartlarını indirin"
    >
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            to="/admin/cafes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-600 hover:text-coffee-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Kafeler Listesine Dön
          </Link>

          <button
            onClick={() => {
              setNewTableLabel(`Masa 0${tables.length + 1}`);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm flex items-center justify-center gap-1.5 transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            Yeni Masa Ekle
          </button>
        </div>

        {/* Table List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-coffee-200">
            <Layers className="w-8 h-8 text-coffee-400 mx-auto" />
            <p className="text-sm text-coffee-800 font-bold">Bu kafede henüz tanımlı masa yok.</p>
            <button
              onClick={() => {
                setNewTableLabel('Masa 01');
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-terracotta-600 text-white text-xs font-bold"
            >
              İlk Masayı Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => {
              const url = getTableUrl(table.public_token);
              const isCopied = copiedToken === table.public_token;

              return (
                <div
                  key={table.id}
                  className="bg-white rounded-3xl p-5 border border-coffee-200 shadow-warm-sm flex flex-col justify-between gap-4"
                >
                  {/* Top: Label and Status Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-coffee-950">
                          {table.label}
                        </h3>
                        <span className="text-[10px] text-coffee-400 font-mono">
                          Token: {table.public_token}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleTable(table)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          table.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="Masayı Aç/Kapat"
                      >
                        {table.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>

                    {/* QR Code Canvas (rendered visually) */}
                    <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-cream-50 border border-coffee-200/80">
                      <div className="p-1.5 bg-white rounded-xl shadow-warm-sm shrink-0">
                        {/* Hidden canvas for PNG export */}
                        <div style={{ display: 'none' }}>
                          <QRCodeCanvas
                            id={`qr-canvas-${table.public_token}`}
                            value={url}
                            size={512}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        {/* Visible SVG */}
                        <QRCodeSVG
                          id={`qr-svg-${table.public_token}`}
                          value={url}
                          size={72}
                          level="H"
                          includeMargin={false}
                          fgColor="#261C15"
                        />
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            onClick={() => handleCopyLink(table.public_token)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-700 hover:text-terracotta-900 bg-white border border-coffee-200 px-2.5 py-1 rounded-lg"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Kopyalandı' : 'Bağlantıyı Kopyala'}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-coffee-400 hover:text-coffee-800"
                            title="Yeni Sekmede Aç"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-[10px] text-coffee-500 font-mono truncate">
                          {url}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this table */}
                  <div className="pt-2 border-t border-coffee-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <button
                      onClick={() => downloadPNG(table.public_token, table.label)}
                      className="px-2.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-coffee-800 text-[11px] font-bold flex items-center gap-1"
                      title="PNG İndir"
                    >
                      <Download className="w-3 h-3 text-terracotta-600" />
                      PNG
                    </button>

                    <button
                      onClick={() => downloadSVG(table.public_token, table.label)}
                      className="px-2.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-coffee-800 text-[11px] font-bold flex items-center gap-1"
                      title="SVG İndir"
                    >
                      <Download className="w-3 h-3 text-caramel-600" />
                      SVG
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setPrintModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-coffee-100 hover:bg-coffee-200 text-coffee-900 text-[11px] font-bold flex items-center gap-1 ml-auto"
                      title="Baskıya Hazır Kart"
                    >
                      <Printer className="w-3 h-3" />
                      Masa Kartı
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setNfcModalOpen(true);
                      }}
                      className="px-2 py-1.5 rounded-lg text-coffee-500 hover:text-coffee-900 text-[11px] font-medium flex items-center gap-1"
                      title="NFC Bilgisi"
                    >
                      <Radio className="w-3 h-3 text-blue-600" />
                      NFC
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. ADD TABLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-coffee-950">
                Yeni Masa Tanımla
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Masa Etiketi *
                </label>
                <input
                  type="text"
                  value={newTableLabel}
                  onChange={e => setNewTableLabel(e.target.value)}
                  placeholder="Örn: Masa 05 (Teras)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
                />
                <span className="text-[10px] text-coffee-500 mt-1 block">
                  Tahmin edilemez benzersiz public token otomatik üretilecektir.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-coffee-600 hover:bg-cream-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm disabled:opacity-50"
                >
                  {submitting ? 'Ekleniyor...' : 'Masa Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PRINTABLE TABLE CARD MODAL (BASKI ŞABLONU) */}
      {printModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-6">
            <div className="flex items-center justify-between no-print">
              <div>
                <h3 className="font-serif font-bold text-lg text-coffee-950">
                  Baskıya Hazır Masa Kartı
                </h3>
                <p className="text-[11px] text-coffee-600">
                  Akrilik veya ahşap masa stantlarına uygun şablon
                </p>
              </div>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="p-1 text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The Actual Table Card Design */}
            <div className="print-card border-2 border-coffee-800 rounded-3xl p-8 bg-[#FAF8F5] text-center space-y-5 shadow-warm">
              <div className="flex items-center justify-center gap-2">
                <Coffee className="w-6 h-6 text-terracotta-600" />
                <span className="font-serif font-extrabold text-xl text-coffee-950 tracking-tight">
                  {cafe?.name || APP_CONFIG.brandName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-coffee-900 text-white font-bold text-xs">
                  {selectedTable.label}
                </span>
                <p className="text-xs text-coffee-700 italic pt-1">
                  "Kahveni al, bir soru seç, sohbeti başlat."
                </p>
              </div>

              {/* High Res QR */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-warm-sm border border-coffee-200/80">
                <QRCodeSVG
                  value={getTableUrl(selectedTable.public_token)}
                  size={160}
                  level="H"
                  fgColor="#261C15"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1 text-xs text-coffee-800">
                <p className="font-bold">Telefonunun kamerasını QR koda tut</p>
                <p className="text-[10px] text-coffee-500">
                  Uygulama indirme yok • Üyelik gerekmez • Anında açılır
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 no-print pt-2">
              <button
                onClick={() => downloadPNG(selectedTable.public_token, selectedTable.label)}
                className="px-4 py-2.5 rounded-xl border border-coffee-200 text-xs font-bold text-coffee-800 hover:bg-cream-100"
              >
                Yalnızca QR PNG İndir
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-coffee-900 hover:bg-black text-white text-xs font-bold shadow-warm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Yazıcıdan Çıktı Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NFC SETUP INSTRUCTIONS MODAL */}
      {nfcModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif font-bold text-lg text-coffee-950">
                  NFC Etiketi Yazma Rehberi
                </h3>
              </div>
              <button
                onClick={() => setNfcModalOpen(false)}
                className="p-1 text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-coffee-800 leading-relaxed">
              <p>
                <strong>{selectedTable.label}</strong> için standart NTAG213 / NTAG215 / NTAG216 tipi pasif bir NFC etiketine aşağıdaki kalıcı bağlantıyı yazabilirsiniz:
              </p>

              <div className="p-3 rounded-xl bg-cream-100 border border-coffee-200 font-mono text-[11px] break-all flex items-center justify-between gap-2">
                <span>{getTableUrl(selectedTable.public_token)}</span>
                <button
                  onClick={() => handleCopyLink(selectedTable.public_token)}
                  className="px-2 py-1 rounded bg-white text-coffee-800 text-[10px] font-bold border shrink-0"
                >
                  Kopyala
                </button>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
                <p className="font-bold">3 Kolay Adımda NFC Yazma:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
                  <li>Telefonunuza ücretsiz <strong>NFC Tools</strong> uygulamasını indirin.</li>
                  <li><strong>Write (Yaz) → Add a record → Custom URL / URI</strong> seçip yukarıdaki bağlantıyı yapıştırın.</li>
                  <li><strong>Write</strong> butonuna basıp NFC etiketini telefonun arkasına dokundurun. Hazır!</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setNfcModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-coffee-900 text-white font-bold text-xs"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
