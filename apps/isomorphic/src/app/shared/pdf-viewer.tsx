'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfViewer() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    // Update container width on resize
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 64, 1200); // 1200px max, with 32px padding on each side
      setContainerWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full max-w-7xl rounded-lg p-2 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:mb-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Halaman {pageNumber} dari {numPages}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-4 sm:text-base"
            >
              Sebelum
            </button>

            <button
              disabled={pageNumber >= (numPages || 1)}
              onClick={() => setPageNumber((prev) => prev + 1)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-4 sm:text-base"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        {/* PDF Document - Scrollable Container */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <div className="max-h-[70vh] overflow-auto p-2 sm:p-4">
            <div className="flex min-w-min justify-center">
              <Document
                file="/pdf/profil-perusahaan-ipg.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex h-64 w-full items-center justify-center sm:h-96">
                    <div className="text-center">
                      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 sm:mb-4 sm:h-12 sm:w-12"></div>
                      <p className="text-sm text-gray-600 sm:text-lg">
                        Memuat PDF...
                      </p>
                    </div>
                  </div>
                }
                error={
                  <div className="flex h-64 w-full items-center justify-center sm:h-96">
                    <div className="text-center">
                      <svg
                        className="mx-auto mb-3 h-12 w-12 text-red-500 sm:mb-4 sm:h-16 sm:w-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-red-600 sm:text-lg">
                        Gagal memuat PDF
                      </p>
                      <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
                        File tidak tersedia
                      </p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth}
                  loading={
                    <div className="flex h-64 w-full items-center justify-center sm:h-96">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 sm:h-8 sm:w-8"></div>
                        <p className="text-xs text-gray-600 sm:text-sm">
                          Memuat halaman {pageNumber}...
                        </p>
                      </div>
                    </div>
                  }
                />
              </Document>
            </div>
          </div>
        </div>

        {/* Footer with Instructions */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-500">
              Scroll untuk melihat keseluruhan PDF
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {pageNumber} / {numPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
