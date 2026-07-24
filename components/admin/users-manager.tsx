// @ts-nocheck
'use client';

import { useState } from 'react';
import { cn, formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Eye,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Wallet as WalletIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { createClient } from '@/lib/supabase/client';

interface UsersManagerProps {
  initialUsers: any[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Search & filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesKyc = kycFilter === 'all' || u.kyc_status === kycFilter;

    return matchesSearch && matchesStatus && matchesKyc;
  });

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setLoadingUserId(userId);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (err) throw err;

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update user status');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (err) throw err;

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update user role');
    } finally {
      setLoadingUserId(null);
    }
  };

  const openViewModal = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const getUserUsdtWallet = (user: any) => {
    return user.wallets?.find((w: any) => w.type === 'usdt') || user.wallets?.[0];
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="all">All KYC Statuses</option>
            <option value="unverified">Unverified</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-medium dark:border-gray-800 dark:bg-gray-900/50">
                <th className="p-4">Name / Email</th>
                <th className="p-4">Country</th>
                <th className="p-4">KYC Status</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No users found matching filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const usdtWallet = getUserUsdtWallet(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.full_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {user.country || 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge variant={user.kyc_status === 'approved' ? 'success' : user.kyc_status === 'pending' ? 'warning' : 'destructive'}>
                          {user.kyc_status}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-gray-950 dark:text-gray-50">
                        {usdtWallet ? formatCurrency(usdtWallet.balance, usdtWallet.currency) : '$0.00'}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold",
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : user.role === 'admin' ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewModal(user)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.status === 'suspended' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleUpdateStatus(user.id, 'active')}
                              disabled={loadingUserId === user.id}
                              title="Activate user"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleUpdateStatus(user.id, 'suspended')}
                              disabled={loadingUserId === user.id}
                              title="Suspend user"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                          {user.role !== 'admin' && user.role !== 'super_admin' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-brand-600 hover:text-brand-700"
                              onClick={() => handleUpdateRole(user.id, 'admin')}
                              disabled={loadingUserId === user.id}
                              title="Make Admin"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          ) : user.role === 'admin' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-600 hover:text-slate-700"
                              onClick={() => handleUpdateRole(user.id, 'user')}
                              disabled={loadingUserId === user.id}
                              title="Remove Admin role"
                            >
                              <UserX className="h-4 w-4 text-slate-500" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="User Account Details"
        >
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
              <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-lg dark:bg-brand-950/40">
                {(selectedUser.full_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h4 className="text-md font-bold text-gray-900 dark:text-gray-100">
                  {selectedUser.full_name || 'No full name provided'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{selectedUser.phone_number || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{selectedUser.country || 'No country'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{selectedUser.city || 'No city'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Joined {formatDate(selectedUser.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Role: <strong className="capitalize">{selectedUser.role}</strong></span>
              </div>
            </div>

            {/* Wallets */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Wallets</h5>
              {selectedUser.wallets && selectedUser.wallets.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.wallets.map((wallet: any) => (
                    <div key={wallet.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-900/30 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <WalletIcon className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 capitalize">{wallet.type} Wallet</p>
                          <p className="text-[10px] text-gray-400">{wallet.wallet_address || 'Internal'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-950 dark:text-gray-50">
                          {formatCurrency(wallet.balance, wallet.currency)}
                        </p>
                        <p className="text-[10px] text-gray-400">Locked: {formatCurrency(wallet.locked_balance, wallet.currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No wallets configured for this user.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              {selectedUser.status === 'suspended' ? (
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                >
                  Activate Account
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                >
                  Suspend Account
                </Button>
              )}
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
