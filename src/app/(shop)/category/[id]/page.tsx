import { ProductGrid, Title } from '@/components';
import { Category } from '@/interfaces';
import { initialData } from '@/seed/seed';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;

  const products = initialData.products.filter(
    (product) => product.gender === id
  );

  if (products.length === 0) {
    notFound();
  }

  const labels: Record<Category, string> = {
    men: 'Mens',
    women: 'Women',
    kid: 'Kids',
    unisex: 'Unisex',
  };

  return (
    <>
      <Title
        title={`${labels[id]} clothing`}
        subtitle="All products"
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
