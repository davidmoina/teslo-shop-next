'use client';

import { QuantitySelector } from '@/components';
import { useCartStore } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProduct = useCartStore((state) => state.removeProduct);

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
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline cursor-pointer"
            >
              <p>
                {product.size} | {product.title}
              </p>
            </Link>
            <p>${product.price}</p>

            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) =>
                updateProductQuantity(product, quantity)
              }
            />

            <button
              onClick={() => removeProduct(product)}
              className="underline mt-3"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
