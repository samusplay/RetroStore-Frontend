'use client';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { getAllPayments, updatePaymentStatus } from '@/app/payments/actions/payments.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  productIds: string[];
  buyerId: string;
  stripePaymentIntentId: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; glow: string; icon: string }> = {
  completed:  { label: 'COMPLETED',  color: '#00FF00', glow: 'rgba(0,255,0,0.6)',  icon: '[OK]' },
  pending:    { label: 'WAITING',    color: '#FFFF00', glow: 'rgba(255,255,0,0.6)', icon: '[?]' },
  failed:     { label: 'GAME OVER',  color: '#FF0055', glow: 'rgba(255,0,85,0.6)', icon: '[X]' },
};

const METHOD_LABEL: Record<string, string> = {
  card: 'CREDIT_COIN',
  transfer: 'BANK_LINK',
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-2 border-[#1E1E3A] bg-black relative overflow-hidden">
      <div className="w-12 h-12 border border-[#1E1E3A] bg-[#0A0A0F] animate-pulse flex items-center justify-center text-[#1E1E3A]">
        ▓
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-3 w-1/3 bg-[#1E1E3A] animate-pulse" />
        <div className="h-2 w-1/4 bg-[#1E1E3A] animate-pulse" />
      </div>
      <div className="h-8 w-24 bg-[#1E1E3A] animate-pulse" />
    </div>
  );
}

export default function SellerPaymentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== 'SELLER') {
      router.push('/');
      return;
    }
    fetchPayments();
  }, [hydrated, user]);

  async function fetchPayments() {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data);
    } catch (err: any) {
      setError(err.message ?? 'SYS_ERROR: UNABLE_TO_FETCH');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, status: 'completed' | 'failed') {
    setUpdating(id);
    try {
      await updatePaymentStatus(id, status);
      setPayments(prev =>
        prev.map(p => p.id === id ? { ...p, status } : p)
      );
    } catch (err: any) {
      alert(`ERROR: ${err.message ?? 'ACTION_FAILED'}`);
    } finally {
      setUpdating(null);
    }
  }

  const totalIngresos = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const pendientes = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="relative min-h-screen px-4 py-12 bg-black font-mono selection:bg-[#FF0055] selection:text-white overflow-hidden">
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-10" 
           style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)', backgroundSize: '100% 4px' }} />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-10 text-center border-4 border-double border-[#00FFFF] p-6 bg-[#001111] shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-2 text-[#FF0055] animate-pulse">
            *** INSERT COIN TO MANAGE ***
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white"
            style={{ textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF' }}>
            SELLER TERMINAL
          </h1>
          {hydrated && user && (
            <p className="mt-4 text-[#00FFFF] border-t border-dashed border-[#00FFFF] pt-2 inline-block">
              PLAYER 1: [{user.username}]
            </p>
          )}
        </div>

        {/* Stats */}
        {!loading && !error && payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'TOTAL TXs', value: payments.length, color: '#00FFFF' },
              { label: 'PENDING MISSIONS', value: pendientes, color: '#FFFF00' },
              { label: 'HIGH SCORE (INCOME)', value: `$${Number(totalIngresos).toFixed(2)}`, color: '#00FF00' },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-black border-2 text-center relative group"
                style={{ borderColor: s.color, boxShadow: `inset 0 0 10px ${s.color}20` }}>
                <div className="absolute top-0 left-0 w-2 h-2" style={{ background: s.color }} />
                <p className="text-3xl font-black mt-2" style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}>
                  {s.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-2 opacity-80" style={{ color: s.color }}>
                  &gt; {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <p className="text-[#00FF00] animate-pulse mb-2">&gt; LOADING_DATABASE_RECORDS...</p>
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-8 text-center border-4 border-dashed border-[#FF0055] bg-[#1a0005]">
            <p className="text-5xl mb-4 animate-bounce">👾</p>
            <p className="text-xl mb-6 text-[#FF0055] uppercase font-black" style={{ textShadow: '0 0 10px #FF0055' }}>
              FATAL ERROR: {error}
            </p>
            <button onClick={fetchPayments}
              className="px-6 py-3 bg-[#FF0055] text-white font-black uppercase tracking-widest border-b-4 border-r-4 border-[#880022] active:border-0 active:translate-y-1 active:translate-x-1 transition-all">
              &gt; RETRY CONNECTION
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && payments.length === 0 && (
          <div className="p-14 text-center border-2 border-[#00FFFF] bg-black">
            <p className="text-5xl mb-6 opacity-50">🕹️</p>
            <p className="font-black text-xl uppercase tracking-widest mb-2 text-[#00FFFF]"
              style={{ textShadow: '0 0 10px #00FFFF' }}>
              NO RECORDS FOUND
            </p>
            <p className="text-xs text-gray-400">
              &gt; WAITING_FOR_NEW_PLAYERS...
            </p>
          </div>
        )}

        {/* Payment list */}
        {!loading && !error && payments.length > 0 && (
          <div className="space-y-4">
            <p className="text-[#00FFFF] border-b border-[#00FFFF] pb-1 mb-4 inline-block">
              &gt; SYSTEM_LOGS / PAYMENTS
            </p>
            {payments.map((payment) => {
              const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG['pending'];
              const dateObj = new Date(payment.createdAt);
              const date = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
              const time = dateObj.toLocaleTimeString('en-US', { hour12: false });
              const isUpdating = updating === payment.id;

              return (
                <div key={payment.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-800 bg-[#050505] hover:bg-[#0a0a0a] transition-colors relative"
                  style={{ borderLeftWidth: '4px', borderLeftColor: cfg.color }}>

                  {/* Status icon terminal style */}
                  <div className="w-16 h-12 flex flex-col items-center justify-center flex-shrink-0 bg-black border border-gray-800">
                    <span className="text-[10px] text-gray-500">STATUS</span>
                    <span className="font-black text-sm" style={{ color: cfg.color, textShadow: `0 0 8px ${cfg.color}` }}>
                      {isUpdating ? '[...]' : cfg.icon}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs truncate text-gray-300">
                        <span className="text-[#00FFFF]">ID:</span> {payment.id}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <span className="text-[10px] bg-gray-900 text-gray-400 px-2 py-1 border border-gray-700">
                        {METHOD_LABEL[payment.method] ?? payment.method}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        DATE: {date} [{time}]
                      </span>
                      {payment.productIds?.length > 0 && (
                        <span className="text-[10px] text-[#FF0055]">
                          ITEMS: {payment.productIds.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] text-gray-500 mb-1">AMOUNT</p>
                    <p className="font-black text-xl" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
                      ${Number(payment.amount).toFixed(2)}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    {payment.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(payment.id, 'completed')}
                          disabled={isUpdating}
                          className="flex-1 md:flex-none px-4 py-2 bg-[#00FF00] text-black font-black text-xs uppercase hover:bg-white transition-colors disabled:opacity-50 border-b-4 border-r-4 border-[#008800] active:border-0 active:translate-y-1 active:translate-x-1"
                        >
                          {isUpdating ? '...' : 'ACCEPT'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(payment.id, 'failed')}
                          disabled={isUpdating}
                          className="flex-1 md:flex-none px-4 py-2 bg-[#FF0055] text-white font-black text-xs uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 border-b-4 border-r-4 border-[#880022] active:border-0 active:translate-y-1 active:translate-x-1"
                        >
                          {isUpdating ? '...' : 'REJECT'}
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-center text-xs font-black" style={{ color: cfg.color }}>
                        {cfg.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-600 mt-12 animate-pulse">
          &copy; 2026 RETRO_STORE_CORP // TERMINAL V1.0.4
        </p>

      </div>
    </div>
  );
}