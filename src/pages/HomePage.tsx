
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CategoryCard from '@/components/content/CategoryCard';
import TrackCard from '@/components/content/TrackCard';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  realAudioContent, 
  realCategories, 
  getTrackCountByCategory, 
  getTotalTrackCount,
  getFreeTrackCount,
  getTotalDurationMinutes,
  getSampleTracks
} from '@/utils/audioContent';

const HomePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Use real categories data
  const categories = realCategories;

  // Get sample tracks for non-users, featured tracks for users
  const sampleTracks = getSampleTracks().map(track => ({
    ...track,
    categories: { name: categories.find(cat => cat.id === track?.category)?.name || 'Unknown' }
  }));
  
  const featuredTracks = user 
    ? realAudioContent.slice(0, 6).map(track => ({
        ...track,
        categories: { name: categories.find(cat => cat.id === track.category)?.name || 'Unknown' }
      }))
    : sampleTracks;

  // Fetch user favorites if logged in
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const { data } = await supabase
          .from('user_favorites')
          .select('content_id')
          .eq('user_id', user.id);
        
        if (data) {
          setFavorites(data.map(fav => fav.content_id));
        }
      };
      fetchFavorites();
    }
  }, [user]);

  const handlePlayTrack = (track: any) => {
    const trackIndex = featuredTracks.findIndex(t => t.id === track.id);
    setCurrentTrackIndex(trackIndex);
    
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < featuredTracks.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(featuredTracks[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(featuredTracks[prevIndex]);
      setIsPlaying(true);
    }
  };

  const handleFavorite = async (trackId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    const isFavorite = favorites.includes(trackId);
    
    if (isFavorite) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', trackId);
      
      if (!error) {
        setFavorites(favorites.filter(id => id !== trackId));
        toast({ title: "Removed from favorites" });
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          content_id: trackId
        });
      
      if (!error) {
        setFavorites([...favorites, trackId]);
        toast({ title: "Added to favorites" });
      }
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Sleep Sanctuary
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover peaceful bedtime stories, calming sounds, and meditation music 
            designed to help you drift into restful sleep.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Start Your Journey
                </Button>
              </Link>
              <p className="text-white/60 text-sm">
                Free preview • Full access with account
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              trackCount={getTrackCountByCategory(category.id)}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </section>

      {/* Sample/Featured Content */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {user ? 'Featured Content' : 'Sample Tracks'}
        </h2>
        {!user && (
          <p className="text-white/70 mb-6">
            Try these sample tracks from each category. Sign up for full access to our complete library.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              isFavorite={favorites.includes(track.id)}
              onPlay={() => handlePlayTrack(track)}
              onFavorite={() => handleFavorite(track.id)}
            />
          ))}
        </div>
      </section>

      {/* Real Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{getTotalTrackCount()}</h3>
              <p className="text-white/70">Audio Tracks</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{getFreeTrackCount()}</h3>
              <p className="text-white/70">Free Tracks</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{getTotalDurationMinutes()}</h3>
              <p className="text-white/70">Minutes of Content</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={featuredTracks.length > 1 ? handleNext : undefined}
        onPrevious={featuredTracks.length > 1 ? handlePrevious : undefined}
        isFavorite={currentTrack ? favorites.includes(currentTrack.id) : false}
        onFavorite={() => currentTrack && handleFavorite(currentTrack.id)}
      />
      
      {/* Bottom spacing for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default HomePage;
