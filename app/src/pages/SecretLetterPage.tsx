import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react';

export function SecretLetterPage() {
  const API = import.meta.env.VITE_API_URL;

  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isWriting, setIsWriting] = useState(false);
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<'inbox' | 'sent' | 'deleted'>('inbox');

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userId = user?._id;
  const spaceId = "testspace1";

  const fetchLetters = useCallback(async () => {
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `${API}/letters?userId=${userId}&spaceId=${spaceId}`
      );

      const data = await res.json();
      setLetters(data);
      setIsLoading(false);
    } catch {
      setPageError('Failed to load letters');
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  // ✉️ SEND
  const sendLetter = async () => {
    if (!receiver || !subject || !body) return;

    if (editingId) {
      await fetch(`${API}/letters/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });
    } else {
      await fetch(`${API}/letters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          senderId: userId,
          receiverUsername: receiver,
          spaceId
        })
      });
    }

    resetForm();
    fetchLetters();
  };

  const deleteLetter = async (id: string) => {
    await fetch(`${API}/letters/${id}`, { method: "DELETE" });
    fetchLetters();
    setSelectedLetter(null);
  };

  const startEdit = (letter: any) => {
    setEditingId(letter._id);
    setReceiver(letter.receiver?.username || '');
    setSubject(letter.subject);
    setBody(letter.body);
    setIsWriting(true);
    setSelectedLetter(null);
  };

  const resetForm = () => {
    setReceiver('');
    setSubject('');
    setBody('');
    setEditingId(null);
    setIsWriting(false);
  };

  const isOwner = selectedLetter?.sender?._id === userId;

  // ✅ FILTER
  const filteredLetters = letters.filter((l) => {
    if (tab === 'inbox') return l.receiver?._id === userId && !l.deleted;
    if (tab === 'sent') return l.sender?._id === userId && !l.deleted;
    if (tab === 'deleted') return l.deleted === true;
  });

  if (pageError && !isLoading) {
    return <p>{pageError}</p>;
  }
  return (
  <div className="min-h-screen flex">

    {/* SIDEBAR */}
    <div
      className={`transition-all duration-300 
        ${sidebarOpen ? 'w-56' : 'w-16'} 
        bg-black/40 backdrop-blur-xl border-r border-white/10 p-3 flex flex-col`}
    >

      {/* ☰ BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mb-6 text-white/70 hover:text-white text-lg"
      >
        ☰
      </button>

      {/* MENU ITEMS */}
      {[
        { key: 'inbox', icon: '📥', label: 'Inbox' },
        { key: 'sent', icon: '📤', label: 'Sent' },
        { key: 'deleted', icon: '🗑', label: 'Deleted' }
      ].map((item) => (
        <div
          key={item.key}
          onClick={() => setTab(item.key as any)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-2
            ${tab === item.key 
              ? 'bg-purple-500/20 text-purple-300' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          title={!sidebarOpen ? item.label : ''}
        >
          <span>{item.icon}</span>

          {/* TEXT ONLY WHEN EXPANDED */}
          {sidebarOpen && <span>{item.label}</span>}
        </div>
      ))}

    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 px-6 py-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-white text-2xl font-semibold">
          Letters
        </h2>

        <button
          onClick={() => setIsWriting(true)}
          className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
        >
          Write ✉️
        </button>

      </div>

      {/* WRITE UI */}
      {isWriting && (
        <div className="glass p-6 rounded-xl mb-6 space-y-3">
          <input
            placeholder="To"
            value={receiver}
            onChange={e => setReceiver(e.target.value)}
            className="w-full p-2 bg-white/10 rounded text-white"
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full p-2 bg-white/10 rounded text-white"
          />

          <textarea
            placeholder="Write..."
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full h-40 p-3 bg-white/10 rounded text-white"
          />

          <div className="flex gap-3">
            <button onClick={sendLetter} className="bg-purple-500 px-4 py-2 rounded">
              Send
            </button>

            <button onClick={resetForm} className="text-white/40">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LETTER LIST */}
      {!selectedLetter && !isWriting && (
        <div className="space-y-3">

          {filteredLetters.map(l => (
            <div
              key={l._id}
              onClick={() => setSelectedLetter(l)}
              className="glass p-4 rounded-xl cursor-pointer hover:bg-white/10"
            >
              <h3 className="text-white">{l.subject}</h3>
              <p className="text-white/40 text-sm">
                {l.sender?.username} → {l.receiver?.username}
              </p>
            </div>
          ))}

        </div>
      )}

      {/* VIEW LETTER */}
      {selectedLetter && (
        <motion.div className="glass p-8 rounded-xl relative">

          {isOwner && (
            <div className="absolute top-3 right-3">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                  <button
                    onClick={() => startEdit(selectedLetter)}
                    className="flex gap-2 px-4 py-2 hover:bg-white/10 text-blue-300"
                  >
                    <Pencil size={14}/> Edit
                  </button>

                  <button
                    onClick={() => deleteLetter(selectedLetter._id)}
                    className="flex gap-2 px-4 py-2 hover:bg-white/10 text-red-300"
                  >
                    <Trash2 size={14}/> Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <h2 className="text-white text-xl mb-2">{selectedLetter.subject}</h2>

          <p className="text-white/40 mb-4">
            {selectedLetter.sender?.username} → {selectedLetter.receiver?.username}
          </p>

          <p className="text-white whitespace-pre-line mb-6">
            {selectedLetter.body}
          </p>

          <button onClick={() => setSelectedLetter(null)} className="text-white/40">
            Close
          </button>

        </motion.div>
      )}

    </div>

  </div>
);
}
