
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { QueueTrack } from '@/hooks/useQueue';
import { Plus, Play, RotateCcw } from 'lucide-react';

interface TrackContextMenuProps {
  children: React.ReactNode;
  track: QueueTrack;
  onAddToQueue: (track: QueueTrack) => void;
  onPlayNext: (track: QueueTrack) => void;
  onReplaceQueue: (track: QueueTrack) => void;
}

const TrackContextMenu: React.FC<TrackContextMenuProps> = ({
  children,
  track,
  onAddToQueue,
  onPlayNext,
  onReplaceQueue
}) => {
  const handleAddToQueue = () => {
    console.log('Adding to queue:', track);
    onAddToQueue(track);
  };

  const handlePlayNext = () => {
    console.log('Playing next:', track);
    onPlayNext(track);
  };

  const handleReplaceQueue = () => {
    console.log('Replacing queue:', track);
    onReplaceQueue(track);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-slate-800 border-white/10 text-white">
        <ContextMenuItem 
          onClick={handleAddToQueue}
          className="hover:bg-white/10 focus:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Queue
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handlePlayNext}
          className="hover:bg-white/10 focus:bg-white/10"
        >
          <Play className="h-4 w-4 mr-2" />
          Play Next
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuItem 
          onClick={handleReplaceQueue}
          className="hover:bg-white/10 focus:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Replace Queue
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TrackContextMenu;
