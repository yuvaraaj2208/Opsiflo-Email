'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  GitBranch,
  BarChart2,
  Inbox,
  Settings,
  Gift,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
    icon: Mail,
  },
  {
    label: 'Prospects',
    href: '/prospects',
    icon: Users,
  },
  {
    label: 'Templates',
    href: '/templates',
    icon: FileText,
  },
  {
    label: 'Sequences',
    href: '/sequences',
    icon: GitBranch,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart2,
  },
  {
    label: 'Inbox',
    href: '/inbox',
    icon: Inbox,
    badge: true,
  },
  {
    label: 'Referral',
    href: '/referral',
    icon: Gift,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  unreadCount?: number
  isAdmin?: boolean
}

export function Sidebar({ unreadCount = 0, isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Signed out successfully')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-[#080D16] border-r border-white/5 flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-sm gradient-text whitespace-nowrap">
                Opsiflo Email
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && unreadCount > 0 && (
                <AnimatePresence>
                  {!collapsed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-indigo-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              pathname.startsWith('/admin')
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Shield className="h-4 w-4 flex-shrink-0 text-amber-400" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Admin
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full group"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 group-hover:text-red-400" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0D1321] border border-white/10 rounded-full flex items-center justify-center hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-200 z-10"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-slate-400" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-slate-400" />
        )}
      </button>
    </motion.aside>
  )
}
