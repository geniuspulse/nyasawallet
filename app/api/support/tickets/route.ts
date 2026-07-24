// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SupportPriority, SupportStatus, SupportTicket } from '@/lib/types';

// GET: List tickets (user sees own, admin sees all)
export async function GET(request: NextRequest) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as SupportStatus | null;
    const priority = searchParams.get('priority') as SupportPriority | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get user profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = (profile as any)?.role === 'admin' || (profile as any)?.role === 'super_admin';

    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false });

    // Filter by ownership if the caller is not an admin
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    // Apply optional status and priority filters
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: tickets, count, error: queryError } = await query;

    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    return NextResponse.json({
      tickets: tickets as SupportTicket[],
      pagination: {
        total: count || 0,
        limit,
        offset,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a support ticket
export async function POST(request: NextRequest) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, description, category, priority = 'medium' } = body;

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    // Validate support priority
    const validPriorities: SupportPriority[] = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority level' }, { status: 400 });
    }

    const { data: ticket, error: insertError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        description,
        category,
        priority: priority as SupportPriority,
        status: 'open' as SupportStatus,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ticket: ticket as SupportTicket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
