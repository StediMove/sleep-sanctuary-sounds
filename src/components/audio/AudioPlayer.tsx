
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Heart, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AudioPlayerProps {
  currentTrack?: {
    id: string;
    title: string;
    file_path: string;
    duration?: number;
    is_premium: boolean;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const AudioPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onFavorite,
  isFavorite = false
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [sleepTimer, setSleepTimer] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.file_path;
    
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="container mx-auto text-center text-white/50">
          Select a track to start playing
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} />
      
      {/* Mini Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4">
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-medium truncate">{currentTrack.title}</h3>
                {currentTrack.is_premium && (
                  <Badge variant="secondary" className="bg-purple-600">Premium</Badge>
                )}
              </div>
              <div className="text-sm text-white/60">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                disabled={!onPrevious}
                className="text-white hover:bg-white/10"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onPlayPause}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!onNext}
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onFavorite}
                className={`${isFavorite ? 'text-red-400' : 'text-white'} hover:bg-white/10`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <div className="flex items-center space-x-2 w-24">
                <Volume2 className="h-4 w-4 text-white" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
