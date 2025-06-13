
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';

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
  };
  isPlaying?: boolean;
  onPlay: () => void;
  onFavorite?: () => void;
}

const TrackCard = ({ track, isPlaying, onPlay }: TrackCardProps) => {
  // Category color mapping
  const getCategoryColor = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'bedtime stories':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
      case 'meditation music':
        return { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-400/30' };
      case 'calming sounds':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/30' };
    }
  };

  const categoryColors = getCategoryColor(track.categories?.name || '');

  return (
    <Card className="glass-card glass-card-hover group relative overflow-hidden h-48">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start space-x-6 flex-1">
          {/* Enhanced Thumbnail */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-pulse" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium text-lg truncate group-hover:text-white/90 transition-colors duration-300">
                  {track.title}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={`${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border text-xs font-medium px-2 py-1 ml-2`}
                >
                  {track.categories?.name || 'Unknown'}
                </Badge>
              </div>
              
              {track.description && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                  {track.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlay}
                  className={`${
                    isPlaying 
                      ? 'text-purple-400 bg-purple-400/10' 
                      : 'text-white hover:text-purple-300'
                  } hover:bg-white/10 rounded-xl px-4 py-2 font-medium button-pulse transition-all duration-300`}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2 ml-0.5" />
                  )}
                  {isPlaying ? 'Playing' : 'Play'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
