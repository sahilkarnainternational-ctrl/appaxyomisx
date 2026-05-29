import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScrollExpansionHero } from './components/ScrollExpansionHero';
import { QuizSection } from './components/QuizSection';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ChapterReader } from './components/ChapterReader';
import { OnboardingFlow } from './components/OnboardingFlow';
import { useUser, UserProvider } from './context/UserContext';

const AppContent: React.FC = () => {
  const { user, loading, userData } = useUser();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isChapterReaderOpen, setIsChapterReaderOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<{ query: string, context?: string } | null>(null);

  useEffect(() => {
    if (!loading && user && !userData) {
      setIsOnboardingOpen(true);
    }
  }, [user, loading, userData]);

  const openChapter = (topic: string, context?: string) => {
    setCurrentChapter({ query: topic, context });
    setIsChapterReaderOpen(true);
  };

  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        <ScrollExpansionHero onTeach={openChapter} />
        <QuizSection />
      </main>
      <Footer />
      <Chatbot />
      <ChapterReader
        isOpen={isChapterReaderOpen}
        onClose={() => setIsChapterReaderOpen(false)}
        query={currentChapter?.query || ''}
        context={currentChapter?.context}
        onNavigate={openChapter}
      />
      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
