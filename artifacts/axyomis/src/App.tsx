import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ScrollExpansionHero } from './components/ScrollExpansionHero.tsx';
import { QuizSection } from './components/QuizSection.tsx';
import { Footer } from './components/Footer.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { ChapterReader } from './components/ChapterReader.tsx';
import { OnboardingFlow } from './components/OnboardingFlow.tsx';
import { useUser, UserProvider } from './context/UserContext.tsx';

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
