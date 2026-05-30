import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { ScrollExpansionHero } from './components/ScrollExpansionHero.js';
import { QuizSection } from './components/QuizSection.js';
import { Footer } from './components/Footer.js';
import { Chatbot } from './components/Chatbot.js';
import { ChapterReader } from './components/ChapterReader.js';
import { OnboardingFlow } from './components/OnboardingFlow.js';
import { useUser, UserProvider } from './context/UserContext.js';
const AppContent = () => {
    const { user, loading, userData } = useUser();
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [isChapterReaderOpen, setIsChapterReaderOpen] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    useEffect(() => {
        if (!loading && user && !userData) {
            setIsOnboardingOpen(true);
        }
    }, [user, loading, userData]);
    const openChapter = (topic, context) => {
        setCurrentChapter({ query: topic, context });
        setIsChapterReaderOpen(true);
    };
    return (<div className="bg-black text-white">
      <Header />
      <main>
        <ScrollExpansionHero onTeach={openChapter}/>
        <QuizSection />
      </main>
      <Footer />
      <Chatbot />
      <ChapterReader isOpen={isChapterReaderOpen} onClose={() => setIsChapterReaderOpen(false)} query={currentChapter?.query || ''} context={currentChapter?.context} onNavigate={openChapter}/>
      <OnboardingFlow isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)}/>
    </div>);
};
const App = () => (<UserProvider>
    <AppContent />
  </UserProvider>);
export default App;
