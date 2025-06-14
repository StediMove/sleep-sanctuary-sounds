
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { QueueTrack } from '@/hooks/useQueue';
import TrackContextMenu from './TrackContextMenu';
import { 
  ListMusic, 
  Play, 
  X, 
  GripVertical, 
  Trash2,
  Music,
  MoreVertical
} from 'lucide-react';

interface QueueDrawerProps {
  queue: QueueTrack[];
  currentIndex: number;
  onPlayTrack: (index: number) => void;
  onRemoveTrack: (index: number) => void;
  onClearQueue: () => void;
  onMoveTrack: (fromIndex: number, toIndex: number) => void;
  onAddToQueue: (track: QueueTrack) => void;
  onPlayNext: (track: QueueTrack) => void;
  onReplaceQueue: (track: QueueTrack) => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({
  queue,
  currentIndex,
  onPlayTrack,
  onRemoveTrack,
  onClearQueue,
  onMoveTrack,
  onAddToQueue,
  onPlayNext,
  onReplaceQueue
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  console.log('QueueDrawer render:', { queueLength: queue.length, currentIndex, queue });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onMoveTrack(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handlePlayTrack = (index: number) => {
    console.log('Playing track at index:', index);
    onPlayTrack(index);
  };

  const handleRemoveTrack = (index: number) => {
    console.log('Removing track at index:', index);
    onRemoveTrack(index);
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'bedtime stories':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
      case 'meditation music':
        return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
      case 'calming sounds':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/30' };
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <ListMusic className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-white/10 text-white max-h-[80vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5" />
              Queue ({queue.length} tracks)
            </DrawerTitle>
            {queue.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearQueue}
                className="text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 p-4">
          {queue.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tracks in queue</p>
              <p className="text-sm">Add tracks to start building your playlist</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((track, index) => {
                const categoryColors = getCategoryColor(track.categories?.name || '');
                const isCurrentTrack = index === currentIndex;
                
                return (
                  <div
                    key={`${track.id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move
                      ${isCurrentTrack 
                        ? 'bg-purple-500/20 border-purple-400/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                      ${draggedIndex === index ? 'opacity-50' : ''}
                    `}
                  >
                    <GripVertical className="h-4 w-4 text-white/40 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium truncate ${isCurrentTrack ? 'text-purple-300' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        {track.categories?.name && (
                          <Badge 
                            variant="secondary" 
                            className={`${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border text-xs`}
                          >
                            {track.categories.name}
                          </Badge>
                        )}
                      </div>
                      {track.description && (
                        <p className="text-white/60 text-sm truncate">
                          {track.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayTrack(index)}
                        className={`${isCurrentTrack ? 'text-purple-300' : 'text-white'} hover:bg-white/10`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>

                      <TrackContextMenu
                        track={track}
                        onAddToQueue={onAddToQueue}
                        onPlayNext={onPlayNext}
                        onReplaceQueue={onReplaceQueue}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/10"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TrackContextMenu>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTrack(index)}
                        className="text-red-400 hover:bg-red-400/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default QueueDrawer;
