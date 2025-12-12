import { getProduct, products } from '@/lib/data';
import { ProductDetails } from './product-details';

interface ProductPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function ProductPage({
  params: { locale, slug },
}: ProductPageProps) {
  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Product not found
        </h1>
        <a
          href={`/${locale}`}
          className="text-blue-500 hover:underline"
        >
          Back to home
        </a>
      </div>
    );
  }

  return <ProductDetails product={product} locale={locale} />;
}

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: 'en', slug: product.slug },
    { locale: 'ar', slug: product.slug },
  ]);
}
