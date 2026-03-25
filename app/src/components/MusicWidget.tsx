import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Music,
  ChevronUp
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MusicWidgetProps {
  className?: string;
}

interface MusicState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
}

export function MusicWidget({ className = '' }: MusicWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [musicState, setMusicState] = useLocalStorage<MusicState>('music-state', {
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = musicState.isMuted ? 0 : musicState.volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (musicState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        });
      }
      setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setMusicState(prev => ({ 
      ...prev, 
      volume: newVolume,
      isMuted: newVolume === 0 
    }));
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !musicState.isMuted;
      audioRef.current.volume = newMuted ? 0 : musicState.volume;
      setMusicState(prev => ({ ...prev, isMuted: newMuted }));
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Volume icon based on state
  const VolumeIcon = musicState.isMuted || musicState.volume === 0 
    ? VolumeX 
    : musicState.volume < 0.5 
      ? Volume1 
      : Volume2;

  return (
    <div 
      ref={widgetRef}
      className={`relative ${className}`}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - small floating button
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className={`
              relative flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white/5 backdrop-blur-xl
              border border-white/10
              hover:bg-white/10 hover:border-white/20
              transition-all duration-300
              ${musicState.isPlaying ? 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' : ''}
            `}
          >
            {/* Pulsing ring when playing */}
            {musicState.isPlaying && (
              <motion.span
                className="absolute inset-0 rounded-full border border-purple-400/30"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            <Music className={`w-4 h-4 ${musicState.isPlaying ? 'text-purple-400' : 'text-white/50'}`} />
          </motion.button>
        ) : (
          // Expanded state - mini player
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              absolute right-0 top-0
              w-64 p-4 rounded-2xl
              bg-slate-900/80 backdrop-blur-2xl
              border border-white/10
              shadow-2xl shadow-purple-500/10
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${musicState.isPlaying ? 'bg-purple-500/20' : 'bg-white/5'}
                `}>
                  <Music className={`w-4 h-4 ${musicState.isPlaying ? 'text-purple-400' : 'text-white/50'}`} />
                </div>
                <span className="text-sm font-medium text-white/80">Now Playing</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Song info */}
            <div className="mb-4">
              <p className="text-white font-medium text-sm truncate">Impossible</p>
              <p className="text-white/40 text-xs truncate">James Arthur</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="
                  w-12 h-12 rounded-full
                  bg-gradient-to-r from-purple-500 to-pink-500
                  flex items-center justify-center
                  shadow-lg shadow-purple-500/30
                  hover:shadow-purple-500/50
                  transition-shadow
                "
              >
                {musicState.isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </motion.button>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <VolumeIcon className="w-4 h-4 text-white/50" />
              </button>
              
              <div className="flex-1 relative h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  style={{ width: `${musicState.isMuted ? 0 : musicState.volume * 100}%` }}
                  layoutId="volume-fill"
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicState.isMuted ? 0 : musicState.volume}
                  onChange={handleVolumeChange}
                  className="
                    absolute inset-0 w-full h-full
                    opacity-0 cursor-pointer
                  "
                />
              </div>
              
              <span className="text-xs text-white/40 w-8 text-right">
                {Math.round((musicState.isMuted ? 0 : musicState.volume) * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
