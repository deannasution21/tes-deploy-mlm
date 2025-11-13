'use client';

import { useParams } from 'next/navigation';
import ProductDetailsGallery from '@/app/shared/ecommerce/product/product-details-gallery';
import ProductDetailsSummery from '@/app/shared/ecommerce/product/product-details-summery';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ProductDetailResponse, ProductItem } from '@/types';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpeg';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function ProductDetails() {
  const { data: session } = useSession();
  const params = useParams();

  // Ensure it's always treated as a string
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  // example: 'kopi-stamina-prd0002' → 'prd0002'
  const productId = slug ? slug.split('-').pop() : undefined;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ProductDetailResponse>(
      `/_products/${productId}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setProduct(data.data || null);
      })
      .catch((error) => {
        console.error(error);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, productId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Tidak ada data untuk produk ini.</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ProductDetailsGallery
            image={
              product.product_id === 'PRD0002'
                ? imgHNB
                : product.product_id === 'PRD0003'
                  ? imgLILAC
                  : product.product_id === 'PRD0001'
                    ? imgSNP
                    : defaultPlaceholder
            }
          />
        </div>
        <div className="col-span-5 @container">
          <ProductDetailsSummery product={product} />
        </div>
      </div>
    </div>
  );
}
