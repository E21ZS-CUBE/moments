import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';

export function SecretLetterPage() {
  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);
  const [openedLetter, setOpenedLetter] = useState<any | null>(null);

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔥 Fetch all letters
  const fetchLetters = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await fetch(
        `${import.meta.env.VITE_API_URL}/letters`
      ).then(res => res.json());

      setLetters(data);
      setIsLoading(false);
    } catch (err) {
      setPageError('Failed to load letters');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  // 🔐 Verify password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/letters/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedLetter._id,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setOpenedLetter(data);
      setError(false);
      setErrorMessage('');

    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message || 'Incorrect password');
      setTimeout(() => setError(false), 500);
    }
  };

  // ✨ Typing animation
  useEffect(() => {
    if (
      openedLetter &&
      displayedText.length < openedLetter.content.length
    ) {
      const timeout = setTimeout(() => {
        setDisplayedText(
          openedLetter.content.slice(0, displayedText.length + 1)
        );
      }, 40 + Math.random() * 30);

      typingRef.current = timeout;

      return () => clearTimeout(timeout);
    } else if (
      openedLetter &&
      displayedText.length === openedLetter.content.length
    ) {
      setIsTypingComplete(true);
    }
  }, [displayedText, openedLetter]);

  // 🔴 Error page
  if (pageError && !isLoading) {
    return (
      <div className="text-center mt-20">
        <AlertCircle className="mx-auto text-red-400" />
        <p>{pageError}</p>
        <button onClick={fetchLetters}>Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">

        {/* 🧾 LETTER LIST */}
        {!selectedLetter && (
          <div className="space-y-4">
            <h2 className="text-white text-2xl text-center mb-4">
              Your Letters 💌
            </h2>

            {letters.map((l) => (
              <div
                key={l._id}
                onClick={() => setSelectedLetter(l)}
                className="p-4 glass rounded-xl cursor-pointer hover:bg-white/10"
              >
                <h3 className="text-white">{l.title}</h3>
                <p className="text-white/40 text-sm">
                  {l.sender} → {l.receiver}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 🔐 PASSWORD SCREEN */}
        {selectedLetter && !openedLetter && (
          <div className="text-center">
            <Lock className="mx-auto text-purple-400 mb-4" />

            <h2 className="text-white mb-4">
              Unlock "{selectedLetter.title}"
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 rounded bg-white/10 text-white"
                placeholder="Enter password"
              />

              <button className="block mt-4 mx-auto bg-purple-500 px-4 py-2 rounded">
                Unlock
              </button>
            </form>

            {error && (
              <p className="text-red-400 mt-2">
                {errorMessage}
              </p>
            )}

            <button
              onClick={() => setSelectedLetter(null)}
              className="mt-4 text-white/40"
            >
              ← back
            </button>
          </div>
        )}

        {/* 💌 LETTER VIEW */}
        {openedLetter && (
          <motion.div className="glass p-8 rounded-2xl">

            <h2 className="text-white text-2xl mb-4 text-center">
              {openedLetter.title}
            </h2>

            <div className="text-white/80 whitespace-pre-line">
              {displayedText}
              {!isTypingComplete && <span>|</span>}
            </div>

            <button
              onClick={() => {
                setOpenedLetter(null);
                setSelectedLetter(null);
                setDisplayedText('');
                setIsTypingComplete(false);
              }}
              className="mt-6 text-white/40"
            >
              Close
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
