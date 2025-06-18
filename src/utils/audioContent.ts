// Real audio content based on the files uploaded to GitHub
export const realAudioContent = [
  // Bedtime Stories
  {
    id: 'benny-sleepy-bear',
    title: 'Benny the Sleepy Bear',
    description: 'A gentle bedtime story about a sleepy bear who learns the importance of rest and dreams.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Benny the Sleepy Bear (short)-q23323b.mp3',
    thumbnail_url: '/audio/thumbnails/Benny the Sleepy Bear (short)-a2382832.png',
    duration: 600, // 10:00 minutes
    is_premium: false, // Sample track
    tags: ['bedtime', 'story', 'bear', 'dreams']
  },
  {
    id: 'captain-nilo-starwhale',
    title: 'Captain Nilo and the Starwhale',
    description: 'An enchanting tale of Captain Nilo\'s adventure with a magical starwhale across the cosmos.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Captain Nilo and the Starwhale-2323asb.mp3',
    thumbnail_url: '/audio/thumbnails/Captain Nilo and the Starwhale-adad23823.png',
    duration: 900, // 15:00 minutes
    is_premium: true,
    tags: ['bedtime', 'story', 'adventure', 'space']
  },
  {
    id: 'cleo-little-cloud',
    title: 'Cleo the Little Cloud',
    description: 'Follow Cleo, a little cloud, on her journey across the sky bringing rain and joy to the world below.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Cleo the Little Cloud-2323828382123asdak.mp3',
    thumbnail_url: undefined,
    duration: 720, // 12:00 minutes
    is_premium: true,
    tags: ['bedtime', 'story', 'cloud', 'nature']
  },
  {
    id: 'forest-waits-for-one',
    title: 'The Forest That Waits for One',
    description: 'A mystical story about a forest waiting for a special visitor to unlock its ancient secrets.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/The Forest That Waits for One-asdas2323b.mp3',
    thumbnail_url: '/audio/thumbnails/The Forest That Waits for One-12a2382381-21.png',
    duration: 1080, // 18:00 minutes
    is_premium: true,
    tags: ['bedtime', 'story', 'forest', 'mystery']
  },
  {
    id: 'tilly-turtle-moonlight',
    title: 'Tilly the Turtle\'s Moonlight Journey',
    description: 'Join Tilly the turtle on her peaceful moonlight journey across the quiet pond.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Tilly the Turtle\'s Moonlight Journey -239239293.mp3',
    thumbnail_url: undefined,
    duration: 840, // 14:00 minutes
    is_premium: true,
    tags: ['bedtime', 'story', 'turtle', 'moonlight']
  },

  // Calming Sounds
  {
    id: 'rain-in-forest',
    title: 'Rain in the Forest',
    description: 'The gentle sound of rain falling in a lush forest, a perfect soundscape for relaxation and sleep.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/sounds-of-nature-rain-in-the-forest-262403.mp3',
    thumbnail_url: undefined,
    duration: 1200, // 20:00 minutes
    is_premium: false, // Sample track
    tags: ['nature', 'rain', 'forest', 'weather']
  },
  {
    id: 'relax-in-cave',
    title: 'Relax in a Cave',
    description: 'Find tranquility in the echoing stillness of a secluded cave, with subtle water drips.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/sounds-of-nature-relax-in-a-cave-276297.mp3',
    thumbnail_url: undefined,
    duration: 900, // 15:00 minutes
    is_premium: true,
    tags: ['nature', 'cave', 'ambient', 'water']
  },
  {
    id: 'thunderstorm-on-pandora',
    title: 'Thunderstorm on Pandora',
    description: 'An immersive thunderstorm experience on a distant, mystical world. Rumbles of thunder and alien rain.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/sounds-of-nature-thunderstorm-on-pandora-262405.mp3',
    thumbnail_url: undefined,
    duration: 1500, // 25:00 minutes
    is_premium: true,
    tags: ['weather', 'thunderstorm', 'rain', 'fantasy']
  },
  {
    id: 'wind-in-desert',
    title: 'Wind in the Desert',
    description: 'The lonely, sweeping sound of wind across vast desert sands. A sound of solitude and peace.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/sounds-of-nature-wind-in-the-desert-262406.mp3',
    thumbnail_url: undefined,
    duration: 1080, // 18:00 minutes
    is_premium: true,
    tags: ['nature', 'wind', 'desert', 'ambient']
  },
  {
    id: 'fireplace-sounds',
    title: 'Fireplace Sounds',
    description: 'Cozy crackling fireplace sounds to create a warm and comfortable atmosphere.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Fireplace sounds-a23a23b.mp3',
    thumbnail_url: undefined,
    duration: 1800, // 30:00 minutes
    is_premium: true,
    tags: ['fireplace', 'cozy', 'warmth', 'crackling']
  },
  {
    id: 'forest-sounds',
    title: 'Forest Sounds',
    description: 'Peaceful forest ambience with birds chirping and leaves rustling in the breeze.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Forest sounds-asdjadskasd23b-233323b.mp3',
    thumbnail_url: undefined,
    duration: 2100, // 35:00 minutes
    is_premium: true,
    tags: ['nature', 'forest', 'birds', 'ambient']
  },
  {
    id: 'gentle-rain',
    title: 'Gentle Rain',
    description: 'Soft, gentle rain sounds perfect for relaxation and peaceful sleep.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Gentle rain-a232323b.mp3',
    thumbnail_url: undefined,
    duration: 1440, // 24:00 minutes
    is_premium: true,
    tags: ['rain', 'gentle', 'weather', 'peaceful']
  },
  {
    id: 'night-sounds-village',
    title: 'Night Sounds at a Village',
    description: 'Tranquil night sounds from a peaceful village, with distant crickets and gentle breezes.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Night sounds at a village-aadsd3sdb-23a23b.mp3',
    thumbnail_url: undefined,
    duration: 1680, // 28:00 minutes
    is_premium: true,
    tags: ['night', 'village', 'crickets', 'peaceful']
  },
  {
    id: 'running-water',
    title: 'Running Water',
    description: 'The soothing sound of water flowing gently over rocks and stones.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Running water-adabad3233.mp3',
    thumbnail_url: undefined,
    duration: 1320, // 22:00 minutes
    is_premium: true,
    tags: ['water', 'stream', 'flowing', 'nature']
  },
  {
    id: 'sea-waves',
    title: 'Sea Waves',
    description: 'Rhythmic ocean waves gently lapping against the shore, perfect for meditation.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Sea waves-a232323b.mp3',
    thumbnail_url: undefined,
    duration: 1560, // 26:00 minutes
    is_premium: true,
    tags: ['ocean', 'waves', 'sea', 'rhythmic']
  },
  {
    id: 'waterfall-sounds-1',
    title: 'Waterfall Sounds',
    description: 'Powerful waterfall cascading down rocks, creating a natural white noise.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Waterfall sounds-a23232b.mp3',
    thumbnail_url: undefined,
    duration: 1440, // 24:00 minutes
    is_premium: true,
    tags: ['waterfall', 'cascade', 'water', 'nature']
  },
  {
    id: 'waterfall-sounds-2',
    title: 'Mountain Waterfall',
    description: 'Another beautiful waterfall recording with rich, immersive sound quality.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Waterfall-as23323b-a2323b.mp3',
    thumbnail_url: undefined,
    duration: 1620, // 27:00 minutes
    is_premium: true,
    tags: ['waterfall', 'mountain', 'water', 'immersive']
  },

  // Meditation Music
  {
    id: 'meditation-crystal',
    title: 'Meditation Music Crystal',
    description: 'Crystal clear meditation music with harmonious tones for deep relaxation.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music crystal-743747a.mp3',
    thumbnail_url: undefined,
    duration: 1200, // 20:00 minutes
    is_premium: false, // Sample track
    tags: ['meditation', 'crystal', 'harmony', 'relaxation']
  },
  {
    id: 'meditation-rest-now',
    title: 'Meditation Music - Rest Now',
    description: 'Calming meditation music designed to help you rest and find inner peace.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music rest now-87234374uajdjab.mp3',
    thumbnail_url: undefined,
    duration: 1800, // 30:00 minutes
    is_premium: true,
    tags: ['meditation', 'rest', 'peace', 'calming']
  },
  {
    id: 'meditation-sunset',
    title: 'Meditation Music Sunset',
    description: 'Beautiful sunset meditation music with warm, golden tones.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music sunset-asdvuu4u34ad.mp3',
    thumbnail_url: undefined,
    duration: 1440, // 24:00 minutes
    is_premium: true,
    tags: ['meditation', 'sunset', 'golden', 'warm']
  },
  {
    id: 'relaxing-sleep-music',
    title: 'Relaxing Sleep Music',
    description: 'Gentle sleep music to help you drift off into peaceful slumber.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Relaxing Sleep Music-8881812adb.mp3',
    thumbnail_url: undefined,
    duration: 2100, // 35:00 minutes
    is_premium: true,
    tags: ['sleep', 'relaxing', 'gentle', 'slumber']
  }
];

