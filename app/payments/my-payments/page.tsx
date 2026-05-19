'use client';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { getMyPayments } from '@/app/payments/actions/payments.action';
import { AlertTriangle, CalendarClock, CheckCircle2, ChevronRight, Clock, CreditCard, RefreshCw, XCircle } from 'lucide-react';
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

// Configuración de colores LED estilo DeLorean
const STATUS_CONFIG: Record<string, { label: string; textClass: string; bgClass: string; borderClass: string; icon: any }> = {
  completed:  { label: 'COMPLETADO', textClass: 'text-[#00FF00]', bgClass: 'bg-[#00FF00]/10', borderClass: 'border-[#00FF00]/50', icon: CheckCircle2 },
  succeeded:  { label: 'COMPLETADO', textClass: 'text-[#00FF00]', bgClass: 'bg-[#00FF00]/10', borderClass: 'border-[#00FF00]/50', icon: CheckCircle2 },
  pending:    { label: 'VIAJANDO...', textClass: 'text-[#FFCC00]', bgClass: 'bg-[#FFCC00]/10', borderClass: 'border-[#FFCC00]/50', icon: Clock },
  failed:     { label: 'PARADOJA',    textClass: 'text-[#FF0000]', bgClass: 'bg-[#FF0000]/10', borderClass: 'border-[#FF0000]/50', icon: XCircle },
  processing: { label: 'ENERGIZANDO', textClass: 'text-[#00FFFF]', bgClass: 'bg-[#00FFFF]/10', borderClass: 'border-[#00FFFF]/50', icon: RefreshCw },
};

const METHOD_LABEL: Record<string, string> = {
  card: 'TARJETA DE CRÉDITO',
  transfer: 'TRANSFERENCIA',
};

// Extraemos cada pedazo de la fecha para el display de 14 segmentos
const formatBTTFDate = (dateString: string) => {
  const d = new Date(dateString);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: '2-digit' });
  const year = d.getFullYear();
  const hour = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit' });
  const min = d.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit' });
  return { month, day, year, hour, min };
};

// Componente para un Bloque LED estilo BTTF
const TimeCircuitBlock = ({ label, value, colorClass, shadowClass }: { label: string, value: string | number, colorClass: string, shadowClass: string }) => (
  <div className="flex flex-col items-center">
    <div className={`bg-[#110000] border-2 border-black px-3 py-2 mb-1 shadow-[inset_0_0_15px_rgba(0,0,0,1)]`}>
      <span className={`font-mono font-bold text-2xl md:text-3xl tracking-widest ${colorClass} ${shadowClass} blur-[0.3px]`}>
        {value}
      </span>
    </div>
    <div className="bg-[#440000] px-2 border-b-2 border-r-2 border-black/50">
      <span className="text-white text-[7px] md:text-[8px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-none border-y-2 border-gray-700 bg-gradient-to-r from-gray-900 to-black animate-pulse">
      <div className="w-12 h-12 bg-gray-800 rounded-sm" />
      <div className="flex-1 space-y-3">
        <div className="h-3 bg-gray-800 w-1/3" />
        <div className="h-2 bg-gray-800 w-1/4" />
      </div>
      <div className="h-6 bg-gray-800 w-24" />
    </div>
  );
}

