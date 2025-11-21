'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Button, Text } from 'rizzui';
import { DownloadItem } from '.';

const columnHelper = createColumnHelper<DownloadItem>();

export const listDownloadColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Nama File',
    size: 180,
    cell: ({ row }) => (
      <>
        <Text className="text-gray-700">{row.original.name}</Text>
      </>
    ),
  }),
  columnHelper.accessor('format', {
    id: 'format',
    header: 'Format',
    size: 100,
    cell: ({ row }) => (
      <Text className="whitespace-nowrap uppercase">{row.original.format}</Text>
    ),
  }),
  columnHelper.accessor('url', {
    id: 'url',
    header: 'Download',
    size: 180,
    cell: (info) => (
      <a href={info.getValue()} download>
        <Button>Download</Button>
      </a>
    ),
  }),
];
