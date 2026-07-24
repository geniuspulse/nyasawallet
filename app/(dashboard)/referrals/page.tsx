// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Profile, Referral } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Gift, Users, Trophy, Wallet, Link as LinkIcon, Share2, Rocket } from 'lucide-react';
import CopyButton from './CopyButton';

export default async function ReferralsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile to get referral code
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  const profile = profileData as Profile;

  // Generate referral code if missing
  if (profile && !profile.referral_code) {
    const code = `NYASA-${user.id.slice(0, 4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    await supabase.from('profiles').update({ referral_code: code }).eq('user_id', user.id);
    profile.referral_code = code;
  }

  // Fetch referral stats
  const { data: referralsData } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id);
  const referrals = (referralsData || []) as Referral[];

  // Fetch referred profiles (signups who used this code)
  const { data: signupsData } = await supabase
    .from('profiles')
    .select('full_name, email, created_at, status')
    .eq('referred_by', profile?.referral_code);
  const signups = (signupsData || []) as any[];

  // Calculate stats
  const totalReferred = signups.length;
  const completed = referrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length;
  const totalEarned = referrals.reduce((sum, r) => sum + Number(r.bonus || 0), 0);

  const referralLink = `https://nyasawallet.com/sign-up?ref=${profile?.referral_code || ''}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Invite & Earn"
        subtitle="Invite your friends to Nyasawallet and earn USDT rewards for every completed registration and first deposit."
      />

      {/* Referral Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Referred"
          value={totalReferred}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          className="border-b-4 border-b-indigo-600"
        />
        <StatCard
          label="Completed"
          value={completed}
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          className="border-b-4 border-b-amber-500"
        />
        <StatCard
          label="Total Rewards Earned"
          value={formatCurrency(totalEarned, 'USDT')}
          icon={<Wallet className="h-5 w-5 text-green-500" />}
          trend={{ value: 'Bonus Active', isPositive: true }}
          className="border-b-4 border-b-green-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Referral Program Info */}
        <div className="space-y-6">
          <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <Gift className="h-5 w-5" />
                <CardTitle className="text-lg font-bold">Share Your Referral Link</CardTitle>
              </div>
              <CardDescription className="text-indigo-600 font-medium">
                Copy your unique link and share it on WhatsApp, Telegram, or Facebook.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Your Referral Link
                </label>
                <CopyButton text={referralLink} />
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-amber-500" />
                  How it works:
                </h4>
                <div className="space-y-4 ml-1">
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">1</div>
                    <div className="text-xs text-slate-500 font-medium">
                      <p className="text-slate-800 font-bold mb-0.5">Invite your network</p>
                      Share your link and get friends to sign up.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">2</div>
                    <div className="text-xs text-slate-500 font-medium">
                      <p className="text-slate-800 font-bold mb-0.5">They make a deposit</p>
                      Once they deposit $10 or more, you both get a reward.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">3</div>
                    <div className="text-xs text-slate-500 font-medium">
                      <p className="text-slate-800 font-bold mb-0.5">Unlock USDT Bonus</p>
                      The bonus is automatically added to your wallet!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referred Signups Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-space select-none flex items-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-500" />
              Referred Signups
            </h3>
            <Badge className="bg-slate-100 text-slate-500 border-none font-bold">
              {signups.length} Total
            </Badge>
          </div>

          {signups.length > 0 ? (
            <div className="grid gap-3">
              {signups.map((signup, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-white border border-slate-100 rounded-full flex items-center justify-center text-indigo-500 font-bold text-sm shrink-0">
                      {signup.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {signup.full_name || 'New User'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{signup.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <p className="text-[10px] text-slate-400 font-medium">{formatDate(signup.created_at)}</p>
                    <Badge variant={signup.status === 'active' ? 'success' : 'secondary'} className="text-[9px] font-black uppercase tracking-widest py-0 px-2">
                      {signup.status === 'active' ? 'Joined' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={LinkIcon}
              title="No referrals yet"
              description="Start sharing your link to invite your friends and earn rewards together."
              className="py-12"
            />
          )}
        </div>
      </div>
    </div>
  );
}
