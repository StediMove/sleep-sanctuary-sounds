
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookAudio, Volume, Headphones } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
  };
  trackCount: number;
  onClick: () => void;
}

const CategoryCard = ({ category, trackCount, onClick }: CategoryCardProps) => {
  const getIcon = () => {
    switch (category.icon) {
      case 'book-audio':
        return <BookAudio className="h-8 w-8" />;
      case 'volume':
        return <Volume className="h-8 w-8" />;
      case 'headphones':
        return <Headphones className="h-8 w-8" />;
      default:
        return <Volume className="h-8 w-8" />;
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:scale-105 bg-white/20 backdrop-blur-sm border-white/30 hover:border-white/40"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div style={{ color: category.color }} className="drop-shadow-lg">
            {getIcon()}
          </div>
          <Badge variant="secondary" className="bg-white/30 text-white font-medium">
            {trackCount} tracks
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">{category.name}</h3>
        <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">{category.description}</p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
