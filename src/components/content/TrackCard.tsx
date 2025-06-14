import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, MoreVertical, Plus, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QueueTrack } from '@/hooks/useQueue';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    description?: string;
    duration?: number;
    is_premium: boolean;
    tags?: string[];
    thumbnail_url?: string;
    categories?: { name: string };
    category_id?: string;
    file_path?: string;
  };
  isPlaying?: boolean;
  onPlay: () => void;
  onFavorite?: () => void;
  onAddToQueue?: (track: QueueTrack) => void;
  onPlayNext?: (track: QueueTrack) => void;
  onReplaceQueue?: (track: QueueTrack) => void;
}

const TrackCard = ({ 
  track, 
  isPlaying, 
  onPlay, 
  onAddToQueue,
  onPlayNext,
  onReplaceQueue 
}: TrackCardProps) => {
  // Category color mapping
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

  const categoryColors = getCategoryColor(track.categories?.name || '');

  const queueTrack: QueueTrack = {
    id: track.id,
    title: track.title,
    description: track.description,
    duration: track.duration,
    is_premium: track.is_premium,
    tags: track.tags,
    thumbnail_url: track.thumbnail_url,
    categories: track.categories,
    category_id: track.category_id,
    file_path: track.file_path || '',
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="glass-card glass-card-hover group relative overflow-hidden h-48 cursor-pointer"
      onClick={onPlay}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start space-x-6 flex-1">
          {/* Thumbnail and Play Button */}
          <div className="flex flex-col items-center space-y-2 w-20 shrink-0">
            {/* Enhanced Thumbnail */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                {track.thumbnail_url ? (
                  <img 
                    src={track.thumbnail_url} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = isPlaying 
                        ? '<svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
                        : '<svg class="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="m7 4 10 6L7 16V4z"/></svg>';
                    }}
                  />
                ) : (
                  isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )
                )}
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-pulse" />
              )}
            </div>
            
            {/* Play Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className={`${
                isPlaying 
                  ? 'text-purple-400 bg-purple-400/10' 
                  : 'text-white/80 hover:text-white'
              } hover:bg-white/10 rounded-lg font-medium button-pulse transition-all duration-300 text-xs w-full`}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-1.5" />
              ) : (
                <Play className="h-4 w-4 mr-1.5" />
              )}
              {isPlaying ? 'Playing' : 'Play'}
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <h3 className="text-white font-medium text-lg truncate group-hover:text-white/90 transition-colors duration-300 w-full sm:w-auto sm:flex-1">
                  {track.title}
                </h3>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-2 shrink-0">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border text-xs font-medium px-2 py-1`}
                  >
                    {track.categories?.name || 'Unknown'}
                  </Badge>
                  {(onAddToQueue || onPlayNext || onReplaceQueue) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                          onClick={handleMenuClick}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="bg-slate-800 border-white/10 text-white"
                        onClick={handleMenuClick}
                        align="end"
                      >
                        {onAddToQueue && (
                          <DropdownMenuItem onClick={() => onAddToQueue(queueTrack)} className="hover:bg-white/10 focus:bg-white/10">
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Queue
                          </DropdownMenuItem>
                        )}
                        {onPlayNext && (
                          <DropdownMenuItem onClick={() => onPlayNext(queueTrack)} className="hover:bg-white/10 focus:bg-white/10">
                              <Play className="h-4 w-4 mr-2" />
                              Play Next
                          </DropdownMenuItem>
                        )}
                        {onReplaceQueue && (
                          <>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => onReplaceQueue(queueTrack)} className="hover:bg-white/10 focus:bg-white/10">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Replace Queue
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              
              {track.description && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                  {track.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
