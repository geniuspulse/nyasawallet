// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SupportTicket, SupportMessage } from '@/lib/types';

// GET: Get all messages for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ticket ownership/permission
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', params.id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const typedTicket = ticket as SupportTicket;

    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = (profile as any)?.role === 'admin' || (profile as any)?.role === 'super_admin';
    const isOwner = typedTicket.user_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', params.id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messages as SupportMessage[] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new message to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Verify ticket ownership/permission
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', params.id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const typedTicket = ticket as SupportTicket;

    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = (profile as any)?.role === 'admin' || (profile as any)?.role === 'super_admin';
    const isOwner = typedTicket.user_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const isFromUser = isOwner;

    // Insert the support message
    const { data: supportMessage, error: insertError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: params.id,
        user_id: user.id,
        message: message.trim(),
        is_from_user: isFromUser,
        is_ai: false
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update support ticket status based on sender and set updated_at
    let nextStatus = typedTicket.status;
    if (isFromUser) {
      // If the ticket was closed or resolved, or pending, open it up again
      if (['resolved', 'closed', 'pending'].includes(typedTicket.status)) {
        nextStatus = 'open';
      }
    } else {
      // If reply is from admin, set to pending (waiting for user response)
      if (typedTicket.status === 'open') {
        nextStatus = 'pending';
      }
    }

    const { error: ticketUpdateError } = await supabase
      .from('support_tickets')
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (ticketUpdateError) {
      console.error('Failed to update ticket status/updated_at:', ticketUpdateError);
    }

    return NextResponse.json({ message: supportMessage as SupportMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
