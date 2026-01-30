'use client';

import { Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { useScrollableSlider } from '@core/hooks/use-scrollable-slider';
import { IconType } from 'react-icons/lib';
import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiArrowDownRight,
  PiArrowUpRight,
  PiTrophy,
  PiInvoice,
} from 'react-icons/pi';
import { Analytics } from '@/types/report-generate-pin';
import WidgetCard from '@core/components/cards/widget-card';
import { underscoreToCaptalize } from '@/utils/helper';

type AppointmentStatsType = {
  className?: string;
  dataOperan: Analytics | null;
  typeReport: string;
};

export type StatType = {
  icon: IconType;
  title: string;
  amount: string;
  increased: boolean;
  percentage: string;
  iconWrapperFill?: string;
  className?: string;
};

export type StatCardProps = {
  className?: string;
  transaction: StatType;
  isUsed?: boolean;
};

export default function ReportStatGrid({
  className,
  dataOperan,
  typeReport,
}: AppointmentStatsType) {
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  return (
    <div
      className={cn(
        'relative flex w-auto items-center overflow-hidden',
        className
      )}
    >
      <Button
        title="Prev"
        variant="text"
        ref={sliderPrevBtn}
        onClick={() => scrollToTheLeft()}
        className="!absolute -left-1 top-0 z-10 !h-full w-20 !justify-start rounded-none bg-gradient-to-r from-gray-0 via-gray-0/70 to-transparent px-0 ps-1 text-gray-500 hover:text-gray-900 dark:from-gray-50 dark:via-gray-50/70 3xl:hidden"
      >
        <PiCaretLeftBold className="h-5 w-5" />
      </Button>
      <div className="w-full overflow-hidden">
        <div
          ref={sliderEl}
          className="custom-scrollbar-x grid grid-flow-col gap-5 overflow-x-auto scroll-smooth 2xl:gap-6 3xl:gap-8 [&::-webkit-scrollbar]:h-0"
        >
          <StatGrid data={dataOperan} typee={typeReport} />
        </div>
      </div>
      <Button
        title="Next"
        variant="text"
        ref={sliderNextBtn}
        onClick={() => scrollToTheRight()}
        className="dark: !absolute -right-2 top-0 z-10 !h-full w-20 !justify-end rounded-none bg-gradient-to-l from-gray-0 via-gray-0/70 to-transparent px-0 pe-2 text-gray-500 hover:text-gray-900 dark:from-gray-50 dark:via-gray-50/70 3xl:hidden"
      >
        <PiCaretRightBold className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function StatGrid({ data, typee }: { data: any; typee: string }) {
  const type = data?.filter?.type
    ? underscoreToCaptalize(data?.filter?.type)
    : typee;
  const typenya = type ?? '-';
  const total =
    type === 'withdrawal_bonus' ||
    type === 'withdrawal_salary' ||
    type === 'pembayaran' ||
    type === 'bonus_salary'
      ? data?.total?.amount_currency
      : data?.total?.amount;
  const min =
    type === 'withdrawal_bonus' ||
    type === 'withdrawal_salary' ||
    type === 'pembayaran' ||
    type === 'bonus_salary'
      ? data?.min?.amount_currency
      : data?.min?.amount;
  const max =
    type === 'withdrawal_bonus' ||
    type === 'withdrawal_salary' ||
    type === 'pembayaran' ||
    type === 'bonus_salary'
      ? data?.max?.amount_currency
      : data?.max?.amount;

  const statData: StatType[] = [
    {
      title: 'Invoice ' + typenya,
      amount: data?.count ?? 0,
      increased: true,
      percentage: '0',
      icon: PiInvoice,
    },
    {
      title: 'Total ' + typenya,
      amount: total ?? 0,
      increased: true,
      percentage: '0',
      icon: PiTrophy,
    },
    {
      title: 'Min ' + typenya,
      amount: min ?? 0,
      increased: false,
      percentage: '0',
      icon: PiTrophy,
    },
    {
      title: 'Max ' + typenya,
      amount: max ?? 0,
      increased: true,
      percentage: '0',
      icon: PiTrophy,
    },
  ];

  return (
    <>
      {type === '_withdrawal_bonus' ||
      type === '_withdrawal_salary' ||
      type === 'Sniper' ? (
        <>
          <StatCard
            key={'stat-card-0'}
            transaction={statData[0]}
            className="w-full min-w-[300px] md:w-[300px] md:max-w-[300px]"
          />
        </>
      ) : (
        <>
          {statData.map((stat: StatType, index: number) => {
            return (
              <StatCard
                key={'stat-card-' + index}
                transaction={stat}
                className="min-w-[300px]"
              />
            );
          })}
        </>
      )}
    </>
  );
}

export function StatCard({ className, transaction, isUsed }: StatCardProps) {
  const { icon, title, amount, increased, percentage, iconWrapperFill } =
    transaction;
  const Icon = icon;
  return (
    <div
      className={cn(
        `group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container ${isUsed ? 'first:bg-gray-400' : 'first:bg-primary'}`,
        className
      )}
    >
      <div className="flex items-center gap-5">
        <span
          className={cn(
            `flex rounded-[14px] ${isUsed ? 'bg-gray-400 text-gray-0 group-first:bg-gray-0 group-first:text-gray-400' : 'bg-primary text-gray-0 group-first:bg-gray-0 group-first:text-primary'} p-2.5 dark:text-gray-900 dark:group-first:bg-gray-900`
          )}
        >
          <Icon className="h-auto w-[30px]" />
        </span>
        <div className="space-y-1.5">
          <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
            {title}
          </p>
          <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
            {amount}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatCardTotal(data: any) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 3xl:gap-8">
        <WidgetCard
          title="PIN Tersedia"
          titleClassName="text-gray-800 sm:text-lg font-inter"
          headerClassName="items-center"
          className={cn('@container')}
        >
          <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:gap-6 3xl:gap-8">
            {Object.entries(data?.dataOperan?.active ?? {}).map(
              ([key, value]) => {
                const stat = {
                  title: underscoreToCaptalize(key),
                  amount: String(value),
                  increased: true,
                  percentage: '0',
                  icon: PiTrophy,
                };

                return (
                  <StatCard
                    key={'stat-card-' + key}
                    transaction={stat}
                    className=""
                  />
                );
              }
            )}
          </div>
        </WidgetCard>
        <WidgetCard
          title="PIN Terpakai"
          titleClassName="text-gray-800 sm:text-lg font-inter"
          headerClassName="items-center"
          className={cn('@container')}
        >
          <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:gap-6 3xl:gap-8">
            {Object.entries(data?.dataOperan?.used ?? {}).map(
              ([key, value]) => {
                const stat = {
                  title: underscoreToCaptalize(key),
                  amount: String(value),
                  increased: true,
                  percentage: '0',
                  icon: PiTrophy,
                };

                return (
                  <StatCard
                    key={'stat-card-' + key}
                    transaction={stat}
                    className=""
                    isUsed={true}
                  />
                );
              }
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
