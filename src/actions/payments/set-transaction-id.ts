'use server'

import prisma from '@/lib/prisma';

export const setTransactionId = async (orderId: string, transactionId: string) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId }
    })

    if (!order) {
      return {
        ok: false,
        message: 'order not found'
      }
    }

    return { ok: true, message: 'transaction id saved' }


  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'save transaction id failed'
    }
  }
}