'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPayment } from '../actions/payments.action';

interface CheckoutFormProps {
  productId: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}

type PaymentMethod = 'card' | 'transfer';
type UIState = 'idle' | 'loading' | 'success' | 'error';

export default function CheckoutForm({
  productId,
  productName = 'Producto Retro',
  productImage = '/images/placeholder.jpg',
  productPrice = 0,
}: CheckoutFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handlePay() {
    setUiState('loading');
    setErrorMsg('');
    try {
      await createPayment({ amount: productPrice, method, productId });
      setUiState('success');
      setTimeout(() => router.push('/mi-coleccion'), 1800);
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Error inesperado');
      setUiState('error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: '#0A0A0F' }}>
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: '#0D0D1A',
          border: '1px solid #1E1E3A',
          boxShadow: '0 0 50px rgba(0,245,255,0.15)',
        }}
      >
        <h1
          className="text-3xl font-black tracking-widest text-center mb-8 uppercase"
          style={{ color: '#00F5FF', textShadow: '0 0 20px rgba(0,245,255,0.7)' }}
        >
          Checkout
        </h1>

        <div
          className="flex gap-4 items-center rounded-xl p-4 mb-8"
          style={{ background: '#0D0D1A', border: '1px solid #1E1E3A' }}
        >
          <img
            src={productImage}
            alt={productName}
            className="w-20 h-20 object-cover rounded-lg"
            style={{ border: '1px solid #1E1E3A' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/80x80/0D0D1A/AAAACC?text=IMG';
            }}
          />
          <div className="flex-1">
            <p className="font-bold text-lg leading-tight mb-1" style={{ color: '#E0E0E0' }}>
              {productName}
            </p>
            <p className="text-2xl font-black" style={{ color: '#00F5FF', textShadow: '0 0 10px rgba(0,245,255,0.5)' }}>
              ${productPrice.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: '#AAAACC' }}>
            Método de Pago
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(['card', 'transfer'] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className="py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-200"
                style={{
                  background: method === m ? 'rgba(0,245,255,0.15)' : 'transparent',
                  border: `1px solid ${method === m ? '#00F5FF' : '#1E1E3A'}`,
                  color: method === m ? '#00F5FF' : '#AAAACC',
                  boxShadow: method === m ? '0 0 15px rgba(0,245,255,0.3)' : 'none',
                }}
              >
                {m === 'card' ? '💳 Tarjeta' : '🏦 Transferencia'}
              </button>
            ))}
          </div>
        </div>

        {uiState === 'error' && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm font-medium"
            style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid #FF4444', color: '#FF4444' }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {uiState === 'success' && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm font-bold text-center"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00FF88', color: '#00FF88', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
          >
            ✅ ¡Pago exitoso! Redirigiendo...
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={uiState === 'loading' || uiState === 'success'}
          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300"
          style={{
            background: uiState === 'loading' || uiState === 'success' ? 'rgba(0,245,255,0.1)' : 'rgba(0,245,255,0.2)',
            border: '1px solid #00F5FF',
            color: uiState === 'loading' || uiState === 'success' ? '#AAAACC' : '#00F5FF',
            boxShadow: uiState === 'idle' ? '0 0 25px rgba(0,245,255,0.4)' : 'none',
            cursor: uiState === 'loading' || uiState === 'success' ? 'not-allowed' : 'pointer',
          }}
        >
          {uiState === 'loading' ? '⏳ Procesando...' : uiState === 'success' ? '✅ Completado' : '⚡ Confirmar Pago'}
        </button>

        <p className="text-center text-xs mt-6" style={{ color: '#AAAACC' }}>
          Pago seguro con JWT · RetroStore 2026
        </p>
      </div>
    </div>
  );
}
