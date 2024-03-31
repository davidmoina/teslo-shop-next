'use client';

import { generatePaginationNumbers } from '@/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;

  const currentPage = isNaN(Number(pageString)) ? 1 : Number(pageString);

  if (currentPage < 1) {
    redirect(pathname);
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNum: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNum === '...') {
      return `${pathname}?${params.toString()}`; // href="/kid"
    }

    if (Number(pageNum) <= 0) {
      return `${pathname}`;
    }

    if (Number(pageNum) > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set('page', pageNum.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex text-center justify-center mt-10 mb-24">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {allPages.map((page) => (
            <li key={page} className="page-item">
              <Link
                className={clsx(
                  'page-link relative block py-1.5 px-3 rounded border-0 outline-none transition-all duration-300  text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none',
                  {
                    'bg-blue-500 shadow-md text-white hover:text-white  hover:bg-blue-400':
                      currentPage === page,
                  }
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
