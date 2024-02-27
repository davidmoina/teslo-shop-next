'use client';

import { QuantitySelector, SizeSelector } from '@/components';
import { CartProduct, Product, Size } from '@/interfaces';
import { useCartStore } from '@/store';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addToCart);

  const [size, setSize] = useState<Size>();
  const [quantity, setQuantity] = useState(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      quantity,
      size,
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="absolute top-28 text-red-500 fade-in">
          You must select a size
        </span>
      )}
      {/* Sizes selector */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />
      {/* Quantity selector */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      <button onClick={addToCart} className="btn-primary my-5">
        Add to cart
      </button>
    </>
  );
};
