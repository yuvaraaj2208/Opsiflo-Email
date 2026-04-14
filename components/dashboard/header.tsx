'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Bell, Zap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CommandPalette } from '@/components/dashboard/command-palette'
import type { Profile } from '@/types'
import Link from 'next/link'

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  campaigns: 'Campaigns',
  prospects: 'Prospects',
  templates: 'Templates',
  sequences: 'Sequences',
  analytics: 'Analytics',
  inbox: 'Inbox',
  settings: 'Settings',
  referral: 'Referral',
  admin: 'Admin',
  new: 'New',
  import: 'Import',
  billing: 'Billing',
}

const planColors = {
  free: 'secondary',
  basic: 'info',
  pro: 'purple',
  premium: 'premium',
} as const

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="h-14 border-b border-white/5 bg-[#080D16]/80 backdrop-blur-sm flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-sm flex-1">
        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1
          const href = '/' + segments.slice(0, idx + 1).join('/')
          const label = routeLabels[segment] || segment

          return (
            <div key={segment} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
              {isLast ? (
                <span className="text-slate-200 font-medium">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {label}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Command palette hint */}
      <CommandPalette />

      {/* AI usage */}
      {profile && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-white/10 rounded-lg px-2.5 py-1.5">
          <Zap className="h-3 w-3 text-indigo-400" />
          <span>AI Credits</span>
        </div>
      )}

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
      </button>

      {/* User menu */}
      {profile && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors outline-none">
            <Avatar className="h-7 w-7">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-xs font-medium text-slate-200 leading-none">
                {profile.full_name || profile.email}
              </span>
              <Badge
                variant={planColors[profile.plan]}
                className="mt-0.5 text-[10px] py-0 px-1.5 h-4"
              >
                {profile.plan === 'free' ? 'Free Trial' : profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
              </Badge>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/referral">Referral Program</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
