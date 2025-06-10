"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation'; // Corrected import

// Define types for props and state
interface Tag {
  id: number;
  name: string;
}

interface ResourceCategory {
  id: number;
  name: string;
}

// Matches the enum in prisma/schema.prisma
const resourceTypeEnum = ["ARTICLE", "VIDEO", "COURSE", "TOOL"];

interface ResourceFormData {
  title: string;
  url: string;
  description: string;
  resourceType: string;
  categoryId: string; // Store as string for select, convert before submit
  tags: string; // Comma-separated string
}

interface ResourceFormProps {
  initialData?: Partial<ResourceFormData & { category?: ResourceCategory, tags?: Tag[] }>; // Make category and tags optional for initialData
  onSubmit: (data: any) => Promise<void>; // Adjusted to match actual usage
  isEditing: boolean;
  isLoading?: boolean;
}

export default function ResourceForm({ initialData, onSubmit, isEditing, isLoading }: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: initialData?.title || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    resourceType: initialData?.resourceType || '',
    categoryId: initialData?.category?.id?.toString() || '',
    tags: initialData?.tags?.map(tag => tag.name).join(', ') || '',
  });
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('/api/resource-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setFormError("Could not load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Update form when initialData changes (for edit page)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || '',
        description: initialData.description || '',
        resourceType: initialData.resourceType || '',
        categoryId: initialData.category?.id?.toString() || (initialData.categoryId?.toString() || ''),
        tags: initialData.tags?.map(tag => tag.name).join(', ') || '',
      });
    }
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title || !formData.url || !formData.resourceType || !formData.categoryId) {
      setFormError('Please fill in all required fields: Title, URL, Resource Type, and Category.');
      return;
    }

    try {
      // Convert categoryId to number before submitting
      const dataToSubmit = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        // Tags string is handled by the backend
      };
      await onSubmit(dataToSubmit);
    } catch (error: any) {
      setFormError(error.message || (isEditing ? 'Failed to update resource.' : 'Failed to create resource.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && <p className="text-red-500 bg-red-100 p-3 rounded-md">{formError}</p>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL <span className="text-red-500">*</span></label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">Resource Type <span className="text-red-500">*</span></label>
        <Select
          name="resourceType"
          value={formData.resourceType}
          onValueChange={(value) => handleSelectChange('resourceType', value)}
          required
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a resource type" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypeEnum.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
        <Select
          name="categoryId"
          value={formData.categoryId}
          onValueChange={(value) => handleSelectChange('categoryId', value)}
          required
          disabled={loadingCategories}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loadingCategories && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <Input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1"
          placeholder="e.g., javascript, react, nextjs"
        />
      </div>

      <Button type="submit" disabled={isLoading || loadingCategories} className="w-full">
        {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Resource' : 'Create Resource')}
      </Button>
    </form>
  );
}
