"use client";

import { useState, useEffect, useCallback } from 'react';
import ResourceCard, { Resource } from './components/resource-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ResourceType } from '@prisma/client'; // For ResourceType enum values

interface ResourceCategory {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  resourceType?: string;
  tags?: string; // Comma-separated
  sortBy?: string;
  order?: string;
}

const resourceTypeEnumValues = Object.values(ResourceType);

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  // const [tags, setTags] = useState<Tag[]>([]); // For future tag filter UI

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  // const [selectedTags, setSelectedTags] = useState<string[]>([]); // For future tag filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 12; // Items per page

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/resource-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // setError('Could not load categories.'); // Or handle silently
    }
  };

  // Not fetching all tags for now, as it's not used in the primary filter UI
  // const fetchTags = async () => { ... }

  const fetchResources = useCallback(async (params: FetchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.append('page', (params.page || currentPage).toString());
      query.append('limit', (params.limit || limit).toString());
      if (params.search || searchQuery) query.append('search', params.search || searchQuery);
      if (params.categoryId || selectedCategory) query.append('categoryId', params.categoryId || selectedCategory);
      if (params.resourceType || selectedResourceType) query.append('resourceType', params.resourceType || selectedResourceType);
      // if (params.tags || selectedTags.length > 0) query.append('tags', params.tags || selectedTags.join(','));
      query.append('sortBy', params.sortBy || 'createdAt');
      query.append('order', params.order || 'desc');

      const response = await fetch(`/api/resources?${query.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error fetching resources" }));
        throw new Error(errorData.message || 'Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.currentPage || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err: any) {
      setError(err.message);
      setResources([]); // Clear resources on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedResourceType, limit]);


  useEffect(() => {
    fetchCategories();
    // fetchTags();
  }, []);

  useEffect(() => {
    // Debounce search or trigger fetch on filter change
    // For simplicity, fetching directly. Debounce can be added.
    fetchResources({
      page: 1, // Reset to page 1 on filter change
      search: searchQuery,
      categoryId: selectedCategory,
      resourceType: selectedResourceType
    });
  }, [searchQuery, selectedCategory, selectedResourceType]); // fetchResources is memoized with useCallback

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Fetching is handled by useEffect
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? '' : value);
    // Fetching is handled by useEffect
  };

  const handleResourceTypeChange = (value: string) => {
    setSelectedResourceType(value === 'all' ? '' : value);
    // Fetching is handled by useEffect
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchResources({ page: newPage });
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Resource Hub</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Explore articles, videos, courses, and tools curated for our community.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/40 rounded-lg border">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="resourceType" className="block text-sm font-medium mb-1">Resource Type</label>
          <Select value={selectedResourceType} onValueChange={handleResourceTypeChange}>
            <SelectTrigger id="resourceType">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {resourceTypeEnumValues.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results and Pagination */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg">Loading resources...</p>
          {/* Consider adding a spinner component here */}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-md">
          <p className="text-lg font-semibold">Error loading resources</p>
          <p>{error}</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No resources found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalCount)} of {totalCount} resources.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
