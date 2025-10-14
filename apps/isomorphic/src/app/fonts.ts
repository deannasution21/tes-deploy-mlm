import { Inter, Lexend_Deca, Gilda_Display, Barlow } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export const gildaDisplay = Gilda_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gilda',
});

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // or whatever weights you used
  variable: '--font-barlow',
});
