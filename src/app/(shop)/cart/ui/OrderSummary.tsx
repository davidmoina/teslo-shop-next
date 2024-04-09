'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const OrderSummary = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  const { itemsInCart, subtotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    if (itemsInCart === 0) {
      router.replace('/empty');
    }
  }, [itemsInCart, loaded, router]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. products</span>
      <span className="text-right">
        {itemsInCart === 1 ? '1 articulo' : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subtotal)}</span>

      <span>Taxes</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
