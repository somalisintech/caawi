"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation'; // Changed from next/navigation

// Define a type for the resource structure
interface Tag {
  id: number;
  name: string;
}

interface ResourceCategory {
  id: number;
  name: string;
}

interface Resource {
  id: number;
  title: string;
  url: string;
  description?: string;
  resourceType: string;
  category: ResourceCategory;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }
      const data = await response.json();
      setResources(data.data); // Assuming API returns { data: resources[] }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`/api/resources/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete resource' }));
          throw new Error(errorData.message || `Failed to delete resource: ${response.statusText}`);
        }
        // Refresh the list after successful deletion
        fetchResources();
      } catch (err: any) {
        setError(err.message);
        alert(`Error deleting resource: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>Error loading resources: {error}</p>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Resources</h1>
        <Button asChild>
          <Link href="/dashboard/admin/resources/new">Create New Resource</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.length > 0 ? (
            resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell>{resource.category?.name || 'N/A'}</TableCell>
                <TableCell>{resource.resourceType}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/admin/resources/${resource.id}/edit`)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No resources found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
