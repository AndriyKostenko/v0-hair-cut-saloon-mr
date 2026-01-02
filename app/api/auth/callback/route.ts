import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import oath2Client from '@/app/utils/google_auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  try {
    const { tokens } = await oath2Client.getToken(code);
    console.log(tokens)
    oath2Client.setCredentials(tokens);

    const cookieStore = await cookies();
    cookieStore.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days (adjust as needed)
    });

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
  }
}
