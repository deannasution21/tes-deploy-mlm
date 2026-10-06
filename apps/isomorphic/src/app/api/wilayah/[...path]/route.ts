import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const apiUrl = `https://emsifa.github.io/api-wilayah-indonesia/api/${path}.json`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Failed to fetch external API');

    const data = await res.json();
    // region data rarely changes; let the CDN cache it so repeat requests
    // don't invoke this function
    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=2592000, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
