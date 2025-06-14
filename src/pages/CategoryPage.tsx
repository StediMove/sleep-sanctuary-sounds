
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TrackCard from '@/components/content/TrackCard';
import AudioPlayer from '@/components/audio/AudioPlayer';
import FilterTags from '@/components/content/FilterTags';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQueueContext } from '@/contexts/QueueContext';
import { 
  realCategories, 
  getTracksByCategory,
  getTagsByCategory,
  filterTracksByTags
} from '@/utils/audioContent';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentCategoryTrack, setCurrentCategoryTrack] = useState<any>(null);

  const {
    currentTrack,
    isPaused,
    addToQueue,
    playNext,
    replaceQueue,
    pauseQueue,
  } = useQueueContext();

  const category = realCategories.find(cat => cat.id === categoryId);
  const allTracks = getTracksByCategory(categoryId || '').map(track => ({
    ...track,
    categories: { name: category?.name || 'Unknown' }
  }));
  
  const availableTags = getTagsByCategory(categoryId || '');
  const filteredTracks = filterTracksByTags(allTracks, selectedTags);

  // Current track for category playback (either queue track or category track)
  const displayTrack = (!isPaused && currentTrack) || currentCategoryTrack;
  
  // Find current track index in filtered tracks
  const currentCategoryIndex = displayTrack 
    ? filteredTracks.findIndex(track => track.id === displayTrack.id)
    : -1;

  const handlePlayTrack = (track: any) => {
    console.log('Playing track from category page:', track);
    
    if (displayTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      // If there's a queue running, pause it and play this track
      if (currentTrack && !isPaused) {
        console.log('Pausing queue to play selected track');
        pauseQueue();
      }
      
      // Set as category track and play
      setCurrentCategoryTrack(track);
      setIsPlaying(true);
    }
  };

  const handleTrackChange = (newTrack: any) => {
    console.log('Track changed to:', newTrack);
    setCurrentCategoryTrack(newTrack);
    setIsPlaying(true);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
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

        {/* Filter Tags */}
        <FilterTags
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAllTags}
        />

        {/* Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={displayTrack?.id === track.id && isPlaying}
              onPlay={() => handlePlayTrack(track)}
              onAddToQueue={addToQueue}
              onPlayNext={playNext}
              onReplaceQueue={replaceQueue}
            />
          ))}
        </div>

        {filteredTracks.length === 0 && selectedTags.length > 0 && (
          <div className="text-center text-white/60 py-8">
            No tracks found with the selected tags. Try adjusting your filters.
          </div>
        )}

        {allTracks.length === 0 && (
          <div className="text-center text-white/60 py-8">
            No tracks available in this category.
          </div>
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={displayTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onTrackChange={handleTrackChange}
        categoryTracks={filteredTracks}
        currentCategoryIndex={currentCategoryIndex}
      />
      
      {/* Bottom spacing for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default CategoryPage;
