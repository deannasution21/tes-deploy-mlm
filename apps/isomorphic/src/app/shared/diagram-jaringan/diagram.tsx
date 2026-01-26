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
import { useRouter } from 'next/navigation';

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
            {node?.promo_points && (
              <>
                <p className="text-[10px] text-green-600">Point Promo Mobil:</p>
                <div className="flex justify-center gap-2">
                  <Badge
                    variant="flat"
                    rounded="pill"
                    className="font-medium"
                    color="success"
                    size="sm"
                  >
                    {node?.promo_points?.car?.effective_total?.left ?? 0}
                  </Badge>
                  <Badge
                    variant="flat"
                    rounded="pill"
                    className="font-medium"
                    color="success"
                    size="sm"
                  >
                    {node?.promo_points?.car?.effective_total?.right ?? 0}
                  </Badge>
                </div>
                <p className="text-[10px] text-blue-600">Point Promo Wisata:</p>
                <div className="flex justify-center gap-2">
                  <Badge
                    variant="flat"
                    rounded="pill"
                    className="font-medium"
                    color="info"
                    size="sm"
                  >
                    {node?.promo_points?.trip?.effective_total?.left ?? 0}
                  </Badge>
                  <Badge
                    variant="flat"
                    rounded="pill"
                    className="font-medium"
                    color="info"
                    size="sm"
                  >
                    {node?.promo_points?.trip?.effective_total?.right ?? 0}
                  </Badge>
                </div>
              </>
            )}
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
      {/* <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head> */}

      <p className="mb-2 text-sm text-green-600">
        **Untuk tampilan lebih besar, silakan lakukan zoom in/out dengar jari
        Anda pada layar.
      </p>
      <div
        className="bg-gray-100s relative flex w-full items-center justify-center overflow-auto"
        // style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
      >
        <div id="mlm-diagram" className="scale-50 md:scale-100">
          {data.upline !== 'sistem' && (
            <>
              {session?.user?.id === 'admin' ? (
                <div className="flex flex-col justify-center text-center">
                  <div>
                    <Link
                      href={`/diagram-jaringan/${data.upline}`}
                      className="inline-block"
                    >
                      <div className="aspect-square h-20">
                        <Image alt={'diagram sebelumnya'} src={imgArrowUp} />
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
                      {/* <p>
                                Upline:{' '}
                                <span className="font-medium uppercase text-primary">
                                  {data?.upline}
                                </span>
                              </p> */}
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
              ) : (
                data.upline !== session?.user?.id && (
                  <div className="flex flex-col justify-center text-center">
                    <div>
                      <Link
                        href={`/diagram-jaringan/${data.upline}`}
                        className="inline-block"
                      >
                        <div className="aspect-square h-20">
                          <Image alt={'diagram sebelumnya'} src={imgArrowUp} />
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
                        {/* <p>
                                  Upline:{' '}
                                  <span className="font-medium uppercase text-primary">
                                    {data?.upline}
                                  </span>
                                </p> */}
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
                )
              )}
            </>
          )}
          {data && renderNode(data, '0', data.user_id)}
        </div>
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
  const router = useRouter();

  const [dataDiagramJaringan, setDataDiagramJaringan] = useState<NetworkNode>();
  const [username, setUsername] = useState(bawaUsername ?? '');

  const handleSearch = (query?: string) => {
    console.log(query);
    router.push(`/diagram-jaringan/${query || ''}`);
    // fetchDataDiagram(query ?? username);
  };

  const fetchDataDiagram = async (query?: string) => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<NetworkDiagramResponse>(
      `/_network-diagrams/${query || ''}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataDiagramJaringan(data.data);
      })
      .catch((error) => {
        console.error(error);
        setDataDiagramJaringan(undefined);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    // If you open via URL: /network-diagram/{username}
    // Fetch automatically using the param
    fetchDataDiagram(bawaUsername);
  }, [session?.accessToken, bawaUsername]);

  return (
    <div className="@container">
      <FiltersDiagramJaringan
        username={username}
        setUsername={setUsername}
        handleSearch={handleSearch}
        upline={dataDiagramJaringan?.upline ?? ''}
      />
      {isLoading ? (
        <div className="py-20 text-center">
          <p>Sedang memuat diagram...</p>
        </div>
      ) : dataDiagramJaringan ? (
        <Tree data={dataDiagramJaringan} session={session} />
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>Tidak ada data diagram jaringan untuk pengguna ini.</p>
          <Button
            size="sm"
            onClick={() => handleSearch?.('')}
            className="mt-5 h-9"
          >
            Kembali
          </Button>
        </div>
      )}
    </div>
  );
}
