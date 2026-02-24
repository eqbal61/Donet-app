import React, { useState, useRef } from 'react';
import ImageKit from 'imagekit-javascript';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { Loader2, Upload, CheckCircle2, AlertCircle, ArrowLeft, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ik = new ImageKit({
  publicKey: "public_X4QQ16hZWc+4UxA9VoKHSDQnVWQ=",
  urlEndpoint: "https://ik.imagekit.io/10minuteservicealpha",
});

export default function DonationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: "01700000000 (Personal)",
    nagad: "01800000000 (Merchant)",
    rocket: "01900000000 (Personal)"
  });

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "payment_info"), (doc) => {
      if (doc.exists()) {
        setPaymentNumbers(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumbers[method].split(' ')[0]);
    toast.success("Number copied!");
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setLoadingText('Starting process...');
    const file = fileInputRef.current?.files?.[0];
    let screenshotUrl = '';

    try {
      // 1. Upload Screenshot to ImageKit if exists
      if (file) {
        setLoadingText('Uploading screenshot...');
        setUploadProgress(10);
        
        // Fetch auth params from backend
        let authData;
        try {
          const authResponse = await fetch('/api/auth');
          if (!authResponse.ok) {
            throw new Error(`Auth endpoint failed: ${authResponse.statusText}`);
          }
          authData = await authResponse.json();
          setUploadProgress(30);
        } catch (authError) {
          console.error("Auth fetch error:", authError);
          throw new Error("Failed to authenticate upload. Check server logs.");
        }
        
        await new Promise((resolve, reject) => {
          ik.upload({
            file: file,
            fileName: `donation_${Date.now()}_${file.name}`,
            tags: ["donation", "screenshot"],
            token: authData.token,
            signature: authData.signature,
            expire: authData.expire
          }, (err, result) => {
            if (err) {
              console.error("ImageKit Upload Error:", err);
              // Check for common CORS or Auth errors
              if (err.message && err.message.includes("Network Error")) {
                reject(new Error("Network Error: Check ImageKit CORS settings."));
              } else {
                reject(err);
              }
            } else {
              setUploadProgress(80);
              screenshotUrl = result?.url || '';
              resolve(result);
            }
          });
        });
      } else {
        setUploadProgress(50);
      }

      // 2. Save to Firestore
      setLoadingText('Saving donation details...');
      setUploadProgress(90);
      await addDoc(collection(db, 'donations'), {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Anonymous',
        amount: parseFloat(amount),
        method,
        trxId,
        screenshotUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setUploadProgress(100);

      setIsSuccess(true);
      setAmount('');
      setTrxId('');
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error("Failed to submit donation: " + error.message);
    } finally {
      setLoading(false);
      setLoadingText('');
      setUploadProgress(0);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden max-w-lg mx-auto p-8 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ধন্যবাদ!</h2>
        <p className="text-gray-600 mb-8">
          আপনার দান সফলভাবে গৃহীত হয়েছে। আল্লাহ আপনার দান কবুল করুন।
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => setIsSuccess(false)}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Donate Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-emerald-50 overflow-hidden max-w-lg mx-auto"
    >
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Make a Donation</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Support Uttar Bankra Jame Masjid</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDonate} className="p-6 space-y-6">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-3 gap-3">
          {['bkash', 'nagad', 'rocket'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m as any)}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                method === m 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                  : 'border-gray-100 hover:border-emerald-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="capitalize font-bold text-sm">{m}</span>
              {method === m && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Payment Info */}
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center relative group shadow-sm">
          <p className="text-xs text-emerald-600 uppercase tracking-widest font-bold mb-2">
            {method} Personal Number
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-mono font-bold text-gray-800 tracking-tight">
              {paymentNumbers[method].split(' ')[0]}
            </p>
            <button 
              type="button"
              onClick={handleCopyNumber}
              className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-all active:scale-95"
              title="Copy Number"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">
            * Send money to this number via {method}
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (BDT)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-bold text-lg text-gray-800 placeholder:font-normal"
              placeholder="500"
              required
            />
          </div>
        </div>

        {/* TRX ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
          <input
            type="text"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all uppercase font-mono placeholder:normal-case"
            placeholder="e.g. 8JHS72K9"
            required
          />
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot (Optional)</label>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100
                cursor-pointer border border-gray-200 rounded-xl bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold rounded-xl shadow-lg shadow-amber-200/50 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden transform active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex flex-col items-center w-full relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">{loadingText} ({uploadProgress}%)</span>
              </div>
              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden max-w-[200px]">
                <div 
                  className="h-full bg-emerald-800 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : 'Confirm Donation'}
        </button>
      </form>
    </motion.div>
  );
}
