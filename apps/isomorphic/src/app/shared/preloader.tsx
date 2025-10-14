'use client';

import { useState, useEffect } from 'react';

export const Preloader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Wait a bit, then mark loaded
      setTimeout(() => setLoaded(true), 200);
    };

    // Trigger immediately if already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div
      id="preloader"
      className={`preloader ${loaded ? 'loaded' : ''}`}
      style={loaded ? { display: 'none' } : {}}
    >
      <div className="animation-preloader">
        <div className="spinner"></div>
        <div
          className="txt-loading relative"
          style={{ right: '-10px', letterSpacing: '25px' }}
        >
          <span data-text-preloader="I" className="letters-loading">
            I
          </span>
          <span data-text-preloader="P" className="letters-loading">
            P
          </span>
          <span data-text-preloader="G" className="letters-loading">
            G
          </span>
        </div>
        <p className="text-center">Loading</p>
      </div>
      <div className="loader">
        <div className="flex h-screen w-full flex-wrap">
          <div className="loader-section section-left w-1/4">
            <div className="bg"></div>
          </div>
          <div className="loader-section section-left w-1/4">
            <div className="bg"></div>
          </div>
          <div className="loader-section section-right w-1/4">
            <div className="bg"></div>
          </div>
          <div className="loader-section section-right w-1/4">
            <div className="bg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
