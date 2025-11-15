'use client';

import { useEffect, useState } from 'react';
import { Badge, Button } from 'rizzui';
import { useSession } from 'next-auth/react';
import { NetworkDiagramResponse, NetworkNode } from '@/types';
import placeholderDiagram from '@public/assets/img/logo/logo-diagram-jaringan.jpeg';
import Image from 'next/image';
import FiltersDiagramJaringan from './filters';
import Link from 'next/link';
import { PiArrowUpBold, PiCopyBold, PiUserPlusBold } from 'react-icons/pi';
import { Session } from 'next-auth';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Head from 'next/head';
import imgArrowUp from '@public/assets/img/arrow-up-golden.png';
import imgRibbon from '@public/assets/img/golden-ribbon.png';

type TreeProps = {
  data: NetworkNode;
  session: Session | null;
};

function Tree({ data, session }: TreeProps) {
  if (!data)
    return (
      <div className="py-6 text-center italic text-gray-400">
        Sedang memuat diagram...
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
            className="rounded-md bg-yellow-50 p-3 text-center shadow-md transition-all hover:bg-yellow-200"
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
              {node.user_id ?? 'Unknown'}
            </div>
            <div className="mb-2 flex flex-col">
              <span className="fw-bold text-sm text-stone-700">
                {node.name ?? 'Unknown'}
              </span>
              <span className="text-[10px] uppercase text-stone-500">
                {node.location ?? '-'}
              </span>
            </div>
            <div className="flex justify-center gap-2">
              <Badge
                variant="flat"
                rounded="pill"
                className="font-medium"
                color="danger"
                size="sm"
              >
                {node.point_left ?? 0}
              </Badge>
              <Badge
                variant="flat"
                rounded="pill"
                className="font-medium"
                color="danger"
                size="sm"
              >
                {node.point_right ?? 0}
              </Badge>
            </div>
          </Link>
        ) : currentUpline ? (
          // ❗ Null node (potential downline)
          <div className="rounded-md border-2 border-dashed border-yellow-500 bg-white p-3 text-center shadow-sm transition-all">
            {/* Only show actions if we have a valid upline */}
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
          </div>
        ) : (
          ''
        )}

        {/* Children connectors */}
        {!isLeaf && node.user_id && (
          <div className="flex min-w-[300px] flex-col items-center">
            <div className="mt-1 h-4 w-1 bg-gray-300" />
            <div className="-mt-2 flex w-full justify-center">
              <div className="h-1 w-3/4 bg-gray-300" />
            </div>

            {/* Children row */}
            <div className="flex w-full justify-between gap-10">
              {node.children?.map((child, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center self-start`}
                >
                  <div className="mb-1 h-4 w-1 bg-gray-300" />
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
    <>
      <div className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-gray-100">
        <TransformWrapper
          initialScale={0.5}
          minScale={0.25}
          maxScale={3}
          centerOnInit
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
          pinch={{ step: 5 }}
          panning={{ disabled: false, velocityDisabled: true }}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="controls pointer-events-auto absolute right-4 top-4 z-10 flex gap-2">
                <Button size="sm" variant="flat" onClick={() => zoomIn()}>
                  Zoom In
                </Button>
                <Button size="sm" variant="flat" onClick={() => zoomOut()}>
                  Zoom Out
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  onClick={() => {
                    resetTransform();
                    setTimeout(() => centerView(0.5), 50);
                  }}
                >
                  Reset
                </Button>
              </div>
              <TransformComponent>
                <div id="mlm-diagram">
                  {data.upline !== 'sistem' &&
                    data.upline !== session?.user?.id && (
                      <div className="flex flex-col justify-center text-center">
                        <div>
                          <Link
                            href={`/diagram-jaringan/${data.upline}`}
                            className="inline-block"
                          >
                            <div className="aspect-square h-20">
                              <Image
                                alt={'diagram sebelumnya'}
                                src={imgArrowUp}
                              />
                            </div>
                          </Link>
                          <div
                            className="mx-auto flex max-w-40 flex-col gap-1 bg-contain bg-center bg-no-repeat"
                            // style={{ backgroundImage: `url(${imgRibbon.src})` }}
                          >
                            <p>
                              Jaringan:{' '}
                              <span className="font-medium uppercase text-primary">
                                {data?.user_id} ({data?.name})
                              </span>
                            </p>
                            <p>
                              Sponsor:{' '}
                              <span className="font-medium uppercase text-primary">
                                {data?.sponsor ?? '-'}
                              </span>
                            </p>
                            <p>
                              Upline:{' '}
                              <span className="font-medium uppercase text-primary">
                                {data?.upline}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mx-auto h-6">
                          <Image
                            alt="golden ribbon"
                            src={imgRibbon}
                            width={0}
                            height={0}
                            className="h-full w-auto object-contain"
                          />
                        </div>

                        <div className="mx-auto mt-1 h-6 w-1 bg-gray-300" />
                      </div>
                    )}
                  {data && renderNode(data, '0', data.user_id)}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
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
  const [isLoading, setLoading] = useState(true);

  const [dataDiagramJaringan, setDataDiagramJaringan] = useState<NetworkNode>();
  const [username, setUsername] = useState(bawaUsername ?? '');
  const debouncedUsername = useDebounce(username, 600);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const username = debouncedUsername;

    fetchWithAuth<NetworkDiagramResponse>(
      `/_network-diagrams/${username || ''}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataDiagramJaringan(data.data);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        setDataDiagramJaringan(undefined);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, debouncedUsername]);

  return (
    <div className="@container">
      <FiltersDiagramJaringan username={username} setUsername={setUsername} />
      {isLoading ? (
        <div className="py-20 text-center">
          <p>Sedang memuat diagram...</p>
        </div>
      ) : dataDiagramJaringan ? (
        <Tree data={dataDiagramJaringan} session={session} />
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>Tidak ada data diagram jaringan untuk pengguna ini.</p>
        </div>
      )}
    </div>
  );
}
