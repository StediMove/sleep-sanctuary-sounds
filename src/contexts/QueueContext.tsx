
import React, { createContext, useContext, ReactNode } from 'react';
import { useQueue as useQueueHook, QueueTrack, LoopMode } from '@/hooks/useQueue';

interface QueueContextType {
  queue: QueueTrack[];
  currentTrack: QueueTrack | null;
  currentIndex: number;
  loopMode: LoopMode;
  isShuffled: boolean;
  setLoopMode: (mode: LoopMode) => void;
  addToQueue: (track: QueueTrack) => void;
  playNext: (track: QueueTrack) => void;
  replaceQueue: (track: QueueTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  moveTrack: (fromIndex: number, toIndex: number) => void;
  shuffleQueue: () => void;
  getNextTrack: () => QueueTrack | null;
  getPreviousTrack: () => QueueTrack | null;
  goToNext: () => void;
  goToPrevious: () => void;
  playTrackAt: (index: number) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queueHook = useQueueHook();
  
  return (
    <QueueContext.Provider value={queueHook}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueueContext must be used within a QueueProvider');
  }
  return context;
};
