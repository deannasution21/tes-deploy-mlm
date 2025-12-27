'use client';

import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  Controller,
  useFormContext,
} from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Password, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { PhoneNumber } from '@core/ui/phone-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  BankData,
  BankStatusResponse,
  CekSponsorResponse,
  OptionType,
  PaymentOption,
  Pin,
  PinResponse,
  Province,
  Regencies,
  UserData,
  UserDataResponse,
} from '@/types';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import WidgetCard from '@core/components/cards/widget-card';
import { routes } from '@/config/routes';
import { FormBlockWrapper } from '../invoice/form-utils';
import Link from 'next/link';
import {
  EditStockistInput,
  editStockistSchema,
} from '@/validators/edit-stockist-schema';
import { PiCheck, PiPencil } from 'react-icons/pi';

function Formnya({
  selectedProvinceName,
  selectedCityName,
  setSelectedProvinceName,
  setSelectedCityName,
  editMode,
  setEditMode,
  type,
  session,
}: {
  selectedProvinceName: string;
  selectedCityName: string;
  setSelectedProvinceName?: (value: string) => void;
  setSelectedCityName?: (value: string) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  type: string;
  session: any;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  // State for dropdown data
  const [dataProvinsi, setDataProvinsi] = useState<OptionType[]>([]);
  const [dataKabupaten, setDataKabupaten] = useState<OptionType[]>([]);

  // Watch selected values
  const selectedProvinsi = getValues('province').trim();
  const selectedKabupaten = getValues('city').trim();

  // String similarity function
  const getSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.trim().toLowerCase();
    const s2 = str2.trim().toLowerCase();

    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;

    // Remove common prefixes
    const clean1 = s1.replace(/^(kota|kabupaten)\s+/i, '');
    const clean2 = s2.replace(/^(kota|kabupaten)\s+/i, '');

    if (clean1 === clean2) return 0.8;
    if (clean1.includes(clean2) || clean2.includes(clean1)) return 0.7;

    return 0;
  };

  const findClosestMatch = (
    target: string,
    options: any[],
    threshold = 0.7
  ) => {
    const matches = options.map((option) => ({
      option,
      similarity: getSimilarity(target, option.label),
    }));

    // Sort by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);

    console.log(`🔍 Matching "${target}":`, matches.slice(0, 3));

    // Return the best match above threshold
    return matches[0]?.similarity >= threshold ? matches[0].option : null;
  };

  useEffect(() => {
    const loadProvinces = async () => {
      const provRes = await fetch('/api/wilayah/provinces');
      const provData = (await provRes.json()) as Province[];
      const provinsiOptions = provData.map((p: any) => ({
        value: p.id,
        label: p.name,
      }));
      setDataProvinsi(provinsiOptions);
    };

    loadProvinces();
  }, []);

  // Fetch kabupaten based on selected provinsi
  const fetchKabupaten = async (idProv: string) => {
    const res = await fetch(`/api/wilayah/regencies/${idProv}`);
    const data = (await res.json()) as Regencies[];
    setDataKabupaten(data.map((k: any) => ({ value: k.id, label: k.name })));

    // Reset dependent fields
    setValue('kabupaten', '');
  };

  // useEffect(() => {
  //   if (!editMode) return;

  //   const init = async () => {
  //     const selectedProv = watch('province');

  //     if (!selectedProv) {
  //       setDataKabupaten([]);
  //       return;
  //     }

  //     const foundProvince = findClosestMatch(selectedProv, dataProvinsi);

  //     if (foundProvince) {
  //       setValue('province', foundProvince.value);
  //     }

  //     const cityRes = await fetch(
  //       `/api/wilayah/regencies/${foundProvince ? foundProvince.value : selectedProv}`
  //     );
  //     const cityData = (await cityRes.json()) as Regencies[];
  //     const kabupatenOptions = cityData.map((k: any) => ({
  //       value: k.id,
  //       label: k.name,
  //     }));

  //     setDataKabupaten(kabupatenOptions);
  //   };

  //   init();
  // }, [editMode, watch('province')]);

  return (
    <>
      <div className="flex-grow pb-10">
        <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
          <FormBlockWrapper title={'Informasi Sistem:'}>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Username"
                  placeholder="Username"
                  {...register(`username`)}
                  inputClassName="[&_input]:uppercase"
                  error={errors?.username?.message as any}
                  disabled
                />
              )}
            />

            <Input
              label="Master Username"
              placeholder="Master Username"
              {...register(`master_username`)}
              // @ts-ignore
              inputClassName="[&_input]:uppercase"
              error={errors?.master_username?.message as any}
              disabled
            />

            <Input
              label="Email"
              placeholder="Email"
              {...register(`email`)}
              // @ts-ignore
              error={errors?.email?.message as any}
              disabled={type === 'clone'}
            />
          </FormBlockWrapper>
          <FormBlockWrapper
            title={'Informasi Pribadi:'}
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <Input
              label="Nama Lengkap"
              placeholder="Nama Lengkap"
              {...register(`nama`)}
              // @ts-ignore
              error={errors?.nama?.message as any}
              disabled={type === 'clone'}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneNumber
                  label="No. HP/WA"
                  country="id"
                  value={value}
                  onChange={onChange}
                  // @ts-ignore
                  error={errors?.phone?.message as string}
                  disabled={type === 'clone'}
                />
              )}
            />

            {!editMode && (
              <>
                <Input
                  label="Provinsi"
                  placeholder="Provinsi"
                  value={
                    selectedProvinceName?.length === 0
                      ? selectedProvinsi
                      : selectedProvinceName
                  }
                  error={errors?.province?.message as any}
                  disabled
                />

                <Input
                  label="Kota/Kabupaten"
                  placeholder="Kota/Kabupaten"
                  value={
                    selectedCityName?.length === 0
                      ? selectedKabupaten
                      : selectedCityName
                  }
                  error={errors?.city?.message as any}
                  disabled
                />

                <div className="col-span-full text-end">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => setEditMode(true)}
                  >
                    <PiPencil className="me-2 h-4 w-4" />
                    Edit Provinsi & Kota
                  </Button>
                </div>
              </>
            )}

            {editMode && (
              <>
                {/* Provinsi */}
                <Controller
                  control={control}
                  name="province"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Provinsi"
                      dropdownClassName="!z-10 h-fit max-h-[250px]"
                      inPortal={false}
                      placeholder="Pilih Provinsi"
                      options={dataProvinsi}
                      onChange={(selectedId) => {
                        const selectedOption = dataProvinsi.find(
                          (p) => p.value === selectedId
                        );
                        onChange(selectedId); // ✅ store ID (used for API chaining)
                        fetchKabupaten(selectedId as string);
                        setSelectedProvinceName?.(selectedOption?.label ?? ''); // ✅ store name separately
                      }}
                      value={value}
                      searchable={true}
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        dataProvinsi.find((p) => p.value === selected)?.label ??
                        ''
                      }
                      error={errors?.province?.message as string | undefined}
                    />
                  )}
                />

                {/* Kabupaten */}
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Kota/Kabupaten"
                      dropdownClassName="!z-10 h-fit max-h-[250px]"
                      inPortal={false}
                      placeholder="Pilih Kabupaten"
                      options={dataKabupaten}
                      onChange={(selectedId) => {
                        const selectedOption = dataKabupaten.find(
                          (p) => p.value === selectedId
                        );
                        onChange(selectedId); // ✅ store ID (used for API chaining)
                        setSelectedCityName?.(selectedOption?.label ?? ''); // ✅ store name separately
                      }}
                      value={value}
                      searchable={true}
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        dataKabupaten.find((k) => k.value === selected)
                          ?.label ?? ''
                      }
                      error={errors?.kabupaten?.message as string | undefined}
                      disabled={!selectedProvinsi}
                    />
                  )}
                />

                <div className="col-span-full text-end">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => setEditMode(false)}
                  >
                    <PiCheck className="me-2 h-4 w-4" />
                    Selesai Edit Provinsi & Kota
                  </Button>
                </div>
              </>
            )}

            <style>
              {`
    textarea:-webkit-autofill {
      border-color: inherit !important;
    }
  `}
            </style>
            <Textarea
              label="Alamat"
              placeholder="Alamat"
              {...register('address')}
              error={errors.address?.message as string}
              textareaClassName="h-20"
              className="col-span-full"
            />
          </FormBlockWrapper>
        </div>
      </div>
    </>
  );
}

