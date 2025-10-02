'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard';
import { TrackList, ShareModal, type Track } from '@/components/tracks';
import { ProjectManager, type Project } from '@/components/projects';
import { Music, Folder } from 'lucide-react';

type ViewMode = 'tracks' | 'projects';

export default function TracksPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/tracks');
        if (response.ok) {
          const data = await response.json();
          setTracks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTracks();
    }
  }, [session]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    if (session) {
      fetchProjects();
    }
  }, [session]);

  const handlePlay = async (trackId: string) => {
    // Update play count
    try {
      await fetch(`/api/tracks/${trackId}/play`, {
        method: 'POST',
      });
      
      // Update local state
      setTracks(prev => prev.map(track =>
        track.id === trackId
          ? { ...track, playCount: (track.playCount || 0) + 1 }
          : track
      ));
    } catch (error) {
      console.error('Failed to update play count:', error);
    }
  };

  const handleDownload = async (trackId: string, format: string) => {
    try {
      const response = await fetch(`/api/music/download/${trackId}?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const track = tracks.find(t => t.id === trackId);
        a.download = `${track?.title || 'track'}.${format.split('-')[0]}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Update download count
        setTracks(prev => prev.map(t =>
          t.id === trackId
            ? { ...t, downloadCount: (t.downloadCount || 0) + 1 }
            : t
        ));
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download track. Please try again.');
    }
  };

  const handleShare = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setSelectedTrack(track);
      setShareModalOpen(true);
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTracks(prev => prev.filter(t => t.id !== trackId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete track:', error);
      alert('Failed to delete track. Please try again.');
    }
  };

  const handleFavorite = async (trackId: string) => {
    try {
      const track = tracks.find(t => t.id === trackId);
      const response = await fetch(`/api/tracks/${trackId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !track?.isFavorite }),
      });

      if (response.ok) {
        setTracks(prev => prev.map(t =>
          t.id === trackId
            ? { ...t, isFavorite: !t.isFavorite }
            : t
        ));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Project handlers
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
      } else {
        throw new Error('Create failed');
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
      } else {
        throw new Error('Update failed');
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
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const handleSelectProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Music</h1>
          <p className="text-gray-600 mt-1">
            {viewMode === 'tracks' ? 'All your generated tracks' : 'Organize into projects'}
          </p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-6 bg-white rounded-lg p-1 w-fit border border-gray-200">
          <button
            onClick={() => setViewMode('tracks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'tracks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Music size={20} />
            Tracks ({tracks.length})
          </button>
          <button
            onClick={() => setViewMode('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'projects'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Folder size={20} />
            Projects ({projects.length})
          </button>
        </div>

        {/* Content */}
        {viewMode === 'tracks' ? (
          <TrackList
            tracks={tracks}
            onPlay={handlePlay}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleDelete}
            onFavorite={handleFavorite}
          />
        ) : (
          <ProjectManager
            projects={projects}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onSelectProject={handleSelectProject}
          />
        )}
        {/* Share Modal */}
        {selectedTrack && (
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => {
              setShareModalOpen(false);
              setSelectedTrack(null);
            }}
            trackId={selectedTrack.id}
            trackTitle={selectedTrack.title}
            trackUrl={`${window.location.origin}/track/${selectedTrack.id}`}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
