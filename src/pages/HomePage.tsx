import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CategoryCard from '@/components/content/CategoryCard';
import TrackCard from '@/components/content/TrackCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Star, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQueueContext } from '@/contexts/QueueContext';
import FeaturedContent from '@/components/content/FeaturedContent';
import { 
  realAudioContent, 
  realCategories, 
  getTrackCountByCategory, 
  getTotalTrackCount,
  getFreeTrackCount,
  getTotalDurationMinutes,
  getSampleTracks,
  getTracksByCategory,
  getNewReleases,
  getTrendingTracks
} from '@/utils/audioContent';

const HomePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    currentTrack,
    isGlobalPlaying,
    setIsGlobalPlaying,
    addToQueue,
    playNext,
    replaceQueue,
  } = useQueueContext();

  // Use real categories data
  const categories = realCategories;

  // Get sample tracks for non-users
  const sampleTracks = getSampleTracks().map(track => ({
    ...track,
    categories: { name: categories.find(cat => cat.id === track?.category)?.name || 'Unknown' }
  }));
  
  // New data for FeaturedContent component
  const mapTracks = (tracks: any[]) => tracks.map(track => ({
    ...track,
    category_id: track.category,
    categories: { name: categories.find(cat => cat.id === track.category)?.name || 'Unknown' }
  }));

  const bedtimeStories = mapTracks(getTracksByCategory('bedtime-stories'));
  const calmingSounds = mapTracks(getTracksByCategory('calming-sounds'));
  const meditationMusic = mapTracks(getTracksByCategory('meditation-music'));
  const newReleases = mapTracks(getNewReleases());
  const trendingNow = mapTracks(getTrendingTracks());

  const handlePlayTrack = (track: any) => {
    console.log('Playing track from home page:', track);
    
    // Check if this track is already playing
    if (currentTrack?.id === track.id && isGlobalPlaying) {
      console.log('Track already playing');
      return;
    }
    
    // Play as single track (will pause queue if active)
    replaceQueue({
      id: track.id,
      title: track.title,
      description: track.description,
      duration: track.duration,
      is_premium: track.is_premium,
      tags: track.tags,
      thumbnail_url: track.thumbnail_url,
      categories: track.categories,
      category_id: track.category,
      file_path: track.file_path || '',
    });
    
    setIsGlobalPlaying(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Create an account to access all content.",
        variant: "destructive"
      });
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-deep via-slate-900 to-navy-deep relative overflow-hidden">
      {/* Floating Stars Background */}
      <div className="floating-stars">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="star animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-white mb-6 leading-tight">
            Sleep Sanctuary
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Discover peaceful bedtime stories, calming sounds, and meditation music 
            designed to help you drift into restful sleep.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-2xl button-pulse animate-glow"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </Link>
              <p className="text-white/60 text-sm font-light">
                Free preview • Full access with account
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <h2 className="font-serif text-3xl font-normal text-white mb-8 text-center">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategoryCard
                category={category}
                trackCount={getTrackCountByCategory(category.id)}
                onClick={() => handleCategoryClick(category.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sample/Featured Content */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <h2 className="font-serif text-3xl font-normal text-white mb-8 text-center">
          {user ? 'Featured Content' : 'Sample Tracks'}
        </h2>
        {user ? (
          <FeaturedContent
            bedtimeStories={bedtimeStories}
            calmingSounds={calmingSounds}
            meditationMusic={meditationMusic}
            newReleases={newReleases}
            trendingNow={trendingNow}
          />
        ) : (
          <>
            <p className="text-white/70 mb-8 text-center font-light leading-relaxed max-w-2xl mx-auto">
              Try these sample tracks from each category. Sign up for full access to our complete library.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleTracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <TrackCard
                    track={track}
                    isPlaying={currentTrack?.id === track.id && isGlobalPlaying}
                    onPlay={() => handlePlayTrack(track)}
                    onAddToQueue={addToQueue}
                    onPlayNext={playNext}
                    onReplaceQueue={replaceQueue}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card glass-card-hover text-center group">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{getTotalTrackCount()}</h3>
              <p className="text-white/70 font-light">Audio Tracks</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card glass-card-hover text-center group">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">3</h3>
              <p className="text-white/70 font-light">Free Tracks</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card glass-card-hover text-center group">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{getTotalDurationMinutes()}</h3>
              <p className="text-white/70 font-light">Minutes of Content</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom spacing for fixed player */}
      <div className="h-32"></div>
    </div>
  );
};

export default HomePage;
