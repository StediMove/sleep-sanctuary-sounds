// Real audio content based on the files uploaded to GitHub
export const realAudioContent = [
  // Calming Sounds - only keeping the ones that still exist
  {
    id: 'rain-in-forest',
    title: 'Rain in the Forest',
    description: 'The gentle sound of rain falling in a lush forest, a perfect soundscape for relaxation and sleep.',
    category: 'calming-sounds',
    file_path: '/audio/calming-sounds/sounds-of-nature-rain-in-the-forest-262403.mp3',
    thumbnail_url: undefined,
    duration: 1200, // 20:00 minutes
    is_premium: true,
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
  }
];

// Real categories based on actual content
export const realCategories = [
  {
    id: 'calming-sounds',
    name: 'Calming Sounds',
    slug: 'calming-sounds', 
    description: 'Natural sounds and ambient noise for deep relaxation',
    icon: 'volume',
    color: '#059669' // Green
  }
];

// Category filter tags
export const categoryTags = {
  'calming-sounds': ['nature', 'water', 'weather', 'ambient', 'rain', 'forest', 'cave', 'thunderstorm', 'desert', 'fantasy', 'wind']
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
  return [
    realAudioContent.find(track => track.id === 'rain-in-forest'), // Sample calming sound
  ].filter(Boolean);
};

export const getNewReleases = (count: number = 5) => {
  // Assuming recent additions are at the end of the array
  return [...realAudioContent].reverse().slice(0, count);
};

export const getTrendingTracks = () => {
  // Mocking trending tracks for now - using available tracks
  const trendingIds = [
    'thunderstorm-on-pandora',
    'wind-in-desert',
    'rain-in-forest',
    'relax-in-cave',
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
