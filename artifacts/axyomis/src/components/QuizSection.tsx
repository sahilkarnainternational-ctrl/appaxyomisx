import React, { useState } from 'react';
import { quizzes } from '../data/quizzes';
import { Quiz } from './Quiz';
import { BrainCircuit, Book } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<{ topic: string; questions: any[] } | null>(null);

  const handleQuizStart = (subject: keyof typeof quizzes, topic: string) => {
    setSelectedQuiz({ topic, questions: quizzes[subject][topic] });
  };

  return (
    <div className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Test Your Knowledge
          </h2>
          <p className="mt-4 text-xl text-slate-400">
            Take a quiz to test your knowledge and earn XP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(quizzes).map(subject => (
            <div key={subject} className="bg-[#0e1017] border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">{subject}</h3>
              </div>
              <div className="space-y-4">
                {Object.keys(quizzes[subject]).map(topic => (
                  <button 
                    key={topic}
                    onClick={() => handleQuizStart(subject as keyof typeof quizzes, topic)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white">{topic}</span>
                    <BrainCircuit className="w-5 h-5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedQuiz && (
        <Quiz 
          topic={selectedQuiz.topic}
          questions={selectedQuiz.questions}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
};
