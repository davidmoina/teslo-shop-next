'use server'
import prisma from '@/lib/prisma';
import { Gender } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  limit?: number;
  gender?: Gender
}

export const getPaginatedProductsWithImages = async ({ page = 1, limit = 12, gender }: PaginationOptions) => {

  if (isNaN(Number(page))) page = 1
  if (page < 1) page = 1

  try {
    // 1. Get products
    const productsPromise = prisma.product.findMany({
      include: {
        ProductImage: {
          select: {
            url: true
          },
          take: 2
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      where: {
        gender
      }
    })

    // 2. Get num of pages
    const totalCountPromise = prisma.product.count({ where: { gender } })

    const [products, totalCount] = await Promise.all([
      productsPromise,
      totalCountPromise
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      currentPage: page,
      totalPages,
      products: products.map(({ ProductImage, ...rest }) => ({
        ...rest,
        images: ProductImage.map(image => image.url),
      }))
    }
  } catch (error) {
    throw new Error('Failed to fetch products with images: ' + (error as any).message)
  }
}