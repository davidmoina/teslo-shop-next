import { Title } from '@/components';
import { initialData } from '@/seed/seed';
import clsx from 'clsx';
import Image from 'next/image';
import { IoCartOutline } from 'react-icons/io5';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: Props) {
  const { id } = params;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                {
                  'bg-red-500': true,
                  'bg-green-700': false,
                }
              )}
            >
              <IoCartOutline size={30} />
              <span className="mx-2">Pending payment</span>
              {/* <span className="mx-2">Paid</span> */}
            </div>
            {/* Cart Items */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded mb-5 w-[100px] h-[100px]"
                />
                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>

                  <button className="underline mt-3">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Delivery address</h2>
            <div className="mb-10">
              <p className="text-xl">User</p>
              <p>Address</p>
              <p>Address</p>
              <p>Address</p>
              <p>CP: 10000</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-xl mb-2">Cart resume</h2>

            <div className="grid grid-cols-2">
              <span>No. products</span>
              <span className="text-right">3 articles</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span>Taxes</span>
              <span className="text-right">$100</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">$100</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <div
                className={clsx(
                  'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                  {
                    'bg-red-500': true,
                    'bg-green-700': false,
                  }
                )}
              >
                <IoCartOutline size={30} />
                <span className="mx-2">Pending payment</span>
                {/* <span className="mx-2">Paid</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
