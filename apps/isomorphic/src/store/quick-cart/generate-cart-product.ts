import { CartItem, Product, ProductCartItem, ProductColor } from '@/types';
import { ProductItem } from '@/types';
import { generateSlug } from '@core/utils/generate-slug';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';

// interface CartProduct extends Omit<Product, 'colors' | 'sizes'> {
//   color: ProductColor;
//   size: number;
// }

interface CartProduct extends Omit<ProductItem, 'quantity'> {
  quantity: number;
}

export function generateCartProduct(product: CartProduct): ProductCartItem {
  const { product_id, attribute, quantity } = product;
  const { name, stock, stock_pin, description, price } = attribute;

  return {
    id: product_id,
    name: name,
    slug: generateSlug(`${name}-${product_id}`),
    stock: stock,
    stock_pin: stock_pin,
    description: description,
    price: price,
    quantity: quantity,
    image: defaultPlaceholder,
    size: 1,
  };
}

// export function generateCartProduct(product: CartProduct): CartItem {
//   return {
//     id: product?.id,
//     name: product?.title,
//     slug: generateSlug(product?.title),
//     description: product?.description,
//     image: product?.thumbnail,
//     price: product?.price,
//     quantity: 1,
//     size: product.size,
//     color: product.color,
//   };
// }
