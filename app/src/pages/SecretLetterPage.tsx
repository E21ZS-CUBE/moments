import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { lettersAPI, type LetterVerified } from '@/services/api';

export function SecretLetterPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [letter, setLetter] = useState<LetterVerified | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch letter info on mount
  const fetchLetterInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setPageError(null);
      // Just check if letter exists
      await lettersAPI.getPublic();
      setIsLoading(false);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to load letter');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetterInfo();
  }, [fetchLetterInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(false);
      setErrorMessage('');
      const verifiedLetter = await lettersAPI.verify(password);
      setLetter(verifiedLetter);
      setIsAuthenticated(true);
    } catch (err) {
      setError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Incorrect password');
      setTimeout(() => setError(false), 500);
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (isAuthenticated && letter && displayedText.length < letter.content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(letter.content.slice(0, displayedText.length + 1));
      }, 40 + Math.random() * 30);
      
      typingRef.current = timeout;
      
      return () => {
        if (typingRef.current) {
          clearTimeout(typingRef.current);
        }
      };
    } else if (isAuthenticated && letter && displayedText.length === letter.content.length) {
      setIsTypingComplete(true);
    }
  }, [isAuthenticated, displayedText, letter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, []);

  // Error state
  if (pageError && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen px-4 py-8 md:py-12 flex items-center justify-center"
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Failed to load letter</h3>
          <p className="text-white/50 mb-4">{pageError}</p>
          <button
            onClick={fetchLetterInfo}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 md:py-12 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Lock Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto rounded-full glass flex items-center justify-center">
                  <Lock className="w-10 h-10 text-purple-400" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-serif text-3xl md:text-4xl text-white mb-4"
              >
                Secret Letter
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/50 mb-8"
              >
                Enter the password to unlock
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onSubmit={handleSubmit}
                className="max-w-xs mx-auto"
              >
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className={`w-full px-5 py-4 glass rounded-xl text-white placeholder:text-white/30 text-center text-lg tracking-wider transition-all ${
                      error ? 'border-red-400/50 animate-shake' : 'border-white/10'
                    }`}
                    autoFocus
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-5 h-5" />
                  Unlock
                </motion.button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-4"
                  >
                    {errorMessage || 'Incorrect password. Try again.'}
                  </motion.p>
                )}

                <p className="text-white/20 text-xs mt-8">
                  Hint: think of our thing
                </p>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Letter container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />

                {/* Letter header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4"
                  >
                    <Heart className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="font-serif text-2xl md:text-3xl text-white"
                  >
                    {letter?.title || 'A Letter for You'}
                  </motion.h2>
                </div>

                {/* Letter content with typing effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="relative"
                >
                  <div className="font-serif text-lg md:text-xl leading-relaxed text-white/80 whitespace-pre-line min-h-[300px]">
                    {displayedText}
                    {!isTypingComplete && (
                      <span className="inline-block w-0.5 h-6 bg-purple-400 ml-1 animate-pulse" />
                    )}
                  </div>
                </motion.div>

                {/* Signature */}
                <AnimatePresence>
                  {isTypingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-12 text-right"
                    >
                      <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400/50 ml-auto mb-4" />
                      <p className="text-white/40 text-sm">
                        always here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Reset button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                  setDisplayedText('');
                  setIsTypingComplete(false);
                  setLetter(null);
                }}
                className="mt-6 mx-auto block text-white/30 hover:text-white/50 text-sm transition-colors"
              >
                Lock letter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
