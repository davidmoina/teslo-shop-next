'use server'

import { v2 as cloudinary } from "cloudinary";
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      message: 'Can not delete images from FS'
    }
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0]

  if (!imageName) {
    return {
      ok: false,
      message: 'Can not delete images from FS'
    }
  }

  try {
    await cloudinary.uploader.destroy(`teslo-shop-next/${imageName}`)

    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${deletedImage.product.slug}`)
    revalidatePath(`/products/${deletedImage.product.slug}`)


  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error deleting image'
    }
  }

}