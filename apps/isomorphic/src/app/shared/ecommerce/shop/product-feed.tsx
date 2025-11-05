'use client';

import { useEffect, useState } from 'react';
import { Button } from 'rizzui';
import ProdukCard from '@core/components/cards/produk-card';
import hasSearchedParams from '@core/utils/has-searched-params';
// Note: using shuffle to simulate the filter effect
import shuffle from 'lodash/shuffle';
import { routes } from '@/config/routes';
import { useSession } from 'next-auth/react';
import { ProductItem, ProductResponse } from '@/types';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

let countPerPage = 12;

export default function ProductFeed() {
  const { data: session } = useSession();
  const [dataProduct, setDataProduct] = useState<ProductItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(countPerPage);

  function handleLoadMore() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNextPage(nextPage + countPerPage);
    }, 600);
  }

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ProductResponse>(
      `/_products`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataProduct(data.data);
      })
      .catch((error) => {
        console.error(error);
        setDataProduct([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  const filteredData = hasSearchedParams() ? shuffle(dataProduct) : dataProduct;

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 @md:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] @xl:gap-x-6 @xl:gap-y-12 @4xl:grid-cols-[repeat(auto-fill,minmax(270px,1fr))]">
        {filteredData
          ?.slice(0, nextPage)
          ?.map((product, index) => (
            <ProdukCard
              key={product.product_id}
              product={product}
              image={defaultPlaceholder}
              routes={routes}
            />
          ))}
      </div>

      {nextPage < filteredData?.length && (
        <div className="mb-4 mt-5 flex flex-col items-center xs:pt-6 sm:pt-8">
          <Button isLoading={isLoading} onClick={() => handleLoadMore()}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
