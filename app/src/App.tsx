import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Page } from '@/types';
import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { HomePage } from '@/pages/HomePage';
import { TimelinePage } from '@/pages/TimelinePage';
import { GalleryPage } from '@/pages/GalleryPage';
import { SecretLetterPage } from '@/pages/SecretLetterPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage key="home" />;
      case 'timeline':
        return <TimelinePage key="timeline" />;
      case 'gallery':
        return <GalleryPage key="gallery" />;
      case 'secret-letter':
        return <SecretLetterPage key="secret-letter" />;
      default:
        return <HomePage key="home" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
