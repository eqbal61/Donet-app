import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { Calendar, CheckCircle2, Clock, XCircle, Search, Filter, ArrowUpRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'donations'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDonations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort client-side to avoid composite index requirement
      fetchedDonations.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toMillis() || 0;
        const dateB = b.createdAt?.toMillis() || 0;
        return dateB - dateA;
      });

      setDonations(fetchedDonations);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donation.amount.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalDonated = donations
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Please Login</h2>
      <p className="text-gray-500 mt-2">You need to be logged in to view your donation history.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif mb-2">Donation History</h1>
          <p className="text-emerald-100">Track all your contributions to the masjid.</p>
          
          <div className="mt-8 flex items-end gap-2">
            <div>
              <p className="text-sm text-emerald-200 uppercase tracking-wider font-medium">Total Contributed</p>
              <p className="text-4xl font-bold mt-1">{formatCurrency(totalDonated)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by TRX ID or Amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Donation History</h3>
            <p className="text-gray-500 mt-1">You haven't made any donations yet.</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full shrink-0 ${
                    donation.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                    donation.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {donation.status === 'approved' ? <CheckCircle2 className="w-6 h-6" /> :
                     donation.status === 'rejected' ? <XCircle className="w-6 h-6" /> :
                     <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{formatCurrency(donation.amount)}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        donation.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        donation.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="capitalize font-medium text-gray-700">{donation.method}</span>
                      <span>•</span>
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{donation.trxId}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {donation.createdAt ? format(donation.createdAt.toDate(), 'PPP p') : 'Date unavailable'}
                    </p>
                  </div>
                </div>

                {donation.screenshotUrl && (
                  <a 
                    href={donation.screenshotUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-600 font-medium hover:text-emerald-700 hover:underline sm:self-center"
                  >
                    View Receipt <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
