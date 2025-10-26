'use client';

import Link from 'next/link';
import { routes } from '@/config/routes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiArrowLineRight, PiUserCirclePlus } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';
import OrSeparation from '@/app/shared/auth-layout/or-separation';
import { siteConfig } from '@/config/site.config';
import { BsFacebook } from 'react-icons/bs';
import logoImg from '@public/assets/img/logo/logo-ipg3-trans.png';
import bgDark from '@public/assets/img/bg-dark.jpeg';

export default function AuthWrapperFour({
  children,
  title,
  isSocialLoginActive = false,
  isSignIn = false,
  className = '',
  role,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
  className?: string;
  role?: string | null;
}) {
  return (
    <div
      className="flex min-h-screen w-full items-center bg-black bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${bgDark.src}')`,
      }}
    >
      <div className="flex w-full flex-col justify-center px-5">
        <div
          className={cn(
            'mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2',
            className
          )}
        >
          <div className="flex flex-col items-center">
            <Link href={'/'} className="mb-7 inline-block lg:mb-9">
              <Image src={logoImg} alt={siteConfig.title} height={250} />
            </Link>
            <Title
              as="h2"
              className="mb-7 text-center text-[24px] font-bold leading-snug text-[#c69731] md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl"
            >
              {title}
            </Title>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
