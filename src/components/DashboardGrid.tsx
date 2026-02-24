import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, History, TrendingUp, Calendar, 
  Megaphone, User, Building, Hammer, HandHeart, BookOpen, 
  FileSpreadsheet, Globe, Smartphone, Settings 
} from 'lucide-react';
import { motion } from 'motion/react';

const menuItems = [
  { id: 1, title: 'Donate', icon: CreditCard, color: 'bg-amber-100 text-amber-600', link: '/donate' },
  { id: 2, title: 'History', icon: History, color: 'bg-blue-100 text-blue-600', link: '/history' },
  { id: 3, title: 'Reports', icon: TrendingUp, color: 'bg-green-100 text-green-600', link: '/reports' },
  { id: 6, title: 'Events', icon: Calendar, color: 'bg-indigo-100 text-indigo-600', link: '/events' },
  { id: 7, title: 'Notices', icon: Megaphone, color: 'bg-orange-100 text-orange-600', link: '/notices' },
  { id: 8, title: 'Profile', icon: User, color: 'bg-teal-100 text-teal-600', link: '/profile' },
  { id: 9, title: 'Zakat Fund', icon: Building, color: 'bg-emerald-100 text-emerald-600', link: '/zakat' },
  { id: 10, title: 'Construction', icon: Hammer, color: 'bg-stone-100 text-stone-600', link: '/construction' },
  { id: 11, title: 'Volunteer', icon: HandHeart, color: 'bg-rose-100 text-rose-600', link: '/volunteer' },
  { id: 12, title: 'Quran Class', icon: BookOpen, color: 'bg-cyan-100 text-cyan-600', link: '/classes' },
  { id: 13, title: 'Audit', icon: FileSpreadsheet, color: 'bg-gray-100 text-gray-600', link: '/audit' },
  { id: 14, title: 'Multi Mosque', icon: Globe, color: 'bg-sky-100 text-sky-600', link: '/mosques' },
  { id: 15, title: 'Mobile App', icon: Smartphone, color: 'bg-pink-100 text-pink-600', link: '/app' },
  { id: 16, title: 'Settings', icon: Settings, color: 'bg-slate-100 text-slate-600', link: '/settings' },
];

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 p-4">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <Link 
            to={item.link}
            className="relative flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-50/50 hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all group h-full overflow-hidden"
          >
            {/* Decorative background blob */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${item.color.split(' ')[0]}`}></div>
            
            <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${item.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-8 h-8" />
            </div>
            <span className="relative z-10 text-sm font-bold text-gray-700 text-center group-hover:text-emerald-800 transition-colors">
              {item.title}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