export default function MyPaymentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.push('/login');
      return;
    }
    getMyPayments()
      .then(setPayments)
      .catch((err) => setError(err.message ?? 'Error al cargar el condensador de flujo'))
      .finally(() => setLoading(false));
  }, [hydrated, user]);

  const totalGastado = payments
    .filter((p) => p.status === 'completed' || p.status === 'succeeded')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  function retry() {
    setError('');
    setLoading(true);
    getMyPayments()
      .then(setPayments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020202] text-white px-4 py-12 md:py-20 font-mono">
      
      {/* Luces de neón de fondo (Flux Capacitor Aura) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* HEADER BTTF - AHORA TOTALMENTE CENTRADO */}
        <div className="mb-14 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-[#FF9900] shadow-[0_0_10px_#FF9900]"></div>
            <p className="text-[#00FFFF] text-xs font-bold uppercase tracking-[0.5em] animate-pulse drop-shadow-[0_0_5px_#00FFFF]">
              &gt; CONDENSADOR_DE_FLUJO_ACTIVO
            </p>
            <div className="w-12 h-1 bg-[#FF9900] shadow-[0_0_10px_#FF9900]"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFB800] via-[#FF0000] to-[#550000] drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">
            REGISTRO TEMPORAL
          </h1>
          
          {hydrated && user && (
            <div className="mt-8 bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-gray-500 px-6 py-2 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gray-400 rounded-full border border-black"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gray-400 rounded-full border border-black"></div>
              <p className="text-gray-300 text-[10px] tracking-widest uppercase">
                ID_OPERADOR: <span className="text-[#00FF00] font-black tracking-widest drop-shadow-[0_0_5px_#00FF00]">{user.username}</span>
              </p>
            </div>
          )}
        </div>

        {/* CONSOLA DE CIRCUITOS DEL TIEMPO (STATS) - CARCASA METÁLICA */}
        {!loading && !error && payments.length > 0 && (
          <div className="bg-gradient-to-b from-[#b3b3b3] via-[#8c8c8c] to-[#666666] p-4 rounded-lg shadow-[0_20px_30px_rgba(0,0,0,0.8),inset_0_5px_15px_rgba(255,255,255,0.4)] mb-16 border-b-8 border-r-4 border-black/40">
            
            {/* Panel Negro Interno */}
            <div className="bg-[#050505] p-6 grid grid-cols-1 md:grid-cols-3 gap-8 rounded-sm border-4 border-gray-900 shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
              
              {/* DISPLAY 1: ROJO */}
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <TimeCircuitBlock label="TOTAL" value={payments.length} colorClass="text-[#FF0000]" shadowClass="drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                  <TimeCircuitBlock label="TRX" value="QTY" colorClass="text-[#FF0000]" shadowClass="drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                </div>
                <div className="bg-white/90 text-black px-3 py-0.5 mt-4 font-black uppercase text-xs tracking-widest border border-gray-400 shadow-sm">
                  Transacciones Destino
                </div>
              </div>

              {/* DISPLAY 2: VERDE */}
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <TimeCircuitBlock label="OK" value={payments.filter(p => p.status === 'completed' || p.status === 'succeeded').length} colorClass="text-[#00FF00]" shadowClass="drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
                  <TimeCircuitBlock label="STS" value="RDY" colorClass="text-[#00FF00]" shadowClass="drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
                </div>
                <div className="bg-white/90 text-black px-3 py-0.5 mt-4 font-black uppercase text-xs tracking-widest border border-gray-400 shadow-sm">
                  Saltos Completados
                </div>
              </div>

              {/* DISPLAY 3: AMARILLO */}
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <TimeCircuitBlock label="USD" value={`$${Number(totalGastado).toFixed(0)}`} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                </div>
                <div className="bg-white/90 text-black px-3 py-0.5 mt-4 font-black uppercase text-xs tracking-widest border border-gray-400 shadow-sm">
                  Energía Invertida
                </div>
              </div>

            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-[#220000] border-4 border-[#FF0000] p-10 text-center relative overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.3)]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,rgba(255,0,0,0.1)_15px,rgba(255,0,0,0.1)_30px)]"></div>
            <AlertTriangle className="w-20 h-20 text-[#FF0000] mx-auto mb-4 animate-pulse relative z-10 drop-shadow-[0_0_10px_#FF0000]" />
            <p className="text-[#FF0000] font-black text-xl tracking-widest uppercase mb-6 relative z-10 drop-shadow-[0_0_5px_#FF0000]">PARADOJA TEMPORAL DETECTADA: {error}</p>
            <button onClick={retry} className="relative z-10 bg-black border-2 border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-black px-10 py-4 uppercase tracking-widest font-black transition-colors text-sm shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              Reiniciar Condensador
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && payments.length === 0 && (
          <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-[#00FFFF]/30 p-16 text-center relative overflow-hidden group shadow-[0_0_40px_rgba(0,255,255,0.1)]">
            <CalendarClock className="w-24 h-24 text-[#00FFFF] mx-auto mb-6 opacity-80 drop-shadow-[0_0_15px_#00FFFF]" />
            <p className="text-[#00FFFF] font-black text-3xl uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              SISTEMA SIN HISTORIAL
            </p>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-10">
              Necesitas 1.21 Gigawatts para iniciar tu primera transacción
            </p>
            <button onClick={() => router.push('/catalogo')} className="bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-12 py-5 font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] text-lg">
              Alcanzar 88 MPH
            </button>
          </div>
        )}

        {/* LISTA DE PAGOS - DISEÑO INDUSTRIAL */}
        {!loading && !error && payments.length > 0 && (
          <div className="space-y-6">
            {payments.map((payment) => {
              const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG['pending'];
              const Icon = cfg.icon;
              const { month, day, year, hour, min } = formatBTTFDate(payment.createdAt);

              return (
                <div key={payment.id} className="relative bg-gradient-to-r from-[#1a1a1a] to-black border-y-2 border-l-8 border-r-2 border-gray-700 shadow-[0_10px_20px_rgba(0,0,0,0.5)] p-4 md:p-6 flex flex-col xl:flex-row items-center gap-6 transition-all duration-300 hover:scale-[1.01]" style={{ borderLeftColor: cfg.textClass.split('-')[1].replace(']', '') }}>
                  
                  {/* Tornillos estéticos */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-500 shadow-inner"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-500 shadow-inner"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-500 shadow-inner"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-500 shadow-inner"></div>

                  {/* Icono de Estado NEÓN */}
                  <div className={`w-16 h-16 shrink-0 flex items-center justify-center border-2 bg-black shadow-[inset_0_0_15px_rgba(0,0,0,1)] relative overflow-hidden`} style={{ borderColor: cfg.textClass.split('-')[1].replace(']', '') }}>
                    <div className={`absolute inset-0 opacity-20 ${cfg.bgClass}`}></div>
                    <Icon className={`w-8 h-8 ${cfg.textClass} drop-shadow-[0_0_10px_currentColor] z-10`} />
                  </div>

                  {/* Detalles de la Transacción */}
                  <div className="flex-1 min-w-0 w-full text-center xl:text-left">
                    <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 bg-black shadow-sm ${cfg.textClass}`} style={{ borderColor: cfg.textClass.split('-')[1].replace(']', '') }}>
                        {cfg.label}
                      </span>
                      <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 bg-gray-900 px-3 py-1 border border-gray-700">
                        <CreditCard className="w-3 h-3" /> {METHOD_LABEL[payment.method] ?? payment.method}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-xs truncate uppercase tracking-widest">
                      ID_SYS: <span className="text-gray-200">{payment.id.split('-')[0]}...</span>
                    </p>

                    {payment.productIds?.length > 0 && (
                      <p className="text-cyan-500 text-[10px] mt-2 font-bold uppercase tracking-widest flex items-center justify-center xl:justify-start gap-1">
                        <ChevronRight className="w-4 h-4" /> {payment.productIds.length} RELIQUIA{payment.productIds.length > 1 ? 'S' : ''} OBTENIDA{payment.productIds.length > 1 ? 'S' : ''}
                      </p>
                    )}
                  </div>

                  {/* FECHA ESTILO BTTF DENTRO DE LA TARJETA */}
                  <div className="bg-[#050505] p-3 border-2 border-gray-800 flex gap-2 shadow-[inset_0_0_15px_rgba(0,0,0,1)] shrink-0 w-full xl:w-auto overflow-x-auto">
                    <TimeCircuitBlock label="MONTH" value={month} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                    <TimeCircuitBlock label="DAY" value={day} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                    <TimeCircuitBlock label="YEAR" value={year} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                    <div className="w-1"></div> {/* Espaciador */}
                    <TimeCircuitBlock label="HOUR" value={hour} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                    <TimeCircuitBlock label="MIN" value={min} colorClass="text-[#FFCC00]" shadowClass="drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                  </div>

                  {/* Precio */}
                  <div className="bg-black border border-gray-800 p-4 shrink-0 text-right w-full xl:w-auto mt-4 xl:mt-0 shadow-inner">
                    <p className="text-[#00FF00] font-black text-3xl drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                      <span className="text-gray-600 text-xl mr-1">$</span>
                      {Number(payment.amount).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-[8px] uppercase tracking-widest font-bold mt-1 text-center xl:text-right">Energía Consumida</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}