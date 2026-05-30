import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, BrainCircuit } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface QuizProps {
  topic: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
  onClose: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ topic, questions, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { addXP } = useUser();

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const handleAnswerSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // Finish quiz
      const earnedXp = score * 10; // 10 XP per correct answer
      addXP(earnedXp);
      onClose(); // Or show a summary screen
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-[#0e1017] border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Quiz: {topic}</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-slate-400 mb-6 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h3 className="text-lg text-white font-semibold mb-6">{currentQuestion.question}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <button 
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-all text-sm font-medium
                    ${selectedAnswer === option 
                      ? (showResult ? (isCorrect ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-red-500 bg-red-500/10 text-red-300') : 'border-cyan-500 bg-cyan-500/10')
                      : 'border-white/10 bg-white/5 hover:bg-white/10'}
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {selectedAnswer && (
          <div className="mt-6 text-right">
            {!showResult ? (
              <button onClick={() => setShowResult(true)} className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-bold text-sm">Check</button>
            ) : (
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? <Check size={18}/> : <X size={18}/>}
                  {isCorrect ? "Correct!" : "Incorrect."}
                </div>
                <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 bg-slate-700 text-white rounded-lg font-bold text-sm hover:bg-slate-600">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} 
                  <ArrowRight size={16}/>
                </button>
              </div>
            )}
          </div>
        )}

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={20} />
        </button>

      </motion.div>
    </div>
  );
};
