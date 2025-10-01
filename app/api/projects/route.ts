import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/projects - Get all projects for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { tracks: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform to match Project interface
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      trackCount: project._count.tracks,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedProjects, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to fetch projects:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Project name is required' },
        { status: 400 }
      );
    }

    const project = await db.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { tracks: true },
        },
      },
    });

    // Transform to match Project interface
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      trackCount: project._count.tracks,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedProject, { status: 201 });
  } catch (error: any) {
    console.error('[API] Failed to create project:', error);
    return NextResponse.json(
      {
        error: 'CREATE_ERROR',
        message: 'Failed to create project',
      },
      { status: 500 }
    );
  }
}
