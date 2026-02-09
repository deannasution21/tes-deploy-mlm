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
import { PostingInput, postingSchema } from '@/validators/posting-schema';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

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

  const [selectedPin, setSelectedPin] = useState<string>('');
  const [dataSPin, setDataSPin] = useState<Pin>();
  const position = watch('position'); // 'left' | 'right'
  const displayPosition =
    position === 'left' ? 'Kiri' : position === 'right' ? 'Kanan' : '';

  // State for dropdown data
  const [dataProvinsi, setDataProvinsi] = useState<OptionType[]>([]);
  const [dataKabupaten, setDataKabupaten] = useState<OptionType[]>([]);

  // Watch selected values
  const selectedProvinsi = watch('province');
  const selectedKabupaten = watch('city');

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

  // Fetch provinsi list
  useEffect(() => {
    const fetchProvinsi = async () => {
      const res = await fetch('/api/wilayah/provinces');
      const data = (await res.json()) as Province[];
      setDataProvinsi(data.map((p: any) => ({ value: p.id, label: p.name })));
    };
    fetchProvinsi();
  }, []);

  // Fetch kabupaten based on selected provinsi
  useEffect(() => {
    if (!selectedProvinsi) return;

    const fetchKabupaten = async () => {
      const res = await fetch(`/api/wilayah/regencies/${selectedProvinsi}`);
      const data = (await res.json()) as Regencies[];
      setDataKabupaten(data.map((k: any) => ({ value: k.id, label: k.name })));

      // Reset dependent fields
      setValue('kabupaten', '');
    };
    type === 'posting' && fetchKabupaten();
  }, [selectedProvinsi]);

  useEffect(() => {
    if (dataSPin) {
      setValue('mlm_user_id', dataSPin.mlm_user_id?.toLowerCase()); // ✅ update RHF state
      setValue('type_plan', dataSPin?.type); // ✅ sync state to form
    }
  }, [dataSPin, setValue]);

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5 lg:grid-cols-2'
        )}
      >
        <Title as="h3" className="col-span-full font-semibold text-[#c69731]">
          Form {type?.toLocaleUpperCase()}
        </Title>

        <Title as="h4" className="col-span-full font-semibold">
          Informasi Sistem
        </Title>

        {/* tes */}

        {/* PIN Kosong */}
        <Controller
          control={control}
          name="pin_code"
          render={({ field: { onChange, value } }) => (
            <Select
              label="PIN"
              dropdownClassName="!z-10 h-fit max-h-[250px]"
              inPortal={false}
              placeholder="Pilih PIN"
              options={dataPin}
              onChange={(selectedId) => {
                // Find the selected pin object
                const selectedOption = dataPin.find(
                  (p) => p.value === selectedId
                );
                const selectedPinData = dataPin2.find(
                  (p) => p.pin_code === selectedId
                );

                // ✅ Update form and states
                onChange(selectedId); // store pin_code to form field
                setSelectedPin?.(selectedOption?.label ?? ''); // store pin name or label
                setDataSPin(selectedPinData); // ✅ store mlm_user_id
              }}
              value={value}
              searchable={true}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                dataPin.find((p) => p.value === selected)?.label ?? ''
              }
              error={errors?.pin_code?.message as string | undefined}
            />
          )}
        />

        <Controller
          name="mlm_user_id"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              label="ID Yang Terbentuk"
              placeholder="(Otomatis by system)"
              {...field}
              inputClassName="[&_input]:uppercase"
              error={error?.message as any}
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

        <Input
          label="Posisi"
          placeholder="Posisi"
          {...register('position')}
          value={displayPosition} // 👈 show translated label
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
                feedback.includes('Valid') ? 'text-green-600' : 'text-red-600'
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

        <hr className="col-span-full my-5 border-muted" />

        <Title as="h4" className="col-span-full font-semibold">
          Informasi Pribadi
        </Title>

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
        <Password
          label="Password"
          placeholder="Ketikkan password"
          {...register('password')}
          error={errors.password?.message as any}
        />
        <Password
          label="Konfirmasi Password"
          placeholder="Ketikkan konfirmasi password"
          {...register('confirm_password')}
          error={errors.confirm_password?.message as any}
        />

        {type === 'posting' ? (
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
          </>
        ) : (
          <>
            <Input
              label="Provinsi"
              placeholder="Provinsi"
              {...register('province')}
              value={selectedProvinsi} // 👈 show translated label
              disabled
            />

            <Input
              label="Kota/Kabupaten"
              placeholder="Kota/Kabupaten"
              {...register('city')}
              value={selectedKabupaten} // 👈 show translated label
              disabled
            />
          </>
        )}

        <hr className="col-span-full my-5 border-muted" />

        <Title as="h4" className="col-span-full font-semibold">
          Informasi Rekening
        </Title>

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

        <hr className="col-span-full my-5 border-muted" />

        <Title as="h4" className="col-span-full font-semibold">
          Informasi NPWP
        </Title>

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
      </div>
    </>
  );
}

