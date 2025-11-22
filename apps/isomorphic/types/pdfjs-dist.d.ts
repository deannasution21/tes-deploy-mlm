// types/pdfjs-dist.d.ts
declare module 'pdfjs-dist/build/pdf.mjs' {
  export const version: string;
  export const GlobalWorkerOptions: any;
  export function getDocument(src: string | Uint8Array | ArrayBuffer): any;
  // Add other exports you need
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs';
