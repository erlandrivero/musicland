'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard';
import { QuickStats } from '@/components/dashboard';
import { ProjectManager, type Project } from '@/components/projects';
import { ProjectTemplatesModal } from '@/components/dashboard';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTracks: 0,
    creditsUsed: 0,
    tracksThisWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  // Fetch projects and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
          setStats(prev => ({ ...prev, totalProjects: projectsData.length }));
        }

        // Fetch tracks for stats
        const tracksRes = await fetch('/api/tracks');
        if (tracksRes.ok) {
          const tracksData = await tracksRes.json();
          setStats(prev => ({
            ...prev,
            totalTracks: tracksData.length,
            tracksThisWeek: tracksData.filter((t: any) => {
              const trackDate = new Date(t.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return trackDate >= weekAgo;
            }).length,
          }));
        }

        // Get credits used from MongoDB history
        const historyRes = await fetch('/api/credits/history');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setStats(prev => ({
            ...prev,
            creditsUsed: historyData.analytics.totalUsage,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [...prev, newProject]);
        setStats(prev => ({ ...prev, totalProjects: prev.totalProjects + 1 }));
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (id: string, name: string, description?: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setStats(prev => ({ ...prev, totalProjects: prev.totalProjects - 1 }));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const handleSelectProject = (id: string) => {
    // Navigate to project detail page
    window.location.href = `/projects/${id}`;
  };

  const handleSelectTemplate = (template: any) => {
    setShowTemplates(false);
    // Create project with template settings
    const projectName = `${template.name} Project`;
    handleCreateProject(projectName, template.description);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Organize your tracks into projects</p>
          </div>
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Quick Stats */}
        <QuickStats
          totalProjects={stats.totalProjects}
          totalTracks={stats.totalTracks}
          creditsUsed={stats.creditsUsed}
          tracksThisWeek={stats.tracksThisWeek}
        />

        {/* Project Manager */}
        <ProjectManager
          projects={projects}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onSelectProject={handleSelectProject}
        />

        {/* Templates Modal */}
        <ProjectTemplatesModal
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </DashboardLayout>
  );
}
