'use client';

import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { Generation, SponsorUnilevelResponse } from '@/types/sponsor-unilevel';
import { Accordion, Badge, Table } from 'rizzui';
import { PiCaretDown } from 'react-icons/pi';

export default function ListSponsorUnilevel({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataPeringkat, setDataPeringkat] = useState<Generation[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<SponsorUnilevelResponse>(
      `/_users?sponsor_id=${session?.user?.id}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const datanya = data?.data?.generations || [];
        setDataPeringkat(datanya);
      })
      .catch((error) => {
        console.error(error);
        setDataPeringkat([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          className={cn('p-0 lg:p-0', className)}
          title="List Peringkat"
          titleClassName="w-[19ch]"
          actionClassName="w-full ps-0 items-center"
          headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
        >
          {dataPeringkat.map((item) => (
            <Accordion
              key={item.level}
              className="mx-8 border-b last-of-type:border-b-0"
            >
              <Accordion.Header>
                {({ open }) => (
                  <div className="flex w-full cursor-pointer items-center justify-between py-5 text-xl font-semibold">
                    Generasi {item.level}
                    <PiCaretDown
                      className={cn(
                        'h-5 w-5 transform transition-transform duration-300',
                        open && '-rotate-180'
                      )}
                    />
                  </div>
                )}
              </Accordion.Header>
              <Accordion.Body className="mb-7 overflow-auto">
                <Table variant="minimal">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>No</Table.Head>
                      <Table.Head>ID Member</Table.Head>
                      <Table.Head className="min-w-48">Nama</Table.Head>
                      <Table.Head>Generasi</Table.Head>
                      <Table.Head>Sponsor</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {item?.members?.map((v, i) => (
                      <Table.Row>
                        <Table.Cell>{i + 1}</Table.Cell>
                        <Table.Cell>{v.attribute?.username}</Table.Cell>
                        <Table.Cell>{v.attribute?.nama}</Table.Cell>
                        <Table.Cell>{item?.level}</Table.Cell>
                        <Table.Cell>
                          <Badge>{v?.attribute?.sponsor_id}</Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Accordion.Body>
            </Accordion>
          ))}
        </WidgetCard>
      </div>
    </div>
  );
}
