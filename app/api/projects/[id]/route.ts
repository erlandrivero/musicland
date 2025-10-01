import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// PATCH /api/projects/:id - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    // Verify project belongs to user
    const existingProject = await db.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

    if (existingProject.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have access to this project' },
        { status: 403 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Project name is required' },
        { status: 400 }
      );
    }

    // Update the project
    const project = await db.project.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
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

    return NextResponse.json(transformedProject, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to update project:', error);
    return NextResponse.json(
      {
        error: 'UPDATE_ERROR',
        message: 'Failed to update project',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify project belongs to user
    const project = await db.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have access to this project' },
        { status: 403 }
      );
    }

    // Delete the project
    await db.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Failed to delete project:', error);
    return NextResponse.json(
      {
        error: 'DELETE_ERROR',
        message: 'Failed to delete project',
      },
      { status: 500 }
    );
  }
}
