
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

  const addToQueue = useCallback((track: QueueTrack) => {
    console.log('Adding track to queue:', track);
    setQueue(prev => {
      const newQueue = [...prev, track];
      console.log('Queue after adding:', newQueue);
      return newQueue;
    });
  }, []);

  const playNext = useCallback((track: QueueTrack) => {
    console.log('Adding track to play next:', track);
    setQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, track);
      console.log('Queue after play next:', newQueue);
      return newQueue;
    });
  }, [currentIndex]);

  const replaceQueue = useCallback((track: QueueTrack) => {
    console.log('Replacing queue with track:', track);
    setQueue([track]);
    setCurrentIndex(0);
    setIsShuffled(false);
    setOriginalQueue([]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    console.log('Removing track at index:', index);
    setQueue(prev => {
      const newQueue = prev.filter((_, i) => i !== index);
      if (index < currentIndex) {
        setCurrentIndex(prev => prev - 1);
      } else if (index === currentIndex && newQueue.length > 0) {
        // If removing current track, adjust index
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
  }, []);

  const moveTrack = useCallback((fromIndex: number, toIndex: number) => {
    console.log('Moving track from', fromIndex, 'to', toIndex);
    setQueue(prev => {
      const newQueue = [...prev];
      const [movedTrack] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedTrack);
      
      // Adjust current index if needed
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

  const shuffleQueue = useCallback(() => {
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
      // Restore original order
      if (originalQueue.length > 0) {
        const currentTrack = queue[currentIndex];
        const originalIndex = originalQueue.findIndex(track => track.id === currentTrack.id);
        setQueue(originalQueue);
        setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
        setOriginalQueue([]);
      }
      setIsShuffled(false);
    }
  }, [queue, currentIndex, isShuffled, originalQueue]);

  const getNextTrack = useCallback(() => {
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
  }, [queue, currentIndex, loopMode]);

  const getPreviousTrack = useCallback(() => {
    if (queue.length === 0) return null;
    
    if (currentIndex > 0) {
      return queue[currentIndex - 1];
    }
    
    if (loopMode === 'all') {
      return queue[queue.length - 1];
    }
    
    return null;
  }, [queue, currentIndex, loopMode]);

  const goToNext = useCallback(() => {
    console.log('Going to next track, current index:', currentIndex);
    if (loopMode === 'one') return;
    
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('Moving to index:', nextIndex);
      setCurrentIndex(nextIndex);
    } else if (loopMode === 'all') {
      console.log('Looping back to start');
      setCurrentIndex(0);
    }
  }, [currentIndex, queue.length, loopMode]);

  const goToPrevious = useCallback(() => {
    console.log('Going to previous track, current index:', currentIndex);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      console.log('Moving to index:', prevIndex);
      setCurrentIndex(prevIndex);
    } else if (loopMode === 'all') {
      const lastIndex = queue.length - 1;
      console.log('Looping to end, index:', lastIndex);
      setCurrentIndex(lastIndex);
    }
  }, [currentIndex, queue.length, loopMode]);

  const playTrackAt = useCallback((index: number) => {
    console.log('Playing track at index:', index);
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
    }
  }, [queue.length]);

  const currentTrack = queue[currentIndex] || null;

  return {
    queue,
    currentTrack,
    currentIndex,
    loopMode,
    isShuffled,
    setLoopMode,
    addToQueue,
    playNext,
    replaceQueue,
    removeFromQueue,
    clearQueue,
    moveTrack,
    shuffleQueue,
    getNextTrack,
    getPreviousTrack,
    goToNext,
    goToPrevious,
    playTrackAt,
  };
};
