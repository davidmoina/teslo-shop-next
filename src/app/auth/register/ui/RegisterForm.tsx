'use client';

import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { email, name, password } = data;

    const response = await registerUser(name, email, password);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    await login(email.toLowerCase(), password);

    window.location.replace('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="name">Full name</label>
      <input
        autoFocus
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.name,
        })}
        type="text"
        {...register('name', { required: true })}
      />

      <label htmlFor="email">Email</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.email,
        })}
        type="email"
        {...register('email', {
          required: true,
          pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        })}
      />

      <label htmlFor="password">Password</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.password,
        })}
        type="password"
        {...register('password', { required: true, minLength: 8 })}
      />

      {errorMessage && (
        <p className="text-sm text-red-500 capitalize mb-1">{errorMessage}</p>
      )}

      <button className="btn-primary">Create account</button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Log in with an existing account
      </Link>
    </form>
  );
};
