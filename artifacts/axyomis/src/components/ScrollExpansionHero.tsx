
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from './Globe';
import { useUser } from '../context/UserContext';
import { ArrowRight, Search } from 'lucide-react';

interface ScrollExpansionHeroProps {
  onTeach: (topic: string, context?: string) => void;
}

export const ScrollExpansionHero: React.FC<ScrollExpansionHeroProps> = ({ onTeach }) => {
  const { user, userData } = useUser();
  const [topic, setTopic] = useState('');

  const handleTeach = () => {
    if (topic) {
      onTeach(topic, `A student from ${userData?.studentProfile?.country} in ${userData?.classLevel} is asking for a lesson.`);
    }
  };

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
    onTeach(selectedTopic, `A student from ${userData?.studentProfile?.country} in ${userData?.classLevel} is asking for a lesson.`);
  };


  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Globe Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Globe />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center p-4"
      >
        {user && userData ? (
          <div className='mb-8'>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-wide uppercase drop-shadow-2xl">
              Welcome, {userData.studentProfile?.studentName || user.displayName || 'Explorer'}
            </h1>
            <p className="text-cyan-400 font-mono tracking-widest uppercase text-xs md:text-sm mt-2">
              {userData.classLevel} student from {userData.studentProfile?.country}
            </p>
          </div>
        ) : (
          <div className='mb-8'>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-[0.2em] uppercase drop-shadow-2xl">
              ASTRA LABS
            </h1>
            <p className="text-cyan-400 font-mono tracking-[0.4em] uppercase text-xs md:text-sm">
              The scientific universe of tomorrow.
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to learn today?"
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-slate-400 outline-none focus:border-cyan-500/50 transition-all text-center text-lg"
            />
            <button onClick={handleTeach} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 rounded-full text-black hover:bg-cyan-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={handleTeach}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
          >
            Teach me about...
          </button>
        </div>

        <div className="mt-12 text-slate-500 text-xs uppercase font-mono tracking-widest">
          <p>Or try one of these topics:</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            {['Photosynthesis', 'Quantum Mechanics', 'Black Holes', 'General Relativity'].map(t => (
              <button key={t} onClick={() => handleTopicClick(t)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

