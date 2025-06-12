
-- Create tables for the sleep sanctuary platform

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  total_listening_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content categories
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio content (stories, sounds, meditations)
CREATE TABLE public.audio_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  file_path TEXT NOT NULL, -- Path to audio file in GitHub
  duration INTEGER, -- Duration in seconds
  is_premium BOOLEAN DEFAULT true,
  tags TEXT[], -- Array of tags for personalization
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.audio_content(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- User listening history
CREATE TABLE public.listening_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.audio_content(id) ON DELETE CASCADE,
  listened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_listened INTEGER DEFAULT 0, -- Seconds listened
  completed BOOLEAN DEFAULT false
);

-- User playlists/queues
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_queue BOOLEAN DEFAULT false, -- true for current queue, false for saved playlists
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist items
CREATE TABLE public.playlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.audio_content(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES 
('Bedtime Stories', 'bedtime-stories', 'Original and licensed tales for peaceful sleep', 'book-audio', '#8B5CF6'),
('Calming Sounds', 'calming-sounds', 'Nature sounds and ambient noise for relaxation', 'volume', '#06B6D4'),
('Meditation Music', 'meditation-music', 'Instrumental music for meditation and mindfulness', 'headphones', '#10B981');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories: Public read access
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

-- Audio content: Public read access (premium filtering handled in app)
CREATE POLICY "Audio content is publicly readable" ON public.audio_content FOR SELECT USING (true);

-- User favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- Listening history: Users can manage their own history
CREATE POLICY "Users can view own history" ON public.listening_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.listening_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.listening_history FOR UPDATE USING (auth.uid() = user_id);

-- Playlists: Users can manage their own playlists
CREATE POLICY "Users can view own playlists" ON public.playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own playlists" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist items: Users can manage items in their own playlists
CREATE POLICY "Users can view own playlist items" ON public.playlist_items 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE playlists.id = playlist_items.playlist_id 
    AND playlists.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert own playlist items" ON public.playlist_items 
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE playlists.id = playlist_items.playlist_id 
    AND playlists.user_id = auth.uid()
  ));
CREATE POLICY "Users can update own playlist items" ON public.playlist_items 
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE playlists.id = playlist_items.playlist_id 
    AND playlists.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete own playlist items" ON public.playlist_items 
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE playlists.id = playlist_items.playlist_id 
    AND playlists.user_id = auth.uid()
  ));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
