import SignInForm from '@/app/signin/sign-in-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import Image from 'next/image';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';
import loginImg from '@public/assets/img/image (1).png';

import '@public/assets/css/animate.css';
import '@public/assets/css/main.css';

export const metadata = {
  ...metaObject('Sign In'),
};

export default function SignIn() {
  return (
    <AuthWrapperOne
      title={
        <h2 className="wow fadeInUp" data-wow-delay=".2s">
          Selamat Datang Orang Hebat!
        </h2>
      }
      description="Silakan masuk untuk melanjutkan ke dashboard Anda."
      bannerTitle="Kesuksesan tidak datang kepada mereka yang menunggu, tetapi kepada mereka yang berani mengambil langkah pertama."
      bannerDescription="— Eleanor Roosevelt"
      isSocialLoginActive={false}
      pageImage={
        <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
          <Image
            src={loginImg}
            alt="Sign Up Thumbnail"
            fill
            priority
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
      }
      role="user"
    >
      <SignInForm role="user" />
    </AuthWrapperOne>
  );
}
