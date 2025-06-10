import Link from 'next/link';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists

interface Tag {
  id: number;
  name: string;
}

interface ResourceCategory {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  resourceType: string;
  category: ResourceCategory;
  tags: Tag[];
  // createdAt: string; // Not displayed directly on card for now
  // updatedAt: string; // Not displayed directly on card for now
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <div className="mb-2">
        <Badge variant="secondary" className="text-xs font-semibold mr-2">
          {resource.resourceType}
        </Badge>
        <span className="text-sm text-muted-foreground">{resource.category.name}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          {resource.title}
        </a>
      </h3>
      {resource.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {resource.description}
        </p>
      )}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resource.tags.map(tag => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
