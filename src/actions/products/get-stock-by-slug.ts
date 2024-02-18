'use server'

import prisma from '@/lib/prisma';

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const productStock = await prisma.product.findFirst({
      where: {
        slug
      },
      select: {
        inStock: true
      }
    })

    return productStock?.inStock ?? 0
  } catch (error) {
    console.error(error);
    return 0
  }
}