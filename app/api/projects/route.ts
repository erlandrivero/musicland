import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

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

    const db = await getDatabase();
    const projects = await db
      .collection(COLLECTIONS.PROJECTS)
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    // Transform to match Project interface
    const transformedProjects = projects.map(project => ({
      id: project._id.toString(),
      name: project.name,
      description: project.description || null,
      trackCount: project.trackIds?.length || 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
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

// POST /api/projects - Create a new project or add track to project
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
    const { name, description, trackId } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Project name is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const now = new Date();

    // Check if project already exists
    const existingProject = await db
      .collection(COLLECTIONS.PROJECTS)
      .findOne({ name: name.trim(), userId: session.user.id });

    if (existingProject && trackId) {
      // Add track to existing project
      await db.collection(COLLECTIONS.PROJECTS).updateOne(
        { _id: existingProject._id },
        {
          $addToSet: { trackIds: trackId },
          $set: { updatedAt: now },
        }
      );

      return NextResponse.json(
        {
          id: existingProject._id.toString(),
          name: existingProject.name,
          message: 'Track added to existing project',
        },
        { status: 200 }
      );
    }

    // Create new project
    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      userId: session.user.id,
      trackIds: trackId ? [trackId] : [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(COLLECTIONS.PROJECTS).insertOne(projectData);

    const transformedProject = {
      id: result.insertedId.toString(),
      name: projectData.name,
      description: projectData.description,
      trackCount: projectData.trackIds.length,
      createdAt: projectData.createdAt.toISOString(),
      updatedAt: projectData.updatedAt.toISOString(),
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
