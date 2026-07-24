// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { LifeBuoy, Plus, MessageSquare, Send } from 'lucide-react';

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'general', priority: 'medium', description: '' });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setTickets(data || []);
    setLoading(false);
  };

  const createTicket = async () => {
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        description: newTicket.description,
        status: 'open',
      })
      .select('*')
      .single();

    // Add initial message
    if (data) {
      await supabase.from('support_messages').insert({
        ticket_id: data.id,
        sender: 'user',
        message: newTicket.description,
      });
    }

    setCreating(false);
    setShowCreate(false);
    setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
    loadTickets();
  };

  const loadMessages = async (ticketId: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender: 'user',
      message: newMessage,
    });

    setNewMessage('');
    loadMessages(selectedTicket.id);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Support</h1>
          <p className="text-slate-500 mt-1">Get help and manage your support tickets</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Ticket
        </Button>
      </div>

      {selectedTicket ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedTicket.subject}</CardTitle>
                <CardDescription>Ticket #{selectedTicket.id.slice(0, 8)}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>Back</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 min-h-[300px] mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-slate-400 py-8">No messages yet</p>}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e: any) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e: any) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ) : tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedTicket(ticket); loadMessages(ticket.id); }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{ticket.subject}</p>
                    <p className="text-xs text-slate-500">{ticket.category} · {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'pending' : 'neutral'}>{ticket.priority}</Badge>
                  <Badge variant={ticket.status === 'open' ? 'info' : ticket.status === 'resolved' ? 'success' : 'neutral'}>{ticket.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<LifeBuoy className="h-10 w-10 text-slate-300" />}
              title="No support tickets"
              description="Need help? Create a ticket and our team will assist you."
            />
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Modal */}
      {showCreate && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Support Ticket">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject</label>
              <Input value={newTicket.subject} onChange={(e: any) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Brief description of your issue" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
                <select className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-brand-500" value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}>
                  <option value="general">General</option>
                  <option value="transaction">Transaction</option>
                  <option value="account">Account</option>
                  <option value="kyc">KYC</option>
                  <option value="card">Virtual Card</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Priority</label>
                <select className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-brand-500" value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
              <textarea
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-brand-500 min-h-[100px] resize-none"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Describe your issue in detail..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createTicket} loading={creating} disabled={!newTicket.subject || !newTicket.description}>Create Ticket</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
