import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react';

export function SecretLetterPage() {
  const API = import.meta.env.VITE_API_URL;

  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // ✍️ write states
  const [isWriting, setIsWriting] = useState(false);
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // ✏️ edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // 🔽 MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ USER
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userId = user?._id;
  const spaceId = "testspace1";

  // 🔥 fetch letters
  const fetchLetters = useCallback(async () => {
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const res = await fetch(
        `${API}/letters?userId=${userId}&spaceId=${spaceId}`
      );

      const data = await res.json();

      setLetters(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setPageError('Failed to load letters');
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  // ✉️ SEND / UPDATE
  const sendLetter = async () => {
    try {
      if (!userId) {
        alert("User not logged in");
        return;
      }

      if (!receiver || !subject || !body) {
        alert("Fill all fields");
        return;
      }

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

    } catch {
      alert("Error sending letter");
    }
  };

  // 🗑 DELETE
  const deleteLetter = async (id: string) => {
    await fetch(`${API}/letters/${id}`, { method: "DELETE" });
    fetchLetters();
    setSelectedLetter(null);
  };

  // ✏️ EDIT
  const startEdit = (letter: any) => {
    setEditingId(letter._id);
    setReceiver(letter.receiver?.username || '');
    setSubject(letter.subject);
    setBody(letter.body);
    setIsWriting(true);
    setSelectedLetter(null);
  };

  // 🔄 RESET
  const resetForm = () => {
    setReceiver('');
    setSubject('');
    setBody('');
    setEditingId(null);
    setIsWriting(false);
  };

  // 🔐 OWNER CHECK
  const isOwner = selectedLetter?.sender?._id === userId;

  // 🔴 ERROR UI
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
    <div className="min-h-screen flex justify-center px-4">
      <div className="max-w-2xl w-full">

        {!userId && (
          <p className="text-red-400 text-center mt-10">
            Please login first
          </p>
        )}

        {/* WRITE BUTTON */}
        {!isWriting && !selectedLetter && userId && (
          <button
            onClick={() => setIsWriting(true)}
            className="mb-6 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl"
          >
            Write Letter ✉️
          </button>
        )}

        {/* WRITE UI */}
        {isWriting && (
          <div className="glass p-6 rounded-2xl mb-6 space-y-4">
            <h2 className="text-white text-xl">
              {editingId ? "Edit Letter ✏️" : "New Letter 💌"}
            </h2>

            <input
              placeholder="To (username)"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full p-2 bg-white/10 text-white rounded"
            />

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 bg-white/10 text-white rounded"
            />

            <textarea
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-40 p-3 bg-white/10 text-white rounded"
            />

            <div className="flex gap-3">
              <button
                onClick={sendLetter}
                className="bg-purple-500 px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Send"}
              </button>

              <button onClick={resetForm} className="text-white/40">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        {!selectedLetter && !isWriting && userId && (
          <div className="space-y-4">
            <h2 className="text-white text-2xl text-center mb-4">
              Letters
            </h2>

            {letters.map((l) => (
              <div
                key={l._id}
                className="p-4 glass rounded-xl cursor-pointer hover:bg-white/10"
                onClick={() => setSelectedLetter(l)}
              >
                <h3 className="text-white">{l.subject}</h3>
                <p className="text-white/40 text-sm">
                  {l.sender?.username} → {l.receiver?.username}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* VIEW */}
        {selectedLetter && (
          <motion.div className="glass p-8 rounded-2xl relative">

            {/* MENU */}
            {isOwner && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg">
                    <button
                      onClick={() => {
                        startEdit(selectedLetter);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/10 text-blue-300"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => {
                        deleteLetter(selectedLetter._id);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/10 text-red-300"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            <h2 className="text-white text-2xl mb-2">
              {selectedLetter.subject}
            </h2>

            <p className="text-white/40 mb-4">
              {selectedLetter.sender?.username} → {selectedLetter.receiver?.username}
            </p>

            <div className="text-white/80 whitespace-pre-line mb-6">
              {selectedLetter.body}
            </div>

            <button
              onClick={() => setSelectedLetter(null)}
              className="text-white/40"
            >
              Close
            </button>

          </motion.div>
        )}

      </div>
    </div>
  );
}
