'use client';

import { routes } from '@/config/routes';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Button, Text } from 'rizzui';
import Link from 'next/link';
import { PiPencil, PiPrinter, PiTrash, PiTruck } from 'react-icons/pi';
import { ProductItem } from '@/types';
import Image from 'next/image';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpg';
import imgFCMIST from '@public/assets/img/product/FCMIST.jpeg';
import imgEGAM from '@public/assets/img/product/EGAM.jpeg';
import imgLP from '@public/assets/img/product/LP.jpeg';

const columnHelperNew = createColumnHelper<ProductItem>();

export const produkColumnsNew = () => {
  const columns = [
    {
      id: 'no',
      header: '#',
      size: 60,
      cell: ({ row }: { row: any }) => row.index + 1 + '.',
    },
    columnHelperNew.accessor('attribute.name', {
      id: 'name',
      size: 200,
      header: 'Produk',
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.product_id;

        return (
          <div className="flex items-center gap-3">
            <div className="relative aspect-square h-10 w-10">
              <Image
                src={
                  id === 'PRD0002'
                    ? imgHNB
                    : id === 'PRD0003'
                      ? imgLILAC
                      : id === 'PRD0001'
                        ? imgSNP
                        : id === 'PRD0004'
                          ? imgFCMIST
                          : id === 'PRD0005'
                            ? imgEGAM
                            : id === 'PRD0006'
                              ? imgLP
                              : defaultPlaceholder
                }
                alt=""
                fill
                priority
                className="overflow-hidden rounded-lg object-contain shadow-md"
              />
            </div>
            <Text className="text-sm font-medium text-gray-700">
              {row.original.attribute.name}
            </Text>
          </div>
        );
      },
    }),
    columnHelperNew.accessor('attribute.description', {
      id: 'description',
      size: 150,
      header: 'Deskripsi',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.stock', {
      id: 'stock',
      size: 100,
      header: 'Stok',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()} Pcs</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.stock_pin', {
      id: 'pin',
      size: 100,
      header: 'PIN',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}/ Qty</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.price.currency', {
      id: 'price',
      size: 150,
      header: 'Harga',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('product_id', {
      id: 'aksi',
      size: 150,
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.product_id;

        return (
          <div className="flex flex-col gap-2 md:flex-row">
            <Link
              href={routes.produk.manajemen.edit(id as string)}
              className="inline-flex"
            >
              <Button
                size="sm"
                className="w-full bg-green-300 text-green-900 hover:bg-green-400"
              >
                <PiPencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Button>
            </Link>
            <Button size="sm" color="danger" variant="flat">
              <PiTrash className="mr-2 h-4 w-4" />
              <span>Hapus</span>
            </Button>
          </div>
        );
      },
    }),
  ];

  return columns;
};
