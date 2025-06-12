
// Real audio content based on the files uploaded to GitHub
export const realAudioContent = [
  // Bedtime Stories
  {
    id: 'benny-sleepy-bear',
    title: 'Benny the Sleepy Bear (short)',
    description: 'A gentle bedtime story about a sleepy bear finding his way to dreamland.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Benny the Sleepy Bear (short).mp3',
    duration: 300, // Approximate duration in seconds
    is_premium: false,
    tags: ['bedtime', 'stories', 'children', 'bear']
  },
  {
    id: 'captain-nilo-starwhale',
    title: 'Captain Nilo and the Starwhale',
    description: 'An enchanting adventure story about Captain Nilo and his magical journey.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/Captain Nilo and the Starwhale.mp3',
    duration: 600,
    is_premium: true,
    tags: ['adventure', 'fantasy', 'ocean', 'stars']
  },
  {
    id: 'forest-waits-for-one',
    title: 'The Forest That Waits for One',
    description: 'A mystical tale about a special forest waiting for someone special.',
    category: 'bedtime-stories',
    file_path: '/audio/bedtime-stories/The Forest That Waits for One.mp3',
    duration: 480,
    is_premium: true,
    tags: ['forest', 'nature', 'mystery', 'magic']
  },
  // Calming Sounds
  {
    id: 'fireplace-sounds',
    title: 'Fireplace Sounds',
    description: 'Cozy crackling fireplace sounds to warm your heart and calm your mind.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Fireplace sounds.mp3',
    duration: 1800,
    is_premium: false,
    tags: ['fireplace', 'cozy', 'warm', 'crackling']
  },
  {
    id: 'forest-sounds',
    title: 'Forest Sounds',
    description: 'Natural forest ambience with birds chirping and leaves rustling.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Forest sounds.mp3',
    duration: 1200,
    is_premium: false,
    tags: ['nature', 'birds', 'forest', 'peaceful']
  },
  {
    id: 'gentle-rain',
    title: 'Gentle Rain',
    description: 'Soft rainfall sounds perfect for relaxation and sleep.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Gentle rain.mp3',
    duration: 1500,
    is_premium: false,
    tags: ['rain', 'weather', 'peaceful', 'sleep']
  },
  {
    id: 'night-village-sounds',
    title: 'Night Sounds at a Village',
    description: 'Peaceful nighttime ambience from a quiet village.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Night sounds at a village.mp3',
    duration: 1800,
    is_premium: true,
    tags: ['night', 'village', 'peaceful', 'ambient']
  },
  {
    id: 'ocean-sounds',
    title: 'Ocean Sounds',
    description: 'Relaxing ocean waves for deep relaxation and meditation.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Ocean sounds.mp3',
    duration: 2000,
    is_premium: false,
    tags: ['ocean', 'waves', 'water', 'meditation']
  },
  {
    id: 'running-water',
    title: 'Running Water',
    description: 'Gentle flowing water sounds for tranquility and peace.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Running water.mp3',
    duration: 1200,
    is_premium: false,
    tags: ['water', 'stream', 'flowing', 'nature']
  },
  {
    id: 'sea-waves',
    title: 'Sea Waves',
    description: 'Rhythmic sea waves for relaxation and stress relief.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Sea waves.mp3',
    duration: 1800,
    is_premium: true,
    tags: ['sea', 'waves', 'ocean', 'rhythmic']
  },
  {
    id: 'waterfall-sounds',
    title: 'Waterfall Sounds',
    description: 'Powerful yet soothing waterfall sounds for deep relaxation.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Waterfall sounds.mp3',
    duration: 1600,
    is_premium: true,
    tags: ['waterfall', 'nature', 'powerful', 'flowing']
  },
  {
    id: 'waterfall',
    title: 'Waterfall',
    description: 'Natural waterfall ambience for meditation and calm.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/Waterfall.mp3',
    duration: 1400,
    is_premium: false,
    tags: ['waterfall', 'nature', 'meditation', 'calm']
  },
  // Meditation Music
  {
    id: 'meditation-crystal',
    title: 'Meditation Music Crystal',
    description: 'Crystal-clear meditation music for spiritual awakening and inner peace.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music crystal.mp3',
    duration: 900,
    is_premium: true,
    tags: ['meditation', 'crystal', 'spiritual', 'peace']
  },
  {
    id: 'meditation-rest-now',
    title: 'Meditation Music Rest Now',
    description: 'Peaceful meditation music designed for immediate relaxation.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music rest now.mp3',
    duration: 1200,
    is_premium: false,
    tags: ['meditation', 'rest', 'relaxation', 'immediate']
  },
  {
    id: 'meditation-sunset',
    title: 'Meditation Music Sunset',
    description: 'Warm meditation music inspired by beautiful sunsets.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Meditation music sunset.mp3',
    duration: 1000,
    is_premium: true,
    tags: ['meditation', 'sunset', 'warm', 'beautiful']
  },
  {
    id: 'relaxing-sleep-music',
    title: 'Relaxing Sleep Music',
    description: 'Specially composed music to help you drift into peaceful sleep.',
    category: 'meditation-music',
    file_path: '/audio/meditation-music/Relaxing Sleep Music.mp3',
    duration: 1800,
    is_premium: false,
    tags: ['sleep', 'relaxing', 'peaceful', 'composed']
  }
];

// Real categories based on actual content
export const realCategories = [
  {
    id: 'bedtime-stories',
    name: 'Bedtime Stories',
    slug: 'bedtime-stories',
    description: 'Enchanting tales to guide you gently into dreamland',
    icon: 'book-audio',
    color: '#9333ea' // Purple
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
    description: 'Peaceful melodies for meditation and mindfulness',
    icon: 'headphones',
    color: '#dc2626' // Red
  }
];

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
