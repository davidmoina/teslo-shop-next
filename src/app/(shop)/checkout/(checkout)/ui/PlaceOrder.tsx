'use client';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// el estado loaded y usEffect es porque la hidratación falla
export const PlaceOrder = () => {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [isPLacingOrder, setIsPLacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const address = useAddressStore((state) => state.address);
  const clearCart = useCartStore((state) => state.clearCart);

  const { itemsInCart, subtotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <h3>Loading...</h3>;

  const onPlaceOrder = async () => {
    setIsPLacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    // server action
    const response = await placeOrder(productsToOrder, address);

    if (!response.ok) {
      setIsPLacingOrder(false);
      setErrorMessage(response.message);
      return;
    }

    clearCart();

    router.replace(`/orders/${response.order?.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl font-bold mb-2">Delivery address</h2>
      <div className="mb-8">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>CP: {address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-xl mb-2">Cart resume</h2>

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
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="text-xs mb-5">
          By clicking &quot;buy&quot;, you accept our{' '}
          <a href="#" className="underline">
            terms and conditions
          </a>{' '}
          and{' '}
          <a href="#" className="underline">
            privacy policy.
          </a>
        </p>

        <p className="text-red-500 mb-1 text-center">{errorMessage}</p>
        <button
          onClick={onPlaceOrder}
          className={clsx('w-full', {
            'btn-primary': !isPLacingOrder,
            'btn-disabled': isPLacingOrder,
          })}
          disabled={isPLacingOrder}
        >
          Buy
        </button>
      </div>
    </div>
  );
};
