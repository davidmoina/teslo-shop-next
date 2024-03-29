'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken()

  if (!authToken) {
    return {
      ok: false,
      message: 'error getting token'
    }
  }

  const result = await verifyPaypalPayment(paypalTransactionId, authToken)

  if (!result) {
    return {
      ok: false,
      message: 'error verifying payment'
    }
  }

  const { status, purchase_units } = result

  const { invoice_id: orderId } = purchase_units[0]

  console.log(orderId);


  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'payment not completed'
    }
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      }
    })

    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true,
      message: 'payment completed',
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'error checking payment',
    }
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const oAuth2Url = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded
  };

  try {
    const response = await fetch(oAuth2Url, { ...requestOptions, cache: 'no-store' })
    const result = await response.json()

    return result.access_token
  } catch (error) {
    console.error(error)
    return null
  }
}

const verifyPaypalPayment = async (paypalTransactionId: string, token: string): Promise<PayPalOrderStatusResponse | null> => {
  const PAYPAL_ORDER_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}` ?? ''

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(PAYPAL_ORDER_URL, { ...requestOptions, cache: 'no-store' });
    const result = await response.json();

    return result
  } catch (error) {
    console.error(error);
    return null
  }
}