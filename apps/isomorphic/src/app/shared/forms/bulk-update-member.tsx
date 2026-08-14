'use client';

import { useEffect, useState } from 'react';
import {
  useForm,
  FormProvider,
  Controller,
  type SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { BankStatusResponse, OptionType } from '@/types';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  BulkUpdateMemberInput,
  bulkUpdateMemberSchema,
} from '@/validators/bulk-update-member-schema';

const pasangan = [
  { label: 'Suami', value: 'Husband' },
  { label: 'Istri', value: 'Wife' },
  { label: 'Anak', value: 'Children' },
  { label: 'Saudara', value: 'Brother' },
  { label: 'Ibu Kandung', value: 'Mother' },
];

function Formnya({
  isLoading,
  dataBank,
  onCancel,
  count,
}: {
  isLoading: boolean;
  dataBank: OptionType[];
  onCancel: () => void;
  count: number;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10">
        <FormBlockWrapper title={'Informasi Pribadi:'}>
          <Input
            label="Nama Lengkap"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('full_name')}
            error={errors?.full_name?.message as any}
          />
          <Input
            label="Email"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('email')}
            error={errors?.email?.message as any}
          />
          <Input
            label="No. HP/WA"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('phone')}
            error={errors?.phone?.message as any}
          />
          <Input
            label="NIK"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('nik')}
            error={errors?.nik?.message as any}
          />
          <Input
            label="Provinsi"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('province')}
            error={errors?.province?.message as any}
          />
          <Input
            label="Kota/Kabupaten"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('city')}
            error={errors?.city?.message as any}
          />
        </FormBlockWrapper>

        <FormBlockWrapper
          title={'Informasi Rekening:'}
          className="pt-7 @2xl:pt-9"
        >
          <Controller
            control={control}
            name="bank_name"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Bank"
                dropdownClassName="!z-10 h-fit"
                inPortal={false}
                placeholder="Kosongkan jika tidak ingin diubah"
                options={dataBank}
                onChange={onChange}
                value={value}
                searchable={true}
                clearable={true}
                onClear={() => onChange('')}
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  dataBank.find((k) => k.value === selected)?.label ?? ''
                }
                error={errors?.bank_name?.message as string | undefined}
              />
            )}
          />
          <Input
            label="No. Rekening"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('bank_account_number')}
            error={errors?.bank_account_number?.message as any}
          />
          <Input
            label="Atas Nama"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('bank_account_name')}
            error={errors?.bank_account_name?.message as any}
          />
        </FormBlockWrapper>

        <FormBlockWrapper title={'Informasi NPWP:'} className="pt-7 @2xl:pt-9">
          <Input
            label="Nama Pada NPWP"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('npwp_name')}
            error={errors?.npwp_name?.message as any}
          />
          <Input
            label="No. NPWP"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('npwp_number')}
            error={errors?.npwp_number?.message as any}
          />
          <Textarea
            label="Alamat NPWP"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('npwp_address')}
            error={errors?.npwp_address?.message as string}
            textareaClassName="h-10"
          />
        </FormBlockWrapper>

        <FormBlockWrapper title={'Ahli Waris:'} className="pt-7 @2xl:pt-9">
          <Input
            label="Nama Ahli Waris"
            placeholder="Kosongkan jika tidak ingin diubah"
            {...register('heir_name')}
            error={errors?.heir_name?.message as any}
          />
          <Controller
            name="heir_relationship"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Status Ahli Waris"
                dropdownClassName="!z-10 h-fit"
                inPortal={false}
                placeholder="Kosongkan jika tidak ingin diubah"
                options={pasangan}
                onChange={onChange}
                value={value}
                clearable={true}
                onClear={() => onChange('')}
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  pasangan.find((con) => con.value === selected)?.label ?? ''
                }
                error={errors?.heir_relationship?.message as string}
              />
            )}
          />
        </FormBlockWrapper>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Terapkan ke {count} Member
        </Button>
      </div>
    </>
  );
}

