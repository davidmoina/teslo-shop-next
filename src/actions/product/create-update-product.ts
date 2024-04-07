'use server'

import { Gender, Product } from '@prisma/client';
import { z } from 'zod'
import prisma from '@/lib/prisma';
import { Size } from '@/interfaces';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
  inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform(val => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
})

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)

  const productParsed = productSchema.safeParse(data)

  if (!productParsed.success) {
    return {
      ok: false,
      error: productParsed.error.message
    }
  }

  const product = productParsed.data
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim()

  const { id, ...rest } = product

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product

      const tagsArr = rest.tags.split(',').map(tag => tag.trim().toLowerCase())

      if (id) {
        product = await tx.product.update({
          where: {
            id
          },
          data: {
            ...rest, sizes: { set: rest.sizes as Size[] }, tags: { set: tagsArr }
          }
        })
      } else {
        product = await tx.product.create({
          data: {
            ...rest, sizes: { set: rest.sizes as Size[] }, tags: { set: tagsArr }
          }
        })
      }

      // Save images
      if (formData.getAll('images')) {
        const images = await uploadImages(formData.getAll('images') as File[])

        if (!images) {
          throw new Error('Error uploading images')
        }

        await prisma.productImage.createMany({
          data: images.map(image => ({
            url: image!,
            productId: product.id,
          }))
        })

      }


      return {
        product
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${product.slug}`)
    revalidatePath(`/products/${product.slug}`)

    return {
      ok: true,
      product: prismaTx.product
    }

  } catch (error) {
    return {
      ok: false,
      message: 'Error creating product'
    }
  }
}

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async image => {
      try {
        const buffer = await image.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64')

        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
          folder: 'teslo-shop-next'
        }).then(res => res.secure_url)
      } catch (error) {
        console.error(error);

        return null
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)

    return uploadedImages
  } catch (error) {
    console.error(error);

    return null
  }
}