
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentCategoryTrack, setCurrentCategoryTrack] = useState<any>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);

  const {
    currentTrack,
    isGlobalPlaying,
    setIsGlobalPlaying,
    hasActiveQueue,
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

  const handlePlayTrack = (track: any) => {
    console.log('Playing track from category page:', track);
    
    // Set as current category track
    setCurrentCategoryTrack(track);
    const trackIndex = filteredTracks.findIndex(t => t.id === track.id);
    setCurrentCategoryIndex(trackIndex);
    
    // Check if this track is already playing
    if (currentTrack?.id === track.id && isGlobalPlaying) {
      console.log('Track already playing, just updating category state');
      return;
    }
    
    // If we have an active queue, pause it and play this track
    if (hasActiveQueue) {
      console.log('Pausing active queue to play category track');
      pauseQueue();
    }
    
    // Replace queue with new track
    replaceQueue({
      id: track.id,
      title: track.title,
      description: track.description,
      duration: track.duration,
      is_premium: track.is_premium,
      tags: track.tags,
      thumbnail_url: track.thumbnail_url,
      categories: track.categories,
      category_id: track.category_id,
      file_path: track.file_path || '',
    });
    
    setIsGlobalPlaying(true);
  };

  const handleTrackChange = (track: any) => {
    console.log('Track changed in category page:', track);
    setCurrentCategoryTrack(track);
    const trackIndex = filteredTracks.findIndex(t => t.id === track.id);
    setCurrentCategoryIndex(trackIndex);
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

  // Initialize current track if we have one playing
  useEffect(() => {
    if (currentTrack && !hasActiveQueue) {
      const trackIndex = allTracks.findIndex(t => t.id === currentTrack.id);
      if (trackIndex >= 0 && !currentCategoryTrack) {
        console.log('Setting current category track from global state');
        setCurrentCategoryTrack(currentTrack);
        setCurrentCategoryIndex(trackIndex);
      }
    }
  }, [currentTrack, allTracks, currentCategoryTrack, hasActiveQueue]);

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

  // Use category track if no active queue, otherwise use current track
  const displayTrack = !hasActiveQueue && currentCategoryTrack ? currentCategoryTrack : currentTrack;

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
              isPlaying={displayTrack?.id === track.id && isGlobalPlaying}
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

      {/* Audio Player - only show if there's a current track */}
      {displayTrack && (
        <AudioPlayer
          currentTrack={displayTrack}
          isPlaying={isGlobalPlaying}
          onPlayPause={() => setIsGlobalPlaying(!isGlobalPlaying)}
          onTrackChange={handleTrackChange}
          categoryTracks={filteredTracks}
          currentCategoryIndex={currentCategoryIndex}
        />
      )}
      
      {/* Bottom spacing for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default CategoryPage;
