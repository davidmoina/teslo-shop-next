'use client';

import Link from 'next/link';
import { authenticate } from '@/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { IoInformationCircleOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === 'Success') {
      router.replace('/');
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="email">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />

      <div className="flex h-8 space-x-1" aria-live="polite" aria-atomic="true">
        {state && (
          <>
            <IoInformationCircleOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">Invalid credentials</p>
          </>
        )}
      </div>

      <LoginButton />

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/register" className="btn-secondary text-center">
        Create new account
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx({
        'btn-primary': !pending,
        'btn-disabled': pending,
      })}
      disabled={pending}
    >
      Login
    </button>
  );
}
