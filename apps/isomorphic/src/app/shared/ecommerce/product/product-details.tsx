'use client';

import { useParams } from 'next/navigation';
import ProductDetailsGallery from '@/app/shared/ecommerce/product/product-details-gallery';
import ProductDetailsSummery from '@/app/shared/ecommerce/product/product-details-summery';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ProductDetailResponse, ProductItem } from '@/types';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';

export default function ProductDetails() {
  const { data: session } = useSession();
  const params = useParams();

  // Ensure it's always treated as a string
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  // example: 'kopi-stamina-prd0002' → 'prd0002'
  const productId = slug ? slug.split('-').pop() : undefined;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDataProduk = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_products/${productId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session?.accessToken ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = (await res.json()) as ProductDetailResponse;
        setProduct(data.data);
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken && productId) getDataProduk();
  }, [session?.accessToken, productId]);

  if (!product) return <div>Produk tidak ditemukan.</div>;

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ProductDetailsGallery image={defaultPlaceholder} />
        </div>
        <div className="col-span-5 @container">
          <ProductDetailsSummery product={product} />
        </div>
      </div>
    </div>
  );
}
