import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/projects/:id - Get a single project
export async function GET(
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
    const db = await getDatabase();

    const project = await db
      .collection(COLLECTIONS.PROJECTS)
      .findOne({ _id: new ObjectId(id), userId: session.user.id });

    if (!project) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

    const transformedProject = {
      id: project._id.toString(),
      name: project.name,
      description: project.description || null,
      trackIds: project.trackIds || [],
      trackCount: project.trackIds?.length || 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    return NextResponse.json(transformedProject, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to fetch project:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}

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

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Project name is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Update the project
    const result = await db.collection(COLLECTIONS.PROJECTS).findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.user.id },
      {
        $set: {
          name: name.trim(),
          description: description?.trim() || null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

    const transformedProject = {
      id: result._id.toString(),
      name: result.name,
      description: result.description,
      trackCount: result.trackIds?.length || 0,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
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
    const db = await getDatabase();

    // Delete the project
    const result = await db.collection(COLLECTIONS.PROJECTS).deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

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
