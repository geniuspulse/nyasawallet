// @ts-nocheck
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './database.types';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard and admin routes
  const protectedPaths = ['/onboarding', '/dashboard', '/wallet', '/transactions', '/deposit', '/send', '/card', '/referrals', '/profile', '/sell', '/support'];
  const adminPaths = ['/admin'];
  const authPaths = ['/auth/login', '/auth/sign-up', '/welcome'];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAdmin = adminPaths.some(p => pathname.startsWith(p));
  const isAuthPage = authPaths.some(p => pathname.startsWith(p));

  // Not logged in — redirect protected routes to login
  if (!user && (isProtected || isAdmin)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Admin route protection (check role)
  if (user && isAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Logged-in user trying to access auth pages — send them to dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
