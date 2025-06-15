import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Repeat1 } from 'lucide-react';
import { LoopMode } from '@/hooks/useQueue';
import { useQueueContext } from '@/contexts/QueueContext';
import QueueDrawer from './QueueDrawer';
import { getTracksByCategory, realCategories } from '@/utils/audioContent';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const MarqueeTitle = ({ title }: { title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > containerRef.current.offsetWidth);
      }
    };
    // Timeout to allow DOM to update with new title
    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [title]);

  return (
    <div ref={containerRef} className="relative overflow-hidden whitespace-nowrap h-6 flex items-center">
      {/* This span is only for measuring, it's not visible */}
      <span ref={textRef} className="text-white font-medium absolute invisible -z-10">{title}</span>
      
      {isOverflowing ? (
        <div className="flex animate-marquee">
          <span className="text-white font-medium pr-8">{title}</span>
          <span className="text-white font-medium pr-8">{title}</span>
        </div>
      ) : (
        <span className="text-white font-medium truncate">{title}</span>
      )}
    </div>
  );
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isSeeking = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [lastTrackId, setLastTrackId] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscribed } = useSubscription();

  const {
    queue,
    currentIndex,
    loopMode,
    isShuffled,
    isSingleTrackMode,
    hasActiveQueue,
    hasPausedQueue,
    setLoopMode,
    addToQueue,
    playNext,
    replaceQueue,
    removeFromQueue,
    clearQueue,
    moveTrack,
    resumeQueue,
    getNextTrack,
    getPreviousTrack,
    goToNext,
    goToPrevious,
    playSingleTrackAndClearQueue,
    playTrackAt,
  } = useQueueContext();

  console.log('AudioPlayer render:', {
    hasActiveQueue,
    isSingleTrackMode,
    currentTrack: currentTrack?.title,
    hasPausedQueue,
    queueLength: queue.length
  });

  const getRandomTrackFromCategory = (categoryId: string, excludeTrackId?: string) => {
    const categoryTracks = getTracksByCategory(categoryId);
    const availableTracks = excludeTrackId 
      ? categoryTracks.filter(t => t.id !== excludeTrackId)
      : categoryTracks;
    
    if (availableTracks.length > 0) {
      const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
      const category = realCategories.find(c => c.id === categoryId);
      return {
        ...randomTrack,
        file_path: randomTrack.file_path || '',
        categories: { name: category?.name || 'Unknown' },
        category_id: categoryId
      };
    }
    return null;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      // Only update time from audio element if user is not actively seeking
      if (!isSeeking.current) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleSeeked = () => {
      console.log('Seek operation completed.');
      isSeeking.current = false;
    };

    const handleEnded = () => {
      console.log('Track ended, checking for next track...');
      
      if (loopMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      // If we have an active queue, try to go to next
      if (hasActiveQueue) {
        const nextTrack = getNextTrack();
        if (nextTrack) {
          console.log('Moving to next track in queue:', nextTrack);
          goToNext();
        } else {
          // Queue finished - play random track and clear queue
          console.log('Queue finished, playing random track from same category');
          const lastQueueTrack = queue[queue.length - 1];
          if (user && lastQueueTrack?.category_id) {
            const randomTrack = getRandomTrackFromCategory(lastQueueTrack.category_id, lastQueueTrack.id);
            if (randomTrack) {
              console.log('Playing random track from category:', randomTrack.title);
              playSingleTrackAndClearQueue(randomTrack);
            }
          }
        }
      } else if (user && isSingleTrackMode && currentTrack?.category_id) {
        // Single track ended - play another from same category
        console.log('Single track ended, playing random track from same category');
        const randomTrack = getRandomTrackFromCategory(currentTrack.category_id, currentTrack.id);
        if (randomTrack) {
          console.log('Playing random track from category:', randomTrack.title);
          replaceQueue(randomTrack);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('seeked', handleSeeked);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('seeked', handleSeeked);
    };
  }, [currentTrack, loopMode, hasActiveQueue, isSingleTrackMode, goToNext, getNextTrack, queue, replaceQueue, playSingleTrackAndClearQueue, user]);

  // Handle audio source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Only change source if it's a different track
    if (currentTrack.id !== lastTrackId) {
      console.log('Changing audio source to:', currentTrack.title);
      audio.src = currentTrack.file_path;
      setLastTrackId(currentTrack.id);
      setCurrentTime(0);
    }
  }, [currentTrack, lastTrackId]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      console.log('Audio playback effect: No audio or track.');
      return;
    }

    console.log('Audio play state effect:', { isPlaying, currentTrack: currentTrack?.title, currentTime: audio.currentTime });

    if (isPlaying) {
      console.log('Attempting to play...');
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.error('Audio play error:', error));
      }
    } else {
      console.log('Attempting to pause...');
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleSeekChange = (value: number[]) => {
    isSeeking.current = true;
    setCurrentTime(value[0]);
  };

  const handleSeekCommit = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      const time = value[0];
      console.log(`Seeking to: ${time}. Current play state: ${isPlaying}. Track: ${currentTrack?.title}`);
      audio.currentTime = time;
    } else {
      // Fallback in case audio element isn't there
      isSeeking.current = false;
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
      } else {
        // Queue finished - play random track from same category as last queue track
        console.log('Queue finished, playing random from last track category');
        const lastQueueTrack = queue[queue.length - 1];
        if (lastQueueTrack?.category_id) {
          const randomTrack = getRandomTrackFromCategory(lastQueueTrack.category_id, lastQueueTrack.id);
          if (randomTrack) {
            console.log('Playing random track from category:', randomTrack.title);
            playSingleTrackAndClearQueue(randomTrack);
            return;
          }
        }
      }
    }

    // If there's a paused queue, resume it
    if (hasPausedQueue) {
      console.log('Resuming paused queue');
      resumeQueue();
      return;
    }

    // If in single track mode, play another from same category
    if (isSingleTrackMode && currentTrack?.category_id) {
      console.log('Single track mode - playing random from same category');
      const randomTrack = getRandomTrackFromCategory(currentTrack.category_id, currentTrack.id);
      if (randomTrack) {
        console.log('Playing random track from category:', randomTrack.title);
        replaceQueue(randomTrack);
        return;
      }
    }

    console.log('No next track available');
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

    // If there's a paused queue, resume it
    if (hasPausedQueue) {
      console.log('Resuming paused queue');
      resumeQueue();
      return;
    }

    // If in single track mode, play another from same category
    if (isSingleTrackMode && currentTrack?.category_id) {
      console.log('Single track mode - playing random from same category');
      const randomTrack = getRandomTrackFromCategory(currentTrack.category_id, currentTrack.id);
      if (randomTrack) {
        console.log('Playing random track from category:', randomTrack.title);
        replaceQueue(randomTrack);
        return;
      }
    }

    console.log('No previous track available');
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

  // Navigation buttons logic - next/previous should always be available
  const canGoNext = true; // Always allow next (will find track from category)
  const canGoPrevious = hasActiveQueue || hasPausedQueue || isSingleTrackMode;

  if (!currentTrack) return null;

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
      />
      <Card className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-white/10 p-2 sm:p-4 z-40">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="flex items-center justify-between mb-2 gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <MarqueeTitle title={currentTrack.title} />
              <div className="flex items-center space-x-2">
                <p className="text-white/60 text-sm truncate">{currentTrack.categories?.name}</p>
                {isSingleTrackMode && hasPausedQueue && (
                  <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                    Queue Paused
                  </span>
                )}
                {hasActiveQueue && (
                  <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">
                    Queue Active
                  </span>
                )}
                {isSingleTrackMode && !hasPausedQueue && (
                  <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded">
                    Single Track
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-0 sm:space-x-1">
              <Button
                variant="ghost"
                size="icon"
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
              
              {(!user || !subscribed) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
              )}
              
              {user && subscribed && (
                <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="text-white hover:bg-white/10"
                  disabled={!canGoPrevious}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
              
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/10 w-12 h-12"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="text-white hover:bg-white/10"
                  disabled={!canGoNext}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-white/60 text-xs sm:text-sm min-w-[35px] sm:min-w-[40px] text-center">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekCommit}
                className="w-full audio-progress-slider"
              />
            </div>
            
            <span className="text-white/60 text-xs sm:text-sm min-w-[35px] sm:min-w-[40px] text-center">
              {formatTime(duration)}
            </span>
            
            <div className="hidden md:flex items-center space-x-2 md:min-w-[100px]">
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