// Real categories based on actual content
export const realCategories = [
  {
    id: 'bedtime-stories',
    name: 'Bedtime Stories',
    slug: 'bedtime-stories',
    description: 'Gentle stories to help you drift off to sleep',
    icon: 'book-audio',
    color: '#8B5CF6' // Purple
  },
  {
    id: 'calming-sounds',
    name: 'Calming Sounds',
    slug: 'calming-sounds', 
    description: 'Natural sounds and ambient noise for deep relaxation',
    icon: 'volume',
    color: '#059669' // Green
  },
  {
    id: 'meditation-music',
    name: 'Meditation Music',
    slug: 'meditation-music',
    description: 'Peaceful music for meditation and mindfulness',
    icon: 'headphones',
    color: '#0EA5E9' // Blue
  }
];

// Category filter tags
export const categoryTags = {
  'bedtime-stories': ['bedtime', 'story', 'bear', 'dreams', 'adventure', 'space', 'cloud', 'nature', 'forest', 'mystery', 'turtle', 'moonlight'],
  'calming-sounds': ['nature', 'water', 'weather', 'ambient', 'rain', 'forest', 'cave', 'thunderstorm', 'desert', 'fantasy', 'wind', 'fireplace', 'cozy', 'warmth', 'crackling', 'birds', 'gentle', 'peaceful', 'night', 'village', 'crickets', 'stream', 'flowing', 'ocean', 'waves', 'sea', 'rhythmic', 'waterfall', 'cascade', 'mountain', 'immersive'],
  'meditation-music': ['meditation', 'crystal', 'harmony', 'relaxation', 'rest', 'peace', 'calming', 'sunset', 'golden', 'warm', 'sleep', 'gentle', 'slumber']
};

