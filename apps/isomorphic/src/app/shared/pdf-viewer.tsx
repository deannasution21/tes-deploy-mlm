'use client';

import { useState, useEffect } from 'react';

export default function PdfViewer() {
  return (
    <div className="bg-gray-50">
      <div className="w-full p-2 sm:p-6">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <iframe
            src="/pdf/profil-perusahaan-ipg.pdf"
            className="h-[80vh] w-full"
            title="Company Profile PDF"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Pinch to zoom and scroll naturally
          </p>
        </div>
      </div>
    </div>
  );
}
