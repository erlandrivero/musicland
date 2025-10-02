'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Music, 
  Folder, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CreditsBadge } from '@/components/credits';
import { UserMenu } from '@/components/auth/user-menu';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Generate', href: '/generate', icon: Sparkles },
    { name: 'My Tracks', href: '/tracks', icon: Music },
    { name: 'Projects', href: '/projects', icon: Folder },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">AI Music</span>
            </Link>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon size={20} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-sm text-gray-600 mb-2">Check music credits?</div>
            <Link
              href="/credits"
              className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Music Credits
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            {/* Search bar (desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <input
                type="search"
                placeholder="Search projects, tracks, or tags..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <CreditsBadge size="md" showRefresh />
              <UserMenu />
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden px-4 pb-3">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