// main order form component for create and update order
export default function FormEditStockist({
  className,
  user_id,
}: {
  className?: string;
  user_id?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const position = searchParams.get('position');

  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const methods = useForm({
    defaultValues: {
      username: '',
      master_username: '',
      nama: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      address: '',
    },
    resolver: zodResolver(editStockistSchema),
  });

  const doSave = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const body = {
      ...payload,
      province:
        selectedProvinceName?.length === 0
          ? dataUser?.province
          : selectedProvinceName,
      city: selectedCityName?.length === 0 ? dataUser?.city : selectedCityName,
    };

    fetchWithAuth<any>(
      `/_users/${user_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          nama: body?.nama,
          email: body?.email,
          no_hp: body?.phone,
          province: body?.province,
          city: body?.city,
          address: body?.address,
          type: 'stockist',
        }),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Ubah data berhasil!</Text>);
        setTimeout(() => {
          router.push(routes.stockist.manajemen.index);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> Ubah data gagal</Text>);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<EditStockistInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: `Konfirmasi Ubah Data`,
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
        doSave(data);
      } else {
        toast.success(<Text as="b">Ubah data dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  // Fetch data for clone type
  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<UserDataResponse>(
        `/_users/${user_id}`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([usersData]) => {
        const userData = usersData?.data?.attribute;
        setDataUser(userData || null);
        if (userData) {
          // update form values dynamically
          methods.reset({
            ...methods.getValues(),
            username: user_id ?? '',
            master_username: userData.master_username ?? '',
            nama: userData.nama ?? '',
            email: userData?.email ?? '',
            phone: userData.no_hp ?? '',
            province: userData.province ?? '',
            city: userData.city ?? '',
            address: userData.address ?? '',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  // ---- UI rendering ----
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  if (!dataUser) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Tidak ada data untuk pengguna ini.</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Form Edit Stockist</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <FormProvider {...methods}>
            <form
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              <Formnya
                selectedProvinceName={selectedProvinceName}
                selectedCityName={selectedCityName}
                setSelectedProvinceName={setSelectedProvinceName}
                setSelectedCityName={setSelectedCityName}
                editMode={editMode}
                setEditMode={setEditMode}
                type="edit"
                session={session}
              />
              <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                <Link href={routes.stockist.manajemen.index}>
                  <Button variant="outline" className="w-full @xl:w-auto">
                    Batal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isLoadingS}
                  disabled={editMode ?? isLoadingS}
                  className="w-full @xl:w-auto"
                >
                  Ubah Data
                </Button>
              </div>
            </form>
          </FormProvider>
        </WidgetCard>
      </div>
    </div>
  );
}
