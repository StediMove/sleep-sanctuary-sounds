
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TrackCard from '@/components/content/TrackCard';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { 
  realCategories, 
  getTracksByCategory 
} from '@/utils/audioContent';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const category = realCategories.find(cat => cat.id === categoryId);
  const tracks = getTracksByCategory(categoryId || '').map(track => ({
    ...track,
    categories: { name: category?.name || 'Unknown' }
  }));

  const handlePlayTrack = (track: any) => {
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    setCurrentTrackIndex(trackIndex);
    
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
      setIsPlaying(true);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-white/70">{category.description}</p>
          </div>
        </div>

        {/* Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              onPlay={() => handlePlayTrack(track)}
            />
          ))}
        </div>

        {tracks.length === 0 && (
          <div className="text-center text-white/60 py-8">
            No tracks available in this category.
          </div>
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={tracks.length > 1 ? handleNext : undefined}
        onPrevious={tracks.length > 1 ? handlePrevious : undefined}
      />
      
      {/* Bottom spacing for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default CategoryPage;
