"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResourceForm from '../components/resource-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define a type for the resource structure, matching form expectations
interface Tag {
  id: number;
  name: string;
}
interface ResourceCategory {
  id: number;
  name: string;
}
interface ResourceData {
  id: number;
  title: string;
  url: string;
  description?: string;
  resourceType: string;
  categoryId: number; // For API
  category?: ResourceCategory; // For form initialData
  tags: Tag[]; // For form initialData
}

export default function EditResourcePage() {
  const params = useParams();
  const id = params.id as string; // router.query.id is string or string[]
  const router = useRouter();

  const [resource, setResource] = useState<ResourceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${id}`);
        if (response.status === 404) {
          setError("Resource not found.");
          return;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch resource: ${response.statusText}`);
        }
        const data: ResourceData = await response.json();
        setResource(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const dataToSubmit = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
    };

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(errorData.message || `Failed to update resource: ${response.statusText}`);
      }
      const updatedResource = await response.json();
      setSuccessMessage(`Resource "${updatedResource.title}" updated successfully!`);
      setResource(updatedResource); // Update local state with the new data

      setTimeout(() => {
        router.push('/dashboard/admin/resources');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Resource</h1>
      <p>Loading resource data...</p>
    </div>
  );

  if (error && !resource) return ( // Show error prominently if resource couldn't be fetched
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Edit Resource</h1>
            <Button variant="outline" asChild>
                <Link href="/dashboard/admin/resources">Back to List</Link>
            </Button>
        </div>
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            Error: {error}
        </div>
    </div>
  );


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Resource {resource?.title ? `"${resource.title}"` : (id || '')}</h1>
        <Button variant="outline" asChild>
            <Link href="/dashboard/admin/resources">Back to List</Link>
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      {error && ( // Display non-critical errors here (e.g. submission error)
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          Error: {error}
        </div>
      )}

      {resource ? (
        <ResourceForm
          initialData={{
            ...resource,
            // categoryId is already part of resource, category object is for form's initial population
            tags: resource.tags.map(tag => tag.name).join(', ')
          }}
          onSubmit={handleSubmit}
          isEditing={true}
          isLoading={isLoading}
        />
      ) : (
        // This case should ideally be covered by the isFetching or error block above
        <p>Resource data could not be loaded.</p>
      )}
    </div>
  );
}
