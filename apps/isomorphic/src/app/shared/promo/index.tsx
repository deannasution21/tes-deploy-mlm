'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import pageImg from '@public/assets/img/promo-stockist-ipg-thailand.jpg';
import pageImg1 from '@public/assets/img/promo-mobil-januari-2026.jpeg';
import pageImg2 from '@public/assets/img/promo-vietnam-januari-2026.jpeg';
import WidgetCard from '@core/components/cards/widget-card';
import { Form } from '@core/ui/form';
import { FormBlockWrapper } from '../invoice/form-utils';
import { Button, Input, Text } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  AvailablePackage,
  PromoData,
  PromoStatusResponse,
} from '@/types/promo';
import { PromoInput, promoSchema } from '@/validators/promo-schema';
import { Controller, SubmitHandler } from 'react-hook-form';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

export default function PromoPage({ className }: { className?: string }) {
  const { data: session } = useSession();

  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [dataWhole, setDataWhole] = useState<PromoData | null>(null);
  const [dataPromo, setDataPromo] = useState<AvailablePackage[]>([]);

  const getDataPromo = async () => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const id = session?.user?.id;

    fetchWithAuth<PromoStatusResponse>(
      `/_promos?username=${id}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataWhole(data?.data ?? null);
      })
      .catch((error) => {
        console.error(error);
        setDataWhole(null);
      })
      .finally(() => setLoadingS(false));
  };

  const doSubmit = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_promos/action`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        Swal.fire({
          title: 'Pilih Promo Berhasil',
          html: `Selamat anda telah memilih PROMO <b>PAKET ${payload?.package_id}</b>`,
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
          allowOutsideClick: false, // 🔒 disable click outside
          allowEscapeKey: false, // 🔒 disable ESC
          allowEnterKey: true,
        }).then(() => {
          setLoadingS(false);
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(<Text as="b">Pilih PROMO Gagal</Text>);
        console.error(error);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<PromoInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: 'Konfirmasi Pilih Promo',
      html: 'Harap pastikan data yang Anda masukkan benar. Jika sudah silakan <strong>LANJUTKAN</strong>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3', // 👈 your custom class here
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false, // 👈 important! disable default styling
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        doSubmit({
          action: 'join',
          promo_config_id: 'PROMO#IPG_2026',
          package_id: Number(data?.package_id),
        });
      } else {
        toast.success(<Text as="b">Pilih PROMO dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    getDataPromo();

    setLoading(false);
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <div className="">
            <div className="mx-auto max-w-sm md:max-w-xl lg:max-w-2xl">
              <div className="flex flex-col gap-4">
                <Image
                  src={pageImg}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />

                <Image
                  src={pageImg1}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />

                <Image
                  src={pageImg2}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />
              </div>
            </div>
          </div>

          {dataWhole?.promo_status === 'active' &&
            dataWhole?.user_status?.qualified_for_promo && (
              <div>
                <WidgetCard
                  title={
                    <span className="text-[#c69731]">Form Pilih Promo</span>
                  }
                  titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
                >
                  <div>
                    <Form<PromoInput>
                      validationSchema={promoSchema}
                      onSubmit={onSubmit}
                      useFormProps={{
                        defaultValues: {
                          package_id: '', // ✅ now valid
                        } as PromoInput,
                      }}
                      className="flex flex-grow flex-col @container [&_label]:font-medium"
                    >
                      {({
                        register,
                        control,
                        watch,
                        setValue,
                        reset,
                        formState: { errors },
                      }) => {
                        return (
                          <>
                            <div className="flex-grow pb-10">
                              <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                                <FormBlockWrapper
                                  title={'Data PROMO Berjalan:'}
                                >
                                  <Input
                                    label="Promo Dipilih"
                                    value={
                                      dataWhole?.package_info?.package_status ??
                                      ''
                                    }
                                    readOnly
                                    disabled
                                  />

                                  <Input
                                    label="Jumlah User PIN Bayar"
                                    value={
                                      dataWhole?.user_status
                                        ?.active_downlines ?? 0
                                    }
                                    readOnly
                                    disabled
                                  />
                                </FormBlockWrapper>
                                <FormBlockWrapper
                                  title={'Pilih/Upgrade PROMO:'}
                                  className="pt-7 @2xl:pt-9 @3xl:pt-11"
                                >
                                  <Controller
                                    name="package_id"
                                    control={control}
                                    render={({
                                      field: { name, onChange, value },
                                    }) => {
                                      const packages =
                                        dataWhole?.package_info
                                          ?.available_packages ?? [];
                                      const channels =
                                        dataWhole?.channels ?? [];

                                      const isUserQualified = channels.every(
                                        (c) => c.qualified
                                      );
                                      const isDecisionLocked =
                                        dataWhole?.package_info
                                          ?.decision_locked ?? false;

                                      const isDisabled =
                                        !isUserQualified || isDecisionLocked;

                                      type RewardPolicy =
                                        | 'choose_one'
                                        | 'all'
                                        | 'none';

                                      const rewardPolicyLabel = (
                                        policy?: RewardPolicy
                                      ) => {
                                        switch (policy) {
                                          case 'choose_one':
                                            return 'Pilih salah satu reward:';
                                          case 'all':
                                            return 'Berhak atas semua rewards:';
                                          case 'none':
                                            return 'Tidak ada reward pada channel ini';
                                          default:
                                            return '';
                                        }
                                      };

                                      if (
                                        dataWhole?.package_info
                                          ?.available_packages?.length === 0
                                      ) {
                                        return (
                                          <Text className="text-base text-red-600">
                                            Belum ada PROMO tersedia
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <div className="col-span-full">
                                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                              {packages.map((pkg) => (
                                                <div key={pkg.package_id}>
                                                  <label
                                                    className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition ${
                                                      value ==
                                                      String(pkg.package_id)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    } `}
                                                  >
                                                    {/* RADIO */}
                                                    <input
                                                      type="radio"
                                                      name={name}
                                                      value={String(
                                                        pkg.package_id
                                                      )}
                                                      checked={
                                                        value ==
                                                        String(pkg.package_id)
                                                      }
                                                      // disabled={isDisabled}
                                                      onChange={(e) =>
                                                        onChange(e.target.value)
                                                      }
                                                      className="mt-1 h-4 w-4"
                                                    />

                                                    {/* CONTENT */}
                                                    <div className="flex flex-col gap-3">
                                                      {/* PACKAGE NAME */}
                                                      <div className="font-semibold text-gray-900">
                                                        Paket {pkg.package_id}{' '}
                                                        ID
                                                      </div>

                                                      {/* CHANNEL DETAILS */}
                                                      {channels
                                                        .filter((channel) =>
                                                          pkg.eligible_channels.includes(
                                                            channel.channel_id
                                                          )
                                                        )
                                                        .map((channel) => (
                                                          <div
                                                            key={
                                                              channel.channel_id
                                                            }
                                                            className="rounded-lg bg-gray-50 p-3 text-sm"
                                                          >
                                                            {/* Program Name */}
                                                            <div className="font-medium text-gray-800">
                                                              {channel.name}
                                                            </div>

                                                            {/* Period */}
                                                            <div className="text-gray-500">
                                                              Periode:{' '}
                                                              {
                                                                channel.period
                                                                  .start
                                                              }{' '}
                                                              –{' '}
                                                              {
                                                                channel.period
                                                                  .end
                                                              }
                                                            </div>

                                                            {/* Rewards */}
                                                            <div className="mt-2">
                                                              <div className="mb-1 text-xs font-semibold text-green-600">
                                                                {rewardPolicyLabel(
                                                                  pkg
                                                                    .reward_policy?.[
                                                                    channel
                                                                      .channel_id
                                                                  ]
                                                                )}
                                                              </div>

                                                              <ul className="list-inside list-disc text-gray-600">
                                                                {channel.rewards.map(
                                                                  (r, idx) => (
                                                                    <li
                                                                      key={idx}
                                                                    >
                                                                      {
                                                                        r.requirement
                                                                      }{' '}
                                                                      →{' '}
                                                                      {r.reward}
                                                                    </li>
                                                                  )
                                                                )}
                                                              </ul>
                                                            </div>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </label>
                                                </div>
                                              ))}
                                            </div>

                                            {errors.package_id && (
                                              <p className="text-sm text-red-500">
                                                {errors.package_id.message}
                                              </p>
                                            )}
                                          </div>
                                        );
                                      }
                                    }}
                                  />
                                </FormBlockWrapper>
                              </div>
                            </div>
                            <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                              <Button
                                type="submit"
                                isLoading={isLoadingS}
                                disabled={
                                  dataWhole.package_info.available_packages
                                    .length === 0 ?? isLoadingS
                                }
                                className="w-full @xl:w-auto"
                              >
                                Pilih Promo
                              </Button>
                            </div>
                          </>
                        );
                      }}
                    </Form>
                  </div>
                </WidgetCard>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
