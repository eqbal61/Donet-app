import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DashboardGrid from '../components/DashboardGrid';
import LiveStats from '../components/LiveStats';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-amber-100"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 h-32 relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 border-2 border-amber-200">
                 <span className="text-4xl">🕌</span>
               </div>
            </div>
            
            <div className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-emerald-900 font-serif">স্বাগতম!</h2>
              <div className="space-y-2 text-gray-600 leading-relaxed">
                <p>আপনার মসজিদে সংযোগ, দান এবং পরিচালনার জন্য প্রস্তুত হোন।</p>
                <p className="font-medium text-emerald-700">আল্লাহ আপনার কাজ সহজ করুন।</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-200 mt-4"
              >
                প্রবেশ করুন
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WelcomePopup />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Grid - Moved to Top */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 px-4">Services</h3>
          <DashboardGrid />
        </div>

        {/* Live Stats - Moved to Bottom */}
        <LiveStats />
      </main>
    </div>
  );
}
