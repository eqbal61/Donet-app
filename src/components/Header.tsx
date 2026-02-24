import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Moon, Sun, Globe, Bell, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Header() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notices, setNotices] = useState<string[]>([
    "📢 Upcoming Jummah Prayer at 1:30 PM",
    "🌙 Ramadan Preparation Meeting on Friday",
    "🏗️ Construction Fund needs your support"
  ]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "header_notice"), (doc) => {
      if (doc.exists() && doc.data().notices) {
        setNotices(doc.data().notices);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-2 z-50 mx-4 mt-2">
      {/* Top Bar - Scrolling Notice */}
      <div className="bg-emerald-900 text-white text-sm py-2 overflow-hidden relative rounded-t-2xl shadow-lg border-b border-emerald-800">
        <div className="whitespace-nowrap animate-marquee flex items-center">
          {notices.map((notice, index) => (
            <span key={index} className="mx-4">{notice}</span>
          ))}
          {/* Duplicate for seamless loop */}
          {notices.map((notice, index) => (
            <span key={`dup-${index}`} className="mx-4">{notice}</span>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-white/20 rounded-b-2xl px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            {/* Back Button (Mobile/Tablet) */}
            {!isHome && (
              <button 
                onClick={() => navigate(-1)}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-2xl">🕌</span>
                </div>
              </div>
              <div className={`${!isHome ? 'hidden sm:block' : ''}`}>
                <h1 className="text-xl font-bold text-emerald-950 leading-none font-serif tracking-tight">Uttar Bankra Jame Masjid</h1>
                <p className="text-xs text-emerald-600 font-medium tracking-wide mt-0.5">উত্তর বাঁকড়া জামে মসজিদ</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-emerald-600 transition-colors">About</Link>
              <Link to="/events" className="hover:text-emerald-600 transition-colors">Events</Link>
              <Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50">
                <Globe className="w-5 h-5" />
              </button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-700">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:block">{userData?.displayName || user.email?.split('@')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full transition-colors shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              )}

              <Link 
                to="/donate"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-emerald-900 text-sm font-bold rounded-full transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>💰</span> Donate
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {!isHome && (
               <Link 
                to="/donate"
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 text-xs font-bold rounded-full shadow-lg shadow-amber-200/50 hover:shadow-xl hover:scale-105 transition-all"
                onClick={closeMenu}
              >
                Donate
              </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <nav className="flex flex-col gap-3">
                <Link to="/" onClick={closeMenu} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Home</Link>
                <Link to="/about" onClick={closeMenu} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">About</Link>
                <Link to="/events" onClick={closeMenu} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Events</Link>
                <Link to="/contact" onClick={closeMenu} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Contact</Link>
              </nav>
              <div className="border-t border-gray-100 pt-4">
                {user ? (
                  <>
                    <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">My Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="block w-full text-center py-2 bg-emerald-600 text-white rounded-lg font-medium">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
