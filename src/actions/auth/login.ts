'use server'

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);

    return 'Success'
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    return {
      ok: true,
      message: 'User logged successfully'
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Invalid credentials'
    }
  }
}