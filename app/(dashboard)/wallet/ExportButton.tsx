// @ts-nocheck
'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/types';
import { toast } from '@/components/ui/toaster';

interface ExportButtonProps {
  transactions: Transaction[];
}

function ExportButton({ transactions }: ExportButtonProps) {
  const handleExport = () => {
    if (transactions.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'You have no transactions to export.',
        variant: 'warning',
      });
      return;
    }

    try {
      const headers = [
        'ID',
        'Date',
        'Type',
        'Amount',
        'Fee',
        'Currency',
        'Status',
        'Method',
        'Wallet Address',
        'Network',
        'Reference',
      ];

      const rows = transactions.map((t) => [
        t.id,
        new Date(t.created_at).toISOString(),
        t.type,
        t.amount,
        t.fee,
        t.currency,
        t.status,
        t.method || 'crypto',
        t.wallet_address || '',
        t.network || '',
        t.reference || '',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nyasawallet_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); // Required for FF

      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: `Exported ${transactions.length} transactions to CSV.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting your transactions.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      <span>Export CSV</span>
    </Button>
  );
}
export default ExportButton;
