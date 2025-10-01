'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard';
import { User, Bell, Shield, Palette, Keyboard, Download } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    generationComplete: true,
    weeklyReport: false,
    darkMode: false,
    autoPlay: true,
    defaultQuality: '320',
    keyboardShortcuts: true,
    autoSave: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account</h2>
                <p className="text-sm text-gray-600">Your account information</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">{session?.user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900 mt-1">{session?.user?.name}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Manage notification preferences</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Email Notifications"
              description="Receive email updates"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <ToggleSetting
              label="Generation Complete"
              description="Notify when music generation finishes"
              checked={settings.generationComplete}
              onChange={() => handleToggle('generationComplete')}
            />
            <ToggleSetting
              label="Weekly Report"
              description="Receive weekly usage summary"
              checked={settings.weeklyReport}
              onChange={() => handleToggle('weeklyReport')}
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Palette size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-600">Customize the look and feel</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Dark Mode"
              description="Use dark theme (coming soon)"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
              disabled
            />
          </div>
        </div>

        {/* Playback */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Download size={20} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Playback & Downloads</h2>
                <p className="text-sm text-gray-600">Audio preferences</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Auto-play"
              description="Automatically play tracks when loaded"
              checked={settings.autoPlay}
              onChange={() => handleToggle('autoPlay')}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Default Download Quality
              </label>
              <select
                value={settings.defaultQuality}
                onChange={(e) => handleSelect('defaultQuality', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="128">MP3 128 kbps</option>
                <option value="320">MP3 320 kbps</option>
                <option value="wav">WAV (Lossless)</option>
                <option value="flac">FLAC (Lossless)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Keyboard */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Keyboard size={20} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-600">Power user features</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Enable Keyboard Shortcuts"
              description="Use keyboard shortcuts for navigation"
              checked={settings.keyboardShortcuts}
              onChange={() => handleToggle('keyboardShortcuts')}
            />
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all shortcuts (Press ?)
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Reset to Defaults
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block">{label}</label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