export default function BulkUpdateMemberForm({
  usernames,
  onSuccess,
}: {
  usernames: string[];
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const { closeModal } = useModal();

  const [isLoadingS, setLoadingS] = useState(false);
  const [dataBank, setDataBank] = useState<OptionType[]>([]);

  const methods = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      nik: '',
      province: '',
      city: '',
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      npwp_name: '',
      npwp_number: '',
      npwp_address: '',
      heir_name: '',
      heir_relationship: '',
    },
    resolver: zodResolver(bulkUpdateMemberSchema),
  });

  useEffect(() => {
    if (!session?.accessToken) return;

    fetchWithAuth<BankStatusResponse>(
      `/_services/list-bank`,
      { method: 'GET' },
      session.accessToken
    )
      .then((bankData) => {
        setDataBank(
          (bankData?.data ?? []).map((p: any) => ({
            value: p.bank_code,
            label: p.name.toUpperCase(),
          }))
        );
      })
      .catch((error) => {
        console.error(error);
        setDataBank([]);
      });
  }, [session?.accessToken]);

  const doSave = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const fieldMap: Record<string, string> = {
      full_name: 'nama',
      email: 'email',
      phone: 'no_hp',
      nik: 'nik',
      province: 'province',
      city: 'city',
      bank_account_name: 'account_name',
      bank_account_number: 'account_number',
      bank_name: 'bank_code',
      npwp_name: 'npwp_name',
      npwp_number: 'npwp_number',
      npwp_address: 'npwp_address',
      heir_name: 'heir_name',
      heir_relationship: 'heir_relationship',
    };

    const body: Record<string, any> = {
      username: usernames.join(', '),
      type: 'member',
    };

    // Cuma kirim field yang diisi, biar field kosong tidak menimpa data existing di seluruh member terpilih
    Object.entries(fieldMap).forEach(([formKey, apiKey]) => {
      const value = payload?.[formKey];
      if (typeof value === 'string' && value.trim() !== '') {
        body[apiKey] = value.trim();
      }
    });

    fetchWithAuth<any>(
      `/_users/bulk-update`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(
          <Text as="b">
            {data?.message ??
              `Data ${usernames.length} member berhasil diperbarui`}
          </Text>
        );
        closeModal();
        onSuccess?.();
      })
      .catch((error: any) => {
        console.error(error);
        toast.error(
          <Text as="b">{error?.message ?? 'Update bulk data gagal'}</Text>
        );
      })
      .finally(() => setLoadingS(false));
  };

  const onSubmit: SubmitHandler<BulkUpdateMemberInput> = (data) => {
    const filledFields = Object.values(data).filter(
      (v) => typeof v === 'string' && v.trim() !== ''
    );

    if (filledFields.length === 0) {
      toast.error(
        <Text as="b">Isi minimal 1 field yang ingin diubah</Text>
      );
      return;
    }

    Swal.fire({
      title: 'Konfirmasi Update Bulk',
      html: `Data akan diterapkan ke <strong>${usernames.length}</strong> member sekaligus:<br/><span class="uppercase">${usernames.join(', ')}</span><br/><br/>Pastikan data sudah benar. Lanjutkan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Terapkan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3',
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        doSave(data);
      } else {
        toast.success(<Text as="b">Update bulk dibatalkan!</Text>);
      }
    });
  };

  return (
    <div className="m-auto max-h-[90vh] overflow-y-auto p-6">
      <Title as="h4" className="mb-1">
        Update Data Bulk
      </Title>
      <Text className="mb-6 text-gray-500">
        Perubahan akan diterapkan ke{' '}
        <strong>{usernames.length} member</strong> yang dipilih:{' '}
        <span className="uppercase">{usernames.join(', ')}</span>
      </Text>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Formnya
            isLoading={isLoadingS}
            dataBank={dataBank}
            onCancel={closeModal}
            count={usernames.length}
          />
        </form>
      </FormProvider>
    </div>
  );
}
