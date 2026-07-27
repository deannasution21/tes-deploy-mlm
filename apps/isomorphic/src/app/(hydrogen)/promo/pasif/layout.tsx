import { CartProvider } from '@/store/quick-cart/cart.context';
import { PROMO_PASIF_CART_KEY } from '@/config/constants';

// Tidak render <CartDrawer /> di sini — alur aktivasi member pasif cukup 1 produk
// dan langsung menuju checkout, tidak butuh drawer keranjang seperti /produk.
export default function PromoPasifLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider cartKey={PROMO_PASIF_CART_KEY}>{children}</CartProvider>
  );
}
