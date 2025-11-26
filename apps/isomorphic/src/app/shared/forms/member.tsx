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
  EditMemberInput,
  editMemberSchema,
} from '@/validators/edit-member-schema';

function Formnya({
  setSelectedProvinceName,
  setSelectedCityName,
  dataBank,
  dataPin,
  dataPin2,
  type,
  session,
}: {
  setSelectedProvinceName?: (value: string) => void;
  setSelectedCityName?: (value: string) => void;
  dataBank: OptionType[];
  dataPin: OptionType[];
  dataPin2: Pin[];
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

  const pasangan = [
    {
      label: 'Suami',
      value: 'Husband',
    },
    {
      label: 'Istri',
      value: 'Wife',
    },
    {
      label: 'Anak',
      value: 'Children',
    },
    {
      label: 'Saudara',
      value: 'Brother',
    },
    {
      label: 'Ibu Kandung',
      value: 'Mother',
    },
  ];

  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCheckSponsor = async () => {
    if (!session?.accessToken) return;

    const sponsor = getValues('sponsor')?.trim();
    const upline = getValues('upline')?.trim();
    if (!sponsor) {
      setFeedback('Mohon isi sponsor terlebih dahulu');
      return;
    }

    setChecking(true);
    setFeedback(null);

    fetchWithAuth<CekSponsorResponse>(
      `/_network-diagrams/check-sponsor/${sponsor}?upline=${upline}`,
      {
        method: 'GET',
      },
      session.accessToken
    )
      .then((data) => {
        if (data?.success) {
          setFeedback(`✅ ${data?.message ?? 'Sponsor valid'}`);
        } else {
          setFeedback(`❌ ${data?.message ?? 'Sponsor tidak ditemukan'}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setFeedback(`❌ ${error ?? 'Sponsor tidak ditemukan'}`);
        // Clear the data so UI can show "no data"
      })
      .finally(() => setChecking(false));
  };

  const isEditMode = true;

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

  // Add this useEffect for edit mode initialization
  useEffect(() => {
    if (!isEditMode || !selectedProvinsi || !selectedKabupaten) return;

    const initializeEditData = async () => {
      // Fetch provinces first
      const provRes = await fetch('/api/wilayah/provinces');
      const provData = (await provRes.json()) as Province[];
      const provinsiOptions = provData.map((p: any) => ({
        value: p.id,
        label: p.name,
      }));
      setDataProvinsi(provinsiOptions);

      // Find province ID from province name
      const foundProvince = findClosestMatch(selectedProvinsi, provinsiOptions);

      if (foundProvince) {
        // Set province in form
        setValue('province', foundProvince.value);
        // setSelectedProvinsi(foundProvince.value);

        // Fetch cities for this province
        const cityRes = await fetch(
          `/api/wilayah/regencies/${foundProvince.value}`
        );
        const cityData = (await cityRes.json()) as Regencies[];
        const kabupatenOptions = cityData.map((k: any) => ({
          value: k.id,
          label: k.name,
        }));
        setDataKabupaten(kabupatenOptions);

        // Find city ID from city name
        const foundCity = findClosestMatch(selectedKabupaten, kabupatenOptions);

        if (foundCity) {
          setValue('city', foundCity.value);
        }
      }
    };

    initializeEditData();
  }, [isEditMode, selectedProvinsi, selectedKabupaten, setValue]);

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
              label="Upline"
              placeholder="Upline"
              {...register(`upline`)}
              // @ts-ignore
              inputClassName="[&_input]:uppercase"
              error={errors?.upline?.message as any}
              disabled
            />

            <div className="space-y-1">
              <div className="flex items-end gap-2">
                <Input
                  label="Sponsor"
                  placeholder="Sponsor"
                  {...register('sponsor')}
                  // @ts-ignore
                  error={errors?.sponsor?.message as any}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleCheckSponsor}
                  isLoading={checking}
                  disabled={checking}
                  className="shrink-0"
                >
                  Cek
                </Button>
              </div>

              {feedback && (
                <p
                  className={`text-sm ${
                    feedback.includes('Valid')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {feedback}
                </p>
              )}
            </div>

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
              {...register(`full_name`)}
              // @ts-ignore
              className="col-span-full"
              error={errors?.full_name?.message as any}
              disabled={type === 'clone'}
            />
            <Input
              label="NIK"
              placeholder="(Nomor Induk Kependudukan)"
              {...register(`nik`)}
              // @ts-ignore
              error={errors?.nik?.message as any}
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
            <Input
              label="Nama Ahli Waris"
              placeholder="Nama Ahli Waris"
              {...register(`heir_name`)}
              // @ts-ignore
              error={errors?.heir_name?.message as any}
              disabled={type === 'clone'}
            />
            <Controller
              name="heir_relationship"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Status Ahli Waris"
                  dropdownClassName="!z-10 h-fit"
                  inPortal={false}
                  placeholder="Pilih Status Ahli Waris"
                  options={pasangan}
                  onChange={onChange}
                  value={value}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    pasangan?.find((con) => con.value === selected)?.label ?? ''
                  }
                  error={errors?.heir_relationship?.message as string}
                  disabled={type === 'clone'}
                />
              )}
            />
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
                    setSelectedProvinceName?.(selectedOption?.label ?? ''); // ✅ store name separately
                  }}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataProvinsi.find((p) => p.value === selected)?.label ?? ''
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
                    dataKabupaten.find((k) => k.value === selected)?.label ?? ''
                  }
                  error={errors?.kabupaten?.message as string | undefined}
                  disabled={!selectedProvinsi}
                />
              )}
            />
          </FormBlockWrapper>
          <FormBlockWrapper
            title={'Informasi Rekening:'}
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <Controller
              control={control}
              name="bank_name"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Bank"
                  dropdownClassName="!z-10 h-fit"
                  inPortal={false}
                  placeholder="Pilih Bank"
                  options={dataBank}
                  onChange={(selectedValue) => {
                    // 🔹 Update form field value
                    onChange(selectedValue);
                  }}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataBank.find((k) => k.value === selected)?.label ?? ''
                  }
                  error={errors?.bank_name?.message as string | undefined}
                  disabled={type === 'clone'}
                />
              )}
            />
            <Input
              label="No. Rekening"
              placeholder="No. Rekening"
              {...register(`bank_account_number`)}
              // @ts-ignore
              error={errors?.bank_account_number?.message as any}
              disabled={type === 'clone'}
            />
            <Input
              label="Atas Nama"
              placeholder="Atas Nama"
              {...register(`bank_account_name`)}
              // @ts-ignore
              error={errors?.bank_account_name?.message as any}
              disabled={type === 'clone'}
            />
          </FormBlockWrapper>
          <FormBlockWrapper
            title={'Informasi NPWP:'}
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <Input
              label="Nama Pada NPWP"
              placeholder="Nama Pada NPWP"
              {...register(`npwp_name`)}
              // @ts-ignore
              error={errors?.npwp_name?.message as any}
              disabled={type === 'clone'}
            />
            <Input
              label="No. NPWP"
              placeholder="No. NPWP"
              {...register(`npwp_number`)}
              // @ts-ignore
              error={errors?.npwp_number?.message as any}
              disabled={type === 'clone'}
            />
            <style>
              {`
    textarea:-webkit-autofill {
      border-color: inherit !important;
    }
  `}
            </style>
            <Textarea
              label="Alamat NPWP"
              placeholder="Alamat NPWP"
              {...register('npwp_address')}
              error={errors.npwp_address?.message as string}
              textareaClassName="h-10"
              disabled={type === 'clone'}
            />
          </FormBlockWrapper>
        </div>
      </div>
    </>
  );
}

