'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from '@/actions';

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100; // 123.23

  if (isPending) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-9 md:h-10 bg-gray-300 rounded" />
        <div className="h-9 md:h-10 bg-gray-300 rounded" />
        <div className="h-9 md:h-10 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: String(roundedAmount),
            currency_code: 'EUR',
          },
        },
      ],
      intent: 'CAPTURE',
    });

    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error('Something went wrong');
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) return;

    await paypalCheckPayment(details.id!);
  };

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
