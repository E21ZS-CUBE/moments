import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function LoginModal() {
  const { user, login, loading } = useAuth();
  const [username, setUsername] = useState("");

  if (loading) return null;
  if (user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="w-[380px] p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-xl">

        <h2 className="text-white text-2xl mb-2 text-center">
          Welcome Back
        </h2>

        <p className="text-white/40 text-sm text-center mb-6">
          Enter your username to continue
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full p-3 rounded bg-white/10 text-white outline-none mb-4"
        />

        <button
          onClick={() => login(username)}
          className="w-full py-3 rounded bg-purple-500 hover:bg-purple-600 text-white"
        >
          Continue
        </button>

      </div>
    </div>
  );
}
