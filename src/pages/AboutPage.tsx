import React from 'react';
import { motion } from 'motion/react';
import { Info, History, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden"
      >
        <div className="bg-emerald-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Info className="w-8 h-8 text-emerald-100" />
            </div>
            <h1 className="text-3xl font-bold font-serif mb-4">আমাদের সম্পর্কে</h1>
            <p className="text-emerald-100 text-lg">উত্তর বাঁকড়া জামে মসজিদ - একটি ঐতিহ্যবাহী ইসলামিক প্রতিষ্ঠান</p>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <History className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">আমাদের ইতিহাস</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              উত্তর বাঁকড়া জামে মসজিদ গত দুই দশক ধরে এলাকার মুসলিম সম্প্রদায়ের ধর্মীয় ও সামাজিক কেন্দ্রবিন্দু হিসেবে কাজ করে আসছে। মসজিদটি শুধু নামাজের স্থানই নয়, বরং এলাকার শিক্ষা, সংস্কৃতি ও সামাজিক উন্নয়নের অন্যতম প্রধান ভূমিকা পালন করছে।
            </p>
          </section>

          <section className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">আমাদের লক্ষ্য</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                সঠিক ইসলামী শিক্ষা প্রচার ও প্রসার
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                সামাজিক বন্ধন সুদৃঢ় করা
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                দুস্থ ও অসহায় মানুষের পাশে দাঁড়ানো
              </li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
