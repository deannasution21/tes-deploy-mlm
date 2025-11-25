'use client';

import { routes } from '@/config/routes';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Button, Text } from 'rizzui';
import Link from 'next/link';
import { PiPencil, PiPrinter, PiTrash, PiTruck } from 'react-icons/pi';
import Image from 'next/image';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpg';
import imgFCMIST from '@public/assets/img/product/FCMIST.jpeg';
import { UserListItem } from '@/types/member';

const columnHelperNew = createColumnHelper<UserListItem>();

export const memberColumnsNew = () => {
  const columns = [
    {
      id: 'no',
      header: '#',
      size: 60,
      cell: ({ row }: { row: any }) => row.index + 1 + '.',
    },
    columnHelperNew.accessor('attribute.username', {
      id: 'username',
      size: 100,
      header: 'Username',
      cell: (info) => (
        <Text className="text-xs font-medium uppercase tracking-wider text-gray-700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.nama', {
      id: 'name',
      size: 150,
      header: 'Member',
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <>
            <Text className="text-sm font-medium text-gray-700">
              {row.original.attribute.nama}
            </Text>
            <Text className="text-xs text-gray-500">
              {row.original.attribute.email}
            </Text>
          </>
        );
      },
    }),
    columnHelperNew.accessor('attribute.no_hp', {
      id: 'hp',
      size: 150,
      header: 'HP',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.province', {
      id: 'alamat',
      size: 150,
      header: 'Alamat',
      cell: ({ row }) => (
        <Text className="text-xs text-gray-700">
          {row.original.attribute.city}, {row.original.attribute.province}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.nik', {
      id: 'nik',
      size: 100,
      header: 'NIK',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.parent_id', {
      id: 'upline',
      size: 100,
      header: 'Upline',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.sponsor_id', {
      id: 'sponsor',
      size: 100,
      header: 'Sponsor',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.level', {
      id: 'level',
      size: 100,
      header: 'Level',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.point_left', {
      id: 'point_left',
      size: 100,
      header: 'Point Kiri',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.point_right', {
      id: 'point_right',
      size: 100,
      header: 'Point Kanan',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.bonus_pairing', {
      id: 'bonus_pairing',
      size: 100,
      header: 'Pasangan Bonus',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.heir_name', {
      id: 'heir_name',
      size: 100,
      header: 'Ahli Waris',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.heir_relationship', {
      id: 'heir_relationship',
      size: 100,
      header: 'Status Ahli Waris',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.npwp_name', {
      id: 'npwp_name',
      size: 150,
      header: 'NPWP',
      cell: ({ row }) => (
        <ul>
          <li>
            <Text className="text-xs text-gray-700">
              Nama: {row.original.attribute.npwp_name}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              Nomor: {row.original.attribute.npwp_number}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              Alamat: {row.original.attribute.npwp_address}
            </Text>
          </li>
        </ul>
      ),
    }),
    columnHelperNew.accessor('attribute.no_rekening', {
      id: 'no_rekening',
      size: 150,
      header: 'Rekening',
      cell: ({ row }) => (
        <ul>
          <li>
            <Text className="text-xs text-gray-700">
              Bank: {row.original.attribute.nama_bank} -{' '}
              {row.original.attribute.no_rekening}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              An: {row.original.attribute.nama_pemilik_rekening}
            </Text>
          </li>
        </ul>
      ),
    }),
    columnHelperNew.accessor('id', {
      id: 'aksi',
      size: 150,
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex flex-col gap-2 md:flex-row">
            <Link
              href={routes.member.manajemen.edit(id as string)}
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
