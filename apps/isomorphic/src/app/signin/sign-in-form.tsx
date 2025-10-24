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
        //     role === 'admin' ? initialValuesAdmin : initialValuesUser,
        // }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="text"
              size="lg"
              label="Username"
              placeholder="Enter your username"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('username')}
              error={errors.username?.message}
              autoComplete="off"
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Ingat Saya"
                className="[&>label>span]:font-medium"
              />
            </div>
            <Button
              className="w-full bg-[#AA8453] text-white hover:bg-[#a16207]"
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk</span>
                  <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
