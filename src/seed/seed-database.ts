import { initialData } from './seed';
import prisma from '../lib/prisma';
import { countries } from './seed-countries';

async function main() {

  // Delete prev data
  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.country.deleteMany()


  // Insert categories data
  const { categories, products, users } = initialData

  // Insert users
  await prisma.user.createMany({
    data: users
  })

  const categoriesData = categories.map((name) => ({ name }))
  await prisma.category.createMany({ data: categoriesData })

  // Insert products data
  const categoriesDb = await prisma.category.findMany()

  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id
    return map
  }, {} as Record<string, string>)


  products.forEach(async (product) => {
    const { type, images, ...rest } = product

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type]
      }
    })

    // Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id
    }))

    await prisma.productImage.createMany({ data: imagesData })
  })

  // Insert countries
  await prisma.country.createMany({
    data: countries
  })


}

(() => {
  if (process.env.NODE_ENV === 'production') return;

  main();
})();
