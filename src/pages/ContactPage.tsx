import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Globe, Code2, Smartphone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* General Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">যোগাযোগ করুন</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ঠিকানা</h3>
                <p className="text-gray-600">উত্তর বাঁকড়া, চারঘাট, রাজশাহী</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ফোন</h3>
                <p className="text-gray-600">+8801772219156</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ইমেইল</h3>
                <p className="text-gray-600">info@uttarbankramasjid.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Support */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Code2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold">প্রযুক্তি সহায়তা</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-3">ওয়েব ডেভেলপমেন্ট ও ডিজিটাল ম্যানেজমেন্ট</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                      EH
                    </div>
                    <div>
                      <p className="font-bold text-white">Md. Eqbal Hossain</p>
                      <a href="tel:01788331665" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors">01788331665</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                      OU
                    </div>
                    <div>
                      <p className="font-bold text-white">মোঃ ওলি উল্লাহ</p>
                      <a href="tel:01772219156" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors">01772219156</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  এই অ্যাপটি উত্তর বাঁকড়া জামে মসজিদের সেবায় নিবেদিত
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
