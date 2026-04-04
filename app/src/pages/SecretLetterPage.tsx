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
    <div className="min-h-screen px-4">

      {/* ☰ BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 mt-4"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="w-64 bg-black/60 backdrop-blur-xl p-4">

            <button onClick={() => { setTab('inbox'); setSidebarOpen(false); }}>
              📥 Inbox
            </button>

            <button onClick={() => { setTab('sent'); setSidebarOpen(false); }}>
              📤 Sent
            </button>

            <button onClick={() => { setTab('deleted'); setSidebarOpen(false); }}>
              🗑 Deleted
            </button>

          </div>
        </div>
      )}

      {/* WRITE BUTTON */}
      {!isWriting && !selectedLetter && (
        <button onClick={() => setIsWriting(true)}>
          Write ✉️
        </button>
      )}

      {/* WRITE UI */}
      {isWriting && (
        <div className="glass p-6">
          <input value={receiver} onChange={e => setReceiver(e.target.value)} />
          <input value={subject} onChange={e => setSubject(e.target.value)} />
          <textarea value={body} onChange={e => setBody(e.target.value)} />

          <button onClick={sendLetter}>Send</button>
          <button onClick={resetForm}>Cancel</button>
        </div>
      )}

      {/* LIST */}
      {!selectedLetter && !isWriting && (
        <div>
          {filteredLetters.map(l => (
            <div key={l._id} onClick={() => setSelectedLetter(l)}>
              <h3>{l.subject}</h3>
              <p>{l.sender?.username} → {l.receiver?.username}</p>
            </div>
          ))}
        </div>
      )}

      {/* VIEW */}
      {selectedLetter && (
        <motion.div className="glass p-8 relative">

          {isOwner && (
            <div className="absolute top-2 right-2">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div>
                  <button onClick={() => startEdit(selectedLetter)}>
                    <Pencil size={14}/> Edit
                  </button>

                  <button onClick={() => deleteLetter(selectedLetter._id)}>
                    <Trash2 size={14}/> Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <h2>{selectedLetter.subject}</h2>
          <p>{selectedLetter.body}</p>

          <button onClick={() => setSelectedLetter(null)}>Close</button>
        </motion.div>
      )}

    </div>
  );
}
