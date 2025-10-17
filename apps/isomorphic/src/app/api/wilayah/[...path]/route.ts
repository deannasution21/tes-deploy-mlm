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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
