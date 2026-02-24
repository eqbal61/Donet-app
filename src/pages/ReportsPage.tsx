import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { Award } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Approved Donations
    const donationQ = query(collection(db, 'donations'), where('status', '==', 'approved'));
    const donationUnsub = onSnapshot(donationQ, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      donationUnsub();
    };
  }, []);

  // Process Top Donors
  const topDonors = [...donations]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  if (loading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Top Donors</h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Highest Contributors</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 rounded-r-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topDonors.map((donor, index) => (
                <tr key={donor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-400">#{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {donor.userName || 'Anonymous'}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {formatCurrency(donor.amount)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {donor.createdAt ? format(donor.createdAt.toDate(), 'MMM d, yyyy') : '-'}
                  </td>
                </tr>
              ))}
              {topDonors.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
