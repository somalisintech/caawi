import prisma from '@/lib/db';
import { ResourceType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filtering
    const categoryId = searchParams.get('categoryId');
    const resourceType = searchParams.get('resourceType') as ResourceType;
    const tagsParam = searchParams.get('tags');

    // Searching
    const search = searchParams.get('search');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
      if (isNaN(where.categoryId)) {
        return NextResponse.json({ message: 'Invalid categoryId' }, { status: 400 });
      }
    }

    if (resourceType) {
      if (!Object.values(ResourceType).includes(resourceType)) {
        return NextResponse.json({ message: 'Invalid resourceType' }, { status: 400 });
      }
      where.resourceType = resourceType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tagsParam) {
      const tagNames = tagsParam.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagNames.length > 0) {
        where.tags = {
          every: { // Changed from some to every to match all tags
            name: {
              in: tagNames,
              mode: 'insensitive',
            },
          },
        };
      }
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        [sortBy]: order,
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.resource.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: resources,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    // It's good practice to avoid sending back raw error messages in production
    let errorMessage = 'Error fetching resources';
    if (error instanceof Error && error.message.includes("Invalid `prisma.resource.findMany()` invocation")) {
        errorMessage = "Invalid query parameters provided.";
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, description, resourceType, categoryId, tags: tagNames } = body;

    // Basic validation
    if (!title || !url || !resourceType || !categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!Object.values(ResourceType).includes(resourceType as ResourceType)) {
      return NextResponse.json({ message: 'Invalid resourceType' }, { status: 400 });
    }

    // Validate categoryId
    const category = await prisma.resourceCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ message: 'Invalid categoryId' }, { status: 400 });
    }

    const tagObjects = [];
    if (tagNames && Array.isArray(tagNames)) {
      for (const tagName of tagNames) {
        if (typeof tagName !== 'string' || tagName.trim() === '') continue;
        const normalizedTagName = tagName.trim().toLowerCase();
        let tag = await prisma.tag.findFirst({
          where: { name: { equals: normalizedTagName, mode: 'insensitive' } },
        });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName.trim() }, // Store with original casing if preferred, or normalized
          });
        }
        tagObjects.push({ id: tag.id });
      }
    }

    const newResource = await prisma.resource.create({
      data: {
        title,
        url,
        description,
        resourceType: resourceType as ResourceType,
        categoryId,
        tags: {
          connect: tagObjects,
        },
        // addedByUserId will be handled by auth in a real app
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating resource' }, { status: 500 });
  }
}
