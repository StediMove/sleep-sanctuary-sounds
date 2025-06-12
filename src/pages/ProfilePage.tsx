
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Heart, Play } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['userFavorites', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          audio_content (
            id,
            title,
            description,
            duration,
            is_premium,
            categories (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch listening history
  const { data: recentlyPlayed = [] } = useQuery({
    queryKey: ['recentlyPlayed', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listening_history')
        .select(`
          *,
          audio_content (
            id,
            title,
            description,
            duration,
            is_premium,
            categories (name)
          )
        `)
        .eq('user_id', user.id)
        .order('listened_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const formatListeningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {profile?.full_name || 'Sleep Sanctuary User'}
                </h1>
                <p className="text-white/70 mb-4">{profile?.email}</p>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-purple-600">
                    Premium Member
                  </Badge>
                  <div className="flex items-center text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatListeningTime(profile?.total_listening_time || 0)} listened
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorites */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-400" />
                Your Favorites ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.length === 0 ? (
                  <p className="text-white/60 text-center py-4">
                    No favorites yet. Start exploring and add some tracks!
                  </p>
                ) : (
                  favorites.slice(0, 5).map((favorite) => (
                    <div key={favorite.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {favorite.audio_content.title}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {favorite.audio_content.categories?.name}
                        </p>
                      </div>
                      {favorite.audio_content.is_premium && (
                        <Badge variant="secondary" className="bg-purple-600 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recently Played */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Recently Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentlyPlayed.length === 0 ? (
                  <p className="text-white/60 text-center py-4">
                    No listening history yet. Start playing some tracks!
                  </p>
                ) : (
                  recentlyPlayed.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {item.audio_content.title}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {new Date(item.listened_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-white/60 text-sm">
                        {item.completed ? 'Completed' : 'Partial'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listening Stats */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Listening Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {favorites.length}
                </div>
                <div className="text-white/70 text-sm">Favorites</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {recentlyPlayed.length}
                </div>
                <div className="text-white/70 text-sm">Tracks Played</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {formatListeningTime(profile?.total_listening_time || 0)}
                </div>
                <div className="text-white/70 text-sm">Total Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {recentlyPlayed.filter(item => item.completed).length}
                </div>
                <div className="text-white/70 text-sm">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
