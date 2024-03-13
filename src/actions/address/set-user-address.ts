'use server'

import { Address } from "@/interfaces";
import prisma from '@/lib/prisma';

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId)

    return {
      ok: true,
      address: newAddress
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'failed to save address'
    }

  }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId }
    })

    const addressToSave = {
      userId,
      address: address.address,
      address2: address.address2,
      postalCode: address.postalCode,
      city: address.city,
      countryId: address.country,
      phone: address.phone,
      firstName: address.firstName,
      lastName: address.lastName,
    }

    if (!storedAddress) {

      const newAddress = await prisma.userAddress.create({
        data: addressToSave
      })

      return newAddress
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })

    return updatedAddress
  } catch (error) {
    console.error(error);
    throw new Error('failed to save address');
  }
}