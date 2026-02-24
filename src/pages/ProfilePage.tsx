import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, userData } = useAuth();
  const [myDonations, setMyDonations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'donations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please login to view profile</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-emerald-900 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-3xl font-bold">
                {userData?.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData?.displayName || 'User'}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">
                  {userData?.role || 'Member'}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>+880 1700 000000</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">My Donation History</h3>
          <span className="text-sm text-gray-500">Total: {myDonations.length}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">TRX ID</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myDonations.length > 0 ? myDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">
                    {donation.createdAt ? format(donation.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">{formatCurrency(donation.amount)}</td>
                  <td className="px-6 py-4 capitalize">{donation.method}</td>
                  <td className="px-6 py-4 font-mono text-xs">{donation.trxId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      donation.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No donations found. <a href="/donate" className="text-emerald-600 hover:underline">Make your first donation</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