export const getTrackCountByCategory = (categoryId: string): number => {
  return realAudioContent.filter(track => track.category === categoryId).length;
};

export const getTotalTrackCount = (): number => {
  return realAudioContent.length;
};

export const getPremiumTrackCount = (): number => {
  return realAudioContent.filter(track => track.is_premium).length;
};

export const getFreeTrackCount = (): number => {
  return realAudioContent.filter(track => !track.is_premium).length;
};

export const getTotalDurationMinutes = (): number => {
  const totalSeconds = realAudioContent.reduce((total, track) => total + track.duration, 0);
  return Math.round(totalSeconds / 60);
};

export const getTracksByCategory = (categoryId: string) => {
  return realAudioContent.filter(track => track.category === categoryId);
};

export const getSampleTracks = () => {
  // Return the 3 designated sample tracks (one from each category)
  return [
    realAudioContent.find(track => track.id === 'benny-sleepy-bear'), // Sample bedtime story
    realAudioContent.find(track => track.id === 'rain-in-forest'), // Sample calming sound
    realAudioContent.find(track => track.id === 'meditation-crystal'), // Sample meditation music
  ].filter(Boolean);
};

export const getNewReleases = (count: number = 5) => {
  // Assuming recent additions are at the end of the array
  return [...realAudioContent].reverse().slice(0, count);
};

export const getTrendingTracks = () => {
  // Mocking trending tracks for now - using available tracks
  const trendingIds = [
    'captain-nilo-starwhale',
    'thunderstorm-on-pandora',
    'meditation-sunset',
    'forest-sounds',
    'wind-in-desert',
  ];
  return realAudioContent.filter(track => trendingIds.includes(track.id));
};

export const getTagsByCategory = (categoryId: string): string[] => {
  return categoryTags[categoryId as keyof typeof categoryTags] || [];
};

export const filterTracksByTags = (tracks: any[], selectedTags: string[]): any[] => {
  if (selectedTags.length === 0) return tracks;
  return tracks.filter(track => 
    selectedTags.some(tag => track.tags.includes(tag))
  );
};