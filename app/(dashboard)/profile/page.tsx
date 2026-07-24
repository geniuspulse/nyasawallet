// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { COUNTRIES } from '@/lib/types';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('MW');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [kycStatus, setKycStatus] = useState('unverified');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhoneNumber(data.phone_number || '');
        setCountry(data.country || 'MW');
        setCity(data.city || '');
        setAddress(data.address || '');
        setKycStatus(data.kyc_status || 'unverified');
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone_number: phoneNumber,
        country,
        city,
        address,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" /></div>;
  }

  const kycVariant = kycStatus === 'verified' ? 'success' : kycStatus === 'pending' ? 'pending' : kycStatus === 'rejected' ? 'danger' : 'neutral';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and personal information</p>
      </div>

      {/* KYC Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-brand-600" /> Identity Verification</CardTitle>
          <CardDescription>Verify your identity to unlock all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={kycVariant as any}>{kycStatus.toUpperCase()}</Badge>
              {kycStatus === 'unverified' && <p className="text-sm text-slate-500 mt-2">Submit your ID to get verified and increase your limits.</p>}
              {kycStatus === 'pending' && <p className="text-sm text-slate-500 mt-2">Your documents are under review. This usually takes 1-2 business days.</p>}
              {kycStatus === 'verified' && <p className="text-sm text-green-600 mt-2">Your identity has been verified. You have full access to all features.</p>}
            </div>
            {kycStatus === 'unverified' && (
              <Button onClick={() => router.push('/support')} variant="outline">Verify Now</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
              <Input value={fullName} onChange={(e: any) => setFullName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number</label>
              <Input value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="+265 999 999 999" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              >
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">City</label>
              <Input value={city} onChange={(e: any) => setCity(e.target.value)} placeholder="Lilongwe" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Address</label>
            <Input value={address} onChange={(e: any) => setAddress(e.target.value)} placeholder="Your street address" />
          </div>
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {profile?.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Mail className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-700">{profile.email}</span>
            </div>
          )}
          <Button onClick={handleLogout} variant="danger" className="w-full">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
