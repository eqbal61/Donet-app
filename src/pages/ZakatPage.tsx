import React from 'react';
import { Building, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ZakatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-emerald-200" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Uttar Bankra Zakat Fund</h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            "Establish prayer and give Zakat, and whatever good you put forward for yourselves - you will find it with Allah." (Quran 2:110)
          </p>
          <div className="pt-4">
            <Link 
              to="/donate" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Pay Zakat Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            Where your Zakat goes
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
              Supporting orphans and widows in our community
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
              Providing scholarships for underprivileged students
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
              Emergency medical assistance for the poor
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
              Debt relief for those in desperate need
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">Zakat Calculator</h3>
          <p className="text-emerald-700 mb-6 text-sm">
            Zakat is 2.5% of your total wealth held for a lunar year.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-1">Total Savings & Gold (BDT)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 500000"
              />
            </div>
            <div className="pt-2">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-emerald-200">
                <span className="font-medium text-emerald-900">Your Zakat:</span>
                <span className="text-xl font-bold text-emerald-600">৳ 0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
