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

  // Track history for previous button
  const [trackHistory, setTrackHistory] = useState<QueueTrack[]>([]);

  const addToTrackHistory = useCallback((track: QueueTrack) => {
    setTrackHistory(prev => {
      // Don't add duplicate consecutive tracks
      if (prev.length > 0 && prev[prev.length - 1].id === track.id) {
        return prev;
      }
      // Keep only last 50 tracks to prevent memory issues
      const newHistory = [...prev, track];
      return newHistory.slice(-50);
    });
  }, []);

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
    
    // Add current track to history before switching
    const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
    if (currentTrack) {
      addToTrackHistory(currentTrack);
    }
    
    // If we have an active queue, pause it
    if (queue.length > 0 && !isSingleTrackMode) {
      console.log('Pausing current queue to play single track');
      setPausedQueue([...queue]); // Keep the actual queue
      setPausedIndex(currentIndex);
    }
    
    // Set single track mode but don't clear the queue
    setSingleTrack(track);
    setIsSingleTrackMode(true);
    // Don't clear the queue here - just set single track mode
    setCurrentIndex(0);
  }, [queue, currentIndex, isSingleTrackMode, singleTrack, addToTrackHistory]);

  const resumeQueue = useCallback(() => {
    console.log('Resuming paused queue');
    if (pausedQueue.length > 0) {
      // Add current single track to history
      if (isSingleTrackMode && singleTrack) {
        addToTrackHistory(singleTrack);
      }
      
      setQueue([...pausedQueue]);
      setCurrentIndex(pausedIndex);
      setIsSingleTrackMode(false);
      setSingleTrack(null);
      setPausedQueue([]);
      setPausedIndex(0);
    }
  }, [pausedQueue, pausedIndex, isSingleTrackMode, singleTrack, addToTrackHistory]);

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

  const playSingleTrackAndClearQueue = useCallback((track: QueueTrack) => {
    console.log('Clearing queue and playing single track:', track.title);
    
    // Add current track to history before switching
    const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
    if (currentTrack) {
      addToTrackHistory(currentTrack);
    }
    
    setQueue([]);
    setPausedQueue([]);
    setPausedIndex(0);
    setOriginalQueue([]);
    setIsShuffled(false);
    
    setSingleTrack(track);
    setIsSingleTrackMode(true);
    setCurrentIndex(0);
  }, [queue, currentIndex, isSingleTrackMode, singleTrack, addToTrackHistory]);

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
    // If in single track mode, no next track in queue context
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
    // Always check history first for previous track
    if (trackHistory.length > 0) {
      return trackHistory[trackHistory.length - 1];
    }
    
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
  }, [queue, currentIndex, loopMode, isSingleTrackMode, pausedQueue, pausedIndex, trackHistory]);

  const goToNext = useCallback(() => {
    console.log('Going to next track');
    
    // Add current track to history when moving to next
    const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
    if (currentTrack) {
      addToTrackHistory(currentTrack);
    }
    
    if (isSingleTrackMode) {
      // If we have a paused queue, resume it
      if (pausedQueue.length > 0) {
        console.log('Resuming paused queue from single track');
        resumeQueue();
        return;
      }
      // Single track mode - handled by AudioPlayer
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
  }, [currentIndex, queue.length, loopMode, isSingleTrackMode, pausedQueue, resumeQueue, singleTrack, addToTrackHistory]);

  const goToPrevious = useCallback(() => {
    console.log('Going to previous track');
    
    // Check if we have a track in history
    if (trackHistory.length > 0) {
      const previousTrack = trackHistory[trackHistory.length - 1];
      console.log('Playing previous track from history:', previousTrack.title);
      
      // Remove the track from history
      setTrackHistory(prev => prev.slice(0, -1));
      
      // Add current track to history before switching
      const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
      if (currentTrack && currentTrack.id !== previousTrack.id) {
        addToTrackHistory(currentTrack);
      }
      
      // Play the previous track as single track
      setSingleTrack(previousTrack);
      setIsSingleTrackMode(true);
      
      // If we had an active queue, pause it
      if (queue.length > 0 && !isSingleTrackMode) {
        setPausedQueue([...queue]);
        setPausedIndex(currentIndex);
      }
      
      return;
    }
    
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
      
      // Add current track to history
      const currentTrack = queue[currentIndex];
      if (currentTrack) {
        addToTrackHistory(currentTrack);
      }
      
      setCurrentIndex(prevIndex);
    } else if (loopMode === 'all') {
      const lastIndex = queue.length - 1;
      console.log('Looping to end, index:', lastIndex);
      
      // Add current track to history
      const currentTrack = queue[currentIndex];
      if (currentTrack) {
        addToTrackHistory(currentTrack);
      }
      
      setCurrentIndex(lastIndex);
    }
  }, [currentIndex, queue, loopMode, isSingleTrackMode, pausedQueue, resumeQueue, trackHistory, singleTrack, addToTrackHistory]);

  const playTrackAt = useCallback((index: number) => {
    console.log('Playing track at index:', index);
    if (index >= 0 && index < queue.length) {
      // Add current track to history before switching
      const currentTrack = isSingleTrackMode ? singleTrack : (queue.length > 0 ? queue[currentIndex] : null);
      if (currentTrack) {
        addToTrackHistory(currentTrack);
      }
      
      setCurrentIndex(index);
      setIsSingleTrackMode(false);
      setSingleTrack(null);
    }
  }, [queue.length, isSingleTrackMode, singleTrack, currentIndex, addToTrackHistory]);

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
    pausedQueueLength: pausedQueue.length,
    currentIndex,
    currentTrack: currentTrack?.title,
    hasActiveQueue,
    hasPausedQueue,
    trackHistoryLength: trackHistory.length
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
    playSingleTrackAndClearQueue,
    playTrackAt,
  };
};
