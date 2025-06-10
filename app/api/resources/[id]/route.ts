import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { ResourceType } from '@prisma/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid resource ID' }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error(`Error fetching resource with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Error fetching resource' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid resource ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, url, description, resourceType, categoryId, tags: tagNames } = body;

    // Basic validation for presence of at least one field to update
    if (!title && !url && !description && !resourceType && !categoryId && !tagNames) {
      return NextResponse.json({ message: 'No fields provided for update' }, { status: 400 });
    }

    if (resourceType && !Object.values(ResourceType).includes(resourceType as ResourceType)) {
      return NextResponse.json({ message: 'Invalid resourceType' }, { status: 400 });
    }

    if (categoryId) {
      const category = await prisma.resourceCategory.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json({ message: 'Invalid categoryId' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (url) updateData.url = url;
    if (description !== undefined) updateData.description = description;
    if (resourceType) updateData.resourceType = resourceType as ResourceType;
    if (categoryId) updateData.categoryId = categoryId;

    if (tagNames && Array.isArray(tagNames)) {
      const tagObjects = [];
      for (const tagName of tagNames) {
        if (typeof tagName !== 'string' || tagName.trim() === '') continue;
        const normalizedTagName = tagName.trim().toLowerCase();
        let tag = await prisma.tag.findFirst({
          where: { name: { equals: normalizedTagName, mode: 'insensitive' } },
        });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName.trim() },
          });
        }
        tagObjects.push({ id: tag.id });
      }
      updateData.tags = { set: tagObjects }; // Use 'set' to replace existing tags
    }

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedResource);
  } catch (error: any) {
    console.error(`Error updating resource with ID ${params.id}:`, error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating resource' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid resource ID' }, { status: 400 });
    }

    await prisma.resource.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting resource with ID ${params.id}:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error deleting resource' }, { status: 500 });
  }
}
