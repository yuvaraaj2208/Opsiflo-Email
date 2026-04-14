'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, LayoutDashboard, Mail, Users, FileText, GitBranch, BarChart2, Inbox, Settings, Gift } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const commands = [
  { label: 'Go to Dashboard', href: '/dashboard', icon: LayoutDashboard, shortcut: 'D' },
  { label: 'New Campaign', href: '/campaigns/new', icon: Mail, shortcut: 'N' },
  { label: 'View Campaigns', href: '/campaigns', icon: Mail },
  { label: 'Prospects', href: '/prospects', icon: Users },
  { label: 'Import Prospects', href: '/prospects/import', icon: Users },
  { label: 'Templates', href: '/templates', icon: FileText },
  { label: 'Sequences', href: '/sequences', icon: GitBranch },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Referral Program', href: '/referral', icon: Gift },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 text-xs text-slate-500 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors"
      >
        <Search className="h-3 w-3" />
        <span>Search...</span>
        <kbd className="ml-auto bg-white/10 rounded px-1 text-[10px]">⌘K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
            <Input
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 h-12 text-base px-0"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No commands found</p>
            ) : (
              filtered.map((cmd) => {
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.href}
                    onClick={() => handleSelect(cmd.href)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400" />
                    <span className="text-sm text-slate-300 group-hover:text-white">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="ml-auto bg-white/10 rounded px-1.5 text-xs text-muted-foreground">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
