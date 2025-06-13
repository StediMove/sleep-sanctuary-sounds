
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock } from 'lucide-react';

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
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium truncate">{track.title}</h3>
              <div className="flex items-center space-x-1 ml-2">
                {track.is_premium && (
                  <Badge variant="secondary" className="bg-purple-600 text-xs">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            
            {track.description && (
              <p className="text-white/70 text-sm mb-2 line-clamp-2">{track.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlay}
                  className={`${isPlaying ? 'text-purple-400' : 'text-white'} hover:bg-white/10`}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {isPlaying ? 'Playing' : 'Play'}
                </Button>
              </div>
              
              {track.duration && (
                <div className="flex items-center text-white/60 text-sm">
                  <Clock className="h-3 w-3 mr-1" />
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