function Informasi({ isLoading, type }: { isLoading: boolean; type: string }) {
  return (
    <div className={cn('@container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3')}>
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-primary p-5 shadow-md @sm:p-6 @md:p-7">
        <div className="relative border-b border-gray-300 pb-7">
          <Title as="h6" className="mb-6 text-center">
            Sebelum Klik Tombol Daftar Silahkan Baca Agreement Berikut Ini :
          </Title>
          <div className="flex flex-col">
            <div className="border-b border-gray-300 pb-7 ps-4 text-center @5xl:ps-6">
              <Text as="p" className="mb-2 text-red-600">
                * Tidak Boleh Menggunakan Tanda Kutif (") Atau Aksen (')
              </Text>
              <Text as="p" className="mb-2 text-primary">
                Surat Pernyataan ini saya buat dengan akal sehat dan penuh
                kesadaran saya menjadi mitra bisnis di IPG, maka saya wajib
                setuju dengan persyaratan tanpa ada paksaan oleh siapapun.
              </Text>
            </div>
            <ol className="ms-4 mt-7 list-disc">
              <li>
                <Text as="small" className="text-stone-500">
                  Saya wajib menjaga nama baik perusahaan dan mentaati tata
                  aturan kode etik kemitraan.
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Saya berkewajiban menjelaskan sistem pemasaran & manfaat
                  produk sesuai yang ditentukan oleh perusahaan, tidak secara
                  berlebihan dan kebohongan dalam menjelaskan semuanya kepada
                  konsumen atau calon mitra
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Saya wajib menjalankan dan mematuhi kode etik perusahaan yang
                  diberlakukan.
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Semua bonus yang saya dapatkan di IPG adalah menjadi hak saya,
                  termasuk nilai pungutan pajak akan menjadi tanggungjawab saya
                  100% tidak di bebankan kepada perusahaan.
                </Text>
              </li>
            </ol>
          </div>
        </div>
        <div className="relative py-7">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full @xl:w-auto"
          >
            {type?.toLocaleUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
}

// main order form component for create and update order
export default function Posting({
  id,
  className,
  upline,
  type,
}: {
  id?: string;
  className?: string;
  upline?: string;
  type: string;
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

  // Posting form
  const methodsPosting = useForm({
    defaultValues: {
      pin_code: '',
      mlm_user_id: '',
      type_plan: '',
      upline: upline ?? '',
      sponsor: session?.user?.id ?? '',
      position: position ?? '',
      full_name: session?.user?.name ?? '',
      password: '',
      confirm_password: '',
      email: session?.user?.email ?? '',
      phone: session?.user?.phone ?? '',
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
    resolver: zodResolver(postingSchema),
  });

  // Cloning form
  const methodsCloning = useForm({
    defaultValues: {
      pin_code: '',
      mlm_user_id: '',
      type_plan: '',
      upline: upline ?? '',
      sponsor: '',
      position: position ?? '',
      full_name: '',
      password: '',
      confirm_password: '',
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
    resolver: zodResolver(postingSchema),
  });

  const doPosting = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const OPTIONAL_FIELDS = [
      'npwp_name',
      'npwp_number',
      'npwp_address',
      'heir_name',
      'heir_relationship',
    ];

    const body = {
      ...payload,
      province: type === 'posting' ? selectedProvinceName : payload.province,
      city: type === 'posting' ? selectedCityName : payload.city,
    };

    // remove empty optional fields
    OPTIONAL_FIELDS.forEach((key) => {
      const value = body[key];

      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        delete body[key];
      }
    });

    fetchWithAuth<any>(
      `/_network-diagrams`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(
          <Text as="b">
            {type?.toLocaleUpperCase()} {payload?.mlm_user_id} Berhasil!
          </Text>
        );
        setTimeout(() => {
          router.push(`/diagram-jaringan/${upline}`);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> {type?.toLocaleUpperCase()} gagal</Text>);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<PostingInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: `Konfirmasi ${type?.toLocaleUpperCase()}`,
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
        doPosting(data);
      } else {
        toast.success(
          <Text as="b">{type?.toLocaleUpperCase()} dibatalkan!</Text>
        );
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
        `/_users`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<PinResponse>(
        `/_pins/dealer/${session?.user?.id}?fetch=all&status=active`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([usersData, pinData, bankData]) => {
        const userData = usersData?.data?.attribute;
        setDataUser(userData || null);
        setDataPin(
          (pinData?.data?.pins ?? []).map((p: any) => ({
            value: p.pin_code,
            label: p.pin_code,
          }))
        );
        setDataPin2(pinData?.data?.pins ?? []);
        setDataBank(
          (bankData?.data ?? []).map((p: any) => ({
            value: p.bank_code,
            label: p.name.toUpperCase(),
          }))
        );

        if (userData) {
          // update form values dynamically
          if (type === 'clone') {
            methodsCloning.reset({
              ...methodsCloning.getValues(),
              sponsor: userData.username ?? '',
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
          } else if (type === 'posting') {
            methodsPosting.reset({
              ...methodsPosting.getValues(),
              sponsor: userData.username ?? '',
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
            });
          }
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
  }, [session?.accessToken, type]);

  // ---- UI rendering ----
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  if (type === 'clone' && !dataUser) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Tidak ada data untuk pengguna ini.</p>
      </div>
    );
  }

  return (
    <>
      {type === 'clone' ? (
        <FormProvider {...methodsCloning}>
          <form
            autoComplete="off"
            onSubmit={methodsCloning.handleSubmit(onSubmit)}
            className={cn(
              'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium',
              className
            )}
          >
            <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
              <div className="flex-grow @5xl:col-span-8 @5xl:pb-10 @6xl:col-span-7">
                <div className="flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
                  <Formnya
                    setSelectedProvinceName={setSelectedProvinceName}
                    setSelectedCityName={setSelectedCityName}
                    dataBank={dataBank}
                    dataPin={dataPin}
                    dataPin2={dataPin2}
                    type={type}
                    session={session}
                  />
                </div>
              </div>

              <div className="pb-7 pt-10 @container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3">
                <Informasi isLoading={isLoadingS} type={type} />
              </div>
            </div>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...methodsPosting}>
          <form
            autoComplete="off"
            onSubmit={methodsPosting.handleSubmit(onSubmit)}
            className={cn(
              'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium',
              className
            )}
          >
            <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
              <div className="flex-grow @5xl:col-span-8 @5xl:pb-10 @6xl:col-span-7">
                <div className="flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
                  <Formnya
                    setSelectedProvinceName={setSelectedProvinceName}
                    setSelectedCityName={setSelectedCityName}
                    dataBank={dataBank}
                    dataPin={dataPin}
                    dataPin2={dataPin2}
                    type={type}
                    session={session}
                  />
                </div>
              </div>

              <div className="pb-7 pt-10 @container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3">
                <Informasi isLoading={isLoadingS} type={type} />
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  );
}
