// @ts-nocheck
'use client';

import { useState } from 'react';
import { cn, formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  User,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

interface TransactionsManagerProps {
  initialTransactions: any[];
}

export function TransactionsManager({ initialTransactions }: TransactionsManagerProps) {
  const [transactions, setTransactions] = useState<any[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [isDetailModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date range checking
  const filterByDate = (createdAt: string) => {
    if (dateFilter === 'all') return true;
    const txDate = new Date(createdAt);
    const now = new Date();

    if (dateFilter === 'today') {
      return txDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    }
    if (dateFilter === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return txDate >= thirtyDaysAgo;
    }
    return true;
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesDate = filterByDate(tx.created_at);

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleUpdateStatus = async (txId: string, status: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/${txId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update transaction');
      }

      const updatedTx = await response.json();

      setTransactions(transactions.map((t) => (t.id === txId ? { ...t, status } : t)));
      setIsViewModalOpen(false);
      setSelectedTx(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while updating transaction status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetailModal = (tx: any) => {
    setSelectedTx(tx);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="grid gap-4 md:grid-cols-4 bg-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-750 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="send">Send</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
          <option value="exchange">Exchange</option>
          <option value="referral_bonus">Referral Bonus</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-750 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-750 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-medium dark:border-gray-800 dark:bg-gray-900/50">
                <th className="p-4">Reference / Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Local Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncoming = tx.type === 'deposit' || tx.type === 'referral_bonus';
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {tx.reference || `TX-${tx.id.slice(0, 8).toUpperCase()}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(tx.created_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {tx.profiles?.full_name || 'System User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.profiles?.email || tx.recipient_email || tx.sender_email || 'No email'}
                        </div>
                      </td>
                      <td className="p-4 capitalize text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center gap-1">
                          {isIncoming ? (
                            <ArrowDownLeft className="h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-red-500" />
                          )}
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-950 dark:text-gray-50">
                        {isIncoming ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || 'USDT')}
                      </td>
                      <td className="p-4 text-xs text-gray-550 dark:text-gray-450">
                        {tx.local_amount && tx.local_currency ? (
                          <span>
                            {formatCurrency(tx.local_amount, tx.local_currency)}
                            <span className="text-[10px] text-gray-400 block">
                              Rate: {tx.exchange_rate}
                            </span>
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'destructive'}>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetailModal(tx)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Transaction Details"
        >
          <div className="space-y-6">
            {/* Amount Banner */}
            <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-800">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Amount</p>
              <h2 className={cn(
                "text-3xl font-bold mt-1",
                selectedTx.type === 'deposit' || selectedTx.type === 'referral_bonus' ? 'text-green-600' : 'text-gray-900 dark:text-gray-50'
              )}>
                {selectedTx.type === 'deposit' || selectedTx.type === 'referral_bonus' ? '+' : '-'}{formatCurrency(selectedTx.amount, selectedTx.currency || 'USDT')}
              </h2>
              {selectedTx.local_amount && selectedTx.local_currency && (
                <p className="text-sm font-semibold text-gray-500 mt-1 dark:text-gray-400">
                  Equivalent to {formatCurrency(selectedTx.local_amount, selectedTx.local_currency)}
                </p>
              )}
              <div className="mt-3">
                <Badge variant={selectedTx.status === 'completed' ? 'success' : selectedTx.status === 'pending' ? 'warning' : 'destructive'}>
                  {selectedTx.status}
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Transaction ID</p>
                <p className="mt-0.5 select-all">{selectedTx.id}</p>
              </div>
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Reference</p>
                <p className="mt-0.5 font-mono">{selectedTx.reference || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Type</p>
                <p className="mt-0.5 capitalize">{selectedTx.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Method</p>
                <p className="mt-0.5 capitalize">{selectedTx.method?.replace('_', ' ') || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Fee Paid</p>
                <p className="mt-0.5">{formatCurrency(selectedTx.fee || 0, selectedTx.currency || 'USDT')}</p>
              </div>
              <div>
                <p className="font-bold text-gray-950 dark:text-gray-100">Date / Time</p>
                <p className="mt-0.5">{formatDate(selectedTx.created_at)}</p>
              </div>
            </div>

            {/* Payee / Recipient Info */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800 text-xs">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Participant Details</h4>
              <div className="bg-gray-50/50 p-3 rounded-lg border dark:bg-gray-900/10">
                <div className="grid grid-cols-2 gap-2 text-gray-650 dark:text-gray-450">
                  <span className="font-semibold">User:</span>
                  <span className="text-right font-medium text-gray-900 dark:text-gray-200">
                    {selectedTx.profiles?.full_name || 'System / Direct'}
                  </span>
                  <span className="font-semibold">Email:</span>
                  <span className="text-right font-medium text-gray-900 dark:text-gray-200">
                    {selectedTx.profiles?.email || selectedTx.recipient_email || selectedTx.sender_email || 'N/A'}
                  </span>
                  {selectedTx.phone_number && (
                    <>
                      <span className="font-semibold">Phone:</span>
                      <span className="text-right text-gray-900 dark:text-gray-200">{selectedTx.phone_number}</span>
                    </>
                  )}
                  {selectedTx.wallet_address && (
                    <>
                      <span className="font-semibold">Crypto Address:</span>
                      <span className="text-right select-all text-brand-500 font-mono text-[10px] break-all">
                        {selectedTx.wallet_address}
                      </span>
                    </>
                  )}
                  {selectedTx.network && (
                    <>
                      <span className="font-semibold">Network:</span>
                      <span className="text-right uppercase">{selectedTx.network}</span>
                    </>
                  )}
                  {selectedTx.payment_provider && (
                    <>
                      <span className="font-semibold">Gateway / Provider:</span>
                      <span className="text-right capitalize">{selectedTx.payment_provider}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {selectedTx.status === 'pending' && (
              <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateStatus(selectedTx.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve / Complete
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateStatus(selectedTx.id, 'failed')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject / Fail
                </Button>
                <Button
                  className="flex-none text-amber-600 border border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateStatus(selectedTx.id, 'flagged')}
                  title="Flag as Suspicious"
                >
                  <AlertOctagon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
