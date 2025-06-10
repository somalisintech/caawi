"use client";

import { useState } from 'react';
import ResourceForm from '../components/resource-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewResourcePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Convert comma-separated tags string to an array of strings
    const dataToSubmit = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
    };

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(errorData.message || `Failed to create resource: ${response.statusText}`);
      }

      const createdResource = await response.json();
      setSuccessMessage(`Resource "${createdResource.title}" created successfully!`);

      // Optionally redirect after a short delay or provide a link to navigate
      setTimeout(() => {
        router.push('/dashboard/admin/resources');
      }, 2000); // Redirect after 2 seconds

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Resource</h1>
        <Button variant="outline" asChild>
            <Link href="/dashboard/admin/resources">Back to List</Link>
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          Error: {error}
        </div>
      )}

      <ResourceForm onSubmit={handleSubmit} isEditing={false} isLoading={isLoading} />
    </div>
  );
}
