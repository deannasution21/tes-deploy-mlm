'use client';

import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { Password, Checkbox, Button, Input, Text } from 'rizzui';
import { useMedia } from '@core/hooks/use-media';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';

const initialValues: LoginSchema = {
  email: 'username',
  password: 'password',
  rememberMe: true,
};

export default function SignInForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            <style>{`
              .rizzui-input-container input::placeholder,
              .rizzui-password-container input::placeholder {
                color: #cfa039;
              }
            `}</style>

            <Input
              type="text"
              size={isMedium ? 'lg' : 'xl'}
              // label="Email"
              placeholder="Username"
              className="[&>label>span]:border [&>label>span]:border-[#d4af37] [&>label>span]:font-medium [&>label>span]:focus:border-[#ffd700] [&>label>span]:focus:ring-2 [&>label>span]:focus:ring-[#d4af37]"
              inputClassName="text-[#b17d1c] placeholder-[#d4af37]/70"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              // label="Password"
              placeholder="Password"
              size={isMedium ? 'lg' : 'xl'}
              className="[&>label>span]:border [&>label>span]:border-[#d4af37] [&>label>span]:font-medium [&>label>span]:focus:border-[#ffd700] [&>label>span]:focus:outline-none [&>label>span]:focus:ring-2 [&>label>span]:focus:ring-[#d4af37]"
              inputClassName="text-[#f6e27f] placeholder-[#d4af37]/70"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button
              className="w-full bg-gradient-to-b from-[#bb8928] to-[#9e6810] text-2xl font-bold text-black shadow-[0_0_10px_#d4af37] transition hover:opacity-90"
              type="submit"
              size={isMedium ? 'lg' : 'xl'}
            >
              LOGIN
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-[#d4af37]/80 md:mt-7 lg:mt-9 lg:text-base">
        © PT INFINITE PRESTIGE GLOBAL 2025
      </Text>
    </>
  );
}
