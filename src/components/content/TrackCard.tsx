
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Clock, Sparkles } from 'lucide-react';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    description?: string;
    duration?: number;
    is_premium: boolean;
    tags?: string[];
    thumbnail_url?: string;
  };
  isPlaying?: boolean;
  onPlay: () => void;
}

const TrackCard = ({ track, isPlaying, onPlay }: TrackCardProps) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`glass-card glass-card-hover group relative overflow-hidden ${track.is_premium ? 'premium-glow' : ''}`}>
      {/* Premium sparkle effect */}
      {track.is_premium && (
        <div className="absolute top-4 right-4 text-gold animate-pulse">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-medium text-lg truncate group-hover:text-white/90 transition-colors duration-300">
                {track.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                {track.is_premium && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-gold/20 to-yellow-400/20 text-gold border-gold/30 text-xs font-medium px-2 py-1"
                  >
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            
            {track.description && (
              <p className="text-white/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                {track.description}
              </p>
            )}
            
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
              
              {track.duration && (
                <div className="flex items-center text-white/60 text-sm font-light">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {formatDuration(track.duration)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
