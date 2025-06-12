
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
      className="cursor-pointer transition-all hover:scale-105 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-white/30"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div style={{ color: category.color }}>
            {getIcon()}
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {trackCount} tracks
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{category.description}</p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
