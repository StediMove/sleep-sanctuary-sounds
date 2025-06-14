
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Repeat1, Shuffle } from 'lucide-react';
import { LoopMode } from '@/hooks/useQueue';
import { useQueueContext } from '@/contexts/QueueContext';
import QueueDrawer from './QueueDrawer';

interface AudioPlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onTrackChange?: (track: any) => void;
  categoryTracks?: any[];
  currentCategoryIndex?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onTrackChange,
  categoryTracks = [],
  currentCategoryIndex = -1
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const {
    queue,
    currentIndex,
    loopMode,
    isShuffled,
    setLoopMode,
    goToNext,
    goToPrevious,
    playTrackAt,
    removeFromQueue,
    clearQueue,
    moveTrack,
    getNextTrack,
    getPreviousTrack,
    currentTrack: queueCurrentTrack
  } = useQueueContext();

  // Use queue track if available, otherwise use prop
  const displayTrack = queueCurrentTrack || currentTrack;

  // Helper function to get random track from category (excluding current)
  const getRandomCategoryTrack = () => {
    if (categoryTracks.length <= 1) return null;
    const availableTracks = categoryTracks.filter(track => track.id !== displayTrack?.id);
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    return availableTracks[randomIndex];
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      console.log('Track ended, checking for next track...');
      if (loopMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      // First check if there's a next track in queue
      const nextTrack = getNextTrack();
      if (nextTrack) {
        console.log('Moving to next track in queue:', nextTrack);
        goToNext();
      } else {
        // Queue is empty or finished, play random track from category
        console.log('Queue finished, playing random track from category');
        const randomTrack = getRandomCategoryTrack();
        if (randomTrack && onTrackChange) {
          console.log('Playing random category track:', randomTrack);
          onTrackChange(randomTrack);
        } else if (categoryTracks.length > 0 && currentCategoryIndex >= 0) {
          // Fallback to next track in category if available
          const nextCategoryIndex = currentCategoryIndex + 1;
          if (nextCategoryIndex < categoryTracks.length) {
            console.log('Playing next track in category:', categoryTracks[nextCategoryIndex]);
            if (onTrackChange) {
              onTrackChange(categoryTracks[nextCategoryIndex]);
            }
          } else if (loopMode === 'all') {
            // Loop back to first track in category
            console.log('Looping back to first track in category');
            if (onTrackChange) {
              onTrackChange(categoryTracks[0]);
            }
          }
        } else if (onNext) {
          console.log('No queue or category tracks, calling onNext');
          onNext();
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [displayTrack, onNext, onTrackChange, queue, currentIndex, loopMode, goToNext, getNextTrack, categoryTracks, currentCategoryIndex]);

  // Update parent when queue track changes
  useEffect(() => {
    if (queueCurrentTrack && onTrackChange) {
      console.log('Queue track changed, updating parent:', queueCurrentTrack);
      onTrackChange(queueCurrentTrack);
    }
  }, [queueCurrentTrack, onTrackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(console.error);
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, displayTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause button clicked, current state:', isPlaying);
    onPlayPause();
  };

  const handleNext = () => {
    console.log('Next button clicked');
    if (queue.length > 0) {
      const nextTrack = getNextTrack();
      if (nextTrack) {
        console.log('Moving to next track in queue');
        goToNext();
      } else {
        // Queue finished, play random track from category
        const randomTrack = getRandomCategoryTrack();
        if (randomTrack && onTrackChange) {
          console.log('Queue finished, playing random category track');
          onTrackChange(randomTrack);
        }
      }
    } else if (categoryTracks.length > 0 && currentCategoryIndex >= 0) {
      // Play next track in category
      const nextCategoryIndex = currentCategoryIndex + 1;
      if (nextCategoryIndex < categoryTracks.length) {
        console.log('Playing next track in category');
        if (onTrackChange) {
          onTrackChange(categoryTracks[nextCategoryIndex]);
        }
      } else if (loopMode === 'all') {
        // Loop back to first track
        if (onTrackChange) {
          onTrackChange(categoryTracks[0]);
        }
      } else {
        // Play random track when at end
        const randomTrack = getRandomCategoryTrack();
        if (randomTrack && onTrackChange) {
          console.log('At end of category, playing random track');
          onTrackChange(randomTrack);
        }
      }
    } else if (onNext) {
      console.log('No queue or category tracks, calling onNext');
      onNext();
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked');
    if (queue.length > 0) {
      const prevTrack = getPreviousTrack();
      if (prevTrack) {
        console.log('Moving to previous track in queue');
        goToPrevious();
      } else {
        console.log('No previous track in queue');
      }
    } else if (categoryTracks.length > 0 && currentCategoryIndex >= 0) {
      // Play previous track in category
      const prevCategoryIndex = currentCategoryIndex - 1;
      if (prevCategoryIndex >= 0) {
        console.log('Playing previous track in category');
        if (onTrackChange) {
          onTrackChange(categoryTracks[prevCategoryIndex]);
        }
      } else if (loopMode === 'all') {
        // Loop to last track
        if (onTrackChange) {
          onTrackChange(categoryTracks[categoryTracks.length - 1]);
        }
      }
    } else if (onPrevious) {
      console.log('No queue or category tracks, calling onPrevious');
      onPrevious();
    }
  };

  const handleLoopToggle = () => {
    const modes: LoopMode[] = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(loopMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    console.log('Loop mode changed from', loopMode, 'to', nextMode);
    setLoopMode(nextMode);
  };

  const getLoopIcon = () => {
    switch (loopMode) {
      case 'one':
        return <Repeat1 className="h-4 w-4" />;
      case 'all':
        return <Repeat className="h-4 w-4 text-purple-400" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if navigation buttons should be enabled
  const canGoNext = queue.length > 0 
    ? getNextTrack() !== null 
    : categoryTracks.length > 0 || !!onNext;
    
  const canGoPrevious = queue.length > 0 
    ? getPreviousTrack() !== null 
    : (categoryTracks.length > 0 && currentCategoryIndex > 0) || loopMode === 'all' || !!onPrevious;
  
  if (!displayTrack) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={displayTrack.file_path}
        preload="metadata"
      />
      <Card className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-white/10 p-4 z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{displayTrack.title}</h4>
              <p className="text-white/60 text-sm truncate">{displayTrack.categories?.name}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoopToggle}
                className={`text-white hover:bg-white/10 ${loopMode !== 'none' ? 'text-purple-400' : ''}`}
              >
                {getLoopIcon()}
              </Button>

              <QueueDrawer
                queue={queue}
                currentIndex={currentIndex}
                onPlayTrack={playTrackAt}
                onRemoveTrack={removeFromQueue}
                onClearQueue={clearQueue}
                onMoveTrack={moveTrack}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-white hover:bg-white/10"
                disabled={!canGoPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-white hover:bg-white/10"
                disabled={!canGoNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full audio-progress-slider"
              />
            </div>
            
            <span className="text-white/60 text-sm min-w-[40px]">
              {formatTime(duration)}
            </span>
            
            <div className="flex items-center space-x-2 min-w-[100px]">
              <Volume2 className="h-4 w-4 text-white/60" />
              <div className="w-16">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-full volume-slider"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AudioPlayer;
