import React from 'react';
import { Megaphone, Calendar } from 'lucide-react';

export default function NoticesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-amber-500" />
        Notices & Announcements
      </h2>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase">Important</span>
                  <span className="text-sm text-gray-500">Oct {10 + i}, 2023</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Upcoming Jummah Prayer Schedule Change</h3>
                <p className="text-gray-600">
                  Assalamu Alaikum, please be informed that the Jummah prayer time will be shifted to 1:30 PM starting from next Friday due to the winter schedule.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
