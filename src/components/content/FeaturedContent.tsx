import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RestrictedTrackCard from "@/components/content/RestrictedTrackCard"
import { useQueueContext } from "@/contexts/QueueContext"
import { usePlaybackRestrictions } from "@/hooks/usePlaybackRestrictions"

interface Track {
  id: string;
  title: string;
  description: string;
  duration: number;
  is_premium: boolean;
  tags: string[];
  thumbnail_url?: string;
  categories: { name: string };
  category_id: string;
  file_path: string;
}

interface FeaturedContentProps {
  bedtimeStories: Track[];
  calmingSounds: Track[];
  meditationMusic: Track[];
  newReleases: Track[];
  trendingNow: Track[];
}

const FeaturedContent = ({
  bedtimeStories,
  calmingSounds,
  meditationMusic,
  newReleases,
  trendingNow,
}: FeaturedContentProps) => {
  const {
    currentTrack,
    isGlobalPlaying,
    setIsGlobalPlaying,
    addToQueue,
    playNext,
    replaceQueue,
  } = useQueueContext()

  const { canPlayTrack, showUpgradePrompt } = usePlaybackRestrictions()

  const handlePlayTrack = (track: Track) => {
    if (!canPlayTrack(track.id)) {
      showUpgradePrompt(`"${track.title}" is premium content`)
      return
    }

    if (currentTrack?.id === track.id && isGlobalPlaying) {
      return
    }
    replaceQueue(track)
    setIsGlobalPlaying(true)
  }

  const renderTrackCarousel = (tracks: Track[], categoryName: string) => {
    if (!tracks || tracks.length === 0) {
      return <p className="text-white/60 text-center py-8">No tracks available in {categoryName}.</p>
    }
    return (
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full px-4 md:px-12"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {tracks.map((track) => (
            <CarouselItem key={track.id} className="pl-2 md:pl-4 basis-5/6 sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <RestrictedTrackCard
                  track={track}
                  isPlaying={currentTrack?.id === track.id && isGlobalPlaying}
                  onPlay={() => handlePlayTrack(track)}
                  onAddToQueue={addToQueue}
                  onPlayNext={playNext}
                  onReplaceQueue={replaceQueue}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white bg-slate-800/50 hover:bg-slate-700/80 border-slate-700 left-0" />
        <CarouselNext className="text-white bg-slate-800/50 hover:bg-slate-700/80 border-slate-700 right-0" />
      </Carousel>
    )
  }

  const tabs = [
    { value: "trending", label: "Trending Now", data: trendingNow },
    { value: "new", label: "New Releases", data: newReleases },
    { value: "stories", label: "Bedtime Stories", data: bedtimeStories },
    { value: "sounds", label: "Calming Sounds", data: calmingSounds },
    { value: "music", label: "Meditation Music", data: meditationMusic },
  ]

  return (
    <Tabs defaultValue="trending" className="w-full">
      <div className="overflow-x-auto pb-2 -mb-2">
        <TabsList className="bg-transparent p-0 gap-2 mb-6 whitespace-nowrap">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none rounded-lg"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {renderTrackCarousel(tab.data, tab.label)}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default FeaturedContent