// main order form component for create and update order
export default function FormEditMember({
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
  const [dataPin, setDataPin] = useState<OptionType[]>([]);
  const [dataPin2, setDataPin2] = useState<Pin[]>([]);
  const [dataBank, setDataBank] = useState<OptionType[]>([]);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  const methods = useForm({
    defaultValues: {
      username: '',
      upline: '',
      sponsor: '',
      full_name: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      nik: '',
      npwp_name: '',
      npwp_number: '',
      npwp_address: '',
      heir_name: '',
      heir_relationship: '',
    },
    resolver: zodResolver(editMemberSchema),
  });

  const doSave = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const body = {
      ...payload,
      province: selectedProvinceName,
      city: selectedCityName,
    };

    fetchWithAuth<any>(
      `/_users/${user_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          nama: body?.full_name,
          email: body?.email,
          no_hp: body?.phone,
          account_name: body?.bank_account_name,
          account_number: body?.bank_account_number,
          bank_code: body?.bank_name,
          province: body?.province,
          city: body?.city,
          nik: body?.nik,
          npwp_name: body?.npwp_name,
          npwp_number: body?.npwp_number,
          npwp_address: body?.npwp_address,
          heir_name: body?.heir_name,
          heir_relationship: body?.heir_relationship,
          type: 'member',
        }),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Ubah data berhasil!</Text>);
        setTimeout(() => {
          router.push(routes.member.manajemen.index);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> Ubah data gagal</Text>);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<EditMemberInput> = (data) => {
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
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([usersData, bankData]) => {
        const userData = usersData?.data?.attribute;
        setDataUser(userData || null);
        setDataPin([]);
        setDataPin2([]);
        setDataBank(
          (bankData?.data ?? []).map((p: any) => ({
            value: p.bank_code,
            label: p.name.toUpperCase(),
          }))
        );

        if (userData) {
          // update form values dynamically
          methods.reset({
            ...methods.getValues(),
            username: user_id ?? '',
            sponsor: userData.sponsor_id ?? '',
            upline: userData.parent_id ?? '',
            full_name: userData.nama ?? '',
            email: session?.user?.email ?? '',
            phone: userData.no_hp ?? '',
            province: userData.province ?? '',
            city: userData.city ?? '',
            bank_name: userData.code_bank ?? '',
            bank_account_name: userData.nama_pemilik_rekening ?? '',
            bank_account_number: userData.no_rekening ?? '',
            nik: userData.nik ?? '',
            npwp_name: userData.npwp_name ?? '',
            npwp_number: userData.npwp_number ?? '',
            npwp_address: userData.npwp_address ?? '',
            heir_name: userData.heir_name ?? '',
            heir_relationship: userData.heir_relationship ?? '',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataPin([]);
        setDataPin2([]);
        setDataBank([]);
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
          title={<span className="text-[#c69731]">Form Edit Member</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <FormProvider {...methods}>
            <form
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              <Formnya
                setSelectedProvinceName={setSelectedProvinceName}
                setSelectedCityName={setSelectedCityName}
                dataBank={dataBank}
                dataPin={dataPin}
                dataPin2={dataPin2}
                type="edit"
                session={session}
              />
              <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                <Link href={routes.member.manajemen.index}>
                  <Button variant="outline" className="w-full @xl:w-auto">
                    Batal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isLoadingS}
                  disabled={isLoadingS}
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
