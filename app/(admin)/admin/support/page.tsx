// @ts-nocheck
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Support — Admin' };

export default async function AdminSupportPage() {
  const supabase = createAdminClient();

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*, profiles!inner(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Support Management</h1>
        <p className="text-slate-500 mt-1">Manage all support tickets across the platform</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Tickets</CardTitle></CardHeader>
        <CardContent>
          {tickets && tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Priority</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tickets.map((ticket: any) => (
                    <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="py-3 pr-4 text-xs font-mono text-slate-400">#{ticket.id.slice(0, 8)}</td>
                      <td className="py-3 pr-4">
                        <p className="text-sm font-medium text-slate-900">{ticket.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{ticket.profiles?.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-700">{ticket.subject}</td>
                      <td className="py-3 pr-4 text-sm text-slate-500 capitalize">{ticket.category}</td>
                      <td className="py-3 pr-4"><Badge variant={ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'pending' : 'neutral'}>{ticket.priority}</Badge></td>
                      <td className="py-3 pr-4"><Badge variant={ticket.status === 'open' ? 'info' : ticket.status === 'resolved' ? 'success' : 'neutral'}>{ticket.status}</Badge></td>
                      <td className="py-3 text-sm text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">No support tickets found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
