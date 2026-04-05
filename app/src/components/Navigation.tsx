import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Clock,
  Image,
  Lock,
  Menu,
  X,
  User
} from 'lucide-react';
import type { Page } from '@/types';
import { MusicWidget } from './MusicWidget';
import { useAuth } from '@/context/AuthContext';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: any }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'timeline', label: 'Moments', icon: Clock },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'secret-letter', label: 'Letters', icon: Lock },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4"
      >
        <div className="max-w-7xl mx-auto pt-4">
          <div
            className={`
              flex items-center justify-between
              px-4 py-3 rounded-2xl
              transition-all duration-300
              ${
                isScrolled
                  ? 'bg-slate-900/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white/5 backdrop-blur-md border border-white/5'
              }
            `}
          >
            {/* LEFT: LOGO */}
            <button
              onClick={() => onPageChange('home')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-purple-300" />
              </div>
              <span className="text-white font-medium hidden sm:block">
                Our Moments
              </span>
            </button>

            {/* CENTER: NAV */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition
                      ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

              {/* MUSIC */}
              <MusicWidget />

              {/* PROFILE */}
              <div className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-purple-500/30 flex items-center justify-center text-white cursor-pointer"
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-52 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-lg"
                    >
                      <p className="text-white text-sm font-medium">
                        {user?.username}
                      </p>

                      <p className="text-white/40 text-xs mb-3">
                        {user?._id}
                      </p>

                      <button
                        onClick={logout}
                        className="w-full text-left text-red-400 hover:text-red-300 text-sm"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MOBILE MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE NAV */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <div className="h-24" />
    </>
  );
}
