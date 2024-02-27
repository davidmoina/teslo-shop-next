import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@prisma/client';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

const labels: Record<string, string> = {
  men: 'Mens',
  women: 'Women',
  kid: 'Kids',
  unisex: 'Unisex',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const gender = params.gender;

  return {
    title: labels[gender] ?? labels['unisex'],
    description: labels[gender]
      ? `Clothes for ${labels[gender]}`
      : 'Clothes for people',
  };
}

export default async function CategoryPage({ searchParams, params }: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  return (
    <>
      <Title
        title={`${labels[gender]} clothing`}
        subtitle="All products"
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
