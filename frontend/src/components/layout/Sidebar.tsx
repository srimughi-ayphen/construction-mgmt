"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-800 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-brand-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Construction</p>
            <p className="text-brand-300 text-xs">Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                'transition-colors duration-150',
                isActive
                  ? 'bg-brand-700 text-white font-medium'
                  : 'text-brand-200 hover:bg-brand-700 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-brand-700">
        <p className="text-brand-400 text-xs text-center">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </p>
      </div>
    </aside>
  );
}