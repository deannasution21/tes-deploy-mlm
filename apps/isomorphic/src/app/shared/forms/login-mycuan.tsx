'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Alert, Button, Input, Text, Title } from 'rizzui';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { PiSignIn, PiUserCheck, PiUserPlus } from 'react-icons/pi';
import WidgetCard from '@core/components/cards/widget-card';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { UserDataResponse } from '@/types';
import {
  checkMyCuanUser,
  getMyCuanErrorMessage,
  getMyCuanSsoUrl,
  loginMyCuan,
  registerMyCuan,
} from '@/utils/mycuanApi';

type Step = 'checking' | 'form' | 'sso-ready';

const normalizePhone = (phone: string) => {
  const p = (phone ?? '').replace(/\D/g, '');
  if (p.startsWith('0')) return '62' + p.slice(1);
  return p;
};

export default function LoginMyCuanPage() {
  const { data: session } = useSession();

  const [step, setStep] = useState<Step>('checking');
  const [waNumber, setWaNumber] = useState('');
  const [fullName, setFullName] = useState(session?.user?.name ?? '');
  const [referral, setReferral] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [isLoadingRegister, setLoadingRegister] = useState(false);
  const [isLoadingSso, setLoadingSso] = useState(false);
  // Token SSO hanya berlaku sekali pakai — tidak boleh di-cache lintas reload/klik,
  // selalu fetch ulang dari API sebelum membuka MyCuan.
  const [ssoUrl, setSsoUrl] = useState('');

  // Redirect penuh di tab yang sama (bukan window.open/tab baru) — meniru cara
  // backend test manual (paste sso_url ke address bar) agar tidak terhalang popup blocker.
  const openMyCuan = (url: string) => {
    if (!url) return;
    window.location.href = url;
  };

  const fetchSsoStatus = async (phone: string): Promise<string> => {
    try {
      const res = await checkMyCuanUser(phone);
      const isRegistered = res?.data?.is_registered_in_requested_ref;

      if (isRegistered) {
        const token = res?.data?.auth?.token;
        return res?.data?.sso_url || getMyCuanSsoUrl(token);
      }

      return '';
    } catch (err: any) {
      setNotFoundMessage(err?.data?.message || '');
      return '';
    }
  };

  // Fallback: user terdaftar di MyCuan tapi is_registered_in_requested_ref = false
  // (beda ref / kondisi backend). Login langsung untuk dapatkan SSO token.
  const fetchSsoViaLogin = async (phone: string): Promise<string> => {
    try {
      const res = await loginMyCuan({ no_hp: phone, device: 'sso' });
      const token = res?.data?.auth?.token;
      if (!token) return '';
      return res?.data?.sso_url || getMyCuanSsoUrl(token);
    } catch {
      return '';
    }
  };

  const doSsoLogin = async () => {
    // Selalu fetch token baru saat klik — token hanya valid 60s dari saat backend
    // generate, token dari load awal bisa sudah tua beberapa detik saat user klik.
    try {
      setLoadingSso(true);

      let url = await fetchSsoStatus(waNumber);
      if (!url) url = await fetchSsoViaLogin(waNumber);

      if (!url) {
        toast.error(<Text as="b">Gagal memuat akses MyCuan, silakan coba lagi.</Text>);
        return;
      }

      setSsoUrl(url);
      openMyCuan(url);
    } finally {
      setLoadingSso(false);
    }
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    fetchWithAuth<UserDataResponse>(
      `/_users`,
      { method: 'GET' },
      session.accessToken
    )
      .then(async (res) => {
        const phone = normalizePhone(res?.data?.attribute?.no_hp ?? '');
        setWaNumber(phone);
        setFullName(res?.data?.attribute?.nama ?? session?.user?.name ?? '');

        if (!phone) {
          setStep('form');
          return;
        }

        const url = await fetchSsoStatus(phone);
        if (url) setSsoUrl(url);
        setStep(url ? 'sso-ready' : 'form');
      })
      .catch((error) => {
        console.error(error);
        setStep('form');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  const submitRegister = async () => {
    if (!fullName.trim()) return;

    if (
      referral &&
      normalizePhone(referral) === normalizePhone(waNumber)
    ) {
      toast.error(
        <Text as="b">
          Nomor referral tidak boleh menggunakan nomor WhatsApp Anda sendiri.
        </Text>
      );
      return;
    }

    setLoadingRegister(true);

    try {
      await registerMyCuan({
        no_hp: waNumber,
        full_name: fullName,
        referral,
        otp: '111111',
      });

      // Token SSO sekali pakai — fetch status terbaru untuk dapat token yang fresh
      const url = await fetchSsoStatus(waNumber);
      if (url) setSsoUrl(url);
      setStep('sso-ready');

      await Swal.fire({
        title: 'Registrasi Berhasil',
        html: `Selamat! Akun MyCuan Anda berhasil dibuat dengan ID <b>${waNumber}</b>. Anda akan diarahkan ke MyCuan.`,
        icon: 'success',
        confirmButtonText: 'Lanjut ke MyCuan',
        confirmButtonColor: '#AA8453',
      });

      await doSsoLogin();
    } catch (err: any) {
      const fieldErrors = err?.data?.data;
      const isAlreadyRegistered =
        fieldErrors &&
        Object.values(fieldErrors).some(
          (v: any) => typeof v === 'string' && v.toLowerCase().includes('terdaftar')
        );

      if (isAlreadyRegistered) {
        let url = await fetchSsoStatus(waNumber);
        if (!url) url = await fetchSsoViaLogin(waNumber);
        if (url) setSsoUrl(url);
        else console.warn('[MyCuan] sudah terdaftar tapi gagal dapat SSO token');

        toast.success(
          <Text as="b">Nomor WhatsApp sudah terdaftar di MyCuan. Silakan masuk.</Text>
        );
        setStep('sso-ready');
      } else {
        toast.error(
          <Text as="b">
            {getMyCuanErrorMessage(err, 'Registrasi gagal, silakan coba lagi')}
          </Text>
        );
      }
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logomycuan.webp"
          alt="Logo MyCuan"
          width={200}
          height={96}
          className="h-24 w-auto"
        />
      </div>

      <WidgetCard className="border-t-4 border-t-[#AA8453]">
        {step === 'checking' && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#AA8453] border-t-transparent" />
            <Text className="text-gray-500">
              Memeriksa status akun MyCuan Anda...
            </Text>
          </div>
        )}

        {step === 'form' && (
          <div>
            <Title as="h5" className="mb-5 text-[#AA8453]">
              Data Registrasi
            </Title>

            {notFoundMessage && (
              <Alert variant="flat" color="info" className="mb-5 text-sm">
                {notFoundMessage}. Yuk, lengkapi data di bawah untuk mendaftar
                akun MyCuan Anda!
              </Alert>
            )}

            <div className="space-y-5">
              <Input
                label="Nomor WhatsApp"
                value={waNumber}
                disabled
              />
              <Text className="-mt-3 text-xs text-gray-500">
                ID MyCuan Anda akan menggunakan nomor ini, sesuai data akun
                Anda.
              </Text>

              <Input
                label="Nama Lengkap"
                placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Nomor WhatsApp Sponsor (Opsional)"
                placeholder="Kosongkan jika tidak memiliki sponsor di MyCuan"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
              />

              <div className="flex justify-end pt-2">
                <Button
                  isLoading={isLoadingRegister}
                  disabled={isLoadingRegister || !fullName.trim()}
                  onClick={submitRegister}
                >
                  <PiUserPlus className="me-2 h-4 w-4" />
                  Daftar Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'sso-ready' && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <PiUserCheck className="mb-2 h-14 w-14 text-[#AA8453]" />
            <Title as="h5" className="text-[#AA8453]">
              Akun MyCuan Ditemukan
            </Title>
            <Text className="mb-4 text-gray-500">
              Nomor <strong>{waNumber}</strong> sudah terdaftar di MyCuan.
              Klik tombol di bawah untuk masuk langsung.
            </Text>
            <Button
              isLoading={isLoadingSso}
              disabled={isLoadingSso}
              onClick={doSsoLogin}
            >
              <PiSignIn className="me-2 h-4 w-4" />
              Masuk ke MyCuan
            </Button>
          </div>
        )}
      </WidgetCard>
    </div>
  );
}
