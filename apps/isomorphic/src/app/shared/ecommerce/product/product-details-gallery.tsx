import Image, { StaticImageData } from 'next/image';

const productGallery = [
  'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/1.jpg',
  'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/2.jpg',
  'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/3.jpg',
  'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/4.jpg',
];

export default function ProductDetailsGallery({
  image,
}: {
  image: string | StaticImageData;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 @xl:rounded-md">
      <Image
        fill
        priority
        src={image}
        alt="Product Image"
        sizes="(max-width: 768px) 100vw"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
