import Image from 'next/image';
import { Button, Title, Text } from 'rizzui';
import logoImg from '@public/assets/img/logo/logo-ipg3.jpeg';
import { routes } from '@/config/routes';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex grow items-center px-6 xl:px-10">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col-reverse items-center justify-between text-center lg:flex-row lg:gap-5 lg:text-start 3xl:max-w-[1520px]">
        <div>
          <Title
            as="h2"
            className="mb-3 text-[22px] font-bold leading-snug sm:text-2xl md:mb-5 md:text-3xl md:leading-snug xl:mb-7 xl:text-4xl xl:leading-normal 2xl:text-[40px] 3xl:text-5xl 3xl:leading-snug"
          >
            Selamat Datang di <br />
            Infinite Prestige Global (IPG)
          </Title>
          <Text className="mb-6 max-w-[612px] text-sm leading-loose text-gray-500 md:mb-8 xl:mb-10 xl:text-base xl:leading-loose">
            PT. Infinite Prestige Global (IPG) adalah platform pemasaran
            jaringan yang membuka peluang bisnis bagi siapa pun untuk meraih
            kesuksesan melalui penjualan produk unggulan. Bergabung Sekarang —
            Jadilah Orang Pertama di Kota Anda!
          </Text>
          <div className="mt-8 flex flex-col justify-center gap-4 lg:flex-row lg:justify-start xl:gap-6">
            <Link href={routes.signIn}>
              <Button
                color="primary"
                size="lg"
                className="h-12 px-4 xl:h-14 xl:px-6"
              >
                Mulai Sekarang!
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <style>{`
  @keyframes pinFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px); /* subtle upward motion */
    }
  }

  .animate-pin-float {
    animation: pinFloat 4s ease-in-out infinite;
    transform-style: preserve-3d;
  }
`}</style>

          <Image
            src={logoImg}
            alt="coming-soon"
            className="animate-pin-float aspect-[632/630] max-w-[256px] rounded-xl sm:max-w-xs lg:max-w-lg 2xl:max-w-xl 3xl:max-w-[632px]"
          />
          <div className="mx-auto h-20 w-32 bg-gray-1000/50 blur-[57px] [transform:rotateX(80deg)]"></div>
          <div className="absolute bottom-10 left-3 mx-auto h-20 w-32 bg-gray-1000/50 blur-[57px] [transform:rotateX(80deg)] lg:left-7"></div>
        </div>
      </div>
    </div>
  );
}
