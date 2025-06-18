import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { useToast } from './use-toast';
import { getSampleTracks } from '@/utils/audioContent';

interface PlaybackRestrictionsContextType {
  canPlayTrack: (trackId: string) => boolean;
  canUseAutoplay: () => boolean;
  getAccessibleTracks: () => any[];
  showUpgradePrompt: (reason: string) => void;
  isTrackAccessible: (trackId: string) => boolean;
  getPlaybackMessage: (trackId: string) => string | null;
}

const PlaybackRestrictionsContext = createContext<PlaybackRestrictionsContextType | undefined>(undefined);

export const PlaybackRestrictionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { toast } = useToast();

  // Get the 3 sample tracks that are always accessible
  const sampleTracks = getSampleTracks();
  const sampleTrackIds = sampleTracks.map(track => track?.id).filter(Boolean);

  const canPlayTrack = (trackId: string): boolean => {
    // Paid subscribers can play any track
    if (user && subscribed) {
      return true;
    }

    // Non-users and free users can only play sample tracks
    return sampleTrackIds.includes(trackId);
  };

  const canUseAutoplay = (): boolean => {
    // Only paid subscribers get autoplay functionality
    return user && subscribed;
  };

  const getAccessibleTracks = (): any[] => {
    if (user && subscribed) {
      // Paid subscribers get all tracks - this would come from your full track list
      return []; // Return all tracks from your data source
    }

    // Non-users and free users only get sample tracks
    return sampleTracks.filter(Boolean);
  };

  const isTrackAccessible = (trackId: string): boolean => {
    return canPlayTrack(trackId);
  };

  const getPlaybackMessage = (trackId: string): string | null => {
    if (canPlayTrack(trackId)) {
      return null;
    }

    if (!user) {
      return "Sign up to access more content";
    }

    if (user && !subscribed) {
      return "Subscribe to unlock this premium track";
    }

    return null;
  };

  const showUpgradePrompt = (reason: string) => {
    if (!user) {
      toast({
        title: "Sign up required",
        description: "Create a free account to access sample tracks and explore our content.",
        variant: "default",
        duration: 5000,
      });
    } else if (!subscribed) {
      toast({
        title: "Premium content",
        description: `${reason}. Subscribe for full access to our complete library.`,
        variant: "default",
        duration: 5000,
      });
    }
  };

  return (
    <PlaybackRestrictionsContext.Provider value={{
      canPlayTrack,
      canUseAutoplay,
      getAccessibleTracks,
      showUpgradePrompt,
      isTrackAccessible,
      getPlaybackMessage,
    }}>
      {children}
    </PlaybackRestrictionsContext.Provider>
  );
};

export const usePlaybackRestrictions = () => {
  const context = useContext(PlaybackRestrictionsContext);
  if (context === undefined) {
    throw new Error('usePlaybackRestrictions must be used within a PlaybackRestrictionsProvider');
  }
  return context;
};