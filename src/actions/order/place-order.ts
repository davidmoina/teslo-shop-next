'use server'

import { auth } from "@/auth.config"
import type { Address, Size } from "@/interfaces"
import prisma from '@/lib/prisma';

interface productToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (productIds: productToOrder[], address: Address) => {

  const session = await auth()
  const userId = session?.user.id

  // verify user session
  if (!userId) {
    return {
      ok: false,
      message: 'Not user session'
    }
  }

  // get products info
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map(product => product.productId)
      }
    }
  })
  // calculate total items
  const itemsInOrder = productIds.reduce((count, prod) => count + prod.quantity, 0)
  // calculate prices
  const { subTotal, tax, total } = productIds.reduce((prices, item) => {
    const productQuantity = item.quantity
    const product = products.find(prod => prod.id === item.productId)

    if (!product) throw new Error('product not found')

    const subTotal = product.price * productQuantity

    prices.subTotal += subTotal
    prices.tax += subTotal * 0.15
    prices.total += subTotal * 1.15

    return prices
  }, { subTotal: 0, tax: 0, total: 0 })

  try {
    // create transaction to db
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Update products stock
      const updatedProductsPromises = products.map((product) => {
        // sum total product
        const productQuantity = productIds.filter(item => item.productId === product.id).reduce((count, item) => item.quantity + count, 0)

        if (productQuantity <= 0) {
          throw new Error('product quantity is 0')
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: { decrement: productQuantity }
          }
        })
      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // verify negative stock values
      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`not enough stock for ${product.title}`)
        }
      })

      // 2. Create order - head - details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map(item => ({
                quantity: item.quantity,
                size: item.size,
                productId: item.productId,
                price: products.find(prod => prod.id === item.productId)?.price ?? 0,
              }))
            }
          }
        }
      })

      // 3. Create order address
      const { country, ...rest } = address

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...rest,
          countryId: country,
          orderId: order.id,
        }
      })

      return {
        updatedProducts,
        order,
        orderAddress
      }
    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    }
  }


}