import CheckoutForm from './components/checkout';

interface PaymentsPageProps {
  searchParams: { productId?: string };
}

export default function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const productId = searchParams.productId ?? '';

  return (
    <CheckoutForm
      productId={productId}
    />
  );
}
