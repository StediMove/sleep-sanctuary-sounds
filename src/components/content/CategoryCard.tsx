
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
      className="glass-card glass-card-hover cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div 
            className="p-4 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg"
            style={{ 
              backgroundColor: category.color + '20',
              color: category.color,
              boxShadow: `0 8px 32px ${category.color}20`
            }}
          >
            {getIcon()}
          </div>
          <Badge 
            variant="secondary" 
            className="glass-card text-white/90 font-medium px-3 py-1 group-hover:bg-white/20 transition-colors duration-300"
          >
            {trackCount} tracks
          </Badge>
        </div>
        
        <h3 className="font-serif text-2xl font-normal text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
          {category.name}
        </h3>
        <p className="text-white/80 text-sm leading-relaxed font-light group-hover:text-white/70 transition-colors duration-300">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
