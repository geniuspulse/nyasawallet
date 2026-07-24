// @ts-nocheck
'use client';

import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import {
  Check,
  X,
  FileText,
  AlertCircle,
  Eye,
  ArrowRight,
  User,
  Shield,
  CreditCard,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

interface KycManagerProps {
  initialSubmissions: any[];
}

export function KycManager({ initialSubmissions }: KycManagerProps) {
  const [submissions, setSubmissions] = useState<any[]>(initialSubmissions);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const handleReview = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/kyc/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejection_reason: reason || null }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to review submission');
      }

      const updatedSub = await response.json();

      // Update state
      setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status, rejection_reason: reason || null } : sub)));
      setIsViewModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedKyc(null);
      setRejectionReason('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while reviewing the document.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (sub: any) => {
    setSelectedKyc(sub);
    setIsViewModalOpen(true);
  };

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filtering Tab */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              'pb-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors',
              filter === tab
                ? 'border-brand-600 text-brand-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab} Queue ({submissions.filter((s) => tab === 'all' || s.status === tab).length})
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-100 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Submissions */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl dark:border-gray-800 dark:bg-gray-950">
          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium capitalize">
            No {filter} KYC submissions found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-50">
                      {sub.profiles?.full_name || 'Anonymous User'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub.profiles?.email}</p>
                  </div>
                  <Badge variant={sub.status === 'approved' ? 'success' : sub.status === 'pending' ? 'warning' : 'destructive'}>
                    {sub.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {sub.document_type || 'ID Card'} (No. {sub.document_number || 'N/A'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>Country: {sub.country || 'N/A'}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2">
                    Submitted: {formatDate(sub.submitted_at || sub.created_at)}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <Button size="sm" variant="outline" className="gap-2" onClick={() => openViewModal(sub)}>
                  <span>Review Docs</span>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KYC Viewer Modal */}
      {selectedKyc && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Review KYC Documents"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* User details */}
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">User Name</p>
                <p className="mt-0.5">{selectedKyc.profiles?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">Document Number</p>
                <p className="mt-0.5">{selectedKyc.document_number || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">Document Type</p>
                <p className="mt-0.5 capitalize">{selectedKyc.document_type || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">Country</p>
                <p className="mt-0.5">{selectedKyc.country || 'N/A'}</p>
              </div>
            </div>

            {/* KYC Documents Display Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Uploaded Documents</h4>

              <div className="grid grid-cols-2 gap-4">
                {/* Front */}
                <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                  <p className="text-[10px] font-semibold text-gray-500 mb-1 text-center">ID Front</p>
                  <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden border">
                    {selectedKyc.document_front_url ? (
                      <img
                        src={selectedKyc.document_front_url}
                        alt="ID Front"
                        className="object-cover w-full h-full hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open(selectedKyc.document_front_url, '_blank')}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Back */}
                <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                  <p className="text-[10px] font-semibold text-gray-500 mb-1 text-center">ID Back</p>
                  <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden border">
                    {selectedKyc.document_back_url ? (
                      <img
                        src={selectedKyc.document_back_url}
                        alt="ID Back"
                        className="object-cover w-full h-full hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open(selectedKyc.document_back_url, '_blank')}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Selfie */}
                <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                  <p className="text-[10px] font-semibold text-gray-500 mb-1 text-center">Selfie</p>
                  <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden border">
                    {selectedKyc.selfie_url ? (
                      <img
                        src={selectedKyc.selfie_url}
                        alt="Selfie"
                        className="object-cover w-full h-full hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open(selectedKyc.selfie_url, '_blank')}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                  <p className="text-[10px] font-semibold text-gray-500 mb-1 text-center">Proof of Address</p>
                  <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden border">
                    {selectedKyc.proof_of_address_url ? (
                      <img
                        src={selectedKyc.proof_of_address_url}
                        alt="Proof of Address"
                        className="object-cover w-full h-full hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open(selectedKyc.proof_of_address_url, '_blank')}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedKyc.status === 'rejected' && selectedKyc.rejection_reason && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                <p className="font-bold">Rejection Reason:</p>
                <p className="mt-1">{selectedKyc.rejection_reason}</p>
              </div>
            )}

            {/* Approval / Rejection Controls */}
            {selectedKyc.status === 'pending' && (
              <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                  onClick={() => handleReview(selectedKyc.id, 'approved')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve KYC
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  disabled={isSubmitting}
                  onClick={openRejectModal}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject KYC
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* KYC Rejection Reason Modal */}
      {selectedKyc && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title="Reject KYC Submission"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="ID front is blurry, document expired, name mismatch etc..."
                className="mt-1.5 flex min-h-[100px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectionReason.trim() || isSubmitting}
                onClick={() => handleReview(selectedKyc.id, 'rejected', rejectionReason)}
              >
                Submit Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
