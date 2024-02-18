export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  // If total number of pages is less than 7, return all pages, [1,2,3,4,5,6,7]
  if (totalPages < 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is between first three pages, return 1 | 2 | 3 | ... | 10 | 12
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // if actual page is between last three pages, return 1 | 2 | ... | 8 | 9 | 10
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // if actual page is in another place
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}