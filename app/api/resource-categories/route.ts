import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const categories = await prisma.resourceCategory.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching resource categories:', error);
    return NextResponse.json({ message: 'Error fetching resource categories' }, { status: 500 });
  }
}
