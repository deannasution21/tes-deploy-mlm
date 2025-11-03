'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { Preloader } from '@/app/shared/preloader';

const initialValuesAdmin: LoginSchema = {
  username: 'adminpin2025',
  password: 'adminpin2025',
  rememberMe: true,
};

const initialValuesStockist: LoginSchema = {
  username: 'adminpin2025',
  password: 'adminpin2025',
  rememberMe: true,
};

const initialValuesUser: LoginSchema = {
  username: 'admin',
  password: 'infinitepg2025',
  rememberMe: true,
};

export default function SignInForm({ role }: { role: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [reset, setReset] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
      role: role,
      via: 'loginPage',
    });

    if (res?.error) {
      setError('Username atau password salah.');
      setLoading(false); // stop loader if login failed
      return;
    }

    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    router.push(callbackUrl);
  };

  return (
    <>
      <Preloader loaded={loaded} setLoaded={setLoaded} />

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 shadow transition-all duration-300">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="rounded p-1 text-red-500 hover:bg-red-200 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        // useFormProps={{
        //   defaultValues:
        //     role === 'admin' ? initialValuesAdmin : role === 'stockist' ? initialValuesStockist : initialValuesUser,
        // }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-7">
            <style>{`
              .rizzui-input-container input::placeholder,
              .rizzui-password-container input::placeholder {
                color: #cfa039;
              }
            `}</style>

            <Input
              type="text"
              size="lg"
              // label="Username"
              placeholder="Username"
              className="[&>label>span]:border [&>label>span]:border-[#d4af37] [&>label>span]:font-medium [&>label>span]:focus:border-[#ffd700] [&>label>span]:focus:ring-2 [&>label>span]:focus:ring-[#d4af37]"
              inputClassName="text-[#b17d1c] placeholder-[#d4af37]/70 text-sm"
              {...register('username')}
              error={errors.username?.message}
              autoComplete="off"
            />
            <Password
              // label="Password"
              placeholder="Password"
              size="lg"
              className="[&>label>span]:border [&>label>span]:border-[#d4af37] [&>label>span]:font-medium [&>label>span]:focus:border-[#ffd700] [&>label>span]:focus:outline-none [&>label>span]:focus:ring-2 [&>label>span]:focus:ring-[#d4af37]"
              inputClassName="text-[#f6e27f] placeholder-[#d4af37]/70 text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Button
              className="w-full bg-gradient-to-b from-[#bb8928] to-[#9e6810] text-2xl font-bold text-black shadow-[0_0_10px_#d4af37] transition hover:opacity-90"
              type="submit"
              size="lg"
              disabled={loading}
              isLoading={loading}
            >
              <span>LOGIN</span>
            </Button>
            <Text className="mt-6 text-center text-[15px] leading-loose text-[#d4af37]/80 md:mt-7 lg:mt-9 lg:text-base">
              © PT INFINITE PRESTIGE GLOBAL 2025
            </Text>
          </div>
        )}
      </Form>
    </>
  );
}
