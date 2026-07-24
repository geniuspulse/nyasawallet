// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Wallet, Transaction } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query = (supabase.from('transactions') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: transactionsData, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const transactions = (transactionsData || []) as Transaction[];
    return NextResponse.json({ transactions });
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

    const body = await request.json();
    const {
      type,
      method,
      amount: rawAmount,
      fee: rawFee = 0,
      currency = 'USDT',
      local_amount,
      local_currency,
      exchange_rate,
      phone_number,
      account_name,
      account_number,
      bank_name,
      wallet_address,
      network,
      tx_hash,
      reference,
      recipient_email,
      sender_email,
      payment_provider,
      metadata = {},
      status = 'pending'
    } = body;

    // Validation
    if (!type || rawAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields: type and amount' }, { status: 400 });
    }

    const amount = Number(rawAmount);
    const fee = Number(rawFee);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    if (isNaN(fee) || fee < 0) {
      return NextResponse.json({ error: 'Fee must be a non-negative number' }, { status: 400 });
    }

    // Fetch the user's wallet
    const { data: walletData, error: walletError } = await (supabase.from('wallets') as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .maybeSingle();

    if (walletError) {
      return NextResponse.json({ error: 'Failed to fetch wallet: ' + walletError.message }, { status: 500 });
    }

    const wallet = walletData as Wallet | null;

    if (!wallet) {
      return NextResponse.json({ error: `Wallet for currency ${currency} not found` }, { status: 404 });
    }

    // Determine balance adjustment
    const isCredit = ['deposit', 'buy', 'referral_bonus'].includes(type);
    const isDebit = ['send', 'withdrawal', 'sell'].includes(type);

    let balanceChange = 0;
    if (isCredit) {
      if (status === 'completed') {
        balanceChange = amount;
      }
    } else if (isDebit) {
      balanceChange = -(amount + fee);
    } else {
      balanceChange = -amount;
    }

    const newBalance = Number(wallet.balance) + balanceChange;
    if (newBalance < 0) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Use admin client for balance updates to prevent RLS/concurrency blocks
    const adminSupabase = createAdminClient();

    // Update wallet balance
    if (balanceChange !== 0) {
      const { error: walletUpdateErr } = await (adminSupabase.from('wallets') as any)
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (walletUpdateErr) {
        return NextResponse.json({ error: 'Failed to update wallet balance: ' + walletUpdateErr.message }, { status: 500 });
      }
    }

    // Insert transaction
    const { data: transactionData, error: insertError } = await (supabase.from('transactions') as any)
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type,
        status,
        method,
        amount,
        fee,
        currency,
        local_amount,
        local_currency,
        exchange_rate,
        phone_number,
        account_name,
        account_number,
        bank_name,
        wallet_address,
        network,
        tx_hash,
        reference,
        recipient_email,
        sender_email,
        payment_provider,
        metadata
      })
      .select()
      .single();

    if (insertError) {
      // Rollback wallet balance update if transaction insert fails
      if (balanceChange !== 0) {
        await (adminSupabase.from('wallets') as any)
          .update({ balance: wallet.balance })
          .eq('id', wallet.id);
      }
      return NextResponse.json({ error: 'Failed to record transaction: ' + insertError.message }, { status: 500 });
    }

    const transaction = transactionData as Transaction;
    return NextResponse.json({ transaction, walletBalance: newBalance }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
