'use client';

import Link from 'next/link';
import React from 'react';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

import { useUIStore } from '@/store';
import clsx from 'clsx';
import { logout } from '@/actions';
import { useSession } from 'next-auth/react';

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div>
      {/* Background black & Blur */}
      {isSideMenuOpen && (
        <>
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
          <div
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
            onClick={closeMenu}
          />
        </>
      )}

      {/* Side menu */}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[350px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={40}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeMenu}
        />

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Profile</span>
            </Link>

            <Link
              href="/orders"
              onClick={closeMenu}
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Orders</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            onClick={closeMenu}
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Log in</span>
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => logout()}
            className="w-full flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Log out</span>
          </button>
        )}

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />{' '}
            <Link
              href="/"
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Products</span>
            </Link>
            <Link
              href="/admin/orders"
              onClick={closeMenu}
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Orders</span>
            </Link>
            <Link
              href="/admin/users"
              onClick={closeMenu}
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Users</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
