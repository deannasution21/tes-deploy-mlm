import type { StaticImageData } from 'next/image';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpg';
import imgFCMIST from '@public/assets/img/product/FCMIST.jpeg';
import imgEGAM from '@public/assets/img/product/EGAM.jpeg';
import imgACC from '@public/assets/img/product/ACC.jpg';
import imgLP from '@public/assets/img/product/LP.jpeg';
import imgBSRM from '@public/assets/img/product/BSRM.png';

const PRODUCT_IMAGE_MAP: Record<string, StaticImageData | string> = {
  PRD0001: imgSNP,
  PRD0002: imgHNB,
  PRD0003: imgLILAC,
  PRD0004: imgFCMIST,
  PRD0005: imgEGAM,
  PRD0006: imgLP,
  PRD0007: imgACC,
  PRD0008: imgBSRM,
  PRD0009: '/images/produk/PRD0009.png',
};

export function getProductImageById(
  productId?: string | null
): StaticImageData | string {
  if (!productId) return defaultPlaceholder;

  return PRODUCT_IMAGE_MAP[String(productId).toUpperCase()] ?? defaultPlaceholder;
}
