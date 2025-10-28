'use client';

import { useEffect, useState } from 'react';
import { Button, Text } from 'rizzui';
import ProdukCard from '@core/components/cards/produk-card';
import hasSearchedParams from '@core/utils/has-searched-params';
// Note: using shuffle to simulate the filter effect
import shuffle from 'lodash/shuffle';
import { routes } from '@/config/routes';
import { signOut, useSession } from 'next-auth/react';
import { NetworkDiagramResponse, NetworkNode } from '@/types';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import placeholderDiagram from '@public/assets/img/logo/logo-diagram-jaringan.jpeg';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import FiltersDiagramJaringan from './filters';
import Link from 'next/link';
import { PiCopyBold, PiUserPlusBold } from 'react-icons/pi';

type TreeProps = {
  data: NetworkNode;
};

function Tree({ data }: TreeProps) {
  if (!data)
    return (
      <div className="py-6 text-center italic text-gray-400">
        Loading tree...
      </div>
    );

  const renderNode = (
    node: NetworkNode,
    indexPath: string,
    upline?: string | null
  ) => {
    const isLeaf = !node.children || node.children.length === 0;

    // if current node has user_id, update upline reference
    const currentUpline = upline;

    return (
      <div
        key={indexPath}
        className={`flex flex-col items-center ${
          node.position === 'left'
            ? 'self-start'
            : node.position === 'right'
              ? 'self-end'
              : 'self-center'
        }`}
      >
        {/* Node box */}
        {node.user_id ? (
          // ✅ Non-null data
          <Link
            href={`/diagram-jaringan/${node.user_id}`}
            className="rounded-md bg-yellow-50 p-3 text-center transition-all hover:bg-yellow-200"
          >
            <div className="relative mx-auto mb-2 aspect-square w-14 overflow-hidden rounded-full border-2 border-yellow-500 shadow-sm">
              <Image
                src={placeholderDiagram}
                alt="Diagram"
                fill
                className="object-cover"
              />
            </div>
            <div
              className={`mb-1 whitespace-nowrap rounded border px-3 py-1 text-sm uppercase shadow-sm ${
                node.hasData
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 bg-gray-50 text-gray-600'
              }`}
            >
              {node.name ?? 'Unknown'}
            </div>
            <span className="text-xs text-stone-500">
              {node.location ?? '-'}
            </span>
          </Link>
        ) : (
          // ❗ Null node (potential downline)
          <div className="rounded-md border-2 border-dashed border-yellow-500 bg-white p-3 text-center shadow-sm transition-all">
            <div className="relative mx-auto mb-2 aspect-square w-14 overflow-hidden rounded-full border-2 border-yellow-500 shadow-sm grayscale">
              <Image
                src={placeholderDiagram}
                alt="Diagram"
                fill
                className="object-cover"
              />
            </div>

            {/* Only show actions if we have a valid upline */}
            {currentUpline ? (
              <div className="flex gap-3">
                <Link
                  href={`/diagram-jaringan/${currentUpline}/clone?position=${node.position}`}
                >
                  <Button size="sm" variant="flat" disabled={!upline}>
                    <PiCopyBold className="me-2" />
                    <span>Clone</span>
                  </Button>
                </Link>
                <Link
                  href={`/diagram-jaringan/${currentUpline}/posting?position=${node.position}`}
                >
                  <Button size="sm" disabled={!upline}>
                    <PiUserPlusBold className="me-2" />
                    <span>Posting</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-2 text-xs italic text-gray-400">
                Upline belum aktif
              </div>
            )}
          </div>
        )}

        {/* Children connectors */}
        {!isLeaf && (
          <div className="flex min-w-[300px] flex-col items-center">
            <div className="mt-1 h-4 w-px bg-gray-300" />
            <div className="-mt-2 flex w-full justify-center">
              <div className="h-0.5 w-3/4 bg-gray-300" />
            </div>

            {/* Children row */}
            <div className="flex w-full justify-between gap-10">
              {node.children?.map((child, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center ${
                    child.position === 'left'
                      ? 'self-start'
                      : child.position === 'right'
                        ? 'self-end'
                        : 'self-center'
                  }`}
                >
                  <div className="mb-1 h-4 w-px bg-gray-300" />
                  {/* 🔁 Pass the latest known upline */}
                  {renderNode(child, `${indexPath}-${i}`, node.user_id)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto p-6">
      <div className="inline-block min-w-full">
        {data && renderNode(data, '0', data.user_id)}
      </div>
    </div>
  );
}

export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function DiagramJaringanPage({
  bawaUsername,
}: {
  bawaUsername?: string;
}) {
  const { data: session } = useSession();
  const [dataDiagramJaringan, setDataDiagramJaringan] = useState<NetworkNode>();
  const [isLoading, setLoading] = useState(true);
  const [username, setUsername] = useState(bawaUsername ?? '');
  const debouncedUsername = useDebounce(username, 600);

  useEffect(() => {
    if (!session?.accessToken) return;

    const getDataDiagramJaringan = async (username?: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_network-diagrams/${username || ''}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session.accessToken ?? '',
            },
          }
        );

        if (res.status === 401) {
          toast.error(<Text as="b">Sesi berakhir. Silakan login ulang</Text>);
          setTimeout(() => signOut(), 300);
          return;
        }

        if (!res.ok) {
          // Try to read the JSON error message from the response
          const errorData: any = await res.json().catch(() => null);
          const message =
            errorData?.message || `HTTP error! status: ${res.status}`;

          // Throw a custom error containing message
          throw new Error(message);
        }

        const data = (await res.json()) as NetworkDiagramResponse;
        setDataDiagramJaringan(data.data);
      } catch (error: any) {
        // Access your message
        toast.error(error.message || 'Terjadi kesalahan tak terduga');
      } finally {
        setLoading(false);
      }
    };

    getDataDiagramJaringan(debouncedUsername);
  }, [session?.accessToken, debouncedUsername]);

  return (
    <div className="@container">
      <FiltersDiagramJaringan username={username} setUsername={setUsername} />
      {isLoading ? (
        <div className="py-20 text-center">
          <p>Sedang memuat diagram...</p>
        </div>
      ) : (
        dataDiagramJaringan && <Tree data={dataDiagramJaringan} />
      )}
    </div>
  );
}
