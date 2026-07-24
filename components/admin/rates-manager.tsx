// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CountryRate } from '@/lib/types';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Modal
} from '@/components/ui';
import { Edit2, Save, X, Plus, Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatesManagerProps {
  initialRates: CountryRate[];
}

export function RatesManager({ initialRates }: RatesManagerProps) {
  const supabase = createClient();
  const [rates, setRates] = useState<CountryRate[]>(initialRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRate, setEditedRate] = useState<Partial<CountryRate> | null>(null);
  
  // Add Rate modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRate, setNewRate] = useState<Partial<CountryRate>>({
    country: '',
    country_code: '',
    currency: '',
    buy_rate: 0,
    sell_rate: 0,
    margin: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after a delay
  const triggerMessage = (type: 'error' | 'success', text: string) => {
    if (type === 'error') {
      setError(text);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccess(text);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  const startEditing = (rate: CountryRate) => {
    setEditingId(rate.id);
    setEditedRate({ ...rate });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedRate(null);
  };

  const handleEditChange = (field: keyof CountryRate, value: any) => {
    if (!editedRate) return;
    setEditedRate({
      ...editedRate,
      [field]: value,
    });
  };

  const saveRate = async (id: string) => {
    if (!editedRate) return;
    setLoading(true);
    setError(null);

    try {
      const buyRateNum = parseFloat(editedRate.buy_rate as any) || 0;
      const sellRateNum = parseFloat(editedRate.sell_rate as any) || 0;
      const marginNum = parseFloat(editedRate.margin as any) || 0;

      const { data, error: updateError } = await supabase
        .from('country_rates')
        .update({
          buy_rate: buyRateNum,
          sell_rate: sellRateNum,
          margin: marginNum,
          is_active: editedRate.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRates(rates.map((r) => (r.id === id ? { ...r, ...data } : r)));
      setEditingId(null);
      setEditedRate(null);
      triggerMessage('success', 'Exchange rate updated successfully');
    } catch (err: any) {
      console.error('Error updating rate:', err);
      triggerMessage('error', err.message || 'Failed to update rate');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (rate: CountryRate) => {
    try {
      const newStatus = !rate.is_active;
      const { data, error: updateError } = await supabase
        .from('country_rates')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rate.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRates(rates.map((r) => (r.id === rate.id ? { ...r, is_active: newStatus } : r)));
      triggerMessage('success', `Rate for ${rate.country} is now ${newStatus ? 'active' : 'inactive'}`);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      triggerMessage('error', err.message || 'Failed to toggle status');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRate.country || !newRate.country_code || !newRate.currency) {
      triggerMessage('error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the API route /api/rates to create the new rate
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: newRate.country,
          country_code: newRate.country_code.toUpperCase(),
          currency: newRate.currency.toUpperCase(),
          buy_rate: parseFloat(newRate.buy_rate as any) || 0,
          sell_rate: parseFloat(newRate.sell_rate as any) || 0,
          margin: parseFloat(newRate.margin as any) || 0,
          is_active: newRate.is_active ?? true,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create country rate');
      }

      setRates([result.data, ...rates]);
      setIsAddModalOpen(false);
      setNewRate({
        country: '',
        country_code: '',
        currency: '',
        buy_rate: 0,
        sell_rate: 0,
        margin: 0,
        is_active: true,
      });
      triggerMessage('success', 'New country rate added successfully');
    } catch (err: any) {
      console.error('Error adding rate:', err);
      triggerMessage('error', err.message || 'Failed to add country rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Exchange Rates</CardTitle>
            <CardDescription>
              Manage buy and sell rates and transaction margins for operating countries.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Rate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px] select-none">
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Currency</th>
                  <th className="px-6 py-4">Buy Rate</th>
                  <th className="px-6 py-4">Sell Rate</th>
                  <th className="px-6 py-4">Margin (%)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                      No country rates found. Click "Add Rate" to get started.
                    </td>
                  </tr>
                ) : (
                  rates.map((rate) => {
                    const isEditing = editingId === rate.id;

                    return (
                      <tr key={rate.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {rate.country_code === 'MW' ? '🇲🇼' :
                               rate.country_code === 'KE' ? '🇰🇪' :
                               rate.country_code === 'NG' ? '🇳🇬' :
                               rate.country_code === 'GH' ? '🇬🇭' :
                               rate.country_code === 'ET' ? '🇪🇹' :
                               rate.country_code === 'MZ' ? '🇲🇿' :
                               rate.country_code === 'RW' ? '🇷🇼' :
                               rate.country_code === 'TZ' ? '🇹🇿' :
                               rate.country_code === 'UG' ? '🇺🇬' :
                               rate.country_code === 'ZM' ? '🇿🇲' :
                               rate.country_code === 'ZW' ? '🇿🇼' : '🌍'}
                            </span>
                            <div>
                              <p className="font-semibold">{rate.country}</p>
                              <p className="text-xs text-slate-400 font-medium">{rate.country_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">{rate.currency}</td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              className="w-28 h-9"
                              value={editedRate?.buy_rate ?? ''}
                              onChange={(e) => handleEditChange('buy_rate', e.target.value)}
                            />
                          ) : (
                            <span className="font-semibold font-mono">{(rate.buy_rate || 0).toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              className="w-28 h-9"
                              value={editedRate?.sell_rate ?? ''}
                              onChange={(e) => handleEditChange('sell_rate', e.target.value)}
                            />
                          ) : (
                            <span className="font-semibold font-mono">{(rate.sell_rate || 0).toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              className="w-24 h-9"
                              value={editedRate?.margin ?? ''}
                              onChange={(e) => handleEditChange('margin', e.target.value)}
                            />
                          ) : (
                            <span className="font-medium">{(rate.margin || 0).toFixed(2)}%</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`status-${rate.id}`}
                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                                checked={editedRate?.is_active ?? false}
                                onChange={(e) => handleEditChange('is_active', e.target.checked)}
                              />
                              <label htmlFor={`status-${rate.id}`} className="text-sm font-medium cursor-pointer select-none">
                                Active
                              </label>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleStatus(rate)}
                              className="focus:outline-none transition-transform active:scale-95"
                              title="Click to toggle status"
                            >
                              <Badge variant={rate.is_active ? 'success' : 'destructive'}>
                                {rate.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  loading={loading}
                                  onClick={() => saveRate(rate.id)}
                                  className="h-8 px-2.5 rounded-lg text-xs"
                                >
                                  <Save className="h-3.5 w-3.5 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="h-8 px-2.5 rounded-lg text-xs"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(rate)}
                                className="h-8 px-2.5 rounded-lg text-xs"
                              >
                                <Edit2 className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Rate Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <Globe className="h-5 w-5 text-indigo-600" />
            <span>Add New Country Rate</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit} loading={loading}>
              Add Rate
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Country Name"
              placeholder="e.g. Malawi"
              value={newRate.country}
              onChange={(e) => setNewRate({ ...newRate, country: e.target.value })}
              required
            />
            <Input
              label="Country Code"
              placeholder="e.g. MW"
              maxLength={3}
              value={newRate.country_code}
              onChange={(e) => setNewRate({ ...newRate, country_code: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Currency"
              placeholder="e.g. MWK"
              maxLength={5}
              value={newRate.currency}
              onChange={(e) => setNewRate({ ...newRate, currency: e.target.value })}
              required
            />
            <Input
              type="number"
              step="0.01"
              label="Buy Rate"
              placeholder="0.00"
              value={newRate.buy_rate || ''}
              onChange={(e) => setNewRate({ ...newRate, buy_rate: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              type="number"
              step="0.01"
              label="Sell Rate"
              placeholder="0.00"
              value={newRate.sell_rate || ''}
              onChange={(e) => setNewRate({ ...newRate, sell_rate: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              label="Margin (%)"
              placeholder="0.00"
              value={newRate.margin || ''}
              onChange={(e) => setNewRate({ ...newRate, margin: parseFloat(e.target.value) || 0 })}
            />
            <div className="flex flex-col justify-end pb-3">
              <label className="text-sm font-medium text-slate-700 mb-1.5">Initial Status</label>
              <div className="flex items-center gap-2 h-11">
                <input
                  type="checkbox"
                  id="new-rate-status"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                  checked={newRate.is_active ?? true}
                  onChange={(e) => setNewRate({ ...newRate, is_active: e.target.checked })}
                />
                <label htmlFor="new-rate-status" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                  Active immediately
                </label>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
