import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Check, X, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../lib/utils';

export default function AdminPage() {
  const { userData } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: "",
    nagad: "",
    rocket: ""
  });
  const [notices, setNotices] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (userData?.role !== 'admin' && userData?.role !== 'president' && userData?.role !== 'treasurer') return;

    const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "payment_info"), (doc) => {
      if (doc.exists()) {
        setPaymentNumbers(doc.data() as any);
      } else {
        // Set defaults if document doesn't exist
        setPaymentNumbers({
          bkash: "01700000000 (Personal)",
          nagad: "01800000000 (Merchant)",
          rocket: "01900000000 (Personal)"
        });
      }
    });

    const unsubscribeNotices = onSnapshot(doc(db, "settings", "header_notice"), (doc) => {
      if (doc.exists() && doc.data().notices) {
        setNotices(doc.data().notices.join('\n'));
      } else {
        setNotices("📢 Upcoming Jummah Prayer at 1:30 PM\n🌙 Ramadan Preparation Meeting on Friday\n🏗️ Construction Fund needs your support");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeSettings();
      unsubscribeNotices();
    };
  }, [userData]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'donations', id), { status });
      toast.success(`Donation ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await setDoc(doc(db, "settings", "payment_info"), paymentNumbers);
      
      // Save notices as array
      const noticesArray = notices.split('\n').filter(n => n.trim() !== '');
      await setDoc(doc(db, "settings", "header_notice"), { notices: noticesArray });

      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (userData?.role !== 'admin' && userData?.role !== 'president' && userData?.role !== 'treasurer') {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      
      {/* Payment Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Payment Numbers Settings</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSaveSettings} className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bkash Number</label>
              <input
                type="text"
                value={paymentNumbers.bkash}
                onChange={(e) => setPaymentNumbers({...paymentNumbers, bkash: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="017... (Personal)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nagad Number</label>
              <input
                type="text"
                value={paymentNumbers.nagad}
                onChange={(e) => setPaymentNumbers({...paymentNumbers, nagad: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="018... (Merchant)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rocket Number</label>
              <input
                type="text"
                value={paymentNumbers.rocket}
                onChange={(e) => setPaymentNumbers({...paymentNumbers, rocket: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="019... (Personal)"
              />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Scrolling Notices (One per line)</label>
              <textarea
                value={notices}
                onChange={(e) => setNotices(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                placeholder="Enter notices here..."
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Donation Requests Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Donation Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">TRX ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{donation.userName}</td>
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
                  <td className="px-6 py-4 flex gap-2">
                    {donation.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(donation.id, 'approved')}
                          className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(donation.id, 'rejected')}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
