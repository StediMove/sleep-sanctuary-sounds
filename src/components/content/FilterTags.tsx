
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterTagsProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

const FilterTags = ({ availableTags, selectedTags, onTagToggle, onClearAll }: FilterTagsProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-white/70 hover:bg-white/10"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer transition-colors capitalize ${
              selectedTags.includes(tag)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white/10 text-white/80 border-white/30 hover:bg-white/20'
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <p className="text-white/60 text-sm mt-2">
          Showing tracks with: {selectedTags.join(', ')}
        </p>
      )}
    </div>
  );
};

export default FilterTags;
