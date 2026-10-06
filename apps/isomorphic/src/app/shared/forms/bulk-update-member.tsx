'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  BankStatusResponse,
  OptionType,
  Province,
  Regencies,
  UserDataResponse,
} from '@/types';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiDownloadSimpleBold } from 'react-icons/pi';

const pasangan = [
  { label: 'Suami', value: 'Husband' },
  { label: 'Istri', value: 'Wife' },
  { label: 'Anak', value: 'Children' },
  { label: 'Saudara', value: 'Brother' },
  { label: 'Ibu Kandung', value: 'Mother' },
];

const normalizeUsernames = (raw: string) =>
  raw
    .split(/[\n,]+/)
    .map((s) => s.trim().replace(/^[-•·*]\s*/, '').trim())
    .filter(Boolean);

export default function BulkUpdateMemberForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const { closeModal } = useModal();

  const [isLoading, setLoading] = useState(false);
  const [isFetchingRef, setFetchingRef] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [refId, setRefId] = useState('');
  const [dataBank, setDataBank] = useState<OptionType[]>([]);
  const [dataProvinsi, setDataProvinsi] = useState<OptionType[]>([]);
  const [dataKabupaten, setDataKabupaten] = useState<OptionType[]>([]);

  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [nik, setNik] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityId, setCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [heirName, setHeirName] = useState('');
  const [heirRelationship, setHeirRelationship] = useState('');
  const [npwpName, setNpwpName] = useState('');
  const [npwpNumber, setNpwpNumber] = useState('');
  const [npwpAddress, setNpwpAddress] = useState('');

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
      .catch((error) => console.error(error));

    fetch('/api/wilayah/provinces')
      .then((res) => res.json())
      .then((data) => {
        setDataProvinsi(
          (data as Province[]).map((p: any) => ({ value: p.id, label: p.name }))
        );
      })
      .catch((error) => console.error(error));
  }, [session?.accessToken]);

  const fetchKabupaten = async (idProv: string) => {
    setCityId('');
    setCityName('');
    setDataKabupaten([]);
    if (!idProv) return;

    const res = await fetch(`/api/wilayah/regencies/${idProv}`);
    const data = (await res.json()) as Regencies[];
    setDataKabupaten(data.map((k: any) => ({ value: k.id, label: k.name })));
  };

  const handleFetchData = async () => {
    if (!session?.accessToken) return;

    const ids = normalizeUsernames(username);
    if (ids.length === 0) {
      toast.error(<Text as="b">Masukkan minimal satu username terlebih dahulu</Text>);
      return;
    }

    const target = ids[0];
    setFetchingRef(true);

    try {
      const res = await fetchWithAuth<UserDataResponse>(
        `/_users/${target}`,
        { method: 'GET' },
        session.accessToken
      );
      const data = res?.data?.attribute;

      if (!data) {
        toast.error(<Text as="b">Data untuk {target.toUpperCase()} tidak ditemukan</Text>);
        return;
      }

      let fetchedPhone = (data.no_hp ?? '').replace(/\D/g, '');
      if (fetchedPhone.startsWith('08')) {
        fetchedPhone = '628' + fetchedPhone.slice(2);
      }

      setNamaLengkap(data.nama ?? '');
      setEmail(data.email ?? '');
      setNoHp(fetchedPhone);
      setNik(data.nik ?? '');
      setBankCode(data.code_bank ?? '');
      setAccountNumber(data.no_rekening ?? '');
      setAccountName(data.nama_pemilik_rekening ?? '');
      setNpwpName(data.npwp_name ?? '');
      setNpwpNumber(data.npwp_number ?? '');
      setNpwpAddress(data.npwp_address ?? '');
      setHeirName(data.heir_name ?? '');
      setHeirRelationship(data.heir_relationship ?? '');

      // Cocokkan nama provinsi/kota dari data existing ke opsi Select (id-based)
      const matchedProvince = dataProvinsi.find(
        (p) => p.label.toLowerCase() === (data.province ?? '').toLowerCase()
      );

      if (matchedProvince) {
        setProvinceId(matchedProvince.value as string);
        setProvinceName(matchedProvince.label);

        const kabRes = await fetch(
          `/api/wilayah/regencies/${matchedProvince.value}`
        );
        const kabData = (await kabRes.json()) as Regencies[];
        const kabOptions = kabData.map((k: any) => ({
          value: k.id,
          label: k.name,
        }));
        setDataKabupaten(kabOptions);

        const matchedCity = kabOptions.find(
          (k) => k.label.toLowerCase() === (data.city ?? '').toLowerCase()
        );
        setCityId((matchedCity?.value as string) ?? '');
        setCityName(matchedCity?.label ?? data.city ?? '');
      } else {
        setProvinceId('');
        setProvinceName(data.province ?? '');
        setCityId('');
        setCityName(data.city ?? '');
        setDataKabupaten([]);
      }

      setRefId(target);
      setHasFetched(true);
      toast.success(
        <Text as="b">Data referensi berhasil ditarik dari {target.toUpperCase()}</Text>
      );
    } catch (error: any) {
      console.error(error);
      toast.error(
        <Text as="b">{error?.message ?? 'Gagal menarik data referensi'}</Text>
      );
    } finally {
      setFetchingRef(false);
    }
  };

  const handlePhoneInput = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.startsWith('08')) v = '628' + v.slice(2);
    setNoHp(v);
  };

  const resetForm = () => {
    setUsername('');
    setHasFetched(false);
    setRefId('');
    setNamaLengkap('');
    setEmail('');
    setNoHp('');
    setNik('');
    setProvinceId('');
    setProvinceName('');
    setCityId('');
    setCityName('');
    setDataKabupaten([]);
    setBankCode('');
    setAccountNumber('');
    setAccountName('');
    setHeirName('');
    setHeirRelationship('');
    setNpwpName('');
    setNpwpNumber('');
    setNpwpAddress('');
  };

  const doSave = (ids: string[]) => {
    if (!session?.accessToken) return;

    setLoading(true);

    // Payload dikirim lengkap (bukan hanya field yang diubah) karena endpoint
    // bulk-update menimpa seluruh data member — field yang tidak diubah tetap
    // terbawa dari hasil "Tarik Data" di atas.
    const body: Record<string, any> = {
      username: ids.join(', '),
      type: 'member',
      nama: namaLengkap,
      email,
      no_hp: noHp,
      nik,
      province: provinceName,
      city: cityName,
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
      heir_name: heirName,
      heir_relationship: heirRelationship,
      npwp_name: npwpName,
      npwp_number: npwpNumber,
      npwp_address: npwpAddress,
    };

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
            {data?.message ?? `Bulk update berhasil untuk ${ids.length} member`}
          </Text>
        );
        resetForm();
        closeModal();
        onSuccess?.();
      })
      .catch((error: any) => {
        console.error(error);
        toast.error(
          <Text as="b">{error?.message ?? 'Bulk update gagal, silakan coba lagi'}</Text>
        );
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    const ids = normalizeUsernames(username);

    if (ids.length === 0) {
      toast.error(<Text as="b">Masukkan minimal satu username</Text>);
      return;
    }

    if (!hasFetched) {
      toast.error(
        <Text as="b">
          Klik &quot;Tarik Data&quot; terlebih dahulu sebelum menyimpan
          perubahan
        </Text>
      );
      return;
    }

    if (noHp && !/^62\d{8,13}$/.test(noHp)) {
      toast.error(<Text as="b">Format No. HP tidak valid, gunakan format 62xxx</Text>);
      return;
    }

    const idListHtml = ids
      .map(
        (id) =>
          `<span style="display:inline-block;background:#f3e8c8;color:#5a2a0a;border-radius:4px;padding:2px 8px;margin:2px;font-size:12px;font-family:monospace;font-weight:600;text-transform:uppercase">${id}</span>`
      )
      .join('');

    Swal.fire({
      title: 'Konfirmasi Bulk Update',
      html: `
        <p style="margin-bottom:10px">Data akan diperbarui untuk <strong>${ids.length} member</strong> berikut:</p>
        <div style="max-height:160px;overflow-y:auto;background:#fafafa;border:1px solid #e0c97a;border-radius:8px;padding:10px;text-align:left;margin-bottom:10px">
          ${idListHtml}
        </div>
        <p style="font-size:13px;color:#6b6b6b">Pastikan semua ID sudah benar sebelum melanjutkan.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Update',
      cancelButtonText: 'Batal',
      allowOutsideClick: false,
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3',
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false,
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) container.style.zIndex = '10000';
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        doSave(ids);
      } else {
        toast.success(<Text as="b">Bulk update dibatalkan!</Text>);
      }
    });
  };

  const idCount = normalizeUsernames(username).length;

  return (
    <div className="m-auto max-h-[90vh] overflow-y-auto p-6">
      <Title as="h4" className="mb-1">
        Bulk Update Member
      </Title>
      <Text className="mb-6 text-gray-500">
        Tarik data dari salah satu ID sebagai referensi, lalu ubah hanya
        field yang perlu diganti — field lain akan tetap terbawa apa adanya
        ke seluruh ID yang dimasukkan.
      </Text>

      <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
        <div className="col-span-full">
          <Textarea
            label="Daftar ID Member"
            placeholder={
              'IPG0023302, IPG0024748, IPG0024079\natau satu per baris\nIPG0023302\nIPG0024748'
            }
            rows={4}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setHasFetched(false);
            }}
            textareaClassName="font-mono text-xs uppercase"
          />
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <Text className="text-xs text-gray-500">
              Pisahkan dengan koma atau baris baru. Jumlah ID:{' '}
              <strong>{idCount}</strong>
            </Text>
            <Button
              type="button"
              size="sm"
              variant="outline"
              isLoading={isFetchingRef}
              disabled={isFetchingRef || idCount === 0}
              onClick={handleFetchData}
            >
              <PiDownloadSimpleBold className="me-1.5 h-4 w-4" />
              Tarik Data
            </Button>
          </div>
          {hasFetched && (
            <Text className="mt-1 text-xs font-medium text-green-600">
              Data referensi berhasil ditarik dari{' '}
              <span className="uppercase">{refId}</span>. Field di bawah
              sudah terisi otomatis — ubah sesuai kebutuhan.
            </Text>
          )}
        </div>

        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          value={namaLengkap}
          onChange={(e) => setNamaLengkap(e.target.value)}
        />
        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="No. HP/WA"
          placeholder="08xxxxxxxxxx"
          value={noHp}
          onChange={(e) => handlePhoneInput(e.target.value)}
        />
        <Input
          label="NIK"
          placeholder="NIK"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
        />

        <Select
          label="Provinsi"
          dropdownClassName="!z-10 h-fit max-h-[250px]"
          inPortal={false}
          placeholder="Pilih Provinsi"
          options={dataProvinsi}
          onChange={(selectedId) => {
            const selected = dataProvinsi.find((p) => p.value === selectedId);
            setProvinceId(selectedId as string);
            setProvinceName(selected?.label ?? '');
            fetchKabupaten(selectedId as string);
          }}
          value={provinceId}
          searchable={true}
          clearable={true}
          onClear={() => {
            setProvinceId('');
            setProvinceName('');
            setCityId('');
            setCityName('');
            setDataKabupaten([]);
          }}
          getOptionValue={(option) => option.value}
          displayValue={(selected) =>
            dataProvinsi.find((p) => p.value === selected)?.label ?? ''
          }
        />

        <Select
          label="Kota/Kabupaten"
          dropdownClassName="!z-10 h-fit max-h-[250px]"
          inPortal={false}
          placeholder="Pilih Kota/Kabupaten"
          options={dataKabupaten}
          onChange={(selectedId) => {
            const selected = dataKabupaten.find((k) => k.value === selectedId);
            setCityId(selectedId as string);
            setCityName(selected?.label ?? '');
          }}
          value={cityId}
          searchable={true}
          clearable={true}
          onClear={() => {
            setCityId('');
            setCityName('');
          }}
          getOptionValue={(option) => option.value}
          displayValue={(selected) =>
            dataKabupaten.find((k) => k.value === selected)?.label ?? ''
          }
          disabled={!provinceId}
        />

        <div className="col-span-full mt-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Informasi Rekening
        </div>

        <Select
          label="Bank"
          dropdownClassName="!z-10 h-fit"
          inPortal={false}
          placeholder="Pilih Bank"
          options={dataBank}
          onChange={(value) => setBankCode(value as string)}
          value={bankCode}
          searchable={true}
          clearable={true}
          onClear={() => setBankCode('')}
          getOptionValue={(option) => option.value}
          displayValue={(selected) =>
            dataBank.find((k) => k.value === selected)?.label ?? ''
          }
        />
        <Input
          label="No. Rekening"
          placeholder="No. Rekening"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Input
          label="Atas Nama Rekening"
          placeholder="Atas Nama Rekening"
          className="col-span-full"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <div className="col-span-full mt-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Informasi NPWP
        </div>

        <Input
          label="Nama Pada NPWP"
          placeholder="Nama Pada NPWP"
          value={npwpName}
          onChange={(e) => setNpwpName(e.target.value)}
        />
        <Input
          label="No. NPWP"
          placeholder="No. NPWP"
          value={npwpNumber}
          onChange={(e) => setNpwpNumber(e.target.value)}
        />
        <Textarea
          label="Alamat NPWP"
          placeholder="Alamat NPWP"
          className="col-span-full"
          value={npwpAddress}
          onChange={(e) => setNpwpAddress(e.target.value)}
          textareaClassName="h-10"
        />

        <div className="col-span-full mt-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Ahli Waris (Opsional)
        </div>

        <Input
          label="Nama Ahli Waris"
          placeholder="Nama Ahli Waris"
          value={heirName}
          onChange={(e) => setHeirName(e.target.value)}
        />
        <Select
          label="Hubungan Ahli Waris"
          dropdownClassName="!z-10 h-fit"
          inPortal={false}
          placeholder="Pilih Hubungan"
          options={pasangan}
          onChange={(value) => setHeirRelationship(value as string)}
          value={heirRelationship}
          clearable={true}
          onClear={() => setHeirRelationship('')}
          getOptionValue={(option) => option.value}
          displayValue={(selected) =>
            pasangan.find((p) => p.value === selected)?.label ?? ''
          }
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-4 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            closeModal();
          }}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type="button"
          isLoading={isLoading}
          disabled={isLoading || !hasFetched}
          onClick={handleSubmit}
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
