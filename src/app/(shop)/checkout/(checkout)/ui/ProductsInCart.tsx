'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex items-center rounded-md mb-1"
        >
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded w-[100px] h-[100px]"
          />
          <div>
            <p>
              {product.size} | {product.title} ({product.quantity})
            </p>

            <p className="font-bold">
              ${currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
