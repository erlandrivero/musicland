'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard';
import { Music, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TrackList, type Track } from '@/components/tracks';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjectAndTracks = async () => {
      try {
        console.log('[ProjectDetail] Fetching project:', params.id);
        const projectResponse = await fetch(`/api/projects/${params.id}`);
        console.log('[ProjectDetail] Project response status:', projectResponse.status);
        
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          console.log('[ProjectDetail] Project data:', projectData);
          setProject(projectData);

          // Fetch all tracks
          const tracksResponse = await fetch('/api/tracks');
          if (tracksResponse.ok) {
            const allTracksData = await tracksResponse.json();
            setAllTracks(allTracksData);
            
            // Filter tracks that are in this project
            const projectTracks = allTracksData.filter((track: Track) =>
              projectData.trackIds?.includes(track.id)
            );
            setTracks(projectTracks);
            
            // Filter tracks that are NOT in this project
            const available = allTracksData.filter((track: Track) =>
              !projectData.trackIds?.includes(track.id)
            );
            setAvailableTracks(available);
          }
        } else {
          console.error('[ProjectDetail] Failed to fetch project:', await projectResponse.text());
        }
      } catch (error) {
        console.error('[ProjectDetail] Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && params.id) {
      fetchProjectAndTracks();
    }
  }, [session, params.id]);

  const handleRemoveTrack = async (trackId: string) => {
    if (!confirm('Remove this track from the project?')) return;

    try {
      const response = await fetch(`/api/projects/${params.id}/tracks/${trackId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const removedTrack = tracks.find(t => t.id === trackId);
        setTracks(tracks.filter(t => t.id !== trackId));
        if (removedTrack) {
          setAvailableTracks([...availableTracks, removedTrack]);
        }
      }
    } catch (error) {
      console.error('Failed to remove track:', error);
    }
  };

  const handleAddTracks = async () => {
    if (selectedTrackIds.length === 0) return;

    try {
      const response = await fetch(`/api/projects/${params.id}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackIds: selectedTrackIds }),
      });

      if (response.ok) {
        // Move selected tracks from available to project tracks
        const addedTracks = allTracks.filter(t => selectedTrackIds.includes(t.id));
        setTracks([...tracks, ...addedTracks]);
        setAvailableTracks(availableTracks.filter(t => !selectedTrackIds.includes(t.id)));
        setSelectedTrackIds([]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add tracks:', error);
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTrackIds(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-4">This project doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Link href="/projects" className="text-blue-600 hover:text-blue-700">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 mt-2">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Music size={16} />
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </span>
                <span>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {availableTracks.length > 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Tracks
              </button>
            )}
          </div>
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Music size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tracks in this project yet
            </h3>
            <p className="text-gray-600 mb-4">
              Generate some music and save it to this project
            </p>
            <Link
              href="/generate"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Music
            </Link>
          </div>
        ) : (
          <TrackList
            tracks={tracks}
            onPlay={(trackId) => console.log('Play:', trackId)}
            onDownload={(trackId, format) => console.log('Download:', trackId, format)}
            onShare={(trackId) => console.log('Share:', trackId)}
            onDelete={handleRemoveTrack}
            onFavorite={(trackId) => console.log('Favorite:', trackId)}
          />
        )}

        {/* Add Tracks Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Tracks to Project</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedTrackIds([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {availableTracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">All your tracks are already in this project</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableTracks.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => toggleTrackSelection(track.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTrackIds.includes(track.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedTrackIds.includes(track.id)}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <Music size={16} className="text-gray-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{track.title}</h4>
                          {track.tags && (
                            <p className="text-sm text-gray-500">{track.tags}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedTrackIds([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTracks}
                disabled={selectedTrackIds.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {selectedTrackIds.length > 0 && `(${selectedTrackIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
