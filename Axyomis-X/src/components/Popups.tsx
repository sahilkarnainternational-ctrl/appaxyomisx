import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Zap, Activity } from 'lucide-react';

const MESSAGES = [
  "Hey do you want to explore a new topic? Come on!",
  "Hello world. I am Astra.",
  "Neuro intelligence mode activated.",
  "Hi, I am Astra the humanoid robo. Speed: 1 TeraHertz, Memory: 1 Zettabyte."
];

const ICONS = [Sparkles, Cpu, Zap, Activity];

export const GlobalPopups: React.FC<{ isChatOpen?: boolean }> = ({ isChatOpen }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);

  useEffect(() => {
    if (isChatOpen) {
      setCurrentMessageIndex(-1);
      return;
    }

    const cycleMessages = () => {
      if (isChatOpen) {
        setCurrentMessageIndex(-1);
        return;
      }
      // Pick a random message index occasionally
      if (Math.random() > 0.4) {
        setCurrentMessageIndex(Math.floor(Math.random() * MESSAGES.length));
        setTimeout(() => {
          setCurrentMessageIndex(-1);
        }, 5000); // show for 5 seconds
      }
    };
    
    // Initial delay then check every 15 seconds
    const t = setTimeout(cycleMessages, 3000);
    const interval = setInterval(cycleMessages, 15000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [isChatOpen]);

  return (
    <div className="fixed bottom-36 right-10 flex flex-col gap-4 z-[200] pointer-events-none">
      <AnimatePresence>
        {currentMessageIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl border border-[var(--accent)]/50 text-white px-6 py-4 rounded-[20px] shadow-[0_10px_40px_rgba(6,182,212,0.3)] flex items-center gap-4 max-w-sm"
          >
            {React.createElement(ICONS[currentMessageIndex % ICONS.length], { className: "text-[var(--accent)] w-6 h-6 flex-shrink-0 animate-pulse" })}
            <p className="text-sm font-medium tracking-wide leading-relaxed font-mono text-cyan-50">
              {MESSAGES[currentMessageIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
