'use client';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { useCartStore } from '@/app/lib/useCartStore';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertTriangle, Building2, Cpu, CreditCard, ShieldCheck, TerminalSquare, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPayment } from '../actions/payments.action';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = 'card' | 'transfer';
type UIState = 'idle' | 'loading' | 'success' | 'error';

function CheckoutInner() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  
  // 🛠️ Extraemos removeItem de tu Zustand
  const { items, total, clearCart, productIds, removeItem } = useCartStore();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handlePay() {
    if (!user) {
      setErrorMsg('Debes iniciar sesión para procesar el enlace.');
      setUiState('error');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Buffer vacío. Añade reliquias antes de enlazar.');
      setUiState('error');
      return;
    }

    setUiState('loading');
    setErrorMsg('');

    try {
      const { clientSecret } = await createPayment({
        amount: total(),
        method,
        productIds: productIds(),
      });

      if (method === 'card' && stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Módulo de tarjeta no detectado.');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) throw new Error(error.message ?? 'Falla en la autorización del nodo.');

        if (paymentIntent?.status === 'succeeded') {
          clearCart();
          setUiState('success');
          setTimeout(() => router.push('/catalogo'), 2000);
          return;
        }
      }

      // Transferencia — queda en pending
      clearCart();
      setUiState('success');
      setTimeout(() => router.push('/catalogo'), 2000);

    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Error inesperado de red.');
      setUiState('error');
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 font-mono bg-[#020202] overflow-hidden">
      
      {/* ── BACKGROUND MATRIX/GRID ── */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,245,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020202_80%)] z-0"></div>
      
      <div className="w-full max-w-xl relative z-10">
        
        {/* ── TERMINAL BORDER ── */}
        <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-8 shadow-[0_0_40px_rgba(0,245,255,0.1)]">
          
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          {/* ── HEADER TERMINAL ── */}
          <div className="text-center mb-8 border-b border-cyan-900/50 pb-6">
            <div className="flex justify-center mb-3">
              <div className="bg-cyan-500/10 p-3 rounded-none border border-cyan-500/30">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-cyan-400 drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">
              ENLACE_SEGURO
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-2">
              [ PROTOCOLO DE TRANSFERENCIA · RETRO STORE ]
            </p>
          </div>

          {/* ── LISTA DE PRODUCTOS (CARRITO) ── */}
          <div className="mb-8">
            <p className="text-[10px] text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <TerminalSquare className="w-3 h-3" /> Paquetes_Extraidos
            </p>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="border border-dashed border-gray-700 bg-black/50 p-6 text-center text-gray-500 text-xs uppercase tracking-widest">
                  Buffer vacío
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-[#050508] border-l-2 border-gray-800 hover:border-cyan-500 p-3 transition-colors group">
                    <div className="relative w-12 h-12 shrink-0 border border-gray-800 group-hover:border-cyan-500/50">
                      <img
                        src={item.imageUrl || 'https://placehold.co/48x48/0D0D1A/AAAACC?text=IMG'}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/0D0D1A/AAAACC?text=IMG'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-sm font-bold truncate group-hover:text-white transition-colors">{item.name}</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-widest">ID: {item.id.split('-')[0]}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <p className="font-black text-cyan-400 drop-shadow-[0_0_5px_rgba(0,245,255,0.3)]">
                        ${item.price.toFixed(2)}
                      </p>
                      {/* 🛠️ BOTÓN DE ELIMINAR ESTILO CYBERPUNK */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 border border-transparent hover:border-red-500/50 hover:bg-red-950/30 text-gray-600 hover:text-red-500 rounded-sm transition-all duration-200"
                        title="Purgar paquete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── DISPLAY DE TOTAL ── */}
          {items.length > 0 && (
            <div className="bg-[#020202] border border-cyan-900 p-4 mb-8 flex justify-between items-center shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest flex flex-col">
                <span>Energía_Requerida</span>
                <span className="text-cyan-700">({items.length} módulos)</span>
              </span>
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <span className="text-cyan-500 mr-2 text-2xl">$</span>
                {total().toFixed(2)}
              </span>
            </div>
          )}

          {/* ── MÉTODOS DE PAGO ── */}
          <div className="mb-8">
            <p className="text-[10px] text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Seleccionar_Canal_de_Datos
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod('card')}
                className={`flex items-center justify-center gap-2 py-3 border-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${
                  method === 'card' 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
                    : 'bg-[#050508] border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Red de Tarjetas
              </button>
              
              <button 
                onClick={() => setMethod('transfer')}
                className={`flex items-center justify-center gap-2 py-3 border-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${
                  method === 'transfer' 
                    ? 'bg-fuchsia-500/10 border-fuchsia-400 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]' 
                    : 'bg-[#050508] border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
              >
                <Building2 className="w-4 h-4" /> Nodo Bancario
              </button>
            </div>
          </div>

          {/* ── STRIPE CARD ELEMENT ── */}
          {method === 'card' && (
            <div className="bg-[#020202] border border-cyan-800 p-5 mb-8 shadow-[inset_0_0_10px_rgba(0,0,0,1)] relative group">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 opacity-50"></div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                Inyectar_Credenciales_Financieras
              </p>
              <CardElement options={{
                style: {
                  base: { 
                    fontSize: '16px', 
                    color: '#00F5FF', 
                    fontFamily: 'monospace', 
                    '::placeholder': { color: '#005566' },
                    iconColor: '#00F5FF'
                  },
                  invalid: { color: '#FF0033', iconColor: '#FF0033' },
                },
              }} />
            </div>
          )}

          {/* ── TRANSFER INFO ── */}
          {method === 'transfer' && (
            <div className="bg-[#1a050f] border border-fuchsia-800 p-5 mb-8 shadow-[inset_0_0_10px_rgba(0,0,0,1)] relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500 to-fuchsia-500/0 opacity-50"></div>
              <p className="font-bold text-[10px] uppercase tracking-widest mb-3 text-fuchsia-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Protocolo Manual Activado
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Los fondos serán ruteados externamente. La transacción quedará en estado <span className="text-yellow-500 font-bold">[PENDIENTE]</span> en tu registro temporal hasta que el operador confirme la recepción en el nodo.
              </p>
            </div>
          )}

          {/* ── ALERTAS (ERROR / SUCCESS) ── */}
          {uiState === 'error' && (
            <div className="bg-red-950/50 border border-red-500 text-red-400 px-4 py-3 mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {uiState === 'success' && (
            <div className="bg-green-950/50 border border-green-500 text-green-400 px-4 py-4 mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3 justify-center shadow-[0_0_20px_rgba(0,255,0,0.2)]">
              <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
              Transacción Aprobada — Ruteando...
            </div>
          )}

          {/* ── BOTÓN DE ACCIÓN PRINCIPAL ── */}
          <button 
            onClick={handlePay}
            disabled={uiState === 'loading' || uiState === 'success' || items.length === 0}
            className={`w-full py-5 font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-3 ${
              uiState === 'loading' || uiState === 'success' || items.length === 0
                ? 'bg-gray-900 border border-gray-700 text-gray-600 cursor-not-allowed'
                : method === 'card' 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)]'
                  : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)]'
            }`}
          >
            {uiState === 'loading' ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                PROCESANDO_DATOS...
              </>
            ) : uiState === 'success' ? (
              'ENLACE_COMPLETADO'
            ) : method === 'card' ? (
              'AUTORIZAR CRÉDITOS'
            ) : (
              'INICIAR TRANSFERENCIA'
            )}
          </button>

          {/* ── FOOTER SEGURO ── */}
          <div className="mt-8 pt-6 border-t border-gray-900 text-center">
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Encriptación Stripe 256-bit AES
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}