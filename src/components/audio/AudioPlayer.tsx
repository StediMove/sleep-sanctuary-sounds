
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
  const [lastTrackId, setLastTrackId] = useState<string | null>(null);

  const {
    queue,
    currentIndex,
    loopMode,
    isShuffled,
    isPaused,
    isGlobalPlaying,
    pausedTrack,
    hasActiveQueue,
    setLoopMode,
    addToQueue,
    playNext,
    replaceQueue,
    removeFromQueue,
    clearQueue,
    moveTrack,
    pauseQueue,
    resumeQueue,
    getNextTrack,
    getPreviousTrack,
    goToNext,
    goToPrevious,
    playTrackAt,
    currentTrack: queueCurrentTrack
  } = useQueueContext();

  // Determine which track to display and use for playback
  const displayTrack = hasActiveQueue ? queueCurrentTrack : currentTrack;
  const shouldUseGlobalPlaying = hasActiveQueue;

  console.log('AudioPlayer render:', {
    hasActiveQueue,
    queueCurrentTrack: queueCurrentTrack?.title,
    currentTrack: currentTrack?.title,
    displayTrack: displayTrack?.title,
    isPaused,
    pausedTrack: pausedTrack?.title
  });

  // Helper function to get next category track
  const getNextCategoryTrack = () => {
    if (categoryTracks.length <= 1) return null;
    const nextIndex = currentCategoryIndex + 1;
    if (nextIndex < categoryTracks.length) {
      return categoryTracks[nextIndex];
    } else if (loopMode === 'all') {
      return categoryTracks[0];
    }
    return null;
  };

  // Helper function to get previous category track
  const getPreviousCategoryTrack = () => {
    if (categoryTracks.length <= 1) return null;
    const prevIndex = currentCategoryIndex - 1;
    if (prevIndex >= 0) {
      return categoryTracks[prevIndex];
    } else if (loopMode === 'all') {
      return categoryTracks[categoryTracks.length - 1];
    }
    return null;
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

      // If we have an active queue
      if (hasActiveQueue) {
        const nextTrack = getNextTrack();
        if (nextTrack) {
          console.log('Moving to next track in queue:', nextTrack);
          goToNext();
        } else if (loopMode === 'all' && queue.length > 0) {
          console.log('Looping back to start of queue');
          goToNext();
        } else {
          console.log('Queue finished');
        }
      } else {
        // No active queue, try category tracks
        const nextCategoryTrack = getNextCategoryTrack();
        if (nextCategoryTrack && onTrackChange) {
          console.log('Playing next category track:', nextCategoryTrack);
          onTrackChange(nextCategoryTrack);
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
  }, [displayTrack, loopMode, hasActiveQueue, goToNext, getNextTrack, categoryTracks, onTrackChange, queue.length, currentCategoryIndex]);

  // Update parent when queue track changes
  useEffect(() => {
    if (queueCurrentTrack && hasActiveQueue && onTrackChange) {
      console.log('Queue track changed, updating parent:', queueCurrentTrack);
      onTrackChange(queueCurrentTrack);
    }
  }, [queueCurrentTrack, hasActiveQueue, onTrackChange]);

  // Handle audio source changes without restarting if same track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !displayTrack) return;

    // Only change source if it's a different track
    if (displayTrack.id !== lastTrackId) {
      console.log('Changing audio source to:', displayTrack.title);
      audio.src = displayTrack.file_path;
      setLastTrackId(displayTrack.id);
      setCurrentTime(0);
    }
  }, [displayTrack, lastTrackId]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !displayTrack) return;

    const shouldPlay = shouldUseGlobalPlaying ? isGlobalPlaying : isPlaying;
    console.log('Audio play state effect:', { shouldPlay, displayTrack: displayTrack?.title });

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(console.error);
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isGlobalPlaying, displayTrack, shouldUseGlobalPlaying]);

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
    console.log('Play/Pause button clicked');
    onPlayPause();
  };

  const handleNext = () => {
    console.log('Next button clicked');
    
    // If we have an active queue
    if (hasActiveQueue) {
      const nextTrack = getNextTrack();
      if (nextTrack) {
        console.log('Moving to next track in queue');
        goToNext();
        return;
      } else if (loopMode === 'all' && queue.length > 0) {
        console.log('Looping back to start of queue');
        goToNext();
        return;
      }
    }

    // If there's a paused queue, ask user if they want to resume
    if (isPaused && pausedTrack) {
      console.log('Resuming paused queue');
      resumeQueue();
      return;
    }

    // Fallback to category tracks
    const nextCategoryTrack = getNextCategoryTrack();
    if (nextCategoryTrack && onTrackChange) {
      console.log('Playing next category track');
      onTrackChange(nextCategoryTrack);
      return;
    }

    // Final fallback to parent next
    if (onNext) {
      console.log('Calling parent onNext');
      onNext();
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked');
    
    // If we have an active queue
    if (hasActiveQueue) {
      const prevTrack = getPreviousTrack();
      if (prevTrack) {
        console.log('Moving to previous track in queue');
        goToPrevious();
        return;
      }
    }

    // If there's a paused queue, ask user if they want to resume
    if (isPaused && pausedTrack) {
      console.log('Resuming paused queue');
      resumeQueue();
      return;
    }

    // Fallback to category tracks
    const prevCategoryTrack = getPreviousCategoryTrack();
    if (prevCategoryTrack && onTrackChange) {
      console.log('Playing previous category track');
      onTrackChange(prevCategoryTrack);
      return;
    }

    // Final fallback to parent previous
    if (onPrevious) {
      console.log('Calling parent onPrevious');
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

  // Navigation buttons logic
  const canGoNext = hasActiveQueue || 
    (isPaused && pausedTrack) || 
    getNextCategoryTrack() !== null || 
    !!onNext;
    
  const canGoPrevious = hasActiveQueue || 
    (isPaused && pausedTrack) || 
    getPreviousCategoryTrack() !== null || 
    !!onPrevious;
  
  if (!displayTrack) return null;

  const displayIsPlaying = shouldUseGlobalPlaying ? isGlobalPlaying : isPlaying;

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
      />
      <Card className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-white/10 p-4 z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{displayTrack.title}</h4>
              <div className="flex items-center space-x-2">
                <p className="text-white/60 text-sm truncate">{displayTrack.categories?.name}</p>
                {isPaused && pausedTrack && (
                  <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                    Queue Paused
                  </span>
                )}
                {hasActiveQueue && (
                  <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">
                    Queue Active
                  </span>
                )}
              </div>
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
                onAddToQueue={addToQueue}
                onPlayNext={playNext}
                onReplaceQueue={replaceQueue}
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
                {displayIsPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
