// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, Wallet, Transaction } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Fetch the transaction
    const { data: transactionData, error: fetchError } = await (supabase.from('transactions') as any)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch transaction: ' + fetchError.message }, { status: 500 });
    }

    const transaction = transactionData as Transaction | null;

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Verify ownership or admin role
    if (transaction.user_id !== user.id) {
      const { data: profileData } = await (supabase.from('profiles') as any)
        .select('role')
        .eq('user_id', user.id)
        .single();

      const profile = profileData as Profile | null;
      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
    }

    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Fetch current profile to check if user is admin
    const { data: profileData } = await (supabase.from('profiles') as any)
      .select('role')
      .eq('user_id', user.id)
      .single();

    const profile = profileData as Profile | null;
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

    // Fetch the transaction
    const adminSupabase = createAdminClient();
    const { data: transactionData, error: fetchError } = await (adminSupabase.from('transactions') as any)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    const transaction = transactionData as Transaction | null;

    if (fetchError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const isOwner = transaction.user_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Authorization constraints for status transition
    // Non-admins can ONLY transition from 'pending' to 'cancelled'
    if (!isAdmin) {
      if (status !== 'cancelled') {
        return NextResponse.json({ error: 'Forbidden: only admins can update transactions to statuses other than cancelled' }, { status: 403 });
      }
      if (transaction.status !== 'pending') {
        return NextResponse.json({ error: 'Only pending transactions can be cancelled' }, { status: 400 });
      }
    }

    // If already in a final state, do not allow changes
    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: `Cannot change status of a ${transaction.status} transaction` }, { status: 400 });
    }

    // State machine wallet balance adjustments
    const type = transaction.type;
    const amount = Number(transaction.amount);
    const fee = Number(transaction.fee || 0);

    const isCredit = ['deposit', 'buy', 'referral_bonus'].includes(type);
    const isDebit = ['send', 'withdrawal', 'sell'].includes(type);

    let balanceAdjust = 0;

    // Transition: pending -> completed
    if (status === 'completed') {
      if (isCredit) {
        // Now credit the user
        balanceAdjust = amount;
      }
      // For debits, the amount was already deducted during creation (POST), so nothing to do.
    }

    // Transition: pending -> cancelled OR pending -> failed
    if (status === 'cancelled' || status === 'failed') {
      if (isDebit) {
        // Refund the deducted amount + fee
        balanceAdjust = amount + fee;
      }
      // For credits, nothing was credited yet, so nothing to do.
    }

    // Apply wallet adjustment if any
    if (balanceAdjust !== 0) {
      // Fetch user's wallet
      const { data: walletData, error: walletError } = await (adminSupabase.from('wallets') as any)
        .select('*')
        .eq('user_id', transaction.user_id)
        .eq('currency', transaction.currency)
        .maybeSingle();

      const wallet = walletData as Wallet | null;

      if (walletError || !wallet) {
        return NextResponse.json({ error: 'User wallet not found for adjustments' }, { status: 404 });
      }

      const newBalance = Number(wallet.balance) + balanceAdjust;
      if (newBalance < 0) {
        return NextResponse.json({ error: 'Insufficient balance to complete adjustment' }, { status: 400 });
      }

      const { error: walletUpdateErr } = await (adminSupabase.from('wallets') as any)
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (walletUpdateErr) {
        return NextResponse.json({ error: 'Failed to adjust wallet balance: ' + walletUpdateErr.message }, { status: 500 });
      }
    }

    // Update transaction status
    const { data: updatedTransactionData, error: updateError } = await (adminSupabase.from('transactions') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      // Rollback wallet adjustment on failure
      if (balanceAdjust !== 0) {
        const { data: walletData } = await (adminSupabase.from('wallets') as any)
          .select('balance')
          .eq('user_id', transaction.user_id)
          .eq('currency', transaction.currency)
          .single();
        const wallet = walletData as Wallet | null;
        if (wallet) {
          await (adminSupabase.from('wallets') as any)
            .update({ balance: Number(wallet.balance) - balanceAdjust })
            .eq('user_id', transaction.user_id)
            .eq('currency', transaction.currency);
        }
      }
      return NextResponse.json({ error: 'Failed to update transaction status: ' + updateError.message }, { status: 500 });
    }

    const updatedTransaction = updatedTransactionData as Transaction;
    return NextResponse.json({ transaction: updatedTransaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
