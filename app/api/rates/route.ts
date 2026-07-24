// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, CountryRate } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: ratesData, error } = await (supabase.from('country_rates') as any)
      .select('*')
      .eq('is_active', true)
      .order('country', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rates = ratesData as CountryRate[];
    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role check
    const { data: profileData, error: profileError } = await (supabase.from('profiles') as any)
      .select('role')
      .eq('user_id', user.id)
      .single();

    const profile = profileData as Profile | null;

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      country,
      country_code,
      currency,
      buy_rate,
      sell_rate,
      margin = 0,
      is_active = true
    } = body;

    // Validations
    if (!country || !country_code || !currency || buy_rate === undefined || sell_rate === undefined) {
      return NextResponse.json({ error: 'Missing required fields: country, country_code, currency, buy_rate, sell_rate' }, { status: 400 });
    }

    if (isNaN(Number(buy_rate)) || Number(buy_rate) <= 0) {
      return NextResponse.json({ error: 'buy_rate must be a positive number' }, { status: 400 });
    }

    if (isNaN(Number(sell_rate)) || Number(sell_rate) <= 0) {
      return NextResponse.json({ error: 'sell_rate must be a positive number' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const { data: newRateData, error: insertError } = await (adminSupabase.from('country_rates') as any)
      .insert({
        country,
        country_code: country_code.toUpperCase(),
        currency,
        buy_rate: Number(buy_rate),
        sell_rate: Number(sell_rate),
        margin: Number(margin),
        is_active
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const newRate = newRateData as CountryRate;
    return NextResponse.json({ rate: newRate }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
