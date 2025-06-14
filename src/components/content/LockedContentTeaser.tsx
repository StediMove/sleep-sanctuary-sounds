
import { Lock } from 'lucide-react';
import TrackCard from '@/components/content/TrackCard';
import { getPremiumTrackCount, getTrendingTracks, realCategories } from '@/utils/audioContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LockedContentTeaser = () => {
    const premiumTrackCount = getPremiumTrackCount();
    const lockedTracks = getTrendingTracks().slice(0, 2);

    const mappedTracks = lockedTracks.map(track => ({
        ...track,
        categories: { name: realCategories.find(cat => cat.id === track?.category)?.name || 'Unknown' }
    }));

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 blur-sm grayscale pointer-events-none">
                {mappedTracks.map((track) => (
                    <div key={track.id}>
                        <TrackCard
                            track={track}
                            isPlaying={false}
                            onPlay={() => {}}
                            onAddToQueue={() => {}}
                            onPlayNext={() => {}}
                            onReplaceQueue={() => {}}
                        />
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10 p-8 text-center">
                <div className="bg-slate-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10">
                    <Lock className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                    Unlock {premiumTrackCount}+ Premium Tracks
                </h3>
                <p className="text-white/70 mb-6 max-w-sm font-light">
                    Sign up for free to access our full library of bedtime stories, calming sounds, and meditation music.
                </p>
                <Link to="/auth">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg button-pulse"
                    >
                        Create Your Free Account
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default LockedContentTeaser;
