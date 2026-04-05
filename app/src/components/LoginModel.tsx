import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function LoginModal() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");

  if (user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="glass p-8 rounded-2xl w-80 text-center">
        <h2 className="text-white text-xl mb-4">Enter your name</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="username"
          className="w-full p-3 bg-white/10 rounded text-white mb-4"
        />

        <button
          onClick={() => login(name)}
          className="w-full bg-purple-500 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
