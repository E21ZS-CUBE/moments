import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Clock, 
  Image, 
  Lock, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import type { Page } from '@/types';
import { MusicWidget } from './MusicWidget';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'timeline', label: 'Moments', icon: Clock },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'secret-letter', label: 'Letters', icon: Lock },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto pt-4">
          <motion.div
            className={`
              relative rounded-2xl px-4 py-3
              transition-all duration-500
              ${isScrolled 
                ? 'bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-500/5' 
                : 'bg-white/5 backdrop-blur-xl border border-white/5'
              }
            `}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
            
            <div className="relative flex items-center justify-between">
              {/* Logo */}
              <motion.button
                onClick={() => onPageChange('home')}
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="
                  w-8 h-8 rounded-xl
                  bg-gradient-to-br from-purple-500/20 to-pink-500/20
                  border border-white/10
                  flex items-center justify-center
                  group-hover:from-purple-500/30 group-hover:to-pink-500/30
                  transition-all duration-300
                ">
                  <Heart className="w-4 h-4 text-purple-300" />
                </div>
                <span className="font-serif text-lg font-medium text-white hidden sm:block">
                  Our Moments
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className={`
                        relative px-4 py-2 rounded-xl
                        flex items-center gap-2
                        text-sm font-medium
                        transition-all duration-300
                        ${isActive 
                          ? 'text-white' 
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 bg-white/10 rounded-xl"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Glow effect for active */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-glow"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <Icon className={`
                        w-4 h-4 relative z-10
                        ${isActive ? 'text-purple-300' : ''}
                      `} />
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Right side - Music + Mobile menu */}
              <div className="flex items-center gap-3">
                {/* Music Widget */}
                <MusicWidget />

                {/* Mobile menu button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    md:hidden
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    bg-white/5 hover:bg-white/10
                    border border-white/10 hover:border-white/20
                    transition-all duration-300
                  "
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5 text-white/70" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5 text-white/70" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="
                  md:hidden mt-2
                  bg-slate-900/90 backdrop-blur-2xl
                  border border-white/10
                  rounded-2xl
                  overflow-hidden
                  shadow-2xl shadow-purple-500/10
                "
              >
                <div className="p-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        className={`
                          w-full px-4 py-3 rounded-xl
                          flex items-center gap-3
                          text-left
                          transition-all duration-300
                          ${isActive 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg
                          flex items-center justify-center
                          ${isActive ? 'bg-purple-500/20' : 'bg-white/5'}
                        `}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : ''}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="mobile-indicator"
                            className="ml-auto w-2 h-2 rounded-full bg-purple-400"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed nav */}
      <div className="h-24" />
    </>
  );
}
