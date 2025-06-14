import { useState, useCallback } from 'react';

export type QueueTrack = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  is_premium: boolean;
  tags?: string[];
  thumbnail_url?: string;
  categories?: { name: string };
  category_id?: string;
  file_path: string;
};

export type LoopMode = 'none' | 'one' | 'all';

export const useQueue = () => {
  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loopMode, setLoopMode] = useState<LoopMode>('none');
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState<QueueTrack[]>([]);
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  
  // Single track state (for tracks played outside of queue)
  const [singleTrack, setSingleTrack] = useState<QueueTrack | null>(null);
  const [isSingleTrackMode, setIsSingleTrackMode] = useState(false);
  
  // Paused queue state
  const [pausedQueue, setPausedQueue] = useState<QueueTrack[]>([]);
  const [pausedIndex, setPausedIndex] = useState(0);

  const addToQueue = useCallback((track: QueueTrack) => {
    console.log('Adding track to queue:', track);
    setQueue(prev => {
      const newQueue = [...prev, track];
      console.log('Queue after adding:', newQueue);
      return newQueue;
    });
    
    // If we're in single track mode, switch to queue mode
    if (isSingleTrackMode) {
      setIsSingleTrackMode(false);
      setSingleTrack(null);
    }
  }, [isSingleTrackMode]);

  const playNext = useCallback((track: QueueTrack) => {
    console.log('Adding track to play next:', track);
    setQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, track);
      console.log('Queue after play next:', newQueue);
      return newQueue;
    });
    
    if (isSingleTrackMode) {
      setIsSingleTrackMode(false);
      setSingleTrack(null);
    }
  }, [currentIndex, isSingleTrackMode]);

  const replaceQueue = useCallback((track: QueueTrack) => {
    console.log('Replacing queue with track:', track);
    
    // If we have an active queue, pause it
    if (queue.length > 0 && !isSingleTrackMode) {
      console.log('Pausing current queue to play single track');
      setPausedQueue([...queue]);
      setPausedIndex(currentIndex);
    }
    
    // Set single track mode
    setSingleTrack(track);
    setIsSingleTrackMode(true);
    setQueue([]);
    setCurrentIndex(0);
  }, [queue, currentIndex, isSingleTrackMode]);

  const resumeQueue = useCallback(() => {
    console.log('Resuming paused queue');
    if (pausedQueue.length > 0) {
      setQueue([...pausedQueue]);
      setCurrentIndex(pausedIndex);
      setIsSingleTrackMode(false);
      setSingleTrack(null);
      setPausedQueue([]);
      setPausedIndex(0);
    }
  }, [pausedQueue, pausedIndex]);

  const removeFromQueue = useCallback((index: number) => {
    console.log('Removing track at index:', index);
    setQueue(prev => {
      const newQueue = prev.filter((_, i) => i !== index);
      if (index < currentIndex) {
        setCurrentIndex(prev => prev - 1);
      } else if (index === currentIndex && newQueue.length > 0) {
        setCurrentIndex(prev => Math.min(prev, newQueue.length - 1));
      }
      console.log('Queue after removal:', newQueue);
      return newQueue;
    });
  }, [currentIndex]);

  const clearQueue = useCallback(() => {
    console.log('Clearing queue');
    setQueue([]);
    setCurrentIndex(0);
    setIsShuffled(false);
    setOriginalQueue([]);
    setPausedQueue([]);
    setPausedIndex(0);
    
    // Don't clear single track when clearing queue
  }, []);

  const moveTrack = useCallback((fromIndex: number, toIndex: number) => {
    console.log('Moving track from', fromIndex, 'to', toIndex);
    setQueue(prev => {
      const newQueue = [...prev];
      const [movedTrack] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedTrack);
      
      if (fromIndex === currentIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex(prev => prev - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex(prev => prev + 1);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  const getNextTrack = useCallback(() => {
    // If in single track mode, no next track in queue
    if (isSingleTrackMode) return null;
    
    if (queue.length === 0) return null;
    
    if (loopMode === 'one') {
      return queue[currentIndex];
    }
    
    if (currentIndex < queue.length - 1) {
      return queue[currentIndex + 1];
    }
    
    if (loopMode === 'all') {
      return queue[0];
    }
    
    return null;
  }, [queue, currentIndex, loopMode, isSingleTrackMode]);

  const getPreviousTrack = useCallback(() => {
    // If in single track mode, check for paused queue
    if (isSingleTrackMode && pausedQueue.length > 0) {
      return pausedQueue[pausedIndex];
    }
    
    if (queue.length === 0) return null;
    
    if (currentIndex > 0) {
      return queue[currentIndex - 1];
    }
    
    if (loopMode === 'all') {
      return queue[queue.length - 1];
    }
    
    return null;
  }, [queue, currentIndex, loopMode, isSingleTrackMode, pausedQueue, pausedIndex]);

  const goToNext = useCallback(() => {
    console.log('Going to next track');
    
    if (isSingleTrackMode) {
      // If we have a paused queue, resume it
      if (pausedQueue.length > 0) {
        console.log('Resuming paused queue from single track');
        resumeQueue();
        return;
      }
      // Otherwise, no next track in single mode
      return;
    }
    
    if (loopMode === 'one') return;
    
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('Moving to index:', nextIndex);
      setCurrentIndex(nextIndex);
    } else if (loopMode === 'all') {
      console.log('Looping back to start');
      setCurrentIndex(0);
    }
  }, [currentIndex, queue.length, loopMode, isSingleTrackMode, pausedQueue, resumeQueue]);

  const goToPrevious = useCallback(() => {
    console.log('Going to previous track');
    
    if (isSingleTrackMode) {
      // If we have a paused queue, resume it
      if (pausedQueue.length > 0) {
        console.log('Resuming paused queue from single track');
        resumeQueue();
        return;
      }
      return;
    }
    
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      console.log('Moving to index:', prevIndex);
      setCurrentIndex(prevIndex);
    } else if (loopMode === 'all') {
      const lastIndex = queue.length - 1;
      console.log('Looping to end, index:', lastIndex);
      setCurrentIndex(lastIndex);
    }
  }, [currentIndex, queue.length, loopMode, isSingleTrackMode, pausedQueue, resumeQueue]);

  const playTrackAt = useCallback((index: number) => {
    console.log('Playing track at index:', index);
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      setIsSingleTrackMode(false);
      setSingleTrack(null);
    }
  }, [queue.length]);

  const shuffleQueue = useCallback(() => {
    if (isSingleTrackMode) return;
    
    if (!isShuffled) {
      setOriginalQueue([...queue]);
      setQueue(prev => {
        const currentTrack = prev[currentIndex];
        const otherTracks = prev.filter((_, i) => i !== currentIndex);
        const shuffled = [...otherTracks].sort(() => Math.random() - 0.5);
        return [currentTrack, ...shuffled];
      });
      setCurrentIndex(0);
      setIsShuffled(true);
    } else {
      if (originalQueue.length > 0) {
        const currentTrack = queue[currentIndex];
        const originalIndex = originalQueue.findIndex(track => track.id === currentTrack.id);
        setQueue(originalQueue);
        setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
        setOriginalQueue([]);
      }
      setIsShuffled(false);
    }
  }, [queue, currentIndex, isShuffled, originalQueue, isSingleTrackMode]);

  // Current track logic: single track takes priority over queue
  const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
  const hasActiveQueue = queue.length > 0 && !isSingleTrackMode;
  const hasPausedQueue = pausedQueue.length > 0;

  console.log('Queue state:', {
    isSingleTrackMode,
    singleTrack: singleTrack?.title,
    queueLength: queue.length,
    currentIndex,
    currentTrack: currentTrack?.title,
    hasActiveQueue,
    hasPausedQueue
  });

  return {
    queue,
    currentTrack,
    currentIndex,
    loopMode,
    isShuffled,
    isGlobalPlaying,
    isSingleTrackMode,
    hasActiveQueue,
    hasPausedQueue,
    setLoopMode,
    setIsGlobalPlaying,
    addToQueue,
    playNext,
    replaceQueue,
    removeFromQueue,
    clearQueue,
    moveTrack,
    shuffleQueue,
    resumeQueue,
    getNextTrack,
    getPreviousTrack,
    goToNext,
    goToPrevious,
    playTrackAt,
  };
};
