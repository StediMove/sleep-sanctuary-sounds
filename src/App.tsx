
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueueProvider } from '@/contexts/QueueContext';
import { AuthProvider } from '@/hooks/useAuth';
import { SubscriptionProvider } from '@/hooks/useSubscription';
import Index from './pages/Index';
import AuthPage from './components/auth/AuthPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import Header from './components/layout/Header';
import AudioPlayer from './components/audio/AudioPlayer';
import { useQueueContext } from '@/contexts/QueueContext';

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentTrack, isGlobalPlaying, setIsGlobalPlaying } = useQueueContext();

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Global Audio Player - always visible when there's a track */}
        {currentTrack && (
          <AudioPlayer
            currentTrack={currentTrack}
            isPlaying={isGlobalPlaying}
            onPlayPause={() => setIsGlobalPlaying(!isGlobalPlaying)}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <QueueProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </QueueProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
