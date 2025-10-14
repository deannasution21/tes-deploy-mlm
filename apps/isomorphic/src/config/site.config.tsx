import { Metadata } from 'next';
import logoImg from '@public/logo.svg';
import { LAYOUT_OPTIONS } from '@/config/enums';
import logoIconImg from '@public/logo-short.svg';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'PT. Infinite Prestige Global (IPG)',
  description:
    'Bergabung Sekarang — Jadilah Orang Pertama di Kota Anda! PT. Infinite Prestige Global (IPG) adalah platform pemasaran jaringan yang berfokus pada penjualan produk unggulan di Indonesia.',
  logo: logoImg,
  icon: '/assets/img/logo/logo-ipg2.jpeg',
  url: 'https://ipglobal.co.id',
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  const metaTitle = title
    ? `${title} - PT. Infinite Prestige Global (IPG)`
    : siteConfig.title;

  return {
    title: metaTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: openGraph ?? {
      title: metaTitle,
      description,
      url: siteConfig.url,
      siteName: 'PT. Infinite Prestige Global (IPG)',
      images: [
        {
          url: '/assets/img/logo/logo-ipg3.jpeg', // sediakan banner OG 1200x630 di public/
          width: 1024,
          height: 1024,
          alt: 'PT. Infinite Prestige Global (IPG)',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: ['/assets/img/logo/logo-ipg3.jpeg'],
      creator: '@ipglobal', // opsional, kalau ada akun Twitter
    },
    icons: {
      icon: siteConfig.icon,
    },
  };
};
