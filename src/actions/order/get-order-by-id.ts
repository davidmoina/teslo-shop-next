'use server'

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {

  const session = await auth()

  if (!session?.user) {
    return {
      ok: false,
      message: 'user not authenticated'
    }
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id
      },
      include: {
        OrderAddress: true,
        user: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        },

      },
    })

    if (!order) throw new Error(`order ${id} not found`)

    if (session.user.role === 'user') {
      if (order.userId !== session.user.id) {
        throw new Error(`order ${id} does not belong to this user`)
      }
    }

    return { ok: true, order }
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'look at server logs'
    }
  }
}