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

let countPerPage = 12;

export default function ProductFeed() {
  const { data: session } = useSession();
  const [dataProduct, setDataProduct] = useState<ProductItem[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(countPerPage);

  function handleLoadMore() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNextPage(nextPage + countPerPage);
    }, 600);
  }

  useEffect(() => {
    const getDataProduk = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_products`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session?.accessToken ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = (await res.json()) as ProductResponse;
        console.log(data);
        setDataProduct(data.data);
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) getDataProduk();
  }, [session?.accessToken]);

  const filteredData = hasSearchedParams() ? shuffle(dataProduct) : dataProduct;

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
