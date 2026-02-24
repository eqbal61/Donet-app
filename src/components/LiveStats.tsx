import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { Users, TrendingUp, Target, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

export default function LiveStats() {
  const [totalDonation, setTotalDonation] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [recentDonors, setRecentDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for graph
  const data = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
    { name: 'Jul', amount: 3490 },
  ];

  useEffect(() => {
    // Real-time listener for approved donations
    const q = query(
      collection(db, 'donations'), 
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      const donors = new Set();
      
      // Sort docs client-side to avoid composite index requirement
      const sortedDocs = snapshot.docs.sort((a, b) => {
        const dateA = a.data().createdAt?.toMillis() || 0;
        const dateB = b.data().createdAt?.toMillis() || 0;
        return dateB - dateA;
      });

      const recent: any[] = [];

      sortedDocs.forEach(doc => {
        const data = doc.data();
        total += data.amount;
        donors.add(data.userId);
        if (recent.length < 5) recent.push({ id: doc.id, ...data });
      });

      setTotalDonation(total);
      setDonorCount(donors.size);
      setRecentDonors(recent);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching stats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 h-32">
              <div className="flex items-center gap-4 h-full">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80"></div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80"></div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donation</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalDonation)}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <h3 className="text-2xl font-bold text-gray-900">{donorCount}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Target</p>
              <h3 className="text-2xl font-bold text-gray-900">75%</h3>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Donation Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  cursor={{fill: '#f0fdf4'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Donors */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Donors</h3>
          <div className="space-y-4">
            {recentDonors.length > 0 ? recentDonors.map((donor) => (
              <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                    {donor.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donor.userName}</p>
                    <p className="text-xs text-gray-500">{donor.method}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600">{formatCurrency(donor.amount)}</span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No recent donations</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
