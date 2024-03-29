import { getOrderById } from '@/actions';
import { IsPaidCard, PayPalButton, Title } from '@/components';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok || !order) notFound();

  const { OrderAddress, user, OrderItem, ...restOrder } = order;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${id.split('-').at(0)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <IsPaidCard isPaid={order.isPaid} />
            {/* Cart Items */}
            {OrderItem.map((item) => (
              <div
                key={`${item.product.slug}-${item.size}`}
                className="flex items-center rounded-md mb-1"
              >
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className="mr-5 rounded w-[100px] h-[100px]"
                />
                <div>
                  <p>
                    {item.size} | {item.product.title} ({item.quantity})
                  </p>

                  <p className="font-bold">
                    ${currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Delivery address</h2>
            <div className="mb-6">
              <p className="text-xl">
                {OrderAddress?.firstName} {OrderAddress?.lastName}
              </p>
              <p>{OrderAddress?.address}</p>
              <p>{OrderAddress?.address2}</p>
              <p>
                {OrderAddress?.city}, {OrderAddress?.countryId}
              </p>
              <p>CP: {OrderAddress?.postalCode}</p>
              <p>{OrderAddress?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-6" />

            <h2 className="text-xl mb-2">Cart resume</h2>

            <div className="grid grid-cols-2">
              <span>No. products</span>
              <span className="text-right">{restOrder.itemsInOrder}</span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(restOrder.subTotal)}
              </span>

              <span>Taxes</span>
              <span className="text-right">
                {currencyFormat(restOrder.tax)}
              </span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(restOrder.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {order.isPaid ? (
                <IsPaidCard isPaid={order.isPaid} />
              ) : (
                <PayPalButton amount={order.total} orderId={order.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
